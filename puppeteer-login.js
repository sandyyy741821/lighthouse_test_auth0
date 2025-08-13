// puppeteer-login.js
const puppeteer = require('puppeteer');

module.exports = async (browser, context) => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  const title = await page.evaluate(() => {
    const heading = document.querySelector('button.login');
    return heading ? heading.textContent.trim() : null;
  });
  console.log(`Page title: ${title}`);

  if (title === 'Login') {
    console.log('Not logged in, performing login...');

    await page.screenshot({ path: '01_before_click.png' });

    await page.waitForSelector('button[type=submit]', { visible: true });

    // Click login and wait for either navigation or URL change
    const oldUrl = page.url();
    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForFunction(url => location.href !== url, { timeout: 60000 }, oldUrl)
    ]);

    console.log(`✅ Redirected to: ${page.url()}`);
    await page.screenshot({ path: '02_after_redirect.png' });

    // Wait for Auth0 login form
    await page.waitForSelector('input[name=email]', { visible: true, timeout: 60000 });
    await page.type('input[name=email]', 'santhoshsandyyy741821@gmail.com');
    console.log('✅ Typed email');

    await page.waitForSelector('input[name=password]', { visible: true });
    await page.type('input[name=password]', 'S@ndyyy@741821');
    console.log('✅ Typed password');

    await page.screenshot({ path: '03_filled_form.png' });

    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 })
    ]);

    console.log(`✅ Logged in and redirected to: ${page.url()}`);
    await page.screenshot({ path: '04_logged_in.png' });

    // Give extra buffer before closing
    await new Promise(resolve => setTimeout(resolve, 10000));

  } else {
    console.log('Already logged in, skipping login');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  await page.close();
};
