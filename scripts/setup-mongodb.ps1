# MongoDB Setup Script for Windows
# This script helps download and install MongoDB Community Edition

# Configuration
$mongodbVersion = "7.0.7"
$downloadUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-$mongodbVersion-signed.msi"
$downloadPath = "$env:TEMP\mongodb-installer.msi"
$dataPath = "C:\data\db"

# Create data directory if it doesn't exist
Write-Host "Creating MongoDB data directory at $dataPath..."
if (!(Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
    Write-Host "Data directory created successfully." -ForegroundColor Green
} else {
    Write-Host "Data directory already exists." -ForegroundColor Yellow
}

# Download MongoDB installer
Write-Host "Downloading MongoDB $mongodbVersion installer..."
try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath
    Write-Host "MongoDB installer downloaded successfully." -ForegroundColor Green
} catch {
    Write-Host "Failed to download MongoDB installer: $_" -ForegroundColor Red
    exit 1
}

# Install MongoDB
Write-Host "Installing MongoDB Community Edition..."
Write-Host "This will open the MongoDB installer. Please follow the installation wizard."
Write-Host "IMPORTANT: Make sure to select 'Complete' installation and install MongoDB as a service." -ForegroundColor Yellow
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$downloadPath`" /qb ADDLOCAL=ALL" -Wait

# Verify installation
Write-Host "Verifying MongoDB installation..."
$mongodPath = "C:\Program Files\MongoDB\Server\$mongodbVersion\bin\mongod.exe"
if (Test-Path $mongodPath) {
    Write-Host "MongoDB installed successfully!" -ForegroundColor Green
    
    # Add MongoDB to PATH if not already there
    $binPath = "C:\Program Files\MongoDB\Server\$mongodbVersion\bin"
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    
    if ($currentPath -notlike "*$binPath*") {
        Write-Host "Adding MongoDB to system PATH..."
        [Environment]::SetEnvironmentVariable("Path", $currentPath + ";" + $binPath, "Machine")
        Write-Host "MongoDB added to PATH. You may need to restart your terminal." -ForegroundColor Yellow
    }
    
    # Check if MongoDB service is running
    $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($service -and $service.Status -eq "Running") {
        Write-Host "MongoDB service is running." -ForegroundColor Green
    } else {
        Write-Host "Starting MongoDB service..."
        Start-Service -Name "MongoDB"
        Write-Host "MongoDB service started." -ForegroundColor Green
    }
    
    # Update environment files
    Write-Host "Updating environment files..."
    
    # Update .env file
    $envFile = "../.env"
    $envContent = Get-Content $envFile -Raw
    $envContent = $envContent -replace "# MONGODB_URI=mongodb://localhost:27017/aithor", "MONGODB_URI=mongodb://localhost:27017/aithor"
    $envContent = $envContent -replace "NEXT_PUBLIC_USE_MOCK_DATA=true", "NEXT_PUBLIC_USE_MOCK_DATA=false"
    Set-Content -Path $envFile -Value $envContent
    
    # Update .env.local file
    $envLocalFile = "../.env.local"
    $envLocalContent = Get-Content $envLocalFile -Raw
    $envLocalContent = $envLocalContent -replace "# MONGODB_URI=mongodb://localhost:27017/interviewai", "MONGODB_URI=mongodb://localhost:27017/aithor"
    $envLocalContent = $envLocalContent -replace "NEXT_PUBLIC_USE_MOCK_DATA=true", "NEXT_PUBLIC_USE_MOCK_DATA=false"
    Set-Content -Path $envLocalFile -Value $envLocalContent
    
    Write-Host "Environment files updated." -ForegroundColor Green
    
    Write-Host ""
    Write-Host "MongoDB setup complete!" -ForegroundColor Green
    Write-Host "You can now run 'npm run seed' to populate the database with sample data." -ForegroundColor Green
    Write-Host "Then start the application with 'npm run dev'." -ForegroundColor Green
} else {
    Write-Host "MongoDB installation could not be verified. Please check if the installation completed successfully." -ForegroundColor Red
}

# Clean up
Remove-Item $downloadPath -Force