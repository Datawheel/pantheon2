import {test} from "@playwright/test";
import {attachErrorWatch, expectNotFound} from "./helpers.js";

/**
 * Graceful 404 handling. Deaths pages only support years >= 2000; older/invalid
 * years must return a clean 404, NOT a 500.
 *
 * Regression: these routes used to `return new Response(...)` from the Server
 * Component for unsupported years, which crashed with
 *   "Only plain objects, and a few built-ins, can be passed to Client
 *    Components from Server Components"
 * and served HTTP 500. Fixed by calling notFound() instead.
 */
const SHOULD_404 = [
  "/profile/deaths/1950",
  "/profile/deaths/1900",
  "/profile/deaths/1999", // boundary: just below the supported range
  "/profile/deaths/1950/occupation/actor",
  "/profile/deaths/1950/country/united-states",
];

for (const path of SHOULD_404) {
  test(`unsupported route 404s gracefully: ${path}`, async ({page}) => {
    const watch = attachErrorWatch(page);
    await expectNotFound(page, path);
    watch.assertClean();
  });
}
