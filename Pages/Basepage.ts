import { Page } from "@playwright/test";
import { Header } from "../Components/headerComponent";

export class BasePage {

    header: Header;
    page: Page;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
    }
}