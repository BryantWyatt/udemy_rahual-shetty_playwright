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
})

