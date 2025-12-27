const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Accessing Design Studio Blog...');
    await page.goto('https://www.designstudiouiux.com/blog/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000); // Wait for potential async loading

    // More aggressive article extraction
    const articles = await page.evaluate(() => {
      // Find all links that look like blog posts (usually contain /blog/ in the URL or are inside main containers)
      const links = Array.from(document.querySelectorAll('a'));
      const results = [];
      const seen = new Set();

      links.forEach(l => {
        const href = l.href;
        const text = l.innerText.trim();
        // Filter for potential blog post links: long text, specific paths, not social links
        if (href.includes('/blog/') && text.length > 10 && !seen.has(href)) {
          if (href !== 'https://www.designstudiouiux.com/blog/') {
            results.push({ title: text, link: href });
            seen.add(href);
          }
        }
      });
      return results;
    });

    console.log(`Found ${articles.length} potential articles.`);
    
    const fullContent = [];
    // Scrape top articles
    for (let i = 0; i < Math.min(articles.length, 6); i++) {
      console.log(`Scraping: ${articles[i].title}...`);
      try {
        await page.goto(articles[i].link, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(2000);
        
        const content = await page.evaluate(() => {
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim());
          const paragraphs = Array.from(document.querySelectorAll('p, li')).map(p => p.innerText.trim());
          return { headings, paragraphs: paragraphs.filter(p => p.length > 20) };
        });
        
        fullContent.push({
          title: articles[i].title,
          url: articles[i].link,
          ...content
        });
      } catch (e) {
        console.error(`Error scraping ${articles[i].link}: ${e.message}`);
      }
    }

    fs.writeFileSync('design_library_raw.json', JSON.stringify(fullContent, null, 2));
    console.log('Library generation data saved.');

  } catch (err) {
    console.error('General failure:', err.message);
  } finally {
    await browser.close();
  }
})();