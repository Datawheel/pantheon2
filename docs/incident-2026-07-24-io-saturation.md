# Incident report — 2026-07-24 disk-I/O saturation outage (~11:33–12:23 EDT)

## Summary
pantheon.world was effectively down/degraded for ~50 minutes (worst ~11:35–12:20 EDT).
Root cause was **disk-I/O saturation of the single rotational HDD (`/dev/sda`) that hosts
everything** — Postgres, the Next.js `.next/cache` fetch-cache, ClickHouse, and logs. A
heavy crawler load (bots are ~50% of traffic today) pushed random-write IOPS past the
HDD's ceiling; iowait pinned at 70%, load hit ~112, Node event loops blocked on cache I/O,
and nginx's accept backlog overflowed. It was **not** a network flap (unlike 07-11 / 07-19)
and **not** the CPU/matview starvation of 07-19 — the DB was fine; the spindle was the wall.

## Timeline (EDT)
| Time | State |
|------|-------|
| ≤11:30 | Normal. req ~7–16k/min, sda ~30% util, load ~10 |
| 11:33 | Onset — req/min collapses (11:33 tot=2088, 11:34=769) |
| 11:35 | Near-total blackout (tot=**3** for the minute); 11:38 no requests logged at all |
| 11:36–12:23 | Erratic degradation: sda **98% util sustained**, await 50–55ms, aqu-sz ~14, iowait 65–70%, load 100–112, 9–12 procs blocked in D-state. 504s (upstream timeout) + 499s (client abandon) throughout. Kernel logs "Possible SYN flooding on :443, sending cookies" (accept-queue overflow) at 11:40 & 11:46 |
| 12:24 | Recovery — req/min jumps 1523→4950→5334, iowait drops, load falls to ~12 by 12:30 |

Per-hour error counts (nginx): hour 11 = **12,810×499 + 196×504**; hour 12 = 6,074×499 + 117×504 (vs <5k 499 and ~0 504 in normal hours). Total volume for those hours fell to 273k/163k vs ~817k the hour before — the classic congestion-collapse shape (throughput *drops*).

## Evidence
- `sar -d` (sa24): `sda` %util 30→84→**98→98→98**, await 21→50→55ms, aqu-sz 3.5→14. `sdb` and `nvme0n1` = **0.00 the entire time** (idle).
- `sar -b`: writes dominate (~5–17 MB/s at ~250 tps → small random writes), reads low (all cached). `kbdirty` tripled 158k→666k (writeback couldn't keep up).
- No swapping (`pswpin/out`=0), 74 GB page cache, 18% mem used → not memory pressure.
- No carrier/link/NetworkManager events in the journal → not a network flap.
- Postgres log nearly empty during the window → DB queries were fine; bottleneck was shared disk.
- `pidstat -d` (live): `next-server` processes are the continuous disk writers (fetch-cache).
- Live `iostat` **at idle load ~10**: `sda` already at **89.6% util**, w_await 30ms — the box permanently runs on the edge of I/O saturation.

## Why it tipped: the crawler amplifier
Bot traffic today (partial day) — **~50% of all requests**:

| Crawler | Requests today |
|---------|---------------|
| **Bytespider (ByteDance)** | **1,357,604** |
| ClaudeBot | 535,731 |
| Googlebot | 301,218 |
| Amazonbot | 160,997 |
| meta-externalagent | 77,998 |
| bingbot | 66,878 |
| GPTBot | 60,230 |
| AhrefsBot | 57,156 |
| others | ~10k |

`app/robots.js` currently serves `User-Agent: * / Allow: /` — **no crawl-delay, no limits**.
Crawlers enumerate `/{locale}/profile/person/*` across all 13 locales; each is an *uncached*
SSR render that writes several new `fetch-cache` files (2.6 GB / ~392k files) + WAL to the
HDD. This is the exact same crawl shape that caused the 07-19 CPU incident — same disease,
different bottleneck (indexes fixed the CPU side on 07-19; the I/O side was never addressed).

## The structural problem
- Only fast storage on the box is `nvme0n1` (931 GB SSD) — but it is **mounted read-only at
  `/mnt/nvme-check` holding a stale Ubuntu 4.15 root image** (kernel from 2019–2022). 269 GB free.
- `sdb` (1.8 TB) is a second HDD, currently unmounted/idle — also rotational, ~200 IOPS, won't help.
- So the entire ~6M-req/day site runs its DB + regenerable web cache + logs off a **single
  7200-rpm HDD (~150–250 random IOPS)**, while the one SSD sits unused.

## Applied fixes (2026-07-24 afternoon)
- **P0 DONE ~15:24 EDT** — `app/robots.js` now `Disallow: /` for Bytespider, Amazonbot,
  ClaudeBot, GPTBot, meta-externalagent, AhrefsBot, SemrushBot, PerplexityBot (Googlebot/
  bingbot + all others still allowed). Committed to master `d36bb12`, built, staggered-restarted
  all 12 instances, verified live on ports 3000/3006/3011.
- **P1 (fetch-cache) DONE ~15:33 EDT** — mounted a dedicated 12 GB tmpfs at
  `.next/cache/fetch-cache` (`rw,nosuid,nodev,noatime,size=12G,nr_inodes=4m,mode=0755,uid=1000,gid=1000`),
  persisted in `/etc/fstab`. Zero downtime (live mount over active dir). RESULT (20s avg, similar
  load ~13): **sda %util ~90% → 32%, w_await 30 → 18 ms, aqu-sz 11.8 → 1.6**. fetch-cache writes
  now in RAM; Postgres WAL/checkpoints remain the residual sda writer. Note: old 2.8 GB of cache
  files sit hidden under the mount on sda (cosmetic; reclaimable via umount+delete).

## Recommended patches (ranked by leverage ÷ risk)

### P0 — Immediate, low risk (throttle the write source)  [DONE]
1. **Block/throttle abusive crawlers.** Bytespider alone is 1.36M req/day and frequently
   ignores robots.txt. Add to `app/robots.js`: `Disallow: /` for `Bytespider`,
   `meta-externalagent`, `GPTBot`, `Amazonbot`, `AhrefsBot`, `SemrushBot` (or `Crawl-delay: 10`),
   and/or an nginx `limit_req`/`map $http_user_agent` throttle for bot UAs. Cuts uncached-render
   write pressure immediately. (SEO-affecting → get Alex's sign-off on which bots.)

### P1 — High leverage (move writes off the HDD)
2. **Relocate `.next/cache` to fast storage.** It is fully regenerable, so durability doesn't
   matter — ideal for either:
   - a **tmpfs** mount (box has 67 GB available RAM; cache peaks ~3.4 GB) — eliminates those
     disk writes entirely, survives fine because the cache is disposable; **or**
   - the **NVMe** once reclaimed. This single change removes the dominant random-write source
     from `sda`.
3. **Reclaim the NVMe.** Confirm the `/mnt/nvme-check` 4.15 image is a dead rescue copy, then
   repurpose the 931 GB SSD read-write and move Postgres data dir (or at minimum `pg_wal`) +
   `.next/cache` onto it. Turns ~200 IOPS into ~100k+. Highest structural payoff; needs a
   maintenance window and Alex's go-ahead.

### P2 — Reduce per-render disk dependency / resilience
4. **Cut fetch-cache churn:** raise fetch `revalidate` TTLs where correctness allows, and
   reduce the number of per-render PostgREST fetches on the person-profile page (each fetch = a
   cache file write). Fewer, longer-lived cache entries = fewer writes and fewer purge deletes.
5. **Gentler purge:** the `*/10` `find … -mmin +60 -delete` dueling with crawler-driven creates
   makes metadata write storms worse on an HDD. Once cache is on tmpfs/NVMe this is moot.
6. **nginx**: keep `limit_conn`/`limit_req` zones so a future I/O stall sheds load (returns 503
   fast) instead of letting the accept queue overflow into SYN-cookie territory.

### Also found (not the cause, worth fixing)
- Postgres logging `ERROR: invalid input syntax for type bigint: "CONDUCTOR"` — a PostgREST
  query passing an occupation **slug** into a `person.id = ANY($2)` **bigint** array. Real bug,
  produces 500s on some code path. Separate ticket.
- SMART health of `sda` was not readable without sudo — worth a `smartctl -H /dev/sda` check;
  await 14–30ms is normal-for-loaded-HDD, but a 7200-rpm disk carrying this whole workload is a
  reliability risk regardless.

## One-line takeaway
The site is running a 6M-req/day database + web cache off a single saturated HDD with an idle
SSD next to it. Crawlers (Bytespider especially) are the recurring trigger; storage is the
standing vulnerability. Fix order: throttle bots (today) → move `.next/cache` to tmpfs/NVMe →
reclaim the NVMe for Postgres.
