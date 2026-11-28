# Playwright Test Automation Framework

UI and API test automation built with **Playwright** and **TypeScript**:

- **UI tests** for the [Sauce Demo](https://www.saucedemo.com) e-commerce site, using the Page Object Model
- **API tests** for the [Restful Booker](https://restful-booker.herokuapp.com) booking API, using the same object-model idea for API calls

Tests run in GitHub Actions on every push and pull request to `main`: UI tests in Chromium, Firefox and WebKit, and API tests in their own `api` project with no browser.

## Tech stack

- Playwright Test
- TypeScript
- dotenv (environment config)
- GitHub Actions (CI)

## What is covered

### UI tests (Sauce Demo)

| Test | Tag | What it checks |
|------|-----|----------------|
| Invalid login | `@smoke` | Wrong username and password show the "do not match" error and stay on the login page |
| Locked user login | `@regression` | A locked-out user sees the "locked out" error |
| Add to cart flow | `@Sanity` | End to end purchase: add two products, check the cart badge, each item's name, price and quantity, remove one item and check it is gone, open and close the menu on each page, fill the checkout form, check item price, tax and total on the overview page, finish the order, check the "Thank you for your order!" page, then log out |
| Sort by price | | Low to high and high to low: the prices on the page match the same prices sorted in code |
| Sort by name | | A to Z and Z to A: the names on the page match the same names sorted in code |

Cart items are found by product name (`cartpage.itemPrice('Sauce Labs Backpack')`), so the same methods work for any number of products.

### API tests (Restful Booker)

All API tests are tagged `@api`.

| Test | What it checks |
|------|----------------|
| GET all bookings | Status 200, the body is a non-empty list and each item has a `bookingid` |
| GET one booking | Takes a real id from the list, then checks status 200 and that the booking has name, price and check-in/check-out dates |
| Create booking | POST a new booking from `TestData/BookingData.json`, then GET the same id and check the saved booking equals the data that was sent |
| Update and delete with auth token | In `test.step` blocks: get a token from `/auth`, create a booking, update it with the token (200 and the new values come back), update with a wrong token (403), delete it (201), then GET it again (404) |
| Booking ids are unique | No id appears twice in the booking list |

The demo API is shared by everyone, so tests never depend on a fixed booking id: they create their own booking or take an id from the current list.

## Framework design

- **Page Object Model**: each page has its own class in `Pages/` with its locators and actions. Tests only call page methods and assert.
- **Reusable component**: the header (burger menu) is used on many pages, so it lives once in `Components/headerComponent.ts`. Its `verifyBurgerMenuOpensAndCloses()` method replaces the same four lines that were repeated on every page.
- **BasePage**: `Pages/Basepage.ts` holds `page` and `header`. Page classes extend it, so every page gets the header without repeating code.
- **Custom fixtures**: `Fixture/PageFixture.ts` extends Playwright's `test` and creates the page objects. Tests receive them as parameters (`loginpage`, `cartpage`, ...), with no `new LoginPage(page)` in tests.
- **Log in once**: a `setup` project (`tests/auth.setup.ts`) logs in and saves the session with `storageState`. The browser projects depend on it and reuse the session, so cart tests start already logged in. Login tests clear the session to test the login page itself.
- **Environment config**: `Env/.env.dev` and `Env/.env.qa` hold the base URL and credentials. `Utils/ConfigReader.ts` loads the file for the chosen environment and throws a clear error if a value is missing.
- **Spec files by feature**: login, cart and sorting tests are in separate files. Every test is independent (cart and sort tests start from the saved session), so the files can run in any order or in parallel.
- **Test steps**: the long purchase test is split into named `test.step` blocks (add items, check cart, checkout, order total, ...), so the HTML report shows which part failed.
- **Data-driven tests**: the sort tests are one test inside a loop over a `sortCases` table (dropdown value, expected first item, order). Adding a new sort case is one new row.
- **API object model**: `Api/AuthApi.ts` and `Api/BookingApi.ts` hold the API calls, the same way page classes hold page actions. `AuthApi.getToken()` logs in and returns the token. `BookingApi` methods (get, create, update, delete) only send the request and return the response; the test decides which status is expected. That is how one `updateBookingDetails()` method is used for both the 200 (valid token) and the 403 (wrong token) checks.
- **API fixtures**: `Fixture/ApiFixture.ts` builds the API classes from Playwright's `request` fixture, so API tests receive them as parameters, like the page fixtures.
- **Separate API project**: the `api` project in `playwright.config.ts` runs only `tests/api/`, with the API base URL and an `Accept: application/json` header. It has no browser and no login session, and the browser projects ignore `tests/api/`, so API tests run once instead of once per browser.
- **Test data**: users (valid, invalid, locked) are in `TestData/UserData.json`. Page URLs are in `TestData/testData.ts` and are relative, so they work with `baseURL`. API request bodies are in `TestData/BookingData.json` and `TestData/UpdateBookingData.json`.

## Project structure

```
├── Api/                 API classes: AuthApi (token), BookingApi (CRUD)
├── Components/          Reusable UI parts (Header)
├── Env/                 .env.dev, .env.qa
├── Fixture/             PageFixture (page objects), ApiFixture (API classes)
├── Pages/               Page objects + BasePage
├── TestData/            JSON users, URL paths, booking request bodies
├── Utils/               ConfigReader (reads env values)
├── tests/
│   ├── auth.setup.ts    Logs in once, saves session
│   ├── Login.spec.ts    Invalid and locked user login
│   ├── Cart.spec.ts     Add to cart through order complete
│   ├── Sort.spec.ts     Data-driven sorting tests
│   └── api/
│       └── booking.spec.ts   Restful Booker API tests
├── playwright.config.ts
└── .github/workflows/   CI pipeline
```

## Run the tests

Install:

```bash
npm ci
npx playwright install
```

Run:

```bash
npx playwright test                         # everything: all browsers + API, dev environment
npx playwright test --project=chromium      # UI tests in one browser
npx playwright test --project=api           # only API tests
npx playwright test --grep @api             # only tests tagged @api
npx playwright test Cart                    # one spec file (Login, Cart or Sort)
ENV=qa npx playwright test                  # qa environment
npx playwright test --grep @smoke           # only tests tagged @smoke
npx playwright test --headed                # watch the browser
npx playwright show-report                  # open the HTML report
```

`ENV` picks the file `Env/.env.<ENV>`. If it is not set, `dev` is used.

## Note on the .env files

The `.env` files are committed so that CI can run. They only contain the public demo credentials published by Sauce Demo and Restful Booker. In a real project these files would be git-ignored and CI would read the values from GitHub Secrets.
