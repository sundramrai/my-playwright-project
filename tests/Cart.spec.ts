
import {test,expect} from '../Fixture/PageFixture'
import { TEST_DATA } from '../TestData/testData';

test.describe('Cart', () => {

    test('@Sanity Add to cart flow using saved login', async function ({ page, loginpage, cartpage, addcart, checkout, checkoutfinal, checkoutComplete }) {

        await test.step('Add two items from the inventory page', async () => {
            await loginpage.GotoInventory(TEST_DATA.urls.inventory);
            await addcart.ClickAddToCart();
            await addcart.header.verifyBurgerMenuOpensAndCloses();
            await expect(addcart.cartbadgeiconcount).toHaveText('2');
            await expect(addcart.removeitemBtn).toBeVisible();
            await expect(addcart.removeitemBtn2).toBeVisible();
            await addcart.ClickOnBadgeIcon();
            await expect(page).toHaveURL(TEST_DATA.urls.cart);
        });

        await test.step('Check both items in the cart', async () => {
            await expect(cartpage.cartItem('Sauce Labs Backpack')).toBeVisible();
            await expect(cartpage.itemPrice('Sauce Labs Backpack')).toHaveText('$29.99');
            await expect(cartpage.itemQuantity('Sauce Labs Backpack')).toHaveText('1');

            await expect(cartpage.cartItem('Sauce Labs Bike Light')).toBeVisible();
            await expect(cartpage.itemPrice('Sauce Labs Bike Light')).toHaveText('$9.99');
            await expect(cartpage.itemQuantity('Sauce Labs Bike Light')).toHaveText('1');
        });

        await test.step('Remove one item from the cart', async () => {
            await cartpage.RemoveitemfromCart('Sauce Labs Bike Light');
            await expect(cartpage.cartItem('Sauce Labs Bike Light')).toHaveCount(0);
            await expect(addcart.cartbadgeiconcount).toHaveText('1');
        });

        await test.step('Go to checkout', async () => {
            await expect(cartpage.checkoutBtn).toBeVisible();
            await cartpage.header.verifyBurgerMenuOpensAndCloses();
            await cartpage.clickOnCheckOut();
            await expect(page).toHaveURL(TEST_DATA.urls.checkout);
        });

        await test.step('Fill the checkout form', async () => {
            await checkout.fillFrom();
            await checkout.header.verifyBurgerMenuOpensAndCloses();
            await checkout.clickOnContinue();
            await expect(page).toHaveURL(TEST_DATA.urls.checkout2);
        });

        await test.step('Check the order total and finish', async () => {
            await expect(checkoutfinal.productAmount).toHaveText('$29.99');
            await expect(checkoutfinal.tax).toHaveText('Tax: $2.40');
            await expect(checkoutfinal.finalamount).toHaveText('Total: $32.39');
            await checkoutfinal.header.verifyBurgerMenuOpensAndCloses();
            await checkoutfinal.clickOnFinished();
            await expect(page).toHaveURL(TEST_DATA.urls.checkoutComplete);
        });

        await test.step('Check the order complete page', async () => {
            await checkoutComplete.header.verifyBurgerMenuOpensAndCloses();
            await expect(checkoutComplete.orderCompleteHeader).toHaveText('Checkout: Complete!');
            await expect(checkoutComplete.orderCompleteText).toHaveText('Thank you for your order!');
            await expect(checkoutComplete.backhomeBtn).toBeVisible();
            await expect(checkoutComplete.GeneratePdfBtn).toBeVisible();
        });

        await test.step('Log out', async () => {
            await checkoutComplete.header.clickonLogout();
            await expect(checkoutComplete.header.logoutLink).toBeHidden();
            await expect(page).toHaveURL('/');
            await expect(loginpage.loginbtn).toBeVisible();
        });
    });
});