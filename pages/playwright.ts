import { Locator, Page, chromium, expect } from '@playwright/test';

export type LocatorType = 'locator' | 'text' | 'label' | 'placeholder' | 'altText' | 'title' | 'testId' | 'role';

export interface LocatorObject {
  locatorType: LocatorType;
  locatorValue: string;
}

export type ElementsObject = LocatorObject[];

export class Playwright {
  readonly page: Page;
  static page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goTo(url: string) {
    await this.page.goto(url);
  }

  async waitForPageToLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickElement(element: Locator, time: number = 0.5) {
    await this.wait(time * 1000);
    await element.click();
  }

  static async click(element: Locator) {
    await element.click();
  }

  async type(element: Locator, text: string) {
    const visible = await element.isVisible();
    if (visible) {
      await element.pressSequentially(text);
    }
  }

  static async fillField(element: Locator, text: string) {
    await element.fill(text);
  }

  static async createPage(url: string): Promise<Page> {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await Playwright.loadURL(url, page);
    return page;
  }

  async wait(time: number) {
    await this.page.waitForTimeout(time);
  }

  static async loadURL(url: string, page: Page = this.page) {
    await page.goto(url);
  }
}