import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Baseline thresholds
const THRESHOLDS = {
  performance: 80,
  accessibility: 100,
  'best-practices': 100,
  seo: 100
};

// Configuration
const PORT = 8080;
const URL = `http://localhost:${PORT}`;
const REPORTS_DIR = path.join(__dirname, '..', 'lighthouse-reports');
const ROOT_DIR = path.join(__dirname, '..');

let server = null;
let chrome = null;

/**
 * Start local HTTP server using Node's built-in http module
 */
function startServer() {
  return new Promise((resolve, reject) => {
    console.log(`Starting HTTP server on port ${PORT}...`);
    
    server = http.createServer((req, res) => {
      // Parse the URL
      let filePath = req.url === '/' ? '/index.html' : req.url;
      filePath = path.join(ROOT_DIR, filePath);
      
      // Get file extension for content type
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
      };
      
      const contentType = contentTypes[ext] || 'application/octet-stream';
      
      // Read and serve the file
      fs.readFile(filePath, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>', 'utf-8');
          } else {
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`, 'utf-8');
          }
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    });
    
    server.on('error', (err) => {
      reject(new Error(`Failed to start server: ${err.message}`));
    });
    
    server.listen(PORT, () => {
      console.log('Server started successfully');
      resolve();
    });
  });
}

/**
 * Stop the HTTP server
 */
function stopServer() {
  if (server) {
    console.log('Stopping HTTP server...');
    server.close();
    server = null;
  }
}

/**
 * Run Lighthouse audit
 */
async function runLighthouse() {
  console.log(`Running Lighthouse audit on ${URL}...`);
  
  // Launch Chrome
  chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const options = {
    logLevel: 'error',
    output: ['json', 'html'],
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  };

  const runnerResult = await lighthouse(URL, options);
  
  await chrome.kill();
  chrome = null;

  return runnerResult;
}

/**
 * Save reports to disk
 */
function saveReports(runnerResult) {
  console.log('Saving reports...');
  
  // Ensure reports directory exists
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const jsonPath = path.join(REPORTS_DIR, 'latest.report.json');
  const htmlPath = path.join(REPORTS_DIR, 'latest.report.html');
  
  // Save latest reports
  fs.writeFileSync(jsonPath, runnerResult.report[0]);
  fs.writeFileSync(htmlPath, runnerResult.report[1]);
  
  console.log(`Reports saved to ${REPORTS_DIR}/`);
  console.log(`  - latest.report.json`);
  console.log(`  - latest.report.html`);
  
  // Also save to history directory
  const historyDir = path.join(REPORTS_DIR, 'history');
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }
  
  const historyJsonPath = path.join(historyDir, `${timestamp}.json`);
  const historyHtmlPath = path.join(historyDir, `${timestamp}.html`);
  fs.writeFileSync(historyJsonPath, runnerResult.report[0]);
  fs.writeFileSync(historyHtmlPath, runnerResult.report[1]);
  
  return { jsonPath, htmlPath };
}

/**
 * Compare scores against thresholds
 */
function compareScores(lhr) {
  console.log('\n=== Lighthouse Scores ===');
  
  const categories = lhr.categories;
  const results = {};
  let allPassed = true;
  
  for (const [key, threshold] of Object.entries(THRESHOLDS)) {
    const category = categories[key];
    const score = Math.round(category.score * 100);
    const passed = score >= threshold;
    
    results[key] = { score, threshold, passed };
    
    const status = passed ? '✓ PASS' : '✗ FAIL';
    const icon = passed ? '✓' : '✗';
    console.log(`${icon} ${category.title}: ${score} (threshold: ${threshold}) ${status}`);
    
    if (!passed) {
      allPassed = false;
    }
  }
  
  console.log('========================\n');
  
  return { results, allPassed };
}

/**
 * Cleanup function
 */
async function cleanup() {
  stopServer();
  if (chrome) {
    await chrome.kill();
  }
}

/**
 * Main execution
 */
async function main() {
  let exitCode = 0;
  
  try {
    // Start server
    await startServer();
    
    // Run Lighthouse
    const runnerResult = await runLighthouse();
    
    // Save reports
    saveReports(runnerResult);
    
    // Compare scores
    const { allPassed } = compareScores(runnerResult.lhr);
    
    if (allPassed) {
      console.log('✓ All Lighthouse thresholds passed!');
      exitCode = 0;
    } else {
      console.error('✗ Some Lighthouse thresholds failed!');
      exitCode = 1;
    }
    
  } catch (error) {
    console.error('Error running Lighthouse:', error.message);
    exitCode = 1;
  } finally {
    await cleanup();
  }
  
  process.exit(exitCode);
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, cleaning up...');
  await cleanup();
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, cleaning up...');
  await cleanup();
  process.exit(1);
});

// Run main function
main();
