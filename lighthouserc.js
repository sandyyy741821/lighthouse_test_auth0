module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      puppeteerScript: './puppeteer-login.js',
      puppeteerLaunchOptions: {
        headless: true, // << SEE what's happening
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=BlockInsecurePrivateNetworkRequests',
            '--disable-site-isolation-trials',
        ],
    },
    //   chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/articles"
      ],
      settings: {
        formFactor: 'desktop',
        throttlingMethod: 'simulate',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1
        }
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci'
    },
  },
};
