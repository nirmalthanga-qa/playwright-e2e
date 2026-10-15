import { test, expect } from '@playwright/test';

test('Visual test', async ({ page }) => {

    await page.goto('https://demowebshop.tricentis.com/');

    /* 
    Note:
     First time when you run this test, it will create a snapshot file in the snapshots folder. 
    Test will fail because there is no snapshot to compare with. 
    After that, it will compare the current screenshot with the existing snapshot and pass if they match, or fail if they don't match.
     */

    // //Method 1: 
    // Full page screenshot comparison
    expect(await page.screenshot()).toMatchSnapshot('homepage.png')

    // Checking a specific element screenshot comparison
    const logo = page.locator('.header-logo');
    expect(await logo.screenshot()).toMatchSnapshot('logo.png')

    //Method 2:
    // Full page screenshot comparison
    await expect(page).toHaveScreenshot()


    // Checking a specific element screenshot comparison
    const submitButton = page.locator('.header-logo');

    await expect(submitButton).toHaveScreenshot('logo.png');

});