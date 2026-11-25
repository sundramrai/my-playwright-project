import {test,expect} from '../Fixture/PageFixture'
import { TEST_DATA } from '../TestData/testData';
const sortCases = [
    { title: 'price low to high', option: 'lohi', type: 'price', order: 'asc',  firstItem: '$7.99' },
    { title: 'price high to low', option: 'hilo', type: 'price', order: 'desc', firstItem: '$49.99' },
   
    { title: 'name A to Z', option: 'az',   type: 'name',  order: 'asc',  firstItem: 'Sauce Labs Backpack', sortFirst: 'za' },
    { title: 'name Z to A', option: 'za',   type: 'name',  order: 'desc', firstItem: 'Test.allTheThings() T-Shirt (Red)' },
];
test.describe('Sorting', () => {
  test.beforeEach(async function ({ loginpage }) {
        await loginpage.GotoInventory(TEST_DATA.urls.inventory);
    });

    for (const c of sortCases) {

        test(`Sort by ${c.title}`, async function ({ addcart }) {
            if (c.sortFirst) {
                await addcart.sortBy(c.sortFirst);
            }
            await addcart.sortBy(c.option);

            if (c.type === 'price') {
                await expect(addcart.itemPrices.first()).toHaveText(c.firstItem);   // wait until the page is sorted
                const prices = await addcart.getAllPrices();
                const expected = [...prices].sort((a, b) => c.order === 'asc' ? a - b : b - a);
                expect(prices).toEqual(expected);
            } else {
                await expect(addcart.itemNames.first()).toHaveText(c.firstItem);
                const names = await addcart.getAllNames();
                const expected = [...names].sort();
                if (c.order === 'desc') expected.reverse();
                expect(names).toEqual(expected);
            }
        });
    }
});