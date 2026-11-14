import {test,expect} from '@playwright/test'
import { LoginPage } from '../Pages/LoginPage';
import { CartPage } from '../Pages/CartPage';
import { AddCart } from '../Pages/AddCart';
import { CheckOut } from '../Pages/CheckOut'


test('Add to cart flow using saved login', async function({page}){



    const loginInventery= new LoginPage(page);
    await loginInventery.GotoApplication();
    const addcart= new AddCart(page);
    await addcart.ClickAddToCart();
    await expect(addcart.badgeicon).toHaveText('1');
    await expect(addcart.removeitemBtn).toBeVisible();
    await addcart.ClickOnBadgeIcon();
    await expect(page).toHaveURL(/cart\.html/);
    const cartpage= new CartPage(page);
    await expect(cartpage.productname).toHaveText('Sauce Labs Backpack');
    await expect(cartpage.prizelevel).toHaveText('$29.99', { timeout: 10000 });
    await expect(cartpage.cartQuantity).toHaveText('1');
    await expect(cartpage.removebtn).toBeVisible();
    await expect(cartpage.checkoutBtn).toBeVisible();
    await cartpage.clickOnCheckOut();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    const checkout= new CheckOut(page);

    await checkout.fillFrom();
    await checkout.clickOnContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);



})