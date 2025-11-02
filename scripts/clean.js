import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Recursively delete a directory
 */
function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

/**
 * Clean up test artifacts and temporary files
 */
function clean() {
  console.log('🧹 Cleaning up test artifacts and temporary files...\n');

  const itemsToClean = [
    // Lighthouse CI artifacts
    { path: '.lighthouseci', type: 'dir', name: 'Lighthouse CI artifacts' },
    
    // Test coverage
    { path: 'coverage', type: 'dir', name: 'Test coverage reports' },
    { path: '.nyc_output', type: 'dir', name: 'NYC output' },
    
    // Lighthouse reports (keep directory structure, clean contents)
    { path: 'lighthouse-reports/latest.report.html', type: 'file', name: 'Latest Lighthouse HTML report' },
    { path: 'lighthouse-reports/latest.report.json', type: 'file', name: 'Latest Lighthouse JSON report' },
    { path: 'lighthouse-reports/history', type: 'dir', name: 'Lighthouse report history' },
  ];

  let cleaned = 0;
  let skipped = 0;

  itemsToClean.forEach(({ path: itemPath, type, name }) => {
    const fullPath = path.join(ROOT_DIR, itemPath);
    
    if (fs.existsSync(fullPath)) {
      try {
        if (type === 'dir') {
          deleteDirectory(fullPath);
        } else {
          fs.unlinkSync(fullPath);
        }
        console.log(`✓ Removed: ${name}`);
        cleaned++;
      } catch (error) {
        console.error(`✗ Failed to remove ${name}: ${error.message}`);
      }
    } else {
      skipped++;
    }
  });

  console.log(`\n✨ Cleanup complete!`);
  console.log(`   Cleaned: ${cleaned} items`);
  console.log(`   Skipped: ${skipped} items (already clean)`);
}

// Run cleanup
clean();
