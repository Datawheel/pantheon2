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
  // Each country has its own People and RCA columns under a spanning heading.
  await expect(occupations.locator("thead th[colspan]")).toHaveText(["Germany", "Guyana"]);
  await expect(occupations.locator("thead tr").nth(1).getByRole("columnheader")).toHaveText([/^Biographies/, /^RCA/, /^Biographies/, /^RCA/]);
  const politicianCells = occupations.getByRole("row", {name: /Politicians/}).getByRole("cell");
  const [gCount, gRca, yCount, yRca] = (await politicianCells.allTextContents())
    .map(cell => Number(cell.replaceAll(",", "").replace("×", "")));
  expect(gCount).toBeGreaterThan(yCount);
  expect(gRca).toBeLessThan(yRca);
  // No people in a field: a muted zero and no ratio.
  await expect(occupations.getByRole("row", {name: /^Chemists /}).getByRole("cell").nth(2)).toHaveText("0");
  await expect(occupations.getByRole("row", {name: /^Chemists /}).getByRole("cell").nth(3)).toHaveText("—");
  // Counts link to the occupation's list in that country; empty fields don't.
  const politicians = occupations.getByRole("row", {name: /^Politicians/});
  await expect(politicians.getByRole("link", {name: "Politicians · Guyana: 12"}))
    .toHaveAttribute("href", "/profile/occupation/politician/country/guyana");
  await expect(occupations.getByRole("row", {name: /^Chemists /}).getByRole("link")).toHaveCount(1);

  // Headers sort: numbers largest first, a second click reverses, occupation goes back to A–Z.
  const firstRow = () => occupations.locator("tbody tr").first().getByRole("rowheader");
  const sortBy = n => occupations.locator("thead tr").nth(1).getByRole("button").nth(n);
  await sortBy(3).click();
  await expect(firstRow()).toHaveText("Cricketers");
  await expect(occupations.locator("thead tr").nth(1).getByRole("columnheader").nth(3)).toHaveAttribute("aria-sort", "descending");
  await sortBy(0).click();
  await expect(firstRow()).toHaveText("Politicians");
  await sortBy(0).click();
  await expect(occupations.locator("thead tr").nth(1).getByRole("columnheader").nth(0)).toHaveAttribute("aria-sort", "ascending");
  const germanCounts = (await occupations.locator("tbody tr td:first-of-type").allTextContents())
    .map(text => Number(text.replaceAll(",", "")));
  expect(germanCounts).toEqual([...germanCounts].sort((a, b) => a - b));
  await occupations.getByRole("button", {name: /Occupations/}).click();
  await expect(firstRow()).toHaveText("Actors");

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

test("occupation comparisons end with the pair in other fields, other opponents and full lists", async ({page}) => {
  await page.goto("/profile/occupation/soccer-player/country/argentina/vs/brazil");
  const more = page.locator(".vs-more");
  const tiles = more.locator(".vs-field-tile");
  await expect(tiles.first()).toHaveAttribute("href", "/profile/country/argentina/vs/brazil");
  await expect(tiles.first().locator(".vs-field-counts")).toHaveText(/^[\d,]+vs[\d,]+$/);
  // Each field tile takes its domain's pastel: athletes are sports.
  const athletes = tiles.filter({hasText: "Athletes"});
  await expect(athletes).toHaveAttribute("href", "/profile/occupation/athlete/country/argentina/vs/brazil");
  expect(await athletes.evaluate(n => getComputedStyle(n).backgroundColor)).toBe("rgb(255, 218, 222)");
  await expect(more.locator(".vs-rival-col--b .vs-rival").first()).toHaveAttribute("href", /^\/profile\/occupation\/soccer-player\/country\/.+\/vs\/.+$/);
  await expect(more.locator(".vs-more-lists a")).toHaveCount(3);
});

test("singer follow-ups distinguish count leaders for the same countries", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/profile/occupation/singer/country/argentina/vs/brazil");
  const groups = page.locator(".vs-field-group").filter({has: page.locator("h3")});
  for (const [title, sign] of [["More ranked people · Argentina", 1], ["More ranked people · Brazil", -1]]) {
    const group = groups.filter({has: page.getByRole("heading", {name: title, exact: true})});
    await expect(group).toBeVisible();
    for (const tile of await group.locator("a").all()) {
      const a = await tile.locator(".vs-field-a").innerText();
      const b = await tile.locator(".vs-field-b").innerText();
      expect(a).toMatch(/^Argentina [\d,]+$/);
      expect(b).toMatch(/^Brazil [\d,]+$/);
      const count = text => Number(text.split(" ").pop().replaceAll(",", ""));
      expect(Math.sign(count(a) - count(b))).toBe(sign);
      expect(await tile.getAttribute("href")).toMatch(/^\/profile\/occupation\/(?!singer\/)[^/]+\/country\/argentina\/vs\/brazil$/);
    }
  }
});

test("tied occupations are presented separately", async ({page}) => {
  await page.goto("/profile/occupation/painter/country/france/vs/italy");
  const group = page.locator(".vs-field-group").filter({has: page.getByRole("heading", {name: "Equal counts"})});
  await expect(group).toBeVisible();
  const tile = group.locator("a").first();
  expect((await tile.locator(".vs-field-a").innerText()).replace("France ", "")).toBe(
    (await tile.locator(".vs-field-b").innerText()).replace("Italy ", ""),
  );
});
