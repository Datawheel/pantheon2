import {redirect} from "next/navigation";

// Redirect /monthly to the latest edition
export default function MonthlyIndex({params: {locale}}) {
  redirect(`/${locale}/monthly/2026/march`);
}
