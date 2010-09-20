var Song = function(){
	this.numchan = 8;
	this.channels = new Array();
	this.load = function(data){
		// for unserialzing from the json array
		data = JSON.parse(data);
		for(property in data){
			if (property == 'channels') {
				// clear the channels
				this.channels = new Array();
				var length = data[property].length
				for(i=0;i<length;i++){
					this.channels.push(new Channel());
					this.channels[i].load(data[property][i]);
				}
			}else if(property == 'allInstruments'){
				this.allInstruments = new Array();
				var length = data[property].length
				for(i=0;i<length;i++){
					this.allInstruments.push(new Instrument());
					this.allInstruments[i].load(data[property][i]);
				}
			}else{
				this[property] = data[property];
			}
		}
	}
	this.displayScreen = function(){
		$('#song_ed table').html('');
		for (var i=0; i < 16; i++) {
			$('#song_ed table').append("<tr></tr>");
			for (var j=0; j < this.numchan; j++) {
				var ident = '--';
				if (
					this.channels[j] == undefined ||
					this.channels[j].phrases[i] == undefined
					) {
					ident = '--';
				}else{
					ident = this.channels[j].phrases[i].ident;
				}
				$('#song_ed table tr:eq('+i+')').append("<td>"+ident+"</td>");
			};
		};
		this.setSelected();
	}
	this.setSelected = function(){
		$('#song_ed td').removeClass('selected');
		$('#song_ed table tr:eq('+this.editrow+') td:eq('+this.editcol+')').addClass('selected');
	}
	this.enterPress = function(){
		
		// create a new channel if non existant
		// generate a new phrase if needed as well
		// set the current screen to the phrase being edited
		
		if(this.channels[this.editcol] == undefined){
			this.channels[this.editcol] = new Channel();
		}
		if(this.channels[this.editcol].phrases[this.editrow] == undefined){
			// generate phrase and place it in the global phrases
			var thisPhrase = new Phrase;
			thisPhrase.ident = totalPhrases;
			allPhrases[totalPhrases] = thisPhrase;
			
			this.channels[this.editcol].phrases[this.editrow] = thisPhrase;
			// need to check for collisions here
			while(allPhrases[totalPhrases] != undefined){
				totalPhrases++;				
			}
		}
		$('#song_ed').addClass('inactive');
		$('#phrase_ed').removeClass('inactive');
		
		currentScreen = this.channels[this.editcol].phrases[this.editrow];
		currentScreen.displayScreen();
		this.displayScreen();
	}
	this.numPress = function(num){
		if(this.channels[this.editcol] == undefined){
			this.channels[this.editcol] = new Channel();
		}
		thisCell = $('#song_ed table tr:eq('+this.editrow+') td:eq('+this.editcol+')');
		if(thisCell.text() == "--" || this.moved){
			thisCell.text(num);
			this.moved = false;
		}else{
			thisCell.text(thisCell.text()+num);
		}
		if(allPhrases[thisCell.text()] == undefined){
			var thisPhrase = new Phrase;
			thisPhrase.ident = thisCell.text();
			allPhrases[thisCell.text()] = thisPhrase;
		}
		this.channels[this.editcol].phrases[this.editrow] = allPhrases[thisCell.text()];
	}
	this.audioRequest = function(sampleCounter){
		var buffer = 0;
		for (var j=0; j < this.numchan; j++) {
			if(this.channels[j] != undefined){
				buffer += this.channels[j].synth.audioRequest(sampleCounter);
			}
		}
		return buffer;
	}
	this.nextStep = function(){
		for (var j=0; j < this.numchan; j++) {
			if(this.channels[j] != undefined){
				this.channels[j].nextStep();
			}
		}
	}
};
Song.prototype = new EditScreen();