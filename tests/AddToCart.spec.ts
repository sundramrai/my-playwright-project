import { test, expect } from '@playwright/test'
import { LoginPage } from '../Pages/LoginPage';
import { CartPage } from '../Pages/CartPage';
import { AddCart } from '../Pages/AddCart';
import { CheckOut } from '../Pages/CheckOut'



test.describe('Login', () => {
    test.use({ storageState: { cookies: [], origins: [] } });   // sirf is group par lagega

    test('Invalid Login Flow', async function ({ page }) {
        const loginPage = new LoginPage(page);
        await loginPage.GotoApplication();
        await loginPage.doInvalidLogin();
        await expect(page).not.toHaveURL(/inventory\.html/);
        await expect(loginPage.errormsg).toBeVisible();
        await expect(loginPage.errormsg).toContainText('Username and password do not match');
    });
});

test.describe('Cart', () => {

    test('Add to cart flow using saved login', async function ({ page }) {

        const loginInventery = new LoginPage(page);
        await loginInventery.GotoInventory();
        const addcart = new AddCart(page);
        await addcart.ClickAddToCart();
        await expect(addcart.cartbadgeiconcount).toHaveText('1');
        await expect(addcart.removeitemBtn).toBeVisible();
        await addcart.ClickOnBadgeIcon();
        await expect(page).toHaveURL(/cart\.html/);
        const cartpage = new CartPage(page);
        await expect(cartpage.productname).toHaveText('Sauce Labs Backpack');
        await expect(cartpage.prizelevel).toHaveText('$29.99');
        await expect(cartpage.cartQuantity).toHaveText('1');
        await expect(cartpage.removebtn).toBeVisible();
        await expect(cartpage.checkoutBtn).toBeVisible();
        await cartpage.clickOnCheckOut();
        await expect(page).toHaveURL(/checkout-step-one\.html/);
        const checkout = new CheckOut(page);

        await checkout.fillFrom();
        await checkout.clickOnContinue();
        await expect(page).toHaveURL(/checkout-step-two\.html/);


    });
});
