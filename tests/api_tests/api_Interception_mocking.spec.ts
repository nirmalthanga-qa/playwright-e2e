/*
 * API Mocking  & Network interception Demo

https://demo.playwright.dev/api-mocking/
https://demo.playwright.dev/api-mocking/api/v1/fruits
 */

import { test, expect } from '@playwright/test';


//Example 1: Mocking API response

test('Mocking API response', async ({ page }) => {

  // Step 1: Intercept the API URL pattern before navigating

  //https://demo.playwright.dev/api-mocking/api/v1/fruits
  await page.route("**/api/v1/fruits", async (route) => {

    const fakeresjson = [
      { name: 'XYZ', id: 1 },
      { name: 'ABC', id: 2 }
    ];
    // Step 2: Fulfill the request with your mock data
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fakeresjson) // converts Javascript object into JSON
    })
  })
  // Step 3: Go to the page and verify the UI displays the mocked data

  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('XYZ')).toBeVisible();
  await expect(page.getByText('ABC')).toBeVisible();

})

//Example 2: Mocking API response using API request  
//❌ We cannot mock directly API request  - Not supported in Playwright using 'request' fixture

test('Mock API response', async ({ request }) => {

  const response = await request.get('https://demo.playwright.dev/api-mocking/api/v1/fruits')

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const fruits = await response.json();
  console.log('Fruits:', fruits);
})



//Example 3: Modify a live API response
test('Modify a live API response', async ({ page }) => {

  // Intercept the API request
  await page.route('**/api/v1/fruits', async (route) => {

    // 1. Fetch the actual response from the server
    const response = await route.fetch();

    // 2. Convert the response to JSON
    const jsonBody = await response.json();
    console.log(jsonBody);

    // 3. Modify the response
    jsonBody.push({ id: 100, name: 'XYZ' });

    // 4. Return the modified response
    // Fulfill the route with the modified response
    await route.fulfill({
      response,
      json: jsonBody
    });
  });

  // Navigate after registering the route
  await page.goto('https://demo.playwright.dev/api-mocking');

  // Verify the modified response is rendered
  await expect(page.getByText('XYZ')).toBeVisible();

});


//Example 4: Network Interception - Block specific image extensions

test('Block common image extensions', async ({ page }) => {

  // Intercept requests for common image extensions and block them
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', async (route) => {
    console.log('Blocked:', route.request().url());
    await route.abort();// Abort the request to block the image
  });
  await page.goto('https://demoblaze.com/');
  await page.waitForLoadState('networkidle');// Wait for the page to finish loading

});

//Example 5:Amazon example: 
test('Block image extensions -Amazon page', async ({ page }) => {

  // Intercept requests for common image extensions and block them
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', async (route) => {
    console.log('Blocked:', route.request().url());
    await route.abort();// Abort the request to block the image
  });

  await page.goto('https://www.amazon.in/');
  await page.waitForLoadState('networkidle');// Wait for the page to finish loading

});


//Example 6: Another way to Block images(best Approach)
test('Block all images', async ({ page }) => {

  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.abort();
      return;
    }
    await route.continue();
  });
  await page.goto('https://demoblaze.com/');
  await page.waitForLoadState('networkidle');// Wait for the page to finish loading

});



// just example to show how to mock API response with 500 error code and check the UI handles the failure gracefully
// Example 7: Mock Internal Server error 500 API response
// Intercept the API request
test('shows error message when API returns 500', async ({ page }) => {
  // 1.Intercept the API call and fulfill with a 500
  await page.route('**/api/v1/users', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  // 2. Navigate to the page that makes the API call
  await page.goto('https://demo.playwright.dev/api-mocking');
  
  // 3. Assert that your frontend displays the correct error state
  const errorAlert = page.locator('.error-message');
  await expect(errorAlert).toBeVisible();
  await expect(errorAlert).toHaveText('Something went wrong!');
  
  // Assert the UI handles the failure gracefully
  await expect(page.getByRole('alert')).toContainText(/something went wrong/i);
  await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
});
