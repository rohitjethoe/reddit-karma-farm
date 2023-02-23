/*
 *  Reddit Automation 1.1.0
 *  uses @puppeteer
 *  + Request & Chrome Headless.
 * */

const puppeteer = require('puppeteer-extra');
const querystring = require('querystring');

const stealthMode = require('puppeteer-extra-plugin-stealth') 

puppeteer.use(stealthMode());
const { executablePath } = require('puppeteer');

const App = {
    browser: null,
    browserContext: null,
    page: null,
    openBrowswer: async () => {
        App.browser = await puppeteer.launch({
            headless: false,
            executablePath: executablePath()
        });
        
        App.browserContext = App.browser.defaultBrowserContext();
        App.browserContext.overridePermissions('https://www.reddit.com', ['geolocation', 'notifications']);

        App.page = await App.browser.newPage();
    },
    openPageByChrome: async (username, password) => {
        await App.page.goto('https://reddit.com/login')
        await App.page.type('input[name=username]', username, { 
            delay: Math.floor(Math.random() * 10) * 10 
        });

        await App.page.type('input[type=password]', password, {
            delay: Math.floor(Math.random * 10) * 10
        });

        await App.page.click('button[type=submit]');
        await App.page.waitForSelector('._31N0dvxfpsO6Ur5AKx4O5d', {
            visibile: true
        });

        await App.page.waitForSelector('.icon-close', {
            timeout: 6000
        });
        let interestsIsVisible = await App.page.evaluate(() => {
            const interestsMenuElement = document.querySelector('.icon-close');
            return interestsMenuElement ? true : false;
        });
        if (interestsIsVisible) {
            await App.page.click('.icon-close');
        }
    },
    postCommentsByChrome: async (communityUri, message) => {
        await App.page.goto(`https://reddit.com/r/${communityUri}/new`);
        
        await App.page.evaluate(() => {
            const posts = document.querySelectorAll('.SQnoC3ObvgnGjWt90zD9Z');
            posts[0].click();
        })

        const postUrl = await App.page.url();
        const postData = await postUrl.substring(35 + communityUri.length, postUrl.length - 1).split("/");

        await App.page.waitForSelector('._1npCwF50X2J7Wt82SZi6J0', {
            visible: true
        });
        await App.page.goto(postUrl);
        
        await App.page.waitForSelector(`#t3_${postData[0]}`, {
            visible: true
        })

        await App.page.type('._6Ej82J4aTDK36LLOcpFbC', message);
        await App.page.evaluate(() => {
            const postBtn = document.querySelectorAll('button._22S4OsoDdOqiM-hPTeOURa');
            postBtn[0].click();
        });
    },
    deleteCommentsByChrome: async (username) => {
        const usersCommentsUrl = `https:/www.reddit.com/user/${username}/comments/`;
        await App.page.goto(usersCommentsUrl);

        await App.page.waitForSelector('.Post', {
            timeout: 6000
        })
        
        let commentsAvailable = await App.page.evaluate(() => {
            const comments = document.querySelector('.Post');
            return comments ? true : false
        });

        if (commentsAvailable) {
            await App.page.evaluate(() => {
                const commentOverflowMenus = document.querySelectorAll('._2pFdCpgBihIaYh9DSMWBIu');
                for (let i = 0; i < commentOverflowMenus.length; i++) {
                    commentOverflowMenus[i].click();
                    const deleteCommentButton = document.querySelectorAll('._2LNy1r5iuFMrf0PLh4UdV-');
                    deleteCommentButton[2].click();
                    document.querySelector('._17UyTSs2atqnKg9dIq5ERg').click();
                }
            });
        }
    },
    // NOTE IF TESTING
    // openPageByRequest() is not available yet. 
    openPageByRequest: async () => {
        App.page = await App.browser.newPage();
        await App.page.setRequestInterception(true);
    
        await App.page.on('request', request => {
            const data = {
                'method': 'POST',
                'postData': 'csrf_token=cd727e1cf5bdf4e848b43629e3b0b08165d6ce9f&password=DavidSins4Ever!@&dest=https://www.reddit.com&username=zelfmoordjongens',
                'headers': {
                    ...request.headers(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            request.continue(data);
        });

        const response = await App.page.goto("https://reddit.com/login");
        console.log(await {
            url: await response.status()
        });
    },
    // NOTE IF TESTING
    // postCommentsByRequest() is not available yet.
    postCommentsByRequest: async (communityUri) => {
        await App.page.goto(`https://reddit.com/r/${communityUri}/new`);
                            // 01234567890123456789012345678901234567890
        await App.page.evaluate(() => {
            const posts = document.querySelectorAll('.SQnoC3ObvgnGjWt90zD9Z');
            posts[0].click();
        })

        const postUrl = await App.page.url();
        const postData = await postUrl.substring(35 + communityUri.length, postUrl.length - 1).split("/");
        // reload post
        await App.page.waitForTimeout(1500);
        await App.page.goto(postUrl);
        // request
        await App.page.setRequestInterception(true);

        const requestData = {
            id: "f474c490e3e9",
            variables: {
                input: {
                    content: {
                        markdown: "test",
                        richText: null
                    },
                    parentId: null,
                    postId: `t3_${postData[0]}`
                }
            }
        }

        await App.page.on('request', request => {
            const data = {
                'method': 'POST',
                'postData': querystring.stringify(requestData),
                'headers': {
                    ...request.headers(),
                    'Content-Type': 'application/json'
                }
            }

            request.continue(data);
        });
        
        const response = await App.page.goto('https://reddit.com');
        console.log(response);
    }
}

module.exports = App;