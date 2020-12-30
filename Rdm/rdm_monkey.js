// ==UserScript==
// @name              rdm助手
// @namespace         https://github.com/HermiteZhang
// @version           0.2
// @supportURL        https://github.com/HermiteZhang/violentmonkey-hermite
// @icon              http://rdm.landray.com.cn/favicon.ico?1391847577
// @description       RDM
// @license           AGPL
// @match             *://rdm.landray.com.cn/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.10.0/dist/sweetalert2.all.min.js
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
    let requireList =[
        {
            link:"https://cdn.jsdelivr.net/gh/HermiteZhang/violentmonkey-hermite@v0.1/Rdm/rdmPlugn.css",
        },
        {
            src:"https://cdn.jsdelivr.net/gh/HermiteZhang/violentmonkey-hermite@v0.1/Rdm/RdmData.js",
        },
        {
            src:"https://cdn.jsdelivr.net/gh/HermiteZhang/violentmonkey-hermite@v0.1/Rdm/RdmPlugin.js",
        }
    ];
    for (let i = 0; i < requireList.length; i++) {
        let item = requireList[i];
        if (item.link){
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = item.link;
            document.getElementsByTagName('head')[0].appendChild(link);
        }else if (item.src){
            let script=document.createElement("script");
            script.type="text/javascript";
            script.src=item.src;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
    setTimeout(function(){
        $(document).ready(function(){
            let plugin = new RdmPlugin();
            plugin.init();
        });
    },1000);

})();


