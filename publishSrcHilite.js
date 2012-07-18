/**
 * cannot confirm this will work with unmodified template
 */
JSDOC.PluginManager.registerPlugin("JSDOC.publishSrcHilite", {
	onPublishSrc: function(src) {
		if (src.path in JsHilite.cache) {
			return; // already generated src code
		} else JsHilite.cache[src.path] = true;

		try {
			var sourceCode = IO.readFile(src.path);
		} catch (e) {
			print(e.message);
			quit();
		}
		var header = '<!DOCTYPE html>' + "\n" + '<html>' + "\n" + '<head>' + "\n" + '<meta charset="utf-8"></meta>' + "\n" + '<meta name="generator" content="JsDoc Toolkit"></meta>' + "\n" + '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>' + "\n" + '<meta name="mobileoptimized" content="0"></meta>' + "\n" + '<style>' + "\n" + base64_decode(css) + "\n" + "</style>" + "\n" + "<script>" + "\n" + base64_decode(js) + "\n" + "</script>" + "\n" + "</head>" + "\n" + "<body>" + "\n" + "<pre>" + "\n" + "<code class=\"js\">" + "\n" + "<script>" + "\n";
		var footer = "</script>" + "\n" + "</code>" + "\n" + "</pre>" + "\n" + "<script>" + "\n" + "highlightJavascript.format();" + "\n" + "</script>" + "\n" + "</body>" + "\n" + "</html>";
		src.hilited = header + sourceCode + footer;
	}
});

function JsHilite(src) {
	this.src = src;
	this.header = '<!DOCTYPE html>' + "\n" + '<html>' + "\n" + '<head>' + "\n" + '<meta charset="utf-8"></meta>' + "\n" + '<meta name="generator" content="JsDoc Toolkit"></meta>' + "\n" + '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>' + "\n" + '<meta name="mobileoptimized" content="0"></meta>' + "\n" + '<style>' + "\n" + base64_decode(css) + "\n" + "</style>" + "\n" + "<script>" + "\n" + base64_decode(js) + "\n" + "highlightJavascript.format();" + "\n" + "</script>" + "\n" + "</head>" + "\n" + "<body>" + "\n" + "<pre>" + "\n" + "<code class=\"js\">" + "\n";
	this.footer = "</code>" + "\n" + "</pre>" + "\n" + "<script>" + "\n" + base64_decode(js) + "\n" + "highlightJavascript.format('parsed');" + "\n" + "</script>" + "\n" + "</body>" + "\n" + "</html>";
}

JsHilite.cache = {};

JsHilite.prototype.hilite = function() {
	return this.header + this.src + this.footer;
}

function utf8_decode(str_data) {
	// Converts a UTF-8 encoded string to ISO-8859-1
	//
	// version: 1109.2015
	// discuss at: http://phpjs.org/functions/utf8_decode
	// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// +      input by: Aman Gupta
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Norman "zEh" Fuchs
	// +   bugfixed by: hitwork
	// +   bugfixed by: Onno Marsman
	// +      input by: Brett Zamir (http://brett-zamir.me)
	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// *     example 1: utf8_decode('Kevin van Zonneveld');
	// *     returns 1: 'Kevin van Zonneveld'
	var tmp_arr = [],
		i = 0,
		ac = 0,
		c1 = 0,
		c2 = 0,
		c3 = 0;

	str_data += '';

	while (i < str_data.length) {
		c1 = str_data.charCodeAt(i);
		if (c1 < 128) {
			tmp_arr[ac++] = String.fromCharCode(c1);
			i++;
		} else if (c1 > 191 && c1 < 224) {
			c2 = str_data.charCodeAt(i + 1);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = str_data.charCodeAt(i + 1);
			c3 = str_data.charCodeAt(i + 2);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}

	return tmp_arr.join('');
};

function base64_decode(data) {
	// Decodes string using MIME base64 algorithm
	//
	// version: 1109.2015
	// discuss at: http://phpjs.org/functions/base64_decode
	// +   original by: Tyler Akins (http://rumkin.com)
	// +   improved by: Thunder.m
	// +      input by: Aman Gupta
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfixed by: Onno Marsman
	// +   bugfixed by: Pellentesque Malesuada
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +      input by: Brett Zamir (http://brett-zamir.me)
	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// -    depends on: utf8_decode
	// *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
	// *     returns 1: 'Kevin van Zonneveld'
	// mozilla has this native
	// - but breaks in 2.0.0.12!
	//if (typeof this.window['btoa'] == 'function') {
	//    return btoa(data);
	//}
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = "",
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do { // unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;

		if (h3 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);

	dec = tmp_arr.join('');
	dec = utf8_decode(dec);

	return dec;
};
var css = "QGNoYXJzZXQgInV0Zi04IjtwcmV7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDIzOCwyMzgsMjM4LDAuOTIxNSk7bWFyZ2luOjA7b3ZlcmZsb3c6YXV0b31vbHtsaXN0LXN0eWxlLXR5cGU6ZGVjaW1hbC1sZWFkaW5nLXplcm87bWFyZ2luOjA7bWFyZ2luLWxlZnQ6M2VtO21hcmdpbi10b3A6MCFpbXBvcnRhbnQ7bWFyZ2luLWJvdHRvbTowIWltcG9ydGFudDtwYWRkaW5nOjA7ZGlzcGxheTppbmxpbmUtYmxvY2s7bWF4LXdpZHRoOjk3JTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjM4LDIzOCwyMzgsMC45MjE1KTt3aGl0ZS1zcGFjZTpwcmUtd3JhcDt3aGl0ZS1zcGFjZTotcHJlLXdyYXA7d2hpdGUtc3BhY2U6LW8tcHJlLXdyYXA7d2hpdGUtc3BhY2U6LW1vei1wcmUtd3JhcDt3aGl0ZS1zcGFjZTotaHAtcHJlLXdyYXA7d29yZC13cmFwOmJyZWFrLXdvcmR9cHJlIGNvZGUgbGl7Zm9udC1mYW1pbHk6Q29uc29sYXMsIkNvdXJpZXIgTmV3Ijtjb2xvcjpyZ2JhKDEyNSwxMjUsMTI1LDAuOTU2ODYpO2JhY2tncm91bmQtY29sb3I6cmdiYSgyMzgsMjM4LDIzOCwwLjkyMTUpfXByZSBjb2RlIGxpIHNwYW57Zm9udC1mYW1pbHk6Q29uc29sYXMsIkNvdXJpZXIgTmV3Ijtjb2xvcjpibGFja31wcmUgY29kZSBsaS5oaWdobGlnaHRlZHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsMC4xMDE5Nil9cHJlIGNvZGUgLmNvbW1lbnR7Y29sb3I6IzA2Zjtmb250LXN0eWxlOml0YWxpY31wcmUgY29kZSAuc3RyaW5ne2NvbG9yOiMwOTN9cHJlIGNvZGUgLm51bWJlcntjb2xvcjojMDZmfXByZSBjb2RlIC5uYXRpdmV7Y29sb3I6IzAwZjtmb250LXdlaWdodDpib2xkfXByZSBjb2RlIC5jb25zdHJ1Y3Rze2NvbG9yOiMwMGZ9cHJlIGNvZGUgLmxhbmd1YWdle2NvbG9yOiM5NzAwY2N9cHJlIGNvZGUgLnJlc2VydmVke2NvbG9yOiMwMDA7Zm9udC13ZWlnaHQ6Ym9sZH1wcmUgY29kZSAuY29uc3RhbnR7Y29sb3I6IzY3ODJkM31wcmUgY29kZSAuZnVuY3Rpb257Y29sb3I6I2ZmODAwMH1wcmUgY29kZSAucmVnZXh7Y29sb3I6I2ZmMDA4MH06Oi13ZWJraXQtc2Nyb2xsYmFye2hlaWdodDoxMXB4O3dpZHRoOjExcHh9Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYnstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMXB4IDFweCAwIHJnYmEoMCwwLDAsLjEpLGluc2V0IDAgLTFweCAwIHJnYmEoMCwwLDAsLjA3KTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjIpO21pbi1oZWlnaHQ6MjhweDtwYWRkaW5nLXRvcDoxMDBweH06Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyey13ZWJraXQtYm94LXNoYWRvdzppbnNldCAxcHggMXB4IDFweCByZ2JhKDAsMCwwLC4yNSk7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC40KX06Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmFjdGl2ZXstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMXB4IDFweCAzcHggcmdiYSgwLDAsMCwuMzUpO2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNSl9Ojotd2Via2l0LXNjcm9sbGJhci10cmFja3tiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC4wNSl9Ojotd2Via2l0LXNjcm9sbGJhci10cmFjazp2ZXJ0aWNhbHtib3JkZXItdG9wOjFweCBzb2xpZCAjZGRkO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkZGR9Ojotd2Via2l0LXNjcm9sbGJhci10cmFjazpob3Jpem9udGFse2JvcmRlci1sZWZ0OjFweCBzb2xpZCAjZGRkO2JvcmRlci1yaWdodDoxcHggc29saWQgI2RkZH06Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOnZlcnRpY2Fse2JvcmRlci13aWR0aDowO2JvcmRlci1sZWZ0LXdpZHRoOjA7Ym9yZGVyLXJpZ2h0LXdpZHRoOjB9Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3Jpem9udGFse2JvcmRlci13aWR0aDowO2JvcmRlci1ib3R0b206MDtib3JkZXItdG9wOjB9Ojotd2Via2l0LXNjcm9sbGJhci10cmFjazpob3Zlcnstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMXB4IDAgMCByZ2JhKDAsMCwwLC4xKTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjA1KX06Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrOmFjdGl2ZXstd2Via2l0LWJveC1zaGFkb3c6aW5zZXQgMXB4IDAgMCByZ2JhKDAsMCwwLC4xNCksaW5zZXQgLTFweCAwIDAgcmdiYSgwLDAsMCwuMTQpO2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMSl9";
var js = "KGZ1bmN0aW9uKHdpbmRvdyl7dmFyIGRvY3VtZW50PXdpbmRvdy5kb2N1bWVudDt2YXIgaGlnaGxpZ2h0SmF2YXNjcmlwdD1mdW5jdGlvbihpbnB1dCxvcHRpb25zLGxhbmd1YWdlKXt2YXIgbGluZXMsbWFyZ2luTGVmdCx0eXBlLG5hbWUsaWQsYXR0cjt2YXIgZWxlbWVudD1pbnB1dDt2YXIgc2VsZWN0b3I9aW5wdXQuaWQ7dmFyIG9yaWdpbmFsQ29kZT1pbnB1dC5pbm5lckhUTUw7dmFyIHN0YXJ0PSI8b2w+Ijt2YXIgZW5kPSI8L29sPiI7dmFyIGNvZGU9aW5wdXQuaW5uZXJIVE1MO3ZhciBpbnRlcm5hbFJlZ2V4PXtyZWdleDE6L1wvKD8hW1wqXSkoPzpbXGBcflwhXEBcI1wkXCVcXlwmXCpcKFwpXC1cX1w9XCtcW1x7XF1cfVxcXHxcO1w6XCdcIlwsXDxcLlw+XC9cP2EtejAtOV0pK1wvW2dpbVwwNDBdKig/PVwsfFwufFw7fFxdfFwpfFx9fFxufFxyfFxuXHJ8JCkoPyFbYS16MC05XDA0MF0pL2dpLHJlZ2V4MjovXC8oPyFbXCpdKSg/OlwwNDAqW1xgXH5cIVxAXCNcJFwlXF5cJlwqXChcKVwtXF9cPVwrXFtce1xdXH1cXFx8XDtcOlwnXCJcLFw8XC5cPlwvXD9hLXowLTldKStcL1tnaW1cMDQwXSooPz1cLHxcLnxcO3xcXXxcKXxcfXxcbnxccnxcblxyfCQpKD8hW2EtejAtOVwwNDBdKS9naSwNCm51bWJlcjovXGJbKy1dPyg/Oig/OjB4W0EtRmEtZjAtOV0rKXwoPzooPzpbXGRdKlwuKT9bXGRdKyg/OltlRV1bKy1dP1tcZF0rKT8pKXU/KD86KD86aW50KD86OHwxNnwzMnw2NCkpfEwpP1xiKD8hXH1cfikvZyxzdHJpbmc6Lyg/OidbXidcXF0qKD86XFwuW14nXFxdKikqJyl8KD86IlteIlxcXSooPzpcXC5bXiJcXF0qKSoiKS9nLHNpbmdsZUNvbW1lbnQ6L1wvXC8uKz8oPz1cbnxccnwkKS9pZyxtdWx0aUNvbW1lbnQ6L1wvXCpbXHNcU10rP1wqXC8vZyx3aGl0ZVNwYWNlOi9eXHMrfFxzKyQvZyxuZXdsaW5lOi9bXHJcbl0vZyxxdW90ZTovIi9nLGxlc3N0aGFuOi88L2csZ3JlYXRlcnRoYW46Lz4vZyxhbXBlcnNhbmQ6LyYvZyx0ZW1wb3Jhcnk6L357KHN0cmluZ3xsaW5rfGNvZGV8c2luZ2xlQ29tbWVudHxtdWx0aUNvbW1lbnR8bGVzc3RoYW58Z3JlYXRlcnRoYW58YW1wZXJzYW5kfHF1b3RlfGVzY2FwZWQpXC0oWzAtOV0rKX1+L2lnLGxpbms6L1w8YVxiIGhyZWZcPVwiW2h0cGZzXStcOlwvXC9bXiJdK1wiW14+XSpcPig/Oi4qPylcPFwvYVw+L2csDQp0YWc6L1w8KD86XCF8XC8pP1thLXpdW2EtejAtMVwtXVxzKig/OltePl0rKT9cPi9pZyx1cmw6Lyg/Omh0dHB8ZnRwfGh0dHBzKTpcL1wvW1x3XC1fXSsoPzpcLltcd1wtX10rKSsoPzpbXHdcLVwuLEA/Xj0lJmFtcDs6XC9+XCsjXSpbXHdcLVxAP149JSZhbXA7XC9+XCsjXSk/L2d9O3ZhciBkYXRhPXtzaW5nbGVDb21tZW50Ont9LG11bHRpQ29tbWVudDp7fSxzdHJpbmc6e30sY29kZTp7fSxsaW5rOnt9LGxlc3N0aGFuOnsiMCI6IiZsdDsifSxncmVhdGVydGhhbjp7IjAiOiImZ3Q7In0sYW1wZXJzYW5kOnsiMCI6IiZhbXA7In0scXVvdGU6eyIwIjoiJnF1b3Q7In0sZXNjYXBlZDp7fX07dmFyIHJlZ2V4PXt9O2Zvcih2YXIgYXR0ciBpbiBpbnRlcm5hbFJlZ2V4KWlmKGludGVybmFsUmVnZXguaGFzT3duUHJvcGVydHkoYXR0cikpaWYobGFuZ3VhZ2UucmVnZXhbYXR0cl0pcmVnZXhbYXR0cl09bGFuZ3VhZ2UucmVnZXhbYXR0cl07ZWxzZSByZWdleFthdHRyXT1pbnRlcm5hbFJlZ2V4W2F0dHJdOw0KZm9yKHZhciBhdHRyIGluIGxhbmd1YWdlLnJlZ2V4KWlmKGxhbmd1YWdlLnJlZ2V4Lmhhc093blByb3BlcnR5KGF0dHIpKWlmKCFyZWdleFthdHRyXSlyZWdleFthdHRyXT1sYW5ndWFnZS5yZWdleFthdHRyXTt2YXIgcmVnZXhMaXN0PWxhbmd1YWdlLnJlZ2V4TGlzdDt2YXIgdHlwZXM9WyJzaW5nbGVDb21tZW50IiwibXVsdGlDb21tZW50Iiwic3RyaW5nIl07dmFyIGJhZENoYXJzPVsiXFwiLCI8IiwiKiIsIi4iXTt2YXIgaT0wO3ZhciBlPTA7Y29kZT1jb2RlLnJlcGxhY2UoaW50ZXJuYWxSZWdleC53aGl0ZVNwYWNlLCIiKTt2YXIgb2Zmc2V0RnVuY3Rpb25zPVtdO29mZnNldEZ1bmN0aW9uc1swXT1mdW5jdGlvbihzdHJpbmcsb2Zmc2V0KXtkYXRhLmxpbmtbb2Zmc2V0XT1zdHJpbmc7cmV0dXJuIn57bGluay0iK29mZnNldCsifX4ifTtvZmZzZXRGdW5jdGlvbnNbMV09ZnVuY3Rpb24oc3RyaW5nKXt2YXIgemVybz0wO3ZhciBvcmlnaW5hbFN0cmluZz1zdHJpbmc7aWYoc3RyaW5nLm1hdGNoKGludGVybmFsUmVnZXgucXVvdGUpKXN0cmluZz0NCnN0cmluZy5yZXBsYWNlKGludGVybmFsUmVnZXgucXVvdGUsZnVuY3Rpb24oc3RyaW5nLG9mZnNldCl7cmV0dXJuIn57cXVvdGUtIit6ZXJvKyJ9fiJ9KTtpZihzdHJpbmcubWF0Y2goaW50ZXJuYWxSZWdleC5hbXBlcnNhbmQpKXN0cmluZz1zdHJpbmcucmVwbGFjZShpbnRlcm5hbFJlZ2V4LmFtcGVyc2FuZCxmdW5jdGlvbihzdHJpbmcsb2Zmc2V0KXtyZXR1cm4ifnthbXBlcnNhbmQtIit6ZXJvKyJ9fiJ9KTtpZihzdHJpbmcubWF0Y2goaW50ZXJuYWxSZWdleC5sZXNzdGhhbikpc3RyaW5nPXN0cmluZy5yZXBsYWNlKGludGVybmFsUmVnZXgubGVzc3RoYW4sZnVuY3Rpb24oc3RyaW5nLG9mZnNldCl7cmV0dXJuIn57bGVzc3RoYW4tIit6ZXJvKyJ9fiJ9KTtpZihzdHJpbmcubWF0Y2goaW50ZXJuYWxSZWdleC5ncmVhdGVydGhhbikpc3RyaW5nPXN0cmluZy5yZXBsYWNlKGludGVybmFsUmVnZXguZ3JlYXRlcnRoYW4sZnVuY3Rpb24oc3RyaW5nLG9mZnNldCl7cmV0dXJuIn57Z3JlYXRlcnRoYW4tIisNCnplcm8rIn1+In0pO3JldHVybiBzdHJpbmd9O29mZnNldEZ1bmN0aW9uc1syXT1mdW5jdGlvbihzdHJpbmcsb2Zmc2V0KXtkYXRhLmxpbmtbb2Zmc2V0XT0nPGEgaHJlZj0iJytzdHJpbmcrJyI+JytzdHJpbmcrIjwvYT4iO3JldHVybiJ+e2xpbmstIitvZmZzZXQrIn1+In07b2Zmc2V0RnVuY3Rpb25zWzNdPWZ1bmN0aW9uKHN0cmluZyxvZmZzZXQsY29kZSl7aWYoYmFkQ2hhcnMuaW5kZXhPZihjb2RlLmNoYXJBdChvZmZzZXQtMSkpPi0xfHxjb2RlLmNoYXJBdChvZmZzZXQtMSk9PT0nIicpe2NvbnNvbGUubG9nKHN0cmluZyk7cmV0dXJuIHN0cmluZ312YXIgbWF0Y2g9ZmFsc2U7aWYodHlwZT09PSJzdHJpbmciJiZyZWdleC5lc2NhcGVkJiZzdHJpbmcubWF0Y2gocmVnZXguZXNjYXBlZCkpe21hdGNoPXRydWU7c3RyaW5nPXN0cmluZy5yZXBsYWNlKHJlZ2V4LmVzY2FwZWQsb2Zmc2V0RnVuY3Rpb25zWzhdKX1zdHJpbmc9b2Zmc2V0RnVuY3Rpb25zWzFdKHN0cmluZyk7ZGF0YVt0eXBlXVtvZmZzZXRdPQ0Kc3RyaW5nO3JldHVybiJ+eyIrdHlwZSsiLSIrb2Zmc2V0KyJ9fiJ9O29mZnNldEZ1bmN0aW9uc1s0XT1mdW5jdGlvbihzdHJpbmcpe3JldHVybiI8L3NwYW4+IitzdHJpbmcrJzxzcGFuIGNsYXNzPSInK3N0eWxlKyciPid9O29mZnNldEZ1bmN0aW9uc1s1XT1mdW5jdGlvbihzdHJpbmcpe3ZhciBuZXdTdHJpbmc9b2Zmc2V0RnVuY3Rpb25zWzFdKHN0cmluZyk7ZGF0YS5jb2RlW2VdPSc8c3BhbiBjbGFzcz0iJytyZWdleExpc3RbaV0uY3NzKyciPicrbmV3U3RyaW5nKyI8L3NwYW4+IjtlPWUrMTtyZXR1cm4ifntjb2RlLSIrKGUtMSkrIn1+In07b2Zmc2V0RnVuY3Rpb25zWzZdPWZ1bmN0aW9uKHN0cmluZyxuYW1lLG51bWJlcil7cmV0dXJuIGRhdGFbbmFtZV1bbnVtYmVyXX07b2Zmc2V0RnVuY3Rpb25zWzddPWZ1bmN0aW9uKHN0cmluZyxvZmZzZXQsY29kZSl7aWYocmVnZXguZXNjYXBlZClzdHJpbmc9c3RyaW5nLnJlcGxhY2UocmVnZXguZXNjYXBlZCxvZmZzZXRGdW5jdGlvbnNbOF0pOw0KdmFyIG5ld1N0cmluZz1vZmZzZXRGdW5jdGlvbnNbMV0oc3RyaW5nKTtkYXRhLmNvZGVbZV09JzxzcGFuIGNsYXNzPSJyZWdleCI+JytuZXdTdHJpbmcrIjwvc3Bhbj4iO2U9ZSsxO3JldHVybiJ+e2NvZGUtIisoZS0xKSsifX4ifTtvZmZzZXRGdW5jdGlvbnNbOF09ZnVuY3Rpb24oc3RyaW5nKXt2YXIgbmV3U3RyaW5nPW9mZnNldEZ1bmN0aW9uc1sxXShzdHJpbmcpO2RhdGEuZXNjYXBlZFtlXT0nPHNwYW4gY2xhc3M9ImNvbnN0YW50Ij4nK25ld1N0cmluZysiPC9zcGFuPiI7ZT1lKzE7cmV0dXJuIn57ZXNjYXBlZC0iKyhlLTEpKyJ9fiJ9O29mZnNldEZ1bmN0aW9uc1s5XT1mdW5jdGlvbihzdHJpbmcsb2Zmc2V0LGNvZGUpe2lmKGJhZENoYXJzLmluZGV4T2YoY29kZS5jaGFyQXQob2Zmc2V0LTEpKT4tMSl7Y29uc29sZS5sb2coc3RyaW5nKTtyZXR1cm4gc3RyaW5nfWlmKHJlZ2V4LmVzY2FwZWQpc3RyaW5nPXN0cmluZy5yZXBsYWNlKHJlZ2V4LmVzY2FwZWQsb2Zmc2V0RnVuY3Rpb25zWzhdKTsNCnZhciBuZXdTdHJpbmc9b2Zmc2V0RnVuY3Rpb25zWzFdKHN0cmluZyk7ZGF0YS5jb2RlW2VdPSc8c3BhbiBjbGFzcz0icmVnZXgiPicrbmV3U3RyaW5nKyI8L3NwYW4+IjtlPWUrMTtyZXR1cm4ifntjb2RlLSIrKGUtMSkrIn1+In07aWYob3B0aW9ucyYmb3B0aW9ucy5hbGwuaW5kZXhPZigicGFyc2VkIik+LTEpe2NvZGU9Y29kZS5yZXBsYWNlKC8mYW1wOy9pZywiJiIpO2NvZGU9Y29kZS5yZXBsYWNlKC8mbHQ7L2lnLCI8Iik7Y29kZT1jb2RlLnJlcGxhY2UoLyZndDsvaWcsIj4iKX1jb2RlPWNvZGUucmVwbGFjZShyZWdleC5saW5rLG9mZnNldEZ1bmN0aW9uc1swXSk7aWYoY29kZS5tYXRjaChyZWdleC51cmwpKWNvZGU9Y29kZS5yZXBsYWNlKHJlZ2V4LnVybCxvZmZzZXRGdW5jdGlvbnNbMl0pO2ZvcihpPTA7aTx0eXBlcy5sZW5ndGg7aSsrKXt0eXBlPXR5cGVzW2ldO2lmKHR5cGU9PT0ic3RyaW5nIiYmY29kZS5tYXRjaChyZWdleC5yZWdleDEpKWNvZGU9Y29kZS5yZXBsYWNlKHJlZ2V4LnJlZ2V4MSwNCm9mZnNldEZ1bmN0aW9uc1s5XSk7aWYoY29kZS5tYXRjaChyZWdleFt0eXBlXSkpe2NvZGU9Y29kZS5yZXBsYWNlKHJlZ2V4W3R5cGVdLG9mZnNldEZ1bmN0aW9uc1szXSk7Zm9yKGF0dHIgaW4gZGF0YVt0eXBlXSlpZihkYXRhW3R5cGVdLmhhc093blByb3BlcnR5KGF0dHIpKXtpZih0eXBlLmluZGV4T2YoIkNvbW1lbnQiKT4tMSl2YXIgc3R5bGU9ImNvbW1lbnQiO2Vsc2UgdmFyIHN0eWxlPSJzdHJpbmciO2RhdGFbdHlwZV1bYXR0cl09JzxzcGFuIGNsYXNzPSInK3N0eWxlKyciPicrZGF0YVt0eXBlXVthdHRyXTtpZihkYXRhW3R5cGVdW2F0dHJdLm1hdGNoKHJlZ2V4Lm5ld2xpbmUpKWRhdGFbdHlwZV1bYXR0cl09ZGF0YVt0eXBlXVthdHRyXS5yZXBsYWNlKHJlZ2V4Lm5ld2xpbmUsb2Zmc2V0RnVuY3Rpb25zWzRdKTtkYXRhW3R5cGVdW2F0dHJdPWRhdGFbdHlwZV1bYXR0cl0rIjwvc3Bhbj4ifX1pZih0eXBlPT09InN0cmluZyImJmNvZGUubWF0Y2gocmVnZXgucmVnZXgyKSljb2RlPQ0KY29kZS5yZXBsYWNlKHJlZ2V4LnJlZ2V4MixvZmZzZXRGdW5jdGlvbnNbN10pfWZvcihpPTA7aTxyZWdleExpc3QubGVuZ3RoO2krKylpZihjb2RlLm1hdGNoKHJlZ2V4TGlzdFtpXS5yZWdleCkpY29kZT1jb2RlLnJlcGxhY2UocmVnZXhMaXN0W2ldLnJlZ2V4LG9mZnNldEZ1bmN0aW9uc1s1XSk7d2hpbGUoY29kZS5tYXRjaChyZWdleC50ZW1wb3JhcnkpKWNvZGU9Y29kZS5yZXBsYWNlKGludGVybmFsUmVnZXgudGVtcG9yYXJ5LG9mZnNldEZ1bmN0aW9uc1s2XSk7aWYoY29kZS5tYXRjaChyZWdleC5uZXdsaW5lKSl7Y29kZT1jb2RlLnNwbGl0KHJlZ2V4Lm5ld2xpbmUpO2NvZGU9Y29kZS5qb2luKCI8L3NwYW4+PC9saT48bGk+PHNwYW4+Iil9Y29kZT0iPGxpPjxzcGFuPiIrY29kZSsiPC9zcGFuPjwvbGk+IjtlbGVtZW50LmlubmVySFRNTD1zdGFydCtjb2RlK2VuZDtpZihvcHRpb25zJiYob3B0aW9uc1tzZWxlY3Rvcl0mJm9wdGlvbnNbc2VsZWN0b3JdLmluZGV4T2YoIm5vbGluZXMiKT4NCi0xfHxvcHRpb25zLmFsbC5pbmRleE9mKCJub2xpbmVzIik+LTEpKXtlbGVtZW50LmNoaWxkcmVuWzBdLnN0eWxlLm1hcmdpbkxlZnQ9IjVweCI7ZWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5saXN0U3R5bGVUeXBlPSJub25lIn1lbHNle2xpbmVzPShvcmlnaW5hbENvZGUuaW5kZXhPZigiXG4iKSE9PS0xP29yaWdpbmFsQ29kZS5zcGxpdCgiXG4iKTpvcmlnaW5hbENvZGUuc3BsaXQoIlxyIikpLmxlbmd0aDtpZihsaW5lcz4xMDApaWYobGluZXM+MUUzKWVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUubWFyZ2luTGVmdD0iNWVtIjtlbHNlIGVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUubWFyZ2luTGVmdD0iNGVtIn19O2hpZ2hsaWdodEphdmFzY3JpcHQuZ2V0S2V5d29yZHM9ZnVuY3Rpb24oc3RyKXtzdHI9c3RyLmpvaW4oIiAiKTtzdHI9c3RyLnJlcGxhY2UoL15ccyt8XHMrJC9nLCIiKS5yZXBsYWNlKC9ccysvZywifCIpO3JldHVybiJcXGIoPzoiK3N0cisiKSg/IX1+KT9cXGIifTsNCmhpZ2hsaWdodEphdmFzY3JpcHQuZm9ybWF0PWZ1bmN0aW9uKG9wdGlvbnMpe3ZhciBpLGNvZGVMaXN0LGZvcm1hdHRlZE9wdGlvbnM7aWYob3B0aW9ucyl7aWYob3B0aW9ucz09PSJub2xpbmVzIilmb3JtYXR0ZWRPcHRpb25zPXsiYWxsIjpbIm5vbGluZXMiXX07aWYob3B0aW9ucz09PSJwYXJzZWQiKWZvcm1hdHRlZE9wdGlvbnM9eyJhbGwiOlsicGFyc2VkIl19fWNvZGVMaXN0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoInByZSBjb2RlW2NsYXNzXSIpO2ZvcihpPTA7aTxjb2RlTGlzdC5sZW5ndGg7aSsrKWlmKGNvZGVMaXN0W2ldLnBhcmVudEVsZW1lbnQpe3ZhciBwYXJlbnROYW1lPWNvZGVMaXN0W2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2lmKHBhcmVudE5hbWUhPT0iY29kZSImJnBhcmVudE5hbWUhPT0icHJlIilpZihoaWdobGlnaHRKYXZhc2NyaXB0Lmxhbmd1YWdlW2NvZGVMaXN0W2ldLmNsYXNzTmFtZV0paGlnaGxpZ2h0SmF2YXNjcmlwdChjb2RlTGlzdFtpXSwNCmZvcm1hdHRlZE9wdGlvbnMsaGlnaGxpZ2h0SmF2YXNjcmlwdC5sYW5ndWFnZVtjb2RlTGlzdFtpXS5jbGFzc05hbWVdKTtlbHNlIGNvbnNvbGUuZXJyb3IoJ1RoZSBsYW5ndWFnZTogIicrY29kZUxpc3RbaV0uY2xhc3NOYW1lKyciLCBpcyBub3QgaW5jbHVkZWQhJyl9fTtoaWdobGlnaHRKYXZhc2NyaXB0Lmxhbmd1YWdlPXt9OyhmdW5jdGlvbihzaCl7dmFyIG5hdGl2ZVZhcj1bIl9fZGVmaW5lR2V0dGVyX18iLCJfX2RlZmluZVNldHRlcl9fIiwiX19sb29rdXBHZXR0ZXJfXyIsIl9fbG9va3VwU2V0dGVyX18iLCIkMSIsIiQyIiwiJDMiLCIkNCIsIiQ1IiwiJDYiLCIkNyIsIiQ4IiwiJDkiLCIkXyIsIiRpbnB1dCIsIkFycmF5IiwiQm9vbGVhbiIsIkNoYXJ0b1VURjgiLCJEYXRlIiwiRSIsIkZ1bmN0aW9uIiwiSlNPTiIsIkxOMTAiLCJMTjIiLCJMT0cxMEUiLCJMT0cyRSIsIk1hdGgiLCJOdW1iZXIiLCJPYmplY3QiLCJQSSIsIlJlZ0V4cCIsIlNRUlQxXzIiLCJTUVJUMiIsIlN0cmluZyIsDQoiVVRDIiwiYWJzIiwiYWNvcyIsImFuY2hvciIsImFwcGx5IiwiYXNpbiIsImF0YW4iLCJhdGFuMiIsImJpZyIsImJpbmQiLCJibGluayIsImJvbGQiLCJjYWxsIiwiY2VpbCIsImNoYXJBdCIsImNoYXJDb2RlQXQiLCJjb25jYXQiLCJjb3MiLCJjcmVhdGUiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJkb2N1bWVudCIsImV2ZXJ5IiwiZXhwIiwiZmlsdGVyIiwiZml4ZWQiLCJmbG9vciIsImZvbnRjb2xvciIsImZvbnRzaXplIiwiZm9yRWFjaCIsImZyZWV6ZSIsImdldERhdGUiLCJnZXREYXkiLCJnZXRGdWxsWWVhciIsImdldEhvdXJzIiwiZ2V0TWlsbGlzZWNvbmRzIiwiZ2V0TWludXRlcyIsImdldE1vbnRoIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImdldFByb3RvdHlwZU9mIiwiZ2V0U2Vjb25kcyIsImdldFRpbWUiLCJnZXRUaW1lem9uZU9mZnNldCIsImdldFVUQ0RhdGUiLCJnZXRVVENEYXkiLCJnZXRVVENGdWxsWWVhciIsDQoiZ2V0VVRDSG91cnMiLCJnZXRVVENNaWxsaXNlY29uZHMiLCJnZXRVVENNaW51dGVzIiwiZ2V0VVRDTW9udGgiLCJnZXRVVENTZWNvbmRzIiwiZ2V0WWVhciIsImhhc093blByb3BlcnR5IiwiaW5kZXhPZiIsImlzRXh0ZW5zaWJsZSIsImlzRnJvemVuIiwiaXNQcm90b3R5cGVPZiIsImlzU2VhbGVkIiwiaXRhbGljcyIsImpvaW4iLCJsYXN0SW5kZXhPZiIsImxpbmsiLCJsb2NhbGVDb21wYXJlIiwibG9nIiwibWFwIiwibWF0Y2giLCJtYXgiLCJtaW4iLCJub3ciLCJwYXJzZSIsInBvcCIsInBvdyIsInByZXZlbnRFeHRlbnNpb25zIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJwdXNoIiwicmFuZG9tIiwicmVkdWNlIiwicmVkdWNlUmlnaHQiLCJyZXBsYWNlIiwicmV2ZXJzZSIsInJvdW5kIiwic2VhbCIsInNlYXJjaCIsInNldERhdGUiLCJzZXRGdWxsWWVhciIsInNldEhvdXJzIiwic2V0TWlsbGlzZWNvbmRzIiwic2V0TWludXRlcyIsInNldE1vbnRoIiwic2V0U2Vjb25kcyIsInNldFRpbWUiLA0KInNldFVUQ0RhdGUiLCJzZXRVVENGdWxsWWVhciIsInNldFVUQ0hvdXJzIiwic2V0VVRDTWlsbGlzZWNvbmRzIiwic2V0VVRDTWludXRlcyIsInNldFVUQ01vbnRoIiwic2V0VVRDU2Vjb25kcyIsInNldFllYXIiLCJzaGlmdCIsInNpbiIsInNsaWNlIiwic21hbGwiLCJzb21lIiwic29ydCIsInNwbGljZSIsInNwbGl0Iiwic3FydCIsInN0cmlrZSIsInN0cmluZ2lmeSIsInN1YiIsInN1YnN0ciIsInN1YnN0cmluZyIsInN1cCIsInRhbiIsInRvRGF0ZVN0cmluZyIsInRvRXhwb25lbnRpYWwiLCJ0b0ZpeGVkIiwidG9HTVREYXRlU3RyaW5nIiwidG9JU09EYXRlU3RyaW5nIiwidG9KU09OIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJ0b0xvY2FsZVN0cmluZyIsInRvTG9jYWxlVGltZVN0cmluZyIsInRvTG9jYWxlVXBwZXJDYXNlIiwidG9Mb3dlckNhc2UiLCJ0b1ByZWNpc2lvbiIsInRvU3RyaW5nIiwidG9UaW1lU3RyaW5nIiwidG9VVENTdHJpbmciLA0KInRvVXBwZXJDYXNlIiwidHJpbSIsInRyaW1MZWZ0IiwidHJpbVJpZ2h0IiwidW5zaGlmdCIsInZhbHVlT2YiLCJ3aW5kb3ciXTt2YXIgcmVzZXJ2ZWQ9WyJmdW5jdGlvbiIsInZhciIsImxldCIsImNvbnN0Iiwidm9pZCIsIm5hdGl2ZSJdO3ZhciBjb25zdHJ1Y3RzPVsiaWYiLCJmb3IiLCJ3aGlsZSIsIndpdGgiLCJlbHNlIiwicmV0dXJuIiwiYnJlYWsiLCJuZXciLCJpbiIsInN3aXRjaCIsInRyeSIsImNhdGNoIiwiY2FzZSJdO3ZhciBsYW5nPVsiTmFOIiwidHJ1ZSIsImZhbHNlIiwidW5kZWZpbmVkIiwibnVsbCJdO3ZhciBjb25zdGFudD1bImFyZ3VtZW50cyIsImNhbGxlciIsImNvbnN0cnVjdG9yIiwia2V5cyIsInByb3RvdHlwZSIsIk1BWF9WQUxVRSIsIk1JTl9WQUxVRSIsIk5FR0FUSVZFX0lORklOSVRZIiwiUE9TSVRJVkVfSU5GSU5JVFkiLCJtdWx0aWxpbmUiLCJsYXN0TWF0Y2giLCJsYXN0UGFyZW4iLCJsZWZ0Q29udGV4dCIsImxlbmd0aCIsIm5hbWUiLCJyaWdodENvbnRleHQiLA0KImlucHV0Il07dmFyIHJlZ2V4PXsic2luZ2xlQ29tbWVudCI6L1wvXC8uKz8oPz1cbnxccnwkKS9pZywibXVsdGlDb21tZW50IjovXC9cKltcc1xTXSs/XCpcLy9nLCJzdHJpbmciOi8oPzonW14nXFxdKig/OlxcLlteJ1xcXSopKicpfCg/OiJbXiJcXF0qKD86XFwuW14iXFxdKikqIikvZywibnVtYmVyIjovXGJbKy1dPyg/Oig/OjB4W0EtRmEtZjAtOV0rKXwoPzooPzpbXGRdKlwuKT9bXGRdKyg/OltlRV1bKy1dP1tcZF0rKT8pKXU/KD86KD86aW50KD86OHwxNnwzMnw2NCkpfEwpP1xiKD8hXH1cfikvZywibWF0aCI6LyhcfHxcK3xcPXxcLXxcL3xcPnxcPHxcIXxcP3xcJnxcJXxcJCkoPyFbMC05XSp9fikvZywiYnJhY2tldCI6L1x7fFx9fFwofFwpfFxbfFxdL2csInRhZyI6L1w8KD86XCF8XC8pP1thLXpdW2EtejAtMVwtXVxzKig/OltePl0rKT9cPi9pZywiZnVuY3Rpb24iOi9cYig/IWZ1bmN0aW9ufGlmfGVsc2V8Zm9yfHdoaWxlfHdpdGh8dHJ5KSg/OltBLVphLXpdfF8pW0EtWmEtejAtOV9dKig/PVsgXHRdKlwoKS9nLA0KImVzY2FwZWQiOi9cXCg/OjBbMC0zXVswLTddWzAtN118WzAtM11bMC03XVswLTddfFswLTddWzAtN118WzAtOV18LikvZ307dmFyIHJlZ2V4TGlzdD1be3JlZ2V4Om5ldyBSZWdFeHAoc2guZ2V0S2V5d29yZHMobmF0aXZlVmFyKSwiZ20iKSxjc3M6Im5hdGl2ZSJ9LHtyZWdleDpuZXcgUmVnRXhwKHNoLmdldEtleXdvcmRzKHJlc2VydmVkKSwiZ20iKSxjc3M6InJlc2VydmVkIn0se3JlZ2V4Om5ldyBSZWdFeHAoc2guZ2V0S2V5d29yZHMoY29uc3RydWN0cyksImdtIiksY3NzOiJjb25zdHJ1Y3RzIn0se3JlZ2V4Om5ldyBSZWdFeHAoc2guZ2V0S2V5d29yZHMobGFuZyksImdtIiksY3NzOiJsYW5ndWFnZSJ9LHtyZWdleDpuZXcgUmVnRXhwKHNoLmdldEtleXdvcmRzKGNvbnN0YW50KSwiZ20iKSxjc3M6ImNvbnN0YW50In0se3JlZ2V4OnJlZ2V4LnRhZyxjc3M6ImNvbnN0cnVjdHMifSx7cmVnZXg6cmVnZXgubnVtYmVyLGNzczoibnVtYmVyIn0se3JlZ2V4OnJlZ2V4Lm1hdGgsY3NzOiJjb25zdHJ1Y3RzIn0sDQp7cmVnZXg6cmVnZXhbImZ1bmN0aW9uIl0sY3NzOiJmdW5jdGlvbiJ9XTtzaC5sYW5ndWFnZT1zaC5sYW5ndWFnZXx8e307c2gubGFuZ3VhZ2VbImpzIl09e3JlZ2V4OnJlZ2V4LHJlZ2V4TGlzdDpyZWdleExpc3R9fSkoaGlnaGxpZ2h0SmF2YXNjcmlwdCk7d2luZG93LmhpZ2hsaWdodEphdmFzY3JpcHQ9aGlnaGxpZ2h0SmF2YXNjcmlwdH0pKHdpbmRvdyk7";