/**
 * highlightJavascript.js V0.9
 * New in V0.9 - first stable release! Optomizations and comments to be added for 1.0
 */
(function(window) {
	"use strict";
	var document = window.document;
	var highlightJavascript = function(input, options, language) {
			var lines, marginLeft, type, name, id, attr;
			var element = input;
			var selector = input.id;
			var originalCode = input.innerHTML;
			var start = "<ol>";
			var end = "</ol>";
			var code = input.innerHTML;
			var internalRegex = {
				/**
				 * regex without whitespace
				 * matches /
				 * is not followed by a *
				 * must contain one or more of pretty much anything
				 * has a /
				 * optional flags
				 * is not followed by spaces, letters or numbers.
				 * case insensitive.
				 */
				regex1: /\/(?![\*])(?:[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\{\]\}\\\|\;\:\'\"\,\<\.\>\/\?a-z0-9])+\/[gim\040]*(?=\,|\.|\;|\]|\)|\}|\n|\r|\n\r|$)(?![a-z0-9\040])/gi,
				/**
				 * regex with whitespace
				 * matches /
				 * is not followed by a *
				 * must contain one or more of pretty much anything
				 * has a /
				 * optional flags
				 * is not followed by spaces, letters or numbers.
				 * case insensitive.
				 */
				regex2: /\/(?![\*])(?:\040*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\{\]\}\\\|\;\:\'\"\,\<\.\>\/\?a-z0-9])+\/[gim\040]*(?=\,|\.|\;|\]|\)|\}|\n|\r|\n\r|$)(?![a-z0-9\040])/gi,
				/**
				 * numbers
				 */
				number: /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b(?!\}\~)/g,
				/**
				 * matches and forgets '
				 * matches and forgets ' or \
				 * matches and forgets \ and all characters
				 * matches and forgets '
				 * or
				 * matches and forgets "
				 * matches and forgets " or \
				 * matches and forgets \ and all characters
				 * matches and forgets "
				 */
				string: /(?:'[^'\\]*(?:\\.[^'\\]*)*')|(?:"[^"\\]*(?:\\.[^"\\]*)*")/g,
				/**
				 * matches and remembers (1) whitespace
				 * matches and remembers (1) one character of a letter, number or whitespace
				 * matches and remembers (2) //
				 * matches and remembers (2) all characters until new line
				 * case insensitive
				 */
				singleComment: /\/\/.+?(?=\n|\r|$)/ig,
				/**
				 * matches / *
				 * matches any whitespace and non whitespace
				 * matches * /
				 */
				multiComment: /\/\*[\s\S]+?\*\//g,
				/**
				 * matches whitespace before or after string
				 */
				whiteSpace: /^\s+|\s+$/g,
				/**
				 * matches any carage return
				 */
				newline: /[\r\n]/g,
				/**
				 * matches "
				 */
				quote: /"/g,
				/**
				 * matches <
				 */
				lessthan: /</g,
				/**
				 * matches >
				 */
				greaterthan: />/g,
				/**
				 * matches &
				 */
				ampersand: /&/g,
				/**
				 * matches ~{
				 * matches and remembers (1) specific words
				 * followed by -
				 * matches and remembers (2) 0-9 one or more times
				 * followed by }~
				 * case insensitive
				 */
				temporary: /~{(string|link|code|singleComment|multiComment|lessthan|greaterthan|ampersand|quote|escaped)\-([0-9]+)}~/ig,
				/**
				 * matches <a
				 * with href="..."
				 * and other attributes
				 * matches >
				 * matches text
				 * matches </a>
				 */
				link: /\<a\b href\=\"[htpfs]+\:\/\/[^"]+\"[^>]*\>(?:.*?)\<\/a\>/g,
				/**
				 * matches <
				 * matches and forgets ! or /
				 * matches alpha-numeric tag name
				 * matches and forgets attributes
				 * matches >
				 */
				tag: /\<(?:\!|\/)?[a-z][a-z0-1\-]\s*(?:[^>]+)?\>/ig,
				/**
				 * matches url
				 */
				url: /(?:http|ftp|https):\/\/[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/g
			};
			var data = {
				singleComment: {},
				multiComment: {},
				string: {},
				code: {},
				link: {},
				lessthan: {"0":"&lt;"},
				greaterthan: {"0":"&gt;"},
				ampersand: {"0":"&amp;"},
				quote: {"0":"&quot;"},
				escaped: {}
			};
			var regex = {};
			/**
			 * Make a reference to the language values. Javascript language definition is included by default.
			 */
			for (var attr in internalRegex) {
				if (internalRegex.hasOwnProperty(attr)) {
					if (language.regex[attr]) {
						regex[attr] = language.regex[attr];
					} else {
						regex[attr] = internalRegex[attr];
					}
				}
			}
			for (var attr in language.regex) {
				if (language.regex.hasOwnProperty(attr)) {
					if (!regex[attr]) {
						regex[attr] = language.regex[attr];
					}
				}
			}
			// var regex = language.regex;
			var regexList = language.regexList;
			var types = ["singleComment", "multiComment", "string"];
			// characters that break things
			var badChars = ["\\","<","*","."];
			var i = 0;
			var e = 0;
			/**
			 * remove beginning and trailing whitespace for the script to work properly.
			 */
			code = code.replace(internalRegex.whiteSpace, "");
			/**
			 * Functions defined outside of all loops in order to prevent having to recreate them repeatedly.
			 */
			var offsetFunctions = [];
			offsetFunctions[0] = function(string, offset) {
				data.link[offset] = string;
				return "~{link-" + offset + "}~";
			};
			offsetFunctions[1] = function(string) {
				var zero = 0;
				var originalString = string;
				if(string.match(internalRegex.quote)) {
					string = string.replace(internalRegex.quote, function(string, offset) {
						return "~{quote-"+zero+"}~";
					});
				}
				if(string.match(internalRegex.ampersand)) {
					string = string.replace(internalRegex.ampersand, function(string, offset) {
						return "~{ampersand-"+zero+"}~";
					});
				}
				if(string.match(internalRegex.lessthan)) {
					string = string.replace(internalRegex.lessthan, function(string, offset) {
						return "~{lessthan-"+zero+"}~";
					});
				}
				if(string.match(internalRegex.greaterthan)) {
					string = string.replace(internalRegex.greaterthan, function(string, offset) {
						return "~{greaterthan-"+zero+"}~";
					});
				}
				return string
			};
			offsetFunctions[2] = function(string, offset) {
				data.link[offset] = "<a href=\"" + string + "\">" + string + "</a>";
				return "~{link-" + offset + "}~";
			};
			offsetFunctions[3] = function(string, offset, code) {
				if(badChars.indexOf(code.charAt(offset-1)) > -1 || code.charAt(offset-1) === "\"") {
					console.log(string);
					return string;
				}
				var match = false;
				if (type === "string" && regex.escaped && string.match(regex.escaped)) {
					match = true;
					//parse escaped characters
					string = string.replace(regex.escaped, offsetFunctions[8]);
				}
				/**
				 * Parse html enabling code out of equation
				 */
				string = offsetFunctions[1](string);
				data[type][offset] = string;
				return "~{" + type + "-" + offset + "}~";
			};
			offsetFunctions[4] = function(string) {

				return "</span>" + string + "<span class=\"" + style + "\">";
			};
			offsetFunctions[5] = function(string) {
				/**
				 * Parse html enabling code out of equation
				 */
				var newString = offsetFunctions[1](string);
				data.code[e] = "<span class=\"" + regexList[i].css + "\">" + newString + "</span>";
				e = e + 1;
				return "~{code-" + (e - 1) + "}~";
			};
			offsetFunctions[6] = function(string, name, number) {
				return data[name][number];
			};
			offsetFunctions[7] = function(string, offset, code) {
				//parse escaped characters
				if (regex.escaped) {
					string = string.replace(regex.escaped, offsetFunctions[8]);
				}
				/**
				 * Remove any brackets that may cause the browser to parse the code as html
				 */
				var newString = offsetFunctions[1](string);
				data.code[e] = "<span class=\"regex\">" + newString + "</span>";
				e = e + 1;
				return "~{code-" + (e - 1) + "}~";
			};
			offsetFunctions[8] = function(string) {
				/**
				 * Remove any brackets that may cause the browser to parse the code as html
				 */
				var newString = offsetFunctions[1](string);
				data.escaped[e] = "<span class=\"constant\">" + newString + "</span>";
				e = e + 1;
				return "~{escaped-" + (e - 1) + "}~";
			};
			offsetFunctions[9] = function(string, offset, code) {
				if(badChars.indexOf(code.charAt(offset-1)) > -1) {
					console.log(string);
					return string;
				}
				//parse escaped characters
				if (regex.escaped) {
					string = string.replace(regex.escaped, offsetFunctions[8]);
				}
				/**
				 * Remove any brackets that may cause the browser to parse the code as html
				 */
				var newString = offsetFunctions[1](string);
				data.code[e] = "<span class=\"regex\">" + newString + "</span>";
				e = e + 1;
				return "~{code-" + (e - 1) + "}~";
			};
			/**
			 * remove any unnecessary formatting
			 */
			if(options && options.all.indexOf("parsed") > -1) {
				code = code.replace(/&amp;/ig,"&");
				code = code.replace(/&lt;/ig,"<");
				code = code.replace(/&gt;/ig,">");
			}
			/**
			 * save links
			 */
			code = code.replace(regex.link, offsetFunctions[0])
			/**
			 * Used to fix issue caused by <pre><code class="">...</code></pre> being within the code.
			 * The browser would read the tags and implement them, causing undesired effects.
			 * In reality we want the tags to show up as text, not be rendered.
			 */

			/**
			 * Interpret urls as links.
			 */
			if (code.match(regex.url)) {
				code = code.replace(regex.url, offsetFunctions[2]);
			}
			/**
			 * Comment and String parsing are practically the same, with different parameters being the only difference, so we optomize by using this loop to avoid code duplication.
			 * Comment and string regex to look for is provided by the language definition.
			 */
			for (i = 0; i < types.length; i++) {
				type = types[i];
				/**
				 * Match regex before comments so that they are mapped out properly
				 */
				if (type === "string" && code.match(regex.regex1)) {
					code = code.replace(regex.regex1, offsetFunctions[9]);
				}
				if (code.match(regex[type])) {
					code = code.replace(regex[type], offsetFunctions[3]);
					for (attr in data[type]) {
						/**
						 * If Object.prototype has been modified we need the below line.
						 */
						if (data[type].hasOwnProperty(attr)) {
							if (type.indexOf("Comment") > -1) {
								var style = "comment";
							} else {
								var style = "string";
							}
							data[type][attr] = "<span class=\"" + style + "\">" + data[type][attr];
							if (data[type][attr].match(regex.newline)) {
								data[type][attr] = data[type][attr].replace(regex.newline, offsetFunctions[4]);
							}
							data[type][attr] = data[type][attr] + "</span>";
						}
					}
				}
				if (type === "string" && code.match(regex.regex2)) {
					code = code.replace(regex.regex2, offsetFunctions[7]);
				}
			}
			/**
			 * Run through each custom defined regex used by the language.
			 */
			for (i = 0; i < regexList.length; i++) {
				if (code.match(regexList[i].regex)) {
					code = code.replace(regexList[i].regex, offsetFunctions[5]);
				}
			}
			/**
			 * Replace all temporary code placeholders with the parsed values. This prevents duplicate parsing.
			 */
			while (code.match(regex.temporary)) {
				code = code.replace(internalRegex.temporary, offsetFunctions[6]);
			}
			// if(regex.escaped) {
			// 	code = code.replace(regex.escaped, offsetFunctions[8]);
			// }
			/**
			 * Split newlines into list items for proper numbering.
			 */
			if (code.match(regex.newline)) {
				code = code.split(regex.newline);
				code = code.join("</span></li><li><span>");
			}
			code = "<li><span>" + code + "</span></li>";
			/**
			 * Replace pre tag code with parsed code.
			 */
			element.innerHTML = (start + code + end);
			/**
			 * Style for newlines.
			 */
			if (options && ((options[selector] && options[selector].indexOf("nolines") > -1) || options.all.indexOf("nolines") > -1)) {
				element.children[0].style.marginLeft = "5px";
				element.children[0].style.listStyleType = "none";
			} else {
				lines = ((originalCode.indexOf("\n") !== -1) ? originalCode.split("\n") : originalCode.split("\r")).length;
				if (lines > 100) {
					if (lines > 1000) {
						element.children[0].style.marginLeft = "5em";
					} else {
						element.children[0].style.marginLeft = "4em";
					}
				}
			}
		};
	highlightJavascript.getKeywords = function(str) {
		str = str.join(" ");
		str = str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '|');
		return '\\b(?:' + str + ')(?!}~)?\\b';
	};
	highlightJavascript.format = function(options) {
		var i, codeList, formattedOptions;
		if (options) {
			if (options === "nolines") {
				formattedOptions = {
					"all": ["nolines"]
				};
			}
			if(options === "parsed") {
				formattedOptions = {
					"all": ["parsed"]
				};
			}
		}
		codeList = document.querySelectorAll("pre code[class]");
		for (i = 0; i < codeList.length; i++) {
			/**
			 * Used to counter a really friggin annoying issue where parentNode was null or undefined.
			 */
			if (codeList[i].parentElement) {
				var parentName = codeList[i].parentElement.parentElement.nodeName.toLowerCase();
				/**
				 * make sure we aren't grabbing any child code tags, those should be parsed to text.
				 */
				if (parentName !== "code" && parentName !== "pre") {
					if (highlightJavascript.language[codeList[i].className]) {
						highlightJavascript(codeList[i], formattedOptions, highlightJavascript.language[codeList[i].className]);
					} else {
						console.error("The language: \"" + codeList[i].className + "\", is not included!");
					}
				}
			}
		}
	};
	highlightJavascript.language = {};
	(function(sh) {
		var nativeVar = ["__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__", "$1", "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9", "$_", "$input", "Array", "Boolean", "ChartoUTF8", "Date", "E", "Function", "JSON", "LN10", "LN2", "LOG10E", "LOG2E", "Math", "Number", "Object", "PI", "RegExp", "SQRT1_2", "SQRT2", "String", "UTC", "abs", "acos", "anchor", "apply", "asin", "atan", "atan2", "big", "bind", "blink", "bold", "call", "ceil", "charAt", "charCodeAt", "concat", "cos", "create", "defineProperties", "defineProperty", "document", "every", "exp", "filter", "fixed", "floor", "fontcolor", "fontsize", "forEach", "freeze", "getDate", "getDay", "getFullYear", "getHours", "getMilliseconds", "getMinutes", "getMonth", "getOwnPropertyDescriptor", "getOwnPropertyNames", "getPrototypeOf", "getSeconds", "getTime", "getTimezoneOffset", "getUTCDate", "getUTCDay", "getUTCFullYear", "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth", "getUTCSeconds", "getYear", "hasOwnProperty", "indexOf", "isExtensible", "isFrozen", "isPrototypeOf", "isSealed", "italics", "join", "lastIndexOf", "link", "localeCompare", "log", "map", "match", "max", "min", "now", "parse", "pop", "pow", "preventExtensions", "propertyIsEnumerable", "push", "random", "reduce", "reduceRight", "replace", "reverse", "round", "seal", "search", "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds", "setYear", "shift", "sin", "slice", "small", "some", "sort", "splice", "split", "sqrt", "strike", "stringify", "sub", "substr", "substring", "sup", "tan", "toDateString", "toExponential", "toFixed", "toGMTDateString", "toISODateString", "toJSON", "toLocaleDateString", "toLocaleLowerCase", "toLocaleString", "toLocaleTimeString", "toLocaleUpperCase", "toLowerCase", "toPrecision", "toString", "toTimeString", "toUTCString", "toUpperCase", "trim", "trimLeft", "trimRight", "unshift", "valueOf", "window"];
		var reserved = ["function", "var", "let", "const", "void", "native"];
		var constructs = ["if", "for", "while", "with", "else", "return", "break", "new", "in", "switch", "try", "catch", "case"];
		var lang = ["NaN", "true", "false", "undefined", "null"];
		var constant = ["arguments", "caller", "constructor", "keys", "prototype", "MAX_VALUE", "MIN_VALUE", "NEGATIVE_INFINITY", "POSITIVE_INFINITY", "multiline", "lastMatch", "lastParen", "leftContext", "length", "name", "rightContext", "input"];
		var regex = {
			"singleComment": /\/\/.+?(?=\n|\r|$)/ig,
			"multiComment": /\/\*[\s\S]+?\*\//g,
			"string": /(?:'[^'\\]*(?:\\.[^'\\]*)*')|(?:"[^"\\]*(?:\\.[^"\\]*)*")/g,
			"number": /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b(?!\}\~)/g,
			"math": /(\||\+|\=|\-|\/|\>|\<|\!|\?|\&|\%|\$)(?![0-9]*}~)/g,
			"bracket": /\{|\}|\(|\)|\[|\]/g,
			"tag": /\<(?:\!|\/)?[a-z][a-z0-1\-]\s*(?:[^>]+)?\>/ig,
			"function": /\b(?!function|if|else|for|while|with|try)(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g,
			"escaped": /\\(?:0[0-3][0-7][0-7]|[0-3][0-7][0-7]|[0-7][0-7]|[0-9]|.)/g
		};
		var regexList = [{
			regex: new RegExp(sh.getKeywords(nativeVar), 'gm'),
			css: "native"
		}, {
			regex: new RegExp(sh.getKeywords(reserved), 'gm'),
			css: "reserved"
		}, {
			regex: new RegExp(sh.getKeywords(constructs), 'gm'),
			css: "constructs"
		}, {
			regex: new RegExp(sh.getKeywords(lang), 'gm'),
			css: "language"
		}, {
			regex: new RegExp(sh.getKeywords(constant), 'gm'),
			css: "constant"
		}, {
			regex: regex.tag,
			css: "constructs"
		}, {
			regex: regex.number,
			css: "number"
		}, {
			regex: regex.math,
			css: "constructs"
		}, {
			regex: regex["function"],
			css: "function"
		}];
		sh.language = sh.language || {};
		sh.language["js"] = {
			regex: regex,
			regexList: regexList
		};
	}(highlightJavascript));
	window.highlightJavascript = highlightJavascript;
}(window));