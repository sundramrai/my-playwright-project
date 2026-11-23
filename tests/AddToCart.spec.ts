import { test, expect } from '../Fixture/PageFixture'
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

test.describe('Cart', () => {

    test('@Sanity Add to cart flow using saved login', async function ({ page, loginpage, cartpage, addcart, checkout, checkoutfinal, checkoutComplete }) {


        await loginpage.GotoInventory(TEST_DATA.urls.inventory);

        await addcart.ClickAddToCart();
        await addcart.header.clickOnopenBurger();
        await expect(addcart.header.logoutLink).toBeVisible();
        await addcart.header.clickOnCloseBurger();
        await expect(addcart.header.logoutLink).toBeHidden();
        await expect(addcart.cartbadgeiconcount).toHaveText('2');
        await expect(addcart.removeitemBtn).toBeVisible();
        await expect(addcart.removeitemBtn2).toBeVisible();
        await addcart.ClickOnBadgeIcon();
        await expect(page).toHaveURL(TEST_DATA.urls.cart);



        await expect(cartpage.cartItem('Sauce Labs Backpack')).toBeVisible();
        await expect(cartpage.itemPrice('Sauce Labs Backpack')).toHaveText('$29.99');
        await expect(cartpage.itemQuantity('Sauce Labs Backpack')).toHaveText('1');

        await expect(cartpage.cartItem('Sauce Labs Bike Light')).toBeVisible();
        await expect(cartpage.itemPrice('Sauce Labs Bike Light')).toHaveText('$9.99');
        await expect(cartpage.itemQuantity('Sauce Labs Bike Light')).toHaveText('1');
    

        await cartpage.RemoveitemfromCart('Sauce Labs Bike Light');
        await expect(cartpage.cartItem('Sauce Labs Bike Light')).toHaveCount(0);  
        await expect(addcart.cartbadgeiconcount).toHaveText('1');  


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

        await expect(checkoutfinal.productAmount).toHaveText('$29.99');
        await expect(checkoutfinal.tax).toHaveText('Tax: $2.40');
        await expect(checkoutfinal.finalamount).toHaveText('Total: $32.39');
        await checkout.header.clickOnopenBurger();
        await expect(checkout.header.logoutLink).toBeVisible();
        await checkout.header.clickOnCloseBurger();
        await expect(checkout.header.logoutLink).toBeHidden();
        await checkoutfinal.clickOnFinished();
        await expect(page).toHaveURL(TEST_DATA.urls.checkoutComplete);

         await checkout.header.clickOnopenBurger();
        await expect(checkout.header.logoutLink).toBeVisible();
        await checkout.header.clickOnCloseBurger();
        await expect(checkout.header.logoutLink).toBeHidden();
        await expect(checkoutComplete.orderCompleteHeader).toHaveText('Checkout: Complete!');
        await expect(checkoutComplete.orderCompleteText).toHaveText('Thank you for your order!');
        await expect(checkoutComplete.backhomeBtn).toBeVisible();
        await expect(checkoutComplete.GeneratePdfBtn).toBeVisible();
        await checkoutComplete.header.clickonLogout();
        await expect(checkoutComplete.header.logoutLink).toBeHidden();
         await expect(page).toHaveURL('/');
         await expect(loginpage.loginbtn).toBeVisible();


    });
});


test.describe('Sorting', () => {

    test.beforeEach(async function ({ loginpage }) {
        await loginpage.GotoInventory(TEST_DATA.urls.inventory);
    });

    test('Sort by price low to high', async function ({ addcart }) {
        await addcart.sortBy('lohi');
        await expect(addcart.itemPrices.first()).toHaveText('$7.99');      // wait until the page is sorted

        const prices = await addcart.getAllPrices();
        const expected = [...prices].sort((a, b) => a - b);                // copy, smallest first
        expect(prices).toEqual(expected);
    });

    test('Sort by price high to low', async function ({ addcart }) {
        await addcart.sortBy('hilo');
        await expect(addcart.itemPrices.first()).toHaveText('$49.99');

        const prices = await addcart.getAllPrices();
        const expected = [...prices].sort((a, b) => b - a);                // copy, biggest first
        expect(prices).toEqual(expected);
    });

    test('Sort by name A to Z', async function ({ addcart }) {
        // The page is A to Z by default, so sort Z to A first to make sure the A to Z click really works
        await addcart.sortBy('za');
        await addcart.sortBy('az');
        await expect(addcart.itemNames.first()).toHaveText('Sauce Labs Backpack');

        const names = await addcart.getAllNames();
        const expected = [...names].sort();
        expect(names).toEqual(expected);
    });

    test('Sort by name Z to A', async function ({ addcart }) {
        await addcart.sortBy('za');
        await expect(addcart.itemNames.first()).toHaveText('Test.allTheThings() T-Shirt (Red)');

        const names = await addcart.getAllNames();
        const expected = [...names].sort().reverse();
        expect(names).toEqual(expected);
    });

});
