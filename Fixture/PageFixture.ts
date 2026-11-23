import {test as base} from '@playwright/test'
export {expect} from '@playwright/test'
import { LoginPage } from '../Pages/LoginPage';
import { AddCart } from '../Pages/AddCart';
import { CartPage } from '../Pages/CartPage';
import { CheckOut } from '../Pages/CheckOut';
import { CheckOutFinal } from '../Pages/CheckoutFinal';
import { CheckOutComplete } from '../Pages/CheckOutComplete';

type MyFixture={

    loginpage: LoginPage;
    addcart:AddCart;
    cartpage:CartPage;
    checkout:CheckOut;
    checkoutfinal:CheckOutFinal;
    checkoutComplete:CheckOutComplete;

}

export const test= base.extend<MyFixture>({

    loginpage: async function ({page},use){
        await use(new LoginPage(page))   
    },

    addcart :async function ({page},use) {
        await use(new AddCart(page))
    },

    cartpage: async function ({page},use) {
        await use(new CartPage(page))
        
    },

     checkout: async function ({page},use) {
        await use(new CheckOut(page))
        
    },


     checkoutfinal: async function ({page},use) {
        await use(new CheckOutFinal(page))
        
    },


    checkoutComplete: async function ({page},use) {
        await use(new CheckOutComplete(page))
        
    }



})