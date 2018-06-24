ACCOUNT_SEARCH_URL = ''


function getDataNEW(search_id) {

    set_search_head(search_id);
    load_data();
    $(".search-item").removeClass('active');

}

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

function load_data() {
    data = JSON.parse($('#ajax_data_render_field')[0].innerHTML)
    $.ajax({
        url: ACCOUNT_SEARCH_URL,
        type: "post",
        data: data,
        success: function (response) {
            console.log(ACCOUNT_SEARCH_URL)
            $('#search_people').html(response);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }


    });
}

function AddNewSearchModal(){
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
}



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






    // $(".search-item").click(function () {
    //     console.log()
    //     set_search_head($(this).context.firstElementChild.innerHTML);
    //     load_data();
    //
    //     $(".search-item").removeClass('active');
    //     $(this).addClass('active');
    //
    //
    // });


    $(".delete_search_result").click(function (event) {
        // event.preventDefault()
        $('#remove_search').modal('show');

        $('#account_delete_form_model')[0].setAttribute('action', window.location.pathname + 'delete/' + $(this).attr('item-id') + '/')
        return false;

    });





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

        $('#search_label').removeClass('text-danger');
        $('#search_name').removeClass('border-danger');
        $("#search_error").text("");
        error = 0
        if ($.trim($('#search_name')[0].value) == '') {

            // $('#search_name').parent().addClass('has-error');
            error = 1;
            $('#search_label').addClass('text-danger');
            $('#search_name').addClass('border-danger');
            $("#search_error").text("Please enter a Search name");
//             $('#search_input_error').css('color', 'red').html('if this field is empty, search is not saved!');
            error = 1;
            return false


        } else {
            $('#search_input_error').html('');
        }

        if ($('#search_keyword').is(":visible")) {
            if ($.trim($('#search_keyword')[0].value) == '') {
                $('#search_keyword_error').css('color', 'red');
                error = 2;
                return
            }
        }
        if (error != 2) {
            $('#search_keyword_error').css('color', 'black');
        }
        if ($('#search_url_form').is(":visible")) {
            if (!isURL($.trim($('#search_url_form')[0].value))) {
                $('#search_url_form_error').css('color', 'red');
                error = 3;
                return
            }
        }
        if (error != 3) {
            $('#search_url_form_error').css('color', 'black');
        }

        if ($('#sales_search').is(":visible")) {
            if (!isURL($.trim($('#sales_search')[0].value))) {
                $('#sales_search_error').css('color', 'red');
                error = 4;
                return
            }
        }
        if (error != 4) {
            $('#sales_search_error').css('color', 'black');
        }

        if (error == 0){
            $('#add_search').submit();
        }

        console.log(error)
    });


});