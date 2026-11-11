import {test, expect} from '@playwright/test';

for (const {name, path, viewport} of [
  {name: 'portrait', path: '/vs', viewport: {width: 390, height: 844}},
  {name: 'landscape', path: '/vs', viewport: {width: 740, height: 360}},
  {name: 'Arabic RTL', path: '/ar/vs', viewport: {width: 390, height: 844}},
]) {
  test(`mobile navigation opens at the scrolled viewport: ${name}`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto(path);
    // Wait for hydration, then reproduce opening the fixed trigger far down-page.
    await expect(page.locator('.arena-submit')).toBeEnabled();
    await page.evaluate(() => window.scrollTo(0, 1200));
    const originalScroll = await page.evaluate(() => window.scrollY);
    expect(originalScroll).toBeGreaterThan(500);
    await page.locator('.navigation .nav-btn').click();
    const menu = page.locator('.mobileNavigation');
    await expect(menu).toBeVisible();
    const bounds = await menu.boundingBox();
    expect(bounds.y).toBe(0);
    expect(bounds.height).toBeLessThanOrEqual(viewport.height);
    await expect(menu.locator('.close-btn')).toBeInViewport();
    await expect(menu.locator('.items > li').first()).toBeInViewport();

    // A long menu scrolls inside the overlay, including when a submenu expands.
    await menu.locator('.profiles-link').click();
    const items = menu.locator(':scope > .items');
    await items.evaluate(n => { n.scrollTop = n.scrollHeight; });
    await expect(menu.locator('.citation-link input')).toBeInViewport();
    await items.hover();
    await page.mouse.wheel(0, 600);
    await expect(menu.locator('.close-btn')).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBe(originalScroll);
    await menu.locator('.close-btn').click();
    await expect(menu).toHaveCount(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(originalScroll);

    // Reopening starts at the first menu item rather than the old menu scroll.
    await page.locator('.navigation .nav-btn').click();
    await expect(menu.locator('.items > li').first()).toBeInViewport();
  });
}
