import { test as base, Page, expect } from '@playwright/test'

//create type of the Fixture
type loggedUser = { loggedInUser: Page }


export const test = base.extend<loggedUser>({

    loggedInUser: async ({ page }, use) => {
        //Login steps
        console.log("login succesful...")
        await use(page)
    }
})

export { expect }