import { Page, Locator } from "@playwright/test";
import { BasePage } from './Basepage'

export class CheckOut extends BasePage{

    
    firstname:Locator;
    secondname:Locator;
    zipcode:Locator;
    continue:Locator;
   


    constructor(page:Page){
        super(page);
        this.firstname=page.locator('#first-name');
        this.secondname=page.locator('#last-name');
        this.zipcode=page.locator('#postal-code');
        this.continue=page.locator('#continue');
    
    }

    async fillFrom(){
        await this.firstname.fill('sundram');
        await this.secondname.fill('rai');
        await this.zipcode.fill('221003');
    }

    async clickOnContinue(){
        await this.continue.click();

    }




}