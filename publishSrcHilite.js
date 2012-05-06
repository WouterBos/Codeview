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

			var hiliter = new JsHilite(sourceCode, src.charset);
			src.hilited = hiliter.hilite(sourceCode);
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

	if (!charset) charset = "utf-8";

	this.header = '<html><head><meta http-equiv="content-type" content="text/html; charset='+charset+'"> '+
	'<link rel="stylesheet" href="../../css/shCore.css" media="all"></link>'+
	'<link rel="stylesheet" href="../../css/shTheme.css" media="all"></link>'+
	'<script src="../../javascript/shCore.js"></script>'+
	'<script src="../../javascript/shBrushJScript.js"></script>'+
	"<style>\n\
	body {margin:0;}\n\
	.syntaxhighlighter{margin: 0em 0 0em 0 !important;}\n\
	</style></head><body><pre class=\"brush: js\">";
	this.footer = "</pre><script>SyntaxHighlighter.all()</script></body></html>";
	this.showLinenumbers = true;
}

JsHilite.cache = {};

JsHilite.prototype.hilite = function(sourceCode) {
	var hilited = this.tokens.join("");
	var line = 1;
	if (this.showLinenumbers) hilited = hilited.replace(/(^|\n)/g, function(m){return m+"<span class='line'>"+((line<10)? " ":"")+((line<100)? " ":"")+(line++)+"</span> "});

	return this.header+sourceCode+this.footer;
}