var display = null;
var deck = null;
var game = null;

var cartas = {
	1: {label: "A", pontos: 20},
	2: {label: "2", pontos: 10},
	3: {label: "3", pontos: 5},
	4: {label: "4", pontos: 5},
	5: {label: "5", pontos: 5},
	6: {label: "6", pontos: 5},
	7: {label: "7", pontos: 5},
	8: {label: "8", pontos: 10},
	9: {label: "9", pontos: 10},
	10: {label: "10", pontos: 10},
	11: {label: "J", pontos: 10, sprite: "jack"},
	12: {label: "Q", pontos: 10, sprite: "queen"},
	13: {label: "K", pontos: 10, sprite: "king"}
};

function Carta(){
	this.uid = null;
	this.id = null;
	this.naipe = null;
	this.bgcolor = null;
	this.fgcolor = null;
	this.back = null;

	this.uuidv4 = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	this.init = function(opts){
		var opt = $.extend({
			bgcolor: "#ffffff",
			fgcolor: "#444444",
			back: "#eeeeee",
		}, opts);

	this.uid = this.uuidv4();
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

function Deck(){
	this.cartas = [];
	this.naipes = [];
	this.body = [];

	this.init = function(opts){
		var opt = $.extend({
			bgcolor_1: "#ffffff",
			fgcolor_1: "#ff0000",
			bgcolor_2: "#ffffff",
			fgcolor_2: "#444444",
			back: "#eeeeee",
			num: 13,
			naipes: ["diams", "clubs", "hearts", "spades"]
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
			if(naipe == "diams" || naipe == "hearts"){
				bgcolor = opt.bgcolor_1;
				fgcolor = opt.fgcolor_1;
			}else{
				bgcolor = opt.bgcolor_2;
				fgcolor = opt.fgcolor_2;
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

	return false;
}

function Game(){
	this.init = function(){
		var t = this;
		display = new Display();
		display.preload( ["clubs", "diams", "hearts", "spades", "jack", "queen", "king", "back"], function(){
			t.create();
		} );
	}

	this.create = function(){
		var d1 = new Deck();
		d1.init({bgcolor_1: "#ffffff", fgcolor_1: "#D03737", bgcolor_2: "#D03737", fgcolor_2: "#ffffff", back: "#D03737"});
		//d1.shuffle();

		var d2 = new Deck();
		d2.init({bgcolor_1: "#ffffff", fgcolor_1: "#1313AF", bgcolor_2: "#1313AF", fgcolor_2: "#ffffff", back: "#1313AF"});
		//d2.shuffle();

		deck = new Deck();
		deck.merge(d1, d2);
		//deck.shuffle();

		/*
		for(var a=0; a<deck.body.length; a++){
			var c = deck.body[a];
			var c_html = display.draw( c );
			$("body").append( c_html );
			if(c.id%13 == 0){
				$("body").append( "<br/>" );
			}
		}
		*/

	}
	return false;
}

function Display(){
	this.imgs = {};
	this.bounds = {w: 90, h: 130, na: 0, ns: 0};
	this.grid = {w: 5, h: 6};
	this.delta = {w: this.bounds.w/this.grid.w, h: this.bounds.h/this.grid.h};

	this.bounds.na = this.bounds.w/1.6;
	this.bounds.ns = this.bounds.w/5;

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

	this.draw_back = function(c){
		var carta = $("<span class='carta' uid='"+c.uid+"'></span>");
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: this.bounds.w, height: this.bounds.h});
		var ctx = canvas[0].getContext("2d");

		var back = this.tint(this.imgs["back"], this.bounds.w, this.bounds.h, c.back);
		this.naipe({w:3, h:3}, {x:1, y:1, w: this.bounds.w, h: this.bounds.h}, ctx, back);

		carta.prepend( canvas );
		return carta;
	}

	this.draw = function(c){
		var carta = $("<span class='carta' uid='"+c.uid+"'></span>");
		var canvas = $("<canvas></canvas>");
		canvas.attr({width: this.bounds.w, height: this.bounds.h});
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
			var fig = this.tint(this.imgs[c.getSprite()], this.bounds.w, this.bounds.h, c.fgcolor);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.w, h: this.bounds.h}, ctx, fig);
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 12){
			var fig = this.tint(this.imgs[c.getSprite()], this.bounds.w, this.bounds.h, c.fgcolor);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.w, h: this.bounds.h}, ctx, fig);
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		if(c.id == 13){
			var fig = this.tint(this.imgs[c.getSprite()], this.bounds.w, this.bounds.h, c.fgcolor);
			this.naipe({w:4, h:5}, {x:1.5, y:2, w: this.bounds.w, h: this.bounds.h}, ctx, fig);
			this.naipe({w:4, h:5}, {x:0.5, y:0.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
			this.naipe({w:4, h:5}, {x:2.5, y:3.5, w: this.bounds.ns, h: this.bounds.ns}, ctx, naipe);
		}

		var borda = tinycolor(c.bgcolor).darken(20).toString();
		carta.css({"border-color": borda});

		var ind = $("<span class='ind'>"+c.getLabel()+"</span>");
		ind.css({color: c.fgcolor, "font-size": this.bounds.w/5 + "px"});
		carta.append(ind);

		carta.prepend( canvas );
		return carta;
	}

	return false;
}

$(function(){
	game = new Game();
	game.init();

	return false;
});