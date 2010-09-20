var SongList = function(){
	this.enterPress = function(){
		this_id = $('#song_list tr:eq('+this.editrow+') td:eq(0)').attr('id');
		if (this_id == 'new_song') {
			this.newSong();
		}else{
			document.location = '/tracker/'+this_id;
		}
	}
	this.newSong = function(){
		$.ajax({
			url: '/tracker/new_song',
			data:{'name':$('#song_name').val()},
			success: this.returnData,
		});
	}
	this.setSelected = function(){
		$('#song_list td').removeClass('selected');
		$('#song_list table tr:eq('+this.editrow+') td:eq(0)').addClass('selected');
	}
	this.returnData = function(data){
		document.location = '/tracker/'+data;
	}
}
SongList.prototype = new EditScreen();