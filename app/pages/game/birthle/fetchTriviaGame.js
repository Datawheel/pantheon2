export default async function fetchSlugs() {
  const currDate = new Date();
  return await fetch(
    `/api/trivia/getQuestionsCSV?date=${currDate.getFullYear()}-${
      currDate.getMonth() + 1
    }-${currDate.getDate()}`
  )
    .then((res) => res.json())
    // .then((data) => {
    //   return data;
    // });
}
