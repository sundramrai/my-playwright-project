import { Page, Locator } from "@playwright/test";
import { BasePage } from './Basepage'

export class CheckOutFinal extends BasePage{

    
    productAmount:Locator;
    tax:Locator;
    finalamount:Locator;
    FinishedBtn:Locator;
   


    constructor(page:Page){
        super(page);
        this.productAmount=page.locator('.cart_item .inventory_item_price');
        this.tax=page.locator('.summary_tax_label');
        this.finalamount=page.locator('.summary_total_label');
        this.FinishedBtn=page.locator('#finish');
    
    }

   

    async clickOnFinished(){
        await this.FinishedBtn.click();

    }




}