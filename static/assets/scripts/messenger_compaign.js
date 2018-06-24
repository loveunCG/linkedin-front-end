function loadTextCount() {
    $("textarea").each(function(e){
        try{

            $(this).next('small').removeClass('text-danger')
            var txt_count = $(this).val().length ;
            if(parseInt(txt_count)>=300){
                $(this).next('small').text('Message is maxium 300 chars.').addClass('text-danger');
            }
            else{
                var remain_count = 300 - parseInt(txt_count)
                $(this).next('small').text('Remained chars ' + remain_count);
            }


        }catch (e){}


    });
}


$('textarea').bind('input propertychange', function(e) {
    $(e.target).next('small').removeClass('text-danger');
    var txt_count = $(e.target).val().length ;
    //$(e.target).next('small').text('Chars ' + txt_count)
    if(parseInt(txt_count)>=300){
        $(e.target).next('small').text('Message is maxium 300 chars').addClass('text-danger');
        swal("alert!", 'Message is maxium 300 chars!', "error");
    }
    else{
        var remain_count = 300 - parseInt(txt_count)
        $(e.target).next('small').text('Remained chars ' + remain_count);
    }

});

function addText(e,text_val){

    $(e).parent().next('textarea').next('small').removeClass('text-danger');

    $(e).parent().next('textarea').val( $(e).parent().next('textarea').val() + '' + text_val );

    var txt_count = $(e).parent().next('textarea').val().length ;
    if(parseInt(txt_count)>=300){
        $(e.target).next('small').text('Message is maxium 300 chars').addClass('text-danger');
        swal("alert!", 'Message is maxium 300 chars!', "error");
    }else{
        var remain_count = 300 - parseInt(txt_count)
        $(e).parent().next('textarea').next('small').text('Remained chars ' + remain_count)   //.addClass('text-danger');
    }

}