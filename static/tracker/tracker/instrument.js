var Instrument = function(){
	this.ident;
	this.numCols = 1;
	
	this.wav = 0;
	this.vol = 80;
	this.atk = 0.001;
	this.rel = 0.2;
	
	this.numWaves = 2;
	this.rows = ['vol', 'wav', 'atk', 'rel'];
	this.wavs = ['sin', 'noi'];
	this.load = function(data){
		// for unserialzing from the json array
		for(property in data){
			this[property] = data[property];
		}
	}
	
	this.displayScreen = function(){
		$('#inst_ed table').html('');
		for (var i=0; i < this.rows.length; i++) {
			$('#inst_ed table').append("<tr id='"+this.rows[i]+"'></tr>");
			if (i==1) {
				$('#inst_ed table tr:eq('+i+')').append("<td class='name'>"+this.rows[i].toUpperCase()+"</td><td class='data'>"+this.wavs[this.wav]+"</td>");											
			}else{
				$('#inst_ed table tr:eq('+i+')').append("<td class='name'>"+this.rows[i].toUpperCase()+"</td><td class='data'>"+this[this.rows[i]]+"</td>");							
			}
		}
		$('#inst_ed').removeClass('inactive');
		this.setSelected();
	}
	this.setSelected = function(){
		$('#inst_ed td').removeClass('selected');
		$('#inst_ed table tr:eq('+this.editrow+') td:eq(1)').addClass('selected');
	}
	this.rightPress = function(){
		if (this.editrow == 1) {
			this.wav = (this.wav+1).mod(this.wavs.length);
		};
		this.setSelected();
		this.displayScreen();
	};
	this.leftPress = function(){
		if (this.editrow == 1) {
			this.wav = (this.wav-1).mod(this.wavs.length);
		};
		this.setSelected();
		this.displayScreen();
	};
	this.escPress = function(){
		$('#inst_ed').addClass('inactive');
		$('#phrase_ed').removeClass('inactive');
	};
	this.numPress = function(num){
		if (this.editcol == 0) {
			thisCell = $('#inst_ed table tr:eq('+this.editrow+') td.data');
			if(thisCell.text() == "--" || this.moved){
				thisCell.text(num);
				this.moved = false;
			}else{
				thisCell.text(thisCell.text()+num);
			}
			this[this.rows[this.editrow]] = thisCell.text();
		};
		this.displayScreen();
	}
}
Instrument.prototype = new EditScreen();
var totalInstruments = 0;
var currentInstrument = 0;