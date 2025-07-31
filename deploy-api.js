#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Deploying API to Vercel...');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Please run this from the project root.');
  process.exit(1);
}

try {
  // Check if vercel is installed
  console.log('📦 Checking Vercel CLI...');
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI found');
} catch (error) {
  console.log('⚠️  Vercel CLI not found. Installing...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI:', installError.message);
    console.log('📝 Please install manually: npm install -g vercel');
    process.exit(1);
  }
}

// Deploy to Vercel
try {
  console.log('🚀 Starting deployment...');
  
  // Check if already logged in
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    console.log('✅ Already logged in to Vercel');
  } catch (error) {
    console.log('🔐 Please login to Vercel...');
    execSync('vercel login', { stdio: 'inherit' });
  }
  
  // Deploy
  console.log('📤 Deploying...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('✅ Deployment completed!');
  console.log('🔗 Your API should be available at: https://your-project-name.vercel.app');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('💡 Alternative: Deploy manually via Vercel dashboard');
  process.exit(1);
} 