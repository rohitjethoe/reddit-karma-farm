/*
 * Reddit Automation Module
 * uses @puppeteer
 * */

const puppeteer = require('puppeteer');

const Reddit = {
    url: 'https://www.reddit.com/login/',
    postUrl: 'https://www.reddit.com/r/FreeKarma4U/submit',
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
    },
    farmRedditKarma: async (title) => {
        await Reddit.page.waitForTimeout(4000);
        await Reddit.page.goto(Reddit.postUrl);

        let postTitle;
        
        if (title == undefined) {
              // fixed post-title.
            postTitle = "upvote me please.";
        } else {
            postTitle = title;
        }

        const postUrls = [
            "https://longdogechallenge.com/",
            "http://corndog.io/",
            "https://binarypiano.com/",
            "https://hooooooooo.com/",
            "https://alwaysjudgeabookbyitscover.com/"
        ];

          // Wait for black screen. 
        await Reddit.page.waitForTimeout(30000);
        console.log('black screen cleared');

        await Reddit.page.evaluate(() => {
            const postTitleField = document.querySelectorAll('.PqYQ3WC15KaceZuKcFI02');
            postTitleField[0].value = "test";

            postTitleField[1].value = "test.com";
        });
    }
}

module.exports = Reddit;