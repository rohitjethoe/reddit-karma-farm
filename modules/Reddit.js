/*
 * Reddit Automation Module
 * uses @puppeteer
 * */

const puppeteer = require('puppeteer');

const Reddit = {
    url: 'https://www.reddit.com/login/',
    communityUrl: 'https://www.reddit.com/r/FreeKarma4You/new/',
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
    
        // Wait for black screen. 
        await Reddit.page.waitForTimeout(30000);
        console.log('black screen cleared');
    },
    farmRedditKarma: async (title) => {
        await Reddit.page.goto(Reddit.communityUrl);
        await Reddit.page.waitForTimeout(1500);

        let postTitle;
        
        if (title == undefined || title == "") {
            // fixed post-title.
            postTitle = "I upvoted, upvote me back please.";
        } else {
            postTitle = title;
        }

        console.log(postTitle);
        
        // .click() -> first new post of reddit community.
        await Reddit.page.evaluate(() => {
            const posts = document.querySelectorAll('.SQnoC3ObvgnGjWt90zD9Z');
            posts[0].click();
        });

        await Reddit.page.waitForTimeout(1500);
        await Reddit.page.type('._6Ej82J4aTDK36LLOcpFbC', "I upvoted, upvote me back please.");
        
        // .click() -> post comment button.
        await Reddit.page.evaluate(() => {
            const postBtn = document.querySelectorAll('button._22S4OsoDdOqiM-hPTeOURa');
            postBtn[0].click();
        });
    },
    deleteComments: async (username) => {
        const userCommentsUrl = `https://www.reddit.com/user/${username}/comments/`

        await Reddit.page.goto(userCommentsUrl);
        await Reddit.page.waitForTimeout(1500);

        await Reddit.page.evaluate(() => {
            let actionBtn = document.querySelectorAll('._38GxRFSqSC-Z2VLi5Xzkjy');
            actionBtn[0].click();

            let actions = document.querySelectorAll('._2LNy1r5iuFMrf0PLh4UdV-');
            actions[2].click();

            let deleteBtn = document.querySelectorAll('._2nelDm85zKKmuD94NequP0');
            deleteBtn[1].click();
        })
    }
}

module.exports = Reddit;