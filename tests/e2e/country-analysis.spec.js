import {expect, test} from "@playwright/test";
import {placeDistribution} from "../../components/country/vs/distribution";

test("geographic concentration includes the full distribution and separates birth from death", () => {
  const places = [
    {id: 4, slug: "a", place: "A", "num_born": 1, "num_died": 8},
    {id: 1, slug: "b", place: "B", "num_born": 1, "num_died": 0},
    {id: 2, slug: "c", place: "C", "num_born": 1, "num_died": 0},
    {id: 3, slug: "d", place: "D", "num_born": 1, "num_died": 0},
    {id: 5, slug: "country", place: "Country", "num_born": 80, "num_died": 7},
    {id: 6, slug: null, place: null, "num_born": 22, "num_died": 1},
  ];
  const births = placeDistribution(places, "num_born", "country");
  expect(births).toMatchObject({total: 4, effective: 4, distinct: 4});
  expect(births.top.map(p => p.id)).toEqual([1, 2, 3]);
  expect(births.top[0].share).toBe(.25);
  expect(placeDistribution(places, "num_died", "country")).toMatchObject({
    total: 8, effective: 1, distinct: 1, top: [{share: 1}],
  });
  expect(placeDistribution([], "num_born", "country")).toEqual({total: 0, distinct: 0, effective: null, top: []});
});

test("Germany and Guyana show independent occupation rankings and comparable place shares", async ({page}) => {
  await page.goto("/profile/country/germany/vs/guyana");
  const occupations = page.locator("#occupation-comparison");
  const guyanaCounts = occupations.locator(".analysis-block").first().locator(".analysis-panel").last();
  const guyanaRca = occupations.locator(".analysis-block").last().locator(".analysis-panel").last();
  await expect(guyanaCounts.locator("li").first()).toContainText("Politicians");
  const cricket = guyanaRca.locator("li").first();
  await expect(cricket).toContainText("Cricketers");
  await expect(cricket.locator(".analysis-value small")).toHaveText("1 / 29");
  await expect(cricket.locator(".analysis-value strong")).toHaveText("20.7×");
  await expect(cricket.getByRole("link", {name: "Cricketers"}))
    .toHaveAttribute("href", "/profile/occupation/cricketer/country/guyana");
  await expect(cricket.locator(".analysis-people").getByRole("link"))
    .toHaveAttribute("href", "/profile/person/Shivnarine_Chanderpaul");
  // Top three by HPI, capped by how many people the occupation has.
  await expect(guyanaCounts.locator(".analysis-list > li").first().locator(".analysis-people li")).toHaveCount(3);
  await expect(guyanaCounts.locator(".analysis-list > li").nth(3).locator(".analysis-people li")).toHaveCount(2);
  const summary = occupations.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  const politicianCells = occupations.getByRole("row", {name: /Politicians/}).getByRole("cell");
  const [germany, guyana] = await politicianCells.allTextContents();
  const unpack = cell => cell.replaceAll(",", "").replace("×", "").split(" · ").map(Number);
  const [gCount, gRca] = unpack(germany);
  const [yCount, yRca] = unpack(guyana);
  expect(gCount).toBeGreaterThan(yCount);
  expect(gRca).toBeLessThan(yRca);
  await expect(occupations.getByRole("row", {name: /^Chemists /}).getByRole("cell").last()).toHaveText("0 · 0×");

  const geography = page.locator("#place-comparison");
  const births = geography.locator(".analysis-block").first();
  // Germany spans multiple API pages. A truncated first page undercounts the places.
  const distinctGermany = await births.locator(".place-stats").first().locator("dd").nth(1).textContent();
  expect(Number(distinctGermany.replaceAll(",", ""))).toBeGreaterThan(1000);
  const leadingPlace = block => block.locator(".analysis-panel").last().locator("li").first();
  await expect(leadingPlace(births).getByRole("link")).toHaveAttribute("href", "/profile/place/georgetown-guyana");
  await expect(leadingPlace(births).locator("small")).toHaveText("15 / 29");
  await expect(births.locator(".place-peak strong")).toHaveText("Guyana (52%)");
  const deaths = geography.locator(".analysis-block").last();
  await expect(deaths.locator(".place-peak strong")).toHaveText("Guyana (75%)");
  await expect(leadingPlace(deaths).locator("small")).toHaveText("3 / 4");
  await expect(leadingPlace(deaths).locator("strong")).toHaveText("75%");
});
