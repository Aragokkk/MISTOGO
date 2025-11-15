#!/bin/bash
echo "🔄 Rebuilding MistoGO Admin..."
cd /var/www/mistogo/admin

# Видали старі тимчасові папки
rm -rf ./publish-temp

# Тимчасово перейменуй конфліктні файли API
echo "📦 Temporarily renaming conflicting API files..."
if [ -f "/var/www/mistogo/api/appsettings.json" ]; then
    mv /var/www/mistogo/api/appsettings.json /var/www/mistogo/api/appsettings.json.bak
fi
if [ -f "/var/www/mistogo/api/appsettings.Development.json" ]; then
    mv /var/www/mistogo/api/appsettings.Development.json /var/www/mistogo/api/appsettings.Development.json.bak
fi
if [ -f "/var/www/mistogo/api/appsettings.Production.json" ]; then
    mv /var/www/mistogo/api/appsettings.Production.json /var/www/mistogo/api/appsettings.Production.json.bak
fi

# Збери у тимчасову папку
dotnet publish -c Release -o ./publish-temp

BUILD_STATUS=$?

# Поверни файли API назад
echo "📦 Restoring API files..."
if [ -f "/var/www/mistogo/api/appsettings.json.bak" ]; then
    mv /var/www/mistogo/api/appsettings.json.bak /var/www/mistogo/api/appsettings.json
fi
if [ -f "/var/www/mistogo/api/appsettings.Development.json.bak" ]; then
    mv /var/www/mistogo/api/appsettings.Development.json.bak /var/www/mistogo/api/appsettings.Development.json
fi
if [ -f "/var/www/mistogo/api/appsettings.Production.json.bak" ]; then
    mv /var/www/mistogo/api/appsettings.Production.json.bak /var/www/mistogo/api/appsettings.Production.json
fi

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ Build successful, updating files..."
    
    # Зупини сервіс перед заміною файлів
    sudo systemctl stop mistogo-admin
    
    # Видали стару папку
    rm -rf ./publish
    
    # Перейменуй нову
    mv ./publish-temp ./publish
    
    # Видали вкладену папку publish якщо вона з'явилася
    rm -rf ./publish/publish
    
    echo "✅ Restarting service..."
    sudo systemctl start mistogo-admin
    echo "✅ Admin restarted!"
    sudo systemctl status mistogo-admin --no-pager -l
else
    echo "❌ Build failed!"
    rm -rf ./publish-temp
    exit 1
fi
