import { expect, test } from "@playwright/test"

test('Find first item in list', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext();
    const page = await context.newPage();
    const userNameInput = page.locator("input#userEmail");
    const userPassword = page.locator("input#userPassword");
    const loginInButton = page.locator("[value='Login']");
    
    // Act
    await page.goto("https://rahulshettyacademy.com/client");
    await userNameInput.fill("anshika@gmail.com");
    await userPassword.fill("Iamking@000");
    await loginInButton.click();

    /*
      https://playwright.dev/docs/api/class-frame#frame-wait-for-load-state
      Discouraged, rely on web assertions to ssess readiness instead.
    */
    // await page.waitForLoadState('networkidle');
    const cardTitles = page.locator(".card-body b");
    await cardTitles.first().waitFor();
    const cardTitlesText = await cardTitles.allTextContents();

    // Assert
    expect(cardTitlesText).toContain("ZARA COAT 3");
});