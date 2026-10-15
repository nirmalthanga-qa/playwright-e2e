import { test, expect } from '@playwright/test';
import fs from 'fs';

/*
Create booking ---> booking id
booking id ---> Get the booking (Optional)

we need the token to update and delete
booking id + request payload(ison)+token ---> partial update the booking
booking id + request payload(ison)+token ---> full update the booking
booking id + token ---> Delete the booking
*/

// utility function to read JSON data from file
function readJSON(filePath: string) {

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// the above function is same as this
/* const jsonFile = "tests/api_tests/test-data/postRequest.json";
const requestPayload = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
 */
const BASE_URL = 'https://restful-booker.herokuapp.com';

test('Update booking - POST (create), GET, and PUT (full update) a booking record', async ({ request }) => {

    // step 1: Create a new booking using POST request
    const createBookingData = readJSON('tests/api_tests/test-data/postRequest.json');
    const createResponse = await request.post(`${BASE_URL}/booking`, { data: createBookingData });

    const createdBooking = await createResponse.json();
    const bookingId = createdBooking.bookingid // extracting bookingid from json response body

    expect(await createResponse.status()).toBe(200);
    expect(await createResponse.statusText()).toBe('OK')

    // step 2 (optional): Get a booking record using GET request 
    const getResponse = await request.get(`${BASE_URL}/booking/${bookingId}`);
    const bookingDetails = await getResponse.json();
    console.log('Booking details before update:', bookingDetails);

    // create token - this is required for PUT/PATCH/DELETE
    const tokenData = readJSON('tests/api_tests/test-data/tokenRequest.json'); // username. password
    const tokenResponse = await request.post(`${BASE_URL}/auth`, { data: tokenData });
    const tokenJson = await tokenResponse.json();
    const token = tokenJson.token
    console.log('Token generated:', token);

    expect(await tokenResponse.status()).toBe(200);
    expect(await tokenResponse.statusText()).toBe('OK')

   // step 3: Partial update using PATCH
    const partialUpdateData = readJSON('tests/api_tests/test-data/patchRequest.json');
    const createPartialUpdate = await request.patch(`${BASE_URL}/booking/${bookingId}`,
        {
            headers: {
                "content-Type": "application/json",
                "Accept": "application/json",
                "cookie": `token=${token}`
            },
            data: partialUpdateData
        });

    expect(await createPartialUpdate.status()).toBe(200);
    expect(await createPartialUpdate.statusText()).toBe('OK')

    const patchResponse = await createPartialUpdate.json()
    console.log("Partial update successful:", patchResponse);

    // step 4: Full update using PUT
    const putData = readJSON('tests/api_tests/test-data/putRequest.json');
    const fullUpdate = await request.patch(`${BASE_URL}/booking/${bookingId}`,
        {
            headers: {
                "content-Type": "application/json",
                "Accept": "application/json",
                "cookie": `token=${token}`
            },
            data: putData
        });

    expect(await fullUpdate.status()).toBe(200);
    expect(await fullUpdate.statusText()).toBe('OK')

    const putResponse = await fullUpdate.json()
    console.log("Partial update successful:", putResponse);

    // Step 5: DELETE booking
    const deleteData = await request.delete(`${BASE_URL}/booking/${bookingId}`,

        {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
        }
        });

        expect(await deleteData.status()).toBe(201);
        expect(await deleteData.statusText()).toBe('Created');

});
