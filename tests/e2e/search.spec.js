import {expect, test} from "@playwright/test";
import {attachErrorWatch, goto} from "./helpers.js";

test("search results use entity identity when slugs collide", async ({page}) => {
  const watch = attachErrorWatch(page);
  const collidingResults = [
    {
      "profile_type": "person",
      "entity_id": "58980591",
      name: "Michael",
      slug: "Michael",
      "primary_meta": "SOCCER PLAYER",
      "secondary_meta": "Feira de Santana",
    },
    {
      "profile_type": "person",
      "entity_id": "59434881",
      name: "Michael",
      slug: "Michael",
      "primary_meta": "SOCCER PLAYER",
      "secondary_meta": "Poxoréu",
    },
  ];

  await page.route("**/rpc/search_hybrid*", route =>
    route.fulfill({json: collidingResults}),
  );
  await goto(page, "/");
  await page.locator(".navigation .search-btn button").click();
  await page.locator(".search-result-input input").fill("mic");

  const resultItems = page.locator(".search .results-list li");
  await expect(resultItems).toHaveCount(2);
  await expect(resultItems.getByRole("link", {name: /Michael/})).toHaveCount(2);
  watch.assertClean();
});
