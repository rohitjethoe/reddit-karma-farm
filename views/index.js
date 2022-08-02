const Reddit = require('../modules/Reddit.js');

const btn = document.getElementById('run');

const user = {
    username: document.getElementById('username'),
    password: document.getElementById('password')
}

const stats = {
    comments: document.querySelector('.comments'),
    deleted: document.querySelector('.deleted')
}

const runApp = async () => {
    await Reddit.openBrowser();
    await Reddit.loginUser(user.username.value, user.password.value);
    
    for (let i = 0; i < 100; i++) {    
        await Reddit.farmRedditKarma();
        stats.comments.innerHTML = `💬 commented ${i} times.`
    }
}

btn.onclick = runApp;
