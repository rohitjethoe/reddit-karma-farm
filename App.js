const Reddit = require("./modules/Reddit");
const fetchInput = require('./modules/fetchInput');

(async () => {
    console.log("[] REDDIT KARMA FARM []");
    console.log("[]  By Rohit Jethoe  []");
    console.log();

    await fetchInput.getUsername();
    await fetchInput.getPassword();

    await Reddit.openBrowser();
    await Reddit.loginUser(fetchInput.userDetails.username, fetchInput.userDetails.password);
    await Reddit.farmRedditKarma();

})();
