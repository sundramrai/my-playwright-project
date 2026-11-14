import {test as setup ,expect} from '@playwright/test'

setup('Authenticate',async function({page}) {

    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    const loginbtn=await page.locator('#login-button');
    await expect(loginbtn).toBeVisible();
    await loginbtn.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.context().storageState({path:'playwright/.auth/user.json'})
    
})