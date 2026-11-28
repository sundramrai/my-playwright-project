
import { test, expect } from '../../Fixture/ApiFixture';
import BookingData from '../../TestData/BookingData.json'
import UpdateBookingData from '../../TestData/UpdateBookingData.json'


test.describe('Booking API', () => {

    test('@api GET all bookings returns a list of ids', async ({ BookingApi }) => {
        const response = await BookingApi.getAllBooking();

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toHaveProperty('bookingid');
    });

    test('@api Fetch one booking from Get method', async function ({ BookingApi }) {
        const response = await BookingApi.getAllBooking();
        expect(response.status()).toBe(200);
        const body = await response.json();

        const id = body[0].bookingid;
        const bookingresponse = await BookingApi.getBooking(id);
        expect(bookingresponse.status()).toBe(200);
        const bookingbody = await bookingresponse.json();

        expect(bookingbody).toHaveProperty('firstname');
        expect(bookingbody).toHaveProperty('lastname');
        expect(typeof bookingbody.totalprice).toBe('number');
        expect(bookingbody.bookingdates).toHaveProperty('checkin');
        expect(bookingbody.bookingdates).toHaveProperty('checkout');
    })



    test('@api Create post request', async function ({ BookingApi }) {



        const createpost = await BookingApi.createBooking(BookingData);
        expect(createpost.status()).toBe(200);
        const postBody = await createpost.json();
        expect(typeof postBody.bookingid).toBe('number');
        expect(postBody.booking.firstname).toBe(BookingData.firstname);

        const id = postBody.bookingid;
        const bookingresponse = await BookingApi.getBooking(id);
        expect(bookingresponse.status()).toBe(200);
        const bookingbody = await bookingresponse.json();

        // expect(bookingbody.firstname).toBe(NewBooking.firstname);
        // expect(bookingbody.lastname).toBe(NewBooking.lastname);
        // expect(bookingbody.totalprice).toBe(NewBooking.totalprice);
        // expect(bookingbody.bookingdates.checkin).toBe(NewBooking.bookingdates.checkin);
        // expect(bookingbody.bookingdates.checkout).toBe(NewBooking.bookingdates.checkout);

        expect(bookingbody).toEqual(BookingData);
    })


    test('@api Update and delete booking with auth token', async function ({ AuthApi, BookingApi }) {


        let id: number;
        let authToken: string;

        await test.step('get Auth token', async () => {

            authToken = await AuthApi.getToken();
        })


        await test.step('Creating booking', async () => {
            const createpost = await BookingApi.createBooking(BookingData);
            expect(createpost.status()).toBe(200);
            const postBody = await createpost.json();
            expect(typeof postBody.bookingid).toBe('number');
            expect(postBody.booking.firstname).toBe(BookingData.firstname);
            id = postBody.bookingid;
        })

        await test.step('Update booking with right Token', async () => {
            const updatedResponse = await BookingApi.updateBookingDetails(id, UpdateBookingData, authToken)
            expect(updatedResponse.status()).toBe(200);
            const updatedBody = await updatedResponse.json();
            expect(updatedBody.lastname).toBe(UpdateBookingData.lastname);
            expect(updatedBody.totalprice).toBe(UpdateBookingData.totalprice);
        })

        await test.step('Update booking with wrong Token', async function () {
            const updatedResponsewithwrongToken = await BookingApi.updateBookingDetails(id, UpdateBookingData, 'xyz');
            expect(updatedResponsewithwrongToken.status()).toBe(403);
        })




        await test.step('Delete booking', async function () {
            const deleteResponse = await BookingApi.deleteBooking(id, authToken);
            expect(deleteResponse.status()).toBe(201);


            const bookingresponse = await BookingApi.getBooking(id);
            expect(bookingresponse.status()).toBe(404);
        })
    })


    test('@api Booking ids are unique', async function ({ BookingApi }) {
        const response = await BookingApi.getAllBooking();
        expect(response.status()).toBe(200);
        const body = await response.json();
        const ids = body.map((booking: { bookingid: number }) => booking.bookingid);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    })

});