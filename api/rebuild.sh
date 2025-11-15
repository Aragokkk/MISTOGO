#!/bin/bash
echo "🔄 Rebuilding MistoGO API..."
cd /var/www/mistogo/api

# Видали старі тимчасові папки якщо є
rm -rf ./publish-temp

# Збери у тимчасову папку
dotnet publish -c Release -o ./publish-temp

if [ $? -eq 0 ]; then
    echo "✅ Build successful, updating files..."
    
    # Зупини сервіс перед заміною файлів
    sudo systemctl stop mistogo-api
    
    # Видали стару папку
    rm -rf ./publish
    
    # Перейменуй нову
    mv ./publish-temp ./publish
    
    # Видали вкладену папку publish якщо вона з'явилася
    rm -rf ./publish/publish
    
    echo "✅ Restarting service..."
    sudo systemctl start mistogo-api
    echo "✅ API restarted!"
    sudo systemctl status mistogo-api --no-pager -l
else
    echo "❌ Build failed!"
    rm -rf ./publish-temp
    exit 1
fi
