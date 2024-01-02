import { expect, test } from '@playwright/test';

test.describe("Section 2: Core Concepts", () => {
    test('Browser Context: First Playwright test', async ({ browser }) => {
        // Arrange
        const context = await browser.newContext();
        const page = await context.newPage();
    
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const title = await page.title();    

        // Assert
        expect(title).toEqual("LoginPage Practise | Rahul Shetty Academy");
    });

    test('Page Context: First Playwright test', async ({ page }) => {
        // Act
        await page.goto("https://google.com");

        // Assert
        await expect(page).toHaveTitle("Google");
    });
});


