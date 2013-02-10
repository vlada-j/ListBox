//*******************************************************************************************
// ListBox JS -------------------------------------------------------------------------------
//  -----------------------------------------------------------------------------------------
jQuery.fn.ListBox=function(options){

	// Default plugin settings
	settings=jQuery.extend({
		orientation:	'horizontal',	// value: horizontal | vertical
		prevButton:		'#prev',
		nextButton:		'#next',
		step:			0,
		duration:		500,
		easing:			"swing"			// "swing" or "linear"
	}, options);


	// Create for each... -------------------------------------------------------------------
	this.each(function(i, one) {

		// Setting variables...
		var $this = $(one);	// This box - component
		var carrier = $this.children('ul');
		var viewport= $this.children('.viewport');
		var btn = { };
		btn.prev = $this.children(settings.prevButton);
		btn.next = $this.children(settings.nextButton);
		var carrierLength = 0;
		var items = [];
		var anim = false;

		// Personal settings (uniqe for each)
		var set=jQuery.extend({
			// Inherit settings value from default
			hor:	settings.orientation,
			step:	settings.step,
			dur:	settings.duration,
			easing:	settings.easing
			},{
			// Value from attributes
			hor:	$this.attr('data-orientation'),
			step:	$this.attr('data-step'),
			dur:	$this.attr('data-duration'),
			easing:	$this.attr('data-easing')
		});

		// Test for orientation / Horizontal orientation - yes/no /
		set.hor.toLowerCase();
		set.hor = ( set.hor=='vertical' ||
					set.hor=='vert' ||
					set.hor=='ver' ||
					set.hor=='v' ) ? false : true;
		// Correct attribute for CSS
		if(set.hor)	$this.attr('data-orientation','horizontal');
		else		$this.attr('data-orientation','vertical');

	
		// Refresh elements and re-calculate variables --------------------------------------
		function refresh() {
			items = [];
			carrierLength = 0;
			if(set.hor) {
				var mbe='margin-left';
				var maf='margin-right';
				var att='width';}
			else {
				var mbe='margin-top';
				var maf='margin-bottom';
				var att='height';}
	
			$(carrier.children('li')).each(
				function(i, ele) {
					items.push(ele);
					var ow=parseInt( set.hor ? $(ele).outerWidth() : $(ele).outerHeight() );
					carrierLength += ow + parseInt( $(ele).css(mbe) ) + parseInt( $(ele).css(maf) );
				}
			);
			carrier.css(att, carrierLength);
			testButtons();
		};
	
	
		// Scroll and animation -------------------------------------------------------------
		// public: custom steps (negative numbers is prevew | positive nubers is next)
		this.scrollStep = function(steps) {
			steps = steps===undefined ? 0 : steps;
			scrolling(1*steps);
		};
		
		// Scroll to the preview
		function goToPrev() { scrolling(-1); };
	
		// Scroll to the next
		function goToNext() { scrolling(+1); };
	
		// Animation scrolling
		function scrolling(dir) {
			if(anim) return;
			var op = {duration: set.dur, easing: set.easing, complete: testButtons};	// options
			var st = set.step * dir;	// step

			if(set.hor) {	viewport.animate( {scrollLeft:	( viewport.scrollLeft()	+ st )}, op ); }
			else {			viewport.animate( {scrollTop:	( viewport.scrollTop()	+ st )}, op ); }

			anim = true;
		};
	
		// Test for enable buttons
		function testButtons() {
			anim = false;
			var curr = 0, maxp = 0, vp = 0;
			if(set.hor) {
				vp = viewport.width();
				curr = viewport.scrollLeft();}
			else {
				vp = viewport.height();
				curr = viewport.scrollTop();}

			maxp = carrierLength - vp;
			btn.prev.removeClass('disable');
			btn.next.removeClass('disable');
			if(curr==0) {		btn.prev.addClass('disable');}
			if(curr==maxp) {	btn.next.addClass('disable');}
			if(carrierLength<vp) {
				btn.prev.addClass('disable');
				btn.next.addClass('disable');}
		};
	
	
	
		// Initialise -----------------------------------------------------------------------
		$(function(){

			// Test for carrier
			if( carrier.length==0 ) {
				$this.append('<ul/>');
				carrier = $this.children('ul');
			}

			// Test for viewport
			if( viewport.length==0 ) {
				carrier.wrap('<div class="viewport" />');
				viewport = $this.children('.viewport');
			}

			if( set.step==0 ) {
				if(set.hor)	set.step = viewport.innerWidth();
				else		set.step = viewport.innerHeight();
			}

			// Test for buttons
			if( btn.prev.length==0 ) {
				$this.append('<a id="prev">&nbsp;</a>');
				btn.prev = $this.children('#prev');
			}
			if( btn.next.length==0 ) {
				$this.append('<a id="next">&nbsp;</a>');
				btn.next = $this.children('#next');
			}

			btn.prev.click(goToPrev);
			btn.next.click(goToNext);
			$(window).load(refresh);
		});
	});

	return this;
};
