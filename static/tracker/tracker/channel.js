var Channel = function(){
	this.phrases = new Array();
	this.synth = new Synth();
	this.currentStep = 0;
	this.load = function(data){
		// for unserialzing from the json array
		for(property in data){
			if (property == 'phrases') {
				// clear the channels
				this.phrases = new Array();
				// need to generate the global phrases from here as well
				var length = data[property].length
				for(i=0;i < length; i++){
					this.phrases.push(new Phrase());
					this.phrases[i].load(data[property][i]);
				}					
			}else if(property == 'synth'){
				// do nothing because we are going to change the way this works anyways
			}else{
				this[property] = data[property];
			}
		}
	}
	this.nextStep = function(){
		if(this.phrases[this.currentStep] != undefined){
			if(this.phrases[this.currentStep].atLoop){
				this.phrases[this.currentStep].nextStep();
				this.currentStep++
				if(this.phrases[this.currentStep] == undefined){
					this.findFirst();
				}
			}
			if (this.phrases[this.currentStep].getNote() != null) {
				this.synth.load(this.phrases[this.currentStep].getInstrument())
				this.synth.trigger(sampleCounter, this.phrases[this.currentStep].getNote(), 0);
			};
			this.phrases[this.currentStep].nextStep();
		}
	}
	this.findFirst = function(){
		this.currentStep--;
		if (this.phrases[this.currentStep] != undefined) {
			this.findFirst();
		}else{
			this.currentStep++;
		}
	}
}
