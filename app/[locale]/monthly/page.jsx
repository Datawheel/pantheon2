import {redirect} from "next/navigation";
import {getAllEditionKeys} from "@/components/monthly/data/editions";

const MONTH_SLUGS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Redirect /monthly to the latest available edition
export default async function MonthlyIndex(props) {
  const params = await props.params;
  const {locale} = params;

  const keys = await getAllEditionKeys();
  const latest = keys[keys.length - 1] || "2026-05";
  const [year, monthNum] = latest.split("-");
  const month = MONTH_SLUGS[Number(monthNum) - 1];

  redirect(`/${locale}/monthly/${year}/${month}`);
}
