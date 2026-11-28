import {APIRequestContext} from '@playwright/test'


export class BookingApi{

    request:APIRequestContext;

    constructor(request:APIRequestContext){
        this.request=request;
    }

    async getAllBooking(){
        return await this.request.get('/booking');
    }


    async getBooking(id: number) {
    return await this.request.get(`/booking/${id}`);
}


async createBooking(data: object) {
    return await this.request.post('/booking', { data: data });
}

async updateBookingDetails(id: number, data: object, token: string) {
   const responce = await this.request.put(`/booking/${id}`,{
    headers: { Cookie: `token=${token}` },
        data: data
   });
    return responce;

}

async deleteBooking(id:number, token:string){
     const deleteResponse = await this.request.delete(`/booking/${id}`, {
        headers: { Cookie: `token=${token}` }
    });
    return deleteResponse;


}



}