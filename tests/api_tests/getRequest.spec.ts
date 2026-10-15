import { test, expect } from "@playwright/test";

const BASE_URL = 'https://restful-booker.herokuapp.com';

test('Validate the booking details using GET method by id - path parameter', async ({ request }) => {

    const bookingId = 1;

    // Send the GET request
    const response = await request.get(`${BASE_URL}/booking/${bookingId}`)
    const responseBody = await response.json();

    // To view body in console
    console.log(await response.json())

    // validate the status
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');

    // validate response body
    expect(responseBody).toHaveProperty('firstname');
    expect(responseBody).toHaveProperty('lastname');

});

test('Validate the booking details using GET method by name - query parameter', async ({ request }) => {

    // method 1:
    const firstname = 'Jim';
    const lastname = 'Brown';

    // method 2:
    // const paramQuery = '?firstname=Jim&lastname=Brown'
    // const response = await request.get(`${BASE_URL}/booking${paramQuery}`)

    // Send the GET request
    const response = await request.get(`${BASE_URL}/booking`,
        {
            params:
            {
                firstname,
                lastname
            }
        })

    const responseBody = await response.json();

    // To view body in console
    console.log(await response.json())

    // validate the status
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');

   // verify booking id should be a number and should be greater than 0
   for (const item of responseBody) 
   {
    expect(item).toHaveProperty("bookingid");
    expect(typeof item.bookingid).toBe('number');
    expect(item.bookingid).toBeGreaterThan(0);
   }

});