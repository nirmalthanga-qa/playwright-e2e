// install faker-js library for generating dynamic data
// npm install @faker-js/faker

import { test, expect } from "@playwright/test";
import fs from "fs";
import { faker } from "@faker-js/faker";
import { DateTime } from 'luxon';

/*
Pre-requistes:

Install faker-js library for generating dynamic data
    npm install @faker-js/faker

install Luxon is a library for working with dates and times in JavaScript
npm install luxon   (or)
npm i --save-dev @types/luxon
*/


// Data to generate
/* {
        "firstname": "Sally",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2013-02-23",
            "checkout": "2014-10-23"
        },
        "additionalneeds": "Breakfast"
    } */

const BASE_URL = 'https://restful-booker.herokuapp.com';

test("Validate POST request by generating dynamic data", async ({ request }) => {

    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const totalprice = faker.number.int({ min: 100, max: 500 }); // we can specify the range
    const depositpaid = faker.datatype.boolean();
    const checkinDate = DateTime.now().toFormat("yyyy-MM-dd");
    const checkoutDate = DateTime.now().plus({ day: 5 }).toFormat("yyyy-MM-dd");
    const additionalneeds = "Super bowls"

    const requestPayload = {
        "firstname": firstname,
        "lastname": lastname,
        "totalprice": totalprice,
        "depositpaid": depositpaid,
        "bookingdates": {
            "checkin": checkinDate,
            "checkout": checkoutDate
        },
        "additionalneeds": additionalneeds
    }

    // send the POST request
    const response = await request.post(`${BASE_URL}/booking`, { data: requestPayload });

    const responseBody = await response.json();

    // validate the status code
    expect(response.status()).toBe(200);
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