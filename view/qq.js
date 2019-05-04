(function($){
 /*
 * 坐标类
 * @param {Object} x
 * @param {Object} y
 * @memberOf {TypeName} 
 */
 function Point(x,y){
 this.top=x;
 this.left=y;
 }
  
 /**
 * 修正版本，原图右下角的小图不显示，是活动格子
 * 添加 “打乱”，“换图按钮”
 * 
 * @param {Object} options
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
 $.fn.tablePic=function(options){
 var DEFAULT={
  target:'',
  row:2,
  col:2,
  isBorder:true,
  borderColor:'#f88',
  mode:'strict',//是否严格判断格式相邻移到，如果不是strict，那么就是不管怎样都是直接和空白格式内容交换
  freeColor:'#92cf28' //空白格子的背景颜色
 }
  
 var options=$.extend(DEFAULT,options);
 //系统变量
 var SYSTEM={
  width:0,height:0,
  //小格子的大小
  sonWidth:0,sonHeight:0,
  src:null,
  current:'',correct:0,//正确个数
  hits:0//步数
 }
 var parent=null;//这个是待分割的图片
 var target=null;//这个是格子存放的容器，一般是一个div，也应该是！！！！！别搞独特=.=
  
 //这个是左，上 的margin
 var margin=new Array();
  
 this.each(function(){
  parent=$(this);
  SYSTEM.src=parent.attr("src");
  SYSTEM.width=parseInt(parent.css("width"));
  SYSTEM.height=parseInt(parent.css("height"));
  SYSTEM.sonWidth=Math.round(SYSTEM.width/options.col);
  SYSTEM.sonHeight=Math.round(SYSTEM.height/options.row);
   
  init();
  initMargin();
 });
  
 //初始化目标
 function init(){
  target=$("#"+options.target);
  initTarget();
  //最后我们要添加一个空白的divprepend
  target.append($("<div/>").attr("id","control").css("position","absolute").css("top",SYSTEM.height+8+((options.isBorder)?(options.row):0)+'px').css("right","0px").css("width",SYSTEM.Width/3).css("height",SYSTEM.sonHeight)
  .append($("<span/>").attr("id","correctInfo"))
  .append($("<button/>").bind("click",function(){initMargin();}).append("复原"))
  .append($("<button/>").bind("click",function(){mixMargin();}).append("打乱"))
  .append($("<button/>").attr("id","isBorder").bind("click",function(){border();}).append(((options.isBorder)?"去除":"添加")+"边框"))
  .append(" 行:")
  .append($("<select/>").attr("id","rowSelect"))
  .append("列:")
  .append($("<select/>").attr("id","colSelect"))
  );
  initSelect();
 }
  
 function initTarget(){
  SYSTEM.sonWidth=Math.floor(SYSTEM.width/options.col);
  SYSTEM.sonHeight=Math.floor(SYSTEM.height/options.row);
  target.css("width",SYSTEM.width+'px').css("height",SYSTEM.height+'px');
  //是否显示边框
  if(options.isBorder){
  target.css("width",SYSTEM.width+options.col+'px').css("height",SYSTEM.height+options.row+'px');
  }
  target.css("position","relative");
 }
 /**
  * 设置两个 select的属性，并添加事件
  */
 function initSelect(){
  for(var i=3;i<=10;i++){
  $("#rowSelect").append($("<option/>").attr("vaule",i).append(i));
  $("#colSelect").append($("<option/>").attr("vaule",i).append(i));
  }
  target.find("select").each(function(){
  $(this).change(function(){
   options.row=parseInt($("#rowSelect").val());
   options.col=parseInt($("#colSelect").val());
   initTarget();
   initMargin();
  });
  });
 }
  
 /**
  * 边框的设置
  */
 function border(){
  options.isBorder=!options.isBorder;
  //initTarget();
  //initMargin();
  target.children(":not(#control)").children().each(function(){
  $(this).css("border-top",(options.isBorder?"1px solid "+options.borderColor:"none")).css("border-left",(options.isBorder?"1px solid "+options.borderColor:"none"));
  });
  $("#isBorder").html(((options.isBorder)?"去除":"添加")+"边框");
 }
  
 function initImage(){
  //清空 target
  target.children(":not(#control)").remove();
  $("#rowSelect").val(options.row);
  $("#colSelect").val(options.col);
  //生成格子，基本形式：
  //<div class="miniDiv">
    // <div><img src="?????"/></div>
   // </div>
  //
  //为了兼容神奇的ie6，我们添加一个div在外围
  var $temp=$("<div/>");
  target.append($temp);
  for(var i=0;i<options.row*options.col;i++){
   if(margin[i].left==options.col-1&&margin[i].top==options.row-1){
   $temp.append($("<div/>").attr("id","gz"+(i+1)).css("border-top",(options.isBorder?"1px solid "+options.borderColor:"none")).css("border-left",(options.isBorder?"1px solid "+options.borderColor:"none")).css("width",SYSTEM.sonWidth).css("height",SYSTEM.sonHeight).css("overflow","hidden").css("float","left")
    .append($("<div/>").css("width","100%").css("height","100%").css("background-color",options.freeColor)));
   SYSTEM.current='gz'+(i+1);
   }
   else{
   $temp.append($("<div/>").attr("id","gz"+(i+1)).css("border-top",(options.isBorder?"1px solid "+options.borderColor:"none")).css("border-left",(options.isBorder?"1px solid "+options.borderColor:"none")).css("width",SYSTEM.sonWidth).css("height",SYSTEM.sonHeight).css("overflow","hidden").css("float","left").append(
    $("<div/>").css("margin-left",(margin[i].left*SYSTEM.sonWidth)*-1+"px").css("margin-top",(margin[i].top*SYSTEM.sonHeight)*-1+"px")
    .append($("<img/>").attr("src",SYSTEM.src).css("width",SYSTEM.width+'px').css("height",SYSTEM.height+'px').css("display","block"))
   ));
   }
  }
  
  initHandle();
  checkRight();
 }
  
 //初始化 margin 这个属性
 function initMargin(){
  var temp=0;
  for(var i=0;i<options.row;i++){
   for(var j=0;j<options.col;j++)
   margin[temp++]=new Point(i,j);
  }
  initImage();
 }
  
 //打乱图片次序
 //使用 margin.splice 不能正确返回被删除的数组元素，这里使用一个 中间 数组进行随机排序
 function mixMargin(){
  var temp1=new Array();
  var temp2=new Array();
  for(var i=0;i<options.col*options.row;i++){
  temp2[i]=i;
  }
  //使用 js 的splice 函数得到随机排序的数组
  for(var i=0;i<options.col*options.row;i++){
  temp1[i]=margin[temp2.splice(Math.floor(Math.random()*temp2.length),1)];
  }
  margin=temp1;
  initImage();
 }
  
 /**
  * 添加事件
  * @memberOf {TypeName} 
  * @return {TypeName} 
  */
 function initHandle(){
  for(var i=0;i<=options.col*options.row;i++){
  $("#gz"+i).bind("click",function(){
   var newId=$(this).attr("id");
   if(newId==SYSTEM.current)
   return false;
   //如果设定了mode为strict，就判断是不是与空白格子相邻，只有相邻了才可以发生效果
   if(options.mode=='strict'){
   if(SYSTEM.current=='gz0'&&newId!=('gz'+options.col))
    return false;
   var ii=parseInt(newId.substring(2));
   var jj=parseInt(SYSTEM.current.substring(2));
   if(!(Math.abs(ii-jj)==1||Math.abs(ii-jj)==options.col))
    return false;
   }
   var temp=$(this).html();
   $(this).html($("#"+SYSTEM.current).html());
   $("#"+SYSTEM.current).html(temp);
   SYSTEM.current=$(this).attr("id");
   checkRight();
  });
  }
 }
  
 /*
  * 检查当前正确的图片数
  */
 function checkRight(){
  SYSTEM.correct=0;
  for(var i=0;i<options.col*options.row-1;i++){
  var $temp=$("#gz"+(i+1)).children(":first");
  if($temp.html()!=''&&parseInt($temp.css("margin-left"))==(-1*SYSTEM.sonWidth*(i%options.col))&&parseInt($temp.css("margin-top"))==(-1*SYSTEM.sonHeight*Math.floor(i/options.col))){
   SYSTEM.correct++;
  }
  }
  showCorrect();
 }
  
 /*
  * 显示正确的图片信息
  */
 function showCorrect(){
  $("#correctInfo").html("正确图片:"+SYSTEM.correct+"/"+(options.col*options.row-1)+"  ");
 }
 }
})(jQuery);