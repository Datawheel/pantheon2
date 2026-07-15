-- =============================================================================
-- recompute-totals.sql
-- -----------------------------------------------------------------------------
-- Recomputes the pre-computed aggregate columns on core.country, core.place and
-- core.occupation directly from core.person + core.person_hpi (yr = 2025), then
-- refreshes the materialized views that depend on that data.
--
-- These columns drift out of sync whenever core.person is updated (people added,
-- removed, or their birth/death place / occupation / gender changed). Run this on
-- a schedule (e.g. nightly / after each person import) to bring them back in line.
--
-- The whole thing runs in one transaction and is idempotent: re-running it always
-- produces the same result and zeroes-out places/occupations that no longer have
-- any people.
--
-- Semantics (confirmed 2026-07-15):
--   * num_born / num_died          = headcount from core.person (ALL people born /
--                                    died there, whether or not they have a 2025
--                                    person_hpi row)
--   * hpi     / hpi_died           = SUM(person_hpi.hpi) over that cohort (yr 2025)
--   * l       / l_died             = AVG(person_hpi.l)   over that cohort (yr 2025)
--   * occupation.hpi_avg           = AVG(person_hpi.hpi) over the occupation cohort
--   * born_rank / died_rank        = dense_rank by num_born / num_died DESC
--   * *_rank_unique                = row_number by num_born / num_died DESC (id tiebreak)
--   * ranks are NULL for rows with a 0 count
--   * gender 'M' = men, 'F' = women (occupation.num_born_men / num_born_women)
--
-- To change the ranking key to HPI instead of headcount, swap the ORDER BY in the
-- rank CTEs (e.g. ORDER BY hpi DESC NULLS LAST).
-- =============================================================================

\set ON_ERROR_STOP on

BEGIN;

SET LOCAL statement_timeout = 0;

-- =============================================================================
-- COUNTRY
-- =============================================================================
WITH born AS (
  SELECT p.bplace_country            AS cid,
         count(*)                    AS num_born,
         sum(h.hpi)                  AS hpi,
         avg(h.l)                    AS l
  FROM core.person p
  LEFT JOIN core.person_hpi h ON h.person_id = p.id AND h.yr = 2025
  WHERE p.bplace_country IS NOT NULL
  GROUP BY p.bplace_country
),
died AS (
  SELECT p.dplace_country            AS cid,
         count(*)                    AS num_died,
         sum(h.hpi)                  AS hpi_died,
         avg(h.l)                    AS l_died
  FROM core.person p
  LEFT JOIN core.person_hpi h ON h.person_id = p.id AND h.yr = 2025
  WHERE p.dplace_country IS NOT NULL
  GROUP BY p.dplace_country
)
UPDATE core.country c
SET num_born = COALESCE(b.num_born, 0),
    hpi      = b.hpi,
    l        = b.l,
    num_died = COALESCE(d.num_died, 0),
    hpi_died = d.hpi_died,
    l_died   = d.l_died
FROM core.country cc
LEFT JOIN born b ON b.cid = cc.id
LEFT JOIN died d ON d.cid = cc.id
WHERE c.id = cc.id;

WITH ranks AS (
  SELECT id,
         CASE WHEN num_born > 0
              THEN dense_rank() OVER (ORDER BY num_born DESC) END          AS born_rank,
         CASE WHEN num_born > 0
              THEN row_number() OVER (ORDER BY num_born DESC, id) END       AS born_rank_unique,
         CASE WHEN num_died > 0
              THEN dense_rank() OVER (ORDER BY num_died DESC) END           AS died_rank,
         CASE WHEN num_died > 0
              THEN row_number() OVER (ORDER BY num_died DESC, id) END       AS died_rank_unique
  FROM core.country
)
UPDATE core.country c
SET born_rank        = r.born_rank,
    born_rank_unique = r.born_rank_unique,
    died_rank        = r.died_rank,
    died_rank_unique = r.died_rank_unique
FROM ranks r
WHERE c.id = r.id;

-- =============================================================================
-- PLACE   (join on geonameid)
-- =============================================================================
WITH born AS (
  SELECT p.bplace_geonameid          AS pid,
         count(*)                    AS num_born,
         sum(h.hpi)                  AS hpi,
         avg(h.l)                    AS l
  FROM core.person p
  LEFT JOIN core.person_hpi h ON h.person_id = p.id AND h.yr = 2025
  WHERE p.bplace_geonameid IS NOT NULL
  GROUP BY p.bplace_geonameid
),
died AS (
  SELECT p.dplace_geonameid          AS pid,
         count(*)                    AS num_died,
         sum(h.hpi)                  AS hpi_died,
         avg(h.l)                    AS l_died
  FROM core.person p
  LEFT JOIN core.person_hpi h ON h.person_id = p.id AND h.yr = 2025
  WHERE p.dplace_geonameid IS NOT NULL
  GROUP BY p.dplace_geonameid
)
UPDATE core.place pl
SET num_born = COALESCE(b.num_born, 0),
    hpi      = b.hpi,
    l        = b.l,
    num_died = COALESCE(d.num_died, 0),
    hpi_died = d.hpi_died,
    l_died   = d.l_died
FROM core.place pp
LEFT JOIN born b ON b.pid = pp.id
LEFT JOIN died d ON d.pid = pp.id
WHERE pl.id = pp.id;

WITH ranks AS (
  SELECT id,
         CASE WHEN num_born > 0
              THEN dense_rank() OVER (ORDER BY num_born DESC) END          AS born_rank,
         CASE WHEN num_born > 0
              THEN row_number() OVER (ORDER BY num_born DESC, id) END       AS born_rank_unique,
         CASE WHEN num_died > 0
              THEN dense_rank() OVER (ORDER BY num_died DESC) END           AS died_rank,
         CASE WHEN num_died > 0
              THEN row_number() OVER (ORDER BY num_died DESC, id) END       AS died_rank_unique
  FROM core.place
)
UPDATE core.place pl
SET born_rank        = r.born_rank,
    born_rank_unique = r.born_rank_unique,
    died_rank        = r.died_rank,
    died_rank_unique = r.died_rank_unique
FROM ranks r
WHERE pl.id = r.id;

-- =============================================================================
-- OCCUPATION   (join on person.occupation = occupation.id; no rank columns)
-- =============================================================================
WITH agg AS (
  SELECT p.occupation                                AS oid,
         count(*)                                    AS num_born,
         count(*) FILTER (WHERE p.gender = 'M')      AS num_born_men,
         count(*) FILTER (WHERE p.gender = 'F')      AS num_born_women,
         sum(h.hpi)                                  AS hpi,
         avg(h.l)                                    AS l,
         avg(h.hpi)                                  AS hpi_avg
  FROM core.person p
  LEFT JOIN core.person_hpi h ON h.person_id = p.id AND h.yr = 2025
  WHERE p.occupation IS NOT NULL
  GROUP BY p.occupation
)
UPDATE core.occupation o
SET num_born       = COALESCE(a.num_born, 0),
    num_born_men   = COALESCE(a.num_born_men, 0),
    num_born_women = COALESCE(a.num_born_women, 0),
    hpi            = a.hpi,
    l              = a.l,
    hpi_avg        = a.hpi_avg
FROM core.occupation oo
LEFT JOIN agg a ON a.oid = oo.id
WHERE o.id = oo.id;

COMMIT;

-- =============================================================================
-- MATERIALIZED VIEWS
-- -----------------------------------------------------------------------------
-- person_ranks and occupation_country are derived from the same person data and
-- go stale on the same updates, so refresh them here too.
--
-- REFRESH ... CONCURRENTLY avoids locking the live site but REQUIRES a unique
-- index on each view. The one-time setup below creates those indexes; once they
-- exist every future run can use the CONCURRENTLY form. Run it once, then keep
-- using the CONCURRENTLY refreshes on the schedule.
--
--   -- one-time setup (safe to re-run; IF NOT EXISTS):
--   CREATE UNIQUE INDEX IF NOT EXISTS person_ranks_id_uidx
--     ON core.person_ranks (id);
--   CREATE UNIQUE INDEX IF NOT EXISTS occupation_country_uidx
--     ON core.occupation_country (country, occupation);
--
-- CONCURRENTLY cannot run inside a transaction block, so these are outside the
-- COMMIT above and each runs on its own.
-- =============================================================================

-- REFRESH MATERIALIZED VIEW CONCURRENTLY core.person_ranks;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY core.occupation_country;

-- If the unique indexes above have NOT been created yet, comment out the two
-- CONCURRENTLY lines and use these blocking equivalents instead (brief read lock):
--   REFRESH MATERIALIZED VIEW core.person_ranks;
--   REFRESH MATERIALIZED VIEW core.occupation_country;
