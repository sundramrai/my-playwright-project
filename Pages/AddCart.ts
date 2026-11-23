import {Locator, Page} from '@playwright/test'
import { BasePage } from './Basepage';

export class AddCart extends BasePage{

    
    addToCartbtn:Locator;
    badgeicon:Locator;
    removeitemBtn:Locator;
    removeitemBtn2:Locator;
    addtocartSecondBtn:Locator;
    cartbadgeiconcount:Locator;
    sortDropdown:Locator;
    itemNames:Locator;
    itemPrices:Locator;


    constructor(page:Page){

        super(page);
        this.addToCartbtn=page.locator('#add-to-cart-sauce-labs-backpack');
        this.badgeicon=page.locator('.shopping_cart_link');
        this.removeitemBtn=page.locator('#remove-sauce-labs-backpack');
        this.removeitemBtn2=page.locator('#remove-sauce-labs-bike-light');
        this.cartbadgeiconcount=page.locator('.shopping_cart_badge');
        this.addtocartSecondBtn=page.locator('#add-to-cart-sauce-labs-bike-light');
        this.sortDropdown=page.locator('[data-test="product-sort-container"]');
        this.itemNames=page.locator('.inventory_item_name');
        this.itemPrices=page.locator('.inventory_item_price');

    }

    async ClickAddToCart(){
        await this.addToCartbtn.click();
        await this.addtocartSecondBtn.click();
    }


    async ClickOnBadgeIcon(){
        await this.badgeicon.click();
    }


    // option: 'az' | 'za' | 'lohi' | 'hilo'
    async sortBy(option:string){
        await this.sortDropdown.selectOption(option);
    }

    // All product names, in the order shown on the page
    async getAllNames(){
        return await this.itemNames.allTextContents();
    }

    // All product prices as numbers: '$29.99' -> 29.99
    async getAllPrices(){
        const texts = await this.itemPrices.allTextContents();
        return texts.map(p => Number(p.replace('$', '')));
    }
}