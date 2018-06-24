$(document).ready(function(){

	// B5B Documentation:
	// All data within the qp_form_mask_input() function are for demo purposes only.
	// You will need to follow the jQuery Mask Plugin documentaion linked below to...
	// ...create your own based on your needs:
	// https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html
	function qp_form_mask_input(){

		if($('.ip_address').length){
			$('.date').mask('00/00/0000');
			$('.time').mask('00:00:00');
			$('.date_time').mask('00/00/0000 00:00:00');
			$('.cep').mask('00000-000');
			$('.phone').mask('0000-0000');
			$('.phone_with_ddd').mask('(00) 0000-0000');
			$('.phone_us').mask('(000) 000-0000');
			$('.mixed').mask('AAA 000-S0S');
			$('.cpf').mask('000.000.000-00', {reverse: true});
			$('.cnpj').mask('00.000.000/0000-00', {reverse: true});
			$('.money').mask('000,000,000,000,000.00', {reverse: true});
			$('.money2').mask("#.##0,00", {reverse: true});
			$('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
				translation: {
					'Z': {
						pattern: /[0-9]/, optional: true
					}
				}
			});
			$('.ip_address').mask('099.099.099.099');
			$('.percent').mask('##0,00%', {reverse: true});
			$('.clear-if-not-match').mask("00/00/0000", {clearIfNotMatch: true});
			$('.placeholder').mask("00/00/0000", {placeholder: "__/__/____"});
			$('.fallback').mask("00r00r0000", {
				translation: {
					'r': {
						pattern: /[\/]/,
						fallback: '/'
					},
					placeholder: "__/__/____"
				}
			});
			$('.selectonfocus').mask("00/00/0000", {selectOnFocus: true});
		}
	}


	function qp_tags_input(){
		/* Input Tags - Color-Coded */
		var cities = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			prefetch: 'assets/plugins/typeahead/json/data-sample-cities.json'
		});
		cities.initialize();

		var elt = $('.input-tags-2');
		elt.tagsinput({
			tagClass: function(item) {
				switch (item.continent) {
					case 'Europe'   : return 'badge badge-primary';
					case 'America'  : return 'badge badge-danger';
					case 'Australia': return 'badge badge-success';
					case 'Africa'   : return 'label label-info';
					case 'Asia'     : return 'badge badge-warning';
				}
			},
			itemValue: 'value',
			itemText: 'text',
			typeaheadjs: {
				name: 'cities',
				displayKey: 'text',
				source: cities.ttAdapter()
			}
		});
		elt.tagsinput('add', { "value": 1 , "text": "Amsterdam"   , "continent": "Europe"    });
		elt.tagsinput('add', { "value": 4 , "text": "Washington"  , "continent": "America"   });
		elt.tagsinput('add', { "value": 7 , "text": "Sydney"      , "continent": "Australia" });
		elt.tagsinput('add', { "value": 10, "text": "Beijing"     , "continent": "Asia"      });
		elt.tagsinput('add', { "value": 13, "text": "Cairo"       , "continent": "Africa"    });
	}


	qp_form_mask_input();
	qp_tags_input();

});