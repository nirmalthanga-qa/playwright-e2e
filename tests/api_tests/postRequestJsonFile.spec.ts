import { test, expect } from "@playwright/test";
import fs from "fs";

const BASE_URL = 'https://restful-booker.herokuapp.com';

test("validate the POST request by using JSON file", async ({ request }) => {

    const jsonFile = "tests/api_tests/test-data/postRequest.json";
    const requestPayload = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

    // Send POST request
    const response = await request.post(`${BASE_URL}/booking`, {data: requestPayload} )
    const responseBody = await response.json();

    // validate the status code
    expect (response.status()).toBe(200);
    expect(response.statusText()).toBe("OK");

    console.log(await response.json())

    // validate booking fields
    const booking = await responseBody.booking

     expect(booking).toMatchObject({
        firstname: requestPayload.firstname,
        lastname: requestPayload.lastname,
        totalprice: requestPayload.totalprice,
        depositpaid: requestPayload.depositpaid,
        additionalneeds: requestPayload.additionalneeds
    });

     // To validate specific values - eg: validate booking dates
    expect(booking.bookingdates).toMatchObject({
        checkin: requestPayload.bookingdates.checkin,
        checkout: requestPayload.bookingdates.checkout
    });

});