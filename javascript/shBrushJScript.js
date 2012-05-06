/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 *
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var keywords =	'break case catch continue ' +
						'default delete do else ' +
						'for if in instanceof ' +
						'new push return super switch ' +
						'this throw try typeof while with ' +
						'taint unescape length '
						;
		var identifiers =	'false true null NaN Infinity ';
		var constants = 'constructor prototype name value arguments undefined ';
		var blueBold = 'document window history frame localStorage toString JSON location push eval isNaN parseFloat parseInt escape untaint valueOf toString alert confirm prompt hasOwnProperty '+
		'toString hasOwnProperty call '+
		'indexOf '+
		'getElementById '+
		'toLowerCase toUpperCase '+
		'stringify parse '
		;

		var r = SyntaxHighlighter.regexLib;

		this.regexList = [
			{ regex: r.multiLineDoubleQuotedString,																					css: 'string' },		// double quoted strings
			{ regex: r.multiLineSingleQuotedString,																					css: 'string' },		// single quoted strings
			{ regex: r.singleLineCComments,																							css: 'comments' },		// one line comments
			{ regex: r.multiLineCComments,																							css: 'comments' },		// multiline comments
			{ regex: /\s*#.*/gm,																									css: 'preprocessor' },	// preprocessor tags like #region and #endregion
			{ regex: /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g,		css: 'number' },		// numbers
			{ regex: new RegExp(this.getKeywords(blueBold), 'gm'),																	css: 'blueBold' },		// blueBold
			{ regex: /\{|\}|\(|\)|\[|\]/g,																							css: 'brackets' },		// common brackets
			{ regex: /\b(?!function|if|else|for|while|with|try)(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g,							css: 'functions' },		// function names
			{ regex: /\b(function|var|let|const|Object|String|Math|Date|Array|RegExp|XRegExp)/gm,									css: 'operations' },	// operations
			{ regex: /\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])*\/[gim]*/g,																	css: 'regex' },			// regex
			{ regex: /\|\||\&\&|\>|\<|\>\=|\<\=|\=\=|\=\=\=|\!\=|\!\=\=|\+|\+\+|\-|\-\-|\=/gm,										css: 'keyword' },		// operations
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),																	css: 'keyword' },		// keywords
			{ regex: new RegExp(this.getKeywords(constants), 'gm'),																	css: 'constants' },		// constants
			{ regex: new RegExp(this.getKeywords(identifiers), 'gm'),																css: 'identifier' }		// identifiers
			];

		this.forHtmlScript(r.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['js', 'jscript', 'javascript'];

	SyntaxHighlighter.brushes.JScript = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
