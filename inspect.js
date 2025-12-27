const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  const pages = [
    { name: 'home', url: 'http://10.0.0.12:3002' },
    { name: 'store', url: 'http://10.0.0.12:3002/store' },
    { name: 'login', url: 'http://10.0.0.12:3002/login' },
    { name: 'signup', url: 'http://10.0.0.12:3002/signup' },
    { name: 'new-server', url: 'http://10.0.0.12:3002/servers/new' }
  ];

  for (const p of pages) {
    try {
      console.log(`Navigating to ${p.url}...`);
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000); // Wait for animations
      await page.screenshot({ path: `screenshot_${p.name}.png`, fullPage: true });
      console.log(`Saved screenshot_${p.name}.png`);
    } catch (err) {
      console.error(`Failed to capture ${p.name}:`, err.message);
    }
  }

  await browser.close();
})();