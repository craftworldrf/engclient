cls
cd ~%dp0
node index.js -in "./in/patch" -out "./out-ver2/patch"

::del "./out-ver2\patch\files\rfex\bin\electron-v11.1.1-win32-ia32\electron.exe"
::rd /s /q "./out-ver2\patch\files\rfex\bin\electron-v11.1.1-win32-ia32"

cd "./out-ver2"


git config --global user.email "craftworld@email.com"
git config --global user.name "craftworld"
 
git add .
git commit -m "..."
git push origin -f
exit