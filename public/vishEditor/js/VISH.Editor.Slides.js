VISH.Editor.Slides = (function(V,$,undefined){

	var showSlides = function(){
		$(".slides > article").removeClass("temp_hidden");
	};

	var hideSlides = function(){
		$(".slides > article").addClass("temp_hidden");
	};

   /**
	* Function to dispatch the event that redraws the slides
	*/
	var redrawSlides = function(){
		$(document).trigger('OURDOMContentLoaded');
	};


	/**
	 * function to know if the slides have the focus or not
	 * Use to disable actions (like keyboard shortcuts) when the slide is not focused 
	 * @return false if other element has the focus
	 */
	var isSlideFocused = function() {
		//Wysiwyg is focused.
		if($(".wysiwygInstance").is(":focus")){
			return false;
		}
		
		//Fancybox is showing
		if($("#fancybox-content").is(":visible")){
			return false;
		}

		//Generic input is focused
		if($("input").is(":focus")){
			return false;
		}

		//An area is focused
		if(V.Editor && V.Editor.getCurrentArea()!==null){
			return false;
		}

		return true;
	};


	/*
	 *	Move slide_to_move after or before reference_slide.
	 *  Movement param posible values: "after", "before"
	 */
	var moveSlideTo = function(slide_to_move, reference_slide, movement){

		if((typeof slide_to_move === "undefined")||(typeof reference_slide === "undefined")){
			return;
		}

		if(typeof slide_to_move.length !== undefined){
			slide_to_move = $(slide_to_move)[0];
			if(typeof slide_to_move === "undefined"){
				return;
			}
		}

		if(typeof reference_slide.length !== undefined){
			reference_slide = $(reference_slide)[0];
			if(typeof reference_slide === "undefined"){
				return;
			}
		}

		if((slide_to_move.tagName!="ARTICLE")||(reference_slide.tagName!="ARTICLE")||(slide_to_move==reference_slide)){
			return;
		}

		var article_to_move = slide_to_move;
		var article_reference = reference_slide;

		var moving_current_slide = false;
		if(V.Slides.getCurrentSlide() === article_to_move){
			moving_current_slide = true;
		}

		$(article_to_move).remove();
		if(movement=="after"){
			$(article_reference).after(article_to_move);
		} else if(movement=="before") {
			$(article_reference).before(article_to_move);
		} else {
			V.Debugging.log("V.Slides: Error. Movement not defined... !");
			return;
		}

		//Refresh Draggable Objects
		V.Editor.Utils.refreshDraggables(article_to_move);

		//Update slideEls
		V.Slides.setSlides(document.querySelectorAll('section.slides > article'));

		if(moving_current_slide){
			//Update currentSlide
			V.Slides.setCurrentSlideIndex(V.Slides.getNumberOfSlide(article_to_move));
		}

		//Update slides classes next and past.
		//Current slide needs to be stablished before this call.
		V.Slides.updateSlideEls();
		
	}

	var copySlideWithNumber = function(slideNumber){
		var slide = V.Slides.getSlideWithNumber(slideNumber);
		if(slide===null){
			return;
		}
		var newSlide = $(slide).clone();
		copySlide(newSlide);
	}

	var copySlide = function(newSlide){
		var currentSlide = V.Slides.getCurrentSlide();
		if(currentSlide){
			$(currentSlide).after(newSlide);
		} else {
			$("section#slides_panel").append(newSlide);
		}
		
		V.Editor.Utils.refreshDraggables(newSlide);
		
		//Update slideEls
		V.Slides.setSlides(document.querySelectorAll('section.slides > article'));

		//Update slides classes next and past.
		//Current slide needs to be stablished before this call.
		V.Slides.updateSlideEls();

		//Redraw thumbnails
		V.Editor.Thumbnails.redrawThumbnails();

		if(currentSlide){
			V.Slides.goToSlide(V.Slides.getCurrentSlideNumber()+1);
		} else {
			V.Slides.goToSlide(1);
		}
	}

	var addSlide = function(slide){
		$('.slides').append(slide);
	};

	var removeSlide = function(slideNumber){
		var slide = V.Slides.getSlideWithNumber(slideNumber);
		if(slide===null){
			return;
		}
		var standardSlide = (slide.type===V.Constant.STANDARD);
		var removing_current_slide = false;
		if(V.Slides.getCurrentSlide() === slide){
			removing_current_slide = true;
		}

		$(slide).remove();
		if(removing_current_slide){
			if((V.Slides.getCurrentSlideNumber()===1)&&(V.Slides.getSlidesQuantity()>1)){
				V.Slides.setCurrentSlideNumber(1);
			} else {
				V.Slides.setCurrentSlideNumber(V.Slides.getCurrentSlideNumber()-1);
			}
		}
		redrawSlides();					
		V.Editor.Thumbnails.redrawThumbnails();
		if(!standardSlide){
			V.Editor.Tools.Menu.init();
		}
	}

	return {
		showSlides				: showSlides,
		hideSlides				: hideSlides,
		redrawSlides	    	: redrawSlides,
		isSlideFocused			: isSlideFocused,
		moveSlideTo				: moveSlideTo,
		copySlide				: copySlide,
		copySlideWithNumber		: copySlideWithNumber,
		addSlide 				: addSlide,
		removeSlide				: removeSlide
	};

}) (VISH, jQuery);