import {test as setup ,expect} from '../Fixture/PageFixture'
import UserData from "../TestData/UserData.json"
import { TEST_DATA } from '../TestData/testData';

setup('Authenticate',async function({page,loginpage}) {


   await loginpage.GotoApplication();
    await expect(loginpage.loginbtn).toBeVisible();
    await loginpage.doLogin(UserData.validUser.username,UserData.validUser.password);
    await expect(page).toHaveURL(TEST_DATA.urls.inventory);
    await page.context().storageState({path:'playwright/.auth/user.json'})
    
})