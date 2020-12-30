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
    "use strict";
    // css
    const rdmCss = {
        issuesType_4: {
            "background-color": "#ffaacc"
        }
    };
    //const
    const localUrl = window.location.href;
    const version = GM_info.script.version;
    const issuesType = {
        "1": "全部",
        "2": "缺陷",
        "3": "需求",
        "4": "服务问题单"
    }
    let doms;
    let issuesCount = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0

    }

    //plugin
    function RdmPlugin() {
        this.init = () => {
            console.log("hello rdm world .by Hermite Zhange");
            main();
            letAOpenInBlank();
            serviceWarning();
            copySubjectToVersion();
        };
        function main() {
            doms = {
                $issusTabel: $("table.issues"),
                $issusLine: $("table.issues tbody").find("tr"),
                $bp: $("p.buttons")
            };
            //init number
            issuesCount = { "1": 0, "2": 0, "3": 0, "4": 0 }
            issuesCount["1"] = doms.$issusLine.length;
            doms.$issusLine.each(function () {
                let subject = $(this).find("td.subject").text();
                if (subject.indexOf("服务问题单") > -1) {
                    $(this).show();
                    issuesCount["4"]++
                }
                let cf_5 = $(this).find("td.cf_5").text();
                if (cf_5.indexOf("缺陷") > -1) {
                    issuesCount["2"]++
                } else if (cf_5.indexOf("需求") > -1) {
                    issuesCount["3"]++
                }
            })

            drawPanel();
        }
        //面板绘制-列表
        function drawPanel() {
            let $p = $("<div id='ex_rdm_btn' style='margin-bottom:20px;'></div>");
            let $type = $("<select name='ex_rdm_type_select'>");
            for (let key in issuesType) {
                $("<option value='" + key + "'>" + issuesType[key] + "【" + issuesCount[key] + "】" + "</option>").appendTo($type);
            }

            $type.on("change", function () {
                let value = $(this).val();
                doms.$issusLine.each(function () {
                    $(this).show();
                    if (value != 1) {
                        $(this).hide();
                    }
                    if (value == 4) {
                        let subject = $(this)
                            .find("td.subject")
                            .text();
                        if (subject.indexOf("服务问题单") > -1) {
                            $(this).show();
                        }
                    } else if (value == 2 || value == 3) {
                        let cf_5 = $(this)
                            .find("td.cf_5")
                            .text();
                        let matchText = value == 2 ? "缺陷" : "需求";
                        if (cf_5.indexOf(matchText) > -1) {
                            $(this).show();
                        }
                    }
                });
            });

            $p.append($type);


            doms.$bp.after($p);
            doms.$panel = $p;
        }
        //打开链接，从空白处
        function letAOpenInBlank() {
            $("a").each(function () {
                if (!$(this).hasClass("sort") || !$(this).parent().is("th")) {
                    $(this).attr("target", "_blank");
                }
            });
        }
        //服务单标注
        function serviceWarning() {
            doms.$issusLine.each(function () {
                let subject = $(this)
                    .find("td.subject")
                    .text();
                if (subject.indexOf("服务问题单") > -1) {
                    $(this).css(rdmCss.issuesType_4);
                }
            });
        }
        //复制单号-用以填version
        function copySubjectToVersion() {
            let $btn = $("<button>复制主题</button>")
            let $inp = $("<input type='hidden' name='copySubjectToVersion' />")
            let $c = $("#content");
            if ($c) {
                let $subject = $c.find(".subject").find("h3");
                let n = localUrl.lastIndexOf("/") + 1;
                let rdmNo = localUrl.substring(n, localUrl.length)
                let subject = $subject.text();
                n = subject.lastIndexOf("】") + 1;
                subject = subject.substring(n, subject.length)

                let lui_subject = "#" + rdmNo + " 修复  " + subject + " by 张威";


                $btn.on("click", function () {
                    let $inp = $("<input style='position: absolute;' />")//创建input对象
                    var currentFocus = document.activeElement;//当前获得焦点的元素
                    $(this).after( $inp);//添加元素
                    $inp.val(lui_subject);
                    $inp.focus();
                    if ( $inp.setSelectionRange)
                        $inp.setSelectionRange(0,  $inp.value.length);//获取光标起始位置到结束位置
                    else
                        $inp.select();
                    try {
                        var flag = document.execCommand("copy");//执行复制
                        $btn.text("复制成功 " + new Date())
                    } catch (eo) {
                        var flag = false;
                        $btn.text("复制失败 " + new Date())
                    }
                    $inp.remove();
                })

                $subject.after($btn)
                $subject.after($inp)
            }
        }
    }

    //-------------do it
    $(() => {
        let plugin = new RdmPlugin();
        plugin.init();
    });
})();
