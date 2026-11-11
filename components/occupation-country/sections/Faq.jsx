import {DEFAULT_LOCALE} from "@/app/locales";
import {
  cap,
  formatDecimal,
  formatLifespan,
  formatList,
  formatNumber,
  formatShare,
  formatYear,
  getOcStrings,
  localizedCountryName,
} from "@/app/occupationCountryTranslations";
import "./OccupationCountry.css";

/**
 * Question/answer pairs built from the page data. Used both for the visible
 * FAQ and the FAQPage JSON-LD, so the two never drift apart.
 */
export function buildFaqItems({data, names, lang, localePrefix}) {
  const {people, standings, stats, topWoman, topLiving} = data;
  const s = getOcStrings(lang);
  const top = people[0];
  if (!top) return [];

  const fmt = n => formatNumber(n, lang);
  const params = {
    ...names,
    count: stats.count,
    countFormatted: fmt(stats.count),
    rank: stats.rank,
    totalCountries: fmt(stats.totalCountries),
    share: stats.share != null ? formatShare(stats.share, lang) : "",
    occTotal: fmt(stats.occTotal),
  };
  const items = [];

  const next = people.slice(1, 3).map(p => p.localizedName);
  items.push({
    id: "top",
    question: cap(s.faqTopQ(params)),
    answer: s.faqTopA({
      ...params,
      top: top.localizedName,
      topYears: formatLifespan(top, lang),
      topHpi: formatDecimal(top.hpi, lang),
      topLangs: fmt(top.l || 0),
      next: formatList(next, lang),
      nextCount: next.length,
    }),
  });

  if (stats.rank && stats.share != null) {
    items.push({id: "count", question: cap(s.faqCountQ(params)), answer: s.faqCountA(params)});
  }

  if (standings.length >= 2 && stats.occTotal) {
    const [leaderRow, ...rest] = standings;
    items.push({
      id: "leader",
      question: cap(s.faqLeaderQ(params)),
      answer: s.faqLeaderA({
        ...params,
        leader: localizedCountryName(leaderRow.country_data || leaderRow, lang),
        leaderCount: fmt(leaderRow.num_people),
        leaderShare: formatShare(leaderRow.num_people / stats.occTotal, lang),
        followers: formatList(
          rest.slice(0, 2).map(row => localizedCountryName(row.country_data || row, lang)),
          lang,
        ),
      }),
    });
  }

  if (topWoman && stats.count >= 3 && stats.women < stats.count) {
    items.push({
      id: "woman",
      question: cap(s.faqWomanQ(params)),
      answer: s.faqWomanA({
        woman: topWoman.localizedName,
        womanYears: formatLifespan(topWoman, lang),
        womanRank: topWoman.rank,
      }),
    });
  }

  if (topLiving && stats.count >= 3 && stats.living < stats.count) {
    items.push({
      id: "living",
      question: cap(s.faqLivingQ(params)),
      answer: s.faqLivingA({
        living: topLiving.localizedName,
        livingBorn: formatYear(topLiving.birthyear, lang),
        livingRank: topLiving.rank,
      }),
    });
  }

  items.push({
    id: "method",
    question: s.faqMethodQ,
    answer: s.faqMethodA,
    link: {href: `${localePrefix}/about/methods`, label: s.faqMethodLink},
  });

  return items;
}

export default function Faq({items, locale = DEFAULT_LOCALE}) {
  if (!items.length) return null;
  const s = getOcStrings(locale);

  return (
    <section className="profile-section oc-section oc-faq" id="faq">
      <h2 className="oc-section-title">{s.faqTitle}</h2>
      <div className="oc-faq-list">
        {items.map((item, i) => (
          <details key={item.id} className="oc-faq-item" open={i < 2}>
            <summary className="oc-faq-q">
              <h3>{item.question}</h3>
            </summary>
            <div className="oc-faq-a">
              <p>
                {item.answer}
                {item.link && (
                  <>
                    {" "}
                    <a href={item.link.href}>{item.link.label} →</a>
                  </>
                )}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
