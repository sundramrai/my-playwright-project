import {Locator, Page} from '@playwright/test'

export class LoginPage{

page:Page;
username:Locator;
password:Locator;
loginbtn:Locator;

constructor(page:Page){

    this.page=page;
    this.username=page.locator('#user-name');
    this.password=page.locator('#password');
    this.loginbtn=page.locator('#login-button')
}

async GotoApplication(){
    await this.page.goto('https://www.saucedemo.com/inventory.html');
}

async doLogin(){
    await this.username.fill('standard_user');
    await this.password.fill('secret_sauce');
    await this.loginbtn.click();
}


}