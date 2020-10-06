/*

imagePopup v1.1 (2014-11-30)

Pop up images.

<http://tipszone.jp/20120719_jquery-image-popup/>

FREE license.

Yasunori Miyamoto
<http://tipszone.jp/>
<mailto:nori@tipszone.jp>

*/
"use strict";

(function($){
	var img_relative_top = -100;
	var img_relative_left = -110;
	var img_margin = 5;

	// Get and set the max z-index
	$.maxZIndex = $.fn.maxZIndex = function(selector){
		var max_z = 0;
		var t;

		$(selector || '*').each(function(){
			t = parseInt($(this).css('z-index'));
			if (max_z < t) { max_z = t; }
		});

		if (!this.jquery) { return max_z; }
		return this.css('z-index', max_z + 1);
	};

	$.fn.setMaxImageSize = function(max_height, max_width){
		if ($.support.msie) {
			this.each(function(){
				var h_ratio = 1, w_ratio = 1;

				var height = $(this).height();
				var width = $(this).width();
				if (max_height < height) { h_ratio = height / max_height; }
				if (max_width < width) { w_ratio = width / max_width; }

				if (1 < h_ratio || 1 < w_ratio) {
					var ratio = Math.max(h_ratio, w_ratio);
					$(this).height(parseInt(height / ratio));
					$(this).width(parseInt(width / ratio));
				}
			});
		};

		return this.css({
			'max-height': max_height,
			'max-width': max_width
		});
	
	
	}
;


	function imagePopup(event) {
		// check horizontal mouseenter position
		var show_right = ((event.pageX - $(window).scrollLeft()) / $(window).width() < 0.65);

		return $('<div class="popup">').css({
			position: 'absolute',
			margin: img_margin,
			padding: 0,
			border: 0
		})
		.maxZIndex()
		.append(
			$('<img>').attr('src', this.href)
			.css({
				border: '1px outset #ccb',
				margin: 0
			})
			.setMaxImageSize($(window).height() * 7 / 10, $(window).width() * 7 / 10)
			.load(function(){
				var this$ = $(this);
				this$.css({'max-height': '', 'max-width': ''})
				.data('original_height', this$.height())
				.data('original_width', this$.width())
				.setMaxImageSize($(window).height() * 7 / 10, $(window).width() * 7 / 10)
				.parent().position({
					my: (show_right ? 'left' : 'right') + ' top',
					of: event,
					offset: (show_right ? img_relative_left : -img_relative_left) + ' ' +
						Math.max(img_relative_top, $(window).scrollTop() + img_margin - event.pageY),
					collision: 'none fit'
				});
		
		
		
			})
			.error(function(){
				$(event.currentTarget).css('text-decoration', 'line-through');
				$(this).parent().css({
					color: 'red',
					border: '1px solid black',
					padding: 5,
					'background-color': 'white'
				}).html('Error');
			})
			.mousewheel(function(event, delta){
				// zoom
				var rate = 1.15;
				// zoom out
				if (delta < 0) { rate = 1 / rate; }

				var this$ = $(this);
				var height = parseInt(this$.height() * rate + 0.5);
				var width = parseInt(this$.width() * rate + 0.5);
				if (Math.min(height, width) < 50) { return false; }
				var parent$ = this$.parent();
				var offset = parent$.offset();
				var cursor_relative_top = -parseInt((event.pageY - offset.top) * rate + 0.5);
				var cursor_relative_left = -parseInt((event.pageX - offset.left) * rate + 0.5);

				this$.css({
					height: height,
					width: width,
					'max-height': '',
					'max-width': ''
				});
				parent$.position({
					my: 'left top',
					of: event,
					offset: cursor_relative_left + ' ' + cursor_relative_top,
					collision: 'none'
				});

				return false;
			})
			.dblclick(function(event){
				var this$ = $(this);
				var parent$ = this$.parent();
				var offset = parent$.offset();
				var original_height = this$.data('original_height');
				var rate = original_height / this$.height();
				var cursor_relative_top = -parseInt((event.pageY - offset.top) * rate + 0.5);
				var cursor_relative_left = -parseInt((event.pageX - offset.left) * rate + 0.5);

				this$.css({
					height: original_height,
					width: this$.data('original_width'),
					'max-height': '',
					'max-width': ''
				});
				parent$.position({
					my: 'left top',
					of: event,
					offset: cursor_relative_left + ' ' + cursor_relative_top,
					collision: 'none'
				});
			})
		)
		.mouseenter(function(){
			event.data['skipLeave'] = true;
		})
		.mouseleave(function(){
			if (!$(this).hasClass('ui-draggable-dragging')) { $(this).remove(); }
		})
		.draggable({cursor: 'move'})
		.insertAfter(this)
		.position({
			my: (show_right ? 'left' : 'right') + ' top',
			of: event,
			offset: (show_right ? img_relative_left : -img_relative_left) + ' ' +
				Math.max(img_relative_top, $(window).scrollTop() + img_margin - event.pageY),
			collision: 'none fit'
		});
		
	}




	$.fn.imagePopup = function(){
		$('a', this).add(this.filter('a')).filter(function(){
			return /\.(?:jpe?g|gif|png|bmp|webp)(?:\?|$)/i.test(this.href);
		}).each(function(){
			var pop = null;
			var status = {};
			
			$(this).bind('click', status, function(event){
				status['skipLeave'] = false;
				pop = imagePopup.call(this, event);
				return false;
			})
			.mouseleave(function(event){
				setTimeout(function(){
					if (!status['skipLeave'] && pop != null) { pop.remove(); }
				}, 70);
			});
		});

		return this;
	};
})(jQuery);
