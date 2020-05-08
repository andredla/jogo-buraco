var player_id = "";
var socket_id = "";
var sala_id = "";
var render = null;
var cartas = null;
var arr_cartas = [];
var data_old = null;
var flag_serial = true;
var jogo_pos = [];
var flag_morto = false;
var flag_resource = false;

$.getJSON("/client/js/cartas.json", function(json){
	cartas = json;
});

// Inicio [socket_recebe]
socket.on("conn_init", conn_init);
socket.on("console", console_log);
socket.on("editar_deck_ver_ok", editar_deck_ver_ok);
socket.on("sala_cria_ok", sala_cria_ok);
socket.on("sala_entra_ok", sala_entra_ok);
socket.on("sala_start_ok", sala_start_ok);
socket.on("sala_update_ok", sala_update_ok);
socket.on("terminar_ok", terminar_ok);
// Fim [socket_recebe]

// Inicio [render]
function Render(){
	this.imgs = {};
	this.bounds = {w: 70, h: 110, na: 0, ns: 0};
	this.grid = {w: 5, h: 6};
	this.delta = {w: this.bounds.w/this.grid.w, h: this.bounds.h/this.grid.h};
	this.bounds.na = this.bounds.w/2;
	this.bounds.ns = this.bounds.w/5;

	this.pixel_ratio = function(){
		var canvas = $("<canvas></canvas>");
		var ctx = canvas[0].getContext("2d");
		var dpr = window.devicePixelRatio || 1;
		var bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
		return dpr / bsr;
	}

	this.createCanvas = function(w, h, ratio){
		if(!ratio){ ratio = this.pixel_ratio(); }
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: w*ratio, height: h*ratio});
		canvas.css({width: w*ratio, height: h*ratio});
		var ctx = canvas[0].getContext("2d");
		ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		return canvas;
	}

	this.eye = function(){
		var player_deck = $(".player_deck");
		var eye = $(".display_cartas canvas");
		if(player_deck.css("display") != "none"){
			//cor = "#83A9A2";
			eye.css({opacity: 0.3});
		}else{
			//cor = "#ffffff";
			eye.css({opacity: 1});
		}
		return false;
	}

	this.preview = function(naipe){
		var naipe_bg = $("#"+naipe+"_bg").val();
		var naipe_fg = $("#"+naipe+"_fg").val();

		var span = $("<span></span>");
		for(var a=1; a<=13; a++){
			var c = {uid: "x"+a, id: a, naipe: naipe, bgcolor: naipe_bg, fgcolor: naipe_fg};
			var c_html = this.draw(c, 50, 90);
			c_html.removeAttr("onclick");
			span.append(c_html);
		}

		return span.children();
	}

	this.audio_play = function(){
		var acao = data_old.acao;
		if(acao && acao.audio){
			//console.log(acao);
			var audio = $(".audio_"+acao.audio.src);
			if($.inArray(player_id, acao.audio.in) >= 0){
				audio[0].play();
			}
		}
		return false;
	}

	this.anima = function(){
		var acao = data_old.acao;
		delete data_old.sala["acao"];
		if(acao && acao.anima){
			for(var carta in acao.anima.cartas){
				var uid = acao.anima.cartas[carta];
				$("span[uid='"+uid+"']").each(function(){
					console.log(this);
					$(this).addClass("animated "+acao.anima.tipo).bind("animationend", function(){
						$(this).removeClass("animated "+acao.anima.tipo);
					});
				});
			}
		}
		return false;
	}

	this.salas = function(data){
		var salas = $(".lobby .salas");
		salas.html("");

		for(var s in data.salas){
			var sala = $("<span class='sala' sid='"+s+"'><span class='lugares'><span class='P1' onclick='sala_entra(1, \""+s+"\");'></span><span class='P2' onclick='sala_entra(2, \""+s+"\");'></span><span class='P3' onclick='sala_entra(3, \""+s+"\");'></span><span class='P4' onclick='sala_entra(4, \""+s+"\");'></span></span><span class='opts'><span onclick='sala_start(\""+s+"\");'>Começar</span><br/><span onclick='editar_deck(\""+s+"\");'>Editar baralho</span><br/><span onclick='editar_deck_ver(\""+s+"\");'>Ver baralho</span></span></br>");
			salas.append( sala );
			for(var p in data.salas[s].players){
				var player = data.salas[s].players[p];
				if(player){
					$("[sid='"+s+"'] .P"+player.lugar).html(player.nome);
				}
				//console.log( data.salas[s].players[p] );
			}
		}
		return false;
	}

	this.debug = function(data){
		//console.log(data);
		var div = $("<div></div>");
		for(var carta in data.sala.deck.body){
			var c = data.sala.deck.body[carta];
			var c_html = render.draw( c );
			div.append( c_html );
		}
		$(".jogo").append( div );
		return false;
	}

	this.lead_zero = function(num, size){
		var s = "000000000" + num;
		return s.substr(s.length-size);
	}

	this.morto_btn = function(){
		//console.log(data_old.sala.players);
		for(var player in data_old.sala.players){
			var p = data_old.sala.players[player];
			if(p && p.id == player_id){
				if(data_old.sala.morto.length > 0 && flag_morto == false && p.deck.body.length <=0){
					var btn_morto = $("<span class='btn btn_morto' onclick='pegar_morto();'>Pegar morto</span>");
					$(".player_deck").prepend(btn_morto);
				}
			}
		}
		return false;
	}

	this.mesa = function(data){
		var div = $(".mesa");
		div.html("");
		var deck = data.sala.mesa.body;
		if(deck && deck.length > 0){
			var c = this.draw( deck[deck.length-1] );
			c.removeAttr("onclick");
			div.html( c );
			div.append( "<span class='num'>"+this.lead_zero(deck.length, 2)+"</span>" );
		}
		return false;
	}

	this.mesa_deck = function(data){
		var mesa_deck = $(".mesa_deck");
		mesa_deck.html("");
		var mesa = data.sala.mesa.body;
		for(var carta in mesa){
			var c = mesa[carta];
			var c_html = render.draw( c );
			c_html.removeAttr("onclick");
			mesa_deck.append( c_html );
		}
		$(".mesa_deck").dialog({
			"buttons":{"Comprar": function(){ mesa_compra(); }},
			close: function( event, ui ) { arr_cartas = []; }
		}).closest(".ui-dialog").draggable({containment: ""});
		return false;
	}

	this.deck = function(data){
		var div = $(".deck");
		var deck = data.sala.deck.body;
		var c = this.draw_back( deck[deck.length-1] );
		div.html( c );
		if(deck.length > 0){
			div.append( "<span class='num'>"+this.lead_zero(deck.length, 2)+"</span>" );
		}
		return false;
	}

	this.players = function(data){
		//console.log(data);
		//var div = $(".players");
		var div = $(".meio");
		var btn_adm = $("<span class='btn btn_adm' onclick='menu_adm();'>...</span>");
		//div.html("");
		$(".players").html("");
		var players = data.sala.players;
		var p_out = $("<span class='players'></span>");
		for(var player in players){
			var p = players[player];
			if(p){
				var p_html = $("<span class='player' uid='"+p.id+"' onclick='player_click(this);'><span class='nome'>"+p.nome+"</span></span>");
				var p_cartas = $("<span class='num'>"+p.deck.body.length+"</span>");
				if(p.morto){
					p_morto = $("<span class='morto_on'></span>");
				}else{
					p_morto = $("<span class='morto'></span>");
				}
				p_score = $("<span class='score'>"+jogo_decide(p.id).score_temp+"</span>");
				if(data.sala.lugares[data.sala.vez] == p.lugar){
					p_html.addClass("destaque");
					if(p.id != player_id){
						render.jogos( jogo_decide(p.id).id, ".other_jogos" );
					}
				}
				p_html.append(p_cartas);
				p_html.append(p_morto);
				p_html.append(p_score);
				//div.append(p_html);

				p_out.append(p_html);
				p_out.prepend(btn_adm);
				div.prepend(p_out);
			}
		}
		return false;
	}

	this.jogos = function(uid, classe){
		//console.log(data_old, classe);
		var div = $(classe);
		div.html("");
		for(var player in data_old.sala.players){
			var p = data_old.sala.players[player];
			if(p && p.id == uid){
				for(var jogo in p.jogos){
					var j = p.jogos[jogo].body;
					var span = $("<span class='baixado' onclick=\"jogo_baixado("+jogo+", '"+p.id+"');\"></span>");
					for(var carta in j){
						var c = j[carta];
						var c_html = render.draw( c, 60, 90 );
						c_html.css({position: "absolute", "left": 60/2*carta+"px"});
						c_html.removeAttr("onclick");
						span.css({"width": (60/2*j.length)+30+"px"});
						span.append( c_html );
					}
					if(j.length >=7){
						$(span.find(".carta")[j.length-1]).css({"-webkit-transform": "translate(-30%, 16%) rotate(90deg)"});
					}
					if(classe == ".other_jogos"){
						span.removeAttr("onclick");
					}else{
						$(" .player_jogo_deck").sortable();
					}
					if(p.jogos_label[jogo]){
						var label = $("<span class='label jogo_"+p.jogos_label[jogo]+"'>"+p.jogos_label[jogo]+"</span>");
						span.append(label);
					}
					div.append(span);
				}
			}
		}
		return false;
	}

	this.player_deck = function(data){
		//console.log(data);
		//this.bounds.w = 70;
		//this.bounds.h = 110;
		var player_deck = $(".player_deck");
		player_deck.html("");
		for(var player in data.sala.players){
			var p = data.sala.players[player];
			if(p){
				if(p.id == player_id){
					flag_morto = p.morto;
					var grupo = $("<span class='grupo'></span>");
					var idx = 0;
					var naipe_old = "";
					for(var carta in p.deck.body){
						var c = p.deck.body[carta];
						var c_html = render.draw( c );
						//if(data.carta && data.carta == c.uid){
							if(data.carta && $.inArray(c.uid, data.carta) >= 0){
							//c_html.css({border: "1px solid #00ff00"});
							//c_html.css({background: "#00ff00", opacity: 0.6});
							c_html.addClass("destaque");
						}

						if(naipe_old != c.naipe){
							grupo.css({"width": (70/2*idx)+0+"px"});
							naipe_old = c.naipe;
							idx = 0;
							var grupo = $("<span class='grupo'></span>");
						}

						grupo.append(c_html)
						c_html.css({position: "absolute", "left": 70/2*idx+"px"});
						player_deck.append(grupo);
						idx++;

						//player_deck.append( c_html );
					}
					grupo.css({"width": (70/2*idx)+30+"px"});
				}
			}
		}
		//$( ".player_deck" ).dialog({close: function( event, ui ) { arr_cartas = []; }});
		return false;
	}

	this.preload = function(imgs, cb){
		var t = this;
		var img = imgs.pop();
		if(img != undefined){
			var obj = new Image();
			obj.onload = function(){
				t.imgs[img] = obj;
				t.preload(imgs, cb);
			}
			obj.src = "/client/imgs/"+img+".svg";
		}
		if(img == undefined){
			cb();
		}
		return false;
	}

	this.tint = function(img, w, h, cor){
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: w, height: h});
		var ctx = canvas[0].getContext("2d");

		ctx.beginPath();
		ctx.drawImage(img, 0, 0, w, h);
		ctx.globalCompositeOperation = "source-atop";
		ctx.fillStyle = cor;
		ctx.fillRect(0, 0, w, h);
		ctx.closePath();

		return canvas;
	}

	this.draw_grid = function(g, ctx){
		var delta = {w: this.bounds.w/g.w, h: this.bounds.h/g.h};
		ctx.save();
		ctx.globalCompositeOperation = "source-over";
		for(var a=0; a<delta.h; a++){
			for(var b=0; b<delta.w; b++){
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "#eeeeee";
				ctx.rect(delta.w*b, delta.h*a, delta.w, delta.h);
				ctx.stroke();
				ctx.closePath();
			}
		}
		ctx.restore();
	}

	this.naipe = function(g, p, ctx, img){
		var off = {x:10, y:30};
		var delta = {w: (this.bounds.w-off.x)/g.w, h: (this.bounds.h-off.y)/g.h};
		//this.draw_grid(g, ctx);

		ctx.beginPath();
		if(p.w == undefined){
			ctx.drawImage(img[0], (off.x/2)+delta.w*p.x, (off.y/2)+delta.h*p.y, delta.w, delta.h);
		}else{
			ctx.drawImage(img[0], (off.x/2)+(delta.w*p.x)-(p.w-delta.w)/2, (off.y/2)+(delta.h*p.y)-(p.h-delta.h)/2, p.w, p.h);
		}
		ctx.closePath();
	}

	this.draw_back = function(c, w, h){
		if(!c){
			return "";
		}

		if(w && h){
			this.bounds.w = w;
			this.bounds.h = h;
		}else{
			this.bounds.w = 70;
			this.bounds.h = 110;
		}

		var carta = $("<span class='carta' uid='"+c.uid+"'></span>");
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: this.bounds.w, height: this.bounds.h});
		var ctx = canvas[0].getContext("2d");

		var back = this.tint(this.imgs["back"], this.bounds.w, this.bounds.h, c.back);
		//this.naipe({w:3, h:3}, {x:1, y:1, w: this.bounds.w, h: this.bounds.h}, ctx, back);
		ctx.beginPath();
		ctx.drawImage(back[0], 0, 0, this.bounds.w, this.bounds.h);
		ctx.closePath();

		carta.prepend( canvas );
		return carta;
	}

	this.draw = function(c, w, h){
		if(w && h){
			this.bounds.w = w;
			this.bounds.h = h;
		}else{
			this.bounds.w = 70;
			this.bounds.h = 110;
		}

		var carta = $("<span class='carta' uid='"+c.uid+"' onclick='add_carta(this);'></span>");
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: this.bounds.w, height: this.bounds.h});
		//var canvas = this.createCanvas(this.bounds.w, this.bounds.h);
		var ctx = canvas[0].getContext("2d");

		ctx.fillStyle = c.bgcolor;
		ctx.fillRect(0, 0, this.bounds.w, this.bounds.h);

		var naipe = this.tint(this.imgs[c.naipe], this.bounds.na, this.bounds.na, c.fgcolor);
		if(c.id == 1){
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.na, h: this.bounds.na}, ctx, naipe);
			//$("body").append( naipe );
		}

		if(c.id == 2){
			this.naipe({w:4, h:5}, {x:1.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 3){
			this.naipe({w:4, h:5}, {x:1.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 4){
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 5){
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 6){
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 7){
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:1, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 8){
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:1, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:3, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 9){
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:1.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:1.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:2.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:2.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 10){
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:1, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:1.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:1.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:2.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:2.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:1.5, y:3, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:0.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 11){
			var fig = this.tint(this.imgs[cartas[c.id].sprite], this.bounds.w, this.bounds.h, c.fgcolor);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.w, h: this.bounds.h}, ctx, fig);
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 12){
			var fig = this.tint(this.imgs[cartas[c.id].sprite], this.bounds.w, this.bounds.h, c.fgcolor);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.w, h: this.bounds.h}, ctx, fig);
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 13){
			var fig = this.tint(this.imgs[cartas[c.id].sprite], this.bounds.w, this.bounds.h, c.fgcolor);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.w, h: this.bounds.h}, ctx, fig);
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		var borda = tinycolor(c.bgcolor).darken(20).toString();
		carta.css({"border-color": borda});

		var ind = $("<span class='ind'>"+cartas[c.id+""].label+"</span>");
		ind.css({color: c.fgcolor, "font-size": this.bounds.w/4.2 + "px"});
		carta.append(ind);

		carta.prepend( canvas );
		return carta;
	}

	return false;
}
// Fim [render]

// Inicio [ColorPicker]
function ColorPicker(){
	this.label = $("<span class='color_picker_label'></span>");
	this.obj = $("<span class='color_picker_obj'></span>");
	this.block = $("<canvas class='color_block' width='100' height='100'></canvas>");
	this.strip = $("<canvas class='color_strip' width='30' height='100'></canvas>");
	this.ctx_b = this.block[0].getContext("2d");
	this.ctx_s = this.strip[0].getContext("2d");
	this.drag = false;

	this.init = function(cb){
	 var block_wh = {w: parseInt(this.block.css("width")), h: parseInt(this.block.css("height"))};
	 var strip_wh = {w: parseInt(this.strip.css("width")), h: parseInt(this.strip.css("height"))};

		var rgbaColor = "rgba(255,0,0,1)";
		this.ctx_b.rect(0, 0, block_wh.w, block_wh.h);
		this.fillGradient(this.ctx_b, this.ctx_s, rgbaColor);

		this.ctx_s.rect(0, 0, strip_wh.w, strip_wh.h);
		var grd1 = this.ctx_s.createLinearGradient(0, 0, 0, strip_wh.h);
		grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
		grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
		grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
		grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
		grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
		grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
		grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
		this.ctx_s.fillStyle = grd1;
		this.ctx_s.fill();

		drag = this.drag;
		label = this.label;
		ctx_b = this.ctx_b;
		ctx_s = this.ctx_s;
		changeColor = this.changeColor;
		change_block = this.change_block;
		fillGradient = this.fillGradient;

		this.block.bind("mousedown touchstart", function(ev){
			ev.preventDefault();
			drag = true;
			changeColor(ev, ctx_b, cb);
		});

		this.block.bind("mousemove touchmove", function(ev){
			ev.preventDefault();
			if(drag){
				changeColor(ev, ctx_b, cb);
			}
		});

		this.block.bind("mouseup touchend", function(ev){
			ev.preventDefault();
			drag = false;
		});

		this.strip.bind("mousedown touchstart", function(ev){
			ev.preventDefault();
			drag = true;
			change_block(ev, ctx_b, ctx_s);
		});

		this.strip.bind("mousemove touchmove", function(ev){
			ev.preventDefault();
			if(drag){
				change_block(ev, ctx_b, ctx_s);
			}
		});

		this.strip.bind("mouseup touchend", function(ev){
			ev.preventDefault();
			drag = false;
		});

		var div = $("<div></div>");
		div.append(this.label);
		this.obj.append(this.block);
		this.obj.append(this.strip);
		div.append(this.obj);

		return div;
	}

	this.fillGradient = function(ctx1, ctx2, rgba){
		//console.log("fillGradient", ctx1, ctx2, rgba);
		ctx1.fillStyle = rgba;
		ctx1.fillRect(0, 0, ctx1.canvas.clientWidth, ctx1.canvas.clientHeight);

		var grdWhite = ctx2.createLinearGradient(0, 0, ctx1.canvas.clientWidth, 0);
		grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
		grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
		ctx1.fillStyle = grdWhite;
		ctx1.fillRect(0, 0, ctx1.canvas.clientWidth, ctx1.canvas.clientHeight);

		var grdBlack = ctx2.createLinearGradient(0, 0, 0, ctx1.canvas.clientHeight);
		grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
		grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
		ctx1.fillStyle = grdBlack;
		ctx1.fillRect(0, 0, ctx1.canvas.clientWidth, ctx1.canvas.clientHeight);
		//return false;
	}

	this.changeColor = function(e, ctx1, cb){
		if(e != undefined){
	  ex = e.pageX || e.originalEvent.touches[0].pageX;
	  ey = e.pageY || e.originalEvent.touches[0].pageY;
	  var b = ctx1.canvas.getBoundingClientRect();
	  x = Math.floor(ex - b.left);
	  y = Math.floor(ey - b.top);
	  var imageData = ctx1.getImageData(x, y, 1, 1).data;
	  rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
	  label.css({"background-color": rgbaColor});
	  //$("#cor").val(rgbaColor);
	  //ret = rgbaColor;
	  cb(rgbaColor);
		}
		return false;
	}

	this.change_block = function(e, ctx1, ctx2){
		if(e != undefined){
			ex = e.pageX || e.originalEvent.touches[0].pageX;
			ey = e.pageY || e.originalEvent.touches[0].pageY;
	  var b = ctx2.canvas.getBoundingClientRect();
	  x = Math.floor(ex - b.left);
	  y = Math.floor(ey - b.top);
			var imageData = ctx2.getImageData(x, y, 1, 1).data;
			rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
			fillGradient(ctx1, ctx2, rgbaColor);
		}
		return false;
	}
	return false;
}
// Fim [ColorPicker]

// Inicio [editar_deck]
function editar_deck(sala){
	$(".editar_deck_janela .diams .grupo_preview").html( render.preview("diams") );
	$(".editar_deck_janela .spades .grupo_preview").html( render.preview("spades") );
	$(".editar_deck_janela .hearts .grupo_preview").html( render.preview("hearts") );
	$(".editar_deck_janela .clubs .grupo_preview").html( render.preview("clubs") );

	$(".editar_deck_janela .diams .ctl_bg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#diams_bg").val(hexcolor);
		$(".editar_deck_janela .diams .grupo_preview").html( render.preview("diams") );
	});
	$(".editar_deck_janela .diams .ctl_fg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#diams_fg").val(hexcolor);
		$(".editar_deck_janela .diams .grupo_preview").html( render.preview("diams") );
	});

	$(".editar_deck_janela .spades .ctl_bg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#spades_bg").val(hexcolor);
		$(".editar_deck_janela .spades .grupo_preview").html( render.preview("spades") );
	});
	$(".editar_deck_janela .spades .ctl_fg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#spades_fg").val(hexcolor);
		$(".editar_deck_janela .spades .grupo_preview").html( render.preview("spades") );
	});

	$(".editar_deck_janela .hearts .ctl_bg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#hearts_bg").val(hexcolor);
		$(".editar_deck_janela .hearts .grupo_preview").html( render.preview("hearts") );
	});
	$(".editar_deck_janela .hearts .ctl_fg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#hearts_fg").val(hexcolor);
		$(".editar_deck_janela .hearts .grupo_preview").html( render.preview("hearts") );
	});

	$(".editar_deck_janela .clubs .ctl_bg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#clubs_bg").val(hexcolor);
		$(".editar_deck_janela .clubs .grupo_preview").html( render.preview("clubs") );
	});
	$(".editar_deck_janela .clubs .ctl_fg").drawrpalette().bind("choose.drawrpalette", function(event, hexcolor){
		$("#clubs_fg").val(hexcolor);
		$(".editar_deck_janela .clubs .grupo_preview").html( render.preview("clubs") );
	});

	$(".editar_deck_janela .diams .ctl_bg, .editar_deck_janela .diams .ctl_fg, .editar_deck_janela .spades .ctl_bg, .editar_deck_janela .spades .ctl_fg, .editar_deck_janela .hearts .ctl_bg, .editar_deck_janela .hearts .ctl_fg, .editar_deck_janela .clubs .ctl_bg, .editar_deck_janela .clubs .ctl_fg").bind("open.drawrpalette", function(){
		$(".editar_deck_janela").css({overflow: "visible"});
	});
	$(".editar_deck_janela .diams .ctl_bg, .editar_deck_janela .diams .ctl_fg, .editar_deck_janela .spades .ctl_bg, .editar_deck_janela .spades .ctl_fg, .editar_deck_janela .hearts .ctl_bg, .editar_deck_janela .hearts .ctl_fg, .editar_deck_janela .clubs .ctl_bg, .editar_deck_janela .clubs .ctl_fg").bind("close.drawrpalette", function(){
		$(".editar_deck_janela").css({overflow: "auto"});
	});

	//$(".editar_deck_janela .diams .ctl_bg").drawrpalette("set","#ffffff");
	//$(".editar_deck_janela .diams .ctl_fg").drawrpalette("set","#ff0000");

	$(".editar_deck_janela").dialog({ width: 900, height: 600,
		"buttons":[
		{text: "Aplicar", class: "btn", click: function(){ editar_deck_aplicar(sala); }}
		]
	}).closest(".ui-dialog").draggable({containment: ""});
	return false;
}
// Fim [editar_deck]

// Inicio [editar_deck_aplicar]
function editar_deck_aplicar(sala){
	var diams_bg = $("#diams_bg").val();
	var diams_fg = $("#diams_fg").val();
	var spades_bg = $("#spades_bg").val();
	var spades_fg = $("#spades_fg").val();
	var hearts_bg = $("#hearts_bg").val();
	var hearts_fg = $("#hearts_fg").val();
	var clubs_bg = $("#clubs_bg").val();
	var clubs_fg = $("#clubs_fg").val();
	var cores = {diams:{bg: diams_bg, fg: diams_fg}, spades: {bg: spades_bg, fg: spades_fg}, hearts: {bg: hearts_bg, fg: hearts_fg}, clubs: {bg: clubs_bg, fg: clubs_fg}};
	socket.emit("editar_deck_aplicar", {sala: sala, player: player_id, cores: cores});
	$(".editar_deck_janela").dialog("close");
	return false;
}
// Fim [editar_deck_aplicar]

// Inicio [audio_load]
function audio_load(audio){
	var audio = $(".audio_"+audio);
	audio[0].play();
	audio[0].pause();
	audio[0].currentTime = 0;
	return false;
}
// Fim [audio_load]

// Inicio [conn_init]
function conn_init(data){
	if(data.socket_id){
		socket_id = data.socket_id;
	}

	if(data.player_id){
		player_id = data.player_id;
	}

	var pid = $.cookie("player_id");
	if(!pid){
		$.cookie("player_id", player_id);
	}else{
		player_id = pid;
	}

	console.log(socket_id, player_id);
	socket.emit("connect_refresh", {socket_id: socket_id, player_id: player_id});
	return false;
}
// Fim [conn_init]

// Inicio [console_log]
function console_log(data){
	console.log(data.console);
	return false;
}
// Fim [console_log]

// Inicio [retomar]
function retomar(){
	var player_id = $.cookie("player_id");
	socket.emit("retomar", {player: player_id, socket: socket_id});
	return false;
}
// Fim [retomar]

// Inicio [editar_deck_ver]
function editar_deck_ver(sala){
	socket.emit("editar_deck_ver", {sala: sala, player: player_id, socket: socket_id });
	return false;
}
// Fim [editar_deck_ver]

// Inicio [editar_deck_ver_ok]
function editar_deck_ver_ok(data){
	var s = data.sala;
	$("#diams_bg").val(s.cores.diams.bg);
	$("#diams_fg").val(s.cores.diams.fg);
	$("#spades_bg").val(s.cores.spades.bg);
	$("#spades_fg").val(s.cores.spades.fg);
	$("#hearts_bg").val(s.cores.hearts.bg);
	$("#hearts_fg").val(s.cores.hearts.fg);
	$("#clubs_bg").val(s.cores.clubs.bg);
	$("#clubs_fg").val(s.cores.clubs.fg);

	$(".editar_deck_janela .diams .ctl_bg").val(s.cores.diams.bg);
	$(".editar_deck_janela .diams .ctl_fg").val(s.cores.diams.fg);
	$(".editar_deck_janela .spades .ctl_bg").val(s.cores.spades.bg);
	$(".editar_deck_janela .spades .ctl_fg").val(s.cores.spades.fg);
	$(".editar_deck_janela .hearts .ctl_bg").val(s.cores.hearts.bg);
	$(".editar_deck_janela .hearts .ctl_fg").val(s.cores.hearts.fg);
	$(".editar_deck_janela .clubs .ctl_bg").val(s.cores.clubs.bg);
	$(".editar_deck_janela .clubs .ctl_fg").val(s.cores.clubs.fg);

	$(".editar_deck_janela .diams .ctl_bg").drawrpalette("set", s.cores.diams.bg);
	$(".editar_deck_janela .diams .ctl_fg").drawrpalette("set", s.cores.diams.fg);
	$(".editar_deck_janela .spades .ctl_bg").drawrpalette("set", s.cores.spades.bg);
	$(".editar_deck_janela .spades .ctl_fg").drawrpalette("set", s.cores.spades.fg);
	$(".editar_deck_janela .hearts .ctl_bg").drawrpalette("set", s.cores.hearts.bg);
	$(".editar_deck_janela .hearts .ctl_fg").drawrpalette("set", s.cores.hearts.fg);
	$(".editar_deck_janela .clubs .ctl_bg").drawrpalette("set", s.cores.clubs.bg);
	$(".editar_deck_janela .clubs .ctl_fg").drawrpalette("set", s.cores.clubs.fg);

	editar_deck(s.id);
	return false;
}
// Fim [editar_deck_ver_ok]

// Inicio [sala_cria]
function sala_cria(){
	socket.emit("sala_cria", {});
	return false;
}
// Fim [sala_cria]

// Inicio [sala_cria_ok]
function sala_cria_ok(data){
	//console.log( data );
	render.salas( data );
	return false;
}
// Fim [sala_cria_ok]

// Inicio [sala_entra]
function sala_entra(lugar, sala){
	//console.log(lugar, sala);
	audio_load("atencao");
	var nome = $("#player_nome").val();
	$.cookie("player_nome", nome);
	data = {id: player_id, socket_id: socket_id, nome: nome, sala: sala, lugar: lugar};
	socket.emit("sala_entra", data);
	return false;
}
// Fim [sala_entra]

// Inicio [sala_entra_ok]
function sala_entra_ok(data){
	render.salas(data);
	//bi.LightboxEsconde();
	return false;
}
// Fim [sala_entra_ok]

// Inicio [sala_start]
function sala_start(sala){
	socket.emit("sala_start", {sala: sala});
	return false;
}
// Fim [sala_start]

// Inicio [sala_start_ok]
function sala_start_ok(data){
	//console.log(data);
	if(flag_resource == false){
		setTimeout(function(){ sala_start_ok(data); }, 500);
	}
	sala_id = data.sala.id;
	var cb_data = data;
	$(".mesa").html("");
	$(".other_jogos").html("");
	$(".player_jogos").html("");
	$(".player_deck").html("");
	$(".lobby").hide();
	$(".jogo").show();
	//bi.LightboxEsconde();

	sala_update_ok( cb_data );
	//render.preload( ["clubs", "diams", "hearts", "spades", "jack", "queen", "king", "back"], function(){
		//sala_update_ok( cb_data );
	//});
	return false;
}
// Fim [sala_start_ok]

// Inicio [menu_adm]
function menu_adm(){
	$(".menu_adm").dialog({
	    modal: true,
	    autoOpen: false,
	    closeOnEscape: true,
	    title: false,
	    dialogClass: "menu_adm_opt",
	    width: "auto",
	    height: 80,
	    resizable: false,
	    draggable: false,
	    open: function (event, ui) {
	        $(".ui-widget-overlay").bind("click", function () {
	            $(".menu_adm").dialog("close");
	        });
	    }
	});
	$(".menu_adm").dialog("open");
	return false;
}
// Fim [menu_adm]

// Inicio [terminar_ok]
function terminar_ok(data){
	data_old = data;
	//$(".meio").dialog("destroy");
	//$(".player_deck").dialog("destroy");
	$(".player_jogo").dialog("destroy");
	$(".jogo").hide();
	$(".lobby").show();
	socket.emit("retomar", {player: player_id, socket: socket_id});
}
// Fim [terminar_ok]

// Inicio [deck_compra]
function deck_compra(){
	if(arr_cartas.length <= 0){
		socket.emit("deck_compra", {sala: sala_id, player: player_id});
	}
	return false;
}
// Fim [deck_compra]

// Inicio [display_cartas]
function display_cartas(){
	arr_cartas = [];
	$(".carta").removeClass("action");

	var player_deck = $(".player_deck");
	if(player_deck.css("display") == "none"){
		player_deck.css({display: "block"});
	}else{
		player_deck.css({display: "none"});
	}

	render.eye();
	//$( ".meio" ).dialog();
	//$(".player_deck").dialog();
	return false;
}
// Fim [display_cartas]

// Inicio [add_carta]
function add_carta(carta){
	//console.log(arr_cartas);
	$(".player_deck .carta").removeClass("destaque");
	var c = $(carta);
	var flag = $.inArray(c.attr("uid"), arr_cartas);
	if(flag < 0){
		c.addClass("action");
		arr_cartas.push( c.attr("uid") );
	}else{
		c.removeClass("action");
		arr_cartas.splice( flag, 1 );
	}
	return false;
}
// Fim [add_carta]

// Inicio [mesa]
function mesa(){
	if(arr_cartas.length > 0){
		socket.emit("player_discarta", {player: player_id, sala: sala_id, carta: arr_cartas.pop()});
		arr_cartas = [];
	}else{
		render.mesa_deck( data_old );
	}
	return false;
}
// Fim [mesa]

// Inicio [mesa_compra]
function mesa_compra(){
	socket.emit("mesa_compra", {player: player_id, sala: sala_id});
	$(".mesa_deck").dialog("close");
	return false;
}
// Fim [mesa_compra]

// Inicio [baixar_jogo]
function baixar_jogo(){
	if(arr_cartas.length > 0){
		socket.emit("baixar_jogo", {player: player_id, sala: sala_id, cartas: arr_cartas, player_dest: jogo_decide(player_id).id});
		arr_cartas = [];
	}
	return false;
}
// Fim [baixar_jogo]

// Inicio [jogo_baixado_adicionar]
function jogo_baixado_adicionar(ind){
	flag_serial = false;
	if(arr_cartas.length > 0){
		socket.emit("baixar_jogo_add", {player: player_id, sala: sala_id, jogo: ind, cartas: arr_cartas, player_dest: jogo_decide(player_id).id});
		arr_cartas = [];
		$(".player_jogo_deck").dialog("close");
	}
	return false;
}
// Fim [jogo_baixado_adicionar]

// Inicio [jogo_baixado_remover]
function jogo_baixado_remover(ind){
	flag_serial = false;
	if(arr_cartas.length > 0){
		socket.emit("baixar_jogo_rem", {player: player_id, sala: sala_id, jogo: ind, cartas: arr_cartas, player_dest: jogo_decide(player_id).id});
		arr_cartas = [];
		$(".player_jogo_deck").dialog("close");
	}
	return false;
}
// Fim [jogo_baixado_remover]

// Inicio [jogo_baixado]
function jogo_baixado(ind, pid){
	flag_serial = true;
	if(arr_cartas.length <=0){
		var div = $(".player_jogo_deck");
		div.html("");
		for(var player in data_old.sala.players){
			var p = data_old.sala.players[player];
			if(p && p.id == pid){
				var j = p.jogos[ind];
				for(var carta in j.body){
					var c = j.body[carta];
					var c_html = render.draw( c );
					div.append( c_html );
				}
			}
		}
	
		div.dialog({
			"buttons":{ "Adicionar": function(){ jogo_baixado_adicionar(ind); },
			"Remover": function(){ jogo_baixado_remover(ind); }},
			close: function( event, ui ) {
				arr_cartas = [];
				if(flag_serial){
					socket.emit("deck_serial", {player: pid, sala: sala_id, jogo: ind, serial: serial(".player_jogo_deck .carta")});
				}
			}
		}).closest(".ui-dialog").draggable({containment: ""});
	}else{
		jogo_baixado_adicionar(ind);
	}
	return false;
}
// Fim [jogo_baixado]

// Inicio [serial]
function serial(el){
	var temp = [];
	$(el).each(function(){
		temp.push( $(this).attr("uid") );
	});
	return temp;
}
// Fim [serial]

// Inicio [player_click]
function player_click(el){
	var pid = $(el).attr("uid");
	render.jogos( jogo_decide(pid).id, ".other_jogos" );
	return false;
}
// Fim [player_click]

// Inicio [jogo_pos_fn]
function jogo_pos_fn(pid){
	var ret = [];
	var temp = null;
	for(var  player in data_old.sala.players){
		var p = data_old.sala.players[player];
		if(p && p.id == player_id){
			ret.push(p);
		}
	}

		if(ret[0].lugar == 1 || ret[0].lugar == 3 && data_old.sala.players[3]){
			ret.push(data_old.sala.players[1]);
		}else{
			ret.push(data_old.sala.players[0]);
		}
	return ret;
}
// Fim [jogo_pos_fn]

// Inicio [jogo_decide]
function jogo_decide(pid){
	//console.log(data_old);
	var ret = null;
	for(var player in data_old.sala.players){
		var p = data_old.sala.players[player];
		if(p && p.id == pid){
			ret = p;
			if(p.lugar == 3 && data_old.sala.players[3] != null){
				return data_old.sala.players[0];
			}
			if(p.lugar == 4){
				return data_old.sala.players[1];
			}
		}
	}
	return ret;
}
// Fim [jogo_decide]

// Inicio [pegar_morto]
function pegar_morto(){
	socket.emit("pegar_morto", {player: player_id, sala: sala_id});
	return false;
}
// Fim [pegar_morto]

// Inicio [proxima]
function proxima(){
	$(".menu_adm").dialog("close");
	$(".other_jogos").html("");
	socket.emit("proxima", {player: player_id, sala: sala_id});
	return false;
}
// Fim [proxima]

// Inicio [terminar]
function terminar(){
	$(".menu_adm").dialog("close");
	socket.emit("terminar", {player: player_id, sala: sala_id});
	return false;
}
// Fim [terminar]

// Inicio [morto_mesa]
function morto_mesa(){
	$(".menu_adm").dialog("close");
	socket.emit("morto_mesa", {player: player_id, sala: sala_id});
	return false;
}
// Fim [morto_mesa]

// Inicio [sala_update_ok]
function sala_update_ok(data){
	console.log(data);
	//render.deck( data );
	data_old = data;
	flag_morto = false;
	jogo_pos = jogo_pos_fn(player_id);
	render.players( data );
	render.mesa( data );
	render.deck( data );
	render.player_deck( data );
	render.jogos( jogo_decide(jogo_pos[0].id).id, ".player_jogos" );
	render.morto_btn();

	render.audio_play();
	render.anima();

	/*
	$(".carta").each(function(){
		var rand = Math.floor(Math.random() * 100) + 1;
		$(this).attr({refresh: rand});
	});
	*/

	return false;
}
// Fim [sala_update_ok]
// Fim [funcao]

$(function(){
	$("#player_nome").val( $.cookie("player_nome") );
	render = new Render();
	bi.LightboxExibe({lightbox: "load"});
	render.preload( ["clubs", "diams", "hearts", "spades", "jack", "queen", "king", "back", "eye"], function(){
		flag_resource = true;
		var eye = render.tint(render.imgs["eye"], 50, 50, "#ffffff");
		$(".display_cartas").html(eye);
		render.eye();
		bi.LightboxEsconde();
		//setTimeout(function(){ bi.LightboxEsconde(); }, 1000);
	});
});