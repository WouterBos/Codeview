@echo off

set folder=..\css\
copy/b %folder%\codeview.css %folder%\all.css
copy/b %folder%\all.css + %folder%\highlightJavascript.css %folder%\all.css
copy/b %folder%\all.css + %folder%\reset.css %folder%\all.css

:: If this line below fails, try to replace "java" with something like "C:\Program Files (x86)\Java\jre6\bin\java.exe"
"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar yuicompressor-2.4.2\build\yuicompressor-2.4.2.jar %folder%all.css -o %folder%all.min.css

echo Selected CSS files are minified and combined into '%folder%all.min.css'.
pause
