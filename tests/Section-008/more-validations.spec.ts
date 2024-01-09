import { expect, test } from "@playwright/test";

test.describe("Handling Web dialogs, Frames and Event listeners", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    })

    test("Navigation", async ({ page }) => {
        await page.goto("https://google.com");
        await page.goBack();
        await page.goForward();
    });

    test("Hidden element", async ({ page }) => {
        const confirmButton = page.locator("input#displayed-text")
        await expect(confirmButton).toBeVisible();
        await page.locator("#hide-textbox").click();
        await expect(confirmButton).toBeHidden();
    });

    test("Pop up Dialog", async ({ page }) => {
        page.on("dialog", dialog => {
            dialog.accept();
        });
        await page.locator('input#confirmbtn').click();
    });
    test("Hover", async ({ page}) => {
        await page.getByRole("button", {name: "Mouse Hover"});
    })
    test("iFrames", async({page}) => {
        const iFrame = page.frameLocator("#courses-iframe");
        await iFrame.getByRole("link", {name: "All Access Plan", includeHidden: false}).click();

        // Console logging the number for demo purposes. Not assertions for this test.
        const subscriberText = await iFrame.locator(".text h2").textContent();
        const subscriberCount = subscriberText?.split(" ")[1];
        console.log(subscriberCount);
    })
})

