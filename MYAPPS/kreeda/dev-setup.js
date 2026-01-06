const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'backend/.env',
  'backend/package.json',
  'frontend/package.json',
  'package.json'
];

const requiredDirs = [
  'backend',
  'frontend',
  'docs'
];

console.log('🔍 Checking Kreeda development setup...\n');

let allGood = true;

// Check directories
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ Directory: ${dir}`);
  } else {
    console.log(`❌ Missing directory: ${dir}`);
    allGood = false;
  }
});

// Check files
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ File: ${file}`);
  } else {
    console.log(`❌ Missing file: ${file}`);
    allGood = false;
  }
});

// Check environment variables
if (fs.existsSync('backend/.env')) {
  const envContent = fs.readFileSync('backend/.env', 'utf8');
  const hasJwtSecret = envContent.includes('JWT_SECRET=') && !envContent.includes('JWT_SECRET=change_me');
  const hasMongoUri = envContent.includes('MONGODB_URI=');
  
  if (hasJwtSecret) {
    console.log('✅ JWT_SECRET configured');
  } else {
    console.log('⚠️  JWT_SECRET needs to be set (not default value)');
    allGood = false;
  }
  
  if (hasMongoUri) {
    console.log('✅ MONGODB_URI configured');
  } else {
    console.log('❌ MONGODB_URI not configured');
    allGood = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Setup looks good! You can run: npm run dev');
} else {
  console.log('❌ Setup incomplete. Please fix the issues above.');
  process.exit(1);
}

console.log('='.repeat(50));