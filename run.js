//run.js
const puppeteer = require('puppeteer');
const loginScript = require('./puppeteer-login.js');

(async () => {
  const browser = await puppeteer.launch({ headless: false,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // if using puppeteer-core
  args: [
    '--disable-web-security',
    '--disable-features=BlockInsecurePrivateNetworkRequests',
    '--disable-site-isolation-trials',
  ] });
  const context = {}; // simulate context for testing
  await loginScript(browser, context);
  await browser.close();
})();
