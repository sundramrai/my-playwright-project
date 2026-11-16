import {test as setup ,expect} from '@playwright/test'
import { LoginPage } from '../Pages/LoginPage';

setup('Authenticate',async function({page}) {

   const loginPage= new LoginPage(page);
   await loginPage.GotoApplication();
    await expect(loginPage.loginbtn).toBeVisible();
    await loginPage.doLogin();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.context().storageState({path:'playwright/.auth/user.json'})
    
})