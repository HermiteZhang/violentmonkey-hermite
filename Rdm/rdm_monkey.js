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
var RDM_COLUMS = {};
$("#available_columns").find("option").each(function (idx, op) {
    RDM_COLUMS[$(op).val()] = {
        idx: idx,
        $e: $(op),
        text: $(op).text(),
        value: $(op).val(),
        type: "available"
    }
});
$("#selected_columns").find("option").each(function (idx, op) {
    RDM_COLUMS[$(op).val()] = {
        idx: idx,
        $e: $(op),
        text: $(op).text(),
        value: $(op).val(),
        type: "selected"
    }
})
//-------------------- 常量参数分割线
const __RdmEles = {
    "#wrapper": {},
    "#top-menu": {
        "name": "$topMenu"
    },
    "#header": {},
    "#main": {},
    "#sidebar": {},
    "#content": {},
    "#query_form": {
        "name": "$queryForm"
    },
    "$issDiv": {
        "name": "$issDiv",
        "cls": "form .autoscroll"
    },
    "$issTab": {
        "name": "$issuesDiv",
        "cls": "form .autoscroll table.issues"
    },
    "$issTabHead": {
        "name": "$issTabHead",
        "cls": "form .autoscroll table.issues thead"
    },
    "$issTabBody": {
        "name": "$issTabBody",
        "cls": "form .autoscroll table.issues tbody"
    }

};
const __RDMBODY_ISSUES = "issues";
const __RdmBodyType = {
    "issues": {
        cls: "controller-issues,action-index",
    },
    "my": {
        cls: "controller-my,action-page",
    },
    "project": {
        cls: "controller-issues,action-show",
    },
};
const __ISSUES_TYPE = {
    "service": {
        keyWord: "【服务问题单】",
        name: "服务问题单",
        desc: "服务问题单"
    },
    "daily": {
        keyWord: "【日常缺陷】",
        name: "缺陷-日常",
        desc: "日常缺陷"
    },
    "regress": {
        keyWord: "回归",
        name: "缺陷-回归",
        desc: "回归缺陷"
    },
    "defect": {
        keyCol: "cf_5",
        keyWord: "缺陷",
        name: "所有缺陷",
        desc: "缺陷-分类"
    },
    "demand": {
        keyCol: "cf_5",
        keyWord: "需求",
        name: "需求",
        desc: "需求-分类"
    }

}

//-------------------- 方法处理 分割线
/**
 * 预定义element 参数化
 * @param t
 * @param rdmEles
 */
function initElement(t, rdmEles) {
    for (let key in rdmEles) {
        let cls = rdmEles[key].cls || key;
        let name = rdmEles[key].name || "$" + cls.replace("#", "");
        t[name] = fE(cls);
    }
}


/**
 * jQuery.hasClass() 增强版，增加多类判断
 * @param $c
 * @param cls
 * @returns {boolean|*}
 */
function hasClass($c, cls) {
    if (cls.indexOf(",")) {
        let clist = cls.split(",");
        for (let ci of clist) {
            if (!$c.hasClass(ci)) {
                return false;
            }
        }
        return true;
    }
    return $c.hasClass(cls);
}


/**
 * jQuery.find()，加空判断
 * @param key
 * @param $c
 * @returns {jQuery|HTMLElement|number | never | bigint | undefined}
 */
function fE(key, $c) {
    if ($c) {
        return $c.find(key);
    } else {
        return $(key);
    }
}

/**
 * 预定义element 参数化
 * @param t
 * @param rdmEles
 */
function getIssuesList($issTabBody) {
    let issuesList = [];
    $issTabBody.find("tr").each(function (idx, tr) {
        issuesList.push(new issuesTr($(tr)))
        // let issues = new issuesTr($(tr));
        // if (issues.rdmNo) {
        //     issuesList[issues.rdmNo] = issues;
        // }

    });
    return issuesList;
}

//-------------------- 对象实例分割线

function RdmPlugin() {
    this.init = () => {
        console.log("hello rdm world .by Hermite Zhang");
        this.bodyType = "";
        for (let key in __RdmBodyType) {
            if (hasClass($("body"), __RdmBodyType[key].cls)) {
                this.bodyType = key;
            }
        }
        initElement(this, __RdmEles);

        if (this.bodyType == __RDMBODY_ISSUES) {
            let rdmIns = new RdmPlugin_issues();
            rdmIns.init(this);
            this.rdmIns = rdmIns;
        }
        this.panel = new RdmPlugin_Panel(this)
        console.log("this", this);

    };

}

function RdmPlugin_Panel(plugin) {
    let $qf = plugin.$queryForm;
    let $pb = $qf.find("p.buttons");
    let $panel = $("<div id='rdmPluginPanel' />");
    buildFilterTab($panel, plugin);
    $panel.append($pb);
    $qf.append($panel);

    /**
     * 筛选面板
     * @param $panel
     */
    function buildFilterTab($panel, plugin) {
        let cssSet = {
            "default": {
                "name": "==默认=="
            },
            "service": {
                "name": "服务问题单"
            },
            "warn": {
                "name": "警告"
            }
        }
        let FilterTabCfg = [
            {
                title: "类型",
                fun: function (key) {
                    let $td = $("<td class='title' width='100px;'/>")
                    let name = __ISSUES_TYPE[key]["name"];
                    $td.html(name);
                    return $td;
                }
            },
            {
                title: "数量",
                fun: function (key) {
                    let $td = $("<td class='number'/>");
                    let newList = plugin.rdmIns.issuesList.filter(item => item[key]);
                    let num = parseFloat(newList.length);
                    let total = parseFloat(plugin.rdmIns.issuesList.length);
                    let count= total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
                    $td.html(newList.length + "[" + count + "]");
                    return $td;
                }
            },
            {
                title: "展示",
                name: "filter-display",
                fun: function (key) {
                    let $td = $("<td class='dispaly'/>");
                    let $inp = $("<label><input name='filter-display' type='checkbox' value='" + key + "'/> 隐藏 </label>");
                    $td.append($inp);
                    return $td;
                }, eventFun: function (t) {
                    let key = $(t).val();
                    plugin.rdmIns.issuesList.forEach(item => {
                        if (item[key]) {
                            if ($(t).is(':checked')) {
                                item.$ele.hide();
                            } else {
                                item.$ele.show();
                            }
                        }
                    });

                }
            },
            {
                title: "标记",
                name: "filter-style",
                fun: function (key) {
                    let $td = $("<td class='style'/>");
                    let $sel = $("<select name='filter-style' mark-key='" + key + "'/>");
                    for (let cssKey in cssSet) {
                        $("<option value='" + cssKey + "' >" + cssSet[cssKey].name + "</option>").appendTo($sel)
                    }
                    $td.append($sel);
                    return $td;
                }, eventFun: function (t) {
                    let key = $(t).attr("mark-key");
                    let cssSet = $(t).find("option:selected").val();

                    plugin.rdmIns.issuesList.forEach(item => {
                        if (item[key]) {
                            console.log(key, cssSet, item.$ele);
                            item.$ele.attr("plugin_tr_css", cssSet)
                        }
                    });
                }
            }
        ];
        let $FT = $("<table id='rdmPluginPanel-FilterTab'></table>");
        let $th = $("<tr class='FilterTab-head' />");

        for (let i = 0; i < FilterTabCfg.length; i++) {
            $("<th>" + FilterTabCfg[i].title + "</th>").appendTo($th)
        }
        $FT.append($th);
        for (let key in __ISSUES_TYPE) {
            let $tr = $("<tr class='rdmPluginPanel-item' />");
            for (let i = 0; i < FilterTabCfg.length; i++) {
                let $td = FilterTabCfg[i].fun(key);
                $tr.append($td);
            }

            $FT.append($tr);
        }
        for (let i = 0; i < FilterTabCfg.length; i++) {
            if (FilterTabCfg[i].eventFun) {
                $FT.find("[name='" + FilterTabCfg[i].name + "']").on("click", function () {
                    FilterTabCfg[i].eventFun(this)
                })
            }
        }


        $panel.append($FT);
    }

}

function RdmPlugin_issues() {
    this.init = (parent) => {
        this.parent = parent;
        this.issuesList = getIssuesList(parent.$issTabBody);
    };
}

function issuesTr($tr) {
    this.$ele = $tr;
    this.rdmNo = $tr.attr("id").replace("issue-", "");
    let self = this;
    $tr.find("td").each(function (tdIdx, td) {
        let $td = $(td);
        //key
        let key = $td.attr("class");
        key = key.replace(" hide-when-print", "").replace(" list", "")
        self[key] = {}
        self[key].$ele = $td;

        //name
        let name = RDM_COLUMS[key] || key;
        self[key].name = name.text || key;

        //value
        let value = $td.html();
        if ($td.find("input").length > 0) {
            self[key].$inp = $td.find("input");
            value = $td.find("input").val();
        }
        if ($td.find("a").length > 0) {
            self[key].$a = $(td).find("a");
            self[key].$a.attr("target", "_blank");
            value = $td.find("a").text();
        }
        self[key].value = value;
    });

    //属性添加
    for (let key in __ISSUES_TYPE) {
        let keyCol = __ISSUES_TYPE[key]["keyCol"] || "subject";
        let keyWord = __ISSUES_TYPE[key]["keyWord"];
        if (this[keyCol]) {
            let colVal = this[keyCol].value;
            if (colVal.indexOf(keyWord) > -1) {
                this[key] = true;
            }
        }
    }

}

(() => {
    //规避油猴规则
    function loadStyle(){
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = "https://cdn.jsdelivr.net/gh/HermiteZhang/violentmonkey-hermite@v0.1/Rdm/rdmPlugn.css";
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    loadStyle();

    $(() => {
        let plugin = new RdmPlugin();
        plugin.init();
    });
})();