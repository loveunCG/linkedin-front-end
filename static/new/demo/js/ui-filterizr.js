$(document).ready(function(){
	$('.filtr-container').filterizr({
		controlsSelector: '.fltr-controls'
	});
	$('.color-container-1').filterizr({
		controlsSelector: '.color-controls-1'
	});
	$('.color-container-2').filterizr({
		controlsSelector: '.color-controls-2',
		layout: 'sameHeight'
	});
	$('.color-container-3').filterizr({
		controlsSelector: '.color-controls-3',
		layout: 'packed'
	});
	$('.color-container-4').filterizr({
		controlsSelector: '.color-controls-4',
		layout: 'sameWidth'
	});
});