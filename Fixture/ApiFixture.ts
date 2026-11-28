import { AuthApi } from "../Api/AuthApi";
import { BookingApi } from "../Api/BookingApi";
import {test as base} from '@playwright/test'
export {expect} from '@playwright/test' 

type ApiFixture={
    AuthApi: AuthApi;
    BookingApi:BookingApi;
}


export const test=base.extend<ApiFixture>({
    AuthApi:async function ({request},use) {
    await use(new AuthApi(request));        
    },


     BookingApi:async function ({request},use) {
    await use(new BookingApi(request));        
    }
})