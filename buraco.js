var io;
var gameSocket;

var salas = {};

var cartas = require("./client/js/cartas.json");

// Inicio [sala]
function Sala(){
	this.id = null;
	this.players = [null, null, null, null];
	this.pool = [];
	this.deck = null;
	this.morto = [];
	this.started = false;
	this.mesa = new Deck();
	this.vez = null;
	this.vez_ultima = null;
	this.lugares = [];
	this.cores = {joker: 0, feltro: "#1FAB90", diams: {bg: "#ffffff", fg: "#ff0000"}, spades: {bg: "#ffffff", fg: "#444444"}, hearts: {bg: "#ffffff", fg: "#ff0000"}, clubs: {bg: "#ffffff", fg: "#444444"}};
	this.flag_compra = false;
	this.flag_descarta = false;
	this.embaralhar = 0;

	this.cria = function(){
		// Create a unique Socket.IO Room
		this.id = ( Math.random() * 1000 ) | 0;
		salas[this.id] = this;
		return false;
	}

	this.addPlayer = function(player, lugar){
		this.players[lugar-1] = player;
		player.sala = this.id;
		return false;
	}

	this.findPlayer = function(id){
		for(var p in this.players){
			if(this.players[p]){
				if(id == this.players[p].id){
					//console.log( this.players[p] );
					//return {ind: p, player: this.players.splice(p, 0)};
					//console.log({ind: p, player: this.players[p]});
					return {ind: p, player: this.players[p]};
				}
			}
		}
		return null;
	}

	this.removePlayer = function(player){
		var p = this.findPlayer(player.id);
		if(p){
			this.players.splice(p.ind, 1);
		}
		return false;

		for(var p in this.players){
			if(this.players[p]){
				if(player.id == this.players[p].id){
					this.players.splice(p, 1);
				}
			}
		}
		return false;
	}

	this.sock_leave = function(s1){
		for(var player in this.players){
			var p = this.players[player];
			if(p){
				var s = io.sockets.sockets[p.socket];
				s.leave(s1);
			}
		}
		return false;
	}

	this.sock_change = function(s1, s2){
		for(var player in this.players){
			var p = this.players[player];
			if(p){
				//console.log(p);
				var s = io.sockets.sockets[p.socket];
				if(s){
					s.leave(s1);
					s.join(s2);
				}
				p.sala = s2;
			}
		}
		return false;
	}

	this.add_mesa = function(carta){
		this.mesa.body.push(carta);
		return false;
	}

	this.compra_mesa = function(player){
		var temp = [];
		player.player.deck.merge(player.player.deck, this.mesa);
		player.player.deck.order();
		for(var carta in this.mesa.body){
			var uid = this.mesa.body[carta].uid;
			temp.push(uid);
		}
		this.mesa = new Deck();
		return temp;
	}

	this.historico_load = function(){
		console.log("-----------------");
		console.log("historico_load...");
		var historico = require("./client/js/historico.json");
		//console.log(historico);
		return historico;
	}

	this.historico_grava = function(historico){
		console.log("-----------------");
		console.log("historico_grava...");
		var dt = new Date();
		var data = formatadata_mascara(dt, "d/m/a h:n:s");
		var players = [];
		for(var player in this.players){
			var p = this.players[player];
			players.push({nome: p.nome, score: p.score});
		}
		historico.push({data: data, players: players});
		//console.log(historico);
		var str = JSON.stringify(historico);
		write_file("client/js/historico.json", str);
		return false;
	}

	this.calculo_final = function(){
		console.log("-----------------");
		console.log( "calculo_final..." );
		if(this.lugares.length >= 4){
			var p1 = this.players[0];
			var p2 = this.players[1];
			var p3 = this.players[2];
			var p4 = this.players[3];

			p1.calcula();
			p2.calcula();

			p1.pts_temp = 0;
			p2.pts_temp = 0;
			p3.pts_temp = 0;
			p4.pts_temp = 0;

			if(p1.deck.body.length <=0){
				p1.pts_temp += 100;
			}
			if(p3.deck.body.length <=0){
				p3.pts_temp += 100;
			}
			if(p2.deck.body.length <=0){
				p2.pts_temp += 100;
			}
			if(p4.deck.body.length <=0){
				p4.pts_temp += 100;
			}

			if(p1.deck.body.length <=0 || p3.deck.body.length <=0){
				p1.score_temp += 100;
				p1.resumo.batida += 100;
			}

			if(p2.deck.body.length <=0 || p4.deck.body.length <=0){
				p2.score_temp += 100;
				p2.resumo.batida += 100;
			}

			if(!p1.morto && !p3.morto){
				p1.score_temp -= 100;
				p1.resumo.morto -= 100;
				p1.pts_temp -= 100;
				p3.pts_temp -= 100;
			}
			if(!p2.morto && !p4.morto){
				p2.score_temp -= 100;
				p2.resumo.morto -= 100;
				p2.pts_temp -= 100;
				p4.pts_temp -= 100;
			}

			p1.pts_temp -= p1.deck.soma_jogo();
			p3.pts_temp -= p3.deck.soma_jogo();
			p2.pts_temp -= p2.deck.soma_jogo();
			p4.pts_temp -= p4.deck.soma_jogo();

			p1.score_temp -= p1.deck.soma_jogo();
			p1.score_temp -= p3.deck.soma_jogo();
			p1.resumo.mao -= p1.deck.soma_jogo();
			p1.resumo.mao -= p3.deck.soma_jogo();

			p2.score_temp -= p2.deck.soma_jogo();
			p2.score_temp -= p4.deck.soma_jogo();
			p2.resumo.mao -= p2.deck.soma_jogo();
			p2.resumo.mao -= p4.deck.soma_jogo();

			//p1.score = p1.score_temp;
			//p2.score = p2.score_temp;
		}else{
			for(var player in this.players){
				var p = this.players[player];
				if(p){
					p.calcula();
					p.pts_temp = 0;
					if(p.deck.body.length <=0){
						p.score_temp += 100;
						p.resumo.batida += 100;
						p.pts_temp += 100;
					}
					if(!p.morto){
						p.score_temp -= 100;
						p.resumo.morto -= 100;
						p.pts_temp -= 100;
					}
					p.score_temp -= p.deck.soma_jogo();
					p.resumo.mao -= p.deck.soma_jogo();
					p.pts_temp -= p.deck.soma_jogo();
					//p.score = p.score_temp;
				}
			}
		}
		return false;
	}

	this.checa_vez = function(player){
		var ret = false;
		if(this.vez == player.lugar-1){
			ret = true;
		}
		return ret;
	}

	this.vazia = function(){
		var ret = true;
		for(var player in this.players){
			var p = this.players[player];
			if(p){
				ret = false;
			}
		}
		return ret;
	}

	this.players_fix = function(){
		var temp = [];
		for(var player in this.players){
			var p = this.players[player];
			if(p){
				temp.push(p);
				temp[temp.length-1].lugar = temp.length;
			}
		}
		this.players = temp;
		return false;
	}

	this.add_vez = function(){
		var min = 0;
		var max = this.lugares.length-1;
		this.vez++;
		if(this.vez > max){
			this.vez = min;
		}
		this.flag_compra = false;
		this.flag_descarta = false;
		return false;
	}

	this.start_debug = function(){
		this.started = true;
		this.lugares = [];
		this.flag_compra = false;
		this.flag_descarta = false;

		var d0 = new Deck();
		d0.init({back: "#D03737"});

		var d1 = new Deck();
		d1.init({diams_bg: "#ffffff", diams_fg: "#BDA435", spades_bg: "#ffffff", spades_fg: "#3586BD", hearts_bg: "#ffffff", hearts_fg: "#BD353D", clubs_bg: "#ffffff", clubs_fg: "#444444", back: "#D03737"});

		var d2 = new Deck();
		d2.init({diams_bg: "#E8C424", diams_fg: "#ffffff", spades_bg: "#3586BD", spades_fg: "#ffffff", hearts_bg: "#BD353D", hearts_fg: "#ffffff", clubs_bg: "#444444", clubs_fg: "#ffffff", back: "#1313AF"});

		var d3 = new Deck();
		d3.init({diams_bg: "#FFDE9B", diams_fg: "#7A5B1C", spades_bg: "#A7CBFD", spades_fg: "#264571", hearts_bg: "#F4CFE1", hearts_fg: "#CA186E", clubs_bg: "#E9ECF2", clubs_fg: "#444444", back: "#1313AF"});
		

		//var d4 = new Deck();
		//d4.init({diams_bg: "#F7C96B", diams_fg: "#444444", spades_bg: "#A7CBFD", spades_fg: "#444444", hearts_bg: "#F97690", hearts_fg: "#444444", clubs_bg: "#E9ECF2", clubs_fg: "#444444", back: "#D03737"});

		if(this.cores.joker == "1"){
			var c = new Carta();
			c.init({id: 0, naipe: "clubs", bgcolor: "#ffffff", fgcolor: "#444444", back: "#D03737"});
			d0.body.push(c);

			var c = new Carta();
			c.init({id: 0, naipe: "clubs", bgcolor: "#ffffff", fgcolor: "#ff0000", back: "#1313AF"});
			d1.body.push(c);

			var c = new Carta();
			c.init({id: 0, naipe: "clubs", bgcolor: "#444444", fgcolor: "#ffffff", back: "#1313AF"});
			d2.body.push(c);

			var c = new Carta();
			c.init({id: 0, naipe: "clubs", bgcolor: "#E9ECF2", fgcolor: "#444444", back: "#1313AF"});
			d3.body.push(c);
		}

		this.deck = new Deck();
		this.deck.merge(this.deck, d0);
		this.deck.merge(this.deck, d1);
		this.deck.merge(this.deck, d2);
		this.deck.merge(this.deck, d3);

		this.players_fix();

		this.players[0].deck = new Deck();
		this.players[0].deck = this.deck;
		//this.deck = null;
		//this.sock_change("lobby", this.id);
		this.sock_leave("lobby");
		return false;
	}

	this.start = function(){
		this.started = true;
		this.lugares = [];
		this.flag_compra = false;
		this.flag_descarta = false;

		this.mesa = new Deck();
		var d1 = new Deck();
		//d1.init({diams_bg: "#FFDE9B", diams_fg: "#7A5B1C", spades_bg: "#A7CBFD", spades_fg: "#264571", hearts_bg: "#F4CFE1", hearts_fg: "#CA186E", clubs_bg: "#E9ECF2", clubs_fg: "#444444", back: "#D03737"});
		d1.init({joker: this.cores.joker, diams_bg: this.cores.diams.bg, diams_fg: this.cores.diams.fg, spades_bg: this.cores.spades.bg, spades_fg: this.cores.spades.fg, hearts_bg: this.cores.hearts.bg, hearts_fg: this.cores.hearts.fg, clubs_bg: this.cores.clubs.bg, clubs_fg: this.cores.clubs.fg, back: "#D03737"});
		d1.shuffle();

		var d2 = new Deck();
		//d2.init({diams_bg: "#FFDE9B", diams_fg: "#7A5B1C", spades_bg: "#A7CBFD", spades_fg: "#264571", hearts_bg: "#F4CFE1", hearts_fg: "#CA186E", clubs_bg: "#E9ECF2", clubs_fg: "#444444", back: "#1313AF"});
		d2.init({joker: this.cores.joker, diams_bg: this.cores.diams.bg, diams_fg: this.cores.diams.fg, spades_bg: this.cores.spades.bg, spades_fg: this.cores.spades.fg, hearts_bg: this.cores.hearts.bg, hearts_fg: this.cores.hearts.fg, clubs_bg: this.cores.clubs.bg, clubs_fg: this.cores.clubs.fg, back: "#1313AF"});
		d2.shuffle();

		if(this.cores.joker == "1"){
			var c = new Carta();
			c.init({id: 0, naipe: "clubs", bgcolor: "#ffffff", fgcolor: "#ff0000", back: "#D03737"});
			d1.body.push(c);

			var c = new Carta();
			c.init({id: 0, naipe: "clubs", bgcolor: "#ffffff", fgcolor: "#444444", back: "#1313AF"});
			d2.body.push(c);
		}

		this.deck = new Deck();
		this.deck.merge(d1, d2);
		//this.deck = d1;

		for(var a=1; a<=this.embaralhar; a++){
			console.log("embaralhando...");
			this.deck.shuffle();
		}

		var m1 = new Deck();
		var m2 = new Deck();
		for(var a=1; a<=22; a++){
			if(a%2 == 0){
				m2.body.push( this.deck.compra() );
			}else{
				m1.body.push( this.deck.compra() );
			}
		}
		
		m1.order();
		m2.order();

		this.morto = [];
		this.morto.push(m2);
		this.morto.push(m1);

		this.players_fix();

		for(var player in this.players){
			var p = this.players[player];
			if(p){
				p.deck = new Deck();
				p.jogos = [];
				p.morto = false;
			}
		}

		for(var a=1; a<=11; a++){
			for(var player in this.players){
				var p = this.players[player];
				if(p){
					p.deck.body.push( this.deck.compra() );
				}
			}
		}

		for(var player in this.players){
			var p = this.players[player];
			if(p){
				this.lugares.push(p.lugar);
				p.deck.order();
			}
		}

		this.mesa.body.push( this.deck.compra() );

		if(this.vez_ultima == null){
			var rand = Math.floor(Math.random() * this.lugares.length);
			this.vez = rand;
			this.vez_ultima = this.vez;
		}else{
			this.vez = this.vez_ultima;
			this.add_vez();
			this.vez_ultima = this.vez;
		}

		//this.sock_change("lobby", this.id);
		this.sock_leave("lobby");
		//write_file("salas.json", JSON.stringify(salas));
		//write_file("salas.json", JSON.stringify(salas, function(key, val){
			//if (typeof val === 'function') {
			//return val + ''; // implicitly `toString` it
			//}
			//return val;
		//}));
		return false;
	}

	return false;
}
// Fim [sala]

// Inicio [player]
function Player(){
	this.id = null;
	this.socket = null;
	this.nome = null;
	this.deck = new Deck();
	this.lugar = null;
	this.ordem = null;
	this.sala = null;
	this.jogos = [];
	this.jogos_label = [];
	this.morto = false;
	this.score = 0;
	this.score_temp = 0;
	this.resumo = {real: 0, suja: 0, mesa: 0, batida: 0, mao: 0, morto: 0};
	this.pts = 0;
	this.pts_temp = 0;

	this.cria = function(id, socket_id, nome, lugar){
		this.id = id;
		this.socket = socket_id;
		this.nome = nome;
		this.lugar = lugar;
		return false;
	}

	this.compra = function(carta){
		this.deck.body.push(carta);
		this.deck.order();
		return false;
	}

	this.discarta = function(uid){
		return this.deck.find_carta(uid);
	}

/*
	this.calculo_final = function(){
		console.log("-----------------");
		console.log( "calculo_final..." );
		this.calcula();
		if(!this.morto){
			this.score_temp -= 100;
		}
		if(this.deck.body.length <=0){
			this.score_temp += 100;
		}
		this.score_temp -= this.deck.soma_jogo();
		this.score = this.score_temp;
		return false;
	}
*/

	this.calcula = function(){
		console.log("-----------------");
		console.log( "calcula..." );
		this.score_temp = this.score;
		this.jogos_label = [];
		this.resumo = {real: 0, suja: 0, mesa: 0, batida: 0, mao: 0, morto: 0};
		for(var jogo in this.jogos){
			var j = this.jogos[jogo];
			var canastra = j.canastra();
			var tipo = "";
			if(canastra == 1){
				this.score_temp += 200;
				tipo = "real";
				this.resumo.real += 200;
			}
			if(canastra == 2){
				this.score_temp += 100;
				tipo = "suja";
				this.resumo.suja += 100;
			}
			this.score_temp += j.soma_jogo();
			this.resumo.mesa += j.soma_jogo();
			this.jogos_label.push(tipo);
			//console.log( this.score_temp );
		}
		return false;
	}

	return false;
}
// Fim [player]

// Inicio [carta]
function Carta(){
	this.uid = null;
	this.id = null;
	this.naipe = null;
	this.bgcolor = null;
	this.fgcolor = null;
	this.back = null;

	this.init = function(opts){
		var opt = extend({
			bgcolor: "#ffffff",
			fgcolor: "#444444",
			back: "#eeeeee",
		}, opts);

	this.uid = uuidv4();
	this.id = opt.id;
	this.naipe = opt.naipe;
	this.bgcolor = opt.bgcolor;
	this.fgcolor = opt.fgcolor;
	this.back = opt.back;

	return false;
	}

	this.getLabel = function(){
		return cartas[this.id].label;
	}

	this.getSprite = function(){
		return cartas[this.id].sprite;
	}

	this.getPontos = function(){
		return cartas[this.id].pontos;
	}

	return false;
}
// Fim [carta]

// Inicio [deck]
function Deck(){
	this.cartas = [];
	this.naipes = [];
	this.body = [];

	this.init = function(opts){
		var opt = extend({
			diams_bg: "#ffffff",
			diams_fg: "#ff0000",
			spades_bg: "#ffffff",
			spades_fg: "#444444",
			hearts_bg: "#ffffff",
			hearts_fg: "#ff0000",
			clubs_bg: "#ffffff",
			clubs_fg: "#444444",
			back: "#eeeeee",
			num: 13,
			naipes: ["diams", "spades", "hearts", "clubs"]
		}, opts);

		this.naipes = opt.naipes;

		//Inicio [cartas]
		for(var a=1; a<=opt.num; a++){
			this.cartas.push( a );
		}
		//Fim [cartas]

		//Inicio [naipes]
		var bgcolor = "";
		var fgcolor = "";
		for(var a=0; a<this.naipes.length; a++){
			var naipe = this.naipes[a];

			if(naipe == "diams"){
				bgcolor = opt.diams_bg;
				fgcolor = opt.diams_fg;
			}

			if(naipe == "spades"){
				bgcolor = opt.spades_bg;
				fgcolor = opt.spades_fg;
			}

			if(naipe == "hearts"){
				bgcolor = opt.hearts_bg;
				fgcolor = opt.hearts_fg;
			}

			if(naipe == "clubs"){
				bgcolor = opt.clubs_bg;
				fgcolor = opt.clubs_fg;
			}

			for(var b=0; b<this.cartas.length; b++){
				var id = this.cartas[b];
				var c = new Carta();
				c.init({ id: id, naipe: this.naipes[a], bgcolor: bgcolor, fgcolor: fgcolor, back: opt.back});
				this.body.push( c );
			}
		}
		//Fim [naipes]

		return false;
	}

	this.merge = function(d1, d2){
		this.body = d1.body.concat(d2.body);
		return this;
	}

	this.order = function(){
		var temp = {"diams": [], "spades": [], "hearts": [], "clubs": []};
		while(this.body.length > 0){
			var c = this.body.pop();
			temp[c.naipe].push(c);
		}
		for(var key in temp){
			//temp[key].sort(function(a, b){return b.id-a.id});
			temp[key].sort(function(a, b){
				var a = a.id;
				var b = b.id;
				if(a == "1"){a = "14"}
				if(b == "1"){b ="14"}
				return b-a
			});
		}
		this.body = temp["diams"].concat( temp["spades"] );
		this.body = this.body.concat( temp["hearts"] );
		this.body = this.body.concat( temp["clubs"] );
		return false;
	}

	this.order_coringa = function(){
		var temp = [];
		var dois = this.find_carta_val("2", 1);
		for(var carta in this.body){
			var c = this.body[carta];
			var c_next = this.body[parseInt(carta)+1];
			if(c && c_next && parseInt(c.id)-parseInt(c_next.id) > 1 && dois){
				this.body.splice(parseInt(carta)+1, 0, dois);
				return false;
			}
		}
		if(dois){
			this.body.push(dois);
		}
		return false;
	}

	this.order_joker = function(){
		var temp = [];
		var joker = this.find_carta_val("0", 1);
		for(var carta in this.body){
			var c = this.body[carta];
			var c_next = this.body[parseInt(carta)+1];
			if(c && c_next && parseInt(c.id)-parseInt(c_next.id) > 1 && joker){
				this.body.splice(parseInt(carta)+1, 0, joker);
				return false;
			}
		}
		if(joker){
			this.body.push(joker);
		}
		return false;
	}

	this.order_ace = function(){
		var ace = this.find_carta_val("1", 1);
		var max = 13;
		var min = 2;
		if(this.body.length > 0){
			max = this.body[0].id;
			min = this.body[this.body.length-1].id;
		}
		if(this.body.length >= 3){
			if(min == 2 && this.body[this.body.length-2].id != 3){
				min = this.body[this.body.length-2].id;
			}
		}
		if(ace){
			if((14 - max) <= (min - 1)){
				this.body.splice(0, 0, ace);
			}else{
				this.body.push(ace);
			}
		}
		return false;
	}

	this.shuffle = function(){
		var temp = [];
		while(this.body.length > 0){
			var r = Math.floor(Math.random() * this.body.length);
			var c = this.body.splice(r, 1);
			temp.push( c[0] );
		}
		this.body = temp;

		return false;
	}

	this.compra = function(){
		var c = this.body.pop();
		return c;
	}

	this.coringa_obj = function(){
		var ret = {total: 0, cartas: []};
		for(var carta in this.body){
			var c = this.body[carta];
			if(c.id == "2"){
				ret.cartas.push(c);
			}
		}
		ret.total = ret.cartas.length;
		return ret;
	}

	this.find_naipe = function(){
		var ret = "";
		for(var carta in this.body){
			var c = this.body[carta];
			if(c.id != "2" && c.id != "0"){
				ret = c.naipe;
				break;
			}
		}
		return ret;
	}

	this.find_carta_val = function(id, rem){
		for(var carta in this.body){
			var c = this.body[carta];
			if(c.id == id){
				this.body.splice(carta, parseInt(rem));
				return c;
			}
		}
		return false;
	}

	this.find_carta = function(uid){
		for(var carta in this.body){
			var c = this.body[carta];
			if(c.uid == uid){
				this.body.splice(carta, 1);
				return c;
			}
		}
		return false;
	}

	this.canastra = function(){
		// 1=real, 2=suja
		var ret = 0;
		var tot = this.body.length;
		var delta = 0;
		var delta_temp = 0;

		for(var carta in this.body){
			var c = this.body[carta];
			var c_next = this.body[parseInt(carta)+1];
			if(c && c_next){
				if(carta == 0 && c.id == "1"){
					c_ind = 14;
				}else{
					c_ind = parseInt(c.id);
				}
				delta_temp = Math.abs(c_ind-parseInt(c_next.id));
				delta = Math.max(delta, delta_temp);
			}
		}

		var c = this.body[Math.floor(tot/2)];
		if(c.id == "1"){
			delta = 0;
		}

		var joker = this.find_carta_val("0", 0);
		var dois = this.find_carta_val("2", 0);
		var naipe = this.find_naipe();
		var coringa = this.coringa_obj();
		//var naipe = this.body[0].naipe;
		console.log(coringa);

		if(delta == 1 && tot >=7 && (!dois || dois && dois.naipe == naipe)){
			ret = 1;
		}

		if(delta == 1 && tot >=7 && (dois && dois.naipe != naipe)){
			ret = 2;
		}

		if(delta > 1 && tot >= 7){
			ret = 2;
		}

		if(delta == 0 && tot >= 7 && !dois){
			ret = 1;
		}

		if(delta == 0 && tot >= 7 && dois){
			ret = 2;
		}

		if(tot >= 7 && dois && coringa.total >= 2){
			ret = 2;
		}

		if(tot >= 7 && joker){
			ret = 2;
		}

		//if(dois){ this.body.push(dois); }
		//this.order_coringa();
		return ret;
	}

	this.soma_jogo = function(){
		var ret = 0;
		for(var carta in this.body){
			var c = this.body[carta];
			ret += cartas[c.id].pontos;
		}
		return ret;
	}

	return false;
}
// Fim [deck]

// Inicio [init]
exports.initGame = function(sio, socket){
	//console.log("initGame...");
	io = sio;
	gameSocket = socket;

	gameSocket.on("retomar", retomar);
	gameSocket.on("connect_refresh", connect_refresh);
	gameSocket.on("editar_deck_ver", editar_deck_ver);
	gameSocket.on("editar_deck_aplicar", editar_deck_aplicar);
	gameSocket.on("sala_cria", sala_cria);
	gameSocket.on("sala_entra", sala_entra);
	gameSocket.on("sala_start", sala_start);
	gameSocket.on("deck_compra", deck_compra);
	gameSocket.on("player_descarta", player_descarta);
	gameSocket.on("mesa_compra", mesa_compra);
	gameSocket.on("baixar_jogo", baixar_jogo);
	gameSocket.on("baixar_jogo_add", baixar_jogo_add);
	gameSocket.on("baixar_jogo_rem", baixar_jogo_rem);
	gameSocket.on("deck_serial", deck_serial);
	gameSocket.on("pegar_morto", pegar_morto);
	gameSocket.on("resumo", resumo);
	gameSocket.on("proxima", proxima);
	gameSocket.on("terminar", terminar);
	gameSocket.on("morto_mesa", morto_mesa);
	gameSocket.on("disconnect", disconnect);

	gameSocket.emit("conn_init", { socket_id: socket.id, player_id: uuidv4("xxx-xxx") });
	//gameSocket.join("lobby");
}
// Fim [init]


// Inicio [funcao]
// Inicio [uuidv4]
function uuidv4(mask){
	if(!mask){
		mask = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
	}
	return mask.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
// Fim [uuidv4]

// Inicio [disconnect]
function disconnect(data){
	//var rooms = io.sockets.adapter.sids[gameSocket.id];
	//for(var room in rooms) { gameSocket.leave(room); }
	return false;
}
// Fim [disconnect]

// Inicio [retomar]
function retomar(data){
	console.log("-----------------");
	console.log("retomar...");
	console.log(data);
	for(var sala in salas){
		var s = salas[sala];
		var p = s.findPlayer(data.player);
		if(p){
			//console.log(p.player.nome, p.player.socket);
			p.player.socket = data.socket;
			p.player.sala = sala;
			//console.log(data.player, p, s);
			io.sockets.sockets[p.player.socket].join(s.id);
			if(s.started){
				io.sockets.sockets[p.player.socket].leave("lobby");
				//s.sock_change("lobby", s.id);
				//io.in(s.id).emit("sala_start_ok", {sala: salas[sala]});
				io.sockets.sockets[p.player.socket].emit("sala_start_ok", {sala: salas[sala]});
				return false;
			}
		}
	}
	//gameSocket.join("lobby");
	io.sockets.sockets[data.socket].join("lobby");
	io.in("lobby").emit("sala_entra_ok", {salas: salas});
	return false;
}
// Fim [retomar]

// Inicio [connect_refresh]
function connect_refresh(data){
	console.log("-----------------");
	console.log("connect_refresh...");
	console.log(data);
	if(data.player_id){
		io.sockets.sockets[data.socket_id].join("lobby");
		for(var sala in salas){
			var s = salas[sala];
			var p = s.findPlayer(data.player_id);
			if(p){
				p.player.socket = data.socket_id;
				io.sockets.sockets[data.socket_id].join(s.id);
				if(s.started){
					//io.sockets.sockets[data.socket_id].leave("lobby");
					//io.sockets.sockets[data.socket_id].emit("sala_start_ok", {sala: s});
					//setTimeout(function(){ retomar({player: p.player.id, socket: data.socket_id}); }, 900);
					retomar({player: p.player.id, socket: data.socket_id});
					return false;
				}
				//retomar({player: p.player.id, socket: data.socket_id});
				//io.sockets.sockets[data.socket_id].leave("lobby");
			}
		}
		io.in("lobby").emit("sala_entra_ok", {salas: salas});
	}
	return false;
}
// Fim [connect_refresh]

// Inicio [socket_emit_all]
function socket_emit_all(action, data){
	var sockets = io.sockets.sockets;
	for(var socketId in sockets){
		var s = sockets[socketId];
		s.emit(action, data); 
	}
	return false;
}
// Fim [socket_emit_all]

// Inicio [editar_deck_ver]
function editar_deck_ver(data){
	console.log("-----------------");
	console.log("editar_deck_ver...");
	console.log(data);
	var sala = salas[data.sala];
	var sockets = io.sockets.sockets;
	var s = sockets[data.socket];
	s.emit("editar_deck_ver_ok", {sala: sala});
	return false;
}
// Fim [editar_deck_ver]

// Inicio [editar_deck_aplicar]
function editar_deck_aplicar(data){
	console.log("-----------------");
	console.log("editar_deck_aplicar...");
	console.log(data);
	var sala = salas[data.sala];
	var cores = data.cores;
	sala.cores.joker = cores.joker;
	sala.cores.feltro = cores.feltro;
	sala.cores.diams.bg = cores.diams.bg;
	sala.cores.diams.fg = cores.diams.fg;
	sala.cores.spades.bg = cores.spades.bg;
	sala.cores.spades.fg = cores.spades.fg;
	sala.cores.hearts.bg = cores.hearts.bg;
	sala.cores.hearts.fg = cores.hearts.fg;
	sala.cores.clubs.bg = cores.clubs.bg;
	sala.cores.clubs.fg = cores.clubs.fg;
	return false;
}
// Fim [editar_deck_aplicar]

// Inicio [sala_cria]
function sala_cria(data) {
	console.log("-----------------");
	console.log("sala_cria...");
	console.log(data);
	var sala = new Sala();
	sala.cria();

	data.salas = salas;

	io.in("lobby").emit("sala_cria_ok", data);
	//socket_emit_all("sala_cria_ok", data);
	return false;
}
// Fim [sala_cria]

// Inicio [sala_entra]
function sala_entra(data){
	console.log("-----------------");
	console.log("sala_entra...");
	console.log(data);
	//console.log(io);
	//var room = io.sockets.adapter.rooms[data.sala]
	if(salas.hasOwnProperty(data.sala)){
		if(salas[data.sala].started){return false;}
		//gameSocket.join(data.sala);
		var p = new Player();
		p.cria(data.id, data.socket_id, data.nome, data.lugar);
		var so = io.sockets.sockets[p.socket];

		for(var s in salas){
			salas[s].removePlayer(p);
			so.leave(s);
		}
		var s = salas[data.sala];
		s.addPlayer(p, data.lugar);

		so.join(data.sala);
		p.sala = data.sala;

		data.salas = salas;
		io.in("lobby").emit("sala_entra_ok", data);
	}else{
		gameSocket.emit("console", { console: "Sala não encontrada..." });
	}
	return false;
}
// Fim [sala_entra]

// Inicio [sala_start]
function sala_start(data){
	console.log("-----------------");
	console.log("sala_start...");
	console.log(data);
	var sala = salas[data.sala];
	if(sala && (sala.started || sala.vazia())){return false;}
	sala.embaralhar = data.embaralhar;
	sala.start();
	//sala.start_debug();

	//console.log( io.sockets.adapter.rooms[sala.id].sockets );
	io.in(sala.id).emit("sala_start_ok", {sala: sala});
	//io.sockets.in(sala.id).emit("sala_start_ok", {sala: sala});
	return false;
}
// Fim [sala_start]

// Inicio [deck_compra]
function deck_compra(data){
	console.log("-----------------");
	console.log("deck_compra...");
	console.log(data);
	var s = salas[data.sala];
	var p = s.findPlayer(data.player);

	if(!s.checa_vez(p.player)){
		io.sockets.sockets[p.player.socket].emit("jogo_alerta", {sala: s, alerta: {txt: "Espere a sua vez!"}});
		return false;
	}

	if(s.flag_compra){
		io.sockets.sockets[p.player.socket].emit("jogo_alerta", {sala: s, alerta: {txt: "Você já comprou!"}});
		return false;
	}
	s.flag_compra = true;

	var c = s.deck.compra();
	p.player.compra( c );
	var acao = {audio:{src: "comprar_baralho", out: []}};

	io.in(data.sala).emit("sala_update_ok", {sala: s, carta: [c.uid], acao: acao});
	return false;
}
// Fim [deck_compra]

// Inicio [player_descarta]
function player_descarta(data){
	console.log("-----------------");
	console.log("player_descarta...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	var p = s.findPlayer(data.player);

	if(!s.checa_vez(p.player)){
		io.sockets.sockets[p.player.socket].emit("jogo_alerta", {sala: s, alerta: {txt: "Espere a sua vez!"}});
		return false;
	}

	if(!s.flag_compra){
		io.sockets.sockets[p.player.socket].emit("jogo_alerta", {sala: s, alerta: {txt: "Você precisa comprar primeiro!"}});
		return false;
	}

	if(s.flag_descarta){
		io.sockets.sockets[p.player.socket].emit("jogo_alerta", {sala: s, alerta: {txt: "Você já descartou!"}});
		return false;
	}
	s.flag_descarta = true;

	var c = p.player.discarta(data.carta);
	s.add_mesa(c);
	s.add_vez();

	var audio_player = s.players[s.vez].id;
	var acao = {audio:{src: "atencao", in: [audio_player]}, anima:{tipo: "slideInLeft", cartas: [c.uid]}};

	io.in(data.sala).emit("sala_update_ok", {sala: s, acao: acao});
	return false;
}
// Fim [player_descarta]

// Inicio [mesa_compra]
function mesa_compra(data){
	console.log("-----------------");
	console.log("mesa_compra...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	var p = s.findPlayer(data.player);

	if(!s.checa_vez(p.player)){
		io.sockets.sockets[p.player.socket].emit("jogo_alerta", {sala: s, alerta: {txt: "Espere a sua vez!"}});
		return false;
	}

	if(s.flag_compra){
		io.sockets.sockets[p.player.socket].emit("jogo_alerta", {sala: s, alerta: {txt: "Você já comprou!"}});
		return false;
	}
	s.flag_compra = true;

	var temp = s.compra_mesa(p);
	var acao = {audio:{src: "comprar_mesa", out: []}};
	io.in(data.sala).emit("sala_update_ok", {sala: s, carta: temp, acao: acao});
	return false;
}
// Fim [mesa_compra]

// Inicio [baixar_fix]
function baixar_fix(p_dest){
	console.log("-----------------");
	console.log("baixar_fix...");
	console.log(p_dest);
	for(var jogo in p_dest.player.jogos){
		var j = p_dest.player.jogos[jogo];
		if(j.body.length <= 0){
			p_dest.player.jogos.splice(jogo, 1);
		}
	}
	return false;
}
// Fim [baixar_fix]

// Inicio [baixar_jogo]
function baixar_jogo(data){
	console.log("-----------------");
	console.log("baixar_jogo...");
	console.log(data);
	var anima_cartas = [];
	var s = salas[data.sala];
	if(!s){ return false; }
	var p = s.findPlayer(data.player);
	var p_dest = s.findPlayer(data.player_dest);
	var d1 = new Deck();
	for(var carta in data.cartas){
		var uid = data.cartas[carta];
		anima_cartas.push(uid);
		var c = p.player.deck.find_carta(uid);
		p.player.pts += cartas[c.id].pontos;
		if(c){
			d1.body.push(c);
		}
	}
	//p.player.jogos.push(d1);
	//p.player.jogos[p.player.jogos.length-1].order();
	p_dest.player.jogos.push(d1);
	p_dest.player.jogos[p_dest.player.jogos.length-1].order();
	p_dest.player.jogos[p_dest.player.jogos.length-1].order_coringa();
	p_dest.player.jogos[p_dest.player.jogos.length-1].order_joker();
	p_dest.player.jogos[p_dest.player.jogos.length-1].order_ace();
	baixar_fix( p_dest );
	p_dest.player.calcula();

	var acao = {audio:{src: "baixar_jogo", out: []}, anima:{tipo: "slideInUp", cartas: anima_cartas}};
	io.in(data.sala).emit("sala_update_ok", {sala: s, acao: acao});
	return false;
}
// Fim [baixar_jogo]

// Inicio [baixar_jogo_add]
function baixar_jogo_add(data){
	console.log("-----------------");
	console.log("baixar_jogo_add...");
	console.log(data);
	var anima_cartas = [];
	var s = salas[data.sala];
	if(!s){ return false; }
	var p = s.findPlayer(data.player);
	var p_dest = s.findPlayer(data.player_dest);
	for(var carta in data.cartas){
		var uid = data.cartas[carta];
		anima_cartas.push(uid);
		var c = p.player.deck.find_carta(uid);
		p.player.pts += cartas[c.id].pontos;
		//console.log(p.player.jogos[data.jogo]);
		//p.player.jogos[data.jogo].body.push(c);
		if(c){
			p_dest.player.jogos[data.jogo].body.push(c);
		}
	}
	//p.player.jogos[data.jogo].order();
	p_dest.player.jogos[data.jogo].order();
	p_dest.player.jogos[data.jogo].order_coringa();
	p_dest.player.jogos[data.jogo].order_joker();
	p_dest.player.jogos[data.jogo].order_ace();
	baixar_fix( p_dest );
	p_dest.player.calcula();
	var acao = {audio:{src: "baixar_jogo", out: []}, anima:{tipo: "slideInUp", cartas: anima_cartas}};
	io.in(data.sala).emit("sala_update_ok", {sala: s, acao: acao});
	return false;
}
// Fim [baixar_jogo_add]

// Inicio [baixar_jogo_rem]
function baixar_jogo_rem(data){
	console.log("-----------------");
	console.log("baixar_jogo_rem...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	var p = s.findPlayer(data.player);
	var p_dest = s.findPlayer(data.player_dest);
	for(var carta in data.cartas){
		var uid = data.cartas[carta];
		var c = p.player.jogos[data.jogo].find_carta(uid);
		p_dest.player.pts -= cartas[c.id].pontos;
		//p.player.deck.body.push(c);
		if(c){
			p_dest.player.deck.body.push(c);
		}
	}
	//p.player.deck.order();
	p_dest.player.deck.order();
	//p_dest.player.deck.order_coringa();
	//p_dest.player.deck.order_ace();
	baixar_fix( p_dest );
	p_dest.player.calcula();
	io.in(data.sala).emit("sala_update_ok", {sala: s});
	return false;
}
// Fim [baixar_jogo_rem]

// Inicio [deck_serial]
function deck_serial(data){
	console.log("-----------------");
	console.log("deck_serial...");
	console.log(data);
	//console.log(data.serial);
	var s = salas[data.sala];
	if(!s){ return false; }
	var p = s.findPlayer(data.player);
	var d1 = new Deck();
	for(var serial in data.serial){
		var uid = data.serial[serial];
		var c = p.player.jogos[data.jogo].find_carta(uid);
		if(c){
			d1.body.splice(serial, 0, c);
		}
	}
	p.player.jogos[data.jogo] = d1;
	p.player.calcula();
	io.in(data.sala).emit("sala_update_ok", {sala: s});
	return false;
}
// Fim [deck_serial]

// Inicio [pegar_morto]
function pegar_morto(data){
	console.log("-----------------");
	console.log("pegar_morto...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	var p = s.findPlayer(data.player);
	if(s.morto.length > 0 && p.player.deck.body.length <= 0){
		var m = s.morto.pop();
		p.player.deck = new Deck();
		p.player.deck = m;
		p.player.morto = true;
		p.player.pts += 100;

		io.in(data.sala).emit("sala_update_ok", {sala: s});
	}

	return false;
}
// Fim [pegar_morto]

// Inicio [resumo]
function resumo(data){
	console.log("-----------------");
	console.log("resumo...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	s.calculo_final();
	io.in(data.sala).emit("resumo_ok", {sala: s, player: data.player});
	return false;
}
// Fim [resumo]

// Inicio [proxima]
function proxima(data){
	console.log("-----------------");
	console.log("proxima...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	//s.calculo_final();
	for(var player in s.players){
		var p = s.players[player];
		if(p){
			p.morto = false;
			p.score = p.score_temp;
			p.pts += p.pts_temp;
		}
	}
	s.start();
	io.in(data.sala).emit("proxima_ok", {sala: s});
	return false;
}
// Fim [proxima]

// Inicio [terminar]
function terminar(data){
	console.log("-----------------");
	console.log("terminar...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	s.calculo_final();
	
	//var historico = s.historico_load();
	//s.historico_grava(historico);

	s.sock_change(s.id, "lobby");
	delete salas[s.id];
	io.in("lobby").emit("terminar_ok", {salas: salas});
	return false;
}
// Fim [terminar]

// Inicio [morto_mesa]
function morto_mesa(data){
	console.log("-----------------");
	console.log("morto_mesa...");
	console.log(data);
	var s = salas[data.sala];
	if(!s){ return false; }
	if(s.morto.length > 0){
		s.deck = new Deck();
		s.deck = s.morto.pop();
	}
	io.in(data.sala).emit("sala_update_ok", {sala: s});
	return false;
}
// Fim [morto_mesa]

// Inicio [extend]
function extend(a, b){
	for(var key in b)
		if(b.hasOwnProperty(key))
			a[key] = b[key];
	return a;
}
// Fim [extend]

// Inicio [write_file]
function write_file(nome, txt, enc){
	//enc types: "ascii", "utf8", "base64"
	console.log("-----------------");
	console.log("write_file...");
	console.log(nome, txt, enc);

	if(!enc){
		enc = "utf8";
	}
	fs = require("fs");
	fs.writeFile(nome, txt, enc, function (err) {
		console.log(txt);
		if(err){ return console.log(err) };
	});
	return false;
}
// Fim [write_file]

// Inicio [Left]
function Left(str, n){
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else
		return String(str).substring(0,n);
}
// Fim [Left]

// Inicio [Right]
function Right(str, n){
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else {
		var iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
}
// Fim [Right]

// Inicio [formatadata_mascara]
function formatadata_mascara(dt, mask){
	var ret = "";
	var dia, mes, ano, hora, minuto, segundo;
	dia = Right("0"+dt.getDate(), 2);
	mes =  Right("0"+(dt.getMonth()+1), 2);
	ano =  Right("0000"+dt.getFullYear(), 4);
	hora =  Right("0"+dt.getHours(), 2);
	minuto =  Right("0"+dt.getMinutes(), 2);
	segundo =  Right("0"+dt.getSeconds(), 2);

	ret = mask;
	ret = ret.replace("d", dia);
	ret = ret.replace("m", mes);
	ret = ret.replace("a", ano);
	ret = ret.replace("h", hora);
	ret = ret.replace("n", minuto);
	ret = ret.replace("s", segundo);
	return ret;
}
// Fim [formatadata_mascara]

// Inicio [idle_ping]
function idle_ping(time){
	setInterval(function(){
		for(var sala in salas){
			var s = salas[sala];
			console.log("idle ping..."+s.id);
			//io.in(s.id).emit("idle_ping", {url: "http://192.168.0.21:2000/client/index.html"});
			io.in(s.id).emit("idle_ping", {url: "https://jogo-buraco.herokuapp.com"});
		}
	}, time);
	return false;
}
// Fim [idle_ping]
// Fim [funcao]

idle_ping(1000*60*20);

/*
io.sockets.clients(someRoom).forEach(function(s){
s.leave(someRoom);
});
*/