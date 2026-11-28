import { test, expect } from '@playwright/test'



test('shows mocked fruit list', async ({ page }) => {

    await page.route('**/api/v1/fruits', async route => {
        await route.fulfill({
            json: [{ name: 'Mango', id: 1 }, { name: 'Litchi', id: 2 }]   // nakli data
        });
    });

    await page.goto('https://demo.playwright.dev/api-mocking/');

    const fruits = page.getByRole('listitem');
    await expect(fruits).toHaveText(['Mango', 'Litchi']);
    const strawberry = page.getByText('Strawberry');
    await expect(strawberry).toHaveCount(0);

});


test('Insert Our fruit in actual list', async function ({ page }) {

    let count = 0;
    await page.route('**/api/v1/fruits', async route => {
        const list = await route.fetch();
        const json = await list.json();
        count = json.length;
        json.push({ name: 'playwright fruit', id: 100 });
        await route.fulfill({ response: list, json });

    });
    await page.goto('https://demo.playwright.dev/api-mocking/');
    const fruitlist = page.getByRole('listitem');
    await expect(fruitlist.last()).toHaveText('playwright fruit');
    await expect(fruitlist).toHaveCount(count + 1);

})


test('test server error 500',async function({page}){

    await page.route('**/api/v1/fruits', async route => {
       await  route.fulfill({status:500});

    });
    const responsePromise = page.waitForResponse('**/api/v1/fruits');
    await page.goto('https://demo.playwright.dev/api-mocking/');
    const response= await responsePromise;
    expect(response.status()).toBe(500);
    await expect(page.getByText('Loading...')).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(0);
})


test('test server Abort case',async function({page}){

    await page.route('**/api/v1/fruits', async route => {
       await  route.abort();

    });
    const failedPromise = page.waitForEvent('requestfailed');
    await page.goto('https://demo.playwright.dev/api-mocking/');
    const failedresponse= await failedPromise;
    expect(failedresponse.url()).toContain('api/v1/fruits');
    await expect(page.getByText('Loading...')).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(0);
})
