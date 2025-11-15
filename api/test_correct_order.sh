#!/bin/bash

echo "=== ПРАВИЛЬНИЙ порядок (productName → productCount → productPrice) ==="
CORRECT="test_merch_n1;www.market.ua;DH1762697005;1415379863;1547.36;UAH;Процесор Intel Core i5-4670 3.4GHz;Kingston DDR3-1600 4096MB PC3-12800;1;1;1000;547.36;flk3409refn54t54t*FNJRET"
echo "String: $CORRECT"
echo "MD5:    $(echo -n "$CORRECT" | md5sum | cut -d' ' -f1)"
echo "Expect: ce8aaf05ba92c51d81d60968158720b3"
echo ""

echo "=== Наш запит з правильним порядком ==="
OUR="test_merch_n1;mistogo.online;ORDER_1762697505_3;1762697505;1.00;UAH;Card verification;1;1.00;flk3409refn54t54t*FNJRET"
echo "String: $OUR"
echo "MD5:    $(echo -n "$OUR" | md5sum | cut -d' ' -f1)"
