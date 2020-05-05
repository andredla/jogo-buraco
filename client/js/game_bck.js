var log = null;
var roomId = null;

function Console(){
	this.body = $(".console");

	this.prepend = function(txt){
		this.body.html("<span>"+txt+"</span><br/>");
	};

	return false;
}

function room(data){
	$(".room").html("");
	for(var d in data.game.players){
		var p = data.game.players[d];
		var span = $("<span class='nome'>"+p.nome+"</span>");
		$(".room").append( span );
	}

	$(".lobby").hide();
	$(".room").show();
	return false;
}

socket.on("console", function(data){
	console.log(data.console);
	log.prepend( data.console );
});

function sala_cria(){
	var player_nome = $(".player_nome").val();
	socket.emit("sala_cria", {player_nome: player_nome});
}

socket.on("sala_cria", function(data){
	//console.log("sala_criada...", data);
	roomId = data.gameId;
	log.prepend( "O código da sala é " + data.gameId );
	room(data);
});

function sala_entra(){
	var player_nome = $(".player_nome").val();
	var gameId = $(".gameId").val();
	socket.emit("sala_entra", {gameId: gameId, player_nome: player_nome});
}

socket.on("sala_entra", function(data){
	roomId = data.gameId;
	//console.log("sala_entra...", data);
	log.prepend( "O jogador " + data.player_nome + " entrou na sala "+data.gameId+" !" );
	room(data);
});

$(function(){
	log = new Console();
});