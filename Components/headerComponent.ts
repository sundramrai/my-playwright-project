import {Page,Locator,expect} from '@playwright/test'

export class Header{

    page:Page;
    burgerMenu:Locator;
    burgermenuCloseIcon:Locator;
    logoutLink: Locator;


    constructor(page:Page){
        this.page=page;
        this.burgerMenu= page.locator('#react-burger-menu-btn');
        this.burgermenuCloseIcon=page.locator('#react-burger-cross-btn');
        this.logoutLink=page.locator('#logout_sidebar_link');
    }

    async clickOnopenBurger(){
        await this.burgerMenu.click();
    }

     async clickOnCloseBurger(){
        await this.burgermenuCloseIcon.click();
    }

    // Open the burger menu, check Logout shows, close it, check Logout hides.
    // Every page has this header, so the tests reuse this one method.
    async verifyBurgerMenuOpensAndCloses(){
        await this.clickOnopenBurger();
        await expect(this.logoutLink).toBeVisible();
        await this.clickOnCloseBurger();
        await expect(this.logoutLink).toBeHidden();
    }

    async clickonLogout(){
         await this.burgerMenu.click();
         await this.logoutLink.click();
    }
}