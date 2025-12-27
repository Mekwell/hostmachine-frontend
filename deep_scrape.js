const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const baseDir = './design_systems';

  try {
    console.log('Starting full archive extraction...');
    await page.goto('https://www.designstudiouiux.com/blog/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const articles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const results = [];
      const seen = new Set();
      links.forEach(l => {
        const href = l.href;
        const text = l.innerText.trim();
        if (href.includes('/blog/') && text.length > 15 && !seen.has(href)) {
          if (href !== 'https://www.designstudiouiux.com/blog/') {
            results.push({ title: text, link: href });
            seen.add(href);
          }
        }
      });
      return results;
    });

    console.log(`Discovered total of ${articles.length} articles. Initiating full backup...`);

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      const fileName = art.title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.md';
      
      // Categorize
      let subfolder = 'core_ux';
      const slug = art.link.toLowerCase();
      if (slug.includes('saas') || slug.includes('b2b') || slug.includes('conversion')) subfolder = 'saas_b2b';
      else if (slug.includes('navigation') || slug.includes('mobile')) subfolder = 'mobile_navigation';
      else if (slug.includes('enterprise') || slug.includes('system')) subfolder = 'enterprise';
      else if (slug.includes('metric') || slug.includes('strategy') || slug.includes('hire')) subfolder = 'metrics_strategy';

      const fullPath = path.join(baseDir, subfolder, fileName);

      // Check if already exists to save time/resources
      if (fs.existsSync(fullPath)) {
        console.log(`[${i+1}/${articles.length}] Skipping existing: ${art.title}`);
        continue;
      }

      console.log(`[${i+1}/${articles.length}] Fetching: ${art.title}`);
      
      try {
        await page.goto(art.link, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const data = await page.evaluate(() => {
          const title = document.querySelector('h1')?.innerText.trim() || document.title;
          const body = document.querySelector('.entry-content, .post-content, main') || document.body;
          
          const elements = Array.from(body.querySelectorAll('h2, h3, p, li')).map(el => ({
            tag: el.tagName.toLowerCase(),
            text: el.innerText.trim()
          })).filter(el => el.text.length > 5);

          return { title, elements };
        });

        let md = `# ${data.title}\n\nSource: [${art.link}](${art.link})\n\n`;
        data.elements.forEach(el => {
          if (el.tag === 'h2') md += `## ${el.text}\n\n`;
          else if (el.tag === 'h3') md += `### ${el.text}\n\n`;
          else if (el.tag === 'li') md += `- ${el.text}\n`;
          else md += `${el.text}\n\n`;
        });

        fs.writeFileSync(fullPath, md);

      } catch (err) {
        console.error(`Error on ${art.link}: ${err.message}`);
      }
    }

    console.log('Full archive successfully backed up.');

  } catch (err) {
    console.error('Crawl failed:', err.message);
  } finally {
    await browser.close();
  }
})();