const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    console.log("Navigating to dashboard...");
    await page.goto('http://localhost:5173/');
    
    console.log("Waiting for network idle...");
    await page.waitForNetworkIdle();
    
    console.log("Clicking first case Murder...");
    await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('.theme-card'));
        const murder = els.find(e => e.textContent.includes('Murder'));
        if (murder) murder.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Clicking 'The Vandermeer Affair' Begin Investigation...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const begin = btns.find(b => b.textContent.includes('Begin Investigation'));
        if (begin) begin.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Clicking BEGIN INVESTIGATION to start maze...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const begin = btns.find(b => b.textContent.includes('BEGIN INVESTIGATION'));
        if (begin) begin.click();
    });
    
    console.log("Waiting 5 seconds to catch any logs...");
    await new Promise(r => setTimeout(r, 5000));
    
    await browser.close();
})();
