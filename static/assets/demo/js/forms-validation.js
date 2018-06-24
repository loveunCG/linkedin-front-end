$(document).ready(function(){
	/*
	IMPORTANT!!! MAKE SURE YOU ALSO USE SERVER SIDE VALIDATION AND DON'T JUST RELY ON CLIENT SIDE VALIDATION. CLIENT SIDE VALIDATION IS ONLY USED TO CHECK IF THE USER ENTERED THE CORRECT EMAIL AND NOTHING MORE

	B5B Documentation:
	This code serves only as a sample for the Validation page
	qp_form_validate is duplicated here for convenience only. The real function resides within assets/js/scritps.js
	 */



	/**
	 * @param  {string} fieldID:					the ID of the field you are validating
	 * @param  {string} type:						accepts: [email, numeric, alphanumeric, alphabet, password]
	 * @param  {int} required:						(optional field) accepts: 0 or 1. whether or not this feild is required
	 * @param  {integer} lengthMin:					(optional field) the min length of the password
	 * @param  {integer} lengthMax:					(optional field) the max length of the password
	 * @return {string, integer or Boolean}			this will return an error message or boolean or integer
	 */
	function qp_form_validation(fieldID, type, required, lengthMin, lengthMax){
		/* Set defaults */
		if(required === undefined || !required || required == ""){
			required = 0;
		}else{
			required = 1;
		}
		if(lengthMin === undefined || !lengthMin || lengthMin == ""){
			lengthMin = 6;
		}

		if(lengthMax === undefined || !lengthMax || lengthMax == ""){
			lengthMax = 30;
		}

		var value = $(fieldID).val();

		$(fieldID).closest('form').find('*').removeClass('border-danger, has-danger, text-danger');
		$(fieldID).closest('form').find('.form-control-feedback').remove();

		/* Calls the appropriate function based on the "type" variable */
		switch(type){
			case "email":
				if((required) && (value.trim() == "")){
					var message = "This field is required.";
					return message;
				}

				if(qp_form_validate_email(value) === true){
					return true;
				}else{
					var message = '<div class="form-control-feedback text-danger">Please enter a valid email.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}
			break;

			case "numeric":
				if((required) && (value.trim() == "")){
					var message = '<div class="form-control-feedback text-danger">This field is required.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}

				if(qp_form_validate_numeric(value) === true){
					return true;
				}else{
					var message = '<div class="form-control-feedback text-danger">Please enter numbers only.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}
			break;
			
			case "alphanumeric":
				if((required) && (value.trim() == "")){
					var message = '<div class="form-control-feedback text-danger">This field is required.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}

				if(qp_form_validate_alphanumeric(value) == true){
					return true;
				}else{
					var message = '<div class="form-control-feedback text-danger">This field allows only letters numbers, commas and fullstops but NO spaces.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}
				break;
			
			case "alphabet":
				if((required) && (value.trim() == "")){
					var message = '<div class="form-control-feedback text-danger">This field is required.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}

				if(qp_form_validate_alphabet(value) == true){
					return true;
				}else{
					var message = '<div class="form-control-feedback text-danger">This field allows letters only.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}
			break;
			
			case "password":
				if((required) && (value.trim() == "")){
					var message = '<div class="form-control-feedback text-danger">This field is required.</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}

				if(qp_form_validate_password(value, lengthMin, lengthMax) == true){
					return true;
				}else{
					var message = '<div class="form-control-feedback text-danger">' + qp_form_validate_password(value, lengthMin, lengthMax) + '</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}
			break;

			default:
				if((required) && (value.trim() == "")){
					var message = '<div class="form-control-feedback text-danger">This field is required</div>';

					$(fieldID).after(message);
					$(fieldID).addClass('border-danger');
					$(fieldID).closest('.form-group').addClass('has-danger');
					$(fieldID).closest('.form-group').find('label').addClass('text-danger');

					return false;
				}

				return true;
			break;
		}

		/**
		 * qp_form_validate_email handles email validation
		 * @param  {string} email:	enter valid email
		 * @return {boolean}
		 */
		function qp_form_validate_email(email){
			var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return re.test(email);
		}
		
		/**
		 * qp_form_validate_numeric handles numeric validation
		 * @param  {integer} numeric:	enter numbers only
		 * @return {boolean}
		 */
		function qp_form_validate_numeric(numeric){
			var reg = new RegExp("^[0-9]+$");
			return reg.test(numeric);
		}
		
		/**
		 * qp_form_validate_alphanumeric handles text, numbers and space validation
		 * @param  {string} alphanumeric:	enter text, numbers and space only
		 * @return {boolean}
		 */
		function qp_form_validate_alphanumeric(alphanumeric){
			var reg = new RegExp("^[a-zA-Z 0-9,.]+$");
			return reg.test(alphanumeric);
		}
		
		/**
		 * qp_form_validate_alphabet handles text and space
		 * @param  {string} alphabet:	enter text and space
		 * @return {boolean}
		 */
		function qp_form_validate_alphabet(alphabet){
			var reg = new RegExp("^[a-zA-Z ]+$");
			return reg.test(alphabet);
		}

		/**
		 * qp_form_validate_password handles password validation
		 * @param  {string} password:		accepts alphanumeric characters
		 * @param  {integer} lengthMin:		the minimum length the password should be
		 * @param  {integer} lengthMax:		the maximum length the password should be
		 * @return {boolean or string}		returns an error message or the boolean response
		 */
		function qp_form_validate_password(password, lengthMin, lengthMax){
			var passwordLengthStatus = qp_form_validate_stringlength(password, lengthMin, lengthMax);
			if(passwordLengthStatus != true){
				return passwordLengthStatus;
			}else{
				var passwordStatus = qp_form_validate_alphanumeric(password);
				if(passwordStatus == true){
					return true;
				}else{
					var message = "Password field can only contain letters, numbers, commas and fullstops but NO spaces.";
					return message;
				}
			}
		}

		/**
		 * qp_form_validate_stringlength checks the string length
		 * @param  {string} str				accepts any string
		 * @param  {integer} lengthMin:		the minimum length the password should be
		 * @param  {integer} lengthMax:		the maximum length the password should be
		 * @return {boolean or string}		returns an error message or the boolean response
		 */
		function qp_form_validate_stringlength(str, lengthMin, lengthMax){
			var n = str.length;

			if(n < lengthMin){
				var message = "This field must be at least " + lengthMin + " characters long";
				return message;
			}else if(n > lengthMax){
				var message = "This field must not be more than " + lengthMax + " characters long";
				return message;
			}else{
				return true;
			}
		}
	}

	$('#validate').on('click', function(e){

		e.preventDefault();

		var submitForm = true;

		if(qp_form_validation('#email', 'email') !== true){
			submitForm = false;
		}

		if(qp_form_validation('#username', 'alphanumeric') !== true){
			submitForm = false;
		}

		if(qp_form_validation('#password1', 'password') !== true){
			submitForm = false;
		}

		if(qp_form_validation('#birth', 'alphanumeric') !== true){
			submitForm = false;
		}

		if(qp_form_validation('#country', 'alphabet') !== true){
			submitForm = false;
		}

		if(qp_form_validation('#presentation', '', 1, 3, 100) !== true){
			submitForm = false;
		}

		if(submitForm){
			$(this).closest('form').submit();
		}
	});
	
});