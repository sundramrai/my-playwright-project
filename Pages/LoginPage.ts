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

async GotoInventory(url : string){
    await this.page.goto(url);
}

async GotoApplication(){
    await this.page.goto('/');
}


async doLogin(username: string , password: string){
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginbtn.click();
}

}