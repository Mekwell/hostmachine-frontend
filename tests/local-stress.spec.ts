import { test, expect } from '@playwright/test';

// Configuration
const BASE_URL = 'https://hostmachine.com.au';
const USER_EMAIL = 'test@test.com';
const USER_PASS = 'test';
const TEST_GAME_TYPE = 'minecraft'; 
const SERVER_COUNT = 3;

test.describe('HostMachine Local Stress Test', () => {
  test.setTimeout(180000); // Increase global timeout to 3 minutes

  test.beforeEach(async ({ page }) => {
    // 1. Login
    console.log('>>> Logging in...');
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASS);
    await page.click('button:has-text("ESTABLISH UPLINK")');
    await page.waitForURL('**/dashboard');
    console.log('>>> Login successful.');
  });

  test(`Deploy ${SERVER_COUNT} Concurrent Game Servers`, async ({ page }) => {
    // 3. Loop to create servers
    for (let i = 0; i < SERVER_COUNT; i++) {
        const serverName = `Stress-MC-${i}-${Date.now().toString().slice(-4)}`;
        console.log(`>>> Deploying Server ${i + 1}/${SERVER_COUNT}: ${serverName}`);

        // Go to Wizard (from Dashboard or finish previous loop)
        await page.goto(`${BASE_URL}/dashboard`);
        
        // Click "Deploy New Module"
        await page.click('text=Deploy New Module');
        
        // Wait for navigation
        await page.waitForURL('**/servers/new');
        console.log('>>> Entered Wizard.');
        
        // --- STEP 1: PATH ---
        await expect(page.locator('h2')).toContainText('Protocol', { timeout: 10000 });
        await page.click('text=Fixed Module');

        // --- STEP 2: GAME ---
        await expect(page.locator('text=Discovery Engine')).toBeVisible();
        
        // Use Search to find Minecraft reliably
        console.log('>>> Searching for Minecraft...');
        await page.fill('input[placeholder="Search manifest..."]', 'Minecraft');
        
        // Wait for filtering
        await page.waitForTimeout(1000);
        
        // Select Minecraft (Java)
        await page.click('text=Minecraft (Java)');

        // --- STEP 3: DEPLOYMENT (Region & Plan) ---
        await expect(page.locator('text=1. Region')).toBeVisible();
        
        // Select Region (Sydney/First)
        const regionBtn = page.locator('button:has-text("Sydney")').first();
        if (await regionBtn.isVisible()) {
             await regionBtn.click();
        } else {
             await page.locator('text=1. Region').locator('..').locator('button').first().click();
        }

        // Select Plan (First one)
        await page.locator('text=2. Plan').locator('..').locator('button').first().click();
        
        // Continue
        await page.click('text=CONTINUE SEQUENCE');

        // --- STEP 4: CONFIGURATION ---
        await expect(page.locator('text=1. Identity')).toBeVisible();
        await page.fill('input[placeholder="omega-node"]', serverName);
        
        // Continue
        await page.click('text=CONTINUE SEQUENCE');

        // --- STEP 5: FINAL REVIEW ---
        await expect(page.locator('text=Final Review')).toBeVisible();
        await page.click('text=SUBSCRIBE & DEPLOY');

        // Wait for redirection to dashboard (Provisioning started)
        await page.waitForURL('**/dashboard/servers', { timeout: 30000 });
        console.log(`>>> Server ${serverName} queued.`);
    }
  });

  test('Verify Live Status & Telemetry', async ({ page }) => {
      // Go to servers list
      await page.goto(`${BASE_URL}/dashboard/servers`);
      
      // Find one of our stress servers
      // We look for any server starting with "Stress-MC-"
      const serverRow = page.locator('text=Stress-MC-').first();
      
      // Wait for it to exist (in case previous test just finished)
      await expect(serverRow).toBeVisible();
      
      console.log('>>> Waiting for server to become LIVE (Timeout: 120s)...');
      // Poll/Wait for "LIVE" status indicator near the server name
      // The status might be a badge "LIVE" or "RUNNING"
      // We'll click into it to check detailed status if list view is static
      await serverRow.click();
      
      // Now in detailed view
      // Wait for status text. It might say "PROVISIONING" initially.
      await expect(page.locator('text=LIVE')).toBeVisible({ timeout: 120000 });
      console.log('>>> Server is LIVE.');

      // Check Telemetry
      console.log('>>> Checking Telemetry...');
      await page.click('button:has-text("Telemetry")');
      
      // Check for Graph/Stats
      await expect(page.locator('text=Performance Matrix')).toBeVisible();
      // CPU Usage should be visible (even if 0%)
      await expect(page.locator('text=CPU Usage')).toBeVisible();
      
      console.log('>>> Telemetry Verified.');
  });
});
