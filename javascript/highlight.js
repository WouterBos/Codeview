/* Javascript Syntax Highlighter
 * Highlights many different programming languages
 * Outputs valid XHTML, so can be used in XHTML pages!
 * Written by: Michiel van Eerd
 */

 /* IE doesn't understand indexOf() on arrays, so add it */
if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(val) {
                var len = this.length;
                for (var i = 0; i < len; i++) {
                        if (this[i] == val) return i;
                }
                return -1;
        }
}

var SyntaxHighlighter = {};

SyntaxHighlighter.language = {};

SyntaxHighlighter.xmlEntities = {
		"&" : "&amp;",
		"<" : "&lt;",
		">" : "&gt;",
		"\"" : "&quot;",
		"'" : "&#39;"
	};

SyntaxHighlighter.strToXHTML = function(str)
{
	var addLen = 0;

	for (var key in SyntaxHighlighter.xmlEntities)
	{
		str = str.replace(new RegExp(key, "g"),
			function(match, offset, s)
			{
				addLen += (SyntaxHighlighter.xmlEntities[key].length - 1);
				return SyntaxHighlighter.xmlEntities[key];
			}
		);
	}
	return {
		"str" : str,
		"addLen" : addLen
	}
};

SyntaxHighlighter.copyObject = function(ob)
{
	var newOb = {};
	for (var prop in ob) {
		newOb[prop] = ob[prop];
	}
	return newOb;
};

SyntaxHighlighter.highlightDocument = function(showLineNumbers)
{
	var codeList = document.getElementsByTagName("code");
	for (var i = 0, len = codeList.length; i < len; i++)
	{
		if (codeList[i].className && SyntaxHighlighter.language[codeList[i].className])
		{
			SyntaxHighlighter.highlight(codeList[i], showLineNumbers);
		}
	}
};

SyntaxHighlighter.highlight = function(codeEl, showLineNumbers)
{
	var lang = SyntaxHighlighter.language[codeEl.className];
	if (!lang)
	{
		return;
	}

	var span_comment_len = "<span class='comment'></span>".length;
	var span_quote_len = "<span class='quote'></span>".length;
	var span_operator_len = "<span class='operator'></span>".length;
	var span_keyword_len = "<span class='keyword'></span>".length;

	// Met \n of \r\n als regelbreak
	// data rewrites HTML entities to real characters
	codeEl.normalize(); // In FF zijn lange stukken tekst (> 4096 karakters) vaak verdeeld over meerdere textNodes

	var lines = [];

	// Als er na de normalize nog meerder childNodes zijn, dan ga ik ervan uit dat men als linebreak <br> heeft
	// en NIET \n of \r.
	if (codeEl.childNodes.length > 1)
	{
		// Met BR als regelbreak
		// Je mag alleen een lege lijn toevoegen bij de 2e keer achter elkaar geen data (dus <br><br> in de code).
		var hasBr = false;
		for (var i = 0; i < codeEl.childNodes.length; i++)
		{
			if (!codeEl.childNodes[i].data)
			{
				if (hasBr)
				{
					lines.push("");
					hasBr = false;
				}
				else
				{
					hasBr = true;
				}
			}
			else
			{
				lines.push(codeEl.childNodes[i].data);
				hasBr = false;
			}
		}
	}
	else
	{
		// Er worden blijkbaar \n en \r als linebreak gebruikt.
		var str = codeEl.firstChild.data;
		lines = (str.indexOf("\n") != -1) ? str.split("\n") : str.split("\r"); // FF or IE
	}

	var beginMultiCommentIndex = -1;

	forLineLoop:
	for (var lineIndex = 0, lineCount = lines.length; lineIndex < lineCount; lineIndex++)
	{
		var line = lines[lineIndex];
		var prop = {};

		forCharLoop:
		for (var charIndex = 0, lineLen = line.length; charIndex < lineLen; charIndex++)
		{
			var c = line.charAt(charIndex);

			// End multiline comment
			if (beginMultiCommentIndex != -1)
			{
				var endMultiCommentIndex = -1;
				for (; charIndex < lineLen; charIndex++)
				{
					c = line.charAt(charIndex);
					if (c == "\\")
					{
						charIndex++;
						continue;
					}
					if (c == lang.comment.multi.end.charAt(0))
					{
						endMultiCommentIndex = charIndex;
						for (var i = 0; i < lang.comment.multi.end.length; i++)
						{
							if (line.charAt(charIndex + i) != lang.comment.multi.end.charAt(i))
							{
								endMultiCommentIndex = -1;
								break;
							}
						}
						if (endMultiCommentIndex != -1)
						{
							charIndex += (lang.comment.multi.end.length - 1);
							endMultiCommentIndex = charIndex;
							break;
						}
					}
				}
				var realEndIndex = (endMultiCommentIndex != -1) ? endMultiCommentIndex : lineLen - 1;
				//var addLen = "<span class='comment'></span>".length;
				var substrOb = SyntaxHighlighter.strToXHTML(line.substr(beginMultiCommentIndex, realEndIndex - beginMultiCommentIndex + 1));
				line = line.substr(0, beginMultiCommentIndex) + "<span class='comment'>" + substrOb.str + "</span>" + line.substr(realEndIndex + 1);
				charIndex += (span_comment_len + substrOb.addLen);
				lineLen += (span_comment_len + substrOb.addLen);
				prop[beginMultiCommentIndex] = span_comment_len + substrOb.str.length;
				beginMultiCommentIndex = (endMultiCommentIndex != -1) ? -1 : 0;
				continue forCharLoop;
			}

			// Begin multiline comment
			if (lang.comment.multi && c == lang.comment.multi.start.charAt(0))
			{
				beginMultiCommentIndex = charIndex;
				for (var i = 0; i < lang.comment.multi.start.length; i++)
				{
					if (line.charAt(charIndex + i) != lang.comment.multi.start.charAt(i))
					{
						beginMultiCommentIndex = -1;
						break;
					}
				}
				if (beginMultiCommentIndex != -1)
				{
					charIndex += lang.comment.multi.start.length - 1;
					if (charIndex == lineLen - 1)
					{
						charIndex--;
					}
					continue forCharLoop;
				}
			}

			// Single comment
			if (lang.comment.single && c == lang.comment.single.start.charAt(0))
			{
				var beginSingleCommentIndex = charIndex;
				// Eventueel het begin van een single comment
				for (var i = 0; i < lang.comment.single.start.length; i++)
				{
					if (line.charAt(charIndex + i) != lang.comment.single.start.charAt(i))
					{
						beginSingleCommentIndex = -1
						break;
					}
				}
				if (beginSingleCommentIndex != -1)
				{
					// Alles totaan einde van de regel is comment
					var substrOb = SyntaxHighlighter.strToXHTML(line.substr(beginSingleCommentIndex));
					//var addLen = "<span class='comment'></span>".length;
					line = line.substr(0, beginSingleCommentIndex) + "<span class='comment'>" + substrOb.str + "</span>";
					charIndex = line.length - 1;
					prop[beginSingleCommentIndex] = span_comment_len + substrOb.str.length;
					continue forCharLoop;
				}
			}

			// Quotes
			if (c == "\"" || c == "'")
			{
				var quote = c;
				var beginQuoteIndex = charIndex;
				// Hier doorgaan naar einde quote
				for (charIndex += 1; charIndex < lineLen; charIndex++)
				{
					c = line.charAt(charIndex);
					if (c == "\\")
					{
						charIndex++;
						continue;
					}
					if (c == quote)
					{
						// Einde
						var substrOb = SyntaxHighlighter.strToXHTML(line.substr(beginQuoteIndex, charIndex - beginQuoteIndex + 1));
						//var addLen = "<span class='quote'></span>".length;
						line = line.substr(0, beginQuoteIndex) + "<span class='quote'>" + substrOb.str + "</span>" + line.substr(charIndex + 1);
						prop[beginQuoteIndex] = span_quote_len + substrOb.str.length;
						charIndex += (span_quote_len + substrOb.addLen);
						lineLen += (span_quote_len + substrOb.addLen);
						continue forCharLoop;
					}
				}
			}

			// Operators
			if (lang.operator.indexOf(c) != -1)
			{
				c = (SyntaxHighlighter.xmlEntities[c]) ? SyntaxHighlighter.xmlEntities[c] : c;
				//var addLen = "<span class='operator'></span>".length + (c.length - 1);
				var addLen = span_operator_len + (c.length - 1);
				line = line.substr(0, charIndex) + "<span class='operator'>" + c + "</span>" + line.substr(charIndex + 1);
				prop[charIndex] = addLen + c.length;
				charIndex += addLen;
				lineLen += addLen;
				continue forCharLoop;
			}
		}

		// Keywords - not for each char, but each line
		for (var i = 0; i < lang.keyword.length; i++)
		{
			var keyword = lang.keyword[i];
			var keywordIndex = line.indexOf(keyword);
			while (keywordIndex != -1)
			{
				if (/\w/.test(line.charAt(keywordIndex - 1)) || /\w/.test(line.charAt(keywordIndex + keyword.length))) {
					keywordIndex = line.indexOf(keyword, keywordIndex + 1);
					continue;
				}

				var isKeyword = true;
				for (var key in prop) {
					if (keywordIndex >= parseInt(key) && keywordIndex < (parseInt(key) + parseInt(prop[key]))) {
						isKeyword = false;
						break;
					}
				}
				if (isKeyword) {
					//var addString = "<span class='keyword'></span>";
					//var addLen = addString.length; // dit is erbij gekomen
					//var addLen = span_keyword_len;
					line = line.substr(0, keywordIndex) + "<span class='keyword'>" + keyword + "</span>" + line.substr(keywordIndex + keyword.length);
					prop[keywordIndex] = keyword.length + span_keyword_len;
					var tmpOb = new Object();
					for (var key in prop) {
						if (parseInt(key) > keywordIndex) {
							var newIndex = parseInt(key) + span_keyword_len;
							tmpOb[newIndex] = prop[key];
						} else {
							tmpOb[key] = prop[key];
						}
					}
					prop = SyntaxHighlighter.copyObject(tmpOb);
					keywordIndex = line.indexOf(keyword, keywordIndex + span_keyword_len + keyword.length);
				} else {
					keywordIndex = line.indexOf(keyword, keywordIndex + 1);
				}

			}
		}

		//line.prop = prop;
		lines[lineIndex] = line;
	}

	// Print the lines
	var joinString = "";
	var showLineNumbersThisTime = showLineNumbers;
	var newLines = null;

	if (codeEl.parentNode.nodeName.toLowerCase() != "pre")
	{
		showLineNumbersThisTime = false;
	}

	if (showLineNumbersThisTime)
	{
		newLines = ["<ol>"];
		for (var i = 0; i < lineCount; i++) {
			newLines.push("<li><span>" + lines[i] + "</span></li>");
		}
		newLines.push("</ol>");
	}
	else
	{
		newLines = lines;
		if (codeEl.parentNode.nodeName.toLowerCase() == "pre")
		{
			joinString = "<br />";
		}
	}

	// appname check is necessary, because chrome knows also outerHTML!

	if (codeEl.parentNode.nodeName.toLowerCase() == "pre" && navigator.appName == "Microsoft Internet Explorer") {
		codeEl.parentNode.outerHTML = "<pre><code class='" + codeEl.className + "'>" + newLines.join(joinString) + "</code></pre>"
	} else {
		codeEl.innerHTML = newLines.join(joinString);
	}

	codeEl.className = codeEl.className + " highlighted";
};


SyntaxHighlighter.language.c = {
	"comment" : {
		"single" : {
			"start" : "//"
		},
		"multi" : {
			"start" : "/*",
			"end" : "*/"
		}
	},
	"keyword" : [
		"auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "wchar_t", "while"
	],
	"operator" : [
		"=", "(", ")", "{", "}", "*", "+", "-", "<", ">", "&", "|", "!", "?", "^", "/", ":", "~", "%", "[", "]"
	]
};


SyntaxHighlighter.language.csharp = {
	"comment" : {
		"single" : {
			"start" : "//"
		},
		"multi" : {
			"start" : "/*",
			"end" : "*/"
		}
	},
	"keyword" : [
		"#if", "#else", "#endif", "abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char", "checked", "class", "const", "continue", "decimal", "default", "delegate", "do", "double", "else", "enum", "event", "explicit", "extern", "false", "finally", "fixed", "float", "for", "foreach", "goto", "get", "if", "implicit", "in", "int", "interface", "internal", "is", "locak", "long", "namespace", "new", "null", "object", "operator", "out", "override", "params", "partial", "private", "protected", "public", "readonly", "ref", "return", "sbyte", "sealed", "set", "short", "sizeof", "stackalloc", "static", "string", "struct", "switch", "this", "throw", "true", "try", "typeof", "uint", "ulong", "unchecked", "unsafe", "ushort", "using", "value", "virtual", "volatile", "void", "where", "while", "yield"
	],
	"operator" : [
		".", ",", "=", "(", ")", "{", "}", ";", "+", "-", "<", ">", "&", "|", "!", "?", "[", "]", "/", "%", "^", ":", "~"
	]
};


SyntaxHighlighter.language.js = {
	"comment" : {
		"single" : {
			"start" : "//"
		},
		"multi" : {
			"start" : "/*",
			"end" : "*/"
		}
	},
	"keyword" : [
		"arguments", "Array", "Boolean", "break", "case", "catch", "continue", "Date", "delete", "do", "each", "else", "Error", "false", "for", "Function", "function", "if", "Infinity", "Math", "NaN", "new", "null", "Number", "Object", "RegExp", "return", "String", "switch", "this", "throw", "true", "try", "undefined", "var", "while"
	],
	"operator" : [
		"=", "(", ")", "{", "}", "+", "-", "!", "?", "<", ">", ";", ".", "[", "]", "&"
	]
};


SyntaxHighlighter.language.sql = {
	"comment" : {
		"multi" : {
			"start" : "<!--",
			"end" : "-->"
		}
	},
	"keyword" : [
		"add", "alter", "and", "as", "column", "create", "database", "delete", "describe", "distinct", "do", "drop", "explain", "from", "group by", "handler", "index", "insert", "into", "left join", "limit", "on", "optimize", "order by", "rename", "replace", "select", "set", "show", "table", "update", "use", "where"
	],
	"operator" : [
		"<", ">", "=", "(", ")", "*", ";", "!", ","
	]
};

SyntaxHighlighter.language.php = {
	"comment" : {
		"single" : {
			"start" : "//"
		},
		"multi" : {
			"start" : "/*",
			"end" : "*/"
		}
	},
	"keyword" : [
		"abstract", "array", "as", "bool", "boolean", "break", "case", "catch", "class", "clone", "const", "continue", "declare", "default", "define", "do", "echo", "else", "elseif", "empty", "exit", "extends", "final", "for", "foreach", "function", "if", "implements", "include", "include_once", "int", "interface", "isset", "list", "new", "null", "object", "print", "private", "protected", "public", "require", "require_once", "return", "static", "string", "switch", "throw", "try", "unset", "while"
	],
	"operator" : [
		"=", "(", ")", "{", "}", "+", "-", "!", "?", "<", ">", "&", ";", ".", "[", "]", "%"
	]
};


SyntaxHighlighter.language.python = {
	"comment" : {
		"single" : {
			"start" : "#"
		},
		"multi" : {
			"start" : "\"\"\"",
			"end" : "\"\"\""
		}
	},
	"keyword" : [
		"and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else", "except", "exec", "False", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "None", "not", "or", "pass", "print", "raise", "return", "True", "try", "while", "with", "yield"
	],
	"operator" : [
		"=", "(", ")", "{", "}", ":", "+", "-", "!", "<", ">", ";", ".", "%", "/", "[", "]", "|", "^", "~", "&", "@", "`", "*"
	]
};


SyntaxHighlighter.language.vb = {
	"comment" : {
		"single" : {
			"start" : "'"
		}
	},
	"keyword" : [
		"AddHandler", "AddressOf", "Alias", "And", "AndAlso", "As", "Boolean", "ByRef", "Byte", "ByVal", "Call", "Case", "Catch", "CBool", "CByte", "CChar", "CDate", "CDec", "CDbl", "Char", "CInt", "Class", "CLng", "CObj", "Const", "Continue", "CSByte", "CShort", "CSng", "CStr", "CType", "CUInt", "CULong", "CUShort", "Date", "Decimal", "Declare", "Default", "Delegate", "Dim", "DirectCast", "Do", "Double", "Each", "Else", "ElseIf", "End", "Enum", "Erase", "Error", "Event", "Exit", "False", "Finally", "For", "Friend", "Function", "Get", "GetType", "Global", "GoTo", "Handles", "If", "Implements", "Imports", "In", "Inherits", "Integer", "Interface", "Is", "IsNot", "Lib", "Like", "Long", "Loop", "Me", "Mod", "Module", "MustInherit", "MustOverride", "MyBase", "MyClass", "Namespace", "Narrowing", "New", "Next", "Not", "Nothing", "NotInheritable", "NotOverridable", "Object", "Of", "On", "Operator", "Option", "Optional", "Or", "OrElse", "Overloads", "Overridable", "Overrides", "ParamArray", "Partial", "Private", "Property", "Protected", "Public", "RaiseEvent", "ReadOnly", "ReDim", "REM", "RemoveHandler", "Resume", "Return", "SByte", "Select", "Set", "Shadows", "Shared", "Short", "Single", "Static", "Step", "Stop", "String", "Structure", "Sub", "SyncLock", "Then", "Throw", "To", "True", "Try", "TryCast", "TypeOf", "UInteger", "ULong", "Until", "UShort", "Using", "When", "While", "Widening", "With", "WithEvents", "WriteOnly", "Xor"
	],
	"operator" : [
		"=", "(", ")", "+", "-", "<", ">", "&", "/", "^"
	]
};


SyntaxHighlighter.language.win32 = {
	"comment" : {
		"single" : {
			"start" : "//"
		},
		"multi" : {
			"start" : "/*",
			"end" : "*/"
		}
	},
	"keyword" : [
		"ATOM", "auto", "BOOL", "BOOLEAN", "break", "BYTE", "CALLBACK", "case", "char", "CHAR", "COLORREF", "const", "CONST", "continue", "default", "do", "double", "DWORD", "else", "enum", "extern", "float", "FLOAT", "for", "goto", "HANDLE", "HBITMAP", "HBRUSH", "HCOLORSPACE", "HCURSOR", "HDC", "HFILE", "HFONT", "HICON", "HINSTANCE", "HMENU", "HMODULE", "HPEN", "HRESULT", "HWND", "if", "int", "INT", "INT_PTR", "INT32", "INT64", "long", "LONG", "LONGLONG", "LONG_PTR", "LONG32", "LONG64", "LPARAM", "LPBOOL", "LPBYTE", "LPCSTR", "LPCTSTR", "LPCVOID", "LPCWSTR", "LPDWORD", "LPHANDLE", "LPINT", "LPLONG", "LPSTR", "LPTSTR", "LPVOID", "LPWORD", "LPWSTR", "LRESULT", "PBOOL", "PBOOLEAN", "PBYTE", "PCHAR", "PCSTR", "PCTSTR", "PCWSTR", "PDWORD", "PFLOAT", "PHANDLE", "PINT", "register", "return", "short", "SHORT", "signed", "sizeof", "static", "struct", "switch", "TCHAR", "typedef", "UCHAR", "UINT", "UINT32", "ULONG", "UNICODE_STRING", "union", "unsigned", "USHORT", "void", "VOID", "volatile", "WCHAR", "while", "WINAPI", "WORD", "WPARAM"
	],
	"operator" : [
		"=", "(", ")", "{", "}", ";", ".", ",", "*", "+", "-", "<", ">", "&", "|", "!", "?", "^", "/", ":", "~", "%"
	]
};
