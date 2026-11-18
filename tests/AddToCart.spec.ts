import { test, expect } from '../Fixture/PageFixture'
import UserData from '../TestData/UserData.json'



test.describe('Login', () => {
    test.use({ storageState: { cookies: [], origins: [] } });   // sirf is group par lagega

    test('Invalid Login Flow', async function ({ page ,loginpage}) {
       
        await loginpage.GotoApplication();
        await loginpage.doLogin(UserData.invalidUser.username,UserData.invalidUser.password);
        await expect(page).not.toHaveURL(/inventory\.html/);
        await expect(loginpage.errormsg).toBeVisible();
        await expect(loginpage.errormsg).toContainText('Username and password do not match');
    });

    test('Locked user Login Flow', async function ({ page,loginpage}) {
       
        await loginpage.GotoApplication();
        await loginpage.doLogin(UserData.lockedUser.username,UserData.lockedUser.password);
        await expect(page).not.toHaveURL(/inventory\.html/);
        await expect(loginpage.errormsg).toBeVisible();
        await expect(loginpage.errormsg).toContainText('Sorry, this user has been locked out.');
    });



});

test.describe('Cart', () => {

    test('Add to cart flow using saved login', async function ({ page,loginpage,cartpage ,addcart , checkout }) {

        
        await loginpage.GotoInventory();
       
        await addcart.ClickAddToCart();
        await expect(addcart.cartbadgeiconcount).toHaveText('1');
        await expect(addcart.removeitemBtn).toBeVisible();
        await addcart.ClickOnBadgeIcon();
        await expect(page).toHaveURL(/cart\.html/);
       
        await expect(cartpage.productname).toHaveText('Sauce Labs Backpack');
        await expect(cartpage.prizelevel).toHaveText('$29.99');
        await expect(cartpage.cartQuantity).toHaveText('1');
        await expect(cartpage.removebtn).toBeVisible();
        await expect(cartpage.checkoutBtn).toBeVisible();
        await cartpage.clickOnCheckOut();
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    
        await checkout.fillFrom();
        await checkout.clickOnContinue();
        await expect(page).toHaveURL(/checkout-step-two\.html/);


    });
});
