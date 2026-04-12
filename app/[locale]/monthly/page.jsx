import {redirect} from "next/navigation";

// Redirect /monthly to the latest edition
export default async function MonthlyIndex(props) {
  const params = await props.params;
  const {locale} = params;
  redirect(`/${locale}/monthly/2026/march`);
}
