
$(function() {

    $('.campaignsteps-row>div').formset({
        // For inline formsets, be sure to set the prefix, as the default prefix
        // ('form') isn't correct.
        // Django appears to generate the prefix from the lowercase plural
        // name of the related model, with camel-case converted to underscores.
        prefix: 'stepmessages',
        addText: 'Add another message',          // Text for the add link
        deleteText: 'Remove this message',            // Text for the delete link
        addCssClass: 'add-row btn btn-primary',          // CSS class applied to the add link
        deleteCssClass: 'delete-row btn btn-danger mb-xl',    // CSS class applied to the delete link
    });


    $('.slider').click(function(e){

    	var that = $(e.target).prev();
    	that.click();
    	console.log('checked:', that.is(":checked"));
    	var url = window.location.href;
    	var data = "active=" + (that.is(":checked") ? 1 : 0);

    	$.get(url+"/active?"+data).done(function(res){
    		$('body').find('.switch_campaign').each(function(ex){
        		if (this !== that){
        			$(this).trigger('click');
        		}
        	});
    	});



    });

    $('.btn-save').click(function(e){
    	e.preventDefault();
    	var that = $(this);
    	var form = that.closest('form');
    	var data = form.serialize();
    	$.post(form.attr('action'), data).done(function(res){
    		console.log('resutl:', res);
    		try{
    			var x = $.parseJSON(res);
    			res = x;
    		}catch(e){
    			console.log('error', e);
    		}
    		var alertbox = $('.alert-box');
    		if (res.ok) {
				var url = window.location.href;
				var search_url = $('#__search_url__').val();
				var network_url = $('#__my_network_url__').val();
				console.log(search_url, network_url)
				url = search_url === undefined?network_url:search_url;
				let text = 'Your message has been saved successfully. Click <a style="color: blue;" href="'+url+'">' +
					'HERE </a> to select search and contacts and start your campaign';
				swal({
				  title: "Congratulations!.",
				  text: text,
				  type: "success",
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Ok",
				  html:　true
				},
				function(isConfirm){
				  if (isConfirm) {

				  }
				});
    			return;
    		}
    		if ( res.error){
    			var html = "";
    			for(var key in  res.error) {
    				console.log('resutl:', key);

    				if (res.error[key][0])
    					html+=  key + ": " + res.error[key];

    			}
    			if (html === ""){
    				$.each( res.error, function( i, obj ) {

        				var key = Object.keys(obj);
        				if (obj[key])
        					html+=  key + ": " + obj[key] ;
        			});
    			}

    			//alertbox.html( html );
    			//alertbox.removeClass('text-success').addClass('text-danger')
    			if (window.location.pathname.indexOf('messenger')>=0) {
    				html = html.replace('connection_', '');
    			}
    			swal("alert!", html, "error");
    		}
    	});
    });

    $("a[data-click='removeCampaign']").click(function(e) {
		e.preventDefault();
		$('#confirm_dialog>div').modal('show');
	});

    $('body').on('click', '#confirm_dialog >div #confirm_button', function(e){
    	var url = window.location.href;
        debugger;
        var camp = url.includes("campaigns")
        if (camp == true ) {
             var redirected = "/campaigns"
        }
        else{
             var redirected = "/messenger"
        }    

    	var data = $('body').find('form[name="campaign"]').serialize();
    	$.post(url+"/delete", data).done(function(res){
    		var accid = $("a[data-click='removeCampaign']").data('accid');
    		var url2 = "/account/"+accid+redirected
    		window.location = url2;
    	});

    });

});