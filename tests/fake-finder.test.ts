import { test, chromium, Page } from '../test';
import { PwAbstractPage } from '../pages/playwright';

class FakeGoldBarTest extends PwAbstractPage {
  leftBowl: Locator;
  rightBowl: Locator;
  weighButton: Locator;
  resetButton: Locator;
  result: Locator;
  weighingList: Locator;
  fakeBarButton: Locator[];

  constructor(page: Page) {
    super(page);
    this.leftBowl = this.page.locator('#leftBowl');
    this.rightBowl = this.page.locator('#rightBowl');
    this.weighButton = this.page.locator('#weighButton');
    this.resetButton = this.page.locator('#resetButton');
    this.result = this.page.locator('#result');
    this.weighingList = this.page.locator('#weighingList');
    this.fakeBarButton = Array.from({ length: 9 }, (_, i) => this.page.locator(`#barButton${i}`));
  }

  async weigh(left: number[], right: number[]): Promise<string> {
    await this.resetButton.click();
    await this.leftBowl.fill(left.join(' '));
    await this.rightBowl.fill(right.join(' '));
    await this.weighButton.click();
    await this.page.waitForTimeout(1000); // Wait for the result to be displayed
    return await this.result.textContent();
  }

  async findFakeBar(): Promise<number> {
    let bars = Array.from({ length: 9 }, (_, i) => i);
    
    while (bars.length > 1) {
      const split = Math.floor(bars.length / 3);
      const left = bars.slice(0, split);
      const right = bars.slice(split, 2 * split);
      const remainder = bars.slice(2 * split);
      
      const result = await this.weigh(left, right);
      
      if (result.includes('left')) {
        bars = left;
      } else if (result.includes('right')) {
        bars = right;
      } else {
        bars = remainder;
      }
    }
    
    return bars[0];
  }
}

test('find the fake gold bar', async ({ page }) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = 'http://sdetchallenge.fetch.com/';
  
  await page.goto(url);
  const fakeGoldBarTest = new FakeGoldBarTest(page);
  
  const fakeBar = await fakeGoldBarTest.findFakeBar();
  console.log(`The fake gold bar is number ${fakeBar}`);
  
  await fakeGoldBarTest.fakeBarButton[fakeBar].click();
  
  const alert = await page.waitForEvent('dialog');
  console.log(alert.message());
  await alert.accept();
  
  const weighings = await fakeGoldBarTest.weighingList.textContent();
  console.log('List of weighings:');
  console.log(weighings);
  
  await browser.close();
});