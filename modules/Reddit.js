/*
 * Reddit Automation Module
 * uses @puppeteer
 * */

const puppeteer = require('puppeteer');

const Reddit = {
    url: 'https://www.reddit.com/login/',
    karmaUrl: 'https://www.reddit.com/r/FreeKarma4U/',
    browser: null, 
    page: null, 
    openBrowser: async () => {
        Reddit.browser = await puppeteer.launch({
            headless: false
        });
        Reddit.page = await Reddit.browser.newPage();
        await Reddit.page.goto(Reddit.url);
        await Reddit.page.waitForSelector('input#loginUsername');
    }, 
    loginUser: async (username, password) => {
          // reddit@username.
        await Reddit.page.type(
            'input[name=username]', 
            username, 
            { delay: Math.random * 10 });
        
          // reddit@password.
        await Reddit.page.type(
            'input[name=password]',
            password,
            { delay: Math.random * 10 });

        await Reddit.page.click('button[type=submit]');
    }
}

module.exports = Reddit;