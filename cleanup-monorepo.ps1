# Cleanup script for Node.js monorepo files after Python migration
# Run this script after confirming the Python backend is working

Write-Host "🧹 Cleaning up Node.js monorepo files..." -ForegroundColor Yellow

# Files to remove from root
$filesToRemove = @(
    "package.json",
    "package-lock.json", 
    "tsconfig.json",
    "drizzle.config.ts",
    "deploy-api.js",
    "test-fed.js",
    "test-apis.js", 
    "test-api-health.js",
    "env.example"
)

# Directories to remove
$dirsToRemove = @(
    "api",
    "node_modules",
    "dist"
)

# Remove files
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "✅ Removed: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

# Remove directories
foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "✅ Removed directory: $dir" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Directory not found: $dir" -ForegroundColor Yellow
    }
}

# Update .gitignore
$gitignoreContent = @"
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/
.env

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Build
dist/
build/

# Node.js (legacy)
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env.local
.env.development.local
.env.test.local
.env.production.local
"@

Set-Content -Path ".gitignore" -Value $gitignoreContent
Write-Host "✅ Updated .gitignore" -ForegroundColor Green

Write-Host "`n🎉 Cleanup completed!" -ForegroundColor Green
Write-Host "📁 Remaining structure:" -ForegroundColor Cyan
Write-Host "  ├── backend/     (Python FastAPI)" -ForegroundColor White
Write-Host "  ├── client/      (React frontend)" -ForegroundColor White
Write-Host "  ├── shared/      (shared schemas)" -ForegroundColor White
Write-Host "  └── docs/        (documentation)" -ForegroundColor White

Write-Host "`n🚀 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the Python backend: cd backend && python main.py" -ForegroundColor White
Write-Host "2. Test the React frontend: cd client && npm run dev" -ForegroundColor White
Write-Host "3. Update deployment scripts if needed" -ForegroundColor White 