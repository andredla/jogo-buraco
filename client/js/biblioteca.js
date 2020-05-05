// JavaScript Document
// Biblioteca feita por André Lemos
// data revisao 27/02/2014
// Inicio [biblioteca]
(function(){
	var app = function(){
		return new private();
	};
		
	var private = function(){
	};
		
	private.prototype = {
		
		z_index: 500,
		over_tempo: 300,
		over_opacidade: 0.7,
		
		desenvolvedor: false,
		beta: false,
		jquery_drag: false,
		touching: "",
		touching_el: "",
		tooltip: true,
		drag: null,
		
		pnotify: false,
		stack_topleft: {"dir1": "up", "dir2": "left", "push": "bottom", "spacing1": 15, "spacing2": 15},
		stack_topright: {"dir1": "up", "dir2": "right", "push": "bottom", "spacing1": 15, "spacing2": 15},
		stack_bottomleft: {"dir1": "down", "dir2": "left", "push": "bottom", "spacing1": 15, "spacing2": 15},
		stack_bottomright: {"dir1": "down", "dir2": "right", "push": "bottom", "spacing1": 15, "spacing2": 15},
		
		stack_atual: null,
		
		efeito: true,
		troca_clique: false,
		preload_imagens: false,
		evento_enter: true,
		evento_clique: true,
		
		ultimo_clique: null,
		tempo_clique: ["", ""],
		
		pasta_img: "/imgs/",
		
		bi_id: 0,
		over_id: "over",
		load_id: "load",
		lock_id: "lock",
		block_id: "block",
		zoom_id: "zoom",
		menu_id: "bi_menu",
		alerta_aviso_id: "alerta_aviso",
		alerta_sucesso_id: "alerta_sucesso",
		alerta_erro_id: "alerta_erro",
		alerta_confirma_id: "alerta_confirma",
		
		array_alertas: new Array("alerta_aviso", "alerta_sucesso", "alerta_erro", "alerta_confirma"),
		array_lightbox_abertas: new Array(),
		thread_over: new Array(),
		array_pnotify: new Array(),
		
		navegador: {},
		keycode: [
			//[48, 49, 50, 51, 52, 53, 54, 55, 56, 57], // numero
			//[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 44] // valor
			[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 0, 13], // numero
			[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 44, 8, 0, 13], // valor
			[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 44, 8, 0, 13, 59] // multi_valor
		],

		ajax_resposta: null,
		
		//array_caracteres = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;'},
		
		// Inicio [JqueryId]
		JqueryId: function(param){
			var retorna = null;
			if(param){
				if(param.id){
					var temp = param.id.replace(/\//g, "\\/");
					retorna = "#" + temp;
				}
			}
			return retorna;
		},
		// Fim [JqueryId]

		// Inicio [Config]
		Config: function(param){
			var retorna = null;
			
			retorna = bi.NavegadorConfere();
			
			//retorna = bi.AjaxExtend();
			
			//retorna = bi.TelaAlertas();
			retorna = bi.LightboxLoad();
			retorna = bi.LightboxOver();
			
			//retorna = bi.Tooltip();
			//retorna = bi.Checkbox();
			//retorna = bi.MultiSelect();
			retorna = bi.Scroll();
			//retorna = bi.Touch();
			//retorna = bi.Permite();
			//retorna = bi.MultiSelectNormal();
			//retorna = bi.Fixo();
			
			//jQuery(document).ready(function(){ bi.LightboxExibe({lightbox: bi.load_id}); });
			bi.LoadImage({img: "load.gif"});
			
			if(bi.troca_clique == true){
				retorna = bi.TrocaClique();
			}
			if(bi.preload_imagens == true){
				jQuery(document).ready(function(){bi.AchaImagens();});
			}
			if(bi.evento_enter == true){
				retorna = bi.Evento({tipo:"keypress", teclas:[13], funcao:function(){bi.ApertaEnter();}});
			}
			if(bi.evento_clique == true){
				retorna = bi.Evento({tipo:"click"});
			}
			if(bi.beta == true){
				bi.CriaScript({end: "/js/jquery-ui.js"});
				bi.CriaLink({end: "/imgs/favicon.ico"});
				bi.jquery_drag = true;
			}
			
			//jQuery(document).ready(function(){ bi.LightboxEsconde({lightbox: bi.load_id}); });
			
			return retorna;
		},
		// Fim [Config]
		
		// Inicio [ConfereNavegador]
		ConfereNavegador: function(param){
			var retorna = false;
			var versao = parseInt(jQuery.browser.version);
			var navegador = "";

			if(jQuery.browser.msie){
				navegador = "ie";
			}
						
			if(param){
				if(param.tipo && param.navegador){
					
					switch(param.tipo){
						
						case "igual":
							if(navegador == param.navegador){
								if(versao == param.versao){
									retorna = true;
								}
								/*retorna = true;
								if(param.versao){
									retorna = false;
									for(var i=0; i<param.versao.length; i++){
										if(versao == param.versao[i]){
											retorna = true;
										}
									}
								}*/
							}
							break;
							
						case "maior":
							if(navegador == param.navegador){
								if(versao > param.versao){
									retorna = true;
								}
							}else{
								return true;
							}
							break;
					}
					
				}
				
			}
			return retorna;
		},
		// Fim [ConfereNavegador]
		
		// Inicio [PreloadImagens]
		PreloadImagens: function(param){
			var retorna = null;
			var count = 0;
			var array_imagens = new Array();
			
			if(param){
				if(param.imagens){
			
					if(document.images){
						function imagem_load(){
							count++;
							if (count == param.imagens.length){
								//alert("Todas as imagens foram carregadas!");
								//if(document.getElementById(bi.load_id)){
									if(bi.ConfereDisplay({id:bi.load_id}) == true){
										bi.LightboxEsconde();
									}
									
									if(param.funcao){
										param.funcao();
									}
								//}
								retorna = true;
							}
						}
						
						for(var i=0; i<param.imagens.length; i++){
							array_imagens[i] = new Image();
							array_imagens[i].src = param.imagens[i];
							
							array_imagens[i].onload=function(){
								imagem_load();
							}
							array_imagens[i].onerror=function(){
								imagem_load();
							}
						}
					}
					
				}
			}
			return retorna;
		},
		// Fim [PreloadImagens]
		
		// Inicio [AchaImagens]
		AchaImagens: function(){
			var retorna = false;
			var arr = new Array();
			jQuery(document).find("img").each(
				function(obj){
					arr.push(this.src);
					retorna = arr;
				}
			);
			bi.PreloadImagens({imagens:arr});
			return retorna;
		},
		// Fim [AchaImagens]

		// Inicio [css]
		// Inicio [GetCss]
		GetCss: function(param){
			var retorna = "";
			if(param){
				if(param.id && param.campo){
					retorna =  jQuery(bi.JqueryId({id:param.id})).css(param.campo);
				}
			}
			return retorna;
		},
		// Fim [GetCss]
		// Fim [css]

		// Inicio [tela_dimensao]
		// Inicio [GetTelaAltura]
		GetTelaAltura: function(){
			return jQuery(window).height();
		},
		// Fim [GetTelaAltura]
		
		// Inicio [GetTelaLargura]
		GetTelaLargura: function(){
			return jQuery(window).width();
		},
		// Fim [GetTelaLargura]
		
		// Inicio [GetDocumentoAltura]
		GetDocumentoAltura: function(){
			var D = document;
			return Math.max(
				Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
				Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
				Math.max(D.body.clientHeight, D.documentElement.clientHeight)
			);
			//return jQuery(body).height();
		},
		// Fim [GetDocumentoAltura]
		
		// Inicio [GetDocumentoLargura]
		GetDocumentoLargura: function(){
			var D = document;
			return Math.max(
				Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
				Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
				Math.max(D.body.clientWidth, D.documentElement.clientWidth)
			);
			//return jQuery(document).width();
		},
		// Fim [GetDocumentoLargura]
		// Fim [tela_dimensao]

		// Inicio [tela_posicao]
		// Inicio [GetScrollY]
		GetScrollY: function(){
			return jQuery(window).scrollTop();
		},
		// Fim [GetScrollY]
		
		// Inicio [GetScrollX]
		GetScrollX: function(){
			return jQuery(window).scrollLeft();
		},
		// Fim [GetScrollX]
		
		// Inicio [Fullscreen]
		FullScreen: function(param){
			if(param){
				if(param.id){
					document.getElementById(param.id).style.width = bi.GetDocumentoLargura() + "px";
					document.getElementById(param.id).style.height = bi.GetDocumentoAltura() + "px";
				}
				if(param.destroi){
					document.getElementById(param.id).style.width = bi.GetTelaLargura() + "px";
					document.getElementById(param.id).style.height = bi.GetTelaAltura() + "px";
				}
			}
			return true;
		},
		// Fim [Fullscreen]

		// Inicio [CenterReal]
		CenterReal: function(param){
			var retorna = "";
			if(param){
				if(param.id){
					if(bi.GetCss({id:param.id, campo:"position"}) == "absolute"){
						var tela_largura = bi.GetTelaLargura();
						var tela_altura = bi.GetTelaAltura();		
												
						var div_largura = jQuery("#"+param.id).outerWidth();
						var div_altura = jQuery("#"+param.id).outerHeight();
						
						/*var div_largura_px = bi.GetCss({id:param.id, campo:"width"});
						var div_altura_px = bi.GetCss({id:param.id, campo:"height"});*/

						/*var div_largura = div_largura_px.replace("px", "");
						var div_altura = div_altura_px.replace("px", "");*/
						
						if(tela_altura > div_altura){
							document.getElementById(param.id).style.top = (tela_altura/2) - (div_altura/2) + bi.GetScrollY() + "px";		
						}else{			
							document.getElementById(param.id).style.top = bi.GetScrollY() + "px";
						}
						
						if(tela_largura > div_largura){
							document.getElementById(param.id).style.left = (tela_largura/2) - (div_largura/2) + bi.GetScrollX() + "px";			
						}else{
							document.getElementById(param.id).style.left = bi.GetScrollX() + "px";
						}
					}
				}
			}
			return retorna;
		},
		// Fim [CenterReal]
		
		// Inicio [ThreadOver]
		ThreadOver: function(param){
			if(bi.thread_over.length == 0){
				if(param){
					if(param.over){
						bi.thread_over.push(setInterval(function(){bi.OverAjusta({over:param.over});}, 500));
					}
				}
				//alert("born");
			}
		},
		// Fim [ThreadOver]
		
		// Inicio [OverAjusta]
		OverAjusta: function(param){
			var temp = null;
			if(param){
				if(param.over){
					if(bi.ConfereDisplay({id:param.over}) == true){
						temp = bi.FullScreen({id:param.over});
					}else{
						for(var i=0; i<bi.thread_over.length; i++){
							clearInterval(bi.thread_over[i]);
							//temp = bi.FullScreen({id:param.over, destroi: true});
							//alert("kill");
						}
						bi.thread_over.splice(0, bi.thread_over.length);
					}
				}
			}
		},
		// Fim [OverAjusta]
		
		// Inicio [GetPos]
		GetPos: function(param){
			var fn_el, fn_ret, fn_pos, fn_lar, fn_alt, fn_topo, fn_dir, fn_baixo, fn_esq, fn_fix, fn_disp, fn_pai, fn_debug;
			if(param){
				if(param.id){
					fn_el = jQuery("#" + param.id);
				}
				if(param.el){
					fn_el = param.el;
				}
				
				fn_pos = fn_el.offset();
				fn_pai = fn_el.position();
				
				fn_lar = fn_el.outerWidth();
				fn_alt = fn_el.outerHeight();
				
				fn_topo = fn_pos.top;
				fn_dir = fn_pos.left + fn_lar;
				fn_baixo = fn_pos.top + fn_alt;
				fn_esq = fn_pos.left;
				
				//fn_ret = [fn_topo, fn_dir, fn_baixo, fn_esq];
				fn_ret = {topo: fn_topo, direita: fn_dir, baixo: fn_baixo, esquerda: fn_esq, largura: fn_lar, altura: fn_alt, x: fn_pai.left, y: fn_pai.top};
				
				//bi.Log({texto: fn_ret});
				return fn_ret;
			}
		},
		// Fim [GetPos]
		
		// Inicio [GetSize]
		GetSize: function(param){
			var fn_el, fn_larg, fn_alt;
			if(param){
				if(param.id){
					fn_el = jQuery("#"+param.id);
				}
				if(param.el){
					fn_el = param.el;
				}
				
				fn_larg = fn_el.outerWidth();
				fn_alt = fn_el.outerHeight();
				
				fn_ret = {largura: fn_larg, altura: fn_alt};
				
				//bi.Log({texto: fn_ret});
				return fn_ret;
			}
		},
		// Fim [GetSize]
		
		// Inicio [ScrollTo]
		ScrollTo: function(param){
			var fn_ret, fn_x, fn_y, fn_dur;
			fn_x = bi.GetScrollX();
			fn_y = bi.GetScrollY();
			fn_dur = 0;
			if(param){
				if(param.x){
					fn_x = param.x;
				}
				if(param.y){
					fn_y = param.y;
				}
				if(param.duracao){
					fn_dur = param.duracao
				}
			}
			jQuery("html, body").stop().animate({scrollTop: fn_y}, fn_dur).animate({scrollLeft: fn_x}, fn_dur);
		},
		// Fim [ScrollTo]
		// Fim [tela_posicao]
		
		// Inicio [NavegadorConfere]
		NavegadorConfere: function(){
			var fn_nav;
			fn_nav = bi.navegador;
			
			fn_nav.tipo = null;
			fn_nav.mobile = false;
			
			if(jQuery.browser.opera){
				bi.navegador.tipo = "opera";
			}
			
			if(jQuery.browser.chrome){
			//if(navigator.userAgent.match(/(chrom(e|ium))/i)){
				bi.navegador.tipo = "chrome";
			}

			if(jQuery.browser.mozilla){
				bi.navegador.tipo = "firefox";
			}

			if(jQuery.browser.msie){
				bi.navegador.tipo = "msie";
			}
			
			if(jQuery.browser.safari){
				bi.navegador.tipo = "safari";
			}
			
			//if(navigator.userAgent.match(/(OS 1_|OS 2_|OS 3_|OS 4_)/i)){
			if(navigator.userAgent.match(/(OS)/i)){
				bi.navegador.tipo = "ios";
				fn_nav.mobile = true;
			}

			//if(navigator.userAgent.match(/(Android 1.|Android 2.)/i)){
			if(navigator.userAgent.match(/(Android)/i)){
				bi.navegador.tipo = "android";
				fn_nav.mobile = true;
			}
			
			bi.navegador.versao = parseInt(jQuery.browser.version);
			
			if(bi.navegador.tipo == "msie" && bi.navegador.versao < 9){
				bi.efeito = false;
			}
			
			//bi.Log({texto: bi.navegador.tipo + " - " + bi.navegador.versao + " - " + bi.navegador.mobile});
			//alert(bi.navegador.tipo + " - " + bi.navegador.versao + " - " + bi.navegador.mobile);
			
			/*jQuery(function(){
				try{
					document.createEvent("TouchEvent");
					fn_nav.touch_start = "touchstart";
					fn_nav.touch_end = "touchend";
					fn_nav.touch_move = "touchmove";
					fn_nav.touch_enter = " mouseenter";
					fn_nav.touch_leave = " mouseleave";
				}catch(e){
					fn_nav.touch_start = "mousedown";
					fn_nav.touch_end = "mouseup";
					fn_nav.touch_move = "mousemove";
					fn_nav.touch_enter = " mouseenter";
					fn_nav.touch_leave = " mouseleave";
				}
			});*/
			
			if(bi.navegador.mobile){
				//document.createEvent("TouchEvent");
				fn_nav.touch_start = "touchstart";
				fn_nav.touch_end = "touchend";
				fn_nav.touch_move = "touchmove";
				fn_nav.touch_enter = " mouseenter";
				fn_nav.touch_leave = " mouseleave";
			}else{
				fn_nav.touch_start = "mousedown";
				fn_nav.touch_end = "mouseup";
				fn_nav.touch_move = "mousemove";
				fn_nav.touch_enter = " mouseenter";
				fn_nav.touch_leave = " mouseleave";
			}
			
			fn_nav.largura = bi.GetTelaLargura();
			fn_nav.altura = bi.GetTelaAltura();
			
		},
		// Fim [NavegadorConfere]
		
		// Inicio [Touch]
		Touch: function(param){
			jQuery(function(){
				var fn_evt, fn_touch, fn_sel, fn_el;
				
				fn_sel = "*[touch]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
				}

				jQuery(fn_sel).each(function(){
					fn_el = jQuery(this);
					
					if(fn_el.attr("id") == undefined){
						fn_el.attr("id", bi.BiId());
					}

					bi.TouchRemove({id: fn_el.attr("id")});
					
					//jQuery(document).bind(fn_start, function(event){
					jQuery(this).bind(bi.navegador.touch_start, function(event){
						fn_evt = jQuery(event.target);
						fn_touch = fn_evt.attr("touch") ? fn_evt : fn_evt.parents("[touch]");
						//if(fn_evt.attr("touch") && (jQuery(event).button ? (jQuery(event).button == 0 ? true : false) : true)){
						//if(fn_evt.attr("touch") && event.which == 1){
						if(fn_touch && (event.which ? event.which == 1 ? true : false : true)){
							bi.touching = "start";
							bi.touching_el = fn_touch;
							jQuery(bi.touching_el).addClass("touch");
						}
					});
					//jQuery(document).bind("touchmove", function(event){
					jQuery(this).bind(bi.navegador.touch_move, function(event){
						bi.touching = "move"
					});
					//jQuery(document).bind(fn_end, function(event){
					jQuery(this).bind(bi.navegador.touch_end, function(event){
						fn_evt = jQuery(event.target);
						fn_evt = fn_evt.attr("touch") ? fn_evt : fn_evt.parents("[touch]");
						//fn_touch = fn_evt.attr("touch") ? fn_evt : fn_evt.parents("[touch]");
						if(fn_evt[0] === bi.touching_el[0] && (event.which ? event.which == 1 ? true : false : true)){
							event.preventDefault();
							if(bi.touching != "move"){
								eval(bi.touching_el.attr("touch"));
							}
							bi.touching = "";
							//fn_evt = jQuery(event.target);
						}
						jQuery(bi.touching_el).removeClass("touch");
						bi.touching_el = "";
					});
				
				});
				
			});
		},
		// Fim [Touch]
		
		// Inicio [TouchRemove]
		TouchRemove: function(param){
			//jQuery(function(){
				var fn_sel;
				fn_sel = "*[touch]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
				}

				jQuery(fn_sel).each(function(){
					jQuery(this).unbind(bi.navegador.touch_start + " " + bi.navegador.touch_end);
				});
			//});
		},
		// Fim [TouchRemove]
				
		// Inicio [Fixo]
		/*Fixo: function(){
			var fn_el, fn_el_pos, fn_fixo;
			jQuery(function(){
				jQuery("*[fixo]").each(function(){
					fn_el = jQuery(this);
					fn_el_pos = bi.GetPos({el: fn_el});
					fn_el.attr("fixo", fn_el_pos.topo);
				});
				
				jQuery(window).scroll(function(){
					var fn_el, fn_el_pos, fn_fixo, scroll_pos;
					scroll_pos = jQuery(this).scrollTop();
					
					if(jQuery(".fixo").get(0) == undefined){
						jQuery("body").prepend( jQuery("<div class=\"fixo\" style=\"position: absolute; display: block; z-index: 10;\"></div>") );
					}

					//jQuery("*[fixo]").each(function(){
						fn_el = jQuery("[fixo]");
						fn_el_pos = bi.GetPos({el: fn_el});
						switch(fn_el.get(0).tagName){
							case "TR":
								fn_fixo = jQuery(
									"<table class=\""+fn_el.parents("table").attr("class")+"\" border=\""+fn_el.parents("table").attr("border")+"\" cellpadding=\""+fn_el.parents("table").attr("cellpadding")+"\" cellspacing=\""+fn_el.parents("table").attr("cellspacing")+"\">" +
									fn_el[0].outerHTML +
									"</table>"
								);
								break;
						}
						
						jQuery(".fixo").css("top", scroll_pos).css("left", fn_el_pos.esquerda);
						
						if(scroll_pos >= parseInt(fn_el.attr("fixo"))){
							jQuery(".fixo").html(fn_fixo);
							//console.log(fn_el);
						}else{
							jQuery(".fixo").remove();
						}
					//});
				});
			});
		},*/
		// Fim [Fixo]
				
		// Inicio [GeraTexto]
		GeraTexto: function(param){
			var fn_arr, fn_texto;
			fn_texto = "";
			fn_arr = ["Problemas", "Bios", "Glos", "Ajuda", "Help", "Dúvidas Frequentes...", "Outros Lançamentos", "Sistemas existentes", "Glos 2", "Erro Genérico", "Sistema Fora"];
			if(param){
				if(param.size){
					for(var a=0; a<param.size; a++){
						fn_texto += fn_arr[Math.floor(Math.random()*fn_arr.length)] + " ";
					}
					return fn_texto;
				}
			}
		},
		// Fim [GeraTexto]

		// Inicio [Ajuda]
		Ajuda: function(param){
			var fn_attr, fn_el;
			fn_attr = "ajuda";
			bi.tooltip = true;
			if(param){
				if(param.attr){
					fn_attr = param.attr;
				}
			}
			fn_el = jQuery("*["+fn_attr+"]");
			jQuery(".tooltip").last().remove();
			if(fn_el.get(0) != undefined){
				jQuery("#" + bi.over_id).css("background-color", "#fff");
				bi.LightboxExibe({lightbox: bi.over_id});
			
				fn_el.each(function(){
					bi.TooltipExibe({el: jQuery(this)});
				});
			}
			
			//jQuery(".tooltip").each(function(){ jQuery(this).css("z-index", jQuery("#"+bi.over_id).css("z-index")+1); });
		},
		// Fim [Ajuda]
		
		// Inicio [EventCancel]
		EventCancel: function(fn_e){
			if (!fn_e){
				fn_e = window.event;
			}
			//IE9 & Other Browsers
			if (fn_e.stopPropagation){
				fn_e.stopPropagation();
			}
			//IE8 and Lower
			else {
				fn_e.cancelBubble = true;
			}
		},
		// Fim [EventCancel]
		
		// Inicio [CliqueOver]
		CliqueOver: function(){
			var fn_el;
			if(bi.array_lightbox_abertas.length > 0){
				fn_el = jQuery("#" + bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1]);
				//if(bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1] != bi.load_id && bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1].indexOf("alerta") != 0){
				if(jQuery(".tooltip").get(0) != undefined){
					jQuery(".tooltip").remove();
					bi.array_lightbox_abertas.pop();
					if(jQuery("." + bi.lock_id).get(0) != undefined){
						jQuery("#" + bi.over_id).css("z-index", parseInt(jQuery("#" + bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1]).css("z-index") - 1));
					}else{
						bi.array_lightbox_abertas.push("fix");
						bi.LightboxEsconde();
					}
				}else{
					if(fn_el.attr("lock") == undefined){
						//bi.LightboxEsconde();
						bi.LightboxLimpa();
						//bi.Log({texto: bi.array_lightbox_abertas[bi.array_lightbox_abertas.length]});
					}
				}
				
				jQuery("#" + bi.over_id).promise().done(function(){ jQuery(this).css("background-color", "#000"); jQuery(this).css("opacity", bi.over_opacidade); });
			}
		},
		// Fim [CliqueOver]
		
		// Inicio [LightboxLoad]
		LightboxLoad: function(){
			jQuery(document).ready(function(){
				if(jQuery("#"+bi.load_id).length <= 0){
					var div = jQuery(
						"<div id=\""+bi.load_id+"\" class=\"bi_"+bi.load_id+"_pai\" style=\"display: none; position: absolute; padding: 10px 5px 10px 5px; text-align: center; z-index: 100; border-radius : 10px 10px 10px 10px; -webkit-border-radius: 10px 10px 10px 10px; -o-border-radius: 10px 10px 10px 10px; -moz-border-radius: 10px 10px 10px 10px;\" lock=\"1\">" +
						"<center>" +
						"<span style=\"display: block; position: relative; width: 50px; height: 50px;\" class=\"bi_"+bi.load_id+"\"></span>" +
						"<span style=\"display: block; margin-top: 10px; font-family: Verdana; font-weight: bold; font-size: 11px; color: #ffffff;\">Carregando...</span>" +
						"</center>" +
						"</div>"
					);
					jQuery("body").prepend(div);
				}
			});
		},
		// Fim [LightboxLoad]
		
		// Inicio [LightboxOver]
		LightboxOver: function(){
			jQuery(document).ready(function(){
				var over_altura = jQuery(document).height();
				var div = jQuery(
					"<div id=\""+bi.over_id+"\" style=\"display: block; position: absolute; width: 100%; height: "+over_altura+"px; background-color: #000000;\" onclick = \"bi.CliqueOver();\">"
				);
				jQuery("body").prepend(div);
				
				jQuery(bi.JqueryId({id:bi.over_id})).css("display", "none");
				jQuery(bi.JqueryId({id:bi.over_id})).css("opacity", bi.over_opacidade);
				return true;
			});
		},
		// Fim [LightboxOver]
		
		// Inicio [LightboxProcura]
		LightboxProcura: function(param){
			var retorna = null;			
			if(param){
				if(param.id){
					for(var i=0; i<bi.array_lightbox_abertas.length; i++){
						if(bi.array_lightbox_abertas[i] == param.id){
							retorna = i;
						}
					}
				}
			}
			return retorna;
		},
		// Fim [LightboxProcura]
		
		// Inicio [LightboxAdiciona]
		// parametros - id
		LightboxAdiciona: function(param){
			var retorna = null;
			var temp = null;
			if(param){
				if(param.id){
					temp = bi.LightboxProcura({id:param.id});
					if(temp != null){
						retorna = bi.array_lightbox_abertas.splice(temp,1);
						// Inicio [recria]
						retorna = bi.LightboxZindexRecria();
						// Fim [recria]
					}
					retorna = bi.array_lightbox_abertas.push(param.id);
				}
			}
			return retorna;
		},
		// Fim [LightboxAdiciona]
		
		// Inicio [LightboxRemove]
		LightboxRemove: function(param){
			var retorna = null;
			if(param){
				if(param.lightbox){
					var temp = bi.LightboxProcura({id:param.lightbox});
					if(temp >= 0){
						retorna = bi.array_lightbox_abertas.splice(temp,1);
						// Inicio [recria]
						bi.LightboxZindexRecria();
						// Fim [recria]
					}
				}
			}else{
				retorna = bi.array_lightbox_abertas.pop();
			}
			return retorna;
		},		
		// Fim [LightboxRemove]
		
		// Inicio [LightboxExibe]
		LightboxExibe: function(param){
			// Inicio [param]
			if(param){
				if(!param.over){
					param.over = bi.over_id;
				}
			}
			// Fim [param]

			if(param){
				// Inicio [Lightbox]
				if(param.lightbox){
					
					if(bi.jquery_drag == true){
						jQuery(function() {
							jQuery(bi.JqueryId({id:param.lightbox})).draggable({containment: "window"});
						});
					}
					
					bi.LightboxAdiciona({id:param.lightbox});
					bi.LightboxZindex({lightbox:param.lightbox});
					bi.CenterReal({id:param.lightbox});
					/*if(bi.efeito && param.lightbox != "load"){
						bi.LightboxEfeito({id:param.lightbox});
					}else{
						bi.DivExibe({id:param.lightbox});
					}*/
				}
				// Fim [Lightbox]
				
				// Inicio [Over]
				bi.LightboxZindex({over:param.over});
				bi.FullScreen({id:param.over});
				bi.ThreadOver({over:param.over});
				if(bi.efeito){
					bi.LightboxEfeito({id:param.over});
					bi.LightboxEfeito({id:param.lightbox});
				}else{
					bi.DivExibe({id:param.over});
					bi.DivExibe({id:param.lightbox});
				}
				// Fim [Over]
			}
			
			bi.Log({texto: bi.array_lightbox_abertas});
			return false;
		},
		// Fim [LightboxExibe]
		
		// Inicio [LightboxEsconde]
		LightboxEsconde: function(param){
			// Inicio [param]
			if(param){
				if(!param.lightbox){
					param.lightbox = bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1];
				}
				if(!param.over){
					param.over = bi.over_id;
				}
			}else{
				var param = new Object;
				param.lightbox = bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1];
				param.over = bi.over_id;
			}
			// Fim [param]
			
			// Inicio [checa_lightbox]
			if(bi.LightboxProcura({id: param.lightbox}) != null){
				
				// Inicio [lightbox]
				if(bi.jquery_drag == true){
					jQuery(function() {
						if( jQuery(bi.JqueryId({id:param.lightbox})).is("ui-draggable") == true ){
							jQuery(bi.JqueryId({id:param.lightbox})).draggable("destroy");
						}
					});
				}
				
				bi.LightboxRemove({lightbox: param.lightbox});
				if(bi.efeito){
					bi.LightboxEfeito({id:param.lightbox, tipo:"fade_out"});
				}else{
					bi.DivEsconde({id:param.lightbox});
				}
				// Fim [lightbox]
				
				// Inicio [over]
				bi.LightboxZindex({over:param.over});
				
				if(!param.ignora_over){
					if(bi.array_lightbox_abertas.length<=0){
						if(bi.efeito){
							bi.LightboxEfeito({id:param.over, tipo:"fade_out"});
						}else{
							bi.DivEsconde({id:param.over});
						}
						jQuery("." + bi.lock_id).remove();
					}
					
				}
				// Fim [over]
				
				bi.Log({texto: bi.array_lightbox_abertas});
				return false;
				
			}else{
				
				if(bi.array_lightbox_abertas.length<=0){
					if(bi.efeito){
						bi.LightboxEfeito({id:param.over, tipo:"fade_out"});
					}else{
						bi.DivEsconde({id:param.over});
					}
				}
				
			}
			// Fim [checa_lightbox]
			return false;
		}, 
		// Fim [LightboxEsconde]
		
		// Inicio [LightboxLimpa]
		LightboxLimpa: function(){
			while(bi.array_lightbox_abertas.length > 0){
				bi.LightboxEsconde();
			}
			return true;
		},
		// Fim [LightboxLimpa]
		
		// Inicio [LightboxZindexRecria]
		LightboxZindexRecria: function(){
			for(var i=0; i<bi.array_lightbox_abertas.length; i++){
				//alert(bi.array_lightbox_abertas[i]);
				bi.LightboxZindex({lightbox: bi.array_lightbox_abertas[i]});
			}
		},
		// Fim [LightboxZindexRecria]
		
		// Inicio [LightboxZindex]
		LightboxZindex: function(param){
			var fn_el;
			var retorna = null;
			// Inicio [over]
			if(param.over){
				if(bi.array_lightbox_abertas.length > 0){
					retorna = bi.z_index + ((bi.array_lightbox_abertas.length-1) * 2);
					document.getElementById(param.over).style.zIndex = retorna;
				}
				fn_el = jQuery("#" + bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1]);
				if(fn_el.attr("lightboxlado") != undefined){
					document.getElementById(param.over).style.zIndex = parseInt(fn_el.css("z-index")) - 1;
				}
			} 
			// Fim [over]  
			
			// Inicio [lightbox]
			if(param.lightbox){
				if(bi.array_lightbox_abertas.length > 0){
					// retorna = bi.z_index + (bi.array_lightbox_abertas.length * 2 + 1);
					if(jQuery("#" + param.lightbox).attr("lightboxlado") == undefined){
						retorna = bi.z_index + (bi.LightboxProcura({id:param.lightbox}) * 2 + 1);
						document.getElementById(param.lightbox).style.zIndex = retorna;
					}
				}
				/*fn_el = jQuery("#" + param.lightbox);
				if(fn_el.attr("lightboxlado") != undefined){
					fn_el.css("z-index", parseInt(jQuery("#" + bi.over_id).css("z-index")) + 1 );
				}*/
			}
			// Fim [lightbox]
			return retorna;
		},
		// Fim LightboxZindex
		
		// Inicio [LightboxLado]
		LightboxLado: function(param){
			var fn_old, fn_new, fn_tela, fn_old_pos, fn_new_pos, fn_lock, fn_lock_size;
			if(param){
				if(param.id){
					fn_old = jQuery("#" + bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1]);
					fn_old_pos = bi.GetPos({el: fn_old});
					fn_new = jQuery("#" + param.id);
					fn_new_pos = bi.GetPos({el: fn_new});
					fn_tela = bi.GetTelaLargura();
					fn_lock = jQuery("." + bi.lock_id);
					fn_lock_size = parseInt(bi.GetTelaLargura() * 5/100);
					
					bi.LightboxAdiciona({id: param.id});
					
					fn_old.attr("lightboxlado", 1);
					fn_new.attr("lightboxlado", 1);
					
					if(fn_lock.get(0) == undefined){
						jQuery("body").prepend( jQuery("<div class=\""+bi.lock_id+"\" style=\"position: absolute; display: inline-block; width: "+fn_lock_size+"px; height: "+bi.GetDocumentoAltura()+"px; z-index: "+parseInt(parseInt(fn_old.css("z-index"))+1)+"; background-color: #00ff00;\" onclick=\"bi.LightboxLadoEsconde();\"></div>") );
						fn_lock = jQuery("." + bi.lock_id);
						fn_lock.css("opacity", 0);
					}else{
						fn_lock.css("z-index", parseInt(fn_old.css("z-index"))+1);
					}
					
					jQuery("body").css("overflow", "hidden");
					
					fn_old.stop().animate({left: -fn_old_pos.largura + fn_lock_size});
					fn_new.css("left", fn_tela).css("top", fn_old.css("top")).css("z-index", fn_old.css("z-index")).css("display", "block");
					fn_new.stop().animate({left: fn_tela/2 - fn_new_pos.largura/2}, function(){
						jQuery("#" + bi.over_id).css("width", fn_tela);
						jQuery("body").css("overflow", "inherit");
						//bi.FixClique({id: fn_old.attr("id"), funcao: "bi.LightboxLadoEsconde();"});
						//bi.FixClique({classe: bi.lock_id, funcao: "bi.LightboxLadoEsconde();"});
					});
				}
			}
		},
		// Fim [LightboxLado]
		
		// Inicio [LightboxLadoEsconde]
		LightboxLadoEsconde: function(){
			var fn_old, fn_new, fn_tela, fn_old_pos, fn_new_pos;
			fn_old = jQuery("#" + bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1]);
			fn_old_pos = bi.GetPos({el: fn_old});
			fn_new = jQuery("#" + bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-2]);
			fn_new_pos = bi.GetPos({el: fn_new});
			fn_tela = bi.GetTelaLargura();
			
			//fn_old.attr("onclick", "");
			//fn_new.attr("onclick", "");
			fn_old.removeAttr("onclick");
			fn_new.removeAttr("onclick");
			
			fn_old.removeAttr("lightboxlado");
			
			jQuery("body").css("overflow", "hidden");

			fn_old.stop().animate({left: fn_tela}, function(){
				jQuery(this).css("display", "none");
				jQuery("#" + bi.over_id).css("width", fn_tela);
			});
			fn_new.stop().animate({left: fn_tela/2 - fn_new_pos.largura/2}, function(){
				jQuery("body").css("overflow", "inherit");
			});
			
			bi.LightboxRemove({lightbox: bi.array_lightbox_abertas[bi.array_lightbox_abertas.length-1]});
			
			if(bi.array_lightbox_abertas.length <= 1){
				//jQuery("#" + bi.over_id).attr("onclick", "bi.CliqueOver();");
				//bi.FixClique({id: bi.over_id, funcao: "bi.CliqueOver();"});
				jQuery("." + bi.lock_id).remove();
			}
		},
		// Fim [LightboxLadoEsconde]
		
		// Inicio [Alertas]
		Alertas: function(param){
			var fn_el, fn_el_pos, fn_y;
			var alerta_id = null;
			var alerta_titulo = null;
			var alerta_texto = null;
			var alerta_ok = null;
			var alerta_cancelar = null;
			// Inicio [param]
			if(param){
				if(!param.tipo){
					param.tipo = "aviso";
				}
				// Inicio [case]
				switch(param.tipo){
					case "aviso":
						alerta_id = bi.alerta_aviso_id;
						alerta_titulo = "Aviso";
						break;
					case "sucesso":
						alerta_id = bi.alerta_sucesso_id;
						alerta_titulo = "Sucesso";
						alerta_texto = "Dados gravados com sucesso."
						break;
					case "erro":
						alerta_id = bi.alerta_erro_id;
						alerta_titulo = "Erro";
						alerta_texto = "Ocorreu algum erro inesperado."
						break;
					case "confirma":
						alerta_id = bi.alerta_confirma_id;
						alerta_titulo = "Confirma&ccedil;&atilde;o";
						alerta_texto = "Tem certeza que deseja realizar esta opera&ccedil;&atilde;o ?"
						break;
					default:
						alerta_id = param.tipo;
						break;
				}
				// Fim [case]
				
				// Inicio [config]
				//alerta_ok = function(){bi.LightboxEsconde();};
				//alerta_cancelar = function(){bi.LightboxEsconde();};
				
				if(param.titulo){
					alerta_titulo = param.titulo;
				}
				if(param.texto){
					alerta_texto = param.texto;
				}
				/*if(param.ok){
					alerta_ok = param.ok;
				}
				if(param.cancelar){
					alerta_cancelar = param.cancelar;
				}*/
				// Fim [config]
				
				// Inicio [escreve]
				if(document.getElementById(alerta_id)){
					document.getElementById(alerta_id+"_titulo").innerHTML = alerta_titulo;
					document.getElementById(alerta_id+"_texto").innerHTML = alerta_texto;
					var jq_id = bi.JqueryId({id:alerta_id});
					
					if(document.getElementById(alerta_id+"_ok")){
						//jQuery(bi.JqueryId({id:alerta_id+"_ok"})).unbind();
						jQuery(jq_id+"_ok").removeAttr("onclick");
						
						if(!param.ok){
							//jQuery(bi.JqueryId({id:alerta_id+"_ok"})).click(function(){bi.LightboxEsconde();});
							//jQuery(jq_id+"_ok").attr("onclick", "bi.LightboxEsconde({lightbox:'"+alerta_id+"'});");
							bi.FixClique({id:alerta_id+"_ok", funcao:"bi.LightboxEsconde({lightbox:'"+alerta_id+"'});"});
							
							if(bi.troca_clique == true){
								bi.TrocaClique({id:alerta_id+"_ok"});
							}
						}else{
							//jQuery(bi.JqueryId({id:alerta_id+"_ok"})).click(param.ok);
							
							//jQuery(jq_id+"_ok").attr("onclick", param.ok + "bi.LightboxEsconde({lightbox:'"+alerta_id+"'});");
							bi.FixClique({id:alerta_id+"_ok", funcao:param.ok+"bi.LightboxEsconde({lightbox:'"+alerta_id+"'});"});
							
							//bi.FixClique({id:alerta_id, funcao:param.ok});
							if(bi.troca_clique == true){
								bi.TrocaClique({id:alerta_id+"_ok"});
							}
						}
					}
					if(document.getElementById(alerta_id+"_cancelar")){
						//jQuery(bi.JqueryId({id:alerta_id+"_cancelar"})).unbind();
						jQuery(jq_id+"_cancelar").removeAttr("onclick");
						
						if(!param.cancelar){							
							//jQuery(bi.JqueryId({id:alerta_id+"_cancelar"})).click(function(){bi.LightboxEsconde();});
							//jQuery(jq_id+"_cancelar").attr("onclick", "bi.LightboxEsconde({lightbox:'"+alerta_id+"'});");
							bi.FixClique({id:alerta_id+"_cancelar", funcao:"bi.LightboxEsconde({lightbox:'"+alerta_id+"'});"});
							
							if(bi.troca_clique == true){
								bi.TrocaClique({id:alerta_id+"_cancelar"});
							}
						}else{							
							//jQuery(bi.JqueryId({id:alerta_id+"_cancelar"})).click(param.cancelar);
							//jQuery(jq_id+"_cancelar").attr("onclick", param.cancelar + "bi.LightboxEsconde({lightbox:'"+alerta_id+"'});");
							bi.FixClique({id:alerta_id+"_cancelar", funcao:param.cancelar+"bi.LightboxEsconde({lightbox:'"+alerta_id+"'});"});
							
							if(bi.troca_clique == true){
								bi.TrocaClique({id:alerta_id+"_cancelar"});
							}

						}
					}
					bi.LightboxExibe({lightbox:alerta_id});
					fn_el = jQuery("#" + alerta_id);
					fn_el_pos = bi.GetPos({el: fn_el});
					fn_y = fn_el_pos.topo - bi.GetTelaAltura()/2 + fn_el_pos.altura/2;
					bi.ScrollTo({y: fn_y, duracao: 500});
				}
				// Fim [escreve]
			}
			// Fim [param]
		},
		// Fim [Alertas]
		
		// Inicio [TelaAlertas]
		TelaAlertas: function(){
			jQuery(document).ready(function(){
				var str_alertas = "";
				var fix_div = "";
				for(var i=0; i<bi.array_alertas.length; i++ ){
					fix_div = bi.array_alertas[i].replace("alerta_", "");
					str_alertas = str_alertas +
					"<div id=\""+bi.array_alertas[i]+"\" class=\"div_"+fix_div+"\" style=\"display: none;\" lock=\"1\">" +
						"<span class=\"head\" id=\""+bi.array_alertas[i]+"_titulo\">Alerta</span>" +
						"<span class=\"conteudo\">" +
							"<span id=\""+bi.array_alertas[i]+"_texto\" class=\"texto\">" +
								"Aconteceu algum erro cr&iacute;tico" +
							"</span>" +
						"</span>" +
						"<span class=\"botao\">" +
							"<span id=\""+bi.array_alertas[i]+"_ok\" class=\"botao_"+fix_div+"\"><span>OK</span></span>" +
						"</span>" +
					"</div>";
				}
				var div = jQuery(str_alertas);
				jQuery("body").prepend(div);
				jQuery("#" + bi.alerta_confirma_id + " .botao").prepend("<span id=\""+bi.alerta_confirma_id+"_cancelar\" class=\"botao_"+fix_div+"\"><span>Cancelar</span></span>&nbsp;");
				return true;
			});
		},
		// Fim [TelaAlertas]
		
		// Inicio [DivExibe]
		DivExibe: function(param){
			if(param.id){
				if(document.getElementById(param.id)){
					document.getElementById(param.id).style.display = "block";
				}
			}
			return true;
		},
		// Fim [DivExibe]

		// Inicio [DivEsconde]
		DivEsconde: function(param){
			if(param.id){
				if(document.getElementById(param.id)){
					document.getElementById(param.id).style.display = "none";
				}
			}
			return true;
		},
		// Fim [DivEsconde]
		
		// Inicio [LightboxEfeito]
		LightboxEfeito: function(param){
			if(param){
				if(param.id){
					var jq_id = bi.JqueryId({id:param.id});
					jQuery(jq_id).promise().done(
						function(){
							if(!param.tipo){
								jQuery(jq_id).fadeIn();
							}else{
								if(param.tipo == "fade_out"){
									jQuery(jq_id).fadeOut();
								}
							}
						}
					);
				}
			}
			return true;
		},
		// Fim [LightboxEfeito]
		
		// Inicio [Evento]
		Evento: function (param){
			var retorna = null;
			var teclas = null;
			if(param){
				/*if(param.tipo && param.funcao && param.teclas){
					jQuery(document).bind(param.tipo, function(event){bi.DirecionaEvento({evento:event, tipo:param.tipo, teclas:param.teclas, funcao:param.funcao});});
				}*/
				if(param.tipo && param.funcao){
					if(param.teclas){
						teclas = param.teclas;
					}
				}
				jQuery(document).bind(param.tipo, function(event){bi.DirecionaEvento({evento:event, tipo:param.tipo, teclas:teclas, funcao:param.funcao});});
				jQuery(document).keyup(function (e){
					if (e.which == 9) {
						if(e.target.form != undefined){
							bi.ultimo_clique = e.target;
							//bi.Log({texto: bi.ultimo_clique });
						}
					}
				});
				
			}else{
				//jQuery(document).bind("keypress", function(event){bi.ApertaEnter({evento:event, teclas:["enter", "d"]});});
			}
			return retorna;
		},
		// Fim [Evento]
		
		// Inicio [DirecionaEvento]
		DirecionaEvento: function(param){
			var retorna = null;
			if(param){
				if(param.evento && param.tipo){
					if(param.tipo == "keypress" && param.funcao){
						if(param.teclas != null){
							for(var i=0; i<param.teclas.length; i++){
								if(param.evento.which == param.teclas[i]){
									if(bi.ultimo_clique){
										if(bi.ultimo_clique.type != undefined){
											if(bi.ultimo_clique.type != "textarea"){
												param.evento.preventDefault();
												param.evento.stopPropagation();
												param.funcao();
											}
										}
									}else{
										// Inicio [caso lightbox aberto]
										if(bi.array_lightbox_abertas.length > 0){
											param.evento.preventDefault();
											param.evento.stopPropagation();
											param.funcao();
										}
										// Fim [caso lightbox aberto]
									}
								}
							}
						}else{
							param.evento.preventDefault();
							param.evento.stopPropagation();
							param.funcao();
						}
					}
					
					if(param.tipo == "click"){
						//alert(param.evento.target.type);
						if(param.evento.target.type != undefined){
							bi.ultimo_clique = param.evento.target;
						}
						//param.funcao();
					}
				}
			}
			return retorna;
		},
		// Fim [DirecionaEvento]	
		
		// Inicio [FixClique]
		FixClique: function(param){
			var fn_el;
			var retorna = false;
			if(param){
				if(param.id){
					fn_el = jQuery("#" + param.id);
				}
				if(param.classe){
					fn_el = jQuery("." + param.classe);
				}
				if(param.el){
					fn_el = param.el;
				}
				if(fn_el && param.funcao){
					//var jq_id = bi.JqueryId({id:param.id});
					if(bi.ConfereNavegador({versao:["7.0"], navegador:"ie", tipo:"maior"}) == true){
						//jQuery(jq_id).attr("onclick", "bi.ValidaClique({funcao:function(){"+param.funcao+"}})");
						//jQuery(jq_id).attr("onclick", "bi.Clique({funcao:function(){"+param.funcao+"}})");
						//jQuery(jq_id).attr("onclick", param.funcao);
						fn_el.attr("onclick", param.funcao);
					}else{
						//document.getElementById(param.id).onclick = function(){bi.ValidaClique({funcao:function(){eval(param.funcao)}})};
						//document.getElementById(param.id).onclick = function(){bi.Clique({funcao:function(){eval(param.funcao)}})};
						fn_el.get(0).onclick = function(){bi.Clique({funcao:function(){eval(param.funcao)}})};
					}
				}
				retorna = true;
			}
			return retorna;
		},
		// Fim [FixClique]
		
		// Inicio [TrocaClique]
		TrocaClique: function(param){
			var retorna = false;
			// jQuery('body *').toArray().filter(function(el) { return jQuery(el).attr('onclick') });
			if(param){
				if(param.id){
					var jq_id = bi.JqueryId({id:param.id});
					if(jQuery(jq_id).attr("onclick")){
						var original = jQuery(jq_id).attr("onclick");
						//if(original.indexOf("bi.ValidaClique") < 0){
						if(original.indexOf("bi.Clique") < 0){
							jQuery(jq_id).removeAttr("onclick");
							/*if(bi.ConfereNavegador({versao:["7.0"], navegador:"ie", tipo:"maior"}) == true){
								jQuery(jq_id).attr("onclick", "bi.ValidaClique({funcao:function(){"+original+"}})");
							}else{
								this.onclick = function(){bi.ValidaClique({funcao:function(){eval(original)}})};
							}*/
							bi.FixClique({id:param.id, funcao:original});
							retorna = true;
						}
					}
				}
			}else{
				jQuery(document).ready(
					function(){
						jQuery("[onclick]").each(
							function(obj){
								if(jQuery(this).attr("onclick") && jQuery(this).attr("id")){
									var original = jQuery(this).attr("onclick");
									//alert(original);
									//if(original.indexOf("bi.ValidaClique") < 0){
									if(original.indexOf){
										if(original.indexOf("bi.Clique") < 0){
											jQuery(this).removeAttr("onclick");
											/*if(bi.ConfereNavegador({versao:["7.0"], navegador:"ie", tipo:"maior"}) == true){
												jQuery(this).attr("onclick", "bi.ValidaClique({funcao:function(){"+original+"}})");
												//this.onclick = function(){bi.ValidaClique({funcao:function(){eval(original)}})};
											}else{
												//this.setAttribute("onclick", "bi.ValidaClique({funcao:function(){"+original+"}})");
												//this.setAttribute("onclick", "alert('ok');");
												this.onclick = function(){bi.ValidaClique({funcao:function(){eval(original)}})};
											}*/
											bi.FixClique({id:this.id, funcao:original});
											retorna = true;
										}
									}
								}
							}
						);					
					}
				);
			}
			return retorna;
		},
		// Fim [TrocaClique]
		
		// Inicio [ValidaClique]
		ValidaClique: function(param){
			var retorna = false;
			//if(param){
				//if(param.funcao){
					var now = new Date();
					var segundos = now.getSeconds();
					var minutos = now.getMinutes();

					if(bi.tempo_clique[0] == minutos && bi.tempo_clique[1] == segundos){
						//alert("duplo");
						//param.evento.preventDefault();
						//param.evento.stopPropagation();
					}else{
						bi.tempo_clique = [minutos, segundos];
						//param.funcao();
						retorna = true;
					}
				//}
			//}
			return retorna;
		},
		// Fim [ValidaClique]
		
		// Inicio [Clique]
		Clique: function(param){
			var retorna = false;
			if(param){
				if(!param.duplo_clique){
					param.duplo_clique = false;
				}
				if(param.funcao){
					retorna = true;
					if(param.duplo_clique == false){
						retorna = bi.ValidaClique();
					}
					if(retorna == true){
						param.funcao();
					}
				}
			}
			return retorna;
		},
		// Fim [Clique]
		
		// Inicio [ApertaEnter]
		ApertaEnter: function(){
			var retorna = true;
			var total = bi.array_lightbox_abertas.length;
			var enter = "_enter";
			var ok = "_ok";
			var botao = "";
			var jg_id = "";
			var fn_form = jQuery(bi.ultimo_clique).parents("form");
			if(total > 0){
				var botao = bi.array_lightbox_abertas[total-1];
				jg_id = bi.JqueryId({id:botao});
				if(document.getElementById(botao + enter)){
					jQuery(jg_id + enter).click();
				}else{
					if(document.getElementById(botao + ok)){
						jQuery(jg_id + ok).click();
					}
				}
			}else{
				//alert("fora lightbox");
				/*if(document.getElementById(botao + enter)){
					jQuery(bi.JqueryId({id:botao + enter})).click();
				}
				jQuery("form").each(
					function(formulario){
						retorna = true;
						botao = this.id;
						var jq_id = bi.JqueryId({id:this.id});
												
						if(retorna == true){
							jQuery(bi.JqueryId({id:botao + enter})).click();
							return false;
						}
					
				);}*/
				
				/*if(bi.ultimo_clique != null && bi.ultimo_clique.form){
					if(bi.ultimo_clique.form.id){
						botao = bi.ultimo_clique.form.id;
						//botao = jQuery(bi.ultimo_clique).parents("form").attr("id");
					}
					jg_id = bi.JqueryId({id: botao});
					//botao = jQuery(bi.ultimo_clique).closest("form").attr("id");
					//jQuery(jg_id + enter).click();
				}*/
				if(bi.ultimo_clique != null){
					if(fn_form.attr("id")){
						botao = fn_form.attr("id");
						//botao = jQuery(bi.ultimo_clique).parents("form").attr("id");
					}
					jg_id = bi.JqueryId({id: botao});
					//botao = jQuery(bi.ultimo_clique).closest("form").attr("id");
					//jQuery(jg_id + enter).click();
				}
				
				jQuery(jg_id + enter).click();
				
			}
			return retorna;
		},
		// Fim [ApertaEnter]
		
		// Inicio[ConfereCampo]
		ConfereCampo: function(param){
			var retorna = false;
			if(param){
				if(!param.tipo){
					param.tipo = "texto";
				}
				
				if(param.tipo == "texto"){
					if(param.texto){
						if(param.texto != "" && param.texto != null){
							retorna = true;
						}
					}
				}
				
				if(param.tipo == "flag"){
					if(param.texto){
						if(param.texto == "on" || param.texto == "true" || param.texto == true || param.texto == "checked" || param.texto == 1 || param.texto == "1"){
							retorna = true;
						}
					}
				}
				
				if(param.tipo == "compara"){
					if(param.texto && param.arr){
						for(var i=0; i<param.arr.length; i++){
							if(param.texto == param.arr[i]){
								retorna = true;
							}
						}
						
					}
				}
				
			}
			return retorna;
		},
		// Fim[ConfereCampo]
		
		// Inicio [ValidaForm]
		ValidaForm: function(param){
			var retorna = true;
			var form = null;
			var checa = null;
			var bool = null;
			var flag = null;
			if(param){

				if(!param.obrigatorio){
					param.obrigatorio = "sim";
				}
				
				if(param.obrigatorio == "sim"){
					bool = false;
				}else{
					bool = true;
				}

				if(param.campos){
					form = document.getElementById(param.campos[0]).form.id;
				}else{
					if(param.id){
						form = param.id;
					}
				}
				
				
				var jq_id = bi.JqueryId({id:form});
				
				jQuery(jq_id).find("input:text").each(
					function(campos){
						checa = true;
						
						if(param.campos){
							if(bi.ConfereCampo({texto:this.id, arr:param.campos, tipo:"compara"}) == bool){
								checa = false;
							}
						}
												
						if(checa == true){
							if(bi.ConfereCampo({texto:this.value}) == false){
								bi.FormErro({id:this.id, tipo:"1"});
								retorna = false;
							}else{
								bi.FormErro({id:this.id, tipo:"0"});
							}
						}
					}
				);
				
				jQuery(jq_id).find("input:password").each(
					function(campos){
						checa = true;
						
						if(param.campos){
							if(bi.ConfereCampo({texto:this.id, arr:param.campos, tipo:"compara"}) == bool){
								checa = false;
							}
						}
												
						if(checa == true){
							if(bi.ConfereCampo({texto:this.value}) == false){
								bi.FormErro({id:this.id, tipo:"1"});
								retorna = false;
							}else{
								bi.FormErro({id:this.id, tipo:"0"});
							}
						}
					}
				);

				jQuery(jq_id).find("textarea").each(
					function(campos){
						checa = true;
						
						if(param.campos){
							if(bi.ConfereCampo({texto:this.id, arr:param.campos, tipo:"compara"}) == bool){
								checa = false;
							}
						}
												
						if(checa == true){
							if(bi.ConfereCampo({texto:this.value}) == false){
								bi.FormErro({id:this.id, tipo:"1"});
								retorna = false;
							}else{
								bi.FormErro({id:this.id, tipo:"0"});
							}
						}
					}
				);

				jQuery(jq_id).find("select").each(
					function(campos){
						checa = true;
						
						if(param.campos){
							if(bi.ConfereCampo({texto:this.id, arr:param.campos, tipo:"compara"}) == bool){
								checa = false;
							}
						}
												
						if(checa == true){
							if(bi.ConfereCampo({texto:this.value}) == false){
								bi.FormErro({id:this.id, tipo:"1"});
								retorna = false;
							}else{
								bi.FormErro({id:this.id, tipo:"0"});
							}
						}
					}
				);

				jQuery(jq_id).find("input:radio").each(
					function(campos){
						checa = true;
						
						if(param.campos){
							if(bi.ConfereCampo({texto:this.id, arr:param.campos, tipo:"compara"}) == bool){
								checa = false;
							}
						}
												
						if(checa == true){
							if(bi.ConfereCampo({texto:this.checked, tipo:"flag"}) == true){
								//bi.FormErro({id:this.id, tipo:"0"});
								flag = true;
								return false;
							}else{
								flag = false;
								//bi.FormErro({id:this.id, tipo:"1"});
							}
						}
					}
				);

				if(flag != null){
					if(flag == false){
						retorna = false;
					}
				}
				
				jQuery(jq_id).find("input:checkbox").each(
					function(campos){
						checa = true;
						
						if(param.campos){
							if(bi.ConfereCampo({texto:this.id, arr:param.campos, tipo:"compara"}) == bool){
								checa = false;
							}
						}
												
						if(checa == true){
							if(bi.ConfereCampo({texto:this.checked, tipo:"flag"}) == true){
								//bi.FormErro({id:this.id, tipo:"0"});
								flag = true;
								return false;
							}else{
								flag = false;
								//bi.FormErro({id:this.id, tipo:"1"});
							}
						}
					}
				);

				if(flag != null){
					if(flag == false){
						retorna = false;
					}
				}


			}
			
			if(retorna == false){
				if(param.texto){
					bi.Alertas({texto:param.texto, tipo:"aviso"});
				}
				return false;	
			}
			
			if(!param.funcao){
				document.getElementById(form).submit();
			}else{
				param.funcao();
			}
		},
		// Fim [ValidaForm]
		
		// Inicio [FormErro]
		FormErro: function(param){
			if(param){
				if(param.id && param.tipo){
					if(param.tipo == "0"){
						document.getElementById(param.id).style.border = "1px solid #cccccc";
						//document.getElementById(param.id).style.backgroundColor = "";
					}else{
						document.getElementById(param.id).style.border = "1px solid #ff0000";
						//document.getElementById(param.id).style.backgroundColor = "#ff0000";
					}
				}
			}
		},
		// Fim [FormErro]
		
		// Inicio [AjaxExtend]
		AjaxExtend: function(){
			jQuery(function(){
				(function addXhrProgressEvent(jQuery){
					var originalXhr = jQuery.ajaxSettings.xhr;
					jQuery.ajaxSetup({
						xhr: function() {
							var req = originalXhr(), that = this;
							if (req) {
								if (typeof req.addEventListener == "function" && that.progress !== undefined) {
									req.addEventListener("progress", function(evt) {
										that.progress(evt);
									}, false);
								}
								if (typeof req.upload == "object" && that.progressUpload !== undefined) {
									req.upload.addEventListener("progress", function(evt) {
										that.progressUpload(evt);
									}, false);
								}
							}
							return req;
						}
					});
				})(jQuery);
			});
		},
		// Fim [AjaxExtend]
		
		// Inicio [Ajax]
		Ajax: function(param){
			var resposta = null;
			var temp = null;
			var campos = new Array();
			var campo = new Array();
			bi.ajax_resposta = "";
			if(param){
				if(!param.erro){
					if(bi.desenvolvedor == false){
						//param.erro = function(){bi.Alertas({tipo:"erro", texto:"Ocorreu algum erro inesperado... Por favor tente mais tarde."});};
						param.erro = function(){bi.Alertas({tipo:"erro", texto:bi.ajax_resposta});};
					}else{
						param.erro = function(){bi.Alertas({tipo:"erro", texto:bi.ajax_resposta});};
						//param.erro = function(){alert(bi.ajax_resposta);};
					}
				}
				if(!param.metodo){
					param.metodo = "POST";
				}
				if(!param.tipo_data){
					param.tipo_data = "text";
				}
				if(!param.timeout){
					param.timeout = null;
				}
				/*if(!param.file){
					//param.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
					param.processData = "multipart/form-data";
					param.processData = "application/x-www-form-urlencoded";
				}else{
					param.contentType = false;
					param.processData = false;
				}*/
				if(!param.campos){
					param.campos = "";
					if(param.formulario){
						resposta = jQuery(bi.JqueryId({id:param.formulario})).serializeArray();
						for(var i=0; i<resposta.length; i++){
							temp = bi.Replace({texto: escape(resposta[i].value), tipo: "+", troca: "%2B"});
							//temp = escape(resposta[i].value);
							//temp = encodeURIComponent(resposta[i].value);
							
							//param.campos = param.campos + resposta[i].name + "=" + resposta[i].value + "&";
							param.campos = param.campos + resposta[i].name + "=" + temp + "&";
						}
						temp = param.campos.substr(0, param.campos.length-1);
						param.campos = temp;
						//bi.Alertas({texto:param.campos});
						//bi.Log({texto: param.campos});
					}
				}else{
					//temp = escape(param.campos);
					campos = param.campos.split("&");
					temp = "";
					for(var i=0; i<campos.length; i++){
						campo = campos[i].split("=");
						temp = temp + campo[0] + "=" + bi.Replace({texto: escape(campo[1]), tipo: "+", troca: "%2B"}) + "&";
						//temp = temp + campo[0] + "=" + escape(campo[1]).replace("+", "%2B") + "&";
						//temp = temp + campo[0] + "=" + encodeURIComponent(campo[1]) + "&";
					}
					
					param.campos = temp.substr(0, temp.length-1);
					//bi.Log({texto: param.campos});
				}

				jQuery.ajax({
					type: param.metodo,
					url: param.endereco,
					dataType: param.tipo_data,
					//contentType: param.contentType,
					//processData: param.processData,
					data: param.campos,
					cache: false,
					timeout: param.timeout,
					error: function (xhr, status, erro){
						if(xhr.status == 0){
							bi.ajax_resposta = "N&atilde;o foi poss&iacute;vel conectar a internet.";
						}else{
							bi.ajax_resposta = xhr.responseText;
						}
						/*if(xhr.status == "timeout"){}*/
						if(bi.ConfereDisplay({id:bi.load_id}) == true){
							bi.LightboxEsconde({lightbox: bi.load_id, ignora_over: true});
						}
						param.erro();
					},		
					success: function(resposta, status, xhr){
						bi.ajax_resposta = resposta;
						//alert("aqui");
						if(!param.fluxo){
							if(bi.ConfereDisplay({id:bi.load_id}) == true){
								if(!param.controla_over){
									//bi.LightboxRemove({lightbox:bi.load_id});
									//bi.DivEsconde({id:bi.load_id});
									bi.LightboxEsconde({lightbox: bi.load_id, ignora_over: true});
								}else{
									bi.LightboxEsconde({lightbox: bi.load_id});
								}
							}
						}
						param.sucesso();
						//retorna = resposta;
					},
					progress: function(fn_evt){
						//console.log(fn_evt);
						if(fn_evt.lengthComputable){
							//console.log("Loaded " + parseInt( (evt.loaded / evt.total * 100), 10) + "%");
						}else{
							//console.log("Length not computable.");
						}
					}
				});
			}
			return resposta;
		},
		// Fim [Ajax]
				
		// Inicio [ConfereObj]
		ConfereObj: function(obj){
			for(var propertyName in obj) {
				// propertyName is what you want
				// you can get the value like this: myObject[propertyName]
				alert(obj[propertyName]);
			};
			return this;
		},
		// Fim [ConfereObj]

		// Inicio [CloneObject]
		// jQuery.extend(true, {}, obj)
		CloneObject:function(obj) {
			var clone = {};
			for(var i in obj) {		
				if(typeof(obj[i])=="object")
					clone[i] = this.CloneObject(obj[i]);
				else
					clone[i] = obj[i];
			}
			return clone;
		},
		// Fim [CloneObject]

		// Insere [ResetaArray]
		// parametros - array
		ResetaArray: function(param){
			var retorna = null;
			if(param.array){
				retorna = arr.splice(0, arr.length);
			}
			return retorna;
		},
		// Fim [ResetaArray]

		// Inicio [exibe]
		Exibe: function(janela){
			if(bi.ConfereDisplay({id:janela}) == true){

				document.getElementById(janela).style.display = "none";
			}else{
				document.getElementById(janela).style.display = "";
			}
			return true;
		},
		// Fim [exibe]
		
		// Inicio [rnd]
		Rnd: function(param){
			var retorna = false;
			if(param){
				if(param.multi){
					retorna = Math.floor(Math.random()*param.multi);
				}
				if(param.confere){
					if(retorna <= param.confere){
						retorna = true;
					}
				}
			}
			return retorna;
		},
		// Fim [rnd]
		
		// Inicio [ConfereDisplay]
		ConfereDisplay: function(param){
			var retorna = null;
			if(param){
				if(param.id){
					if(document.getElementById(param.id)){
						if(document.getElementById(param.id).style.display == "" || document.getElementById(param.id).style.display == "block"){
							retorna = true;
						}else{
							retorna = false;
						}
					}
				}
			}
			return retorna;
		},
		// Fim [ConfereDisplay]
		
		// Inicio [ExpRegular]
		ExpRegular: function(param){
			//bi.ExpRegular({tipo:"texto", texto:"6575 765"});
			var retorna = false;
			var padrao = null;
			if(param){
				if(param.tipo && param.texto){
					switch(param.tipo){
						case "texto":
							padrao = /^[A-Za-z\s]+$/g;
							break;
						case "numero":
							padrao = /^[0-9\s]+$/g;
							break;
					}
					padrao.lastIndex = 0;
					retorna = padrao.test(bi.Trim(param.texto));
				}
			}
			return retorna;
		},
		// Fim [ExpRegular]

		// Inicio [Replace]
		Replace: function(param){
			var retorna = "";
			var padrao = null;
			if(!param.troca){
				param.troca = "";
			}
			if(param){
				if(param.tipo && param.texto){
					switch(param.tipo){
						case "texto":
							padrao = /[A-Za-z\s]+/g;
							break;
						case "numero":
							padrao = /[0-9\s]+/g;
							break;
						case "extensao":
							padrao = /.[^.]*$/g;
							break;
						case "+":
							padrao = /[+]/g;
							break;
					}
					padrao.lastIndex = 0;
					retorna = param.texto.replace(padrao, param.troca);
				}
			}
			return retorna;
		},
		// Fim [Replace]
		
		// Inicio [FormataTexto]
		FormataTexto: function(param){
			var retorna = null;
			if(param){
				if(param.texto){
					retorna = param.texto.toLowerCase().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				}
			}
			return retorna;
		},
		// Fim [FormataTexto]

		// Inicio [FormataNumero]
		FormataNumero: function(param){
			var retorna = null;
			//.toFixed(2)
			if(param){
				if(param.preco){
					retorna = parseFloat(param.preco.toString().replace(/\./g, "").replace(/\,/g, "."));
				}
			}
			return retorna;
		},
		// Fim [FormataNumero]
		
		// Inicio [EstiloNumero]
		EstiloNumero: function(param){
			var retorna = null;
			if(param){
				if(param.numero){
					retorna = parseFloat(param.numero.replace(/[A-Za-z\s]+/g, ""));
				}
			}
			return retorna;
		},
		// Fim [EstiloNumero]

		// Inicio [Log]
		Log: function(param){
			var retorna = null;
			if(bi.desenvolvedor == true){
				if(param){
					if(param.texto){
						retorna = param.texto;
						if(window.console){
							console.log(param.texto);
						}
						/*setTimeout(function() {
							throw new Error(param.texto);
						}, 0);*/
					}
				}
			}
			return retorna;
			
		},
		// Fim [Log]
		
		// Inicio [Calendario]
		Calendario: function(param){
			var retorna = null;
			if(param){
				if(param.id){
					var jq_id = bi.JqueryId({id: param.id});
					jQuery(function() {
						jQuery(jq_id).datepicker({
							dateFormat: "dd/mm/yy", 
							dayNames: ["Domingo","Segunda","Ter&ccedil;a","Quarta","Quinta","Sexta","S&aacute;bado","Domingo"], 
							dayNamesMin: ["D","S","T","Q","Q","S","S","D"],
							monthNames: ["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
							monthNamesShort: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
							nextText: "Pr&oacute;ximo",
							prevText: "Anterior",
							beforeShow: function(selectedDate){
								jQuery(jq_id).val("");
							},
							onClose: function(selectedDate) {
								if(param.minimo){
									var jq_combo = bi.JqueryId({id: param.minimo});
									jQuery(jq_combo).datepicker( "option", "minDate", selectedDate );
								}
								if(param.maximo){
									var jq_combo = bi.JqueryId({id: param.maximo});
									jQuery(jq_combo).datepicker( "option", "maxDate", selectedDate );
								}
							}
							/*showOn: "button",
							buttonImage: "/imgs/calendario.jpg",
							buttonImageOnly: true*/
						});
					});
					retorna = true;
				}
			}
			return retorna;
		},
		// Fim [Calendario]
		
		// Inicio [Zoom]
		Zoom: function(){
			jQuery(function() {
				jQuery(".zoom").jqzoom({
					zoomType: "standard",
					title: true,
					lens: true,
					zoomWidth: 400,
					zoomHeight: 400,
					xOffset: 10,
					yOffset: 0,
					position: "right",
					showEffect: "fadein",
					hideEffect: "fadeout",
					fadeinSpeed: "fast",
					fadeoutSpeed: 10,
					preloadText: "Carregando...",
					preloadImages: true
				});
			});
		},
		// Fim [Zoom]
		
		// Inicio [AutoCompleta]
		AutoCompleta: function(param){
			jQuery(function() {
				if(param){
					if(param.id && param.source){
						var jq_id = bi.JqueryId({id:param.id});
						var campo_largura = parseInt(jQuery(jq_id).css("width").replace("px", ""));
						
						jQuery(jq_id).autocomplete({
							open: function(event, ui){
								jQuery(".ui-autocomplete").css("width", campo_largura-2);
								jQuery(".ui-autocomplete").css("height", 100);
								jQuery(".ui-autocomplete").css("z-index", 500);
							},
							source: param.source
						});
					}
				}
			});
		},
		// Fim [AutoCompleta]
		
		// Inicio [Balao]
		Balao: function(param){
			if(bi.pnotify == true){
				if(param){
					if(!param.titulo){
						param.titulo = "Titulo Default...";
					}
					if(!param.texto){
						param.texto = "Texto Default...";
					}
					if(!param.tempo){
						param.tempo = 3000;
					}
					if(!param.esconde){
						param.esconde = true;
					}
					if(!param.controle){
						param.controle = true;
					}
					if(!param.classe){
						param.classe = "stack_bottomright";
					}

					if(!param.tipo){
						param.tipo = "aviso";
					}
					switch(param.tipo){
						case "aviso":
							param.tipo = "notice";
							break;
						case "erro":
							param.tipo = "error";
							param.esconde = false;
							param.controle = false;
							break;
						case "sucesso":
							param.tipo = "success";
							param.esconde = false;
							param.controle = false;
							break;
					}
										
					jQuery(function(){
						var temp = jQuery.pnotify({
							title: param.titulo,
							text: param.texto,
							hide: param.esconde,
							type: param.tipo,
							history: false,
							delay: param.tempo,
							addclass: param.classe,
							stack: bi.stack_atual,
							
							sticker: param.controle,
							
							mouse_reset: false,
							closer_hover: false,
							sticker_hover: false
							
						}).click(function(e){
							if(param.funcao){
								if(e.target.className != "icon-remove" && e.target.className != "icon-play" && e.target.className != "icon-pause"){
									param.funcao();
								}
							}
						});
						bi.array_pnotify.push(temp);
					})
				}
			}
			return true;
		},
		// Fim [Balao]
		
		// Inicio [BalaoLimpa]
		BalaoLimpa: function(){
			for(var i=0; i<bi.array_pnotify.length; i++){
				bi.array_pnotify[i].pnotify_remove();
			}
		},
		// Fim [BalaoLimpa]
		
		// Inicio [ObjScroll]
		ObjScroll: function(param){
			var retorna = null;
			if(param){
				if(!param.size){
					param.size = 50;
				}
				if(!param.largura){
					param.largura = 1024;
				}
				if(!param.altura){
					param.altura = 200;
				}
				if(param.id){
					jQuery(function(){
						var jq_id = bi.JqueryId({id: param.id});
						retorna = document.getElementById(param.id).innerHTML;
						document.getElementById(param.id).innerHTML = "";
						
						var obj_scroll = jQuery(
							"<div class=\"scrollbar\">" +
								"<div class=\"track\">" +
									"<div class=\"thumb\">" +
										"<div class=\"end\" />" +
									"</div>" +
								"</div>" +
							"</div>" +
							"<div class=\"viewport\" style=\"height: "+param.altura+"px\">" +
								"<div class=\"overview\">" +
									"<span class=\"wrap\" id=\"scroll_"+param.id+"\">" +
										retorna +
									"</span>" +
								"</div>" +
							"</div>"
						);
						
						jQuery(jq_id).append(obj_scroll);
						jQuery(jq_id).css("width", param.largura+"px");
						jQuery(jq_id).tinyscrollbar({sizethumb: param.size});
						
						tinyscroll_fix({id: param.id});
					});
				}
			}
			return retorna;
		},
		// Fim [ObjScroll]
		
		// Inicio [ObjScrollUpdate]
		ObjScrollUpdate: function(param){
			var retorna = false;
			if(param){
				if(param.id){
					var jq_id = bi.JqueryId({id: param.id});
					jQuery(jq_id).tinyscrollbar_update();
					tinyscroll_fix({id: param.id});
					retorna = true;
				}
			}
			return retorna;
		},
		// Fim [ObjScrollUpdate]
		
		// Inicio [ui]
		// Inicio [Tooltip]
		Tooltip: function(param){
			jQuery(function(){
				var fn_el, fn_sel;
				
				fn_sel = "*[tooltip]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
					if(param.div){
						fn_sel = "#" + param.div + " *[tooltip]";
					}
				}

				jQuery(fn_sel).each(function(){
					var fn_el;
					fn_el = jQuery(this);
					if(fn_el.attr("id") == undefined){
						fn_el.attr("id", bi.BiId());
					}

					bi.TooltipRemove({id: fn_el.attr("id")});
					jQuery(this).bind("mouseenter", function(event){
						fn_el = jQuery(event.target);
						bi.TooltipExibe({el: fn_el});
					});
					
					jQuery(this).bind("mouseleave", function(event){
						jQuery(".tooltip").remove();
					});
				});
			});
		},
		// Fim [Tooltip]
		
		// Inicio [TooltipRemove]
		TooltipRemove: function(param){
			var fn_sel;
			fn_sel = "*[tooltip]";
			if(param){
				if(param.id){
					fn_sel = "#" + param.id;
				}
				if(param.div){
					fn_sel = "#" + param.div + " *[tooltip]";
				}
			}

			jQuery(fn_sel).each(function(){
				jQuery(this).unbind();
			});
		},
		// Fim [TooltipRemove]
		
		// Inicio [TooltipExibe]
		TooltipExibe: function(param){
			var fn_el, fn_pos, fn_y, fn_x, fn_span, fn_txt, fn_tool, fn_pos_tool, fn_tooltipy, fn_tooltipx, fn_seta, fn_seta_inv, fn_largura, fn_tooltiplargura, fn_class;
			if(param){
				if(param.el && bi.tooltip){
					fn_el = param.el;
					
					if(fn_el.attr("id") == undefined){
						fn_el.attr("id", bi.BiId());
					}

					fn_txt = fn_el.attr("tooltip");
					fn_tooltipy = fn_el.attr("tooltipy");
					fn_tooltipx = fn_el.attr("tooltipx");
					fn_tooltiplargura = fn_el.attr("tooltiplargura");
					fn_class = fn_el.attr("tooltipclass") ? fn_el.attr("tooltipclass") : "";
					
					fn_seta = "";
					fn_seta_inv = "";
					
					switch(fn_tooltipy){
						case "topo":
							fn_seta_inv = "<span class=\"topo\"></span>";
							break;
						default:
							fn_seta = "<span class=\"baixo\"></span>";
							break;
					}
					
					/*if(fn_tooltiplargura != undefined){
						fn_largura = "width: "+fn_tooltiplargura+"px;";
					}else{
						fn_largura = "";
					}*/

					if(fn_txt != undefined){
						fn_pos = bi.GetPos({el: fn_el});
						fn_y = (fn_pos.topo);
						fn_x = (fn_pos.esquerda);
						//fn_span = jQuery("<span class=\"tooltip inv "+fn_class+"\" style=\"position: absolute; display: none; top: 0px; left: 0px; "+fn_largura+"\">"+fn_seta_inv+"<span class=\"texto\">"+fn_txt+"</span>"+fn_seta+"</span>");
						fn_span = jQuery("<span class=\"tooltip inv "+fn_class+"\" style=\"position: absolute; display: none; top: 0px; left: 0px;\">"+fn_seta_inv+"<span class=\"texto\">"+fn_txt+"</span>"+fn_seta+"</span>");
						jQuery("body").prepend(fn_span);
						
						fn_tool = jQuery(".tooltip").first();
						fn_pos_tool = bi.GetPos({el: fn_tool});
						
						if(fn_tooltiplargura != undefined && fn_pos_tool.largura > fn_tooltiplargura){
							//fn_largura = "width: "+fn_tooltiplargura+"px;";
							//console.log(fn_tool);
							fn_tool.css("width", fn_tooltiplargura);
						}
						
						fn_pos_tool = bi.GetPos({el: fn_tool});

						switch(fn_tooltipy){
							case "topo":
								fn_tool.css("width", fn_pos_tool.largura);
								fn_tool.css("left", fn_x - parseInt(fn_pos_tool.largura/2) + parseInt(fn_pos.largura/2));
								fn_tool.css("top", fn_y + fn_pos.altura);
								break;
							default:
								fn_tool.css("width", fn_pos_tool.largura);
								fn_tool.css("left", fn_x - parseInt(fn_pos_tool.largura/2) + parseInt(fn_pos.largura/2));
								fn_tool.css("top", fn_y - fn_pos_tool.altura);
								break;
						}
						
						switch(fn_tooltipx){
							case "esq":
								fn_tool.css("left", fn_x - 10);
								fn_tool.find(".topo, .baixo").css("left", parseInt(fn_pos.largura/2));
								break;
							case "dir":
								fn_tool.css("left", fn_x - parseInt(fn_pos_tool.largura) + parseInt(fn_pos.largura) + 10);
								fn_tool.find(".topo, .baixo").css("left", parseInt(fn_pos_tool.largura) - parseInt(fn_pos.largura/2) - 20);
								break;
							default:
								fn_tool.find(".topo, .baixo").css("left", fn_pos_tool.largura/2 - 10);
								break;
						}
													
						fn_tool.css("display", "block");
					}

				}
			}
		},
		// Fim [TooltipExibe]
		
		// Inicio [TooltipLimpa]
		TooltipLimpa: function(){
			jQuery(".tooltip").remove();
		},
		// Inicio [TooltipLimpa]
		
		// Inicio [MultiSelect]
		MultiSelect: function(param){
			var fn_el, fn_select, fn_option, fn_class, fn_scroll, fn_sel, fn_el_id;
			//$("#select01 :selected").map(function(){ return "\"" + this.value + "\"" }).get().join(",");
			jQuery(function(){
							
				fn_sel = "*[multiselect]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
					if(param.div){
						fn_sel = "#" + param.div + " *[multiselect]";
					}
				}

				jQuery(fn_sel).each(function(){
					fn_el = jQuery(this);
					
					if(fn_el.attr("id") == undefined){
						fn_el.attr("id", bi.BiId());
					}

					fn_el_id = fn_el.attr("id");
					fn_option = "";
															
					bi.ScrollRemove({id: "bi_scroll_" + fn_el_id});
					bi.MultiSelectRemove({id: fn_el_id});
					
					//fn_el.css("display", "none");
					fn_el.attr("style", "position: absolute; left:" + -bi.navegador.largura + "px;");
					
					if(fn_el.attr("class") != undefined){
						fn_class = "multiselect " + fn_el.attr("class");
					}else{
						fn_class = "multiselect";
					}
					
					if(fn_el.attr("multiselectscroll") != undefined){
						fn_scroll = "scroll=\"1\"";
					}else{
						fn_scroll = "";
					}

					jQuery("#" + fn_el.attr("id") + " option").each(function(){
						fn_option += "<span class=\"option\" onclick=\"bi.MultiSelectClick({id: '"+fn_el.attr("id")+"', ind: '"+this.index+"'});\">"+this.text+"</span>";
					});
					fn_select = jQuery("<span id=\"bi_"+fn_el.attr("id")+"\" class=\""+fn_class+"\"><span id=\"bi_scroll_"+fn_el.attr("id")+"\" class=\"scroll\" "+fn_scroll+">"+fn_option+"</span></span>");
					jQuery(fn_select).insertBefore(fn_el);
					
					bi.MultiSelectRefresh({id: fn_el_id});
					bi.Scroll({id: "bi_scroll_" + fn_el_id});
					
					fn_el.bind("keyup", function(event){
						bi.MultiSelectRefresh({id: jQuery(this).attr("id")});
						bi.ScrollRefresh({id: fn_el.attr("id")});
						if(event.which == 13){
							bi.ApertaEnter();
						}
					});
					
				});
			});
		},
		// Fim [MultiSelect]
		
		// Inicio [MultiSelectRemove]
		MultiSelectRemove: function(param){
			var fn_el, fn_sel;
			//jQuery(function(){
				fn_sel = "*[multiselect]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
					if(param.div){
						fn_sel = "#" + param.div + " *[multiselect]";
					}
				}

				jQuery(fn_sel).each(function(){
					fn_el = jQuery(this);
					jQuery("#bi_"+fn_el.attr("id")).remove();
					fn_el.css("display", "");
				});
			//});
		},
		// Fim [MultiSelectRemove]
		
		// Inicio [MultiSelectRefresh]
		MultiSelectRefresh: function(param){
			var fn_selector;
			//jQuery(function(){
							  
				fn_selector = "*[multiselect]";
				if(param){
					if(param.id){
						fn_selector = "#" + param.id;
					}
				}

				jQuery(fn_selector).each(function(){
					var fn_el, fn_sel, fn_span;
					fn_el = jQuery(this);
					fn_span = jQuery("#bi_" + fn_el.attr("id") + " .scroll").children();
					jQuery("#" + fn_el.attr("id") + " option").each(function(){
						fn_sel = jQuery(this).prop("selected");
						if(fn_sel){
							fn_span.eq(this.index).addClass("selected");
						}else{
							fn_span.eq(this.index).removeClass("selected");
						}
					});
					//bi.ScrollRefresh({id: "bi_scroll_" + fn_el.attr("id")});
				});
			//});
		},
		// Fim [MultiSelectRefresh]
		
		// Inicio [MultiSelectClick]
		MultiSelectClick: function(param){
			var fn_el, fn_sel, fn_span;
			if(param){
				if(param.id && param.ind){
					fn_span = jQuery("#bi_" + param.id + " .scroll").children();
					fn_el = jQuery("#" + param.id + " option");
					fn_sel = fn_el.eq(param.ind).prop("selected");
					if(fn_sel){
						fn_el.eq(param.ind).prop("selected", false);
						fn_span.eq(param.ind).removeClass("selected");
					}else{
						fn_el.eq(param.ind).prop("selected", true);
						fn_span.eq(param.ind).addClass("selected");
					}
					
					bi.ultimo_clique = fn_el.parent();
					bi.ultimo_clique.focus();
					//bi.ultimo_clique = jQuery(bi.ultimo_clique).parents("form").find("select,input,textarea").get(0);
				}
			}
		},
		// Fim [MultiSelectClick]
		
		// Inicio [Checkbox]
		Checkbox: function(param){
			var fn_el, fn_checkbox, fn_sel, fn_el_id;
			jQuery(function(){
				
				fn_sel = "*[checkbox]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
					if(param.div){
						fn_sel = "#" + param.div + " *[checkbox]";
					}
				}

				jQuery(fn_sel).each(function(){
					fn_el = jQuery(this);
					
					if(fn_el.attr("id") == undefined){
						fn_el.attr("id", bi.BiId());
					}
					
					fn_el_id = fn_el.attr("id");
					bi.TouchRemove({id: "bi_" + fn_el_id});
					bi.CheckboxRemove({id: fn_el_id});
					fn_el.css("display", "none");
					
					//fn_checkbox = jQuery("<span id=\"bi_"+fn_el.attr("id")+"\" class=\"checkbox\" touch=\"bi.CheckboxClick({id: '"+fn_el.attr("id")+"'});\"><span class=\"img\"></span></span>");
					fn_checkbox = jQuery("<span id=\"bi_"+fn_el.attr("id")+"\" class=\"checkbox\" onclick=\"bi.CheckboxClick({id: '"+fn_el.attr("id")+"'});\"><span class=\"img\"></span></span>");
					
					jQuery(fn_checkbox).insertBefore(fn_el);
					bi.Touch({id: "bi_" + fn_el_id});
				});
				bi.CheckboxRefresh();
			});
		},
		// Fim [Checkbox]
		
		// Inicio [CheckboxRemove]
		CheckboxRemove: function(param){
			var fn_el, fn_sel;
			//jQuery(function(){
							
				fn_sel = "*[checkbox]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
					if(param.div){
						fn_sel = "#" + param.div + " *[checkbox]";
					}
				}

				jQuery(fn_sel).each(function(){
					fn_el = jQuery(this);
					jQuery("#bi_"+fn_el.attr("id")).remove();
					fn_el.css("display", "");
				});
			//});
		},
		// Fim [CheckboxRemove]
		
		// Inicio [CheckboxRefresh]
		CheckboxRefresh: function(){
			var fn_el, fn_span, fn_sel;
			jQuery(function(){
				jQuery("*[checkbox]").each(function(){
					fn_el = jQuery(this);
					fn_span = jQuery("#bi_" + fn_el.attr("id") + " .img");
					fn_sel = fn_el.prop("checked");
					
					if(fn_sel){
						fn_span.addClass("selected");
					}else{
						fn_span.removeClass("selected");
					}
				});
			});
		},
		// Fim [CheckboxRefresh]
		
		// Inicio [CheckboxClick]
		CheckboxClick: function(param){
			var fn_el, fn_checkbox, fn_checked, fn_type;
			if(param){
				if(param.id){
					fn_el = jQuery("#" + param.id);
					fn_checkbox = jQuery("#bi_" + param.id + " .img");
					fn_checked = fn_el.prop("checked");
					fn_type = fn_el.attr("type");
					if(fn_type == "radio"){
						jQuery("[name='"+fn_el.attr("name")+"']").each(function(){ 
							jQuery(this).prop("checked", false);
							jQuery("#bi_"+ jQuery(this).attr("id") + " .img" ).removeClass("selected");
						});
					}
					if(fn_checked){
						fn_el.prop("checked", false);
						fn_checkbox.removeClass("selected");
					}else{
						fn_el.prop("checked", true);
						fn_checkbox.addClass("selected");
					}
					bi.ultimo_clique = fn_el;
				}
			}
		},
		// Fim [CheckboxClick]

		// Inicio [Scroll]
		Scroll: function(param){
			var fn_el, fn_scroll, fn_bi_scroll, fn_scroll_back, fn_scroll_bar, fn_mousey, fn_scroll_back_pos, fn_scroll_bar_pos, fn_el_pos, fn_win, fn_doc, fn_track, fn_grip, fn_ratio, fn_pos, fn_seta_a, fn_seta_a_pos, fn_seta_b, fn_seta_b_pos, fn_thread, fn_pai, fn_class, fn_sel, fn_el_id;
			jQuery(function(){
							
				fn_sel = "*[scroll]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
					if(param.div){
						fn_sel = "#" + param.div + " *[scroll]";
					}
				}

				jQuery(fn_sel).each(function(){
					fn_el = jQuery(this);
					
					if(fn_el.attr("id") == undefined){
						fn_el.attr("id", bi.BiId());
					}
					
					fn_el_id = fn_el.attr("id");
					fn_el_pos = bi.GetPos({el: fn_el});
					
					fn_doc = this.scrollHeight;
					fn_win = fn_el_pos.altura;
					fn_ratio = fn_win/fn_doc;
					
					fn_class = fn_el.attr("scrollclass") ? fn_el.attr("scrollclass") : "";
										
					bi.ScrollRemove({id: fn_el_id});
					fn_el.css("overflow", "hidden");
					
					fn_scroll = jQuery(
						"<div id=\"bi_"+fn_el.attr("id")+"\" class=\"bi_scroll "+fn_class+"\" style=\"position: absolute; display: inline-block; top: 0px; left: 0px; height: "+fn_win+"px;\">" +
						"<span class=\"seta_a\"></span>" +
						"<span class=\"bi_scroll_back\">" +
						"<span class=\"bi_scroll_bar\"></span>" +
						"</span>" +
						"<span class=\"seta_b\"></span>" +
						"</div>"
					);
					fn_el.wrap(jQuery("<div class=\"bi_pai\"></div>"));
					jQuery(fn_scroll).insertAfter(fn_el);
					
					fn_el_pos = bi.GetPos({el: fn_el});
					fn_bi_scroll = jQuery("#bi_" + fn_el.attr("id"));
					fn_scroll_back = jQuery("#bi_" + fn_el.attr("id") + " .bi_scroll_back");
					fn_scroll_back_pos = bi.GetPos({el: fn_scroll_back});
					fn_scroll_bar = fn_scroll_back.children();
					fn_seta_a = jQuery("#bi_" + fn_el.attr("id") + " .seta_a");
					fn_seta_a_pos = bi.GetPos({el: fn_seta_a});
					fn_seta_b = jQuery("#bi_" + fn_el.attr("id") + " .seta_b");
					
					//fn_grip = (fn_scroll_back_pos.altura * fn_ratio) < 30 ? 30 : (fn_scroll_back_pos.altura * fn_ratio);
					
					fn_track = fn_el_pos.altura - (fn_seta_a_pos.altura * 2);
					fn_scroll_back.css("height", parseInt(fn_track));
					fn_grip = fn_track * fn_ratio;
					fn_scroll_bar.css("height", parseInt(fn_grip));
					fn_scroll_bar.css("opacity", 0);
					
					//fn_bi_scroll.css("top", fn_el_pos.topo).css("left", fn_el_pos.direita).css("opacity", 1);
					fn_bi_scroll.css("top", fn_el_pos.y).css("left", fn_el_pos.largura).css("opacity", 1);
					
					fn_pai = fn_bi_scroll.parent();
					
					fn_pos = parseInt(fn_el.attr("scrollpos")) ? parseInt(fn_el.attr("scrollpos")) : 0;
					
					fn_el.stop().animate({scrollTop: parseInt(fn_el.attr("scrollpos"))}, 0);
					
					//if(fn_pai.get(0) != undefined){
					//	fn_bi_scroll.remove();
					//	jQuery(fn_bi_scroll).insertAfter(fn_pai);
					//}
					
					fn_scroll_back_pos = bi.GetPos({el: fn_scroll_back});
					if(fn_doc <= fn_scroll_back_pos.altura){
						//fn_bi_scroll.css("display", "none");
						fn_scroll_bar.css("height", parseInt(fn_track));
						//fn_scroll_bar.css("height", fn_el.height());
						//jQuery("#debug").append( fn_el.attr("id") + " - " + fn_doc + " - " + fn_scroll_back_pos.altura + "<br/>" );
					}
					
					//fn_bi_scroll.bind("mouseenter", function(){ jQuery(this).css("opacity", 1).children().css("display", "inline-block"); });
					//fn_bi_scroll.bind("mouseleave", function(){ jQuery(this).css("opacity", 0.5).children().css("display", "none"); });

					//fn_pai.bind("mouseenter", function(){ jQuery("#bi_" + jQuery(this).children().attr("id")).css("opacity", 1).children().css("display", "inline-block"); });
					//fn_pai.bind("mouseleave", function(){ jQuery("#bi_" + jQuery(this).children().attr("id")).css("opacity", 0.5).children().css("display", "none"); });
					
					fn_seta_a.bind(bi.navegador.touch_start, function(){
						var fn_el;
						fn_el = jQuery("#" + jQuery(this).parent().attr("id").replace("bi_", "") );
						fn_thread = setInterval(function(){
							fn_el.stop().animate({scrollTop: fn_el.scrollTop() - 10}, 0);
							bi.ScrollRefresh();
						}, 50);						
					}).bind(bi.navegador.touch_end + bi.navegador.touch_leave, function(){
						//"mouseup mouseleave"
						clearInterval(fn_thread);
					});

					fn_seta_b.bind(bi.navegador.touch_start, function(){
						fn_el = jQuery("#" + jQuery(this).parent().attr("id").replace("bi_", "") );
						fn_thread = setInterval(function(){
							fn_el.stop().animate({scrollTop: fn_el.scrollTop() + 10}, 0);
							bi.ScrollRefresh();
						}, 50);
					}).bind(bi.navegador.touch_end + bi.navegador.touch_leave, function(){
						//"mouseup mouseleave"
						clearInterval(fn_thread);
					});

					fn_el.bind("mousewheel DOMMouseScroll", function(event){
						//"mousewheel DOMMouseScroll"
						event.preventDefault();
						fn_el = jQuery(this);
						fn_bi_scroll = jQuery("#bi_" + fn_el.attr("id"));
						fn_scroll_back = fn_bi_scroll.children().next();
						fn_scroll_back_pos = bi.GetPos({el: fn_scroll_back});
						fn_scroll_bar = fn_scroll_back.children();
						fn_scroll_bar_pos = bi.GetPos({el: fn_scroll_bar});
						
						if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0){
							//console.log("up");
							fn_pos = fn_el.scrollTop() - 10;
						}else{
							//console.log("down");
							fn_pos = fn_el.scrollTop() + 10;
						}
						
						fn_el.stop().animate({scrollTop: fn_pos}, 0);
						bi.ScrollRefresh();
						
						return false;
					});
					
					fn_scroll_back.bind(bi.navegador.touch_start, function(event){
						bi.drag = jQuery(this).children();
						event.preventDefault();
						return false;
					});
					
					fn_scroll_back.bind(bi.navegador.touch_end + bi.navegador.touch_leave, function(event){
						//"mouseup mouseleave"
						bi.drag = null;
					});
					
					fn_scroll_back.bind(bi.navegador.touch_move, function(event){						
						var fn_pagY;
						event.preventDefault();
						if(bi.drag){
							fn_scroll_back = jQuery(this);
							fn_scroll_back_pos = bi.GetPos({el: fn_scroll_back});
							fn_scroll_bar = fn_scroll_back.children();
							fn_scroll_bar_pos = bi.GetPos({el: fn_scroll_bar});
							fn_el = jQuery("#" + jQuery(fn_scroll_back.parent()).attr("id").replace("bi_", "") );
							
							fn_pagY = event.pageY != undefined ? event.pageY : event.originalEvent.targetTouches[0].pageY;

							//fn_mousey = event.pageY ? event.pageY - fn_scroll_back_pos.topo : event.originalEvent.targetTouches[0] - fn_scroll_back_pos.topo;
							//fn_mousey = event.pageY - fn_scroll_back_pos.topo;
							//fn_pos = (fn_mousey - fn_scroll_bar_pos.altura/2) / fn_scroll_bar.attr("scrollratio");
							fn_mousey = fn_pagY - fn_scroll_back_pos.topo;
							fn_pos = fn_mousey;
							
							bi.ScrollMove({id: fn_el.attr("id"), pos: fn_pos});							
						}
						return false;
					});
					
					/*if(bi.navegador.mobile == true){
					fn_el.bind(bi.navegador.touch_start, function(event){
						var fn_scroll_back;
						fn_scroll_back = jQuery( jQuery(this).parent().children().next().children(".bi_scroll_back") );
						//console.log(fn_scroll_back.get(0));
						bi.drag = fn_scroll_back.children();
						if(bi.navegador.mobile == false){
							event.preventDefault();
							return false;
						}
					});
					
					fn_el.bind(bi.navegador.touch_end + bi.navegador.touch_leave, function(event){
						//"mouseup mouseleave"
						bi.drag = null;
					});

					fn_el.bind(bi.navegador.touch_move, function(event){
						var fn_pagY;
						event.preventDefault();
						if(bi.drag){
							fn_scroll_back = jQuery( jQuery(this).parent().children().next().children(".bi_scroll_back") );
							fn_scroll_back_pos = bi.GetPos({el: fn_scroll_back});
							fn_scroll_bar = fn_scroll_back.children();
							fn_scroll_bar_pos = bi.GetPos({el: fn_scroll_bar});
							fn_el = jQuery("#" + jQuery(fn_scroll_back.parent()).attr("id").replace("bi_", "") );
							
							fn_pagY = event.pageY != undefined ? event.pageY : event.originalEvent.targetTouches[0].pageY;

							//fn_mousey = event.pageY ? event.pageY - fn_scroll_back_pos.topo : event.originalEvent.targetTouches[0] - fn_scroll_back_pos.topo;
							//fn_mousey = event.pageY - fn_scroll_back_pos.topo;
							//fn_pos = (fn_mousey - fn_scroll_bar_pos.altura/2) / fn_scroll_bar.attr("scrollratio");
							fn_mousey = fn_pagY - fn_scroll_back_pos.topo;
							fn_pos = fn_mousey;
							
							bi.ScrollMove({id: fn_el.attr("id"), pos: fn_pos});							
						}
						return false;
					});
					}*/
					bi.ScrollRefresh({id: fn_el_id});
				});
				//bi.ScrollRefresh();
			});
		},
		// Fim [Scroll]
		
		// Inicio [ScrollRemove]
		ScrollRemove: function(param){
			var fn_el, fn_span, fn_sel;
			//jQuery(function(){
				fn_sel = "*[scroll]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
					if(param.div){
						fn_sel = "#" + param.div + " *[scroll]";
					}
				}
				
				jQuery(fn_sel).each(function(){
					fn_el = jQuery(this);
					jQuery("#bi_"+fn_el.attr("id")).remove();
					//fn_el.parent(".bi_pai");
					if(fn_el.parent(".bi_pai").get(0) != undefined){
						fn_el.unwrap();
					}
					fn_el.css("overflow", "auto");
					fn_el.unbind();
					jQuery(this).unbind();
				});
			//});
		},
		// Fim [ScrollRemove]
		
		// Inicio [ScrollRefresh]
		ScrollRefresh: function(param){
			var fn_sel;
			//jQuery(function(){

				fn_sel = "*[scroll]";
				if(param){
					if(param.id){
						fn_sel = "#" + param.id;
					}
				}
								
				jQuery(fn_sel).each(function(){
					var fn_el, fn_el_pos, fn_bi_scroll, fn_scroll_back, fn_scroll_back_pos, fn_scroll_bar, fn_scroll_bar_pos, fn_pos, fn_doc, fn_grip, fn_el_span, fn_span_pos;
					fn_el = jQuery(this);
					fn_el_span = fn_el;
					if(fn_el.attr("multiple")){
						fn_el_span = jQuery("#bi_scroll_" + fn_el.attr("id"));
					}
					fn_el_pos = bi.GetPos({el: fn_el_span});
					fn_bi_scroll = jQuery("#bi_" + fn_el_span.attr("id"));
					fn_scroll_back = fn_bi_scroll.children().next();
					fn_scroll_back_pos = bi.GetPos({el: fn_scroll_back});
					fn_scroll_bar = fn_scroll_back.children();
					fn_scroll_bar_pos = bi.GetPos({el: fn_scroll_bar});
					
					fn_pos = fn_el.scrollTop();
					fn_doc = fn_el.get(0).scrollHeight;
					
					fn_grip = (fn_pos * fn_scroll_back_pos.altura)/(fn_doc);
					fn_span_pos = parseInt( (fn_pos * fn_bi_scroll.get(0).scrollHeight) / fn_scroll_back_pos.altura );
					
					fn_el_span.attr("scrollpos", fn_pos);
					
					fn_scroll_bar.css("top", fn_grip);
					fn_scroll_bar.css("opacity", 1);
					
					if(fn_el.attr("multiple")){
						fn_el_span.stop().animate({scrollTop: fn_span_pos}, 0);
					}
					//console.log(fn_pos + " - " + fn_doc + " - " + fn_el_pos.altura + " - " + fn_scroll_back_pos.altura + " - " + fn_grip);
				});
			//});
		},
		// Fim [ScrollRefresh]
		
		// Inicio [ScrollMove]
		ScrollMove: function(param){
			var fn_el, fn_bi_scroll, fn_scroll_bar, fn_min, fn_max, fn_grip, fn_grip_mod;
			if(param){
				if(param.id && param.pos){
					fn_el = jQuery("#" + param.id);
					fn_el_pos = bi.GetPos({el: fn_el});
					fn_bi_scroll = jQuery("#bi_" + param.id);
					fn_scroll_back = fn_bi_scroll.children().next();
					fn_scroll_back_pos = bi.GetPos({el: fn_scroll_back});
					fn_scroll_bar = fn_scroll_back.children();
					fn_scroll_bar_pos = bi.GetPos({el: fn_scroll_bar});
					
					fn_min = 0;
					fn_max = fn_scroll_back_pos.altura - fn_scroll_bar_pos.altura;
					
					fn_grip = parseInt(((param.pos - fn_scroll_bar_pos.altura/2) * document.getElementById(param.id).scrollHeight) / (fn_scroll_back_pos.altura));
					fn_grip_mod = param.pos - fn_scroll_bar_pos.altura/2;
					
					if(fn_grip < fn_min){
						fn_grip_mod = fn_min;
					}
					
					if(fn_grip_mod > fn_max){
						fn_grip_mod = fn_max;
					}
					
					fn_el.attr("scrollpos", fn_grip);
					
					bi.drag.css("top", fn_grip_mod);
					
					fn_el.stop().animate({scrollTop: fn_grip}, 0);
				}
			}
		},
		// Fim [ScrollMove]

		// Inicio [ZoomIn]
		ZoomIn: function(param){
			var fn_el, fn_zoom, fn_el_pos, fn_scroll, fn_width, fn_height, fn_fx, fn_classe;
			if(param){
				if(param.id){
					fn_el = jQuery("#" + param.id);
				}
				if(param.el){
					fn_el = param.el;
				}
				
				fn_fx = 300;
				fn_classe = "";
				
				if(jQuery("#" + bi.zoom_id).get(0) == undefined){
					jQuery("body").prepend("<div id=\""+bi.zoom_id+"\" style=\"position: absolute; display: block; background-color: #fff;\" lock=\"1\" onclick=\"bi.ZoomOut();\"></div>");
				}
				fn_zoom = jQuery("#" + bi.zoom_id);
				fn_zoom.css("display", "none");
				fn_zoom.html( jQuery(fn_el).clone().css("margin", 0).css("padding", 0).attr("onclick", "") );
				
				bi.LightboxAdiciona({id: bi.zoom_id});
				bi.LightboxExibe({over: bi.over_id});
				
				fn_zoom.css("display", "block").css("z-index", parseInt(jQuery("#" + bi.over_id).css("z-index")) + 1);
				
				fn_el_pos = bi.GetPos({el: fn_el});
				fn_scroll = jQuery(window).scrollTop();

				fn_height = (fn_el_pos.altura * bi.navegador.altura/fn_el_pos.altura) - 20;
				fn_width = (fn_el_pos.largura * bi.navegador.largura/fn_el_pos.largura) - 20;
				
				if(bi.navegador.altura < bi.navegador.largura){
					fn_width = fn_el_pos.largura * fn_height/fn_el_pos.altura;
				}else{
					fn_height = fn_el_pos.altura * fn_width/fn_el_pos.largura;;
				}

				fn_zoom.stop().animate({left: fn_el_pos.esquerda, top: fn_el_pos.topo, width: fn_el_pos.largura, height: fn_el_pos.altura}, 0);
				fn_zoom.stop().animate({left: (bi.navegador.largura - fn_width)/2, top: fn_scroll + (bi.navegador.altura - fn_height)/2, width: fn_width, height: fn_height}, fn_fx);
				fn_zoom.children().stop().animate({width: fn_width, height: fn_height}, fn_fx);
				
				if(param.classe){
					fn_classe = fn_zoom.find("." + param.classe);
					fn_classe.animate({width: (fn_classe.width() * fn_width / fn_el_pos.largura)}, fn_fx);
					fn_zoom.attr("zoomclasse", param.classe).attr("zoomicone", fn_classe.width());
				}
				
				fn_zoom.attr("zoomleft", fn_el_pos.esquerda).attr("zoomtop", fn_el_pos.topo).attr("zoomlargura", fn_el_pos.largura).attr("zoomaltura", fn_el_pos.altura);
			}
		},
		// Fim [ZoomIn]
		
		// Inicio [ZoomOut]
		ZoomOut: function(){
			var fn_el, fn_width, fn_height, fn_fx, fn_classe;
			fn_el = jQuery("#" + bi.zoom_id);
			fn_fx = 300;
			
			fn_width = fn_el.attr("zoomlargura");
			fn_height = fn_el.attr("zoomaltura");
			fn_classe = fn_el.attr("zoomclasse");

			fn_el.stop().animate({left: fn_el.attr("zoomleft"), top: fn_el.attr("zoomtop"), width: fn_width, height: fn_height}, fn_fx, function(){ jQuery(this).css("display", "none").html(""); });
			fn_el.children().stop().animate({width: fn_width, height: fn_height}, fn_fx);
			
			if(fn_classe != ""){
				fn_el.find("." + fn_classe).animate({width: fn_el.attr("zoomicone")}, fn_fx);
			}
			
			bi.LightboxEsconde({lightbox: bi.zoom_id});
			bi.LightboxEsconde();
		},
		// Fim [ZoomOut]
		
		// Inicio [Menu]
		Menu: function(param){
			var fn_el, fn_pos, fn_size, fn_div, fn_obj, fn_style, fn_classe, fn_over;
			fn_classe = bi.menu_id;
			if(param){
				if(param.id){
					fn_el = jQuery("#"+param.id);
				}
				if(param.el){
					fn_el = jQuery(param.el);
				}
				if(param.classe){
					fn_classe = param.classe;
				}
				
				if(jQuery("#bi_menu").size() == 0){
					fn_div = jQuery("<div id=\""+bi.menu_id+"\" style=\"display: none;\"></div>");
					jQuery("body").prepend(fn_div);
					fn_div = jQuery("<div id=\""+bi.menu_id+"_over\" style=\"display: none;\"></div>");
					jQuery("body").prepend(fn_div);
					//jQuery("#"+bi.menu_id).bind(bi.navegador.touch_leave, function(){ jQuery(this).hide(); });
					jQuery("#"+bi.menu_id+"_over").bind("click", function(){ bi.MenuEsconde(); });
				}
				
				fn_obj = jQuery("#"+bi.menu_id);
				fn_obj.html("");
				fn_over = jQuery("#"+bi.menu_id+"_over");
								
				// Inicio [cria]
				if(param.opcoes){
					for(var fn_a=0; fn_a<param.opcoes.length; fn_a++){
						fn_div = jQuery("<a href=\"#\" onclick=\"return "+param.funcao[fn_a]+"\">"+param.opcoes[fn_a]+"</a>");
						fn_obj.append(fn_div);
					}
					//fn_div = jQuery("<a href=\"#\" onclick=\"return bi.Link({funcao: function(){ eval(bi.DivEsconde({id: '"+bi.menu_id+"'}) )} });\">Fechar</a>");
					//fn_div = jQuery("<a href=\"#\" onclick=\"return bi.Link({funcao: 'bi.DivEsconde({id: '"+bi.menu_id+"'})' });\">Fechar</a>");
					fn_obj.append(fn_div);
				}
				// Fim [cria]
				
				// Inicio [posicao]
				fn_obj.addClass(fn_classe);
				fn_pos = bi.GetPos({el: fn_el});
				fn_size = bi.GetPos({el: fn_obj});
				//fn_size = bi.GetSize({el: fn_el});
				
				fn_style = "top: "+fn_pos.baixo+"px; left: "+fn_pos.esquerda+"px;";

				if(param.pos){
					switch(param.pos){
						case "te":
							fn_style = "top: "+(fn_pos.topo-fn_size.altura)+"px; left: "+fn_pos.esquerda+"px;";
							break;
						case "td":
							fn_style = "top: "+(fn_pos.topo-fn_size.altura)+"px; left: "+(fn_pos.direita-fn_size.largura)+"px;";
							break;
						case "bd":
							fn_style = "top: "+(fn_pos.baixo)+"px; left: "+(fn_pos.direita-fn_size.largura)+"px;";
							break;
						default:
							fn_style = "top: "+fn_pos.baixo+"px; left: "+fn_pos.esquerda+"px;";
					}
				}
				// Fim [posicao]

				bi.LightboxAdiciona({id: bi.menu_id});
				//bi.LightboxExibe({over: bi.over_id});
				fn_obj.attr("style", "position: absolute; display: inline-block; z-index: "+bi.LightboxZindex({lightbox: bi.menu_id})+"; " + fn_style);
				//jQuery("#" + bi.over_id).css("opacity", 0);
				//bi.Log({texto: param.pos});
				
				fn_over.attr("style", "position: absolute; display: block; width: "+bi.GetDocumentoLargura()+"px; height: "+bi.GetDocumentoAltura()+"px; z-index: "+parseInt(fn_obj.css("z-index"))+"; background-color: #fff;").css("opacity", 0);
				
				return false;
			}
		},
		// Fim [Menu]
		
		// Inicio [MenuEsconde]
		MenuEsconde: function(){
			bi.LightboxEsconde();
			bi.DivEsconde({id: bi.menu_id+"_over"});
		},
		// Fim [MenuEsconde]
		
		// Inicio [Jmenu]
		Jmenu: function(param){
			jQuery(function(){
				var fn_tipo, fn_el;
				fn_tipo = "horizontal";
				if(param){
					if(param.tipo){
						fn_tipo = param.tipo.toLowerCase();
					}
					if(param.id){
						fn_el = jQuery("#" + param.id);
						if(fn_tipo == "horizontal"){
							fn_el.jMenu();
						}
						if(fn_tipo == "vertical"){
							//console.log(fn_el.get(0));
							fn_el.menu();
							fn_el.parent().css("display", "inline-block").css("height", "inherit");
							fn_el.css("float", "none").css("display", "inline-block").css("width", "inherit");
							fn_el.find("li").css("float", "none");
						}
						fn_el.find("li").bind(bi.navegador.touch_enter, function(){ jQuery(this).addClass("hover"); }).bind(bi.navegador.touch_leave, function(){ jQuery(this).removeClass("hover"); });
					}
				}
			});
		},
		// Fim [Jmenu]
		// Fim [ui]
		
		// Inicio [CriaLink]
		CriaLink: function(param){
			var retorna = false;
			if(param){
				if(param.end){
					var o_link = jQuery(
						"<link rel=\"shortcut icon\" href=\""+param.end+"\" />"
					);
					
					jQuery("head").append(o_link);
					retorna = true;
				}
			}
			//<link rel="shortcut icon" href="/imgs/favicon.ico"/>
			return retorna;
		},
		// Fim [CriaLink]
		
		// Inicio [CriaScript]
		CriaScript: function(param){
			var retorna = false;
			if(param){
				if(param.end){
					var o_script = document.createElement("script");
					o_script.type = "text/javascript";
					o_script.src = param.end;
					
					jQuery("head").append(o_script);
					retorna = true;
				}
			}
			return retorna;
		},
		// Fim [CriaScript]

		// Inicio [NomePagina]
		NomePagina: function(){
			return window.location.pathname.match(/.*\/(.*)$/)[1].toLowerCase();
			//return "lightbox_3.html";
		},
		// Fim [NomePagina]
								
		// Inicio [AlternaDisplay]
		AlternaDisplay: function(param){
			if(param){
				if(param.id){
					if(document.getElementById(param.id)){
						if(bi.ConfereDisplay({id: param.id}) == true){
							document.getElementById(param.id).style.display = "none";
						}else{
							document.getElementById(param.id).style.display = "";
						}
					}
				}
			}
		},
		// Fim [AlternaDisplay]

		// Inicio [trim]		
		Trim: function(str){
			var retorna = "";
			if(str){
				var padrao = /^\s+|\s+$/g;
				padrao.lastIndex = 0;
				retorna = str.replace(padrao,"");
				//return str.replace(padrao,"");
			}
			return retorna;
		},
		// Fim [trim]

		// Inicio [MaxLength]
		MaxLength: function(obj, MaxLen){
			return (obj.value.length <= MaxLen);
		},
		// Fim [MaxLength]
		
		// Inicio [TempoAtual]
		TempoAtual: function(){
			var now = new Date();
			var segundos = now.getSeconds();
			var minutos = now.getMinutes();
			
			//return minutos + "," + segundos;
			return [minutos, segundos];
		},
		// Fim [TempoAtual]
		
		// Inicio [BloqueiaSelecao]
		BloqueiaSelecao: function(param){
			var retorna = true;
			if(param){
				if(!param.ativo){
					param.ativo = "1";
				}
				if(param.elemento){
					if(param.ativo == "1"){
						jQuery(param.elemento).attr("onselectstart", "return false;");
					}else{
						jQuery(param.elemento).attr("onselectstart", "");
					}
				}
			}
			return retorna;
		},
		// Fim [BloqueiaSelecao]
		
		// Inicio [Block]
		Block: function(){
			jQuery(function(){
				var fn_el;
				fn_el = jQuery("<span id=\""+bi.block_id+"\" style=\"position: absolute; display: block; width: "+bi.GetDocumentoLargura()+"px; height: "+bi.GetDocumentoAltura()+"px; z-index: 900; background-color: #fff;\"></span>").css("opacity", 0);
				jQuery("body").prepend(fn_el);
			});
		},
		// Fim [Block]
		
		// Inicio [BlockLimpa]
		BlockLimpa: function(){
			jQuery(function(){
				jQuery("#" + bi.block_id).remove();
			});
		},
		// Fim [BlockLimpa]
		
		// Inicio [Permite]
		Permite: function(){
			var fn_el, fn_arr_ind, fn_arr, fn_spt, fn_ret;
			jQuery(function(){
				jQuery("*[permite]").each(function(){
					fn_el = jQuery(this);
					fn_el.unbind();
					fn_el.bind("keypress", function(event){
						var fn_arr, fn_el;
						fn_arr = new Array();
						fn_el = jQuery(this);
						bi.Log({texto: event.which + " - " + String.fromCharCode(event.which)});
						switch(fn_el.attr("permite").toLowerCase()){
							case "numero":
								fn_arr = bi.keycode[0];
								//fn_arr_ind = jQuery.inArray(event.which, bi.keycode[0]);
								//return fn_arr_ind >= 0 ? bi.keycode[0][fn_arr_ind] : false;
								break;
							case "valor":
								fn_arr = bi.keycode[1];
								//fn_arr_ind = jQuery.inArray(event.which, bi.keycode[1]);
								//return fn_arr_ind >= 0 ? bi.keycode[1][fn_arr_ind] : false;
								break;
							case "multi_valor":
								fn_arr = bi.keycode[2];								
								break;
							default:
								//fn_spt = "89,85".split(",");
								fn_spt = fn_el.attr("permite").split(",");
								for(var fn_a = 0; fn_a < fn_spt.length; fn_a++){
									//console.log(fn_spt[fn_a]);
									fn_arr.push(parseInt(fn_spt[fn_a]));
								}
								break;
						}
						fn_arr_ind = jQuery.inArray(event.which, fn_arr);						
						//return fn_arr_ind >= 0 ? fn_arr[fn_arr_ind] : false;
						//console.log("permiteinv =" + fn_el.attr("permiteinv"));
						if(fn_el.attr("permiteinv") == undefined){
							fn_ret = fn_arr_ind >= 0 ? fn_arr[fn_arr_ind] : false;
						}else{
							fn_ret = fn_arr_ind < 0 ? event.which : false;
						}
						return fn_ret;
					});
				});
			});
		},
		// Fim [Permite]
		
		// Inicio [Link]
		Link: function(param){
			if(param){
				if(param.endereco){
					bi.LightboxExibe({lightbox: "load"});
					window.location = param.endereco;
				}
			}
			return false;
		},
		// Fim [Link]
		
		// Inicio [Filtro]
		Filtro: function(param){
			var fn_el, fn_div, fn_img1, fn_img2;
			if(param){
				if(param.id){
					fn_el = jQuery("#" + param.id);
				}
				if(param.el){
					fn_el = jQuery(param.el);
				}
				if(param.img1 && param.img2){
					fn_img1 = param.img1;
					fn_img2 = param.img2;
				}
				if(param.div){
					fn_div = jQuery("#" + param.div);
					if(fn_div.css("display") != "none"){
						fn_div.css("display", "none");
						fn_el.removeClass(fn_img2).addClass(fn_img1);
					}else{
						fn_div.css("display", "");
						fn_el.removeClass(fn_img1).addClass(fn_img2);
					}
				}
			}
			return false;
		},
		// Fim [Filtro]
		
		// Inicio [Keycode]
		Keycode: function(param){
			var fn_ret;
			if(param){
				if(param.code){
					fn_ret = String.fromCharCode(param.code);
				}
				if(param.char){
					fn_ret = param.char.charCodeAt(0);
				}
				bi.desenvolvedor = true;
				bi.Log({texto: fn_ret});
			}
		},
		// Fim [Keycode]
		
		// Inicio [HtmlDecode]
		HtmlDecode: function(param){
			var fn_ret;
			if(param){
				if(param.string){
					fn_ret = jQuery("<div/>").html(param.string).text();
				}
			}
			return fn_ret;
		},
		// Fim [HtmlDecode]
		
		// Inicio [HtmlEncode]
		HtmlEncode: function(param){
			var fn_ret;
			if(param){
				if(param.string){
					fn_ret = jQuery("<div/>").text(param.string).html();
				}
			}
			return fn_ret;
		},
		// Fim [HtmlEncode]
		
		// Inicio[BiId]
		BiId: function(){
			var fn_ret;
			bi.bi_id += 1;
			fn_ret = "el_" + bi.bi_id;
			while( jQuery("#" + fn_ret).get(0) != undefined ){
				bi.bi_id += 1;
				fn_ret = "el_" + bi.bi_id;
			}
			return fn_ret;
		},
		// Fim[BiId]
		
		// Inicio [LoadImage]
		LoadImage: function(param){
			jQuery(function(){
				var fn_img, fn_pasta;
				fn_pasta = bi.pasta_img;
				if(param){
					if(param.pasta){
						fn_pasta = param.pasta;
					}
					if(param.img){
						fn_img = jQuery("<img src=\""+fn_pasta + param.img+"\" />");
						//console.log(fn_img.get(0));
					}
				}
			});
		},
		// Fim [LoadImage]
		
		// Inicio [LoadHtml]
		LoadHtml: function(param){
			var fn_texto = "Carregando..."
			jQuery(function(){
				if(param){
					if(param.texto){
						fn_texto = param.texto;
					}
				}
				jQuery("#" + bi.load_id + " span").next().html(fn_texto);
			});
		},
		// Fim [LoadHtml]
		
		// Inicio [Form]
		Form: function(param){
			var fn_el, fn_input, fn_select, fn_textarea;
			var fn_tipo = "";
			jQuery(function(){
				if(param){
					if(param.tipo){
						fn_tipo = param.tipo;
					}
					if(param.formulario){
						fn_el = "#" + param.formulario;
						//fn_input = fn_el + " input, ";
						//fn_select = fn_el + " select, ";
						//fn_textarea = fn_el + " textarea";
						if(fn_tipo == ""){
							jQuery(fn_el + " :input").each(function(){ jQuery(this).removeAttr("disabled") });
							jQuery(fn_el + " :input").each(function(){ jQuery(this).removeAttr("readonly") });
						}else{
							jQuery(fn_el + " :input").each(function(){ jQuery(this).attr(fn_tipo, fn_tipo) });
						}
						
						if(param.multi){
							jQuery(fn_el + " select[multiple='multiple']").each(function(){ jQuery(this).removeAttr("disabled") });
							jQuery(fn_el + " select[multiple='multiple']").each(function(){ jQuery(this).find("option:selected").attr("style", "background-color: #ccc;") });
							jQuery(fn_el + " select[multiple='multiple']").each(function(){ jQuery(this).find("option").attr(fn_tipo, fn_tipo) });
						}
					}
				}
			});
		},
		// Fim [Form]
		
		// Inicio [MultiSelectNormal]
		MultiSelectNormal: function(){
			jQuery(function(){
				jQuery("select[multiple='multiple']").each(function(){
					jQuery(this).bind("keypress", function(event){
						bi.ultimo_clique = jQuery(this);
						if(event.which == 13){
							bi.ApertaEnter();
							return false;
						}
					});
				});
				return true;
			});
		},
		// Fim [MultiSelectNormal]
		
		// Inicio [FormMod]
		FormMod: function(param){
			jQuery(function(){
				if(param){
					if(param.formulario && param.botao){
						jQuery("#" + param.formulario + " :input").bind("change", function(){
							jQuery("#" + param.botao).addClass("eva_botao_mod");
							//jQuery("#" + param.formulario + " :input").unbind("change");
							jQuery(this).unbind("change");
						});
					}
				}
			});
		},
		// Fim [FormMod]
		
		// Inicio [Sync]
		Sync: function(param){
			var fn_el, fn_classe, fn_checkbox, fn_checked;
			if(param){
				if(param.id){
					fn_el = jQuery("#" + param.id);
				}
				if(param.el){
					fn_el = jQuery(param.el);
				}
				if(param.checkbox){
					fn_checkbox = jQuery("#" + param.checkbox);
				}
				if(param.classe){
					fn_classe = param.classe;
				}
				
				if(fn_checkbox){
					fn_checked = fn_checkbox.prop("checked");
					if(fn_checked){
						fn_checkbox.prop("checked", false);
					}else{
						fn_checkbox.prop("checked", true);
					}
				}
				
				if(fn_classe){
					if(fn_checked){
						fn_el.removeClass(fn_classe);
					}else{
						fn_el.addClass(fn_classe);
					}
				}	
			}
			return false;
		},
		// Fim [Sync]
		
		// Inicio [Data]
		Data: function(param){
			var fn_date, fn_spt;
			if(param){
				if(param.ddmmyy){
					fn_spt = param.ddmmyy.split("/");
					fn_date = new Date(fn_spt[2],fn_spt[1]-1,fn_spt[0]);
				}
			}
			return fn_date;
		},
		// Fim [Data]
		
		// Inicio [EscapeObj]
		/*EscapeObj: function(param){
			var fn_a;
			if(param){
				if(param.string){
					return String(param.string).replace(/[&<>"]/g, function (fn_a){
						return bi.array_caracteres[fn_a];
					});
				}
			}
		},*/
		// Fim [EscapeObj]

	// Inicio [Uuidv4]
	Uuidv4: function(opts){
		var opt = $.extend({
			mask: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
		}, opts);

		return opt.mask.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	// Fim [Uuidv4]

		// Inicio [alerta]
		Alerta: function(t){
			if(t){
				t = t;
			}else{
				t = "Hello";
			}
			alert(t);
			return this;
		}
		// Fim [alerta]
	}
	
	window.bi= app();
	bi.Config();
	
	/*jQuery(document).ready(function(){bi.LightboxOver();});*/
	
})();
// Fim [biblioteca]