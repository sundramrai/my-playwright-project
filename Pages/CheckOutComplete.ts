import { Page, Locator } from "@playwright/test";
import { BasePage } from './Basepage'

export class CheckOutComplete extends BasePage{

    
    orderCompleteHeader:Locator;
    orderCompleteText:Locator;
    backhomeBtn:Locator;
    GeneratePdfBtn:Locator;
   


    constructor(page:Page){
        super(page);
        this.orderCompleteHeader=page.locator('.title');
        this.orderCompleteText=page.locator('.complete-header');
        this.backhomeBtn=page.locator('#back-to-products');
        this.GeneratePdfBtn=page.locator('#generate-pdf-order');
    
    }

   

    




}