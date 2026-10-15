import { test, expect } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';

test('Post the booking date', async ({ request }) => {

    // request payload (static) for creating a new booking
    const requestPayload = {
        "firstname": "Sally",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2013-02-23",
            "checkout": "2014-10-23"
        },
        "additionalneeds": "Breakfast"
    }

    // send a POST request to create a new booking
    const response = await request.post(`${BASE_URL}/booking`, { data: requestPayload });

    // receive response body in json
    const responseBody = await response.json();

    // log the response body to the console
    console.log(responseBody);

    // assert that the response status is 200
    expect(response.status()).toBe(200);

    // assert that the response body contains the expected data
    expect(responseBody).toHaveProperty('bookingid');

    // assertion within another assertion
    expect(responseBody.bookingid).toEqual(expect.any(Number));

    // Method 1: To validate response body
    expect(responseBody.booking.firstname).toBe(requestPayload.firstname);
    expect(responseBody.booking.lastname).toBe(requestPayload.lastname);
    expect(responseBody.booking.totalprice).toBe(requestPayload.totalprice);
    expect(responseBody.booking.depositpaid).toBe(requestPayload.depositpaid);
    expect(responseBody.booking.bookingdates.checkin).toBe(requestPayload.bookingdates.checkin);
    expect(responseBody.booking.bookingdates.checkout).toBe(requestPayload.bookingdates.checkout);
    expect(responseBody.booking.additionalneeds).toBe(requestPayload.additionalneeds);

    // Method 2: By using toMatchObject
    const booking = await responseBody.booking;

    expect(booking).toMatchObject(requestPayload);

    // To validate specific values - eg: validate booking dates
    expect(booking.bookingdates).toMatchObject({
        "checkin": "2013-02-23",
        "checkout": "2014-10-23"
    });

});

