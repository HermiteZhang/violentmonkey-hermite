function RdmPlugin_Panel(plugin) {
    if (plugin.parent.bodyType == __RDMBODY_ISSUES) {
        return RdmPlugin_Panel_list(plugin)
    } else if (plugin.parent.bodyType == __RDMBODY_PROJECT) {
        return RdmPlugin_Panel_project(plugin)
    }

}

function RdmPlugin_Panel_project(plugin) {
    this.rdmNo = plugin.rdmNo;
    this.imagePanel = new Rdm_ImagePanel();
    this.imagePanel.appendTo($("body"));

    
    copySubjectToVersion(plugin);
    dealATag(this);


    function copySubjectToVersion(plugin) {
        let $btn = $("<button type='button'>复制主题</button>")
        let $inp = $("<input type='hidden' name='copySubjectToVersion' />");
        let subject = plugin.parent.$subject.text();
        n = subject.lastIndexOf("】") + 1;
        subject = subject.substring(n, subject.length)
        let lui_subject = "#" + plugin.rdmNo + " 修复  " + subject + " by 张威";
        $btn.on("click", function () {
            let $input = $("<input style='position: absolute;' />")//创建input对象
            $(this).after($input);//添加元素
            $input.val(lui_subject);
            $input.focus();
            if ($input.setSelectionRange)
                $input.setSelectionRange(0, $input.value.length);//获取光标起始位置到结束位置
            else
                $input.select();
            try {
                document.execCommand("copy");//执行复制
                $btn.text("复制成功 " + new Date())
            } catch (eo) {
                $btn.text("复制失败 " + new Date())
            }
            $input.remove();
        })

        plugin.parent.$subject.after($btn)
        plugin.parent.$subject.after($inp)
    }

    function dealATag(t) {
        plugin.parent.$content.find("a").each(function () {
            let href = $(this).attr("href");
            if (href && (href.indexOf(".png") > 0||href.indexOf(".jpg") > 0)) {
                $(this).attr("onclick", "return false");
                $(this).on("click",function () {
                    t.imagePanel.show(href)
                });

            } else {
                $(this).attr("target", "_blank");
            }

        });
    }

}

function Rdm_ImagePanel() {
    let $ele = $("<div id='rdmImagePanel' />")
    $ele.css({"width": window.innerWidth + "px","height": window.innerHeight + "px"})
    this.$ele = $ele;
    $ele.on("click",function () {
        $ele.hide();
    })
    this.show = function (src) {
        if (src){
            this.$ele.empty();
            let image = $("<img id='rdmImagePanel_image' />")
            image.attr("src",src);
            this.$ele.append(image);
        }
        this.$ele.show()
    }
    this.appendTo = function ($c) {
        this.$ele.appendTo($c)
    }
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
                $td.html("总计:" + plugin.issuesList.length);
                return $td;
            },
            fun: function (key) {
                let $td = $("<td class='number'/>");
                let newList = plugin.issuesList.filter(item => item[key]);
                let num = parseFloat(newList.length);
                let total = parseFloat(plugin.issuesList.length);
                let count = total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
                $td.html(newList.length + "[" + count + "]");
                return $td;
            }
        },
        {
            title: "展示",
            name: "filter-display",
            total: function () {
                let $td = $("<td colspan='2'/>");
                let $btn = $("<button type='button' >全部显示</button>");
                $btn.on("click", function () {
                    plugin.issuesList.forEach(item => item.$ele.show());
                    $("[name='filter-display2']").prop("checked", false);
                    $("[name='filter-display']").prop("checked", false);
                })
                $td.html($btn);
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
                plugin.issuesList.forEach(item => {
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
            title: "展示2",
            name: "filter-display2",
            fun: function (key) {
                let $td = $("<td class='dispaly'/>");
                let $inp = $("<label><input name='filter-display2' type='radio' value='" + key + "'/> 只显示 </label>");
                $td.append($inp);
                return $td;
            },
            eventFun: function (t) {
                let key = $(t).val();
                plugin.issuesList.forEach(item => {
                    item.$ele.hide();
                    if (item[key]) {
                        if ($(t).is(':checked')) {
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

                plugin.issuesList.forEach(item => {
                    if (item[key]) {
                        console.log(key, cssSet, item.$ele);
                        item.$ele.attr("plugin_tr_css", cssSet)
                    }
                });
            }
        }
    ];


    let $qf = plugin.parent.$queryForm;
    let $pb = $qf.find("p.buttons");
    let $panel = $("<div id='rdmPluginPanel' />");
    buildFilterTab($panel);
    $panel.append($pb);
    $qf.append($panel);

    /**
     * 筛选面板
     * @param $panel
     */
    function buildFilterTab($panel) {

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