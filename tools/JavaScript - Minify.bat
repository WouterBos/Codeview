@echo off

set folder=..\javascript\
copy/b %folder%\wbos.js %folder%\all.js
copy/b %folder%\all.js + %folder%\highlightJavascript.js %folder%\all.js

:: If this line below fails, try to replace "java" with something like "C:\Program Files (x86)\Java\jre6\bin\java.exe"
"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar yuicompressor-2.4.2\build\yuicompressor-2.4.2.jar %folder%all.js -o %folder%all.min.js

echo Selected Javascript files are minified and combined into '%folder%all.min.js'.
pause
