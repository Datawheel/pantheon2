export default async function fetchSlugs() {
  const currDate = new Date();
  return await fetch(
    `/api/indexes?date=${currDate.getFullYear()}-${
      currDate.getMonth() + 1
    }-${currDate.getDate()}`
  )
    .then(res => res.json())
    .then(data => [data["1"], data["2"], data["3"], data["4"], data["5"]]);
}
