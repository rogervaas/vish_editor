VISH.Editor.AvatarPicker = (function(V,$,undefined){
    var avatars = null;
		var selectedAvatar;
		var thumbnailsDetailsId = "thumbnails_in_excursion_details";
		var carrouselDivId = "avatars_carrousel";
    
   /**
    * function to create the carrousel with the avatars in the div with id "avatars_carrousel"
    */
   var init = function(){
	 	  
   };	
	 
	 var onLoadExcursionDetails = function(mySelectedAvatar){
	 	 selectedAvatar = mySelectedAvatar;
	 	 $("#" + thumbnailsDetailsId).hide();
	 	 VISH.Editor.API.requestThumbnails(_onThumbnailsReceived,_onThumbnailsError);
	 }  
    
  /**
   * Callback function to select an avatar
   */
  var _selectAvatar = function(event){
  	$(".carrousel_element_single_row_thumbnails").removeClass("selectedThumbnail");
  	$(event.target).addClass("selectedThumbnail");
  	$('#excursion_avatar').val($(event.target).attr("src"));
  };
  
  /**
   * function to select a random avatar, it will be chosen between the first and the max (to be in the first carrousel page)
   */
  var selectRandom = function(max){
  	var randomnumber=Math.ceil(Math.random()*max);
  	$("#" + carrouselDivId + " .carrousel_element_single_row_thumbnails:nth-child("+randomnumber+") img").addClass("selectedThumbnail");
  	$('#excursion_avatar').val($("#" + carrouselDivId + " .carrousel_element_single_row_thumbnails:nth-child("+randomnumber+") img").attr("src"));
  };
	
	/**
   * function to select a specific avatar.
   */
  var selectAvatarInCarrousel = function(avatar){
		//Get avatar name
		avatar = avatar.split("/").pop();
		
		var avatarImages = $("#avatars_carrousel").find("img.carrousel_element_single_row_thumbnails");
		
    $.each(avatarImages, function(i, image) {
      if($(image).attr("src").split("/").pop() == avatar){
			 $(image).addClass("selectedThumbnail");
			 VISH.Editor.Carrousel.goToElement(carrouselDivId,$(image));
			}
    });
		
  };
    
	
	var _onThumbnailsReceived = function(data){	
		    avatars = data;
				
        //Clean previous carrousel
        VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
        
        //Build new carrousel
        var content = "";
        var carrouselImages = [];
        $.each(avatars.pictures, function(i, item) {
          var myImg = $("<img src="+item.src+" />")
          carrouselImages.push(myImg)
        });
        
        VISH.Utils.loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
	}
	
	var _onThumbnailsError = function(xhr, ajaxOptions, thrownError){
		VISH.Debugging.log("_onThumbnailsError")
		VISH.Debugging.log("status returned by server:" + xhr.status);
    VISH.Debugging.log("Error in client: " + thrownError);  
    VISH.Debugging.log("ERROR!" + thrownError)
	}
	
	
	var _onImagesLoaded = function(){
    $("#" + thumbnailsDetailsId).show(); 
		
		var options = new Array();
    options['rows'] = 1;
    options['callback'] = _selectAvatar;
    options['rowItems'] = 5;
		options['styleClass'] = "thumbnails";
		
    VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
		
    $(".buttonintro").addClass("buttonintro_extramargin");
		
		if(selectedAvatar){
			selectAvatarInCarrousel(selectedAvatar);
		} else {
			selectRandom(5);  //Randomly select one between first page
		}
    
	}
  
  
	return {
		init	       : init,
		selectRandom   : selectRandom,
		onLoadExcursionDetails : onLoadExcursionDetails
		
	};

}) (VISH, jQuery);