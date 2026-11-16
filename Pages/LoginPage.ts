import {Locator, Page} from '@playwright/test'

export class LoginPage{

page:Page;
username:Locator;
password:Locator;
loginbtn:Locator;
errormsg:Locator;


constructor(page:Page){

    this.page=page;
    this.username=page.locator('#user-name');
    this.password=page.locator('#password');
    this.loginbtn=page.locator('#login-button')
    this.errormsg = page.locator('[data-test="error"]');

}

async GotoInventory(){
    await this.page.goto('https://www.saucedemo.com/inventory.html');
}

async GotoApplication(){
    await this.page.goto('https://www.saucedemo.com');
}


async doLogin(){
    await this.username.fill('standard_user');
    await this.password.fill('secret_sauce');
    await this.loginbtn.click();
}

async doInvalidLogin(){
    await this.username.fill('standard_');
    await this.password.fill('secret_sauc');
    await this.loginbtn.click();
}


}