//This contains locator information for the main page
// To improve we would import these from abstracted accessibility or test-id files in the app directly.
import { Page, Locator } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly leftBowlInputs: Locator[];
  readonly rightBowlInputs: Locator[];
  readonly weighButton: Locator;
  readonly resetButton: Locator;
  readonly coinButtons: Locator[];
  readonly alertMessage: Locator;
  readonly weighingsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leftBowlInputs = Array.from({ length: 9 }, (_, i) => page.locator(`#left_${i}`));
    this.rightBowlInputs = Array.from({ length: 9 }, (_, i) => page.locator(`#right_${i}`));
    this.weighButton = page.locator('#weigh');
    this.resetButton = page.locator('#reset').filter({ hasText: 'Reset' });
    this.coinButtons = Array.from({ length: 9 }, (_, i) => page.locator(`#coin_${i}`));
    this.alertMessage = page.locator('.alert');
    this.weighingsList = page.locator('.game-info ol li');
  }
    // Method to get a coin button locator by its ID
    coinButton(id: number): Locator {
        return this.page.locator(`#coin_${id}`);
      }
}