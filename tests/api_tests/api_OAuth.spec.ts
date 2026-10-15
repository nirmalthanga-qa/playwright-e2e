import { test, expect } from "@playwright/test";
import dotenv from 'dotenv'; // Import the dotenv package to load environment variables from a .env file
dotenv.config(); // Load environment variables from .env file

// To get the authorization code, you can use the following URL in your browser (replace the placeholders with your actual values):
// https://github.com/login/oauth/authorize?client_id=Ov23livm2z4qxl2o7Swf&scope=repo,user &redirect_uri=http://localhost:3000/callback

const GITHUB_CONFIG = {

    clientId: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    authorizationCode: process.env.GITHUB_AUTHORIZATION_CODE!,
    tokenUrl: process.env.GITHUB_TOKEN_URL!,
    apiBaseUrl: process.env.GITHUB_API_BASE_URL!,
    owner: process.env.GITHUB_USERNAME!,

};

let accessToken = ""; 

let repoName = ""; //playwright-repo

test.describe.serial('GitHub OAuth 2.0 Authentication and Repository Creation', () => {

    test("OAuth 2.0 Authentication", async ({ request }) => {

        // Step 1: Obtain an access token
        const response = await request.post(GITHUB_CONFIG.tokenUrl, {

            headers: {
                Accept: 'application/json'
            },
            form: {
                client_id: GITHUB_CONFIG.clientId,
                client_secret: GITHUB_CONFIG.clientSecret,
                code: GITHUB_CONFIG.authorizationCode
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        accessToken = body.access_token;

        console.log('Token:', accessToken);


        //find the error in the response body and log it if it exists
        // console.log('Full response body:', JSON.stringify(body, null, 2));

        // expect(body.error, `${body.error}: ${body.error_description}`).toBeUndefined();
        // expect(body.access_token).toBeTruthy();


        expect(accessToken).toBeTruthy();

        console.log('Access Token Generated Successfully');

    });

    test('Create Repository', async ({ request }) => {

        let repoName = 'playwright-repo';

        const response = await request.post(
            `${GITHUB_CONFIG.apiBaseUrl}/user/repos`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github+json'
                },
                data: {
                    name: repoName,
                    description: 'Repository created using Playwright',
                    private: false

                }
            });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body.name).toBe(repoName);

        console.log('Repository Created Successfully');

    });

    test('Get Repository', async ({ request }) => {

        const response = await request.get(
            `${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${repoName}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github+json'
                }
            });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.name).toBe(repoName);
        console.log('Repository Name:', body.name);
        expect(body.owner.login).toBe(GITHUB_CONFIG.owner);

        console.log('Repository Retrieved Successfully');

    });


});
