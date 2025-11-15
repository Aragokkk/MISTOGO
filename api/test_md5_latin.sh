#!/bin/bash

# Спробуємо різні варіанти формули
echo "=== Варіант 1: одинарні productName/Price/Count ==="
STR1="test_merch_n1;www.market.ua;DH1762697005;1415379863;1547.36;UAH;Product1;Product2;1000;547.36;1;1;flk3409refn54t54t*FNJRET"
echo "String: $STR1"
echo "MD5:    $(echo -n "$STR1" | md5sum | cut -d' ' -f1)"
echo ""

echo "=== Варіант 2: як у нашому коді ==="
STR2="test_merch_n1;mistogo.online;ORDER_1762697505_3;1762697505;1.00;UAH;Card verification;1.00;1;flk3409refn54t54t*FNJRET"
echo "String: $STR2"
echo "MD5:    $(echo -n "$STR2" | md5sum | cut -d' ' -f1)"
echo ""

echo "=== Варіант 3: можливо merchantAuthType потрібен? ==="
STR3="test_merch_n1;SimpleSignature;www.market.ua;DH1762697005;1415379863;1547.36;UAH;Product1;Product2;1000;547.36;1;1;flk3409refn54t54t*FNJRET"
echo "String: $STR3"
echo "MD5:    $(echo -n "$STR3" | md5sum | cut -d' ' -f1)"
echo ""

echo "=== Варіант 4: можливо productCount має бути рядком? ==="
STR4="test_merch_n1;www.market.ua;DH1762697005;1415379863;1547.36;UAH;Product1;Product2;1000;547.36;'1';'1';flk3409refn54t54t*FNJRET"
echo "String: $STR4"
echo "MD5:    $(echo -n "$STR4" | md5sum | cut -d' ' -f1)"
echo ""
