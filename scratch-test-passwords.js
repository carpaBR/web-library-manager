const mysql = require('mysql2');

const passwords = ['univesp', '', 'root', '123456', 'password'];

async function testPasswords() {
    for (const pwd of passwords) {
        console.log(`Testing password: '${pwd}'`);
        try {
            const result = await new Promise((resolve) => {
                const conn = mysql.createConnection({ host: 'localhost', user: 'root', password: pwd });
                conn.connect(err => {
                    if (err) resolve(false);
                    else {
                        conn.end();
                        resolve(true);
                    }
                });
            });
            if (result) {
                console.log(`SUCCESS! Password is: '${pwd}'`);
                return;
            }
        } catch (e) {}
    }
    console.log('None of the common passwords worked.');
}

testPasswords();
