import {redirect} from "next/navigation";

export default async function Page() {
  const eraCandidates = [
    "scribal",
    "printing",
    "newspaper",
    "radio_and_film",
    "television",
    "personal_computer",
  ];
  const redirectSlug =
    eraCandidates[Math.floor(Math.random() * eraCandidates.length)];
  redirect(`/profile/era/${redirectSlug}`);
}
