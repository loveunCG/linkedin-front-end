

function showMessage(msg) {

    if(msg=="invalid_user"){
        $("#email").val('');
        $("#password").val('');
        $('.validemail').addClass('text-danger');
        $('#email').addClass('border-danger');
        $('#label_pass').addClass('text-danger');
        $('#password').addClass('border-danger');
        $("#password_error").text("Please enter a correct email and password.")
        return false


    }

    return false

}

function validateLogin(){

    $('.validemail').removeClass('text-danger');
    $('#email').removeClass('border-danger');
    $("#email_error").text("");


    $('#label_pass').removeClass('text-danger');
    $('#password').removeClass('border-danger');
    $("#password_error").text("");


    // email validation
    if(!emailValidate($("#email").val())){

        $('.validemail').addClass('text-danger');
        $('#email').addClass('border-danger');
        $("#email_error").text("Enter a valid email address.")
        return false
    }

    //Password validation


    var password = $("#password").val();
    if(password.length == 0){

        $("#password").val('');

        $("#password_error").text("Please enter the password.");
        $('#label_pass').addClass('text-danger');
        $('#password').addClass('border-danger');
        return false

    }
    if(password.length < 8){

        $("#password").val('');

        $("#password_error").text("Please enter the correct password.");
        $('#label_pass').addClass('text-danger');
        $('#password').addClass('border-danger');
        return false

    }

    return true

}

function emailValidate(email){
    var check = "" + email;
    if((check.search('@')>=0)&&(check.search(/\./)>=0))
        if(check.search('@')<check.split('@')[1].search(/\./)+check.search('@')) return true;
        else return false;
    else return false;
}


$(document).ready(function(){

    showMessage(msg);

});
