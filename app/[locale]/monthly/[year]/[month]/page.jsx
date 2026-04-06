import {notFound} from "next/navigation";
import {getEdition} from "/components/monthly/data/editions";
import MonthlyEdition from "/components/monthly/MonthlyEdition";

export async function generateMetadata({params: {locale, year, month}}) {
  const edition = await getEdition(year, month);
  if (!edition) return {};

  const monthName = month.charAt(0).toUpperCase() + month.slice(1);

  // Pull top 5 names for SEO-rich description
  const topNames = edition.trends
    .slice(0, 5)
    .map(t => t.title)
    .join(", ");

  const title = `Pantheon Monthly \u2014 ${monthName} ${year} | Who\u2019s Trending`;
  const description = `${edition.headline}: ${edition.subhead}. ${monthName} ${year}\u2019s biggest movers include ${topNames} and more. Explore the full ranked dataset of Wikipedia attention anomalies.`;

  const ogImage = edition.heroImage
    ? `https://pantheon.world${edition.heroImage}`
    : "https://pantheon.world/images/pantheon-share.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Pantheon",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Pantheon Monthly ${monthName} ${year} edition`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function MonthlyPage({params: {locale, year, month}}) {
  const edition = await getEdition(year, month);
  if (!edition) notFound();

  return <MonthlyEdition edition={edition} locale={locale} />;
}
