import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Vercel build...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build client
  console.log('📦 Building client...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build output
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build failed: dist directory not found');
  }

  const indexHtmlPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error('Build failed: index.html not found');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 Build output:', fs.readdirSync(distPath));

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 