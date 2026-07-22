import Link from "next/link";
import AnchorList from "../../utils/AnchorList";
import PhotoCarousel from "../../utils/PhotoCarousel";
import SectionLayout from "../../common/SectionLayout";
import {DEFAULT_LOCALE} from "@/app/locales";
import {formatExploreYear} from "@/app/exploreTranslations";
import {getLocationTranslations} from "@/app/locationTranslations";
import {formatLocationNumber} from "@/app/utils/locationLocalization";

export default async function PeopleRanking({
  country,
  peopleBorn,
  peopleDied,
  title,
  slug,
  lang = "en",
}) {
  const t = getLocationTranslations(lang);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const safePeopleBorn = peopleBorn || [];
  const safePeopleDied = peopleDied || [];
  const newPeopleBorn = safePeopleBorn
    .filter(p => !p.hpi_prev)
    .sort((personA, personB) => personB.hpi - personA.hpi);
  const newPeopleDied = safePeopleDied
    .filter(p => !p.hpi_prev)
    .sort((personA, personB) => personB.hpi - personA.hpi);
  const birthYears = safePeopleBorn
    .map(person => person.birthyear)
    .filter(Number.isFinite);
  const youngestBirthyear = birthYears.length ? Math.max(...birthYears) : 0;
  const oldestBirthyear = birthYears.length ? Math.min(...birthYears) : 0;
  const moreDeaths = safePeopleDied.length > safePeopleBorn.length ? true : false;

  const topRankingBorn = safePeopleBorn.slice(0, 12);
  const topRankingDied = safePeopleDied.slice(0, 12);
  const placeQueryParamId = country.country_code || country.id;
  const time = oldestBirthyear === youngestBirthyear
    ? t("inYear", {year: formatExploreYear(oldestBirthyear, lang)})
    : t("betweenYears", {
        oldest: formatExploreYear(oldestBirthyear, lang),
        youngest: formatExploreYear(youngestBirthyear, lang),
      });

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          {safePeopleBorn.length ? (
            <span>
              {t("birthNarrative", {
                time,
                location: country.country,
                count: formatLocationNumber(safePeopleBorn.length, lang),
              })}{" "}
              <AnchorList
                items={safePeopleBorn.slice(0, 3).filter(d => d.slug)}
                name={d => d.name}
                url={d => `${localePrefix}/profile/person/${d.slug}/`}
                lang={lang}
              />
              .{" "}
            </span>
          ) : null}
          {topRankingDied.length ? (
            <span>
              {t("deathNarrative", {
                count: formatLocationNumber(safePeopleDied.length, lang),
                location: country.country,
              })}{" "}
              <AnchorList
                items={safePeopleDied.slice(0, 3).filter(d => d.slug)}
                name={d => d.name}
                url={d => `${localePrefix}/profile/person/${d.slug}/`}
                lang={lang}
              />
              .{" "}
              {moreDeaths
                ? t("moreDeaths", {location: country.country})
                : null}
            </span>
          ) : null}
        </p>
        {topRankingBorn.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>{t("bornHeading", {location: country.country})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={topRankingBorn}
              rankAccessor={"bplace_country_rank_unique"}
              peopleAll={safePeopleBorn}
              showOccupation={true}
              lang={lang}
              localePrefix={localePrefix}
            />
          </div>
        ) : null}
        {newPeopleBorn.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>{t("newBornHeading", {location: country.country})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={newPeopleBorn.slice(0, 12)}
              rankAccessor={"bplace_country_rank_unique"}
              peopleAll={newPeopleBorn}
              showOccupation={true}
              lang={lang}
              localePrefix={localePrefix}
            />
          </div>
        ) : null}
        {topRankingDied.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>{t("diedHeading", {location: country.country})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}&placeType=deathplace`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={topRankingDied}
              rankAccessor={"dplace_country_rank_unique"}
              peopleAll={safePeopleDied}
              showOccupation={true}
              lang={lang}
              localePrefix={localePrefix}
            />
          </div>
        ) : null}
        {newPeopleDied.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>{t("newDiedHeading", {location: country.country})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={newPeopleDied.slice(0, 12)}
              rankAccessor={"dplace_country_rank_unique"}
              peopleAll={newPeopleDied}
              showOccupation={true}
              lang={lang}
              localePrefix={localePrefix}
            />
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}
