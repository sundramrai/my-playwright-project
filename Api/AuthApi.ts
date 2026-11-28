import {APIRequestContext, expect} from '@playwright/test'
import { ConfigReader} from '../Utils/ConfigReader'

export class AuthApi{

    request:APIRequestContext;

    constructor(request:APIRequestContext){
        this.request=request;
    }


    async getToken(){

    const authResponse = await this.request.post(`/auth`, {
        data: { username: ConfigReader.apiUser, password: ConfigReader.apiPassword }
    })


    expect(authResponse.status()).toBe(200);

    const authbody = await authResponse.json();
    expect(typeof authbody.token).toBe('string');
    return authbody.token;

    }


}