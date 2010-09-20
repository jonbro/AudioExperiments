var EditScreen = function(){
	
	this.editrow = 0;
	this.editcol = 0;
	this.numCols = 8;
	this.moved = true;
	this.downPress = function(){
		this.editrow = (this.editrow+1).mod(16);
		this.setSelected();
		this.moved = true;
	};
	this.upPress = function(){
		this.editrow = (this.editrow-1).mod(16);	
		this.setSelected();
		this.moved = true;
	};
	this.rightPress = function(){
		this.editcol = (this.editcol+1).mod(this.numCols);
		this.setSelected();
		this.moved = true;
	};
	this.leftPress = function(){
		this.editcol = (this.editcol-1).mod(this.numCols);	
		this.setSelected();
		this.moved = true;
	};
	this.enter = function(){
		if(typeof(this.enterPress) == 'function'){
			lastScreen.push(currentScreen);				
			this.enterPress();
		}
	}
	this.esc = function(){
		if (lastScreen.length > 0) {
			currentScreen = lastScreen.pop();			
		};
		if(typeof(this.escPress) == 'function'){
			this.escPress();
		}		
	}
	this.num = function(num){
		if (typeof(this.numPress) == 'function') {
			this.numPress(num)
		};
	}
	this.rm = function(){
		if (typeof(this.rmPress) == 'function') {
			this.rmPress();
		}
	}
};
