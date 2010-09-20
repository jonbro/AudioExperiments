var Phrase = function(){
	this.currentStep = 0;
	this.atLoop = false;
	
	this.notes = new Array();
	this.instruments = new Array();
	
	this.ident = 0;
	this.numCols = 5;
	this.load = function(data){
		// for unserialzing from the json array
		for(property in data){
			this[property] = data[property];
		}
	}
	this.nextStep = function(){
		this.currentStep = (this.currentStep+1).mod(17);
		if (this.currentStep == 16) {
			this.atLoop = true;
		}else{
			this.atLoop = false;
		}
		$('#phrase_ed tr td.pb_indicator').html("&nbsp;");
		$('#phrase_ed tr#pe_'+this.currentStep+' td.pb_indicator').html("&gt;");			
	};
	this.setSelected = function(){
		$('#phrase_ed td').removeClass('selected');
		$('#phrase_ed tr#pe_'+this.editrow+' td:eq('+(this.editcol+1)+')').addClass('selected');	
	};
	this.setNote = function(i){	
		this.notes[this.editrow] = (current_octave-4)*12+60+i;
		$('#phrase_ed td.selected').html(note_displays[i]+current_octave);
		if (this.instruments[this.editrow] == undefined) {
			if (allInstruments[currentInstrument] == undefined) {
				var thisInstrument = new Instrument();
				allInstruments[currentInstrument] = thisInstrument;
				thisInstrument.ident = currentInstrument;
			};
			this.instruments[this.editrow] = allInstruments[currentInstrument];
		};
		this.displayScreen();
	}
	this.displayScreen = function(){
		for (var i=0; i < 16; i++) {
			var disp = "---";
			if (this.notes[i] != null) {
				octave = Math.floor(this.notes[i]/12.0)-1;
				disp = note_displays[(this.notes[i]-60).mod(12)]+octave;
			};
			if (this.instruments[i] != undefined) {
				$('#phrase_ed td.instrument:eq('+i+')').html(this.instruments[i].ident);				
			}else{
				$('#phrase_ed td.instrument:eq('+i+')').html('--');
			};
			$('#phrase_ed td.note:eq('+i+')').html(disp);
		}
	}
	this.enterPress = function(){
		// create a new channel if non existant
		// generate a new phrase if needed as well
		// set the current screen to the phrase being edited
		currentScreen = this.instruments[this.editrow];
		if (typeof(currentScreen.displayScreen) != 'function') {
			currentScreen = currentSong.allInstruments[currentScreen.ident];
		};
		currentScreen.displayScreen();
		$('#phrase_ed').addClass('inactive');
		this.displayScreen();
	}
	this.rmPress = function(){
		if (this.instruments[this.editrow] != undefined && this.editcol ==1) {
			this.instruments[this.editrow] = undefined;
		}
		if (this.notes[this.editrow] != undefined && this.editcol ==0) {
			this.notes[this.editrow] = undefined;
		}
		this.displayScreen();
	}
	this.numPress = function(num){
		if (this.editcol == 1) {
			thisCell = $('#phrase_ed table tr:eq('+this.editrow+') td.instrument');
			if(thisCell.text() == "--" || this.moved){
				thisCell.text(num);
				this.moved = false;
			}else{
				thisCell.text(thisCell.text()+num);
			}			
			if(allInstruments[thisCell.text()] == undefined){
				var thisInstrument = new Instrument();
				thisInstrument.ident = thisCell.text();
				allInstruments[thisCell.text()] = thisInstrument;
				currentInstrument = thisInstrument.ident;
			}
		};
		this.instruments[this.editrow] = allInstruments[thisCell.text()];
		this.displayScreen();
	}
	this.getNote = function(){
		return this.notes[this.currentStep];
	}
	this.getInstrument = function(){
		return this.instruments[this.currentStep];
	};
	this.escPress = function(){
		$('#phrase_ed').addClass('inactive');
		$('#song_ed').removeClass('inactive');
	};
};
Phrase.prototype = new EditScreen();
var totalPhrases = 0;