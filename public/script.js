var recognizer = RecognizerSetup(SDK,"Dictation","en-US","Simple","11751032b8a04e989a9f8d2dc4de5797");
var recordingOn = 0;
var host_port = "localhost:3000";
var state = 0;
var audios = ["askWho.mp3","askSubject.mp3","askBody.mp3","tellSent.mp3"];
$(function(){
	// var recognizer = RecognizerSetup(SDK,"Dictation","en-US","Simple","11751032b8a04e989a9f8d2dc4de5797");
	// when the audio ends, start recording immediately
	$("#audio")[0].onended = function() {
		$("#audio source").attr("src","");
		if (state==0) {

		} else if (state==1) {

		} else if (state==2) {

		} else {
			endTask();
		}
		recordingOn = 1;
    RecognizerStart(SDK, recognizer, getAudio);
	};
	$('html').on('click', function(){
		console.log("replay..");
		playAudio(audios[state]);
	});
});


function printText(result){
	if (state==0) {
		var query = document.getElementById('emailTo');
		// make it valid email address
		result = result.toLowerCase().replace(/\s+/g, '');
		result = result.replace(/at/g, '@');
		if (result.substring(result.length-1)==".") {
			result = result.substring(0,result.length-1);
		}
		query.innerHTML += result;
		query.innerHTML += " ";
	} else if (state==1) {
		var query = document.getElementById('emailSubject');
		query.innerHTML += result;
		query.innerHTML += " ";
	} else if (state==2) {
		var query = document.getElementById('emailBody');
		query.innerHTML += result;
		query.innerHTML += " ";
	}
	console.log(result);
}
function getAudio(query){
	if (query=="Send email."&&state==2) {
		sendEmail();
		state=3;
		playAudio(audios[state]);
		return;
	} else if (query=="Next."&&state<2) {
		state++;
		playAudio(audios[state]);
		return;
	}
	$.ajax({
		method: "GET",
		url: "http://"+host_port+"/api/getAudio/query/" + query
	}).done(res => {
		if (recordingOn==1) {
			console.log(res);
			printText(query);
			playAudio(res.filename);
		}
	});
}
function sendEmail(){
	console.log("request to send email...");
	var bodyText = $('#emailBody').text();
	var subject = $('#emailSubject').text();
	var emailTo = $('#emailTo').text();
	$.ajax({
		method: "POST",
		url: "http://"+host_port+"/api/sendEmail/"+emailTo+"/"+subject+"/"+bodyText
	}).done(res => {
		console.log(res);
	});
}
function playAudio(filename){
	// $("#audio").attr("src","");
	RecognizerStop(SDK, recognizer);
	recordingOn = 0;
	$("#audio source").attr("src","http://"+host_port+"/api/getMusic/"+filename);
	$("#audio")[0].load();
	$("#audio")[0].play();
}
function deleteEmailBody(){
	$("#emailBody").empty();
}
function endTask(){
	$.ajax({
		method: "GET",
		url: "http://"+host_port+"/api/end"
	}).done(res => {
		console.log(res);
		window.location.href = ("");
	});
}