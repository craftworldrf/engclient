cls
D:
cd D:\ParserEng\build\Database\gu_out\DataTable
xcopy "D:\ParserEng\build\Database\gu_out\DataTable" "D:\BackUpEng\Forupdate\Datatable"  /R /S /E /Y
D:
cd "D:\BackUpEng\Forupdate\rfex\src\create-client-data"
start /wait node ./
cd "D:\UpdaterEng"
rd /s /q "D:\UpdaterEng\in/patch"
rd /s /q "D:\UpdaterEng\out/patch"
rd /s /q "D:\UpdaterEng\out-ver2/patch"
start /wait node create-client-path.js > create-client-path.log
start /wait make-path.cmd
cd "D:\UpdaterEng"
