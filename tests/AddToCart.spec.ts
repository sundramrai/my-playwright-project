import { test, expect } from '../Fixture/PageFixture'
import UserData from '../TestData/UserData.json'
import { TEST_DATA } from '../TestData/testData';




test.describe('Login', () => {
    test.use({ storageState: { cookies: [], origins: [] } });   // sirf is group par lagega

    test('@smoke Invalid Login Flow', async function ({ page ,loginpage}) {
       
        await loginpage.GotoApplication();
        await loginpage.doLogin(UserData.invalidUser.username,UserData.invalidUser.password);
        await expect(page).not.toHaveURL(TEST_DATA.urls.inventory);
        await expect(loginpage.errormsg).toBeVisible();
        await expect(loginpage.errormsg).toContainText('Username and password do not match');
    });

    test('@regression Locked user Login Flow', async function ({ page,loginpage}) {
       
        await loginpage.GotoApplication();
        await loginpage.doLogin(UserData.lockedUser.username,UserData.lockedUser.password);
        await expect(page).not.toHaveURL(TEST_DATA.urls.inventory);
        await expect(loginpage.errormsg).toBeVisible();
        await expect(loginpage.errormsg).toContainText('Sorry, this user has been locked out.');
    });



});

test.describe('Cart', () => {

    test('@Sanity Add to cart flow using saved login', async function ({ page,loginpage,cartpage ,addcart , checkout }) {

        
        await loginpage.GotoInventory(TEST_DATA.urls.inventory);
       
        await addcart.ClickAddToCart();
        await addcart.header.clickOnopenBurger();
        await expect(addcart.header.logoutLink).toBeVisible();
        await addcart.header.clickOnCloseBurger();
        await expect(addcart.header.logoutLink).toBeHidden();
        await expect(addcart.cartbadgeiconcount).toHaveText('1');
        await expect(addcart.removeitemBtn).toBeVisible();
        await addcart.ClickOnBadgeIcon();
        await expect(page).toHaveURL(TEST_DATA.urls.cart);
       
        await expect(cartpage.productname).toHaveText('Sauce Labs Backpack');
        await expect(cartpage.prizelevel).toHaveText('$29.99');
        await expect(cartpage.cartQuantity).toHaveText('1');
        await expect(cartpage.removebtn).toBeVisible();
        await expect(cartpage.checkoutBtn).toBeVisible();
         await cartpage.header.clickOnopenBurger();
        await expect(cartpage.header.logoutLink).toBeVisible();
        await cartpage.header.clickOnCloseBurger();
        await expect(cartpage.header.logoutLink).toBeHidden();
        await cartpage.clickOnCheckOut();
        await expect(page).toHaveURL(TEST_DATA.urls.checkout);
    
        await checkout.fillFrom();
         await checkout.header.clickOnopenBurger();
        await expect(checkout.header.logoutLink).toBeVisible();
        await checkout.header.clickOnCloseBurger();
        await expect(checkout.header.logoutLink).toBeHidden();
        await checkout.clickOnContinue();
        await expect(page).toHaveURL(TEST_DATA.urls.checkout2);



    });
});
