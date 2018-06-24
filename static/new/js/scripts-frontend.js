"use strict";



$(document).ready(function() {
	/* ScrollTo */
	$('a.scrollto').on('click', function(e){
		var targetID = $(this).attr('href');

		var firstCharacter = targetID.slice(0,1);

		if(firstCharacter == '#'){
			$("html, body").animate({
				scrollTop: $(targetID).offset().top
			}, 2000, "easeOutCubic");

			e.preventDefault();
		}
	});


	/* FitVids - Make video width fluid based on parent container width */
	function qp_video_width(element){
		$(element).fitVids();
	}


	/**
	 * DEMO USE ONLY - START
	 * Do not copy the content below when you are building your site.
	 */

	 qp_video_width('#intro-video .modal-content');
});