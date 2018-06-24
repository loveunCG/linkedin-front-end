"use strict";



$(document).ready(function() {


	/* Defaults */
	// Timing
	var dynamicDuration = 300; 
	var dynamicDelay = 0;

	// Animate.css Class
	var animateCSSClass = 'fadeInUp';


	/* Window Resize Timer Function */
	var uniqueTimeStamp = new Date().getTime();

	var waitForFinalEvent = (function () {
		var timers = {};
		return function (callback, ms, uniqueId) {
			if (!uniqueId) {
				uniqueId = 'unique id';
			}
			if (timers[uniqueId]) {
				clearTimeout (timers[uniqueId]);
			}
			timers[uniqueId] = setTimeout(callback, ms);
		};
	})();

	/* Misc Chunks of Code */
	function qp_required_misc(){

		/* Dropdown Menu - Submenu */
		$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
			if (!$(this).next().hasClass('show')) {
				$(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
			}

			var subMenu = $(this).next(".dropdown-menu");
			subMenu.toggleClass('show');
			subMenu.prev().toggleClass('show');

			$(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
				$('.dropdown-submenu .show').removeClass("show");
			});

			return false;
		});

		/* Buttons */
		// Gradient Buttons
		$('.btn-gradient').each(function(){
			var thisBtn = $(this);
			var btnContent = thisBtn.html();
			var btnContentNew = '<span class="gradient">' + btnContent + '</span>';

			thisBtn.html(btnContentNew);
		});


		/* Cards */
		// Custom Scrollbar
		qp_add_scrollbar('.card-media-list', 'dark');
		// qp_add_scrollbar('.card-img-overlay', 'dark');

		// Create scroll where needed
		$('.has-scroll').each(function(){
			qp_add_scrollbar($(this), 'dark');
		});

		// Fix card-header button position when necessary
		$('.card-header').each(function(){
			var thisHeader = $(this);

			if(thisHeader.height() > 40){
				thisHeader.find('.header-btn-block').css({'top' : '31px'});
			}
		});


		/* Sidebar */
		// Menu Controls
		var parentLink = 'a.nav-parent';
		if($(parentLink).length){
			$('a.nav-parent').on('click', function(e){

				var clickedLink = $(this);

				if(clickedLink.closest('li').hasClass('open')){
					clickedLink.closest('li').removeClass('open');
					clickedLink.siblings('ul.nav').velocity('slideUp', {
						easing: 'easeOutCubic',
						duration: dynamicDuration,
						delay: dynamicDelay,
						complete:
						function(elements){
							// callback here
							// Close all open children sub-menus
							clickedLink.closest('li').find('li').removeClass('open');
							clickedLink.closest('li').find('ul.nav').removeAttr('style');
						}
					});
				}else{
					// Opens its sub-menu
					clickedLink.closest('li').addClass('open');
					clickedLink.siblings('ul.nav').velocity('slideDown', {
						easing: 'easeOutCubic',
						duration: dynamicDuration,
						delay: dynamicDelay,
						complete:
						function(elements){
							// callback here
						}
					});

					// Closes the sub-menus' and children sub-menus of other menu items in the same ul parent
					clickedLink.closest('li').siblings('li.nav-item.open').find('ul.nav').velocity('slideUp', {
						easing: 'easeOutCubic',
						duration: dynamicDuration,
						delay: dynamicDelay,
						complete:
						function(elements){
							// callback here
							$(this).removeAttr('style');
							$(this).closest('li').removeClass('open');
						}
					});

					// Closes the sub-menus' and children sub-menus of other menu items in other ul parents
					clickedLink.closest('ul').siblings('ul.nav').find('ul.nav').velocity('slideUp', {
						easing: 'easeOutCubic',
						duration: dynamicDuration,
						delay: dynamicDelay,
						complete:
						function(elements){
							// callback here
							$(this).closest('li').removeClass('open');
							$(this).closest('li').removeClass('open');
						}
					});
				}

				e.preventDefault();
			});
		}

		// Menu Scroll
		var sidebarNav = 'nav.sidebar';
		if($(sidebarNav).length){
			var windowHeight = $(window).height();
			
			// Set Height of the Left Column
			$(sidebarNav).height(windowHeight);

			// Destroy old scrollbar if present
			$(sidebarNav).mCustomScrollbar("destroy");

			qp_add_scrollbar('nav.sidebar', 'light');

			// Add Hamburger Menu to .sidebar
			$('.sidebar > .mCustomScrollBox').before('<button class="hamburger hamburger--slider" type="button" data-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle Sidebar"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');

			// On window resize
			$(window).resize(function () {
				waitForFinalEvent(function(){
					var windowHeight = $(window).height();

					// Set Height of the Left Column
					$(sidebarNav).height(windowHeight);

					// Destroy old scrollbar if present
					$(sidebarNav).mCustomScrollbar("destroy");

					// Destroy Hamburger
					$('.sidebar .hamburger').remove();

					// Add new scrollbar
					qp_add_scrollbar('nav.sidebar', 'light');

					// Add Hamburger Menu to .sidebar
					$('.sidebar > .mCustomScrollBox').before('<button class="hamburger hamburger--slider" type="button" data-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle Sidebar"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');

				}, 500, 'RandomUniqueString');
			});
		}

		// Hamburger Menu Controls
		$(document).on('click', 'button.hamburger', function(e){
			var mainNavbarHeight = $('.navbar-sidebar-horizontal').outerHeight();

			$('.sidebar-horizontal.fixed-top').css({'top' : mainNavbarHeight + 'px'});
			qp_add_scrollbar('.sidebar-horizontal.fixed-top', 'light');

			if($('.hamburger').hasClass('is-active')){
				$('.hamburger').removeClass('is-active');
				$('#sidebar').removeClass('open');
				$('.sidebar-horizontal').slideUp().promise().always(function(){
					$(this).removeAttr('style');
				});
			}else{
				$('.hamburger').addClass('is-active');
				$('#sidebar').addClass('open');
				$('.sidebar-horizontal').slideDown();
			}
			e.preventDefault();
		});


		/* Forms */
		// Input Group Highlight Color - Focus/Blur
		$('.input-group .form-control').focus(function(){
			$(this).closest('.input-group').addClass('focus');
		});

		$('.input-group .form-control').blur(function(){
			$(this).closest('.input-group').removeClass('focus');
		});


		/* Tabs & Accordions - Nav Links Dropdown */
		// Fix dropdown menu selection on tabs
		if($('.nav-pills').length || $('.nav-tabs').length){
			$('.nav-pills, .nav-tabs').each(function(){
				var navContainer = $(this);
				navContainer.find('.dropdown-menu .dropdown-item').on('click', function(){
					$(this).siblings().removeClass('show').removeClass('active');
				});
			});
		}


		/* Popover */
		$('[data-toggle="popover"]').popover();


		/* Enable Tooltips */
		$('[data-toggle="tooltip"]').tooltip();


		/* Auto-Links */
		// Allows you to make any element clickable without the affecting the style of the page
		$('[data-qp-link]').on('click', function(e){
			window.location = $(this).data('qp-link');
			e.preventDefault();
		});


		/* Signin, Signup, Forgotten Password */
		// Auto-adjust page height
		var signInLeftColumn = '.signin-left-column';
		if($(signInLeftColumn).length){
			var windowHeight = $(window).height();

			if(windowHeight > 630){
				$(signInLeftColumn).css({'height' : windowHeight + 'px'});
			}

			// On window resize
			$(window).resize(function () {
				waitForFinalEvent(function(){

					var windowHeight = $(window).height();

					if(windowHeight > 630){
						$(signInLeftColumn).css({'height' : windowHeight + 'px'});
					}

				}, 500, 'randomStringForSignupPage');
			});
		}

		// Add background image to the Right column
		var signInRightColumn = '.signin-right-column';
		if($(signInRightColumn).length){

			// Background Image
			if((typeof($(signInRightColumn).data('qp-bg-image')) !== 'undefined') && ($(signInRightColumn).data('qp-bg-image') != '')){
				var backgroundImage = $(signInRightColumn).data('qp-bg-image');

				$(signInRightColumn).css({'background-image' : 'url(assets/img/' + backgroundImage + ')'});
			}
		}


		/* CKEditor */
		var placeholder = '.load-ckeditor';
		if($(placeholder).length){
			$(placeholder).ckeditor();
		}


		/* Prettify */
		if($('.prettyprint').length){
			prettyPrint();
		}


		/* Color Controls */
		// Radio Select
		var customColorControl = $('.custom-color-control.custom-control.custom-radio');
		if(customColorControl.length){

			var count = 1;

			customColorControl.each(function(){
				var thisObj = $(this);
				var color = thisObj.data('qp-color');

				thisObj.on('click', function(){
					$(this).find('.custom-control-input').prop('checked', true);
				});

				// thisObj.find('.custom-control-label').css({'background-color' : color});
				thisObj.addClass('custom-color-control-' + count);

				$('<style>.custom-color-control.custom-radio.custom-color-control-' + count + ' .custom-control-label:before{background-color: ' + color + ';}</style>').appendTo('head');

				count++;
			});
		}


		/* Animate on load */
		qp_animate_css();

		/* Misc */
		// Dropdown Menu - Make full right-column width
		if($('.dropdown-menu-fullscreen').length){
			var rightColumnWidth = $('.right-column').width();

			console.log(rightColumnWidth);

			// Resize the .dropdown-menu-fullscreen
			$('.dropdown-menu-fullscreen').css({'width' : rightColumnWidth + 'px'});

			// Navbar Search - Works for all .nav-items for .dropdown-menu-fullscreen
			$('.dropdown-menu-fullscreen').closest('.nav-item').css({'position' : 'static'});

			// On window resize
			$(window).resize(function () {
				waitForFinalEvent(function(){
					var rightColumnWidth = $('.right-column').width();

					// Resize the .dropdown-menu-fullscreen
					$('.dropdown-menu-fullscreen').css({'width' : rightColumnWidth + 'px'});

				}, 500, uniqueTimeStamp);
			});
		}


		// Add "Sub-menu" Indicator to supmenus of dropdowns (Helps with readability)
		$('.dropdown-menu .dropdown-menu').each(function(){
			var subMenu = $(this);

			subMenu.prepend('<li class="dropdown-header">SUBMENU</li>');
		});

		/* B5B - Temporarily Disabled (Might not be needed) - Start */
		// Dropdown Width on Mobile
		// If browser width is less tha 576 then make dropdown menu of navbar fullscreen width
		// var windowWidth = $(window).width();

		// $('.dropdown-toggle').on('click', function(){
		// 	console.log($(window).width());
		// 	if($(window).width() <= 576){
		// 		$(this).siblings('.dropdown-menu').each(function(){
		// 			if(!$(this).hasClass('dropdown-menu-fullscreen')){
		// 				console.log($(this));
		// 				$(this).removeAttr('style');
		// 				$(this).css({'position' : 'absolute', 'width' : windowWidth + 'px'});
		// 				$(this).closest('.dropdown').css({'position' : 'static'});
		// 			}
		// 		});
		// 	}else{
		// 		$(this).siblings('.dropdown-menu').each(function(){
		// 			if(!$(this).hasClass('dropdown-menu-fullscreen')){
		// 				$(this).removeAttr('style');
		// 				$(this).closest('.dropdown').removeAttr('style');
		// 			}
		// 		});
		// 		// $('.dropdown-menu').removeAttr('style');
		// 		// $('.dropdown-menu').closest('.dropdown').removeAttr('style');
		// 	}
		// });

		// // Reloads the map function on window resize
		// $(window).resize(function () {
		// 	waitForFinalEvent(function(){
		// 		// functions here...
		// 		// $('.dropdown-menu').removeAttr('style');
		// 		// $('.dropdown-menu').closest('.dropdown').removeAttr('style');

		// 		if($(window).width() <= 576){
		// 			$('.dropdown-toggle').on('click', function(){
		// 				var windowWidth = $(window).width();
		// 				$(this).siblings('.dropdown-menu').each(function(){
		// 					if(!$(this).hasClass('dropdown-menu-fullscreen')){
		// 						$(this).css({'position' : 'absolute', 'width' : windowWidth + 'px'});
		// 						$(this).closest('.dropdown').css({'position' : 'static'});
		// 					}
		// 				});
		// 			});
		// 		}else{
		// 			$('.dropdown-toggle').on('click', function(){
		// 				if(!$(this).hasClass('dropdown-menu-fullscreen')){
		// 					$(this).siblings('.dropdown-menu').removeAttr('style');
		// 					$(this).siblings('.dropdown-menu').closest('.dropdown').removeAttr('style');
		// 				}
		// 			});
		// 		}
		// 	}, 500, 'uniqueTimeStamp+345');
		// });
		/* B5B - Temporarily Disabled (Might not be needed) - End */

		// Unknown
		$('[data-toggle=offcanvas]').click(function() {
			$('.row-offcanvas').toggleClass('active');
		});

		// Removes MDB Waves Effect from respective items
		$('.no-waves-effect').removeClass('waves-effect');

		// Add dark waves to navbar
		// $('.navbar-nav > .nav-item > .nav-link').removeClass('waves-light').addClass('waves-dark');

	}

	/* Animate.css - Animation/Transition */
	function qp_animate_css(){

		// If the body class does not prevent animation, then animation occurs.
		// This overrides all animation calls
		if(!$('body').hasClass('no-animation')){

			$('[data-qp-animate-type]').each(function(){

				var mainElement = $(this);

				if(mainElement.visible(true) || mainElement.closest('nav').hasClass('sidebar')){
					load_animation(mainElement);
				}

				$(window).scroll(function() {
					if(mainElement.visible(true)){
						load_animation(mainElement);
					}
				});

				function load_animation(mainElement){
			
					var animationName = '';

					if(typeof(mainElement.data('qp-animate-type')) === 'undefined'){
						var animationName = 'fadeInDown';
					}else{
						var animationName = mainElement.data('qp-animate-type');
					}

					if(typeof(mainElement.data('qp-animate-delay')) === 'undefined'){
						var timeoutDelay = 0;
					}else{
						var timeoutDelay = mainElement.data('qp-animate-delay');
					}

					var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

					if(mainElement.hasClass('invisible')){


						setTimeout(function(){
							mainElement.removeClass('invisible').addClass('animated ' + animationName).one(animationEnd, function(){
								$(this).removeClass(animationName);
								$(this).removeClass('animated');

								// If the element has infinite animation
								$(this).removeClass('infinite');
							});
						}, timeoutDelay);
					}

					if(mainElement.hasClass('invisible-children')){

						mainElement.children().each(function(){

							var thisElement = $(this);

							setTimeout(function(){
								thisElement.addClass('animated ' + animationName).one(animationEnd, function(){
									// Nothing to do after animation ends
								});
							}, timeoutDelay);

							timeoutDelay += 75;
						});
					}

					if(mainElement.hasClass('invisible-children-with-scrollbar')){

						mainElement.children('.mCustomScrollBox').find('.mCSB_container').children().each(function(){

							var thisElement = $(this);

							setTimeout(function(){
								thisElement.addClass('animated ' + animationName).one(animationEnd, function(){
									 // Nothing to do after animation ends
								});
							}, timeoutDelay);

							timeoutDelay += 75;
						});
					}
				}
			});
		}
	}

	/* Hex to RGBA */
	function qp_hexToRgbA(hex, alpha){
		var r = parseInt(hex.slice(1, 3), 16),
		g = parseInt(hex.slice(3, 5), 16),
		b = parseInt(hex.slice(5, 7), 16);

		if(alpha){
			return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
		}else{
			return "rgb(" + r + ", " + g + ", " + b + ")";
		}
	}

	function qp_add_scrollbar(scrollContainer, scrollBarTheme){
		
		// Current Color Preset
		var colorPresetGlobal = $('body').data('color-preset');

		$(scrollContainer).mCustomScrollbar({
			autoHideScrollbar: true,
			scrollbarPosition: 'inside',
			theme: scrollBarTheme,
			autoExpandScrollbar: true,
			scrollInertia: 600,
			mouseWheelPixels: 110,
			mouseWheel: {
				preventDefault: true
			}
		});
	}

	function qp_chart_sizes(chartID){
		// Card Chart Sizes
		var chartWidth = '';
		var chartHeight = '';

		chartWidth = $(chartID).parent().width();


		// Get the chart preset data-height.
		// If not present, then use the height of closest parent of .card-chart
		// If .card-body is smaller than the data-height (responsive fix), then use the height of .card-body
		if(typeof($(chartID).closest('.card-chart').data('chart-height')) === 'undefined'){
			chartHeight = 281;
		}else{
			if(chartWidth < 300){
				chartHeight = 281;
			}else{
				chartHeight = $(chartID).closest('.card-chart').data('chart-height');
			}
		}

		var chartSizes = [chartWidth, chartHeight];

		return chartSizes;
	}

	/**
	 * @chartID					{string}
	 * @maxHeight 				{int}(optional)
	 */
	function qp_line_chart(chartID, maxHeight){
		if($(chartID).length){
			var chartSizes = qp_chart_sizes(chartID);
			var chartWidth = chartSizes[0];
			var chartHeight = chartSizes[1];

			if(typeof(maxHeight) === 'undefined'){
				maxHeight = chartHeight;
			}
			if(maxHeight != chartHeight){
				chartHeight = maxHeight;
			}

			// If there is a date/range dropdown, then enable a click event
			// If not, use another trigger
			var clickedElement = $(chartID).closest('.card').find('.header-btn-block .data-range.dropdown .dropdown-item');
			var triggeredEvent = 'click';

			if(!clickedElement.length){
				var clickedElement = $(chartID);
				var triggeredEvent = 'load';
			}

			clickedElement.on(triggeredEvent, function(e){
				e.preventDefault();

				// If default range is not set, then get the range from the clicked element
				if(triggeredEvent != "load"){
					var range = $(this).attr('href');
				}else{
					// B5B Documentation:
					// Set the default range if no data/range dropdown is present
					var range = 'year';
				}

				// Highlight clicked item as active
				$(this).siblings().removeClass('active');
				$(this).addClass('active');

				/* DEMO DATA - START */
				switch(range){
					case 'today':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM"];
					var dataSet1 = [0, 0, 0, 0, 0, 0, 0, 0, 3, 9, 7, 9, 5, 0, 5, 3, 9, 7, 9, 5, 0, 5, 7, 2];
					var dataSet2 = [0, 0, 3, 5, 0, 2, 7, 0, 9, 5, 0, 5, 3, 0, 2, 7, 0, 9, 5, 0, 5, 0, 5, 3];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;
					
					case 'week':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
					var dataSet1 = [40, 38, 97, 19, 85, 90, 50];
					var dataSet2 = [30, 45, 20, 52, 70, 20, 90];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;

					case 'month':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
					var dataSet1 = [2, 1, 3, 3, 4, 0, 0, 0, 6, 4, 3, 0, 0, 0, 0, 1, 8, 5, 1, 2, 4, 0, 0, 0, 3, 5, 0, 0, 0, 0, 0];
					var dataSet2 = [3, 4, 2, 2, 7, 0, 0, 0, 5, 2, 1, 3, 3, 4, 0, 0, 0, 6, 9, 2, 0, 0, 5, 2, 5, 7, 2, 9, 3, 3, 7];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;
					
					default:
					case 'year':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					var dataSet1 = [2025, 1460, 1492, 1794, 1384, 2122, 2880, 2545, 3908, 4935, 3907, 4937];
					var dataSet2 = [821, 730, 622, 897, 923, 1200, 1402, 1212, 1534, 2100, 1503, 1899];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;
				}
				/* DEMO DATA - END */
			});

			if(triggeredEvent == 'load'){
				clickedElement.trigger(triggeredEvent);
			}else{
				$(chartID).closest('.card').find('.header-btn-block .data-range.dropdown .dropdown-item.active').trigger(triggeredEvent);
			}

			function load_chart(range, xAxisLabels, dataSet1, dataSet2){
				var canvasParent = $(chartID).closest('.card-chart');
				var color1 = canvasParent.data('chart-color-1');
				var color2 = canvasParent.data('chart-color-2');

				var legendLine1 = canvasParent.data('chart-legend-1');
				var legendLine2 = canvasParent.data('chart-legend-2');

				// B5B Documentation:
				// Use these settings if it's called from a '.card-sm'
				// Add more card classes as you wish
				if(canvasParent.closest('.card').hasClass('card-sm')){
					color1 = qp_hexToRgbA(color1, 0.7);
					color2 = qp_hexToRgbA(color2, 0.7);
					var borderWidth = 0;
					var pointRadius = 0;
					var fillLineArea = true;
					var displayLegend = false;
					var hoverInterset = false;
					var xAxisLabelShow = false;
					var yAxisLabelShow = false;

					chartHeight = 82;
					canvasParent.closest('.card-body').css({'padding-left' : '0', 'padding-right' : '0'});

					if(!canvasParent.closest('.card-body').next().length && !canvasParent.next().length){
						canvasParent.closest('.card-body').css({'padding-bottom' : '0', 'position' : 'relative'});
						canvasParent.css({'position' : 'absolute', 'bottom' : '0'});
						chartWidth = canvasParent.closest('.card-body').width();
					}
				}else{
					var borderWidth = 2;
					var pointRadius = 2;
					var fillLineArea = false;
					var displayLegend = true;
					var hoverInterset = true;
					var xAxisLabelShow = true;
					var yAxisLabelShow = true;
				}

				// First remove old chart, then create new one
				canvasParent.empty();

				$('<canvas>').attr({
					id: chartID.substring(1)
				}).css({
					width: chartWidth + 'px',
					height: chartHeight + 'px'
				}).appendTo(canvasParent);

				var ctx = $(chartID);

				var myChart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: xAxisLabels,
						datasets: [{
							label: legendLine1,
							backgroundColor: color1,
							borderColor: color1,
							borderWidth: borderWidth,
							pointRadius: pointRadius,
							data: dataSet1,
							fill: fillLineArea
						}, {
							label: legendLine2,
							backgroundColor: color2,
							borderColor: color2,
							borderWidth: borderWidth,
							pointRadius: pointRadius,
							data:  dataSet2,
							fill: fillLineArea
						}]
					},
					options: {
						responsive: false,
						title:{
							display: false
						},
						tooltips: {
							mode: 'index',
							intersect: false,
						},
						hover: {
							mode: 'nearest',
							intersect: hoverInterset
						},
						legend: {
							display: displayLegend
						},
						scales: {
							xAxes: [{
								display: xAxisLabelShow,
								scaleLabel: {
									display: true,
									labelString: 'Timeframe (' + range + ')'
								}
							}],
							yAxes: [{
								display: yAxisLabelShow,
								scaleLabel: {
									display: true,
									labelString: 'Value'
								}
							}]
						}
					}
				});
			}
		}
	}

	function qp_bar_chart(chartID, chartType, isStacked, maxHeight){
		if($(chartID).length){
			var chartSizes = qp_chart_sizes(chartID);
			var chartWidth = chartSizes[0];
			var chartHeight = chartSizes[1];

			if(typeof(maxHeight) === 'undefined'){
				maxHeight = chartHeight;
			}
			if(maxHeight != chartHeight){
				chartHeight = maxHeight;
			}

			if(typeof(chartType) === 'undefined'){
				chartType = 'bar';
			}
			if(typeof(stacked) === 'undefined'){
				isStacked = false;
			}

			// If there is a date/range dropdown, then enable a click event
			// If not, use another trigger
			var clickedElement = $(chartID).closest('.card').find('.header-btn-block .data-range.dropdown .dropdown-item');
			var triggeredEvent = 'click';

			if(!clickedElement.length){
				var clickedElement = $(chartID);
				var triggeredEvent = 'load';
			}

			clickedElement.on(triggeredEvent, function(e){
				e.preventDefault();
				
				// If default range is not set, then get the range from the clicked element
				if(triggeredEvent != "load"){
					var range = $(this).attr('href');
				}else{
					// B5B Documentation:
					// Set the default range if no data/range dropdown is present
					var range = 'year';
				}

				// Highlight clicked item as active
				$(this).siblings().removeClass('active');
				$(this).addClass('active');

				/* DEMO DATA - START */
				switch(range){
					case 'today':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM"];
					var dataSet1 = [0, 0, 0, 0, 0, 0, 0, 0, 3, 9, 7, 9, 5, 0, 5, 3, 9, 7, 9, 5, 0, 5, 7, 2];
					var dataSet2 = [0, 0, 3, 5, 0, 2, 7, 0, 9, 5, 0, 5, 3, 0, 2, 7, 0, 9, 5, 0, 5, 0, 5, 3];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;
					
					case 'week':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
					var dataSet1 = [40, 38, 97, 19, 85, 90, 50];
					var dataSet2 = [30, 45, 20, 52, 70, 20, 90];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;

					case 'month':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
					var dataSet1 = [2, 1, 3, 3, 4, 0, 0, 0, 6, 4, 3, 0, 0, 0, 0, 1, 8, 5, 1, 2, 4, 0, 0, 0, 3, 5, 0, 0, 0, 0, 0];
					var dataSet2 = [3, 4, 2, 2, 7, 0, 0, 0, 5, 2, 1, 3, 3, 4, 0, 0, 0, 6, 9, 2, 0, 0, 5, 2, 5, 7, 2, 9, 3, 3, 7];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;
					
					default:
					case 'year':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var xAxisLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
					var dataSet1 = [2025, 1460, 1492, -1794, -1384, -2122, 2880, 2545, 2108, 2935, -2907, -2937, 821, 730, 622, -897, -923, -1200, 1402, 1212, 1534, -2100, -1503, -1899];
					var dataSet2 = [821, 730, 622, -897, -923, -1200, 1402, 1212, 1534, 2100, -1503, -1899, 2937, 821, 730, -622, -1492, -1794];

					// Load the chart after all the data has been set
					load_chart(range, xAxisLabels, dataSet1, dataSet2);
					break;
				}
				/* DEMO DATA - END */
			});

			if(triggeredEvent == 'load'){
				clickedElement.trigger(triggeredEvent);
			}else{
				$(chartID).closest('.card').find('.header-btn-block .data-range.dropdown .dropdown-item.active').trigger(triggeredEvent);
			}

			function load_chart(range, xAxisLabels, dataSet1, dataSet2){

				var canvasParent = $(chartID).closest('.card-chart');
				var color1 = canvasParent.data('chart-color-1');
				var color2 = canvasParent.data('chart-color-2');

				var legendLine1 = canvasParent.data('chart-legend-1');
				var legendLine2 = canvasParent.data('chart-legend-2');

				// B5B Documentation:
				// Use these settings if it's called from a '.card-sm'
				// Add more card classes as you wish
				if(canvasParent.closest('.card').hasClass('card-sm')){
					var displayLegend = false;
					var hoverInterset = false;
					var xAxisLabelShow = false;
					var yAxisLabelShow = false;

					chartHeight = 112;
					canvasParent.closest('.card-body').css({'padding-left' : '0', 'padding-right' : '0'});
				}else{
					var displayLegend = true;
					var hoverInterset = true;
					var xAxisLabelShow = true;
					var yAxisLabelShow = true;
				}

				// First remove old chart, then create new one
				canvasParent.empty();

				$('<canvas>').attr({
					id: chartID.substring(1),
					width: chartWidth + 'px',
					height: chartHeight + 'px'
				}).appendTo(canvasParent);

				var ctx = $(chartID);

				var myChart = new Chart(ctx, {
					type: chartType,
					data: {
						labels: xAxisLabels,
						datasets: [{
							label: legendLine1,
							backgroundColor: color1,
							borderColor: color1,
							borderWidth: 2,
							pointRadius: 2,
							data: dataSet1,
							fill: false
						}, {
							label: legendLine2,
							backgroundColor: color2,
							borderColor: color2,
							borderWidth: 2,
							pointRadius: 2,
							data:  dataSet2,
							fill: false
						}]
					},
					options: {
						responsive: false,
						title:{
							display: false
						},
						tooltips: {
							mode: 'index',
							intersect: true,
						},
						hover: {
							mode: 'nearest',
							intersect: hoverInterset
						},
						legend: {
							display: displayLegend
						},
						scales: {
							xAxes: [{
								display: xAxisLabelShow,
								scaleLabel: {
									display: true,
									labelString: 'Timeframe (' + range + ')'
								},
								stacked: isStacked
							}],
							yAxes: [{
								display: yAxisLabelShow,
								scaleLabel: {
									display: true,
									labelString: 'Value'
								},
								stacked: isStacked
							}]
						}
					}
				});
			}
		}
	}

	function qp_doughnut_pie_chart(chartID, chartType, maxWidth){

		// chartType accepts values: 'doughnut' or 'pie'

		if($(chartID).length){
			var chartSizes = qp_chart_sizes(chartID);
			var chartWidth = chartSizes[0];
			var chartHeight = chartSizes[1];

			if(typeof(chartType) === 'undefined'){
				chartType = 'doughnut';
			}

			if(typeof(maxWidth) === 'undefined'){
				maxWidth = chartWidth;
			}
			if(maxWidth != chartWidth){
				chartWidth = maxWidth;
			}

			// This makes sure that the canvas always uses the size of the smaller value (width or height)
			if(chartWidth <= chartHeight){
				chartHeight = chartWidth;
			}else{
				chartWidth = chartHeight;
			}

			// Make width 80% of original size
			chartWidth = chartWidth * 0.8;
			chartHeight = chartHeight * 0.8;

			// If there is a date/range dropdown, then enable a click event
			// If not, use another trigger
			var clickedElement = $(chartID).closest('.card').find('.header-btn-block .data-range.dropdown .dropdown-item');
			var triggeredEvent = 'click';

			if(!clickedElement.length){
				var clickedElement = $(chartID);
				var triggeredEvent = 'load';
				// B5B Documentation:
				// Set the default range if no data/range dropdown is present
				var range = 'year';
			}

			clickedElement.on(triggeredEvent, function(e){
				e.preventDefault();

				// If default range is not set, then get the range from the clicked element
				if(triggeredEvent != "load"){
					var range = $(this).attr('href');
				}

				// Highlight clicked item as active
				$(this).siblings().removeClass('active');
				$(this).addClass('active');

				/* DEMO DATA - START */
				switch(range){
					case 'today':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var dataSet = [21, 21, 17, 5, 6];

					// Load the chart after all the data has been set
					load_chart(range, dataSet);
					break;
					
					case 'week':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var dataSet = [75, 34, 33, 63, 38];

					// Load the chart after all the data has been set
					load_chart(range, dataSet);
					break;

					case 'month':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var dataSet = [398, 925, 241, 127, 463];

					// Load the chart after all the data has been set
					load_chart(range, dataSet);
					break;
					
					default:
					case 'year':
					// B5B Documentation:
					// Use Ajax to pull your own data from the database
					var dataSet = [2241, 1217, 5525, 4363, 3998];

					// Load the chart after all the data has been set
					load_chart(range, dataSet);
					break;
				}
				/* DEMO DATA - END */
			});

			if(triggeredEvent == 'load'){
				clickedElement.trigger(triggeredEvent);
			}else{
				$(chartID).closest('.card').find('.header-btn-block .data-range.dropdown .dropdown-item.active').trigger(triggeredEvent);
			}

			function load_chart(range, dataSet){

				if(chartType == 'doughnut'){
					var cutoutPercentage = 88;
				}else if(chartType == 'polarArea'){
					var cutoutPercentage = 0;
					var areaOpacity = 0.7;
				}else{
					var cutoutPercentage = 0;
				}

				var canvasParent = $(chartID).closest('.card-chart');
				var color1 = qp_hexToRgbA(canvasParent.data('chart-color-1'), areaOpacity);
				var color2 = qp_hexToRgbA(canvasParent.data('chart-color-2'), areaOpacity);
				var color3 = qp_hexToRgbA(canvasParent.data('chart-color-3'), areaOpacity);
				var color4 = qp_hexToRgbA(canvasParent.data('chart-color-4'), areaOpacity);
				var color5 = qp_hexToRgbA(canvasParent.data('chart-color-5'), areaOpacity);

				// Note: Because chartjs 'responsive' option is set, then we have to set the size of the parent container to the chartWidth & chartHeight, since chartjs fills the entire parent container when this option is used
				canvasParent.css({'width' : chartWidth + 'px', 'height' : chartHeight + 'px'});

				// First remove old chart, then create new one
				canvasParent.empty();

				$('<canvas>').attr({
					id: chartID.substring(1),
					width: chartWidth + 'px',
					height: chartHeight + 'px'
				}).appendTo(canvasParent);

				var ctx = $(chartID);

				var myDoughnutChart = new Chart(ctx, {
					type: chartType,
					data: {
						datasets: [{
							data: dataSet,
							backgroundColor: [color1, color2, color3, color4, color5],
							label: 'Traffic Sources'
						}],
						labels: ["Google - Organic", "Google - Paid", "Facebook", "Twitter", "LinkedIn"]
					},
					options: {
						cutoutPercentage: cutoutPercentage,
						responsive: true,
						legend: {
							display: false
						},
						title: {
							display: false
						}
					}
				});
			}
		}
	}

	function qp_dial_chart(chartID){

		if($(chartID).length){
			var color1 = $(chartID).data("chart-color-1");
			var color2 = $(chartID).data("chart-color-2");
			var color3 = $(chartID).data("chart-color-3");
			var color4 = $(chartID).data("chart-color-4");

			var chartSize = $(chartID).height();

			// Set the width of the Chart chartID
			$(chartID).width(chartSize);

			// Set inner text line-height
			$(chartID).find(".percent").css({"line-height": chartSize + "px"});

			$(chartID).easyPieChart({
				barColor: function(percent){
					if(color2 === undefined){
						return color1;
					}else{
						if(percent < 25){
							return color4;
						}else if((percent >= 25) && (percent < 50)){
							return color3;
						}else if((percent >= 50) && (percent < 75)){
							return color2;
						}else{
							return color1;
						}
					}
				},
				size: chartSize,
				lineCap: "round",
				lineWidth: 3,
				scaleColor: "#7A7A7A",
				trackColor: "#E8E8E8",
				animate: 1000,
				onStep: function(from, to, percent) {
					$(this.el).find('.percent').text(Math.round(percent));
				}
			});

			var chart = window.chart = $(chartID).data('easyPieChart');
			$(chartID).siblings('.chart-controls').find('#update-dial-chart').on('click', function(e) {
				chart.update(Math.random() * (90 - 8) + 8);
				e.preventDefault();
			});
		}
	}

	function qp_map_chart(chartID, maxHeight){
		if($(chartID).length){
			function load_chart(){
				var chartSizes = qp_chart_sizes(chartID);
				var chartWidth = chartSizes[0];
				var chartHeight = chartSizes[1];

				if(typeof(maxWidth) === 'undefined'){
					maxHeight = chartHeight;
				}
				if(maxHeight != chartHeight){
					chartHeight = maxHeight;
				}

				var canvasParent = $(chartID).closest('.card-chart');
				var colorSelected = canvasParent.data('chart-color-selected');

				// Note: We have to set the size of the chartID to the chartWidth & chartHeight, since chartjs fills the entire parent container when this option is used
				// First remove it...
				$(chartID).remove();

				// Then create it again, and set its dimensions
				$('<div>').attr({
					id: chartID.substring(1)
				}).css({
					width : chartWidth + 'px',
					height : chartHeight + 'px'})
				.appendTo(canvasParent);

				$(chartID).vectorMap({
					map: 'usa_en',
					backgroundColor: '#FFFFFF',
					hoverOpacity: 0.5,
					enableZoom: true,
					showTooltip: true,
					selectedColor: null,
					hoverColor: null,
					colors: {
						mo: colorSelected,
						fl: colorSelected,
						tx: colorSelected,
						or: colorSelected
					},
					onRegionClick: function(event, code, region){
						event.preventDefault();
					}
				});
			}

			// Loads the actual map function
			load_chart();

			// Reloads the map function on window resize
			$(window).resize(function () {
				waitForFinalEvent(function(){
					// functions here...
					load_chart();
				}, 500, uniqueTimeStamp + 15);
			});
		}
	}

	function qp_task_list(){

		var taskList = '.card-task-list';

		if($(taskList).length){

			if($(taskList).closest('.card').hasClass('card-xs') || $(taskList).closest('.card').hasClass('card-sm') || $(taskList).closest('.card').hasClass('card-md') || $(taskList).closest('.card').hasClass('card-lg')){
				qp_add_scrollbar(taskList, 'dark');
			}

			var taskListItem = taskList + ' .task-list-item .custom-control-label';

			$(document).on('click', taskListItem, function(){

				var checkedStatus = $(this).closest('.custom-control').find('.custom-control-input').is(':checked');

				if(checkedStatus){
					$(this).closest('.custom-control').find('.custom-control-input').prop('checked', false);
				}else{
					$(this).closest('.custom-control').find('.custom-control-input').prop('checked', true);
				}
				
				$(this).closest('.custom-control').toggleClass('active');

				// Update task count
				taskCount();

				// This creates an "anti-active" class which prevents the item from being striked-out
				if($(taskList).hasClass('no-strike-out')){
					$(this).addClass('anti-active');
				}
			});

			if(!$(taskList).hasClass('no-strike-out')){
				$(taskListItem).each(function(){
					var checkedStatus = $(this).closest('.custom-control').find('.custom-control-input').is(':checked');

					// Wrap the checkbox label with a div
					$(this).wrapInner("<div class='custom-control-wrap'></div>");

					if(checkedStatus){
						$(this).closest('.custom-control').addClass('active');
						// $(this).addClass('active');
					}
				});
			}

			// Get the starting task count
			taskCount();

			$(taskList).find(".task-item-controls .show-task").on("click", function(e){
				$(this).closest(".task-list-item").find(".task-item-details").slideToggle(300);
				e.preventDefault();
			});

			// Count Completed & Total Tasks
			function taskCount(addCount){
				if(typeof(addCount) === 'undefined'){
					addCount = 0;
				}
				var tasksCompleted = $(taskListItem).closest('.card-task-list').find(".active").length + addCount;
				var tasksTotal = $(taskListItem).closest('.card-task-list').find(".task-list-item").length;

				$(taskListItem).closest('.card').find(".card-header .task-list-stats .task-list-completed").text(tasksCompleted);
				$(taskListItem).closest('.card').find(".card-header .task-list-stats .task-list-total").text(tasksTotal);

				// Update Progress Bar
				var completionPercentage = (tasksCompleted / tasksTotal) * 100;

				var progressBar = $(taskListItem).closest('.card').find(".card-header .progress-bar");

				progressBar.css({"width": completionPercentage + "%"}).attr("aria-valuenow", completionPercentage);
			}
		}
	}

	function qp_task_manager(){

		var placeholder = ".create-task-block";

		if($(placeholder).length){
			/* Get Predefined User List. This function contains SAMPLE DATA. Please go through it and add your own data. */
			var users = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: 'assets/plugins/typeahead/json/data-sample-users.json' // SAMPLE DATA: You will have to pass data from your database instead
			});
			users.initialize();

			var elt = $(placeholder).find(".input-task-users");
			elt.tagsinput({
				tagClass: 'badge badge-primary',
				itemValue: 'value',
				itemText: 'text',
				typeaheadjs: {
					name: 'users',
					displayKey: 'text',
					source: users.ttAdapter()
				}
			});


			/* Disable "Optional" checkbox when task is set to High or Critical */
			// Critical = 4, High = 3
			
			var taskPriority = $(placeholder).find(".input-task-priority");
			if((taskPriority.val() == 4) || (taskPriority.val() == 3)){
				$(placeholder).find(".input-task-optional").attr("disabled", true);
				$(placeholder).find(".input-task-optional").removeAttr("checked");
			}else{
				$(placeholder).find(".input-task-optional").removeAttr("disabled");
			}

			taskPriority.on("change", function(){
				if((taskPriority.val() == 4) || (taskPriority.val() == 3)){
					$(placeholder).find(".input-task-optional").attr("disabled", true);
					$(placeholder).find(".input-task-optional").removeAttr("checked");

					var optionalTask = $(placeholder + ' .input-task-optional-checkbox.custom-checkbox');
					optionalTask.button('reset');
				}else{
					$(placeholder).find(".input-task-optional").removeAttr("disabled");
				}
			});

			/* Create Task */
			$(".assign-task").on("click", function(){
				var taskTitle = $(this).closest(".create-task-block").find(".input-task-title").val().trim();
				var taskDetails = $(this).closest(".create-task-block").find(".input-task-details").val().replace(/\n/g, '<br \\>').trim();
				if(taskDetails == ""){
					taskDetails = '<em>(no description provided)</em>';
				}
				var taskUsers = $(this).closest(".create-task-block").find(".input-task-users").val().trim();
				var taskUsersObj = $(this).closest(".create-task-block").find(".input-task-users").tagsinput('items');
				var taskOptional = $(this).closest(".create-task-block").find(".input-task-optional").is(":checked");
				var taskPriority = $(this).closest(".create-task-block").find(".input-task-priority").val();

				/* USE AJAX TO CALL YOUR DATABASE/SERVER HERE - START */
				// On success, run the code below
				/* --- RUN THIS CODE - START ---*/
				var taskUsersContent = [];

				for(var n = 0; n < taskUsersObj.length; n++){

					var tempUserName = taskUsersObj[n].text;
					var tempUserImage = taskUsersObj[n].image;

					var tempString = '<a class="assigned-user"><div class="profile-picture assigned-user bg-gradient bg-primary float-right d-flex"><img class="list-thumbnail" src="' + tempUserImage + '" title="' + tempUserName + '" width="30" height="30"></div></a>';

					taskUsersContent.push(tempString);
				};

				taskUsersContent = taskUsersContent.join("");

				if(taskTitle == ""){
					$(this).closest(".create-task-block").find(".input-task-title").focus();
				}else if(taskUsers == ""){
					$(this).closest(".create-task-block").find(".tt-input").focus();
					// elt.tagsinput('add', { "value": 1, "text": "Ken Adams (Auto)", "image": "http://placehold.it/25x25"});
				}else{
					var taskManagerContainer = $(this).closest(".task-manager");
					var taskManagerTaskList = $(this).closest(".task-manager").find(".card-task-list");

					var priorityBadge = "";
					var optionalBadge = "";

					if(taskOptional){
						optionalBadge = '<span class="badge badge-primary">Optional</span>';
					}

					// Critical = 4, High Prority = 3, Normal = 2, Low Priority = 1
					// If priority is either High or Critical, the optional badge will not be displayed
					if((taskPriority === undefined) || (taskPriority === null) || (taskPriority === 2)){
						priorityBadge = "";
					}else if(taskPriority == 1){
						priorityBadge = '<span class="badge badge-info">Low Priority</span> ';
					}else if(taskPriority == 3){
						priorityBadge = '<span class="badge badge-warning">High Priority</span> ';
						optionalBadge = "";
					}else if(taskPriority == 4){
						priorityBadge = '<span class="badge badge-danger">Critical</span> ';
						optionalBadge = "";
					}else{
						priorityBadge = "";
					}

					var newTaskContent = '<li class="task-list-item"><div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input"><label class="custom-control-label">' + priorityBadge + optionalBadge + taskTitle + '</label></div><div class="task-item-details">' + taskDetails + '</div><div class="task-item-controls"><a role="button" class="btn btn-info btn-sm show-task" href="#"><span class="batch-icon batch-icon-arrow-down"></span></a></div><div class="task-item-users">' + taskUsersContent + '</div></li>';

					taskManagerContainer.find(".card-task-list .task-list").prepend(newTaskContent);

					taskManagerTaskList.find(".task-list-item").first().delay(200).animate({"opacity":"1"}, 300, function(){

						$(this).removeAttr('style');

						$(this).find(".task-item-users").attr("data-assigned-users",taskUsers);

						var optionalTask = $(this).find('.custom-checkbox');

						// optionalTask.on('click', function(){
						// 	$(this).button('toggle');
						// });

						$(this).find(".task-item-controls .show-task").on("click", function(e){
							$(this).closest(".task-list-item").find(".task-item-details").slideToggle(300);
							e.preventDefault();
						});

						if(taskManagerTaskList.hasClass('no-strike-out')){
							$(this).find('.custom-checkbox').addClass('anti-active');
						}

						taskCount();
					});
					
					// // Update Count
					// taskCount();

					// Finally, clear form and prep for next task
					$(this).closest(".create-task-block").find(".input-task-title").val("");
					$(this).closest(".create-task-block").find(".input-task-details").val("");
				}
				/* --- RUN THIS CODE - END ---*/
				/* USE AJAX TO CALL YOUR DATABASE/SERVER HERE - END */
			});

			/* Delete Task */
			$('#delete-task').on('click', function(e){
				e.preventDefault();

				$(this).closest('.card').find('.card-task-list .task-list .task-list-item .custom-checkbox.active').closest('.task-list-item').velocity('slideUp', {
					easing: 'easeOutCubic',
					duration: dynamicDuration,
					delay: dynamicDelay,
					complete:
					function(elements){
						$(this).remove();

						taskCount();
					}
				});
			});

			// Count Completed & Total Tasks
			function taskCount(){
				var taskManagerTaskList = $(".task-manager .card-task-list");
				var tasksTotal = taskManagerTaskList.find(".task-list-item").length;

				taskManagerTaskList.siblings('.card-header').find(".task-list-stats .task-list-total").text(tasksTotal);
			}
		}
	}

	function qp_timeline(){

		var timelineContainer = '.timeline';

		if($(timelineContainer).length){
			$(timelineContainer).each(function(){
				$(this).timelify({
					animRight: "fadeInRight",
					animLeft: "fadeInLeft",
					animCenter: "fadeInUp"
				});
			});
		}
	}

	function qp_calendar(){

		var calendarContainer = '#calendar';

		if($(calendarContainer).length){

			/* Update the preview text */
			$('#input-new-event').on('keyup input', function(){
				// console.log($('#input-new-event').val());
				$('#preview-event-name').text($('#input-new-event').val());
			});

			/* Set Event Color In Dropdown List */
			$(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item .legend-block-color-box, .calendar-controls .available-events .fc-event .legend-block-item .legend-block-color-box").each(function(){

				// Set variables 
				var eventColor = $(this).data("event-color");
				var highlightColor = "highlight-color-" + eventColor;
				var bgColor = "highlight-color-" + eventColor;

				// Set Dropdown Color
				$(this).addClass(bgColor);
			});

			/* Create Event */
			$("#add-available-event").on("click", function(){
				// Set variables
				var eventColorActive = $(this).siblings(".dropdown-menu").find(".legend-block-item.active .legend-block-color-box").data("event-color");
				var eventName = $(this).parent().siblings("#input-new-event").val().trim();
				$(this).parent().siblings("#input-new-event").val("");

				// Actual event creation
				if(eventName != ""){

					var newEventContent = "<div class='fc-event' style='opacity:0;'><div class='legend-block-item'><div class='legend-block-color'><div class='legend-block-color-box highlight-color-" + eventColorActive + "' data-event-color='" + eventColorActive + "'><i class='batch-icon batch-icon-droplet'></i></div></div><div class='legend-block-text'>" + eventName + "</div></div></div>";


					$(this).closest(".calendar-controls").find(".available-events .event-list").prepend(newEventContent);

					$(this).closest(".calendar-controls").find(".available-events .fc-event").first().delay(200).animate({"opacity":"1"}, 300);

					$(this).closest(".card-body").find('.calendar-controls .fc-event').each(function(){

						var thisEventColor = $(this).find(".legend-block-color-box").data("event-color");

						// create an Event Object
				        // it doesn't need to have a start or end
				        var eventObject = {
				            title: $.trim($(this).text()), // use the element's text as the event title
							className: "highlight-color-" + thisEventColor, // use the element's text as the event title
						};

				        // store the Event Object in the DOM element so we can get to it later
				        $(this).data('event', eventObject);

				        // make the event draggable using jQuery UI
				        $(this).draggable({
				        	zIndex: 999,
				            revert: true, // will cause the event to go back to its
				            revertDuration: 0 //  original position after the drag
				        });
				    });

					// Return text to default
				    $('#preview-event-name').text('Your Event Name');

				}else{
					$("#input-new-event").focus();
				}
			});

			/* Call Functions getActiveColor() */
			// Set Event Colors
			getActiveColor();

			/* Set Active Icon Color */
			/**
			 * getActiveColor handles the selected colors
			 */
			 function getActiveColor(){
			 	var eventColorActive = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item.active .legend-block-color-box").data("event-color");

				// Set data-event-color. Then create the highlight class
				var theButton = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-toggle");
				var colorIndicator = $('.event-preview-item .legend-block-color-box');
				// theButton.attr("data-event-color",eventColorActive);
				theButton.addClass("highlight-color-" + eventColorActive);
				colorIndicator.addClass("highlight-color-" + eventColorActive);

				// Change the active icon color on click
				var listItem = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item");

				listItem.on("click", function(){

					var newEventColor = $(this).find(".legend-block-color-box").data("event-color");

					var regex = new RegExp('\\b' + 'highlight-color-' + '.+?\\b', 'g');
					theButton[0].className = theButton[0].className.replace(regex, '');

					theButton.addClass("highlight-color-" + newEventColor);
					colorIndicator.removeAttr('class').addClass("legend-block-color-box highlight-color-" + newEventColor);

					// Remove active class from siblings then add to this item
					$(this).siblings().removeClass("active");
					$(this).addClass('active');
					$("#input-new-event").focus();
				});
			}

			/* Initialize the external events */
			$(calendarContainer).closest(".card-body").find('.calendar-controls .fc-event').each(function() {

				var thisEventColor = $(this).find(".legend-block-color-box").data("event-color");

				// store data so the calendar knows to render an event upon drop
				$(this).data('event', {
					title: $.trim($(this).text()), // use the element's text as the event title
					className: "highlight-color-" + thisEventColor, // use the element's text as the event title
					stick: true // maintain when user navigates (see docs on the renderEvent method)
				});

				// make the event draggable using jQuery UI
				$(this).draggable({
					zIndex: 999,
					revert: true,      // will cause the event to go back to its
					revertDuration: 0  //  original position after the drag
				});

			});

			/* Initialize the calendar */
			$(calendarContainer).fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				themeSystem: 'bootstrap3',
				defaultDate: '2017-11-12',
				editable: true,
				droppable: true, // this allows things to be dropped onto the calendar
				eventLimit: true, // allow "more" link when too many events
				events: [
				{
					title: 'All Day Event',
					start: '2017-11-01',
					className: "highlight-color-red"
				},
				{
					title: 'Long Event',
					start: '2017-11-07',
					end: '2017-11-10',
					className: "highlight-color-yellow"
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2017-11-09T16:00:00',
					color: "#ff0097"
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2017-11-16T16:00:00',
					className: "highlight-color-purple"
				},
				{
					title: 'Conference',
					start: '2017-11-11',
					end: '2017-11-13',
					className: "highlight-color-green"
				},
				{
					title: 'Meeting',
					start: '2017-11-12T10:30:00',
					end: '2017-11-12T12:30:00',
					className: "highlight-color-green"
				},
				{
					title: 'Lunch',
					start: '2017-11-12T12:00:00',
					color: "#6ec06e"
				},
				{
					title: 'Meeting',
					start: '2017-11-12T14:30:00',
					className: "highlight-color-red"
				},
				{
					title: 'Happy Hour',
					start: '2017-11-12T17:30:00',
					className: "highlight-color-red"
				},
				{
					title: 'Dinner',
					start: '2017-11-12T20:00:00',
					className: "highlight-color-blue"
				},
				{
					title: 'Birthday Party',
					start: '2017-11-13T07:00:00'
				},
				{
					title: 'Click for Google',
					url: 'https://base5builder.com/',
					start: '2017-11-28'
				}
				],
				drop: function() {
					$(this).remove();
				},
				eventAfterAllRender: function() {
					$(calendarContainer).find('.glyphicon.glyphicon-chevron-right').removeAttr('class').addClass('batch-icon batch-icon-arrow-right');
					$(calendarContainer).find('.glyphicon.glyphicon-chevron-left').removeAttr('class').addClass('batch-icon batch-icon-arrow-left');
				}
			});
		}
	}

	function qp_mailbox_list(){

		var placeholder = '.mailbox-email-list';

		if($(placeholder).length){

			// First clear all checkboxes on page load
			$(placeholder + ' .email-item-checkbox .custom-control-input').removeAttr('checked');

			/* Select All Feature */
			var selectAll = $(placeholder + ' .email-select-all .custom-checkbox');

			selectAll.on('click', function(){

				if($(this).hasClass('active')){
					$(this).find('.custom-control-input').removeAttr('checked');
					$(placeholder + ' .email-item-checkbox .custom-control-input').removeAttr('checked');
					$(this).removeClass('active');

					// Then disable the menu controls
					$(placeholder + ' .mailbox-control-group .btn').addClass('disabled');
					$(placeholder + ' tr').removeClass("highlighted");
				}else{
					$(this).find('.custom-control-input').attr('checked', 'checked');
					$(placeholder + ' .email-item-checkbox .custom-control-input').attr('checked', 'checked');
					$(this).addClass('active');

					// Then enable the menu controls
					$(placeholder + ' .mailbox-control-group .btn').removeClass('disabled');
					$(placeholder + ' tr').addClass("highlighted");
				}

				return false;
			});

			// Individual Checkbox
			$(placeholder + ' .email-item-checkbox').on('click', function(){
				var thisCheckbox = $(this);

				var checkedCount = 0;

				if(thisCheckbox.find('.custom-control-input').is(':checked')){
					thisCheckbox.find('.custom-control-input').removeAttr('checked');
					thisCheckbox.closest('tr').removeClass("highlighted");

					// Then disable the menu controls
					thisCheckbox.closest('tr').siblings('tr').each(function(){
						if($(this).find('.custom-control-input').is(':checked')){
							checkedCount++;
						}
					});

					if(checkedCount < 1){
						$(placeholder + ' .mailbox-control-group .btn').addClass('disabled');
					}

				}else{
					thisCheckbox.find('.custom-control-input').attr('checked', 'checked');
					thisCheckbox.closest('tr').addClass("highlighted");

					// Then enable the menu controls
					$(placeholder + ' .mailbox-control-group .btn').removeClass('disabled');
				}
				return false;
			});

			/* B5B Documentation: Control Actions - You will have to connect your Server and Database to these code chunks - Start */

			// Refresh Email
			$(".email-refresh").on("click", function(e){
				// B5B Documentation:
				// Use Ajax to pull your own data from the database
				// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
				// B5B Documentation: End

				location.reload();
				e.preventDefault();
			});

			// Mark Read
			$(".email-mark-read").on("click", function(e){
				// B5B Documentation:
				// Use Ajax to pull your own data from the database
				// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
				// B5B Documentation: End

				$(".mailbox-email-list tr").each(function(){
					if($(this).hasClass('email-status-unread') && $(this).find('.email-checkbox .custom-control-input').is(':checked')){
						$(this).removeClass("email-status-unread");
					}else if(!$(this).hasClass('email-status-unread') && $(this).find('.email-checkbox .custom-control-input').is(':checked')){
						$(this).addClass("email-status-unread");
					}
				});

				// After mark as read, then change the button to mark as unread and allow the person to click the button again. Maybe just change the icon to something else
				e.preventDefault();
			});

			// Delete Email
			$(".email-delete").on("click", function(e){
				// B5B Documentation:
				// Use Ajax to pull your own data from the database
				// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
				// B5B Documentation: End

				$(".mailbox-email-list tr").each(function(){
					if($(this).find('.email-checkbox .custom-control-input').is(':checked')){
						// $(this).removeClass("email-status-unread");

						$(this).velocity('slideUp', {
							easing: 'easeOutCubic',
							duration: dynamicDuration,
							delay: dynamicDelay,
							complete:
							function(elements){
								// callback here
								$(this).remove();
							}
						});
					}
				});

				$(".alert").remove();

				var messageDeleteText = '<strong>Deleted!</strong> Email(s) deleted.';

				var messageDelete = '<div class="alert alert-success alert-dismissable" style="opacity:0;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + messageDeleteText + '</div>';

				$(".mailbox-controls").after(messageDelete);
				$(".alert").animate({"opacity":1}, 300);
				$(".email-mark-read, .email-mark-important, .email-mark-junk, .email-delete").addClass("disabled");

				selectAll.find('.custom-control-input').removeAttr('checked');

				e.preventDefault();
			});

			// Mark as Junk
			$(".email-mark-junk").on("click", function(e){
				// B5B Documentation:
				// Use Ajax to pull your own data from the database
				// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
				// B5B Documentation: End

				$(".mailbox-email-list tr").each(function(){
					if($(this).find('.email-checkbox .custom-control-input').is(':checked')){
						// $(this).removeClass("email-status-unread");

						$(this).velocity('slideUp', {
							easing: 'easeOutCubic',
							duration: dynamicDuration,
							delay: dynamicDelay,
							complete:
							function(elements){
								// callback here
								$(this).remove();
							}
						});
					}
				});

				$(".alert").remove();

				var messageJunkText = '<strong>Moved!</strong> Email(s) have been moved to the Junk Folder.';

				var messageJunk = '<div class="alert alert-success alert-dismissable" style="opacity:0;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + messageJunkText + '</div>';

				$(".mailbox-controls").after(messageJunk);
				$(".alert").animate({"opacity":1}, 300);
				$(".email-mark-read, .email-mark-important, .email-mark-junk, .email-delete").addClass("disabled");

				selectAll.find('.custom-control-input').removeAttr('checked');

				e.preventDefault();
			});

			/* Control Actions - You will have to connect your Server and Database to these code chunks - End */

			/* Individual Email Features */
			$(".mailbox-email-list tr").each(function(){

				/* Star Email Feature */
				$(this).find(".email-star").on("click", function(){
					$(this).find(".email-star-status").toggleClass("checked");
				});

				/* Get and Set Email URL */
				var emailURL = $(this).data("email-url");

				$(this).find(".email-sender, .email-subject, .email-datetime").on("click", function(){
					window.location.href = emailURL;
				});
			});
		}
	}

	function qp_mailbox_message_view(){
		if($("#show-others").length){
			$("#show-others").on("click", function(e){
				$(".message-recepient-others").slideToggle(300);
				e.preventDefault();
			});
		}
	}

	function qp_mailbox_message_compose(){

		var placeholder = $('.email-recepient');

		if(placeholder.length){

			/* Handles Email Input */
			placeholder.each(function(e){

				var placeholderObj = $(this);
				var itemExists = false;

				var emails = {};

				emails["email" + e] = new Bloodhound({
					datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					prefetch: {
						url: 'assets/plugins/typeahead/json/data-sample-emails.json'
					}
				});

				emails["email" + e].initialize();

				placeholderObj.tagsinput({
					// NOT TO SELF: BEcause itemValue and itemText are set, you cannot add "free texts" that don't exist is the json...
					// Need solution
					tagClass: function(item) {

						if(placeholderObj.hasClass("email-recepient-main")){
							return 'badge badge-success';
						}else if(placeholderObj.hasClass("email-recepient-cc")){
							return 'badge badge-primary';
						}else if(placeholderObj.hasClass("email-recepient-bcc")){
							return 'badge badge-secondary';
						}else{
							return 'badge badge-info';
						}
					},
					itemValue: function(item){
						return item.value;
					},
					itemText: function(item){
						if(item.text == item.email){
							return item.email;
						}else{
							return item.text + " (" + item.email + ")";
						}
					},
					typeaheadjs: {
						name: 'emails',
						displayKey: 'text',
						source: emails["email" + e].ttAdapter()
					}
				});

				placeholderObj.on('itemAdded', function(event){
					itemExists = 1;
				});

				if(!itemExists){
					placeholderObj.siblings(".bootstrap-tagsinput").find('input.tt-input').bind("enterKey",function(e){

						var newEmail = $(this).val();
						var isValidEmail = qp_form_validation(newEmail, "email");

						if($(this).val().trim() != ""){
							if(isValidEmail == true){
								// dynamicID is for DEMO PURPOSES ONLY. You will have to use the ID generated by your Database or Server,
								// so you don't wipe out othe email addresses.
								var dynamicID = placeholderObj.siblings(".bootstrap-tagsinput").find(".tag").length + 1000;

								placeholderObj.tagsinput('add', {"value": dynamicID, "text": newEmail, "email": newEmail});
								$(this).val('');

								placeholderObj.siblings(".bootstrap-tagsinput").find(".tag").last().removeAttr("class").addClass("tag label label-default");

								placeholderObj.parent().find(".help-block.text-danger").fadeOut(300, function(){
									$(this).remove();
								});
							}else{
								// display error message
								placeholderObj.parent().find(".help-block.text-danger").remove();

								var errorMessage = '<div class="help-block text-danger" style="display:none;">' + isValidEmail + '</div>';

								placeholderObj.parent().append(errorMessage);
								placeholderObj.parent().find(".help-block.text-danger").fadeIn(300);
							}
						}
					});
					placeholderObj.siblings(".bootstrap-tagsinput").find('input.tt-input').keydown(function(e){
						if(e.keyCode == 13){
							$(this).trigger("enterKey");
							e.preventDefault();
						}
					});
				}
			});

			// Bug fix: Removes duplicate email from Tags Input's input field when field is no longer in focus
			$("input.tt-input, input.tt-hint").on("blur", function(){
				$("input.tt-input, input.tt-hint").val("");
			});

			// DEMO ONLY: Delete on production site - Start
			$("#email-recepient-main").tagsinput('add', {"value": 5, "text": "Teal'c Jafar", "email": "tealc@example.com"});
			$("#email-recepient-cc").tagsinput('add', {"value": 2, "text": "Samantha Carter", "email": "samantha@example.com"});
			$("#email-recepient-cc").tagsinput('add', {"value": 4, "text": "Danielle Jackson", "email": "danielle@example.com"});
			$("#email-recepient-bcc").tagsinput('add', {"value": 6, "text": "George Hammond", "email": "george@example.com"});
			$("#email-recepient-bcc").tagsinput('add', {"value": 3, "text": "Jack O'Neill", "email": "jack@example.com"});
			// DEMO ONLY: Delete on production site - End

			// Fix width on Tags Input field
			$("input.tt-input, input.tt-hint").css({"width":"auto"});

			/* Handles Show/Hide Cc/Bcc */
			$("#add-cc").on("click", function(e){
				$(".email-recepient-cc-container").slideToggle(300);
				$(this).fadeToggle(300);
				e.preventDefault();
			});
			$("#remove-cc").on("click", function(e){
				$(".email-recepient-cc-container").slideToggle(300);
				$(".email-recepient-cc").tagsinput('removeAll');
				$("#add-cc").fadeToggle(300);
				e.preventDefault();
			});

			$("#add-bcc").on("click", function(e){
				$(".email-recepient-bcc-container").slideToggle(300);
				$(this).fadeToggle(300);
				e.preventDefault();
			});
			$("#remove-bcc").on("click", function(e){
				$(".email-recepient-bcc-container").slideToggle(300);
				$(".email-recepient-bcc").tagsinput('removeAll');
				$("#add-bcc").fadeToggle(300);
				e.preventDefault();
			});

			/* Handles Email Body */
			// CKEditor
			// CKEditor is automatically loaded when the 'load-ckeditor' class is used

			/* Handles Email Sending */
			
			$("#send-email").on("click", function(e){
				
				e.preventDefault();

				// B5B Documentation:
				// The variables avalable once you press "send" are at the end of this function
				// Use them in creating your email app

				// B5B Documentation:
				// IMPORTANT: Please read the documentation concerning Bootstrap Tags Input in order to get the data in the way you need it
				var emailsMainObj = $("#email-recepient-main").tagsinput('items');
				var emailsCcObj = $("#email-recepient-cc").tagsinput('items');
				var emailsBccObj = $("#email-recepient-bcc").tagsinput('items');
				var emailsMain = [];
				var emailsCc = [];
				var emailsBcc = [];
				var emailSubject = $("#email-subject").val().trim();

				if(emailsMainObj == ""){
					$(".alert").remove();

					var errorMessage = '<div class="alert alert-danger alert-dismissable text-left" style="display:none;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><strong>ERROR (DEMO ONLY)</strong><br /><br />The "To" field cannot be empty</div>';

					$(".mailbox-controls").after(errorMessage);
					$(".mailbox-controls").next().fadeIn(300);
				}else if(emailSubject == ""){
					$(".alert").remove();

					var errorMessage = '<div class="alert alert-danger alert-dismissable text-left" style="display:none;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><strong>ERROR (DEMO ONLY)</strong><br /><br />The "Subject" field cannot be empty</div>';

					$(".mailbox-controls").after(errorMessage);
					$(".mailbox-controls").next().fadeIn(300);
				}else{
					$(".alert").remove();
					
					// DEMO ONLY: The code below only collects the data from the email form and displays it for demo purposes only. You will have to alter it and connect your Database and Server in order to store the data.
					
					for(var i = 0; i < emailsMainObj.length; i++){
						emailsMain.push(emailsMainObj[i].email);
					};
					var emailsMainRecepient = "<strong>To:</strong> " + emailsMain.toString() + "<br />";


					for(var i = 0; i < emailsCcObj.length; i++){
						emailsCc.push(emailsCcObj[i].email);
					};
					var emailsCcText = "<strong>Cc:</strong> " + emailsCc.toString() + "<br />";


					for(var i = 0; i < emailsBccObj.length; i++){
						emailsBcc.push(emailsBccObj[i].email);
					};
					var emailsBccText = "<strong>Bcc:</strong> " + emailsBcc.toString() + "<br />";

					// Main Message Content
					var emailContent = $("#email-body").html();

					var successMessage = '<div class="alert alert-success alert-dismissable text-left" style="display:none;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button><strong>MESSAGE SENT (DEMO ONLY)</strong><br /><br />' + emailsMainRecepient + emailsCcText + emailsBccText + '</div>';

					$(".mailbox-controls").eq(0).after(successMessage);
					$(".mailbox-controls").next().fadeIn(300);

					// B5B Documentation:
					// The following variables contain the output once you click "send"
					// Use them in creating your email app
					//
					// emailsMainRecepient : The main recepients of the emails
					// emailsCcText : The CC emails
					// emailsBccText : The BCC emails
					// emailContent : The body of the email
				}
			});
		}
	}

	function qp_datatables(){

		// All datatables must have the class ".datatables" added to their table tag
		var placeholder = '.table-datatable';

		if($(placeholder).length){
			$(placeholder).each(function(){
				$(this).DataTable();
			});
		}
	}

	function qp_form_wizard(){
		var thisForm = '#rootwizard-1';

		if($(thisForm).length){
			// Prevent page from jumping when +
			$('.pager li a, .pager li span').on('click', function(e){
				e.preventDefault();
			});

			var wizardStagesTotal = $(thisForm + ' .tab-pane').length;
			
			$(thisForm).bootstrapWizard({onNext: function(tab, navigation, index) {

				// Note: index is the next frame not the current one
				if(index == 1) {
					if(qp_form_validation('#wizard-stage-1 .wizard-stage-1-username', 'alphanumeric') !== true){
						return false;
					}
					if(qp_form_validation('#wizard-stage-1 .wizard-stage-1-email', 'email') !== true){
						return false;
					}
					if(qp_form_validation('#wizard-stage-1 .wizard-stage-1-password', 'password') !== true){
						return false;
					}

					// $('#tab1').removeClass('active');
					// $('#tab2').addClass('active');
				}

				if(index == 2){
					$(".form-wizard-review-block").html("");
					$(".form-wizard-review-block").append("<p><strong>Username:</strong> " + $(".wizard-stage-1-username").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>Email:</strong> " + $(".wizard-stage-1-email").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>password:</strong> *******</p>");
					$(".form-wizard-review-block").append("<p><strong>Telephone:</strong> " + $(".wizard-stage-2-optional-1").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>Your Address:</strong> " + $(".wizard-stage-2-optional-2").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>Write something about yourself:</strong> " + $(".wizard-stage-2-optional-3").val() + "</p>");

					// $('#tab2').removeClass('active');
					// $('#tab3').addClass('active');
				}

				if(index <= wizardStagesTotal){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
				}

			}, onPrevious: function(tab, navigation, index) {
				// Note: index is the previous frame not the current one
				if(index !== -1){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
				}
			}, onTabShow: function(tab, navigation, index) {
				// Update Progress Bar
				var total = navigation.find('li').length;
				var current = index + 1;
				var completionPercentage = (current / total) * 100;

				var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");

				progressBar.css({"width": completionPercentage + "%"}).attr("aria-valuenow", completionPercentage);
			}, onTabClick: function(tab, navigation, index){
				return false;
			}});
		}
	}


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

		$(fieldID).closest('form').find('*').removeClass('border-danger');
		$(fieldID).closest('form').find('*').removeClass('has-danger');
		$(fieldID).closest('form').find('*').removeClass('text-danger');

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


	function qp_gallery(galleryClass){
		if($(galleryClass).length){
			baguetteBox.run(galleryClass, {
				fullScreen : false,
				// Add other custom options here
			});
		}
	}

	/**
	 * REQUIRED FUNCTIONS - START
	 */
	
	// DO NOT REMOVE THIS!!!
	qp_required_misc();


	/* Resize certain elements on window resize */
	// Copy the functions loaded above and paste them below. Only works for certain functions
	// Line Charts functions should be copied here too
	$(window).resize(function () {
		waitForFinalEvent(function(){
			// functions here...
			
		}, 500, 'thisstringisunsdsaique');
	});

	/* REQUIRED FUNCTIONS - END */



	/**
	 * DEMO USE ONLY - START
	 * Do not copy the content below when you are building your site.
	 */
	qp_line_chart('#sales-overview');
	qp_doughnut_pie_chart('#traffic-source');

	qp_map_chart('#customer-location');

	qp_bar_chart('#profit-loss');
	qp_line_chart('#database-load');

	qp_task_list();

	qp_timeline();

	qp_calendar();

	qp_task_manager();

	qp_mailbox_list();
	qp_mailbox_message_view();
	qp_mailbox_message_compose();

	qp_datatables();

	qp_form_validation();

	qp_form_wizard();

	qp_dial_chart('#epc-demo-1');
	qp_dial_chart('#epc-demo-2');
	qp_dial_chart('#epc-demo-3');
	qp_dial_chart('#epc-demo-4');
	qp_dial_chart('#epc-demo-5');
	qp_dial_chart('#epc-demo-6');

	// ecommerce-dashboard.html
	qp_bar_chart('#average-order-value', 'bar', true);
	qp_map_chart('#most-active-salesforce');

	// ui-charts.html
	qp_line_chart('#demo-line-chart');
	qp_bar_chart('#demo-bar-chart');
	qp_bar_chart('#demo-stacked-chart');
	qp_bar_chart('#demo-horizontal-chart', 'horizontalBar', true);
	qp_doughnut_pie_chart('#demo-doughnut-chart');
	qp_doughnut_pie_chart('#demo-pie-chart', 'pie');
	qp_doughnut_pie_chart('#demo-radar-chart', 'polarArea');

	qp_gallery('.qp-gallery-one');
	qp_gallery('.qp-gallery-two');

	/* Resize certain elements on window resize */
	// Copy the functions loaded above and paste them below. Only works for certain functions
	$(window).resize(function () {
		waitForFinalEvent(function(){
			// functions here...
			qp_line_chart('#sales-overview');
			qp_line_chart('#database-load');

			qp_bar_chart('#profit-loss');

			// ecommerce-dashboard.html
			qp_bar_chart('#average-order-value', 'bar', true);

			// ui-charts.html
			qp_line_chart('#demo-line-chart');
			qp_bar_chart('#demo-bar-chart');
			qp_bar_chart('#demo-stacked-chart');
			qp_bar_chart('#demo-horizontal-chart', 'horizontalBar', true);
		}, 500, 'thisstringisuniquedemo');
	});

	/* DEMO CALLS - END */
});