var isload = false

var url = window.location.href;
var tmp_object;
var url = window.location.href;
var statusColors = {
	"0": "btn-purple ",
	"22": "bg-default",
	"21": "bg-blue",
	"10": "bg-green",
	"12": "bg-yellow",
	"200": "bg-danger",
	"3": "bg-default",
	"1": "bg-info",
	"23": "bg-default",
	"20": "bg-red",
	"7": "bg-default",
	"100": "bg-elegant",
	"6": "bg-default",
	"28": "bg-green",
};
var path = window.location.pathname;
console.log(url)
var inboxPage = path.indexOf('network') >= 0 ? false : true;
var status_index = 8
var table;

function loadTable(page_count) {

	 table = $('#campaign_people').DataTable({
            "ajax": url,
            // "bFilter": false,
            "destroy": true,
            // "bProcessing": true,
            // "bServerSide": true,
            "aLengthMenu": [[25, 50, 75, -1], [25, 50, 75, "All"]],
            "iDisplayLength": parseInt(page_count),
            'initComplete': function (settings) {
                var api = this.api();
                api.columns().every(function () {
                    var column = this;
                    if (column.index() === status_index) {
                        var select = $('<select><option value=""></option></select>')
                            .appendTo($(column.header()))
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );
                                var text = contact_statuses[val];
                                console.log('text:', val, text);
                                column
                                    .search((val && val >= 0) ? text : '', false, true)
                                    .draw();
                            });
                        var status_list = inboxPage ? contact_statuses : mynetwork_statuses;
                        Object.keys(status_list).sort().forEach(function (k) {
                            select.append('<option value="' + k + '">' + contact_statuses[k] + '</option>');
                        })
                    }

                });
            },
            'columnDefs': [
                {
                    'targets': 0,
                    'checkboxes': true,
                    "render": function (data, type, row) {
                        let html = '<input type="checkbox" class="dt-checkboxes" value="' + row[0] + '">';
                        return html;
                    }
                },
                {
                    "targets": status_index,
                    "data": null,
                    "render": function (data, type, row) {
                        var v = row[status_index];
                        var btncolor = statusColors[v] ? statusColors[v] : 'btn-purple btn-gradient';
                        var html = '<span data-status="' + v + '" data-contactid="' + row[0] + '" class="btn ' + btncolor;
                        html += ' btn-block" data-click="change_status" data-toggle="tooltip"';
                        html += 'data-html="true" title="';
                        if (v === 22) {
                            html += '<strong>Imported</strong><br>';
                            html += 'Old contact before you joined B2B';
                        } else if (v === 0) {
                            html += '<strong>' + row[7] + '</strong>';
                        }
                        html += '<br><i>Click on status to change it manually</i>">';
                        html += contact_statuses[v];
                        html += '</span>';
                        return html;
                    },
                },
                {
                    "targets": 6,
                    "data": null,
                    "render": function (data, type, row) {
                        return row[6];
                    },
                },
                {
                    "targets": [7], //
                    "visible": !inboxPage,
                    "searchable": true,
                    "render": function (data, type, row) {

                        var extrahtml = "";
                        console.log('-----------', row[9], row[7])
                        if (row[9] === true)
                            extrahtml = "messenger";
                        else
                        // else if (row[9] === false)
                            extrahtml = "connector";
                        extrahtml = (row[7] ? row[7] : "") + '<span class="hidden">' + extrahtml + '</span>';
                        return extrahtml;
                    }
                },
                {
                    // "targets": [9], //
                    "visible": false,
                    "searchable": false,
                },
            ],
            'order': [[1, 'asc']],
            "bAutoWidth": true,
            "drawCallback": function (settings) {
                var popover = '<div class="list-group" style="margin:0" data-cid="{{pk}}">';
                var status = ['Later', 'No Interest', 'Replied', 'Talking', 'Old Connect'];
                popover += '<a href="#" data-status="20" data-click="changeStatus" class="list-group-item">Mark Later</a>';
                popover += '<a href="#" data-status="21" data-click="changeStatus" class="list-group-item">Mark No Interest</a>';
                popover += '<a href="#" data-status="10" data-click="changeStatus" class="list-group-item">Mark Replied</a>';
                popover += '<a href="#" data-status="12" data-click="changeStatus" class="list-group-item">Mark Talking</a>';
                popover += '<a href="#" data-status="22" data-click="changeStatus" class="list-group-item">Mark Old Connect</a>';
                popover += '</div>';
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-click="change_status"]').click(function () {
                    $('.bs-popover-bottom').hide();
                    tmp_object = this;
                    setTimeout(function () {
                        if ($('.main-section').is('.open-more')) {
                            $('.main-section').toggleClass("open-more");
                            if ($('.input-chat-message').is(':visible')) {
                                $('.input-chat-message').hide();
                            } else {
                                $('.input-chat-message').show();
                            }
                        } else {
                        }
                    }, 10);

                });

                $('[data-click="change_status"]').popover({
                    template: popover,
                    placement: 'bottom',
                    target: 'table',
                });
            },
            "dom": '<"toolbar col-md-12 mt-sm mb-sm">frtip'
        });


	 var detailRows = [];

	 $('#example tbody').on('click', 'tr td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var idx = $.inArray(tr.attr('id'), detailRows);

            if (row.child.isShown()) {
                tr.removeClass('details');
                row.child.hide();

                // Remove from the 'open' array
                detailRows.splice(idx, 1);
            }
            else {
                tr.addClass('details');
                row.child(format(row.data())).show();

                // Add to the 'open' array
                if (idx === -1) {
                    detailRows.push(tr.attr('id'));
                }
            }
        });

		 table.on('draw', function () {
				$.each(detailRows, function (i, id) {
					$('#' + id + ' td.details-control').trigger('click');
				});
			});

			var header_buttons = '';
			if (inboxPage) {
				header_buttons += '&nbsp;<button class="btn btn-primary btn-gradient waves-effect waves-light" data-click="markRead">Mark as read</button>';
				header_buttons += '&nbsp;<button class="btn btn-info btn-gradient waves-effect waves-light" data-click="markUnread">Mark as unread</button>';
				header_buttons += '&nbsp;<button class="btn btn-red btn-gradient waves-effect waves-light" data-click="removeFromCampaign" data-cid="1">Delete</button>';
			} else if (path.indexOf('network') >= 0) {
				//network page

				header_buttons += '<div class="row">' +
					'<div class="col-md-7">' +
					'<div class="row" id="filter-search-moved">' +
					'</div>' +
					'<div class="btn-group btn-group-toggle btn-group-custom-checkbox" data-toggle="buttons">' +
					'<span id="show_connector_contacts" class="btn btn-primary btn-gradient waves-effect waves-light">' +
					'<input  type="checkbox"  data-click="connector" >Show Connection contacts' +
					'</span>';
				header_buttons += '<span id="show_messenger_contacts"  class="btn btn-primary btn-gradient waves-effect waves-light">' +
					'<input type="checkbox" data-click="messenger">Show Messenger contacts</span>';
				header_buttons += '<span id="show_talking_contacts" class="btn btn-primary btn-gradient waves-effect waves-light">' +
					'<input type="checkbox" data-click="talking">Show Talking contacts</span></div></div>';
				header_buttons += '<div class="col-md-5"><div class="row justify-content-end"><a class="btn pull-right btn-primary" id="add_selected" data-click="addSelected2Campaign">Add selected contacts to Messenger Campaign</a></div>';
				header_buttons += '<div class="row justify-content-end"><a class="btn btn-primary pull-right" id="add_allnew" data-click="addAll2Campaign">Add all filtered contacts to Messenger Campaign</a></div>';
			}
			header_buttons += '<div class="row justify-content-end"><button class="btn btn-default pull-right export-to-csv" title="Export contacts to CSV"><i class="fa fa-file-excel-o"></i></button></div></div>';

			if (inboxPage) {
				$(".dataTables_filter").find('label').find('input').toggleClass('form-control-sm').addClass('col-md-3')
			} else {
				$(".dataTables_filter").find('label').find('input').toggleClass('form-control-sm')
				$(".dataTables_filter").addClass('col-md-5')
				// $(".dataTables_filter").html('html')
			}
			$("div.toolbar").html(header_buttons);

			$(".dataTables_filter").appendTo('#filter-search-moved');
			$('#campaign_people_previous').find('a').html('<i class="fa fa-arrow-left" aria-hidden="true"></i>');
			$('#campaign_people_next').find('a').html('<i class="fa fa-arrow-right" aria-hidden="true"></i>');


			$('#show_connector_contacts').click(function (e) {
				let that = $(this).find('input');
				let val = that.data('click');
				console.log('---', val)
				let column = table.column(7);
				column.search(!that.is(':checked') ? val : '', false, true)
					.draw();

			});

	 setTimeout(function(){
	 	$(".dt-checkboxes-select-all").css("width", "15px");

	 	}, 300);



}


    $(document).ready(function () {

        loadTable(10);



        // Array to track the ids of the details displayed rows





        // On each draw, loop over the `detailRows` array and show any child rows


        $('#show_messenger_contacts').click(function (e) {
            let that = $(this).find('input');
            let val = that.data('click');

            let column = table.column(7);
            column.search(!that.is(':checked') ? val : '', false, true)
                .draw();
        });

        $('#show_talking_contacts').click(function (e) {
            let that = $(this).find('input');
            console.log(that.is(':checked'))
            let column = table.column(8);
            column.search(!that.is(':checked') ? contact_statuses[12] : '', false, true)
                .draw();
        });

        $('body').on('click', 'a[data-click="changeStatus"]', function (e) {
            console.log($('.popoverButton').length);
            if ($('.popoverButton').length > 1)
                $('.popoverButton').popover('hide');
            $(e.target).popover('toggle');
            var parent = $(this).parent();
            parent.popover('hide');
            // var statusbox = parent.prev();
            var statusbox = $(tmp_object);
            console.log(statusbox.data('contactid'));

            var contactid = statusbox.data('contactid');
            var old_status = statusbox.data('status');
            var new_status = $(this).data('status');
            changeContactStatus(contactid, new_status, old_status, function (contactid, new_status, old_status) {

                var oldcolor = statusColors[old_status];
                var newcolor = statusColors[new_status];
                var spanbox = $('td>span[data-contactid="' + contactid + '"]');
                console.log('changing status:', old_status, oldcolor, contact_statuses[new_status], spanbox);

                spanbox.text(contact_statuses[new_status]);
                spanbox.removeClass(oldcolor).addClass(newcolor);
            });
        });


        function changeContactStatus(contactid, new_status, old_status, cb) {
            var url = "/account/contact/" + contactid + "/status?status=" + new_status;
            $.get(url).done(function (res) {
                if (res.ok) {
                    cb(contactid, new_status, old_status);
                }
            })
        }

        // buton click
        //export to excel
        $('button[data-click="export"]').click(function (e) {
            swal("alert!", "Will be done.", "success");

        });
        //delete
        $('button[data-click="removeFromCampaign"]').click(function (e) {
            var $table = table.table().node();
            var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
            var rows_selected = $chkbox_checked;
            console.log('rows_selected:', $chkbox_checked);
            if (rows_selected.length < 1) {
                alert_no_contact();
                return;
            }
            swal({
                    title: "Are you sure?",
                    text: "Your connect contacts will be deleted but your network contats will be changed to 'Old connect'",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function () {
                    let form = $('form[name="contacts-delete"]');
                    let contact_id = '';
                    for (let i = 0; i < rows_selected.length; i++) {
                        if ($(rows_selected[i]).is('.dt-checkboxes')) {
                            contact_id += ($(rows_selected[i]).val()) + ',';
                        }
                    }

                    let data = contact_id;
                    form.find('input[name="cid"]').val(data);
                    do_post_action(form, function () {
                        table.ajax.reload();
                        swal("Deleted!", "Your contacts have been deleted.", "success");
                    });
                });
        });

        //add selected
        $('#add_selected').click(function (e) {
            var rows_selected = table.column(0).checkboxes.selected();
            var contacts = [];
            $.each(rows_selected, function (index, rowId) {
                console.log(index)
                console.log(index)
                contacts.push(rowId);
                // find its row
                var $row = $('td>span[data-contactid="' + rowId + '"]').closest('tr');    	    // Get row data
                var row = table.row($row).data();
                if (row) {
                    if (row[7])
                        contact_camps[row[7]] = 1;
                }

            });
            if (contacts.length == 0) {
                // alert
                //alert('No contact has been selected!');
                alert_no_contact();
                return;
            }
            // show campain modal
            show_add2campaign(contacts);
        });

        function alert_no_contact() {
            swal("Alert!", "No selected contact", "error");
        };

        //add_all filtered contact

        $('#add_allnew').click(function (e) {

            if (filtered_row_num < 1) {
                alert_no_contact();
                return;
            }
            var contacts = [];
            $.each(filtered_rows, function (index, row) {
                contacts.push(row[0]);
                if (row[7] !== null)
                    contact_camps[row[7]] = 1;
            });
            show_add2campaign(contacts);


        });

        function show_add2campaign(contacts) {
            var cids = contacts.join(',');
            $('#add2campaign input[name="cid"]').val(cids);
            $("#add2campaign").modal('show');

        }

        //add2bulk_button
        $('body').on('click', '.add2bulk_button', function (e) {
            e.preventDefault();
            var that = $(this);
            // check campaign message
            var selected_camp = $("#add2campaign #campaign option:selected");
            var camp_id = selected_camp.val();
            var campaign_name = selected_camp.text();
            var messenger = $("#add2campaign .campaign-" + camp_id);
            var camp_message = messenger.html();
            if (camp_message === "" || camp_message.length < 5) {
                var url = messenger.data('url');

                var text = 'Your selected campaign <b>' + campaign_name + '</b> has not had any message yet.';
                text += ' Please add some <a href="' + url + '">here</a>.';

                show_camp_alert(text)
                return;
            }

            // check contact in other campaign

            console.log('campaign_name:', campaign_name, contact_camps);
            var othercamps = [];
            var arr = Object.keys(contact_camps);
            if (arr.length > 0) {
                arr.forEach(function (camp) {
                    console.log('checking:', camp);

                    if (camp !== campaign_name) {
                        othercamps.push(camp);
                    }

                });

                console.log('othercamps:', othercamps);
                if (othercamps.length > 0) {
                    // add move contacts button
                    var text = 'Contacts in <b>' + othercamps.join(', ') + '</b> campaign' + (othercamps.length > 1 ? 's' : '');
                    text += ' will be moved into <b>' + campaign_name + '</b>';

                    show_camp_alert(text);
                    $("#add2campaign .move2bulk_button").removeClass('hidden');

                    return;
                }
            }
            do_post_campaign(that);
        });
        $('body').on('click', '.move2bulk_button', function (e) {
            e.preventDefault();
            var that = $(this);
            do_post_campaign(that);

        });

        function show_camp_alert(text) {
            $("#add2campaign .add2bulk_button").hide();
            $("#add2campaign .modal-body-input").hide();
            var mbody = $("#add2campaign .modal-body-move");
            mbody.html(text);
            mbody.show();
        }

        function do_post_campaign(that) {
            var form = that.closest('form');
            do_post_action(form, function () {
                table.ajax.reload();
                $("#add2campaign").modal('hide');
            });

        }

        function do_post_action(form, cb) {
            var data = form.serialize();
            console.log('posted data:', form.attr('action'), data);
            $.post(form.attr('action'), data).done(function (res) {
                console.log('posted result:', data);
                if (res.ok) {
                    cb(res);
                }
            });
        }

        // filtered
        table.on('search.dt', function () {
            //number of filtered rows
            filtered_row_num = table.rows({filter: 'applied'}).nodes().length;
            //filtered rows data as arrays
            filtered_rows = table.rows({filter: 'applied'}).data();
        })

        // click row
        $('#campaign_people tbody').on('click', 'tr', function () {
            console.log(this)
            var data = table.row(this).data();
            if ($('.main-section').is('.open-more')) {

            } else {
                $('.main-section').toggleClass("open-more");

                if ($('.input-chat-message').is(':visible')) {
                    $('.input-chat-message').hide();
                } else {
                    $('.input-chat-message').show();
                }

            }
            show_uinfo(data[0])
        });
        var current_uid = 1;

        function show_uinfo(uid) {
            current_uid = uid;
            var url = "/messenger/contact/" + uid + "/updatenote";
            $.get(url).done(function (res) {
                $('#uinfo_box').html(res);
            });
        }

        //save notes
        $('body').on('click', '#save_notes', function (e) {
            e.preventDefault();
            var form = $(this).closest('form');
            do_post_action(form, function () {
                console.log('notes is saved')
            });
        });
        //sendmessage
        $('body').on('click', '#sendmessage', function (e) {
            e.preventDefault();
            var form = $(this).closest('form');
            do_post_action(form, function (res) {
                console.log('notes is saved')
                show_uinfo(current_uid);

            });
        });

        setTimeout(function () {
            var firstrow = $('#campaign_people tbody tr').first();
            var data = table.row(firstrow).data();
            if (data)
                show_uinfo(data[0])
        }, 2000);


        // for collapse chat content
        $("body").on('click', "[data-widget='collapse']", function (e) {
            console.log('data widget');
            //Find the box parent........
            var box = $(this).parents(".box").first();
            //Find the body and the footer
            var bf = box.find(".box-body, .box-footer");
            if (!$(this).children().hasClass("fa-plus")) {
                $(this).children(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
                bf.slideUp();
            } else {
                //Convert plus into minus
                $(this).children(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
                bf.slideDown();
            }
        });

    });
