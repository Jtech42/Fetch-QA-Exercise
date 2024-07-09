import { test, expect } from '@playwright/test';
import { AutomationFramework } from '../automation-framework';
import { MainPage } from '../pages/main-page';


test('Find the faker', async ({ page }) => {
  const framework = new AutomationFramework(page);
  const mainPage = new MainPage(page);

  // Navigate to the challenge page and wait for it to load
  await framework.goTo('http://sdetchallenge.fetch.com/');
  await framework.waitForPageToLoad();

  // Initialize an array representing the 9 bars
  const bars = Array.from({ length: 9 }, (_, i) => i);

  // Function to weigh bars and determine which side is heavier, lighter, or if they are equal
  async function weighBars(left: number[], right: number[]): Promise<'left' | 'right' | 'equal'> {
    await clearAllInputs();
    await fillBowlInputs(left, mainPage.leftBowlInputs);
    await fillBowlInputs(right, mainPage.rightBowlInputs);
    await verifyInputValues(left, mainPage.leftBowlInputs);
    await verifyInputValues(right, mainPage.rightBowlInputs);

    await AutomationFramework.click(mainPage.weighButton);
    const result = await getLatestWeighingResult();

    await AutomationFramework.click(mainPage.resetButton);
    return interpretWeighingResult(result);
  }

  // Recursive function to find the fake bar by dividing the bars into thirds and weighing
  async function findFakeBar(bars: number[]): Promise<number> {
    if (bars.length === 1) return bars[0];

    const third = Math.floor(bars.length / 3);
    const left = bars.slice(0, third);
    const right = bars.slice(third, 2 * third);
    const remaining = bars.slice(2 * third);
    const result = await weighBars(left, right);
    return result === 'left' ? findFakeBar(left) :
           result === 'right' ? findFakeBar(right) : findFakeBar(remaining);

  }

  const fakeBar = await findFakeBar(bars);
  console.log(`Bar #: ${fakeBar} is a great big phoney!`);

  // Handle dialog events triggered by the application
  page.on('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.accept();
  });

  // Click on the fake bar button based on the identified fake bar
  const fakeBarButton = mainPage.coinButton(fakeBar);
  await AutomationFramework.click(fakeBarButton);

  // Page Interaction Functions
  async function clearAllInputs() {
    for (let i = 0; i < 9; i++) {
      await AutomationFramework.fillField(mainPage.leftBowlInputs[i], '');
      await AutomationFramework.fillField(mainPage.rightBowlInputs[i], '');
    }
  }

  async function fillBowlInputs(indices: number[], bowlInputs: any) {
    for (const index of indices) {
      await AutomationFramework.fillField(bowlInputs[index], index.toString());
    }
  }

  async function verifyInputValues(indices: number[], bowlInputs: any) {
    for (const index of indices) {
      await expect(bowlInputs[index]).toHaveValue(index.toString());
    }
  }

  async function getLatestWeighingResult(): Promise<string> {
    const previousWeighingsCount = (await mainPage.weighingsList.allTextContents()).length;
    await page.waitForFunction(
      (count) => document.querySelectorAll('ol li').length > count,
      previousWeighingsCount
    );
    const weighingsListItems = await mainPage.weighingsList.allTextContents();
    const latestResult = weighingsListItems[weighingsListItems.length - 1];
    
    // Print the latest weighing result
    console.log(latestResult);
    
    return latestResult;
 }

  function interpretWeighingResult(result: string): 'left' | 'right' | 'equal' {
    if (result.includes('>')) return 'right';
    if (result.includes('<')) return 'left';
    return 'equal';
  }

});