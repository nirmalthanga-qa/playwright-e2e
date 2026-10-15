import { test, expect } from '@playwright/test';
import { Buffer } from 'buffer'; // to encode the data
import dotenv from 'dotenv'; // Import the dotenv package to load environment variables from a .env file
dotenv.config(); // Load environment variables from .env file

test.describe('API Authentication Examples', () => {

    // 1. Basic Authentication
    //https://postman-echo.com/basic-auth
    //username: postman
    //password: password

    test('Basic Authentication', async ({ request }) => {

        const username = process.env.BASIC_AUTH_USERNAME;
        const password = process.env.BASIC_AUTH_PASSWORD;

        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const response = await request.get('https://postman-echo.com/basic-auth', {
            headers: {
                Authorization: `Basic ${base64Credentials}`
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();

        console.log(responseBody)
        expect(responseBody.authenticated).toBe(true);

    });

    // 2. API Key
    test("API Key authentication (Open Weather API)", async ({ request }) => {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const city = "Delhi";

        const response = await request.get('https://api.openweathermap.org/data/4.0/onecall/current',
            {
                params: {
                    q: "Delhi",
                    appid: apiKey!,
                }
            });

        expect(response.status()).toBe(200);
        const weatherData = await response.json();
        console.log(weatherData);

        expect(weatherData.name).toBe(city);
        expect(weatherData).toHaveProperty('weather');
        expect(weatherData).toHaveProperty('main');

    });

    // 3. Bearer Token Authentication
    test("Bearer Token Authentication", async ({ request }) => {
      
        const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN; // Replace with your actual token

        const response = await request.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(200);
        const repositories = await response.json();
        console.log(repositories);

        // Add assertions based on the expected response structure
    });
    
});