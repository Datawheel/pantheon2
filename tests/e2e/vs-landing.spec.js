import {test, expect} from "@playwright/test";

const headings = {
  en: 'History. Head to head.', fr: 'L’histoire, face à face.', es: 'La historia, cara a cara.',
  de: 'Geschichte im Duell.', it: 'La storia, testa a testa.', pt: 'A história, frente a frente.',
  nl: 'Geschiedenis. Tegen elkaar.', hu: 'Történelem. Szemtől szemben.', pl: 'Historia. Łeb w łeb.',
  ru: 'История. Лицом к лицу.', zh: '历史，正面对决。', ja: '歴史が、対決する。', ar: 'التاريخ، وجهاً لوجه.',
};

for (const [locale, heading] of Object.entries(headings)) {
  test(`VS landing: ${locale} content, SEO and links`, async ({page}) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const prefix = locale === 'en' ? '' : `/${locale}`;
    const response = await page.goto(`${prefix}/vs`);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(heading);
    await expect(page).toHaveTitle(/.+ \| Pantheon$/);
    if (locale === 'en') await expect(page).toHaveTitle('Compare Countries by Their Notable People | Pantheon');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pantheon.world${prefix}/vs`);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(14);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{20}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://pantheon.world/images/vs-social.png');
    await expect(page.locator('.arena-fixture')).toHaveCount(15);
    const links = await page.locator('.arena-fixture').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
    expect(links.filter(link => link.startsWith(`${prefix}/profile/country/`))).toHaveLength(3);
    expect(links.filter(link => link.startsWith(`${prefix}/profile/occupation/`))).toHaveLength(12);
    const schema = await page.locator('script[type="application/ld+json"]').evaluate(n => JSON.parse(n.textContent));
    expect(schema.inLanguage).toBe(locale);
    expect(schema.mainEntity.itemListElement).toHaveLength(15);
    expect(await page.locator('[name="occupation"] option').count()).toBeGreaterThan(50);
    await expect(page.locator('.arena-submit')).toBeEnabled();
    expect(errors).toEqual([]);
  });
}

test('VS picker changes all three fields and opens the canonical matchup', async ({page}) => {
  await page.goto('/fr/vs');
  await page.locator('[name="occupation"]').selectOption('architect');
  await page.locator('[name="countryA"]').selectOption('switzerland');
  await page.locator('[name="countryB"]').selectOption('russia');
  await expect(page.locator('[name="countryB"] option[value="switzerland"]')).toHaveJSProperty('disabled', true);
  await page.locator('.arena-submit').click();
  await expect(page).toHaveURL(/\/fr\/profile\/occupation\/architect\/country\/russia\/vs\/switzerland$/);
  await expect(page.locator('.vs-page')).toBeVisible();
});

test('VS randomizer always selects two distinct eligible countries', async ({page}) => {
  await page.goto('/vs');
  for (let i = 0; i < 8; i++) {
    await page.locator('.arena-surprise').click();
    const a = await page.locator('[name="countryA"]').inputValue();
    const b = await page.locator('[name="countryB"]').inputValue();
    expect(a).not.toBe(b);
    expect(a).not.toBe('');
    expect(b).not.toBe('');
    await expect(page.locator('.arena-submit')).toBeEnabled();
  }
});

test('VS navigation reuses the new badge on desktop and mobile', async ({page}) => {
  await page.goto('/vs');
  await page.locator('.navigation .profiles-link').hover();
  await expect(page.locator('.navigation a[href="/vs"] .new-badge')).toBeVisible();
  await page.setViewportSize({width: 390, height: 844});
  await page.locator('.nav-btn').click();
  await expect(page.locator('.mobileNavigation a[href="/vs"] .new-badge')).toBeVisible();
});

for (const locale of ['ar', 'ja', 'de']) {
  test(`VS mobile ${locale}: layout and reduced motion`, async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto(`/${locale}/vs`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.arena-slide-portrait img').first().evaluate(n => getComputedStyle(n).animationName)).toBe('none');
    // Rotation runs on the pill fill's animation, so it never starts.
    expect(await page.locator('.arena-pill-fill').evaluate(n => getComputedStyle(n).animationName)).toBe('none');
    await expect(page.locator('.arena-submit')).toBeVisible();
  });
}

test('VS hero showcase: pills select clickable matchups and stop rotation', async ({page}) => {
  await page.goto('/vs');
  const tabs = page.getByRole('tab');
  const slide = page.locator('.arena-slide');
  await expect(tabs).toHaveText(['All occupations', 'Soccer Players', 'Composers', 'Physicists']);
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await expect(slide).toHaveAttribute('href', '/profile/country/france/vs/japan');
  await expect(slide).toHaveAccessibleName('France vs Japan');
  // The active pill's fill is the rotation timer.
  await expect(page.locator('.arena-pill-fill')).toHaveCSS('animation-name', 'arena-progress');
  await page.getByRole('tab', {name: 'Soccer Players'}).click();
  await expect(slide).toHaveAttribute('href', '/profile/occupation/soccer-player/country/argentina/vs/brazil');
  // Occupation matchups take their domain's pastel (sports).
  expect(await slide.evaluate(n => getComputedStyle(n).backgroundColor)).toBe('rgb(255, 218, 222)');
  // Choosing a pill stops rotation.
  await expect(page.locator('.arena-pill-fill')).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', {name: 'Composers'})).toBeFocused();
  await expect(page.getByRole('tab', {name: 'Composers'})).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toHaveAccessibleName('Composers');
});

test('VS featured links remain discoverable without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/vs`);
  await expect(page.locator('h1')).toHaveText(headings.en);
  await expect(page.locator('.arena-fixture')).toHaveCount(15);
  await context.close();
});

test('VS sitemap includes every language and the share image is available', async ({request}) => {
  const response = await request.get('/sitemap/static');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const locale of Object.keys(headings)) {
    expect(xml).toContain(`<loc>https://pantheon.world${locale === 'en' ? '' : `/${locale}`}/vs</loc>`);
  }
  const image = await request.get('/images/vs-social.png');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
});

test('VS featured fixtures all open existing comparison pages', async ({page, request}) => {
  test.setTimeout(180000);
  await page.goto('/vs');
  const links = await page.locator('.arena-fixture').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
  for (const link of links) {
    const response = await request.get(link, {timeout: 60000});
    expect(response.status(), link).toBe(200);
    expect(await response.text(), link).toContain('occupation-country-page vs-page');
  }
});

test('VS poster links each cutout and keeps both sides visible on a narrow screen', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/profile/occupation/painter/country/france/vs/italy');
  const portraits = page.locator('.vs-portrait');
  await expect(portraits).toHaveCount(2);
  for (const portrait of await portraits.all()) {
    await expect(portrait).toHaveAttribute('href', /\/profile\/person\//);
    await expect(portrait.locator('.vs-cutout')).toHaveAttribute('src', /\/images\/vs\/portraits\/\d+\.webp/);
    await expect.poll(() => portrait.locator('img').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    const bounds = await portrait.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  }
  await expect(page.locator('.vs-poster-counts a')).toHaveCount(2);
  await expect(page.locator('#numbers')).toBeAttached();
});

for (const locale of Object.keys(headings)) {
  test(`Country-wide comparison: ${locale} content and SEO`, async ({page}) => {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    await page.setViewportSize({width: 390, height: 844});
    const path = `${prefix}/profile/country/france/vs/japan`;
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    const title = await page.locator('.vs-poster-title').innerText();
    await expect(page).toHaveTitle(new RegExp(title));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', new RegExp(title));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pantheon.world${path}`);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(14);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.country-lineup img.vs-cutout')).toHaveCount(6);
    await expect(page.locator('.vs-matchup')).toHaveCount(10);
    await expect(page.locator('.vs-score-row')).toHaveCount(5);
    await expect(page.locator('.country-fields a').first()).toHaveAttribute('href', new RegExp(`^${prefix}/profile/occupation/[^/]+/country/france/vs/japan$`));
    const schema = await page.locator('.country-vs script[type="application/ld+json"]').evaluate(n => JSON.parse(n.textContent));
    expect(schema.inLanguage).toBe(locale);
    expect(schema.about).toHaveLength(2);
    await expect(page.locator('#occupation-comparison .analysis-panel')).toHaveCount(4);
    await expect(page.locator('#place-comparison .analysis-panel')).toHaveCount(4);
    await expect(page.locator('#place-comparison a').first()).toHaveAttribute('href', new RegExp(`^${prefix}/profile/place/`));
    await page.locator('#occupation-comparison summary').click();
    await expect(page.locator('#occupation-comparison table')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (locale !== 'en') {
      await expect(page.locator('#occupation-heading')).not.toHaveText('Occupations by birthplace');
      await expect(page.locator('#place-heading')).not.toHaveText('Where people were born and died');
      await expect(page.locator('.vs-poster-field')).not.toHaveText('Notable people by birthplace');
      await expect(page.locator('#numbers h2')).not.toHaveText('By the Numbers');
    }
  });
}

test('country-wide picker, redirects, invalid pairs and sitemap', async ({page, request}) => {
  await page.goto('/fr/vs');
  const field = page.locator('[name="occupation"]');
  await expect(field).toHaveValue('');
  await page.locator('.arena-submit').click();
  await expect(page).toHaveURL(/\/fr\/profile\/country\/france\/vs\/japan$/);
  for (const [path, target] of [
    ['japan/vs/france', 'france/vs/japan'], ['japan/vs/japan', 'japan'],
  ]) {
    const res = await request.get('/fr/profile/country/' + path, {maxRedirects: 0});
    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe('/fr/profile/country/' + target);
  }
  expect((await request.get('/profile/country/france/vs/unknown-country')).status()).toBe(404);
  const xml = await (await request.get('/sitemap/country-comparisons-fr')).text();
  expect(xml).toContain('/fr/profile/country/france/vs/japan</loc>');
  expect(xml).not.toContain('/fr/profile/country/japan/vs/france</loc>');
});
