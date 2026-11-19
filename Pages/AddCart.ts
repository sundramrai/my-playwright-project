import {Locator, Page} from '@playwright/test'
import { BasePage } from './Basepage';

export class AddCart extends BasePage{

    
    addToCartbtn:Locator;
    badgeicon:Locator;
    removeitemBtn:Locator;
    cartbadgeiconcount:Locator;
    



    constructor(page:Page){

        super(page);
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