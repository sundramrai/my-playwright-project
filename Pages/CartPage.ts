import { Page, Locator } from '@playwright/test';
import { BasePage } from './Basepage';


export class CartPage extends BasePage {

    checkoutBtn: Locator;


    constructor(page: Page) {

        super(page);
        this.checkoutBtn = page.locator('#checkout');
    }


    // One cart item (row), found by its product name
    cartItem(name: string) {
        return this.page.locator('.cart_item').filter({ hasText: name });
    }

    itemPrice(name: string) { return this.cartItem(name).locator('.inventory_item_price'); }
    itemQuantity(name: string) { return this.cartItem(name).locator('.cart_quantity'); }
    itemRemoveBtn(name: string) { return this.cartItem(name).getByRole('button', { name: 'Remove' }); }


    async clickOnCheckOut() {
        await this.checkoutBtn.click();
    }


    async RemoveitemfromCart(productName: string) {
        await this.itemRemoveBtn(productName).click();
    }
}
