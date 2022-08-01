const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const fetchInput = {
    userDetails: {
        username: null,
        password: null
    },
    getUsername: () => {
        return new Promise((resolve, reject) => {
            readline.question('Voer gebruikersnaam in: ', input => {
                fetchInput.userDetails.username = input;
                resolve();
            });
        });
    },
    getPassword: () => {
        return new Promise((resolve, reject) => {
            readline.question('Voer wachtwoord in: ', input => {
                fetchInput.userDetails.password = input;
                resolve();
            });
        });
    }
}

module.exports = fetchInput;