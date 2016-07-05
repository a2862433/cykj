Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

//mui.init();

var oldRefreshTime="";//上次下拉时间
var oldUpTime="";//上次上拉时间

function initLoad(xhr){
	if (xhr.status == 200) {
		var ja = eval("("+xhr.responseText+")");
		console.log("请求成功：" + xhr.responseText);
		oldRefreshTime=new Date().format('yyyy-MM-dd,hh:ss:mm');//获取当前刷新时间
		for(var i = 0;i < ja[0].length;i++){
			if(i==(ja[0].length-1)){
				oldUpTime=ja[0][i].uploadDate;//上拉
				oldUpTime=new Date(oldUpTime).format('yyyy-MM-dd,hh:ss:mm');
			}
			var pointName = ja[0][i].pointName;//区域
			var projectName = ja[0][i].projectName;//项目名称
			var cycleName = ja[0][i].cycleName;//周期名称
			var imgPath=ja[0][i].imgPath;//图片路径
			var time = ja[0][i].uploadDate;//更新时间   
			var uploadRow=ja[0][i].uploadRow;//已上传
			var noPass=ja[0][i].noPass;//未通过
			
			var table = document.body.querySelector('.mui-table-view');
			
			var li = document.createElement("li");
			li.className="mui-table-view-cell mui-media";
			li.style="padding-right:2px;";
			console.log(base._path +imgPath);
			var html = "";
			html="<a >"
	          +"<img class='mui-media-object mui-pull-left' style='max-width:82px;height:82px' src='"+base._path +imgPath+"'> "
	          +"<div class='mui-media-body'>"
	          +pointName
	          +"<p>项目："+projectName+"  </p>"
	          +"<p style='color: #F0AD4E;'>周期："+cycleName+"</p>"
	          +"<p>更新时间："+time+"</p>"
	          +"</div>"
	          +"</a>"
	          +"<p style='color: #007AFF;margin-top: 2px;'>已上传："+uploadRow+"张；未通过："+noPass+"张</p>"; 
	        
			li.innerHTML = html;
			table.appendChild(li);
		}
	} else {
		var content = document.querySelector("body");
		content.innerHTML="<div style='text-align: center;margin-top: 30px;'><a>网络未连接，请从新加载</a></div><div style='text-align: center;margin-top: 30px;'><button onclick='loadData();'>重新加载</button></div>";
	}
	plus.nativeUI.closeWaiting();
}
      	
mui.plusReady(function() {
	plus.nativeUI.showWaiting( "数据等待中..." );
	var userId = plus.storage.getItem("userId");
	var _url=boot.url.getshootList+"?userId="+userId;
	boot.xhrCreate(_url, initLoad);
});
function loadData(){
	plus.nativeUI.showWaiting( "数据等待中..." );
    var userId = plus.storage.getItem("userId");
	var _url=boot.url.getshootList+"?userId="+userId;
	boot.xhrCreate(_url, initLoad);
}

//初始化
mui.init({
	swipeBack:false,
//  optimize: false,
    pullRefresh: {
    	container: '.mui-card',
    	down: {//下拉
//  		contentover: '释放刷新',
//  		contentrefresh: '正在刷新...',
    		callback: pulldownRefresh
		},
		up: {//上拉
//          contentover: '释放刷新',
            contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function downJson(xhr){
	if (xhr.status == 200) {
		var table = document.body.querySelector('.mui-table-view');
		var ja = eval("("+xhr.responseText+")");
		console.log("请求成功：" + xhr.responseText);
		for(var i = 0;i < ja[0].length;i++){
			if(i==ja[0].length-1)oldDownTime=ja[0][i].uploadDate;
			
			var pointName = ja[0][i].pointName;//区域
			var projectName = ja[0][i].projectName;//项目名称
			var cycleName = ja[0][i].cycleName;//周期名称
			var imgPath=ja[0][i].imgPath;//图片路径
			var time = ja[0][i].uploadDate;//更新时间   
			var uploadRow=ja[0][i].uploadRow;//已上传
			var noPass=ja[0][i].noPass;//未通过
			
			var li = document.createElement("li");
			li.className = 'mui-table-view-cell mui-media';
			li.style='padding-right:2px;';
	
			console.log(base._path +imgPath);
			
			var html = "";
			html="<a >"
	          +"<img class='mui-media-object mui-pull-left' style='max-width:82px;height:82px' src='"+base._path +imgPath+"'> "
	          +"<div class='mui-media-body'>"
	          +pointName
	          +"<p>项目："+projectName+"  </p>"
	          +"<p style='color: #F0AD4E;'>周期："+cycleName+"</p>"
	          +"<p>更新时间："+time+"</p>"
	          +"</div>"
	          +"</a>"
	          +"<p style='color: #007AFF;margin-top: 2px;'>已上传："+uploadRow+"张；未通过："+noPass+"张</p>"; 
			li.innerHTML = html;
			//下拉刷新，新纪录插到最前面；
			table.insertBefore(li, table.firstChild);
		}
	}
}

/**
* 下拉刷新数据
*/
function pulldownRefresh() {
	var self = this;
	setTimeout(function() {
		var userId = plus.storage.getItem("userId");
		var _url=boot.url.getshootList+"?userId="+userId+"&oldRefreshTime="+oldRefreshTime+"&type=1";
		boot.xhrCreate(_url, downJson);
		self.endPulldownToRefresh(); //refresh completed
		oldRefreshTime=new Date().format('yyyy-MM-dd,hh:ss:mm');//获取当前刷新时间
	}, 1000);
}

/**
* 上拉刷新数据
*/
function pullupRefresh(){
	var self = this;
	setTimeout(function(){
		var userId = plus.storage.getItem("userId");
		var _url=boot.url.getshootList+"?userId="+userId+"&oldUpTime="+oldUpTime+"&type=2";
		boot.xhrCreate(_url, backJson);
		function backJson(xhr){
			var table = document.body.querySelector('.mui-table-view');
			var ja = eval("("+xhr.responseText+")");
			console.log("请求成功：" + xhr.responseText);
			for(var i = 0;i < ja[0].length;i++){
				if(i==(ja[0].length-1)){
				oldUpTime=ja[0][i].uploadDate;//上拉
				oldUpTime=new Date(oldUpTime).format('yyyy-MM-dd,hh:ss:mm');
			}
				
				var pointName = ja[0][i].pointName;//区域
				var projectName = ja[0][i].projectName;//项目名称
				var cycleName = ja[0][i].cycleName;//周期名称
				var imgPath=ja[0][i].imgPath;//图片路径
				var time = ja[0][i].uploadDate;//更新时间   
				var uploadRow=ja[0][i].uploadRow;//已上传
				var noPass=ja[0][i].noPass;//未通过
				
				var li = document.createElement("li");
				li.className = 'mui-table-view-cell mui-media';
				li.style='padding-right:2px;';
				
				console.log(base._path +imgPath);
				var html = "";
				html="<a >"
		          +"<img class='mui-media-object mui-pull-left' style='max-width:82px;height:82px' src='"+base._path +imgPath+"'> "
		          +"<div class='mui-media-body'>"
		          +pointName
		          +"<p>项目："+projectName+"  </p>"
		          +"<p style='color: #F0AD4E;'>周期："+cycleName+"</p>"
		          +"<p>更新时间："+time+"</p>"
		          +"</div>"
		          +"</a>"
		          +"<p style='color: #007AFF;margin-top: 2px;'>已上传："+uploadRow+"张；未通过："+noPass+"张</p>"; 
				li.innerHTML = html;
				table.appendChild(li);
			}
		}
		self.endPulldownToRefresh(); //refresh completed
	},1000);
}
