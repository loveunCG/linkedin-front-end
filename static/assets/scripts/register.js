
function showMessage(msg) {

    if(msg=="email_exists"){
        $('.validemail').addClass('text-danger');
        $('#email').addClass('border-danger');
        $("#email_error").text("The email address is in-use. Please choose another one.")
        return false

    }

    if( msg == 'register_success' ){
        $('#myModal').modal('show');
    }
    return false

}




function validateReg(){
    $('.validemail').removeClass('text-danger');
    $('#email').removeClass('border-danger');
    $("#email_error").text("");
    $('#label_pass').removeClass('');
    $('#password').removeClass('');
    $("#password_error").text("");
    $('#label_confirm_pass').removeClass('text-danger');
    $('#confirm-password').removeClass('border-danger');
    $("#confirm_password_error").text("");
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
        return false    }
    if(password.length < 8){
        $("#password").val('');
        $("#confirm-password").val('');
        $("#password_error").text("This password is too short. It must contain at least 8 characters.");
        $('#label_pass').addClass('text-danger');
        $('#password').addClass('border-danger');
        return false
    }


    //Confirm password validation


    var confirmPassword = $("#confirm-password").val();

    if(confirmPassword.length == 0){
        $("#confirm_password_error").text("Please enter the confirm password.");
        $('#label_confirm_pass').addClass('text-danger');
        $('#confirm-password').addClass('border-danger');
        $("#password").val('');
        $("#confirm-password").val('');
        return false
    }

    if(confirmPassword.length < 8){
        $("#confirm_password_error").text("This password is too short. It must contain at least 8 characters.");
        $('#label_confirm_pass').addClass('text-danger');
        $('#confirm-password').addClass('border-danger');
        $("#password").val('');
        $("#confirm-password").val('');
        return false
    }


    // Check for equality with the password inputs
    if (password != confirmPassword ) {
        $("#confirm_password_error").text("The two password fields didn't match.");
        $('#label_confirm_pass').addClass('text-danger');
        $('#confirm-password').addClass('border-danger');
        $("#password").val('');
        $("#confirm-password").val('');
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
