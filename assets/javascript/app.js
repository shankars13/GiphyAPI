var topics = ["happy","excited","angry","sad","hungry","bored","tired","relaxed","drunk","surprised"];

//Beginning of program
$(document).ready(function(event) {
	$('#message').hide();
	$('#duplicatePrompt').hide();

	generateButtons();


	//Onclick on Generate button

	$('#addToButtons').on('click',function(clickEvent){
		var searchValue = $("#searchPhrase").val().trim();
		//check if non-empty
		if (searchValue != '') {
			clickEvent.preventDefault();
			//checking for duplicates
			if (!topics.includes(searchValue.toLowerCase())){
				$('#duplicatePrompt').hide();
				topics.push(searchValue);
				generateButtons();
				$("#searchPhrase").val("");
			}
			else {
				//display duplicate message
				$('#duplicatePrompt').show();
			}
		}
	});

	//Onclick on Clear button
	$("#clearDisplay").on("click", function(clickEvent) {
		clickEvent.preventDefault();
		$("#searchPhrase").val("");
		searchValue='';
		$('#duplicatePrompt').hide();
		$("#message").hide();
		$("#giphyDisplay").empty();
	});

	//Onclick on on the Gif button
	$("#buttonDisplay").on("click", ".giphyButtons", function() {
		var buttonData=$(this).data("value");
//		console.log(buttonData);
		buttonData=buttonData.replace(" ","+");
		getGiphys(buttonData);
	});

	//Onclick on the images
	$("#giphyDisplay").on("click", ".giphyImage", function() {
		//If img is still/animated, change to animated/still
		$(this).attr('data-state', $(this).attr('data-state') == 'still' ? 'animated' : 'still');
		$(this).attr('src', $(this).attr('data-state') == 'still' ? $(this).attr('data-still') : $(this).attr('data-animated'));
	});
});

//Function to generate buttons
function generateButtons() {
	//Clearing buttons before displaying
	$('#buttonDisplay').empty();

	for (i=0;i<topics.length;i++) {
		var button = $('<button class="giphyButtons btn btn-primary btn-space">');
		button.data("value",topics[i]).text(topics[i]);
		$('#buttonDisplay').append(button);
	}
}


//Function to get 10 giphys from Giphy API
function getGiphys(searchTerm) {
	var queryURL =  "https://api.giphy.com/v1/gifs/search?&api_key=dc6zaTOxFJmzC&limit=10&rating=pg&q=" + searchTerm;

	//Ajax Call
	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {

		//Clear existing giphy's if any
		$("#giphyDisplay").empty();
		var responseData = response.data;
		//looping for 10 images retrieved
		for(var i=0; i<responseData.length; i++) {
			//Creating gif divs to hold giphy
//			console.log(responseData[i]);
			var giphyDiv = $('<div class="giphyDiv">');
			var giphy = $('<img class="giphyImage img-responsive">');
			giphy.attr({"data-still":responseData[i].images.downsized_still.url, "data-animated":responseData[i].images.downsized.url, "data-state":"still"});
			// Set src initially to still image
			giphy.attr('src',responseData[i].images.downsized_still.url);
			giphyDiv.append(giphy);
			giphyDiv.append("<p>Gif Rating: " + responseData[i].rating.toUpperCase() + "</p>");
			$('#giphyDisplay').append(giphyDiv);
		}
		$("#message").show();
		});
}