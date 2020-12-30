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