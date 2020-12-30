function RdmPlugin_Panel(plugin) {
    if (plugin.bodyType == __RDMBODY_ISSUES) {
        return RdmPlugin_Panel_list(plugin)
    } else if (plugin.bodyType == __RDMBODY_PROJECT) {
        return RdmPlugin_Panel_project(plugin)
    }

}
function RdmPlugin_Panel_project(plugin) {


}

function RdmPlugin_Panel_list(plugin) {
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
            total: function () {
                let $td = $("<td/>")
                return $td;
            },
            fun: function (key) {
                let $td = $("<td class='title' width='100px;'/>")
                let name = __ISSUES_TYPE[key]["name"];
                $td.html(name);
                return $td;
            }
        },
        {
            title: "数量",
            total: function () {
                let $td = $("<td/>")
                $td.html("总计:" + plugin.rdmIns.issuesList.length);
                return $td;
            },
            fun: function (key) {
                let $td = $("<td class='number'/>");
                let newList = plugin.rdmIns.issuesList.filter(item => item[key]);
                let num = parseFloat(newList.length);
                let total = parseFloat(plugin.rdmIns.issuesList.length);
                let count = total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
                $td.html(newList.length + "[" + count + "]");
                return $td;
            }
        },
        {
            title: "展示",
            name: "filter-display",
            total: function () {
                let $td = $("<td/>");
                $("<input type='button' />")
                $td.html("全部隐藏:" + plugin.rdmIns.issuesList.length);
                return $td;
            },
            fun: function (key) {
                let $td = $("<td class='dispaly'/>");
                let $inp = $("<label><input name='filter-display' type='checkbox' value='" + key + "'/> 隐藏 </label>");
                $td.append($inp);
                return $td;
            },
            eventFun: function (t) {
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

        let $FT = $("<table id='rdmPluginPanel-FilterTab'></table>");
        let $th = $("<tr class='FilterTab-head' />");
        //表头
        for (let i = 0; i < FilterTabCfg.length; i++) {
            $("<th>" + FilterTabCfg[i].title + "</th>").appendTo($th)
        }
        $FT.append($th);
        //表内容
        for (let key in __ISSUES_TYPE) {
            let $tr = $("<tr class='rdmPluginPanel-item' />");
            for (let i = 0; i < FilterTabCfg.length; i++) {
                let $td = FilterTabCfg[i].fun(key);
                $tr.append($td);
            }

            $FT.append($tr);
        }
        //表脚&绑定事件
        let $tb = $("<tr class='rdmPluginPanel-item' />");
        for (let i = 0; i < FilterTabCfg.length; i++) {
            if (FilterTabCfg[i].eventFun) {
                $FT.find("[name='" + FilterTabCfg[i].name + "']").on("click", function () {
                    FilterTabCfg[i].eventFun(this)
                })
            }
            if (FilterTabCfg[i].total) {
                let $td = FilterTabCfg[i].total();
                $tb.append($td);
            }
        }
        $FT.append($tb);


        $panel.append($FT);
    }

}