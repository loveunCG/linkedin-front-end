$(function() {
	$('.bot-status').click(function(e){
		e.preventDefault();
		var that = $(this);
		var url = that.data('log');
		console.log('url:', url);
		
		$.get(url).done(function(res){
			console.log('res:', res);
			$('#logModal .modal-body').html(res.data)
			$('#logModal').modal('show');
		});
	});
	var checkBot = function(){
		$('.bot-status').each(function(index){
			
			var that = $(this);
			var url = that.attr('href');
			
			$.get(url).done(function(res){
				console.log('res:', res);
				if(res.data){
					that.addClass('btn-success')
				}else{
					that.addClass('btn-warning')
				}
			});
		});
	};
	
	
	setTimeout(function(){
		checkBot();
		
	}, 2000);
	
	
});