import { expect, test } from '@playwright/test';

test('Browser Context-Validation Error Login', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext();
    const page = await context.newPage();
    const userNameInput = page.locator("input#username");
    const userPassword = page.locator("input#password");
    const signInButton = page.locator("input#signInBtn");
    const alertIncorrectCredsText = page.locator("[style*='block']").textContent();

    // Act
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await userNameInput.fill("learning");
    await userPassword.fill("learning");
    await signInButton.click();

    // Assert
    expect(await alertIncorrectCredsText).toContain("Incorrect");
});

test('Browser Context-Validation Successful Login', async ({ browser }) => {
    // Arrange
    const context = await browser.newContext();
    const page = await context.newPage();
    const userNameInput = page.locator("input#username");
    const userPassword = page.locator("input#password");
    const signInButton = page.locator("input#signInBtn");

    // Act
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await userNameInput.fill("rahulshettyacademy");
    await userPassword.fill("learning");
    await signInButton.click();

    const cardTitles = page.locator(".card-body a");

    // Assert
    expect(await cardTitles.first().textContent()).toContain("iphone X");
    expect(await cardTitles.nth(1).textContent()).toContain("Samsung Note 8");
    expect(await cardTitles.allTextContents()).toContain("iphone X");
});


