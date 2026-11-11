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
    if (locale === 'en') await expect(page).toHaveTitle('Compare Countries by Occupation | Pantheon');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pantheon.world${prefix}/vs`);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(14);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{20}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://pantheon.world/images/vs-social.png');
    await expect(page.locator('.arena-fixture')).toHaveCount(6);
    const links = await page.locator('.arena-fixture').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
    for (const link of links) expect(link).toMatch(new RegExp(`^${prefix}/profile/occupation/[^/]+/country/[^/]+/vs/[^/]+$`));
    const schema = await page.locator('script[type="application/ld+json"]').evaluate(n => JSON.parse(n.textContent));
    expect(schema.inLanguage).toBe(locale);
    expect(schema.mainEntity.itemListElement).toHaveLength(6);
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
    expect(await page.locator('.arena-pennant-a').evaluate(n => getComputedStyle(n).animationName)).toBe('none');
    await expect(page.locator('.arena-submit')).toBeVisible();
  });
}

test('VS featured links remain discoverable without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/vs`);
  await expect(page.locator('h1')).toHaveText(headings.en);
  await expect(page.locator('.arena-fixture')).toHaveCount(6);
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
