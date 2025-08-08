 :: @chcp 1251
::cls

::C:

::cd C:\AppServ\www\ParserNew\gu_out

::start /wait gurun.bat

::xcopy "C:\AppServ\www\ParserNew\gu_out\datatable" "D:\BackupServer\Client\datatable"  /R /S /E /Y

::D:
::cd "D:\BackupServer\Client\rfex\src\create-client-data"
::start /wait node ./

::cd "D:\Updater"

::rd /s /q "C:\Sandbox\User\RF_ONLINE\drive\D\RF-2.2.3.2-Client"
::rd /s /q "D:\Updater\in/patch"
::rd /s /q "D:\Updater\out/patch"
::rd /s /q "D:\Updater\out-ver2/patch"

::start /wait node create-client-path.js
