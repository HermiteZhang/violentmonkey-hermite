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

        } else if (this.bodyType == __RDMBODY_PROJECT) {
            let rdmIns = new RdmPlugin_Project();
            rdmIns.init(this);
            this.rdmIns = rdmIns;
        }


        console.log("this", this);

    };

}

function RdmPlugin_issues() {
    this.init = (parent) => {
        this.parent = parent;
        this.issuesList = getIssuesList(parent.$issTabBody);
        parent.panel = new RdmPlugin_Panel(this)
    };
}

function RdmPlugin_Project() {
    this.init = (parent) => {
        this.parent = parent;
        let localUrl = window.location.href;
        let n = localUrl.lastIndexOf("/") + 1;
        this.rdmNo = localUrl.substring(n, localUrl.length);

        parent.panel = new RdmPlugin_Panel(this);


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