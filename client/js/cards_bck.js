var carta = {
	1: {label: "A", ponto: 20},
	2: {label: "2", ponto: 10},
	3: {label: "3", ponto: 5},
	4: {label: "4", ponto: 5},
	5: {label: "5", ponto: 5},
	6: {label: "6", ponto: 5},
	7: {label: "7", ponto: 5},
	8: {label: "8", ponto: 10},
	9: {label: "9", ponto: 10},
	10: {label: "10", ponto: 10},
	11: {label: "J", ponto: 10, sprite: "jack"},
	12: {label: "Q", ponto: 10, sprite: "queen"},
	13: {label: "K", ponto: 10, sprite: "king"}
};

var di = null;
var d = null;
var m = null;

function Display(){
	this.size = {w: 100, h: 140};
	this.ns = 16;
	this.na = 40;
	this.imgs = {};

	this.preload = function(imgs, cb){
		var t = this;
		var img = imgs.pop();
		if(img != undefined){
			var obj = new Image();
			obj.onload = function(){
				t.imgs[img] = obj;
				t.preload(imgs, cb);
			}
			obj.src = "imgs/"+img+".svg";
		}
		if(img == undefined){
			cb();
		}
		return false;
	}

	this.canvas_back = function(c){
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: this.size.w, height: this.size.h});
		var ctx = canvas[0].getContext("2d");

		var img = this.imgs["back"];

			ctx.beginPath();
			ctx.drawImage(img, 0, 0, this.size.w, this.size.h);
			ctx.globalCompositeOperation = "source-atop";
			ctx.fillStyle = c.back;
			ctx.fillRect(0, 0, this.size.w, this.size.h);
			ctx.closePath();

		return ctx.canvas.toDataURL("image/png");
	}

	this.canvas_fig = function(c){
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: this.size.w, height: this.size.h});
		var ctx = canvas[0].getContext("2d");

		var img = this.imgs[carta[c.id].sprite];

			ctx.beginPath();
			ctx.drawImage(img, 0, 0, this.size.w, this.size.h);
			ctx.globalCompositeOperation = "source-atop";
			ctx.fillStyle = c.cor;
			ctx.fillRect(0, 0, this.size.w, this.size.h);
			ctx.closePath();

			/*
			ctx.beginPath();
			ctx.globalCompositeOperation = "source-over";
			ctx.lineWidth = 1;
			ctx.strokeStyle = c.cor;
			ctx.rect(20, 20, this.size.w*0.6, this.size.h*0.65);
			ctx.stroke();
			ctx.closePath();
			*/

			//$("body").append(canvas);

		return ctx.canvas.toDataURL("image/png");
	}

	this.canvas = function(c){
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: this.na, height: this.na});
		var ctx = canvas[0].getContext("2d");

		var img = this.imgs[c.naipe];

			ctx.beginPath();
			ctx.drawImage(img, 0, 0, this.na, this.na);
			ctx.globalCompositeOperation = "source-atop";
			ctx.fillStyle = c.cor;
			ctx.fillRect(0, 0, this.na, this.na);
			ctx.closePath();
			//$("body").append(canvas);

		return ctx.canvas.toDataURL("image/png");
	}

	this.draw = function(c){
		var body = $("<div></div>");

		if(c.id == 1){
			var fs = this.na;
			var x = this.size.w/2;
			var y = this.size.h/2;

			var el = $("<span class='"+c.naipe+"'></span>");
			var img = this.canvas( c );
			//el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url(imgs/"+c.naipe+"_mask.svg) center no-repeat "+c.cor});
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});

			body.append( el );
		}

		if(c.id == 2){
			var fs = this.ns;
			var x = this.size.w/2;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 3){
			var fs = this.ns;
			var x = this.size.w/2;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 4){
			var fs = this.ns;
			var x = this.size.w/4;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 5){
			var fs = this.ns;
			var x = this.size.w/4;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*2, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 6){
			var fs = this.ns;
			var x = this.size.w/4;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 7){
			var fs = this.ns;
			var x = this.size.w/4;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*2, top: y*1.5, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 8){
			var fs = this.ns;
			var x = this.size.w/4;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*2, top: y*1.5, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*2, top: y*2.5, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 9){
			var fs = this.ns;
			var x = this.size.w/4;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*1.7, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*2, top: y*2, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*2.4, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*1.7, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*2.4, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 10){
			var fs = this.ns;
			var x = this.size.w/4;
			var y = this.size.h/4;

			var img = this.canvas( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*2, top: y*1.5, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*2, top: y*2.5, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*1.7, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*2.4, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*1.7, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*2.4, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );

			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x*3, top: y*3, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 11){
			var fs = this.size.w;
			var x = this.size.w/2;
			var y = this.size.h/2;

			var img = this.canvas_fig( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 12){
			var fs = this.size.w;
			var x = this.size.w/2;
			var y = this.size.h/2;

			var img = this.canvas_fig( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		if(c.id == 13){
			var fs = this.size.w;
			var x = this.size.w/2;
			var y = this.size.h/2;

			var img = this.canvas_fig( c );
			var el = $("<span class='"+c.naipe+"'></span>");
			el.css({position: "absolute", left: x, top: y, width: fs, height: fs, "margin-left": -fs/2, "margin-top": -fs/2, background: "url("+img+") center no-repeat", "background-size": fs});
			body.append( el );
		}

		var span = $("<span class='carta'><span class='ind'>"+carta[c.id].label+"<br/>&"+c.naipe+";</span></span>");
		span.css({width: this.size.w, height: this.size.h, color: c.cor, "background-color": c.cor_back});
		span.append( body.html() );

		return span;
	}

	return false;
}

function Morto(){
	this.morto = [];

	this.init = function(d){
		this.morto.push( [] );
		this.morto.push( [] );

		for(var a=1; a<=22; a++){
			if(a%2 == 0){
				this.morto[1].push( d.compra() );
			}else{
				this.morto[0].push( d.compra() );
			}
		}
		return false;
	}
	return false;
}

function Deck(cor_1, cor_2, cor_back){
	this.cartas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	this.deck = [];
	this.cor_1 = cor_1;
	this.cor_2 = cor_2;
	this.back = cor_back;

	this.init = function(back){
		//Inicio [ouros]
		for(var a=0; a<this.cartas.length; a++){
			this.deck.push( {id: this.cartas[a], naipe: "diams", cor: this.cor_1, cor_back: this.back, back: back} );
		}
		//Fim [ouros]

		//Inicio [paus]
		for(var a=0; a<this.cartas.length; a++){
			this.deck.push( {id: this.cartas[a], naipe: "clubs", cor: this.cor_2, cor_back: this.back, back: back} );
		}
		//Fim [paus]

		//Inicio [copas]
		for(var a=0; a<this.cartas.length; a++){
			this.deck.push( {id: this.cartas[a], naipe: "hearts", cor: this.cor_1, cor_back: this.back, back: back} );
		}
		//Fim [copas]

		//Inicio [espadas]
		for(var a=0; a<this.cartas.length; a++){
			this.deck.push( {id: this.cartas[a], naipe: "spades", cor: this.cor_2, cor_back: this.back, back: back} );
		}
		//Fim [espadas]

		return false;
	}

	this.shuffle = function(){
		var temp = [];
		while(this.deck.length > 0){
			var r = Math.floor(Math.random() * this.deck.length);
			var c = this.deck.splice(r, 1);
			temp.push( c[0] );
		}
		this.deck = temp;

		return false;
	}

	this.compra = function(){
		var c = this.deck.pop();
		return c;
	}

	return false;
}

function comprar(){
	if(d.deck.length > 0){
		var c = d.compra();
		$(".mesa").append( di.draw( c ) );
		if(d.deck.length > 0){
			var b = d.deck[d.deck.length-1];
			$(".comprar").css({background: "url("+di.canvas_back( b )+") center #fff"});
		}else{
			$(".comprar").css({background: "transparent"});
		}
	}
}

function create(){
	var d1 = new Deck("#EC2BD2", "#33EC2B", "#444444");
	d1.init("#ff0000");
	//d1.shuffle();

	var d2 = new Deck("#ff0000", "#444444", "#ffffff");
	d2.init("#0000ff");
	//d2.shuffle();

	d = new Deck();
	d.deck = d1.deck.concat(d2.deck);
	d.shuffle();

	//m = new Morto();
	//m.init( d );

/*
	for(var a=0; a<d1.deck.length; a++){
		var c = d1.deck[a];
		$("body").append( di.draw( c ) );
		if(c.id%13 == 0){
			$("body").append( "<br/>" );
		}
	}

	for(var a=0; a<d2.deck.length; a++){
		var c = d2.deck[a];
		$("body").append( di.draw( c ) );
		if(c.id%13 == 0){
			$("body").append( "<br/>" );
		}
	}

	for(var a=0; a<m.morto[0].length; a++){
		var c = m.morto[0][a];
		$("body").append( di.draw( c ) );
	}
	$("body").append( "<br/>" );
	for(var a=0; a<m.morto[1].length; a++){
		var c = m.morto[1][a];
		$("body").append( di.draw( c ) );
	}
	$("body").append( "<br/>" );
	for(var a=0; a<d.deck.length; a++){
		var c = d.deck[a];
		$("body").append( di.draw( c ) );
	}
	*/

	console.log( d );
	console.log( m );

	$("body").append( "<span onclick='comprar();'><span class='carta comprar'></span></span>" );
	$("body").append( "<span class='mesa'></span>" );
	var b = d.deck[d.deck.length-1];
	$(".comprar").css({width: di.size.w, height: di.size.h, background: "url("+di.canvas_back( b )+") center #fff"});
}

function init(){
	di = new Display();
	di.preload( ["clubs", "diams", "hearts", "spades", "jack", "queen", "king", "back"], function(){create();} );
}

$(function(){
	init();
	return false;
});