ACCOUNT_SEARCH_URL = ''
$(document).ready(function () {
    console.log("ready!");

    function isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }


    function create_ajax_requst_data() {
        var ajax_request_data = new Object();
        ajax_request_data.search_head = '';

        return ajax_request_data;
    }

    $('#ajax_data_render_field').html(JSON.stringify(create_ajax_requst_data()));


    function load_data() {
        data = JSON.parse($('#ajax_data_render_field')[0].innerHTML)
        $.ajax({
            url: ACCOUNT_SEARCH_URL,
            type: "post",
            data: data,
            success: function (response) {
                console.log(response);
                $('#search_people').html(response);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }


        });
    }

    $(".search-item").click(function () {
        set_search_head($(this).context.firstElementChild.innerHTML);
        load_data();

        $(".search-item").removeClass('active');
        $(this).addClass('active');


    });


    $(".delete_search_result").click(function (event) {
        event.preventDefault()
        $('#remove_search').modal('show');

        $('#account_delete_form_model')[0].setAttribute('action', window.location.pathname + 'delete/' + $(this).parent()[0].children[0].innerHTML + '/')

    });


    function set_ajax_data(data) {
        $('#ajax_data_render_field').html(JSON.stringify(data));
    }

    function get_ajax_data() {
        data = JSON.parse($('#ajax_data_render_field')[0].innerHTML);
        return data;
    }

    function set_search_head(head) {
        data = get_ajax_data();
        data.search_head = head;
        set_ajax_data(data);
    }


    load_data();


    $("#new_search").click(function () {

        $('#advance_search_data').hide();
        $('#search_keyword').value = '';
        $('#search_location').value = '';
        $('#search_industry').value = '';
        $('#search_company').value = '';
        $('#search_title').value = '';
        $('#search_name').value = '';
        $('#search_url').value = '';
        $('#search_sales').value = '';

        $('#add_search').modal('show');
    });


    $("#advanced_search_toggle").click(function () {
        $('#advanced_search_toggle').hide();
        $('#advance_search_data').show();
    });


    $("#add_search_task").click(function (event) {
        event.preventDefault();

        error = 0

        if ($.trim($('#search_name')[0].value) == '') {
            $('#search_name').parent().addClass('has-error');
            error = 1;
        } else {
            $('#search_name').parent().removeClass('has-error');
        }


        if ($('#search_keyword').is(":visible")) {
            if ($.trim($('#search_keyword')[0].value) == '') {
                $('#search_keyword').parent().addClass('has-error');
                error = 2;
            }
        }
        if (error != 2) {
            $('#search_keyword').parent().removeClass('has-error');
        }
        console.log(isURL($('#search_url_form')[0].value))
        console.log($('#search_url_form')[0].value)
        if ($('#search_url_form').is(":visible")) {
            if (!isURL($.trim($('#search_url_form')[0].value))) {
                $('#search_url_form').parent().addClass('has-error');
                error = 3;
            }
        }
        if (error != 3) {
            $('#search_url').parent().removeClass('has-error');
        }

        if ($('#sales_search').is(":visible")) {
            if (!isURL($.trim($('#sales_search')[0].value))) {
                $('#sales_search').parent().addClass('has-error');
                error = 4;
            }
        }
        if (error != 4) {
            $('#search_sales').parent().removeClass('has-error');
        }
        if (error == 0)
            console.log('here');
            return;
            // $('#add_search').submit();

        console.log(error)

    });


});