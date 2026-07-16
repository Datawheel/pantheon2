import {nest} from "d3-collection";
import Explore from "@/features/Explore";
import {PUBLIC_API} from "@/app/constants";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {
  localizeExploreOccupations,
  localizeExplorePlaces,
} from "@/lib/rankings";
import {getPlaces, getOccupations} from "../data";

export default async function Page({params}) {
  const {locale: requestedLocale} = await params;
  const locale = SUPPORTED_LOCALES.includes(requestedLocale)
    ? requestedLocale
    : DEFAULT_LOCALE;
  const [rawPlaces, rawOccupations] = await Promise.all([
    getPlaces(locale),
    getOccupations(locale),
  ]);
  const places = localizeExplorePlaces(rawPlaces, locale);
  const occupations = localizeExploreOccupations(rawOccupations, locale);
  const nestedPlaces = nest()
    .key(d => d.country_id)
    .entries(places)
    .map(countryData => ({
      country: countryData.values[0].country,
      cities: countryData.values,
    }))
    .filter(countryData => countryData.country);

  return (
    <div className="explore embed">
      <Explore
        baseApi={PUBLIC_API}
        places={nestedPlaces}
        occupations={occupations}
        pageType="viz"
        locale={locale}
        embed={true}
      />
    </div>
  );
}
