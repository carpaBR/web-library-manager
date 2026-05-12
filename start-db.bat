@echo off
echo Iniciando o banco de dados MySQL na porta 3307...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --defaults-file="%~dp0my.ini" --console
pause
