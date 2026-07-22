import Link from "next/link";
import AnchorList from "../../utils/AnchorList";
import PhotoCarousel from "../../utils/PhotoCarousel";
import SectionLayout from "../../common/SectionLayout";
import {DEFAULT_LOCALE} from "@/app/locales";
import {formatExploreYear} from "@/app/exploreTranslations";
import {getLocationTranslations} from "@/app/locationTranslations";
import {formatLocationNumber} from "@/app/utils/locationLocalization";

export default async function PeopleRanking({
  place,
  country,
  peopleBorn,
  peopleDied,
  title,
  slug,
  lang = "en",
}) {
  const t = getLocationTranslations(lang);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const newPeopleBorn = peopleBorn
    .filter(p => !p.hpi_prev)
    .sort((personA, personB) => personB.hpi - personA.hpi);
  const newPeopleDied = peopleDied
    .filter(p => !p.hpi_prev)
    .sort((personA, personB) => personB.hpi - personA.hpi);
  const birthYears = peopleBorn
    .map(person => person.birthyear)
    .filter(Number.isFinite);
  const youngestBirthyear = birthYears.length ? Math.max(...birthYears) : 0;
  const oldestBirthyear = birthYears.length ? Math.min(...birthYears) : 0;
  const moreDeaths = peopleDied.length > peopleBorn.length ? true : false;

  const topRankingBorn = peopleBorn.slice(0, 12);
  const topRankingDied = peopleDied.slice(0, 12);
  const placeQueryParamId = country
    ? `${country.id}|${place.id}`
    : `|${place.id}`;
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
          {peopleBorn.length ? (
            <span>
              {t("birthNarrative", {
                time,
                location: place.place,
                count: formatLocationNumber(peopleBorn.length, lang),
              })}{" "}
              <AnchorList
                items={peopleBorn.slice(0, 3)}
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
                count: formatLocationNumber(peopleDied.length, lang),
                location: place.place,
              })}{" "}
              <AnchorList
                items={peopleDied.slice(0, 3)}
                name={d => d.name}
                url={d => `${localePrefix}/profile/person/${d.slug}/`}
                lang={lang}
              />
              .{" "}
              {moreDeaths
                ? t("moreDeaths", {location: place.place})
                : null}
            </span>
          ) : null}
        </p>
        {topRankingBorn.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>{t("bornHeading", {location: place.place})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={topRankingBorn}
              rankAccessor="bplace_name_rank"
              peopleAll={peopleBorn}
              showOccupation={true}
              lang={lang}
              localePrefix={localePrefix}
            />
          </div>
        ) : null}
        {newPeopleBorn.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>{t("newBornHeading", {location: place.place})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={newPeopleBorn.slice(0, 12)}
              rankAccessor="bplace_name_rank"
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
              <h3>{t("diedHeading", {location: place.place})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}&placeType=deathplace`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={topRankingDied}
              rankAccessor="dplace_name_rank"
              peopleAll={peopleDied}
              showOccupation={true}
              lang={lang}
              localePrefix={localePrefix}
            />
          </div>
        ) : null}
        {newPeopleDied.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>{t("newDiedHeading", {location: place.place})}</h3>
              <Link
                href={`${localePrefix}/explore/rankings?show=people&place=${placeQueryParamId}`}
              >
                {t("goAllRankings")}
              </Link>
            </div>
            <PhotoCarousel
              people={newPeopleDied.slice(0, 12)}
              rankAccessor="dplace_name_rank"
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
