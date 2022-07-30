const puppeteer = require('puppeteer');

const Reddit = {
    url: 'https://www.reddit.com/login/',
    browser: null,
    page: null,
    openBrowser: async () => {
        Reddit.browser = await puppeteer.launch({
            headless: false
        });
        Reddit.page = await Reddit.browser.newPage();
        await Reddit.page.goto(Reddit.url);
    }
}

module.exports = Reddit;