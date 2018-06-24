function load_followup_list() {
        $.ajax
        ({
            type: "get",
            url: followup_url,
            success: function (html) {
                $('#followup_list').html(html)
            }
        });
    }

    function load_stored(cpk, fpk) {

        data = new Object()
        data['cpk'] = cpk
        data['fpk'] = fpk

        $.ajax({
            url: data_stored,
            type: "post",
            data: data,
            success: function (response) {
               $('#data_already_stored').html(response)
                $('.summernote').summernote(summernote_data);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }


        });

    }

    function load_new(cpk) {
     data = new Object()
        data['cpk'] = cpk
        $.ajax
        ({
            type: "post",
            url: data_new,
            data: data,
            success: function (html) {
                $('#data_new').html(html)
                $('.summernote').summernote(summernote_data);
            }
        });
    }


$(document).ready(function () {


    var NameButton = function (context) {
        var ui = $.summernote.ui;

        // create button
        var button = ui.button({
            contents: 'Name',
            click: function () {
                // invoke insertText method with 'hello' on editor module.
                context.invoke('editor.insertText', ' {Name} ');
            }
        });

        return button.render();   // return button as jquery object
    }
    var FnameButton = function (context) {
        var ui = $.summernote.ui;

        // create button
        var button = ui.button({
            contents: 'First name',
            click: function () {
                // invoke insertText method with 'hello' on editor module.
                context.invoke('editor.insertText', ' {FirstName} ');
            }
        });

        return button.render();   // return button as jquery object
    }
    var CnameButton = function (context) {
        var ui = $.summernote.ui;

        // create button
        var button = ui.button({
            contents: 'Company name',
            click: function () {
                // invoke insertText method with 'hello' on editor module.
                context.invoke('editor.insertText', ' {Company} ');
            }
        });

        return button.render();   // return button as jquery object
    }
    var TitleButton = function (context) {
        var ui = $.summernote.ui;

        // create button
        var button = ui.button({
            contents: 'Title',
            click: function () {
                // invoke insertText method with 'hello' on editor module.
                context.invoke('editor.insertText', ' {Title} ');
            }
        });

        return button.render();   // return button as jquery object
    }

    summernote_data = {
        height: 150,   //set editable area's height
        toolbar: [
            ['mybutton', ['name', 'fname', 'cname', 'title']]
        ],

        buttons: {
            name: NameButton,
            fname: FnameButton,
            cname: CnameButton,
            title: TitleButton
        }
    }
    $('.summernote').summernote(summernote_data);



    load_followup_list()
    load_stored(cpk,'init')
    load_new(cpk)
});


function delete_email(fpk) {
    console.log(fpk)


    data = new Object()
        data['fpk'] = fpk

        $.ajax({
            url: '/account/messenger/delete-followup/',
            type: "post",
            data: data,
            success: function (response) {
               load_followup_list()
            load_stored(cpk,'init')
            load_new(cpk)
            activate_stored()

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }


        });





    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}

function activate_stored() {
    $('#data_new').addClass('hidden')
    $('#data_already_stored').removeClass('hidden')
}

function activate_new() {
    $('#data_new').removeClass('hidden')
    $('#data_already_stored').addClass('hidden')
}

$(document).on('click', '#add_followup', function () {
    $("#add_followup")[0].setAttribute('disabled', '')
    $("#new_followup").removeClass('hidden')
    $('.list-group-item').removeClass('active')
    $("#new_followup").addClass('active')
    activate_new()
    console.log('ok')
});


$(document).on('click', '.list-group-item', function () {
    $('.list-group-item').removeClass('active')
    $(this).addClass('active')
    if ($(this)[0].getAttribute('data_val') == 'new')
        activate_new()
    else{
        load_stored(cpk, $(this)[0].getAttribute('data_val'))
        activate_stored()
    }


    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
});


$(document).on('click', '#btn-save-followup', function () {
    form = $("#form-save")
    $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        dataType: 'json',
        data: form.serialize(),
        success: function (data) {
            alert('Submitted');
        },
        error: function (xhr, err) {
            alert('Error');
        }
    });
});


$(document).on('click', '#btn-add-followup', function () {
    form = $("#form-add")
    $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        dataType: 'json',
        data: form.serialize(),
        success: function (data) {
            load_followup_list()
            load_stored(cpk,'init')
            load_new(cpk)
            activate_stored()
        },
        error: function (xhr, err) {
            alert('Error');
        }
    });
});

