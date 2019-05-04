// menu菜单导航
$(function(){
	var n=0;
	var m=$(".dh_bg ul li.cur").index();
	var w=$(".dh_bg ul li").width();

	var dh_LI=$(".dh_bg ul li").length ; //9
	var R;
	var h_DL;
	// $(".dh_bg_cur").css("left",(m*w))
	$(".dh_bg ul li").mouseenter(
		function(){
			n=$(this).index();
			$(this).addClass("cur")
			$(this).siblings().removeClass("cur")
			//改動
			 $(".dh_bg .two_nav").hide().eq(n).fadeIn()
			//判斷第一個是否選中
			// if (n>0) {
			// 	$(".dh_bg .two_nav").hide().eq(n-1).fadeIn()
			// }else{
			// 	// $(".dh_bg .two_nav").hide().eq(n).fadeIn()
			// 	$(".dh_bg .two_nav").hide()
			// }
			R=(dh_LI-(n+1))*97.5  //86
			// console.log(R);
			// 688 770
			$(".dh_bg .two_nav").css("right",R)

			h_DL=$(".dh_bg .two_nav").eq(n-1).height();
			$(".dh_bg .two_nav").eq(n-1).find("dl").css("height",h_DL);
		}
	)
	$(".dh_bg").mouseleave(
		function(){
			// $(".dh_bg ul li").eq(m).addClass("cur")
			$(".dh_bg ul li").eq(m).siblings().removeClass("cur")
			$(".dh_bg .two_nav").fadeOut()
		}
	)
 	 //内容页面高度
	var height =$(window).height() - $("header").height();
	$('#content').find("iframe").css('height',height+'px');

	//获取顶级栏目	
	$(".dh_bg ul li a").click(function(){
		var liclass= $(this).attr('class')
		// var textclass =$(this).find('span').text();
		viewadd(liclass,$(this));
	})	
	
	$(".numright").click(function(){
		 var classname = $(this).parents().parents().attr('class');
		 // var textname = $(this).offsetParent().find('dt').text(); //可获取父节点
		 // console.log(textname);
		 // console.log();
	 	viewadd(classname,$(this));
	})	
	// 添加颜色
	$(".in").prev().toggleClass('silecolor');
	$("body").delegate(".panel-heading","click",function(){
		$('.in').prev().removeClass('silecolor');
		// $(this).find("h4").css('color','#fff');
		$(this).toggleClass('silecolor');
	})
	$("body").delegate(".list-group-item","click",function(){
		 	$('.level').removeClass('level');
			// $(this).find("h4").css('color','#fff');
			$(this).toggleClass('level');
			$("a",this)[0].click();
	
	})
	//classname 类名称，textclass 文本名称
	function viewadd(classname,t){
	var textclass = $(t).offsetParent().find('dt').text(); //当前父类
	 // console.log(textclass)
	var clicname = $(t).text(); //当前点击
	var ibute = $(".two_nav ."+classname);	
	var thisdl= ibute.find("dl").length;
	 if (thisdl > 0) {
	 	var html = '';
	 	var dd;
	 	var dda;
	 	var dt;
	 	// var dtleng;
	 	// var jj = 0;
	 	ibute.find("dl").each(function(i){
	 		//获取dt长度 可能存在多个
	 		// dtleng= ibute.find("dl").eq(i).find('dt').eq(i).length; //一级分类长度
	 		// if (deleng > 0 || jj <= dtleng) {
 				// dt= ibute.find("dl").eq(i).find('dt').eq(jj).text(); //一级分类名称
 				// jj++;
	 		// }else{
	 			dt= ibute.find("dl").eq(i).find('dt').text(); //一级分类名称
	 		// }
	 	 	if (dt == textclass) {
	 	 		var show = 'in';
	 	 		var silecolor = 'silecolor';
	 	 	}
	 		html += '<li class="panel panel-default leftMenu" >';
			html +='<div class="panel-heading '+silecolor+'" data-toggle="collapse" data-parent="#accordion"  data-target="#'+classname+i+'" role="tab">'
			html +='<h4 class="sile_title" > '+dt+'  </h4>  </div>';                   
			html +='<div id="'+classname+i+'" class="panel-collapse collapse '+show+'" role="tabpanel">';                          
			html +='<ul class="list-group">';    
		    // 获取dl的值 可能有多个 循环
		   		 ibute.find("dl").eq(i).find('dd').each(function(ii){
		    	 dd= ibute.find("dl").eq(i).find('dd').eq(ii).text(); //二级分类名称
		    	 if (dd == clicname) var level = 'level';
		    	 dda= ibute.find("dl").eq(i).find('dd').eq(ii).find('a').attr('href'); //获取url
		    	html +='<li class="list-group-item '+level+'"><a href="'+dda+'" class="menu-item-left" target="right">'+dd+'</a></li>';       
		    })
			html +=' </ul></div></li>';
	 	})
	 	$(".accordion").html(html);	
	 }
	}

})



