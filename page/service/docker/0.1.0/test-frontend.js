const puppeteer = require('puppeteer');

async function testFrontend(url) {
    console.log(`🧪 Testing frontend: ${url}`);
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        // Navigate to page
        console.log('📄 Loading page...');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Check if Vue.js is loaded
        console.log('🔍 Checking Vue.js loading...');
        const vueLoaded = await page.evaluate(() => {
            return typeof Vue !== 'undefined' || typeof window.Vue !== 'undefined';
        });
        
        // Check if app div exists and has content
        console.log('🔍 Checking app content...');
        const appContent = await page.evaluate(() => {
            const appDiv = document.getElementById('app');
            if (!appDiv) return false;
            return appDiv.innerHTML.trim().length > 0;
        });
        
        // Wait for potential Vue components to render
        await page.waitForTimeout(2000);
        
        // Check final rendered content
        const finalContent = await page.evaluate(() => {
            const appDiv = document.getElementById('app');
            return appDiv ? appDiv.innerHTML.trim() : '';
        });
        
        // Take screenshot for debugging
        await page.screenshot({ path: '/app/frontend-test-screenshot.png' });
        
        console.log('📊 Test Results:');
        console.log(`  Vue.js loaded: ${vueLoaded}`);
        console.log(`  App has content: ${appContent}`);
        console.log(`  Final content length: ${finalContent.length}`);
        
        if (vueLoaded && finalContent.length > 0) {
            console.log('✅ Frontend test PASSED');
            process.exit(0);
        } else {
            console.log('❌ Frontend test FAILED');
            console.log('Final content:', finalContent.substring(0, 200) + '...');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Frontend test ERROR:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Run test
const url = process.argv[2] || 'http://localhost:80/';
testFrontend(url);
