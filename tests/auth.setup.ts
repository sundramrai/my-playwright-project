import {test as setup ,expect} from '../Fixture/PageFixture'
import { TEST_DATA } from '../TestData/testData';

setup('Authenticate',async function({page,loginpage}) {


   await loginpage.GotoApplication();
    await expect(loginpage.loginbtn).toBeVisible();
    await loginpage.doLogin(process.env.USERNAME!,process.env.PASSWORD!);
    await expect(page).toHaveURL(TEST_DATA.urls.inventory);
    await page.context().storageState({path:'playwright/.auth/user.json'})
    
})