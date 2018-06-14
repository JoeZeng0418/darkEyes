var recognizer = RecognizerSetup(SDK,"Dictation","en-US","Simple","11751032b8a04e989a9f8d2dc4de5797");
var recordingOn = 0;
$(function(){
	var startBtn = document.getElementById('startBtn');
	var stopBtn = document.getElementById('stopBtn');
	// var recognizer = RecognizerSetup(SDK,"Dictation","en-US","Simple","11751032b8a04e989a9f8d2dc4de5797");
	startBtn.addEventListener("click", function(){
		recordingOn = 1;
	  RecognizerStart(SDK, recognizer, getAudio);
	  startBtn.disabled = true;
	  stopBtn.disabled = false;
	});
	stopBtn.addEventListener("click", function(){
	  RecognizerStop(SDK, recognizer);
	  recordingOn = 0;
	  startBtn.disabled = false;
	  stopBtn.disabled = true;
	  deleteEmailBody();
		$.ajax({
			method: "GET",
			url: "/api/end"
		}).done(res => {
			console.log(res);
		});
	});
	$("#audio")[0].onended = function() {
		$("#audio source").attr("src","");
		recordingOn = 1;
    RecognizerStart(SDK, recognizer, getAudio);
	};
});


function printText(result){
	var query = document.getElementById('emailBody');
	query.innerHTML += result;
	query.innerHTML += " ";
}
function getAudio(query){
	$.ajax({
		method: "GET",
		url: "/api/getAudio/query/" + query
	}).done(res => {
		if (recordingOn==1) {
			console.log(res);
			RecognizerStop(SDK, recognizer);
			recordingOn = 0;
			printText(query);
			console.log("1");
			playAudio(res.filename);
			console.log("2");
		}
	});
}
function playAudio(filename){
	// $("#audio").attr("src","");
	$("#audio source").attr("src","assets/audio/"+filename);
	$("#audio")[0].load();
	$("#audio")[0].play();
}

function deleteEmailBody(){
	console.log("hhhh");
	$("#emailBody").empty();
}