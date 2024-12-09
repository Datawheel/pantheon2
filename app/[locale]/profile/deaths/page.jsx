import {redirect} from "next/navigation";

export default async function Page() {
  const yearCandidates = ["2024"];
  const redirectSlug =
    yearCandidates[Math.floor(Math.random() * yearCandidates.length)];
  redirect(`/profile/deaths/${redirectSlug}`);
}
