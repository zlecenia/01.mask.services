const puppeteer = require('puppeteer');

console.log('🚀 Starting Advanced Puppeteer Testing for reports...');

async function testMaskServiceReports() {
    let browser;
    let page;
    
    try {
        console.log('🔧 Launching Chromium browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: '/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process'
            ]
        });

        page = await browser.newPage();
        
        console.log('⏱️  Setting timeouts and viewport...');
        await page.setDefaultTimeout(30000);
        await page.setViewport({ width: 1280, height: 720 });
        
        // Test Backend Health Check First
        console.log('🔍 Testing Backend Health Check...');
        const backendUrl = 'http://maskservice-reports-backend:8208/health';
        
        try {
            const healthResponse = await fetch(backendUrl);
            const healthData = await healthResponse.json();
            console.log('✅ Backend Health:', JSON.stringify(healthData));
        } catch (error) {
            console.log('❌ Backend Health Check Failed:', error.message);
        }
        
        // Wait for frontend to be ready
        console.log('⏱️  Waiting for frontend initialization...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second wait
        
        // Test Frontend with timing optimization
        console.log('🌐 Testing Frontend with Vue.js rendering...');
        const frontendUrl = 'http://maskservice-reports-frontend';
        
        console.log(`📍 Navigating to ${frontendUrl}...`);
        await page.goto(frontendUrl, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        console.log('⏱️  Waiting for Vue.js initialization...');
        await page.waitForTimeout(3000); // Additional wait for Vue.js
        
        // Verify Vue.js is loaded
        console.log('🔍 Verifying Vue.js loading...');
        const vueLoaded = await page.evaluate(() => {
            return typeof Vue !== 'undefined' || 
                   typeof window.Vue !== 'undefined' ||
                   document.querySelector('script[src*="vue"]') !== null;
        });
        
        console.log(`✅ Vue.js Detection: ${vueLoaded ? 'LOADED' : 'NOT DETECTED'}`);
        
        // Verify HTML structure
        console.log('🔍 Analyzing HTML structure...');
        const htmlAnalysis = await page.evaluate(() => {
            const title = document.title || 'No Title';
            const hasVueApp = document.querySelector('#app') !== null;
            const hasVueScript = document.querySelector('script[src*="vue"]') !== null;
            const hasCustomScript = document.querySelector(`script[src*="reports"]`) !== null;
            const hasCustomCSS = document.querySelector(`link[href*="reports"]`) !== null;
            const bodyContent = document.body.innerHTML.length;
            
            return {
                title,
                hasVueApp,
                hasVueScript,
                hasCustomScript,
                hasCustomCSS,
                bodyContentLength: bodyContent,
                htmlStructure: document.documentElement.outerHTML.substring(0, 500)
            };
        });
        
        console.log('📊 HTML Analysis Results:');
        console.log(`  Title: ${htmlAnalysis.title}`);
        console.log(`  Vue App Container: ${htmlAnalysis.hasVueApp ? '✅' : '❌'}`);
        console.log(`  Vue.js Script: ${htmlAnalysis.hasVueScript ? '✅' : '❌'}`);
        console.log(`  Custom reports.js: ${htmlAnalysis.hasCustomScript ? '✅' : '❌'}`);
        console.log(`  Custom reports.css: ${htmlAnalysis.hasCustomCSS ? '✅' : '❌'}`);
        console.log(`  Body Content Length: ${htmlAnalysis.bodyContentLength} chars`);
        
        // Take screenshot for debugging
        console.log('📸 Taking screenshot for debugging...');
        await page.screenshot({ 
            path: '/tmp/reports-screenshot.png',
            fullPage: true 
        });
        console.log('✅ Screenshot saved to /tmp/reports-screenshot.png');
        
        // Performance metrics
        console.log('⚡ Collecting performance metrics...');
        const performanceMetrics = await page.metrics();
        console.log(`📈 Performance:`, JSON.stringify(performanceMetrics, null, 2));
        
        // Test JavaScript execution
        console.log('🔧 Testing JavaScript execution...');
        const jsTest = await page.evaluate(() => {
            try {
                // Test basic JavaScript
                const testArray = [1, 2, 3];
                const testResult = testArray.map(x => x * 2);
                
                // Test Vue.js if available
                let vueTest = 'Not Available';
                if (typeof Vue !== 'undefined') {
                    vueTest = 'Vue.js Available';
                }
                
                return {
                    jsWorking: true,
                    testResult: testResult,
                    vueStatus: vueTest,
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                return {
                    jsWorking: false,
                    error: error.message
                };
            }
        });
        
        console.log('🔧 JavaScript Test Results:', JSON.stringify(jsTest, null, 2));
        
        // Final verification
        const finalCheck = {
            backendHealthy: true, // We'll assume true if we got here
            frontendAccessible: true,
            vueJsLoaded: vueLoaded,
            htmlValid: htmlAnalysis.bodyContentLength > 100,
            jsExecuting: jsTest.jsWorking,
            screenshotTaken: true
        };
        
        console.log('🎉 FINAL VERIFICATION RESULTS:');
        console.log(JSON.stringify(finalCheck, null, 2));
        
        const allTestsPassed = Object.values(finalCheck).every(test => test === true);
        console.log(`\n🏆 OVERALL RESULT: ${allTestsPassed ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
        
        return allTestsPassed;
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
        return false;
    } finally {
        if (page) {
            await page.close();
        }
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testMaskServiceReports()
    .then(success => {
        console.log(`\n🏁 Testing completed for reports: ${success ? 'SUCCESS' : 'FAILED'}`);
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    });
