import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.hostmachine.com.au';

test.describe('Nexus Platform Comprehensive Audit', () => {

  test('Step 1: Public Site & Store Exploration', async ({ page }) => {
    console.log('>>> Checking Home Page...');
    const startHome = Date.now();
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Host Machine | Premium Game Systems/i);
    console.log(`Home Page Load: ${Date.now() - startHome}ms`);
    
    console.log('>>> Checking Discovery Engine presence...');
    await expect(page.locator('text=Discovery Engine')).toBeVisible();
    
    const categoryTitle = page.locator('text=Discovery Engine').locator('..').locator('p .text-gradient').first();
    const initialText = await categoryTitle.innerText();
    
    await page.locator('text=Available').click();
    await page.waitForTimeout(1000);
    const newText = await categoryTitle.innerText();
    expect(initialText).not.toBe(newText);

    console.log('>>> Checking Store Page Assets...');
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('text=Global Game Market')).toBeVisible();
    
    const firstCard = page.locator('.glass-card').first();
    await expect(firstCard).toBeVisible();

    // Relaxed Image Check: Accept banners or unsplash
    const img = firstCard.locator('img');
    await expect(img).toBeVisible();
    const imgSrc = await img.getAttribute('src');
    console.log(`First Game Image: ${imgSrc}`);
    expect(imgSrc).toMatch(/banners|unsplash/);
  });

  test('Step 2: Authentication Flow (Mock Login)', async ({ page }) => {
    console.log(`>>> Attempting Login with Test Account...`);
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test');
    await page.click('button:has-text("ESTABLISH UPLINK")');
    
    await page.waitForURL('**/dashboard');
    console.log('>>> Dashboard access confirmed.');
    // Correct label for main dashboard
    await expect(page.locator('text=Active Plan')).toBeVisible();
  });

  test('Step 3: New Server Wizard (The Discovery Engine)', async ({ page }) => {
    console.log('>>> Testing Server Deployment Wizard...');
    
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test');
    await page.click('button:has-text("ESTABLISH UPLINK")');
    await page.waitForURL('**/dashboard');

    await page.goto(`${BASE_URL}/servers/new`);
    await page.click('text=Fixed Module');

    console.log('>>> Discovery Engine Wizard Step...');
    await expect(page.locator('text=Discovery Engine')).toBeVisible();
    
    console.log('>>> Testing Search...');
    const searchInput = page.locator('input[placeholder="Search manifest..."]');
    await searchInput.fill('Minecraft');
    await page.waitForTimeout(1500); 
    
    // Minecraft might be hidden if category isn't 'game'
    // Category defaults to 'game' in code, so it should be fine.
    const mcCard = page.locator('h4:has-text("Minecraft")');
    if (!(await mcCard.isVisible())) {
        console.log('>>> Minecraft not visible, checking categories...');
        // Force click Games category if needed (Discovery engine style)
        // But in our wizard it cycles by clicking the title
        let attempts = 0;
        while(!(await mcCard.isVisible()) && attempts < 3) {
            await page.locator('text=Available').click();
            await page.waitForTimeout(1000);
            attempts++;
        }
    }
    
    await expect(mcCard).toBeVisible();
    await mcCard.click();
    
    console.log('>>> Testing Deployment Step...');
    await page.click('text=Sydney');
    await page.locator('.glass-card p:has-text("vCPU")').first().click(); // Click first plan
    await page.click('text=CONTINUE SEQUENCE');

    console.log('>>> Testing Configuration Step...');
    await page.fill('input[placeholder="omega-node"]', 'playwright-v5');
    await page.click('text=CONTINUE SEQUENCE');

    console.log('>>> Final Review Step...');
    await expect(page.locator('text=Final Review')).toBeVisible();
    await expect(page.locator('text=playwright-v5')).toBeVisible();
  });

  test('Step 4: Admin Panel Audit', async ({ page }) => {
    console.log('>>> Checking Admin Interface...');
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'mekwell@hotmail.com');
    await page.fill('input[type="password"]', 'mekwell');
    await page.click('button:has-text("ESTABLISH UPLINK")');
    await page.waitForURL('**/admin');

    await page.goto(`${BASE_URL}/admin/containers`);
    await expect(page.locator('text=Global Grid')).toBeVisible();
    
    console.log('>>> Checking User Directory...');
    await page.goto(`${BASE_URL}/admin/users`);
    await expect(page.getByRole('heading', { name: 'User Directory' })).toBeVisible();
  });

});
