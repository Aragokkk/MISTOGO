#!/bin/bash
# Еталонний приклад з WayForPay
TEST_STRING="test_merch_n1;www.market.ua;DH1762697005;1415379863;1547.36;UAH;Процесор Intel Core i5-4670 3.4GHz;Kingston DDR3-1600 4096MB PC3-12800;1000;547.36;1;1;flk3409refn54t54t*FNJRET"
echo "Test string: $TEST_STRING"
echo "Expected MD5: ce8aaf05ba92c51d81d60968158720b3"
echo "Actual MD5:   $(echo -n "$TEST_STRING" | md5sum | cut -d' ' -f1)"
echo ""

# Твій приклад
YOUR_STRING="test_merch_n1;mistogo.online;ORDER_1762697505_3;1762697505;1.00;UAH;Card verification;1.00;1;flk3409refn54t54t*FNJRET"
echo "Your string: $YOUR_STRING"
echo "Your MD5:    $(echo -n "$YOUR_STRING" | md5sum | cut -d' ' -f1)"
