var octave_keys = [90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 77];
var note_displays = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B'];
var current_octave = 4;
var serialize = function(){
	return JSON.stringify(currentSong);
};
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}
var currentScreen;
var lastScreen = new Array();
var currentSong;
var allPhrases = new Array();
var allInstruments = new Array();

if(typeof console === "undefined") {
    console = { log: function() { } };
}

$(document).ready(function(){
	currentSong = new Song();
	currentSong.displayScreen();
	currentSong.allInstruments = allInstruments;
	currentScreen = currentSong;
	// setup the phrase edit rows
	phrase_ed_row = $('#phrase_ed tr').html();
	if(songData != 'None'){
		currentSong.load(songData);
		currentSong.displayScreen();
	}
	for (var i=0; i < 15; i++) {
		$('#phrase_ed table').append("<tr id='pe_"+(i+1)+"'>"+phrase_ed_row+"</tr>");
	};
	$('#phrase_ed td:eq(1)').addClass('selected');
	$('#save').click(function(){
		$.ajax({
			type: "POST",
			data: {"data": serialize()},
			success:function(){
				$('#completed').fadeIn('slow').fadeOut('slow');
			}
		});
	});
	$('#load').click(function(){
		currentSong.load($('#data').val());
		currentSong.displayScreen();
	});
	// handle keypresses
	$('*').focus().keydown(function(event) {
		console.log(event.keyCode);
		rv = true;
		if (event.keyCode == 40) {currentScreen.downPress();rv=false};
		if (event.keyCode == 39) {currentScreen.rightPress();rv=false};
		if (event.keyCode == 38) {currentScreen.upPress();rv=false};
		if (event.keyCode == 37) {currentScreen.leftPress();rv=false};
		if (event.keyCode == 13) {currentScreen.enter();rv=false};
		if (event.keyCode == 27) {currentScreen.esc();rv=false};
		if (event.keyCode == 8) {currentScreen.rm();rv=false};
		if(event.keyCode == 32){
			if (playback) {playback=false}else{playback=true};
			rv=false;
		};
		if (event.keyCode >= 48 && event.keyCode <= 57) {
			currentScreen.num(event.keyCode-48);
			rv=false;
		};
		if (event.keyCode == 190) {
			currentScreen.num('.');
			rv=false;
		};
		if (event.keyCode==191) {
			current_octave--;
			rv=false;
		};
		if (event.keyCode==222) {
			current_octave++;
			rv=false;
		};
		$("#current_octave .data").text(current_octave);
		if (currentScreen instanceof Phrase) {
			for (var i=0; i < octave_keys.length; i++) {
				if(event.keyCode == octave_keys[i]){
					currentScreen.setNote(i);
					rv=false;
					break;
				}
			};			
		};
		return rv;
	});	
	$("#a_adsr").slider({
		slide: function(event, ui) {
			if (currentSong.channels[currentSong.editcol]!=undefined) {
				synth = currentSong.channels[currentSong.editcol].synth;
				synth.ampEnv[1][0] = ui.value/100.0 * 3.0;
			};
		}
	});
	var audioSource = new TrackerSource();
	var audioDestination = new AudioDataDestination();
	audioDestination.autoLatency = true;
	audioDestination.writeAsync(audioSource);
});