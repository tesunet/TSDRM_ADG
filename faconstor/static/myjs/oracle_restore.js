$(document).ready(function () {
    $("#target").val("");
    var copy_priority_hidden = $("#copy_priority_hidden").val();
    $("#copy_priority").val(copy_priority_hidden);

    var db_open_hidden = $("#db_open_hidden").val();
    $("#db_open").val(db_open_hidden);

    function customProcessDataTable() {
        $('#sample_1').dataTable({
            "bAutoWidth": true,
            "bSort": false,
            "bProcessing": true,
            "ajax": "../oracle_restore_data/",
            "fnServerParams": function (aoData) {
                aoData.push({
                    name: "process_id",
                    value: $("#process_id").val()
                })
            },
            "columns": [
                {"data": "processrun_id"},
                {"data": "process_name"},
                {"data": "createuser"},
                {"data": "state"},
                {"data": "run_reason"},
                {"data": "starttime"},
                {"data": "endtime"},
                {"data": "process_id"},
                {"data": "process_url"},
                {"data": null},
            ],
            "columnDefs": [{
                "targets": 1,
                "render": function (data, type, full) {
                    return full.state != "计划" ? "<td><a href='process_url' target='_blank'>data</a></td>".replace("data", full.process_name).replace("process_url", "/processindex/" + full.processrun_id + "?s=true") : "<td>" + full.process_name + "</td>"
                }
            }, {
                "visible": false,
                "targets": -2  // 倒数第一列
            }, {
                "visible": false,
                "targets": -3  // 倒数第一列
            }, {
                "targets": -1,  // 指定最后一列添加按钮；
                "data": null,
                "width": "60px",  // 指定列宽；
                "render": function (data, type, full) {
                    return "<td><button class='btn btn-xs btn-primary' type='button'><a href='/custom_pdf_report/?processrunid&processid'><i class='fa fa-arrow-circle-down' style='color: white'></i></a></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button></td>".replace("processrunid", "processrunid=" + full.processrun_id).replace("processid", "processid=" + full.process_id)
                }
            }],

            "oLanguage": {
                "sLengthMenu": "&nbsp;&nbsp;每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": '',
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "sSearch": "搜索",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sZeroRecords": "没有检索到数据",

            }
        });

        $('#sample_1 tbody').on('click', 'button#delrow', function () {
            if (confirm("确定要删除该条数据？")) {
                var table = $('#sample_1').DataTable();
                var data = table.row($(this).parents('tr')).data();
                $.ajax({
                    type: "POST",
                    url: "../../delete_current_process_run/",
                    data:
                        {
                            processrun_id: data.processrun_id
                        },
                    success: function (data) {
                        if (data == 1) {
                            table.ajax.reload();
                            alert("删除成功！");
                        } else
                            alert("删除失败，请于管理员联系。");
                    },
                    error: function (e) {
                        alert("删除失败，请于管理员联系。");
                    }
                });

            }
        });
    }

    customProcessDataTable();

    $("#confirm").click(function () {
        var process_id = $("#process_id").val();

        // 非邀请流程启动
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "../cv_oracle_run/",
            data:
                {
                    processid: process_id,
                    run_person: $("#run_person").val(),
                    run_time: $("#run_time").val(),
                    run_reason: $("#run_reason").val(),
                    process_type:$("#process_type").val()
                },
            success: function (data) {
                if (data["res"] == "新增成功。") {
                    window.location.href = data["data"];
                } else
                    alert(data["res"]);
            },
            error: function (e) {
                alert("流程启动失败，请于管理员联系。");
            }
        });
    });

    $("#run").click(function () {
        $("#static").modal({backdrop: "static"});
        $('#recovery_time').datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
            pickerPosition: 'top-right'
        });
        // 写入当前时间
        var myDate = new Date();
        $("#run_time").val(myDate.toLocaleString());
        $("#process_type").val('1');
        $("#target").val("")
    });
    $("#back").click(function () {
        $("#static").modal({backdrop: "static"});
        $('#recovery_time').datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
            pickerPosition: 'top-right'
        });
        // 写入当前时间
        var myDate = new Date();
        $("#run_time").val(myDate.toLocaleString());
        $("#process_type").val('2');
        $("#target").val("")
    });

    // modal.show事件
    $("#static").on("shown.bs.modal", function (event) {
        $("#target").val($("#target_selected").val());
        $("#run_reason").val("");
        $("#recovery_time").val("");

        // 写入当前时间
        var myDate = new Date();
        $("#run_time").val(myDate.toLocaleString());
        $("input[name='recovery_time_redio'][value='1']").prop("checked", true);
        $("input[name='recovery_time_redio'][value='2']").prop("checked", false);
    });

    /*
    var curHref = window.href;
    var global_end = false;
    if (curHref.indexOf("oracle_restore") != -1) {
        setTimeout(function () {
            if (!global_end) {
                // 处理时对end标志进行修改，end=True表示停止（取消定时器）。
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: "../get_oracle_status/",
                    data:
                        {
                            process_id: $("#process_id").val()
                        },
                    success: function (data) {
                        //..
                        console.log(data);
                        $("#test").val(JSON.stringify(data["data"]) + "\n" + "host_status:主机状态,host_ip:主机IP，switchover_status:切换状态,database_role:切换角色,host_name:主机名称,db_status:数据库状态");
                    },
                    error: function (e) {
                        alert("获取邀请函数据失败，请于管理员联系。");
                    }
                });

                // 循环(arguments.callee获取当前执行函数的引用)
                setTimeout(arguments.callee, 10000);
            } else {
                global_end = false;
            }
        }, 10000);
    } else {
        global_end = true;
    }
    */

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "../get_oracle_status/",
        data:
            {
                process_id: $("#process_id").val()
            },
        success: function (data) {
            //..
            console.log(data);
            l_host_name=data["data"][0].host_name;
            l_db_status = data["data"][0].db_status;
            l_switchover_status = data["data"][0].switchover_status;

            r_host_name=data["data"][1].host_name;
            r_db_status = data["data"][1].db_status;
            r_switchover_status = data["data"][1].switchover_status;
            $(".ldbname").text(l_host_name);
            $(".ldbsta").text(l_db_status );
            $(".rdbname").text(r_host_name);
            $(".rdbsta").text(r_db_status);

            if(l_db_status=="OPEN"){
                $(".ldbimg").attr("src","/static/new/images/db1.png");
            }
            if(l_db_status=="READ ONLY WITH APPLY"){
                $(".ldbimg").attr("src","/static/new/images/db1.png");
            }
            if(l_db_status=="READ WRITE"){
                $(".ldbimg").attr("src","/static/new/images/db1.png");
            }
            if(l_db_status=="READ ONLY"){
                $(".ldbimg").attr("src","/static/new/images/db1.png");
            }
            if(l_db_status=="MOUNT"){
                $(".ldbimg").attr("src","/static/new/images/db2.png");
            }
            if(r_db_status=="OPEN"){
                $(".rdbimg").attr("src","/static/new/images/db1.png");
            }
            if(r_db_status=="READ ONLY WITH APPLY"){
                $(".rdbimg").attr("src","/static/new/images/db1.png");
            }
            if(r_db_status=="READ WRITE"){
                $(".rdbimg").attr("src","/static/new/images/db1.png");
            }
            if(r_db_status=="MOUNT"){
                $(".rdbimg").attr("src","/static/new/images/db2.png");
            }
            if(r_db_status=="READ ONLY"){
                $(".ldbimg").attr("src","/static/new/images/db1.png");
            }
            if(l_switchover_status=="PRIMARY"){
                $(".sync").attr("src","/static/new/images/sync_r.gif");
            }
            if(r_switchover_status=="PRIMARY"){
                $(".sync").attr("src","/static/new/images/sync_l.gif");
            }

            //$("#test").val(JSON.stringify(data["data"]) + "\n" + "host_status:主机状态,host_ip:主机IP，switchover_status:切换状态,database_role:切换角色,host_name:主机名称,db_status:数据库状态");
        },
        error: function (e) {
            ;
        }
    });
});
