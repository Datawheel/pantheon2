import Link from "next/link";
import {plural} from "pluralize";
import {FORMATTERS} from "../../utils/consts";
import {toTitleCase} from "../../utils/vizHelpers";
import AnchorList from "../../utils/AnchorList";
import PhotoCarousel from "../../utils/PhotoCarousel";
import SectionLayout from "../../common/SectionLayout";
import {getTranslations} from "/app/translations";
import {DEFAULT_LOCALE} from "/app/locales";

export default function People({
  country,
  occupation,
  people,
  title,
  slug,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const occupationPlural =
    locale === "en"
      ? plural(occupation.occupation.toLowerCase())
      : occupation.occupation;
  const occupationPluralTitle =
    locale === "en"
      ? toTitleCase(plural(occupation.occupation))
      : occupation.occupation;
  const youngestBirthyear = Math.max(...people.map(r => r.birthyear));
  const oldestBirthyear = Math.min(
    ...people.filter(p => p.birthyear).map(r => r.birthyear)
  );

  const peopleAlive = people
    .filter(p => p.alive)
    .sort((personA, personB) => personB.hpi - personA.hpi);
  const peopleDead = people
    .filter(p => !p.alive)
    .sort((personA, personB) => personB.hpi - personA.hpi);
  const peopleNew = people
    .filter(p => !p.hpi_prev)
    .sort((personA, personB) => personB.hpi - personA.hpi);
  const shareAlive = peopleAlive.length / people.length;
  const totalCountFormatted = FORMATTERS.commas(people.length);
  const aliveCountFormatted = FORMATTERS.commas(peopleAlive.length);
  const aliveShareFormatted = FORMATTERS.share(shareAlive);
  const newCountFormatted = FORMATTERS.commas(peopleNew.length);

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          {tc.peopleBase({
            totalCount: totalCountFormatted,
            demonym: country.demonym,
            occupationPlural,
            oldestYear: FORMATTERS.year(oldestBirthyear),
            youngestYear: FORMATTERS.year(youngestBirthyear),
          })}{" "}
          {tc.peopleAlive({
            totalCount: totalCountFormatted,
            aliveCount: peopleAlive.length,
            aliveCountFormatted,
            aliveShare: aliveShareFormatted,
          })}
          {peopleAlive.length ? (
            <span>
              {" "}
              {tc.peopleLivingIntro({
                demonym: country.demonym,
                occupationPlural,
              })}
              <AnchorList
                items={people.filter(p => p.alive).slice(0, 3)}
                name={d => d.name}
                url={d => `/profile/person/${d.slug}/`}
              />
              .
            </span>
          ) : null}
          {peopleDead.length ? (
            <span>
              {" "}
              {tc.peopleDeceasedIntro({
                demonym: country.demonym,
                occupationPlural,
              })}
              <AnchorList
                items={people.filter(p => !p.alive).slice(0, 3)}
                name={d => d.name}
                url={d => `/profile/person/${d.slug}/`}
              />
              .
            </span>
          ) : null}
          {peopleNew.length ? (
            <span>
              {" "}
              {tc.peopleNewIntro({
                asOfLabel: tc.peopleNewAsOf || "April 2024",
                countFormatted: newCountFormatted,
                demonym: country.demonym,
                occupationPlural,
              })}
              <AnchorList
                items={peopleNew.slice(0, 3)}
                name={d => d.name}
                url={d => `/profile/person/${d.slug}/`}
              />
              .
            </span>
          ) : null}
        </p>
        {peopleAlive.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>
                {tc.livingTitle({
                  demonym: country.demonym,
                  occupationPlural: occupationPluralTitle,
                })}
              </h3>
              <Link
                href={`/explore/rankings?show=people&occupation=${occupation.id}&place=${country.country_code}`}
              >
                {tc.goToAllRankings || "Go to all Rankings"}
              </Link>
            </div>
            <PhotoCarousel
              people={peopleAlive.slice(0, 12)}
              rankAccessor="occupation_rank_unique"
              peopleAll={peopleAlive}
            />
          </div>
        ) : null}
        {peopleDead.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>
                {tc.deceasedTitle({
                  demonym: country.demonym,
                  occupationPlural: occupationPluralTitle,
                })}
              </h3>
              <Link
                href={`/explore/rankings?show=people&occupation=${occupation.id}&place=${country.country_code}&placeType=deathplace`}
              >
                {tc.goToAllRankings || "Go to all Rankings"}
              </Link>
            </div>
            <PhotoCarousel
              people={peopleDead.slice(0, 12)}
              rankAccessor="occupation_rank_unique"
              peopleAll={peopleDead}
            />
          </div>
        ) : null}
        {peopleNew.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>
                {tc.newlyAddedTitle({
                  demonym: country.demonym,
                  occupationPlural: occupationPluralTitle,
                  yearLabel: "2025",
                })}
              </h3>
              <Link
                href={`/explore/rankings?show=people&occupation=${occupation.id}&place=${country.country_code}&new=true`}
              >
                {tc.goToAllRankings || "Go to all Rankings"}
              </Link>
            </div>
            <PhotoCarousel
              people={peopleNew.slice(0, 12)}
              rankAccessor="occupation_rank_unique"
              peopleAll={peopleNew}
            />
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}
