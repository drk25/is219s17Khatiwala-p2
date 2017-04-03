// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
var mCurrentIndex = 0;

function swapPhoto() {
	 if(mCurrentIndex < 0){
		mCurrentIndex += mImages.length;
	}
	
	$("#photo").attr('src', mImages[mCurrentIndex].imgPath);
	$(".location").text("Location: "+mImages[mCurrentIndex].imgLocation);
	$(".description").text("Description: "+mImages[mCurrentIndex].description);
	$(".date").text("Date: "+mImages[mCurrentIndex].date);

	
	mCurrentIndex++;
	if(mCurrentIndex >=  mImages.length){
		mCurrentIndex = 0;
	}
	console.log('swap photo');
	
}
function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
}

var $_GET = getQueryParams(document.location.search);

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
var mUrl;

 if($_GET["json"] == undefined){
//	mUrl = "extra.json";
	mUrl = "images.json";
//	console.log(mUrl);
   }
 else {
	mUrl = $_GET["json"];
//	console.log(mUrl);
 }	


mRequest.onreadystatechange = function() { 
	
	if (mRequest.readyState == 4 && mRequest.status == 200) {
	try { 
		mJson = JSON.parse(mRequest.responseText);
		console.log(mJson);
			
	for(var i=0; i < mJson.images.length;i++)
		{
			mImages.push(new GalleryImage(mJson.images[i].imgLocation,mJson.images[i].description,mJson.images[i].date,mJson.images[i].imgPath));
		}
		console.log(mImages);
		} catch(err) { 
			console.log(err.message);
		} 
	} 
}; 

mRequest.open("GET", mUrl, true);
mRequest.send();

function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	$('.details').eq(0).hide();
	
	$(".moreIndicator").click(function(){
		$("img.rot90").toggleClass("rot270",3000);
		$(".details").slideToggle(1000);
	});
		$("#nextPhoto").click(function(){
			swapPhoto();
		});
		
		$("#prevPhoto").click(function(){	
			mCurrentIndex -= 2;
			swapPhoto();
			console.log(mCurrentIndex);
});


});

window.addEventListener('load', function() {
	           
	console.log('window loaded');

}, false);

function GalleryImage(imgLocation, description, date, imgPath) {
	
	this.imgLocation = imgLocation;
	this.description = description;
	this.date = date;
	this.imgPath = imgPath;	
}
