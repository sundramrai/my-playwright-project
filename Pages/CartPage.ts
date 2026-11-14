import { Page, Locator } from '@playwright/test';


export class CartPage{

    page:Page;
    prizelevel:Locator;
    removebtn:Locator;
    productname:Locator;
    cartQuantity:Locator;
    checkoutBtn:Locator;

    constructor(page:Page){

        this.page=page;
        this.prizelevel=page.locator('.cart_item .inventory_item_price');
        this.removebtn=page.locator('#remove-sauce-labs-backpack')
        this.productname=page.locator('.cart_item .inventory_item_name');
        this.cartQuantity=page.locator('.cart_item .cart_quantity');
        this.checkoutBtn=page.locator('#checkout');
    }

    async clickOnCheckOut(){
        await this.checkoutBtn.click();
    }
}