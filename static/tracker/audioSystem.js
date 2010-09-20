var lerp = function(start, target, amt){
	return start + (target-start) * amt;
};
var Synth = function(){
	this.start = 0;
	this.ampEnv = [[0.001, 1],[0.2, 0]];
	this.ampEnvStep = 0;
	this.ampEnvAmt = 0;
	this.lastAmp = 0;
	this.freq = 0;
	this.wav = 0;
	this.audioRequest = function(count){
		sample = 0;
		if (this.wav == 0) {
			sample = Math.sin( count * this.freq );			
		};
		if (this.wav == 1) {
			sample = Math.random()*2.0-1.0;
		};
		if(this.ampEnvStep < this.ampEnv.length){
			// need to fix this
			if ((1+count-this.start)/(sampleRate*this.ampEnv[this.ampEnvStep][0]) > 1) {
				this.lastAmp = this.ampEnvAmt;
				this.ampEnvStep++;
				this.start = count;
			}else{
				this.ampEnvAmt = lerp(this.lastAmp, this.ampEnv[this.ampEnvStep][1], (1+count-this.start)/(sampleRate*this.ampEnv[this.ampEnvStep][0]));
			}
		}
		sample *=  this.ampEnvAmt;// vol
		return sample;
	};
	this.trigger = function(count, pitch, volume){
		this.start = count;
		this.lastAmp = volume;
		this.ampEnvStep = 0;
		this.freq = 440.0*Math.pow(2.0, (pitch-60)/12);
		this.freq *= 2*Math.PI/sampleRate;
	}
	this.load = function(obj){
		this.wav = obj.wav;
		this.ampEnv = [[obj.atk, 1], [obj.rel, 0]];
	}
};

var sampleRate = 44100;
var tempo = 120.0
var secondsPerBeat = 60.0/tempo;
var samplesPerBeat = sampleRate * secondsPerBeat * 0.25; // to get quarter notes
var sampleCounter = 0;
//var beatLength = 60*sampleRate/(120.0*0.25);
var playback = true;

function TrackerSource() {
	this.audioParameters = new AudioParameters(1, sampleRate);
	this.read = function(soundData) {
		var size = soundData.length;
		for (var i=0; i < soundData.length; i++) {
			sampleCounter++;
			remainder = sampleCounter%Math.floor(samplesPerBeat);
			if(remainder == 0 && playback){
				currentSong.nextStep();
			}
			soundData[i] = currentSong.audioRequest(sampleCounter);
		};
		return size;
	};
}