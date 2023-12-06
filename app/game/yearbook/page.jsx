import { redirect } from "next/navigation";

export default async function Page({ params: { id } }) {
  const years = [];
  for (let year = 1900; year <= 2020; year++) {
    years.push(year);
  }
  const redirectYear = years[Math.floor(Math.random() * years.length)];
  redirect(`/game/yearbook/${redirectYear}`);
}
