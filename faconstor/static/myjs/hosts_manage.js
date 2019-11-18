$(document).ready(function () {
    $('#hosts_dt').dataTable({
        "bAutoWidth": true,
        "bSort": false,
        "bProcessing": true,
        "ajax": "../hosts_manage_data/",
        "columns": [
            {"data": "host_id"},
            {"data": "host_ip"},
            {"data": "host_name"},
            {"data": "os"},
            {"data": "type"},
            {"data": "username"},
            {"data": "password"},
            {"data": "host_type_name"},
            {"data": "oracle_name"},
            {"data": "oracle_password"},
            {"data": "oracle_instance"},
            {"data": null}
        ],

        "columnDefs": [{
            "targets": -6,
            "visible": false
        }, {"targets": -3,
            "visible": false
        },
            {
            "targets": -1,
            "data": null,
            "width": "100px",
            "defaultContent": "<button  id='edit' title='编辑' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-primary' type='button'><i class='fa fa-edit'></i></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button>"
        }],
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "抱歉， 没有找到",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "sSearch": "搜索",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
            "sZeroRecords": "没有检索到数据"

        }
    });
    // 行按钮
    $('#hosts_dt tbody').on('click', 'button#delrow', function () {
        if (confirm("确定要删除该条数据？")) {
            var table = $('#hosts_dt').DataTable();
            var data = table.row($(this).parents('tr')).data();
            $.ajax({
                type: "POST",
                url: "../hosts_manage_del/",
                data: {
                    host_id: data.host_id,
                },
                success: function (data) {
                    if (data.ret == 1) {
                        table.ajax.reload();
                    }
                    alert(data.info);
                },
                error: function (e) {
                    alert("删除失败，请于管理员联系。");
                }
            });

        }
    });
    $('#hosts_dt tbody').on('click', 'button#edit', function () {
        var table = $('#hosts_dt').DataTable();
        var data = table.row($(this).parents('tr')).data();

        $("#host_id").val(data.host_id);
        $("#host_ip").val(data.host_ip);
        $("#host_name").val(data.host_name);
        $("#os").val(data.os);
        $("#type").val(data.type);
        $("#username").val(data.username);
        $("#password").val(data.password);
        $("#host_type").val(data.host_type_value);
        $("#oracle_name").val(data.oracle_name);
        $("#oracle_password").val(data.oracle_password);
        $("#oracle_instance").val(data.oracle_instance);
    });

    $("#new").click(function () {
        $("#host_id").val("0");
        $("#host_ip").val("");
        $("#host_name").val("");
        $("#os").val("");
        $("#type").val("");
        $("#username").val("");
        $("#password").val("");
        $("#host_type").val("");
        $("#oracle_name").val("");
        $("#oracle_password").val("");
        $("#oracle_instance").val("");
    });

    $('#save').click(function () {
        var table = $('#hosts_dt').DataTable();

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "../host_save/",
            data: {
                host_id: $("#host_id").val(),
                host_ip: $("#host_ip").val(),
                host_name: $("#host_name").val(),
                os: $("#os").val(),
                type: $("#type").val(),
                username: $("#username").val(),
                password: $("#password").val(),
                host_type:$("#host_type").val(),
                oracle_name:$("#oracle_name").val(),
                oracle_password:$("#oracle_password").val(),
                oracle_instance:$("#oracle_instance").val()
            },
            success: function (data) {
                if (data.ret == 1) {
                    $('#static').modal('hide');
                    table.ajax.reload();
                }
                alert(data.info);
            },
            error: function (e) {
                alert("页面出现错误，请于管理员联系。");
            }
        });
    });

    $("#os").change(function () {
        if ($(this).val() == 'Linux') {
            $("#type").val("SSH");
        } else if ($(this).val() == 'AIX') {
            $("#type").val("SSH");
        } else if ($(this).val() == 'Windows') {
            $("#type").val("BAT");
        } else {
            $("#type").val("");
        }
    });


    $("#host_type").change(function () {
    if ($(this).val() == '3') {
        $("#oraclename").addClass("hidden");
        $("#oraclepassword").addClass("hidden");
        $("#oracleinstance").addClass("hidden");
        $("#oracle_name").addClass("hidden");
        $("#oracle_password").addClass("hidden");
        $("#oracle_instance").addClass("hidden");
    }
    else if ($(this).val() == '2' || $(this).val() == '1') {
        $("#oraclename").removeClass("hidden");
        $("#oraclepassword").removeClass("hidden");
        $("#oracleinstance").removeClass("hidden");
        $("#oracle_name").removeClass("hidden");
        $("#oracle_password").removeClass("hidden");
        $("#oracle_instance").removeClass("hidden");
    }
});

});