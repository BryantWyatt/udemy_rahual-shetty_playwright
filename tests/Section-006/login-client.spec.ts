/* 
 * In this section I devianted a bit from the lesson as the practice feels like a worst case scenario,
 * such that you are either...
 * a) Dealing with a legacy system where the dom is not allowed be changed
 * b) Devs are siloed/isolated and modifying the dom to be more amendable to automated testing is not possible
 * c) Tester does not feel comfortable adding testing tags

 * All the above said, this is acceptable for practice but there are cleaner ways to... 
 * access everything in this example which I hope is covered later.
 * 
 * There are multiple oppertunities for improvement by breaking out this file but
 * once again for the sake of this lecture, everything for the lesson is in this file.
*/

import { expect, test } from "@playwright/test";

test.describe("Checkout", () => {
  const email = "anshika@gmail.com"

  // Login before each test
  test.beforeEach(async ({ page }) => {
    // Arrange
    const userNameInput = page.locator("input#userEmail");
    const userPassword = page.locator("input#userPassword");
    const loginInButton = page.locator("[value='Login']");

    /*
     * Act
     * Fill out the form
     */
    await page.goto("https://rahulshettyacademy.com/client");
    await userNameInput.fill(email);
    await userPassword.fill("Iamking@000");
    await loginInButton.click();
  })

  test("Find first item in list", async ({ page }) => {
    // Arrange
    const productName: string = "ZARA COAT 3";
    const products = page.locator(".card-body");

    /*
      * https://playwright.dev/docs/api/class-frame#frame-wait-for-load-state
      * Discouraged, rely on web assertions to test readiness instead.
     */
    // await page.waitForLoadState('networkidle');

    // Relying on first works but not ideal.
    await page.locator(".card-body b").first().waitFor();

    // From lesson
    /*
     * Act
     * Locate productName to add to cart
     */
    const count = await products.count();
    for (let i = 0; i < count; ++i) {
      if ((await products.nth(i).locator("b").textContent()) === productName) {
        await products.nth(i).locator("text=Add To Cart").click();
        break;
      }
    }

    /*
     * Alternative approach
     * Having support for filter() or map() for locator() would make the implementation look cleaner
     * Playwright's recommendation for now is to use for-loops
      
     * Comparable in speed but not recommended due to size of list we are evaluating (3 items)
     * TODO: Determine how to pass the variable into the evaulateAll
     */
    // const cartItem = await products.locator("b").evaluateAll((list) =>
    //   list.findIndex(x => x.textContent === "ZARA COAT 3")
    // )  
    // await products.nth(cartItem).locator("text=Add To Cart").click();

    /*
     * Act
     * Click on the shopping cart in the header
     */
    await page.locator("[routerlink*='cart']").click();
    // Relying on first works but not ideal.

    // Wait for the first element to load in the My Cart section
    await page.locator("div li").first().waitFor();

    // Assert that our product is present
    expect(
      await page.locator(`h3:has-text('${productName}')`).isVisible()
    ).toBeTruthy();

    /*
     * From lesson
     * Using getBy... roles are preferred
     */
    // await page.locator("text=Checkout").click();
    await page.getByRole('button').getByText('Checkout').click();

    /*
     * From lesson
     * Using getBy... roles are preferred
     * pressSequentially is used in the instance that there is a type ahead that displays results
     */
    //await page.locator("[placeholder*='Country']").pressSequentially("India");

    /*
     * Act
     * Populate checkout
     */
    await page.getByPlaceholder('Select Country').pressSequentially("India");

    const selectCountryOptions = page.locator('.ta-results');
    await selectCountryOptions.waitFor();

    const selecCountryOptionsCount = await selectCountryOptions.locator('button').count();

    for (let i = 0; i < selecCountryOptionsCount; ++i) {
      const text = await selectCountryOptions.locator('button').nth(i).textContent();
      if (text?.trim() === "India") {
        await selectCountryOptions.locator('button').nth(i).click();
        break;
      }
    }

    /*
     * From Lesson
     * Using first matching element feels unreliable but understandable for this lesson.
     */
    // await expect(page.locator(".user__name [type='text']").first())

    await expect(page.locator(".user__name > label[type='text']")).toHaveText(email);

    /* 
     * Homework
     * Populate the other fields (CVV, Name on Card Apply Coupon)
     * Extra Credit (my idea) - Modify Expiry Date and CVV
     */

    /* 
     * Expiry Month & Date
     * Ideally, each one of these fields would...
     * a) getByRole for the dropdown
     * b) Have their own testId
     * 
     * For amusement sake, will drive the option selection based on current month and year.
     * In a real world scenario, this would be a questionable idea pending environment (laugh).
     */

    const currentDate  = new Date();
    const month = currentDate .getMonth() + 1;
    const formattedMonth = month < 10 ? '0' + month : month;

    // Expiry Date - Month
    await page.locator('.input.ddl').first().selectOption(String(formattedMonth));

    // Expiry Date - Year
    await page.locator('.input.ddl').nth(1).selectOption(String(currentDate .getFullYear()).substring(2));

    /* CVV Code ?
     * Once again, for fun, will use a random 3 digit number
     * The CVV field in this example can take more than 3 digits for some reason...
     * Do other countries have CVVs with more than 3 digits?
    */
    const randomCVV = Math.floor(Math.random() * 1000) + 1;
    // We could have done a first() or last() but looking for a bit more precious for what we have avalible
    await page.locator(".field.small > input[type='text']:not([name='coupon'])").fill(randomCVV.toString())

    /* Name on Card, will use the lecture's name, Rahul Shetty
     * Unfortunately no clean way to access this element
    */
    await page.locator(".field > input[type='text']").nth(2).fill("Rahul Shetty");

    // Apply Coupon
    const couponInput = page.locator("[name='coupon']")
    await couponInput.fill("rahulshettyacademy");
    await page.getByRole('button', { name: 'Apply Coupon' })

    // Place order
    await page.locator('.action__submit').click();
    await page.locator('.hero-primary').waitFor();

    await expect(page.locator('.hero-primary')).toHaveText("Thankyou for the order.");

    // Store the order
    let orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent()

    await page.locator("button[routerlink*='myorders']").click();

    const table = page.getByRole('table');
    const tableRows = table.locator('tr');

    const myOrderIds = table.locator("th:first-child");
    await tableRows.first().waitFor();

    const targetId = orderId?.replace(/\|/g, '').trim();

    expect(await myOrderIds.allTextContents()).toContain(targetId);

    for (let i = 0; i < await tableRows.count(); ++i) {
      if (await myOrderIds.nth(i).textContent() === targetId) {
        await tableRows.nth(i).getByRole('button', { name: 'View' }).click();
        break;
      }
    }

    await page.locator('.tagline').waitFor();
    expect(page.locator('.tagline')).toHaveText('Thank you for Shopping With Us');
    expect(page.locator('.col-text')).toHaveText(String(targetId));
  });
});