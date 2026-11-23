import {Page,Locator} from '@playwright/test'

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

    async clickonLogout(){
         await this.burgerMenu.click();
         await this.logoutLink.click();
    }
}