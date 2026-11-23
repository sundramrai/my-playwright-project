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
| Add to cart flow | `@Sanity` | End to end purchase: add a product, check the cart badge, product name, price and quantity, open and close the menu on each page, fill the checkout form, check item price, tax and total on the overview page, finish the order and check the "Thank you for your order!" page |

## Framework design

- **Page Object Model**: each page has its own class in `Pages/` with its locators and actions. Tests only call page methods and assert.
- **Reusable component**: the header (burger menu) is used on many pages, so it lives once in `Components/headerComponent.ts`.
- **BasePage**: `Pages/Basepage.ts` holds `page` and `header`. Page classes extend it, so every page gets the header without repeating code.
- **Custom fixtures**: `Fixture/PageFixture.ts` extends Playwright's `test` and creates the page objects. Tests receive them as parameters (`loginpage`, `cartpage`, ...), with no `new LoginPage(page)` in tests.
- **Log in once**: a `setup` project (`tests/auth.setup.ts`) logs in and saves the session with `storageState`. The browser projects depend on it and reuse the session, so cart tests start already logged in. Login tests clear the session to test the login page itself.
- **Environment config**: `Env/.env.dev` and `Env/.env.qa` hold the base URL and credentials. `Utils/ConfigReader.ts` loads the file for the chosen environment and throws a clear error if a value is missing.
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
│   └── AddToCart.spec.ts
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
ENV=qa npx playwright test                  # qa environment
npx playwright test --grep @smoke           # only tests tagged @smoke
npx playwright test --headed                # watch the browser
npx playwright show-report                  # open the HTML report
```

`ENV` picks the file `Env/.env.<ENV>`. If it is not set, `dev` is used.

## Note on the .env files

The `.env` files are committed so that CI can run. They only contain the public demo credentials published on the Sauce Demo login page. In a real project these files would be git-ignored and CI would read the values from GitHub Secrets.
