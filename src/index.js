require('dotenv').config()
const request = require('superagent');

const BASE_URL = 'https://app.7geese.com';

function getAccessToken() {
    return new Promise((resolve, reject) => {
        const req = request
            .post(`${BASE_URL}/o/token/`)
            .type('form')
            .send({
                grant_type: 'password',
                username: process.env.USER_EMAIL,
                password: process.env.USER_PASSWORD,
                scope: ['all'],
            })
            .auth(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
        req.end((err, res) => {
            if (err) reject(err);
            if (res.status !== 200) reject(res);
            resolve(res.body);
        });
    });
}

function getAuthenticated(access_token, path) {
    return new Promise((resolve, reject) => {
        const req = request
            .get(`${BASE_URL}/api/v/2.0/${path}`)
            .set('Authorization', `Bearer ${access_token}`);
        req.end((err, res) => {
            if (err) reject(err);
            if (res.status !== 200) reject(res);
            resolve(res.body);
        });
    });
}

async function main() {
    const accessResponse = await getAccessToken();
    const objectivesResponse = await getAuthenticated(
        accessResponse['access_token'],
        'objectives'
    );
    //console.dir(objectivesResponse);
    console.log(`- ${objectivesResponse['count']} objectives`);
}

main().catch((error) => {
    if (error.status) {
        console.log(error.text);
        console.error(`Failed request: HTTP ${error.status}`);
    } else {
        console.error(err);
    }
});
