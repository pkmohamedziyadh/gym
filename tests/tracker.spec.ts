import { expect, test } from "@playwright/test";

test("homepage opens the dashboard without horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Build your",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("link", { name: "Explore your dashboard" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next chapter." }),
  ).toBeVisible();
  await expect(
    page.getByText("Upper body push", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test("workout entry persists, can be removed, and reset needs confirmation", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(
    page.getByText("Upper body push", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Log workout", exact: true }).click();
  await page.getByLabel("Workout name").fill("Test strength session");
  await page.getByLabel("Duration (minutes)").fill("42");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(
    page.getByText("Test strength session", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText(
    "Entry saved in this browser.",
  );
  await page.reload();
  await expect(
    page.getByText("Test strength session", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByText("Test strength session", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete Test strength session", exact: true })
    .click();
  await expect(
    page.getByText("Test strength session", { exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByText("Test strength session", { exact: true }),
  ).toHaveCount(0);
});

test("calories and weight update the dashboard and persist", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(
    page.getByText("Upper body push", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Log calories", exact: true }).click();
  await page.getByLabel("Calories (kcal)").fill("300");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(
    page.getByRole("img", { name: "1940 of 2200 calories consumed today" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Log weight", exact: true })
    .last()
    .click();
  await page.getByLabel("Weight (kg)").fill("79.5");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(page.locator(".weight-summary")).toContainText("79.5");
  await page.reload();
  await expect(
    page.getByRole("img", { name: "1940 of 2200 calories consumed today" }),
  ).toBeVisible();
  await expect(page.locator(".weight-summary")).toContainText("79.5");
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "Reset data", exact: true }).click();
  await expect(
    page.getByRole("img", { name: "1640 of 2200 calories consumed today" }),
  ).toBeVisible();
  await expect(page.locator(".weight-summary")).toContainText("79.8");
});

test("invalid or inaccessible storage has a visible recovery message", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("forma-tracker-v1", '{"version": 9}'),
  );
  await page.goto("/dashboard");
  await expect(
    page.getByRole("alert").filter({ hasText: "Saved data could not be read" }),
  ).toBeVisible();
  await expect(
    page.getByText("Upper body push", { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page.getByRole("button", { name: "Log calories", exact: true }).click();
  await page.getByLabel("Calories (kcal)").fill("100");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Browser storage is unavailable" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("for this session");
});
