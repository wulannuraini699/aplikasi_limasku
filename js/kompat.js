/*
 * kompat.js — pengganti (polyfill) fitur yang belum ada di browser HP lama
 * (mis. Android dengan Chrome/WebView lama, iPhone iOS 12–14). Ditulis ES5 dan dimuat paling awal.
 */
(function () {
  'use strict';
  var EP = typeof Element !== 'undefined' ? Element.prototype : null;

  function keNode(a) {
    return (a !== null && typeof a === 'object' && a.nodeType) ? a : document.createTextNode(String(a));
  }
  if (EP && !EP.replaceChildren) {
    EP.replaceChildren = function () {
      while (this.firstChild) this.removeChild(this.firstChild);
      for (var i = 0; i < arguments.length; i++) this.appendChild(keNode(arguments[i]));
    };
  }
  if (EP && !EP.remove) {
    EP.remove = function () { if (this.parentNode) this.parentNode.removeChild(this); };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (n, isi) {
      var s = String(this); isi = isi === undefined ? ' ' : String(isi);
      while (s.length < n) s = isi + s;
      return s.slice(-n);
    };
  }
  if (!Object.is) {
    Object.is = function (a, b) { return a === b ? (a !== 0 || 1 / a === 1 / b) : (a !== a && b !== b); };
  }
  if (!Math.hypot) {
    Math.hypot = function (x, y) { return Math.sqrt(x * x + y * y); };
  }
  if (!Object.assign) {
    Object.assign = function (t) {
      for (var i = 1; i < arguments.length; i++) {
        var s = arguments[i];
        if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k];
      }
      return t;
    };
  }
})();
