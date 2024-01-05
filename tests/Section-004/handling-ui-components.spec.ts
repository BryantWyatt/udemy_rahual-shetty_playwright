import { test, expect } from "@playwright/test";

test.describe("UI Controls", () => {
        test.beforeEach(async ({ page }) => {
                await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        });
        test("Dropdown", async ({ page }) => {
                // Arrange
                const dropdown = page.locator("select.form-control");

                // Act
                await dropdown.selectOption("consult");

                // Assert
                // No assertion provided in the lecture
        })
        test("Radio Buttons & Popup", async ({ page }) => {
                // Arrange
                const permissionsRadioButton = page.locator(".radiotextsty");
                const popUp = page.locator("button#okayBtn");

                // Act
                // Lesson recommends this approach
                // await permissionsRadioButton.last().click();

                // I prefer this.
                await permissionsRadioButton.filter({ hasText: 'User' }).click();
                await popUp.click();

                // Assert
                await expect(permissionsRadioButton.filter({ hasText: 'User' })).toBeChecked();
        })
        test("Checkbox", async ({ page }) => {
                // Arrange
                const checkBoxToC = page.locator("input#terms");

                // Act
                await checkBoxToC.click();

                // Assert
                await expect(checkBoxToC).toBeChecked();
                await checkBoxToC.uncheck();
                expect(await checkBoxToC.isChecked()).toBeFalsy();
        });
        test("BlinkingText", async ({ page }) => {
                const documentLink = page.locator("[href*='documents-request']");

                await expect(documentLink).toHaveAttribute("class", "blinkingText");
        })
})

// This test is outside the scope so it opens it's own dedicated browser with context.
// TODO: Figure out how to work this with the existing before.
test("Child windows handling", async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const userNameInput = page.locator("input#username");
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const documentLink = page.locator("[href*='documents-request']");

        /*
                listen for any new page to open
                Three states of promises: Pending, Rejected, Fulfilled
        */
        const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                documentLink.click()
        ]);

        /*
                Text can return undefined which is not a valid string.
                To resolve this, if the text is undefined, we return an empty string.
        */
        const text = await newPage.locator(".red").textContent();
        const domain = text?.split("@")[1].split(" ")[0];

        await userNameInput.fill(domain ? domain : "");

});

