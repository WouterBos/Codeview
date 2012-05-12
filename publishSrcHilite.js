/**
 * cannot confirm this will work with unmodified template
 */
JSDOC.PluginManager.registerPlugin(
	"JSDOC.publishSrcHilite",
	{
		onPublishSrc: function(src) {

			try {
				var sourceCode = IO.readFile(src.path);
			}
			catch(e) {
				print(e.message);
				quit();
			}
			var formattedCode = String(sourceCode).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
			var lineNumbers = formattedCode.split("\n").length;
			if(path.indexOf("\\")) {
				var title = path.split("\\")[path.split("\\").length-1];
			} else {
				var title = path.split("/")[path.split("/").length-1];
			}
			var header = '<!DOCTYPE html>'+"\n"+
			'<html>'+"\n"+
			'<head>'+"\n"+
			'<meta charset="utf-8"></meta>'+"\n"+
			'<meta name="generator" content="JsDoc Toolkit"></meta>'+"\n"+
			'<title>'+title+'</title>'+"\n"+
			'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>'+"\n"+
			'<meta name="mobileoptimized" content="0"></meta>'+"\n"+
			'<link rel="stylesheet" href="../../css/highlightJavascript.css" media="all"></link>'+"\n"+
			'<script src="../../javascript/highlightJavascript.min.js"></script>'+"\n"+
			'<style>'+"\n"+
			'body {margin:0;}'+"\n"+
			'pre ol {margin-left:'+(Math.floor(lineNumbers/100)+1)+'!important;}'+"\n"+
			'</style>'+"\n"+
			'</head>'+"\n"+
			'<body>'+"\n"+
			'<pre>'+"\n"+
			'<code class="js">'+"\n";
			var footer = "</code></pre>\n<script>\nhighlightJavascript.format();\n</script>\n</body>\n</html>";
			formattedCode = String(sourceCode).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
			var hilited = header+formattedCode+footer;
		}
	}
);