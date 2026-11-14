import {Locator, Page} from '@playwright/test'

export class AddCart{

    page:Page;
    addToCartbtn:Locator;
    badgeicon:Locator;
    removeitemBtn:Locator;
    cartbadgeiconcount:Locator;



    constructor(page:Page){

        this.page=page;
        this.addToCartbtn=page.locator('#add-to-cart-sauce-labs-backpack');
        this.badgeicon=page.locator('.shopping_cart_link');
        this.removeitemBtn=page.locator('#remove-sauce-labs-backpack');
        this.cartbadgeiconcount=page.locator('.shopping_cart_badge');

    }

    async ClickAddToCart(){
        await this.addToCartbtn.click();
    }


    async ClickOnBadgeIcon(){
        await this.badgeicon.click();
    }
}