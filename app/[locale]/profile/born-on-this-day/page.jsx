import {redirect} from "next/navigation";

export const metadata = {
  title: "Famous Birthdays Today | Pantheon",
  description: "Discover which famous people were born on this day in history. Explore birthdays of celebrities, historical figures, scientists, artists, and more.",
};

export default async function Page({params: {locale}}) {
  // Get today's date in MM-DD format
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${month}-${day}`;

  // Redirect to today's date page
  const localePrefix = locale && locale !== "en" ? `/${locale}` : "";
  redirect(`${localePrefix}/profile/born-on-this-day/${todayStr}`);
}
