/* eslint react/display-name: 0 */
import React from "react";
import {Info} from "lucide-react";
import {
  formatExploreNumber,
  formatExploreYear,
  getExploreTranslations,
} from "@/app/exploreTranslations";
import {localizePath} from "@/app/utils/hreflang";
import SimpleTooltip from "../../common/SimpleTooltip";
import AnchorList from "../../utils/AnchorList";
import PersonImage from "../../utils/PersonImage";

const genderOrder = ["M", null, "F", "Non-binary"];

function formatBirthday(birthyear, birthmonth, birthday, locale, t) {
  if (!birthyear) return t("unknown");
  if (!birthmonth || !birthday) return formatExploreYear(birthyear, locale);
  const date = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, birthmonth - 1, birthday)));
  return `${date} ${formatExploreYear(birthyear, locale)}`;
}

function tooltipHeader(content, label) {
  return () => (
    <SimpleTooltip className="table-tooltip-trigger" content={content}>
      <div>
        {label} <Info size={10} />
      </div>
    </SimpleTooltip>
  );
}

function metricColumns(t, locale) {
  const compact = value => formatExploreNumber(value || 0, locale, {
    notation: "compact",
    maximumFractionDigits: 2,
  });
  const decimal = value => formatExploreNumber(value || 0, locale, {
    maximumFractionDigits: 2,
  });
  return [
    {
      header: tooltipHeader(t("historicalPopularityIndex"), "HPI 2022"),
      accessorKey: "hpi",
      cell: info => compact(info.getValue()),
      minSize: 55,
      className: "cell_numeric",
      sortDescFirst: true,
    },
    {
      header: tooltipHeader(
        t("averageHistoricalPopularityIndex"),
        `${t("average")} HPI`,
      ),
      accessorKey: "avg_hpi",
      cell: info => decimal(info.getValue()),
      minSize: 55,
      className: "cell_numeric",
      sortDescFirst: true,
    },
    {
      header: tooltipHeader(t("languageEditionCount"), "L"),
      accessorKey: "langs",
      cell: info => formatExploreNumber(info.getValue() || 0, locale),
      minSize: 55,
      className: "cell_numeric",
      sortDescFirst: true,
    },
    {
      header: tooltipHeader(
        t("averageLanguageEditionCount"),
        `${t("average")} L`,
      ),
      accessorKey: "avg_langs",
      cell: info => decimal(info.getValue()),
      minSize: 55,
      className: "cell_numeric",
      sortDescFirst: true,
    },
    {
      header: t("topThree"),
      accessorKey: "top_ranked",
      cell: info => (
        <AnchorList
          items={info.getValue()}
          name={person => person.name}
          url={person => localizePath(locale, `/profile/person/${person.slug}/`)}
          noAnd
        />
      ),
    },
  ];
}

function rowNumberColumn(countOffset) {
  return {
    enableSorting: false,
    header: "#",
    id: "row",
    accessorFn: (_datum, index) => index + 1 + countOffset,
    maxSize: 45,
  };
}

function aggregateColumns(show, nesting, countOffset, t, locale) {
  const columns = [rowNumberColumn(countOffset)];

  if (show === "occupations" && nesting === "occupations") {
    columns.push({
      header: t("occupation"),
      accessorKey: "name",
      style: {whiteSpace: "unset"},
      cell: info => (
        <a href={localizePath(locale, `/profile/occupation/${info.row.original.slug}`)}>
          {info.getValue()}
        </a>
      ),
    });
  }
  if (show === "occupations" && nesting !== "domains") {
    columns.push({header: t("industry"), accessorKey: "industry"});
  }
  if (show === "occupations") {
    columns.push({header: t("domain"), accessorKey: "domain"});
  }

  if (show === "places" && nesting === "countries") {
    columns.push({
      header: t("country"),
      accessorKey: "country_name",
      style: {whiteSpace: "unset"},
      cell: info => (
        <a href={localizePath(locale, `/profile/country/${info.row.original.country_slug}`)}>
          {info.getValue()}
        </a>
      ),
    });
  }
  if (show === "places" && nesting === "places") {
    columns.push(
      {
        header: t("city"),
        accessorKey: "name",
        style: {whiteSpace: "unset"},
        cell: info => info.row.original.count > 15 ? (
          <a href={localizePath(locale, `/profile/place/${info.row.original.slug}`)}>
            {info.getValue()}
          </a>
        ) : info.getValue(),
      },
      {
        header: t("country"),
        accessorKey: "country_name",
        style: {whiteSpace: "unset"},
        cell: info => (
          <a href={localizePath(locale, `/profile/country/${info.row.original.country_slug}`)}>
            {info.getValue()}
          </a>
        ),
      },
    );
  }

  columns.push({
    header: t("people"),
    accessorKey: "count",
    minSize: 60,
    className: "cell_numeric",
  });
  return columns.concat(metricColumns(t, locale));
}

function peopleColumns(countOffset, options, t, locale) {
  const decimal = value => formatExploreNumber(value || 0, locale, {
    maximumFractionDigits: 2,
  });
  const compact = value => formatExploreNumber(value || 0, locale, {
    notation: "compact",
    maximumFractionDigits: 2,
  });
  const rankDeltaCell = info => {
    const value = info.getValue();
    if (!value) return "-";
    return value > 0 ? (
      <span className="u-positive-text u-positive-arrow">{`+${value}`}</span>
    ) : (
      <span className="u-negative-text u-negative-arrow">{value}</span>
    );
  };

  return [
    {
      header: t("info"),
      columns: [
        {
          enableSorting: false,
          header: "#",
          id: "row",
          accessorFn: options.nameSearch
            ? datum => datum.rank
            : (_datum, index) => index + 1 + countOffset,
          maxSize: 45,
        },
        {
          enableSorting: false,
          header: "",
          accessorKey: "id",
          cell: info => (
            <PersonImage
              person={info.row.original}
              className="ranking-thumbnail"
              src={`/profile/people/${info.getValue()}.jpg`}
              fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
            />
          ),
          maxSize: 70,
        },
        {
          header: t("name"),
          accessorKey: "name",
          style: {whiteSpace: "unset"},
          cell: info => (
            <a href={localizePath(locale, `/profile/person/${info.row.original.slug}`)}>
              {info.getValue()}
            </a>
          ),
        },
        {
          id: "occupation_id",
          header: t("occupation"),
          accessorFn: datum => datum.occupation?.occupation || null,
          cell: info => {
            const occupation = info.row.original.occupation;
            return info.getValue() ? (
              <a href={localizePath(locale, `/profile/occupation/${occupation.occupation_slug}`)}>
                {info.getValue()}
              </a>
            ) : <span>-</span>;
          },
        },
        {
          header: t("birth"),
          accessorKey: "birthyear",
          cell: info => options.hasBirthdayFilter
            ? formatBirthday(
                info.getValue(),
                info.row.original.birthmonth,
                info.row.original.birthday,
                locale,
                t,
              )
            : info.getValue()
              ? formatExploreYear(info.getValue(), locale)
              : t("unknown"),
          minSize: options.hasBirthdayFilter ? 90 : 50,
        },
        {
          header: t("death"),
          accessorKey: "deathyear",
          cell: info => info.getValue()
            ? formatExploreYear(info.getValue(), locale)
            : "-",
          minSize: 45,
        },
        {
          header: t("gender"),
          accessorKey: "gender",
          cell: info => info.getValue() === "M"
            ? t("male")
            : info.getValue() === "F"
              ? t("female")
              : t("nonBinary"),
          minSize: 65,
          sortingFn: (rowA, rowB, columnId) => {
            const aIndex = genderOrder.indexOf(rowA.getValue(columnId));
            const bIndex = genderOrder.indexOf(rowB.getValue(columnId));
            return bIndex < aIndex ? -1 : bIndex > aIndex ? 1 : 0;
          },
        },
      ],
    },
    {
      header: t("birthplace"),
      columns: [
        {
          id: "bplace_geonameid",
          header: t("city"),
          style: {whiteSpace: "unset"},
          accessorFn: datum => datum.bplace_geonameid?.place || null,
          cell: info => info.getValue() ? (
            <a href={localizePath(locale, `/profile/place/${info.row.original.bplace_geonameid.slug}`)}>
              {info.getValue()}
            </a>
          ) : <span>-</span>,
        },
        {
          id: "bplace_country",
          header: t("country"),
          style: {whiteSpace: "unset"},
          accessorFn: datum => datum.bplace_country?.country || null,
          cell: info => info.getValue() ? (
            <a href={localizePath(locale, `/profile/country/${info.row.original.bplace_country.slug}`)}>
              {info.getValue()}
            </a>
          ) : <span>-</span>,
        },
      ],
    },
    {
      header: t("deathplace"),
      columns: [
        {
          id: "dplace_geonameid",
          header: t("city"),
          style: {whiteSpace: "unset"},
          accessorFn: datum => datum.dplace_geonameid?.place || null,
          cell: info => info.getValue() ? (
            <a href={localizePath(locale, `/profile/place/${info.row.original.dplace_geonameid.slug}`)}>
              {info.getValue()}
            </a>
          ) : <span>-</span>,
        },
        {
          id: "dplace_country",
          header: t("country"),
          style: {whiteSpace: "unset"},
          accessorFn: datum => datum.dplace_country?.country || null,
          cell: info => info.getValue() ? (
            <a href={localizePath(locale, `/profile/country/${info.row.original.dplace_country.slug}`)}>
              {info.getValue()}
            </a>
          ) : <span>-</span>,
        },
      ],
    },
    {
      header: t("stats"),
      columns: [
        {
          header: tooltipHeader(t("wikipediaLanguageEditions"), "L"),
          accessorKey: "l",
          minSize: 105,
          className: "cell_numeric",
          headerClassName: "nowrap",
          sortDescFirst: true,
        },
        {
          header: tooltipHeader(t("effectiveWikipediaLanguageEditions"), "L*"),
          accessorKey: "l_",
          cell: info => decimal(info.getValue()),
          minSize: 105,
          className: "cell_numeric",
          headerClassName: "nowrap",
          sortDescFirst: true,
        },
        {
          header: tooltipHeader(t("nonEnglishPageviews"), "PVne"),
          accessorKey: "non_en_page_views",
          cell: info => compact(info.getValue()),
          size: 105,
          headerClassName: "nowrap",
          sortDescFirst: true,
        },
        {
          header: tooltipHeader(t("pageviewVariation"), "CV"),
          accessorKey: "coefficient_of_variation",
          cell: info => decimal(info.getValue()),
          minSize: 105,
          className: "cell_numeric",
          headerClassName: "nowrap",
          sortDescFirst: true,
        },
        ...[2025, 2024].map((year, index) => ({
          header: tooltipHeader(t("historicalPopularityIndex"), `HPI ${year}`),
          accessorKey: index ? "hpi_prev" : "hpi",
          cell: info => info.getValue() ? decimal(info.getValue()) : "-",
          minSize: 105,
          className: "cell_numeric",
          sortDescFirst: true,
        })),
        {
          header: t("rankYear", {year: 2025}),
          accessorKey: "rank",
          minSize: 45,
          className: "cell_numeric",
        },
        {
          header: t("rankYear", {year: 2024}),
          accessorKey: "rank_prev",
          minSize: 45,
          className: "cell_numeric",
        },
        {
          header: "∆",
          accessorKey: "rank_delta",
          minSize: 45,
          className: "cell_numeric",
          cell: rankDeltaCell,
        },
      ],
    },
  ];
}

export default function getColumns(
  show,
  nesting,
  countOffset,
  options = {},
  locale = "en",
) {
  const t = getExploreTranslations(locale);
  return show === "people"
    ? peopleColumns(countOffset, options, t, locale)
    : aggregateColumns(show, nesting, countOffset, t, locale);
}
