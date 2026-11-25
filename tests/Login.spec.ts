import {test,expect} from '../Fixture/PageFixture'
import UserData from '../TestData/UserData.json'
import { TEST_DATA } from '../TestData/testData';

test.describe('Login', () => {
    test.use({ storageState: { cookies: [], origins: [] } });   // sirf is group par lagega

    test('@smoke Invalid Login Flow', async function ({ page, loginpage }) {

        await loginpage.GotoApplication();
        await loginpage.doLogin(UserData.invalidUser.username, UserData.invalidUser.password);
        await expect(page).not.toHaveURL(TEST_DATA.urls.inventory);
        await expect(loginpage.errormsg).toBeVisible();
        await expect(loginpage.errormsg).toContainText('Username and password do not match');
    });

    test('@regression Locked user Login Flow', async function ({ page, loginpage }) {

        await loginpage.GotoApplication();
        await loginpage.doLogin(UserData.lockedUser.username, UserData.lockedUser.password);
        await expect(page).not.toHaveURL(TEST_DATA.urls.inventory);
        await expect(loginpage.errormsg).toBeVisible();
        await expect(loginpage.errormsg).toContainText('Sorry, this user has been locked out.');
    });
});