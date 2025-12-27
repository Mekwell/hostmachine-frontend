import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.hostmachine.com.au';

test.describe('Nexus Platform Full Feature Audit', () => {

  test('Step 1: UI Integrity & Asset Check', async ({ page }) => {
    console.log('>>> Auditing Landing Page Assets...');
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Host Machine | Premium Game Systems/i);
    
    // Verify Discovery Engine
    const discovery = page.locator('text=Discovery Engine');
    await expect(discovery).toBeVisible();
    
    // Cycle check
    const cat = page.locator('text=Available').locator('..').locator('p .text-gradient').first();
    const t1 = await cat.innerText();
    await page.locator('text=Available').click();
    await page.waitForTimeout(500);
    const t2 = await cat.innerText();
    console.log(`Discovery Engine Active: ${t1} -> ${t2}`);
    expect(t1).not.toBe(t2);
  });

  test('Step 2: Server Dashboard & New Tabs', async ({ page }) => {
    console.log('>>> Auditing Server Management Interface...');
    
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test');
    await page.click('button:has-text("ESTABLISH UPLINK")');
    await page.waitForURL('**/dashboard');

    // Go to a live server (using one of the Audit UUIDs from previous step if we can find it)
    await page.goto(`${BASE_URL}/dashboard/servers`);
    const firstServer = page.locator('.glass-card').first();
    await expect(firstServer).toBeVisible();
    await firstServer.click();

    console.log('>>> Checking Live Telemetry Tab...');
    await page.click('button:has-text("Telemetry")');
    await expect(page.locator('text=Performance Matrix')).toBeVisible();
    await expect(page.locator('polyline').first()).toBeVisible(); // The SVG chart

    console.log('>>> Checking Player Management Tab...');
    await page.click('button:has-text("Users")');
    await expect(page.locator('text=Active Operatives')).toBeVisible();

    console.log('>>> Checking World Archive Tab...');
    await page.click('button:has-text("World")');
    await expect(page.locator('text=World Archive Protocol')).toBeVisible();
    await expect(page.locator('text=CREATE BACKUP')).toBeVisible();
  });

  test('Step 3: Admin AI & Ticket Audit', async ({ page }) => {
    console.log('>>> Auditing HostBot Intelligence Center...');
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'mekwell@hotmail.com');
    await page.fill('input[type="password"]', 'mekwell');
    await page.click('button:has-text("ESTABLISH UPLINK")');
    await page.waitForURL('**/admin');

    await page.goto(`${BASE_URL}/admin/containers`);
    await expect(page.locator('text=Global Grid')).toBeVisible();
    
    // Check HostBot Status in Sidebar
    await expect(page.locator('text=HostBot AI')).toBeVisible();
    await expect(page.locator('text=Remediation Active')).toBeVisible();
  });

});
