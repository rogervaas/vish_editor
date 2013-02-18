VISH.Editor.Flashcard.Repository = (function(V,$,undefined){
	
	var carrouselDivId = "tab_flashcards_repo_content_carrousel";
	var previewDivId = "tab_flashcards_repo_content_preview";
	var currentFlashcards = new Array();
	var selectedFlashcard = null;

	var init = function() {
		var myInput = $("#tab_flashcards_repo_content").find("input[type='search']");
		$(myInput).watermark(V.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};	
	
	var onLoadTab = function() {
		var previousSearch = ($("#tab_flashcards_repo_content").find("input[type='search']").val() != "");
		if(!previousSearch) {
			_requestInitialData();
		}
	};
	
	/*
	 * Request inicial data to the server.
	 */
	var _requestInitialData = function() {
		V.Editor.API.requestRecomendedFlashcards(_onDataReceived, _onAPIError);
	};
	
	/*
	 * Request data to the server.
	 */
	var _requestData = function(text) {
		V.Editor.API.requestFlashcards(text, _onDataReceived, _onAPIError);
	};
	
	/*
	 * Fill tab_pic_repo_content_carrousel div with server data.
	 */
	var _onDataReceived = function(data) {
		//Clean previous content
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();

		//Clean previous Images
		currentFlashcards = new Array();
		var carrouselImages = [];

		var content = "";

		//the received data has an array called "flashcards", see V.Samples.API.flashcardList for an example
		if((!data.flashcards)||(data.flashcards.length==0)){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
			$("#" + carrouselDivId).show();
			return;
		} 
		
		//data.flashcards is an array with the results
		$.each(data.flashcards, function(index, fc) {
			var myImg = $("<img flashcardid ='"+fc.id+"'' src=" + V.Utils.getSrcFromCSS(fc.slides[0].background) + " >")
			carrouselImages.push(myImg);
			currentFlashcards[fc.id] = fc;
		});
		V.Utils.Loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
	};
	
	var _onImagesLoaded = function(){
		$("#" + carrouselDivId).show();
		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _onClickCarrouselElement;
		options['rowItems'] = 4;
		options['scrollItems'] = 4;
		options['width'] = 650;
		options['styleClass'] = "flashcard_repository";
		V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
	
	var _onAPIError = function() {
		V.Debugging.log("API error");
	};
	
	var _onClickCarrouselElement = function(event) {
		var flashcardid = $(event.target).attr("flashcardid");
		if(flashcardid){
			var the_flashcard_excursion = currentFlashcards[flashcardid];
			//we have the flashcard as is in the repository but we have to update its ids to the adequate ones
			var selectedFc = V.Editor.Utils.replaceIdsForFlashcardJSON(the_flashcard_excursion.slides[0]);
			V.Editor.Flashcard.addFlashcard(selectedFc);
			V.Renderer.renderSlide(selectedFc, "", "<div class='delete_slide'></div>");
			//currentSlide number is next slide
			V.Slides.setCurrentSlideNumber(V.Slides.getCurrentSlideNumber()+1);
			V.Editor.Slides.redrawSlides();
			V.Editor.Thumbnails.redrawThumbnails();
			V.Editor.Events.bindEventsForFlashcard(selectedFc);
			V.Slides.lastSlide();  //important to get the browser to draw everything
			V.Editor.Tools.Menu.updateMenuAfterAddSlide(V.Constant.FLASHCARD);
			$.fancybox.close();
		}
	};

	return {
		init 					    : init,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
