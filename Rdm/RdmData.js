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
    },
    //--------------------project
    "$subject": {
        "name": "$subject",
        "cls": ".issue .subject h3"
    }

};
const __RDMBODY_ISSUES = "issues";
const __RDMBODY_PROJECT = "project";
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
