import { redirect } from "next/navigation";

export default async function Page({ params: { id } }) {
  const countryCandidates = [
    "united-states",
    "united-kingdom",
    "france",
    "germany",
    "italy",
    "japan",
    "russia",
    "spain",
    "brazil",
    "poland",
    "india",
    "sweden",
    "canada",
    "netherlands",
    "china",
    "austria",
    "turkey",
    "ukraine",
    "greece",
    "czechia",
    "argentina",
    "belgium",
    "australia",
    "denmark",
    "south-korea",
    "switzerland",
    "norway",
    "hungary",
    "romania",
    "croatia",
    "ireland",
    "portugal",
    "finland",
    "iran",
    "mexico",
    "serbia",
    "egypt",
    "israel",
    "south-africa",
    "slovakia",
    "uruguay",
    "belarus",
    "georgia",
    "bulgaria",
    "saudi-arabia",
    "estonia",
    "slovenia",
    "latvia",
    "colombia",
    "lithuania",
    "bosnia-and-herzegovina",
    "iraq",
    "chile",
    "new-zealand",
    "cuba",
    "nigeria",
    "peru",
    "morocco",
    "pakistan",
    "algeria",
    "syria",
    "tunisia",
    "jamaica",
    "iceland",
    "azerbaijan",
    "paraguay",
    "venezuela",
    "vietnam",
    "afghanistan",
    "armenia",
    "lebanon",
    "kenya",
    "ecuador",
    "kazakhstan",
    "thailand",
    "uzbekistan",
    "macedonia-fyrom",
    "north-korea",
    "cameroon",
    "ghana",
    "costa-rica",
    "cote-divoire",
    "indonesia",
    "montenegro",
    "senegal",
    "philippines",
    "taiwan",
    "moldova",
    "ethiopia",
    "cyprus",
    "luxembourg",
    "honduras",
    "libya",
    "haiti",
    "malta",
    "hong-kong",
    "panama",
    "trinidad-and-tobago",
    "malaysia",
    "nepal",
    "mongolia",
    "bolivia",
    "bangladesh",
    "dominican-republic",
    "kyrgyzstan",
    "guatemala",
    "angola",
    "mali",
    "congo-kinshasa",
    "albania",
    "somalia",
    "madagascar",
    "zimbabwe",
    "sri-lanka",
    "jordan",
    "uganda",
    "zambia",
    "democratic-republic-of-the-congo",
    "singapore",
    "cambodia",
    "myanmar-burma",
    "nicaragua",
    "mozambique",
    "guinea",
    "burkina-faso",
    "the-bahamas",
    "suriname",
    "tanzania",
    "sudan",
    "guadeloupe",
    "turkmenistan",
    "yemen",
    "monaco",
    "benin",
    "el-salvador",
    "burundi",
    "liberia",
    "united-arab-emirates",
    "gabon",
    "central-african-republic",
    "qatar",
    "guyana",
    "togo",
    "kuwait",
    "martinique",
    "niger",
    "tajikistan",
    "bosnia-herzegovina",
  ];
  const redirectSlug =
    countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
  redirect(`/profile/country/${redirectSlug}`);
}