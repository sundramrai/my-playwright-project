# Playwright Test Automation Framework

UI test automation for the [Sauce Demo](https://www.saucedemo.com) e-commerce site, built with **Playwright** and **TypeScript** using the Page Object Model.

Tests run in GitHub Actions on every push and pull request to `main`, in Chromium, Firefox and WebKit.

## Tech stack

- Playwright Test
- TypeScript
- dotenv (environment config)
- GitHub Actions (CI)

## What is covered

| Test | Tag | What it checks |
|------|-----|----------------|
| Invalid login | `@smoke` | Wrong username and password show the "do not match" error and stay on the login page |
| Locked user login | `@regression` | A locked-out user sees the "locked out" error |
| Add to cart flow | `@Sanity` | End to end purchase: add two products, check the cart badge, each item's name, price and quantity, remove one item and check it is gone, open and close the menu on each page, fill the checkout form, check item price, tax and total on the overview page, finish the order, check the "Thank you for your order!" page, then log out |
| Sort by price | | Low to high and high to low: the prices on the page match the same prices sorted in code |
| Sort by name | | A to Z and Z to A: the names on the page match the same names sorted in code |

Cart items are found by product name (`cartpage.itemPrice('Sauce Labs Backpack')`), so the same methods work for any number of products.

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
- **Test data**: users (valid, invalid, locked) are in `TestData/UserData.json`. Page URLs are in `TestData/testData.ts` and are relative, so they work with `baseURL`.

## Project structure

```
├── Components/          Reusable UI parts (Header)
├── Env/                 .env.dev, .env.qa
├── Fixture/             Custom fixtures that create page objects
├── Pages/               Page objects + BasePage
├── TestData/            JSON users, URL paths
├── Utils/               ConfigReader (reads env values)
├── tests/
│   ├── auth.setup.ts    Logs in once, saves session
│   ├── Login.spec.ts    Invalid and locked user login
│   ├── Cart.spec.ts     Add to cart through order complete
│   └── Sort.spec.ts     Data-driven sorting tests
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
npx playwright test                         # all browsers, dev environment
npx playwright test --project=chromium      # one browser
npx playwright test Cart                    # one spec file (Login, Cart or Sort)
ENV=qa npx playwright test                  # qa environment
npx playwright test --grep @smoke           # only tests tagged @smoke
npx playwright test --headed                # watch the browser
npx playwright show-report                  # open the HTML report
```

`ENV` picks the file `Env/.env.<ENV>`. If it is not set, `dev` is used.

## Note on the .env files

The `.env` files are committed so that CI can run. They only contain the public demo credentials published on the Sauce Demo login page. In a real project these files would be git-ignored and CI would read the values from GitHub Secrets.
