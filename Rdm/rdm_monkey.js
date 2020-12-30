// ==UserScript==
// @name              rdm助手
// @namespace         https://github.com/HermiteZhang
// @version           0.1
// @icon              http://rdm.landray.com.cn/favicon.ico?1391847577
// @description      RDM
// @license           AGPL
// @match             *://rdm.landray.com.cn/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.10.0/dist/sweetalert2.all.min.js
// @require           https://cdn.jsdelivr.net/gh/HermiteZhang/violentmonkey-hermite@v0.1/Rdm/rdmPlugn.css
// @require           https://cdn.jsdelivr.net/gh/HermiteZhang/violentmonkey-hermite@v0.1/Rdm/RdmData.js
// @require           https://cdn.jsdelivr.net/gh/HermiteZhang/violentmonkey-hermite@v0.1/Rdm/RdmPlugin.js
// @connect           *
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_xmlhttpRequest
// @grant             GM_download
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// ==/UserScript==
(() => {
    $(() => {
        let plugin = new RdmPlugin();
        plugin.init();
    });
})();