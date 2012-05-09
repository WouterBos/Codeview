JSDOC.PluginManager.registerPlugin(
	"JSDOC.publishSrcHilite",
	{
		onPublishSrc: function(src) {
			if (src.path in JsHilite.cache) {
				return; // already generated src code
			}
			else JsHilite.cache[src.path] = true;

			try {
				var sourceCode = IO.readFile(src.path);
			}
			catch(e) {
				print(e.message);
				quit();
			}
			formattedCode = String(sourceCode).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
			var hiliter = new JsHilite(formattedCode, src.charset);
			src.hilited = hiliter.hilite(formattedCode);
		}
	}
);

function JsHilite(src, charset) {

	var tr = new JSDOC.TokenReader();

	tr.keepComments = true;
	tr.keepDocs = true;
	tr.keepWhite = true;

	this.tokens = tr.tokenize(new JSDOC.TextStream(src));

	// TODO is redefining toString() the best way?
	JSDOC.Token.prototype.toString = function() {
		return "<span class=\""+this.type+"\">"+this.data.replace(/</g, "&lt;")+"</span>";
	}


	this.header = '<!DOCTYPE html>'+"\n"+
	'<html>'+"\n"+
	'<head>'+"\n"+
	'<meta charset="utf-8"></meta>'+"\n"+
	'<meta name="generator" content="JsDoc Toolkit"></meta>'+"\n"+
	'<title>Source File</title>'+"\n"+
	'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>'+"\n"+
	'<meta name="mobileoptimized" content="0"></meta>'+"\n"+
	'<link rel="stylesheet" href="../../css/highlight.css" media="all"></link>'+"\n"+
	// '<link rel="stylesheet" href="../../css/shTheme.css" media="all"></link>'+"\n"+
	'<script src="../../javascript/highlight.js"></script>'+"\n"+
	// '<script src="../../javascript/shBrushJScript.js"></script>'+"\n"+
	"<style>\n\
	body {margin:0;}\n\
	.syntaxhighlighter{margin: 0em 0 0em 0 !important;}\n\
	</style>\n</head>\n<body>\n<pre><code class=\"js\">\n";
	this.footer = "</code></pre>\n<script>\nSyntaxHighlighter.highlightDocument(true)\n</script>\n</body>\n</html>";
	this.showLinenumbers = true;
}

JsHilite.cache = {};

JsHilite.prototype.hilite = function(sourceCode) {
	var hilited = this.tokens.join("");
	var line = 1;
	if (this.showLinenumbers) hilited = hilited.replace(/(^|\n)/g, function(m){return m+"<span class='line'>"+((line<10)? " ":"")+((line<100)? " ":"")+(line++)+"</span> "});

	return this.header+sourceCode+this.footer;
}