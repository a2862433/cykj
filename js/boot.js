/**
 * 作者：administrator
 * 时间：2016-07-31
 * 描述：
 * 	统一URL管理
 */
var base = null;
var nWaiting;
nWaiting = nWaiting || {
	_plus: null,
	_nw: null,
	open: function(p) {
		var obj = this;
		obj._plus = p;
		if (obj._plus && !obj._nw) {
			//TODO 5+没有提供show动画之后的callback。所以这里暂时延迟400ms来显示动画
			setTimeout(function() {
				obj._nw = obj._plus.nativeUI.showWaiting();
				console.log(obj._nw);
			}, 0);
		}
	},
	close: function() {
		var obj = this;
		console.log(obj._nw);
		setTimeout(function() {
			console.log(obj._nw);
			if (obj._nw) {
				console.log(obj._nw);
				obj._nw.close();
				obj._nw = null;
			}
		}, 2);
	}
}
base = base || {
	_path: 'http://192.168.0.186:8080',
	_project_name: 'cykj',
	//_path: 'http://10.101.0.123:8080/web',
	_userId: '',
	_orgId: '',
	plusReady: function() {
	},
	/**
	 * 作者：administrator
	 * 时间：2016-07-31
	 * 描述：
	 * 	初始化window.plus
	 */
	init: function() {
		var obj = this;
		if (window.plus) {
			obj.plusReady();
		} else {
			document.addEventListener('plusready', obj.plusReady, false);
		}
	}
}
base.init();	//初始化window.plus和日期格式化方法
var boot = null;
boot = boot || {
	_xhr: null,
	url: { // 请求统一管理
		//获取技术悬赏列表
		getInvitInfoList:base._path + '/' + base._project_name + '/v1/m/getInvitInfoList',
		 //获取技术悬赏详情
        getinvitInfoByIdURL: base._path + '/' + base._project_name + '/v1/m/getInvitInfoById',
         //保存技术悬赏
        saveInvitInfoURL: base._path + '/' + base._project_name + "/v1/m/saveInvitInfo",
        //获取创意组团列表
        getGroupInfoURL: base._path + '/' + base._project_name + '/v1/m/getGroupList',
        //获取创意组团详情
        getGroupInfoByIdURL: base._path + '/' + base._project_name + '/v1/m/getGroupInfoById',
        //保存创意组团
        saveGroupInfoURL: base._path + '/' + base._project_name + "/v1/m/saveGroup",
        //获取创意设计列表
        getDesignInfoURL: base._path + '/' + base._project_name + '/v1/m/getDesignList',
        //获取创意设计详情
        getDesignInfoByIdURL: base._path + '/' + base._project_name + '/v1/m/getDesignInfoById',
        //保存创意设计
        saveDesignInfoURL: base._path + '/' + base._project_name + "/v1/m/saveDesign",
		//获取王婆卖瓜推荐人
		getWpmgInfoList:base._path + '/' + base._project_name + '/v1/m/getWpmgInfoList',
		//获取论坛标题
		getForumInfoList:base._path + '/' + base._project_name + '/v1/m/getForumInfoList',
		//获取论坛详细
		getForumInfo:base._path + '/' + base._project_name + '/v1/m/getForumInfo',
		//获取论坛回复
		getForumCommt:base._path + '/' + base._project_name + '/v1/m/getForumCommt',
		//登陆
	    getLoginURL: base._path + '/' + base._project_name + '/v1/m/login',
        getloginUserURL: base._path + '/' + base._project_name + '/v1/m/loginUser',
        //登出
        getloginOutURL: base._path + '/' + base._project_name + '/v1/m/loginOut',
       
        addGroupContractURL: base._path + '/' + base._project_name + "/v1/m/addGroupContract",
        addInvitContractURL: base._path + '/' + base._project_name + "/v1/m/addInvitContract",
        getUserInfoURL: base._path + '/' + base._project_name + '/v1/m/getUserInfo'
	},
	/**
	 * 作者：administrator
	 * 时间：2016-07-27
	 * 描述：
	 * 	实现跨域请求（为了避免方法冲突，封装这个方法）
	 * 	请求者必须自己实现callback函数
	 * 	即在自己的页面实现，如下：
	 * 	function callback(_xhr){
	 * 		// 根据自己的业务来编写
	 *	}
	 * 参数：
	 * 	url：请求地址（格式如：'http://192.168.0.107:8081/siims/app/test/toLogin.jspx?name=administrator&pass=123456'）
	 */
	xhrCreate : function(url, callback) {
		var obj = this;
		if (obj._xhr) {
			console.log("已发送请求");
			mui.plusReady(function() {
				plus.nativeUI.toast("已发送请求！");
			});
			return;
		}
		console.log("创建请求：");
		mui.plusReady(function() {
			obj._xhr = new plus.net.XMLHttpRequest();
		});
		console.log(obj._xhr);
		obj._xhr.onreadystatechange = function() {
			switch (obj._xhr.readyState) {
				case 0:
					console.log("xhr请求已初始化");
					break;
				case 1:
					console.log("xhr请求已打开");
					break;
				case 2:
					console.log("xhr请求已发送");
					break;
				case 3:
					console.log("xhr请求已响应");
					break;
				case 4:
					console.log("xhr请求已完成");
					// obj._xhr 在回调函数处理完成之后请销毁掉，如：obj._xhr = null;
					callback(obj._xhr);
					obj._xhr = null;
					break;
				default:
					break;
			}
		}
		obj._xhr.open("POST", url);
		obj._xhr.send();
	},
	xgetImgPath : function(imgPath){
		imgPath = base._path + "/" + base._project_name + "/" + imgPath;
		return imgPath;
	},
	xhrAbort: function() {
		var obj = this;
		if (obj._xhr) {
			console.log("取消请求");
			if (obj._xhr.readyState != 4) {
				obj._xhr.abort();
			}
			obj._xhr = null;
		} else {
			console.log("未发送请求");
		}
	},
	/**
	 * 作者：administrator
	 * 时间：2016-07-31
	 * 描述：
	 * 	这个方法实现获取html之间传递的参数
	 * 使用如：
	 *  请求页面：window.location.href="xxx.html?name=" + encodeURIComponent("name");
	 * 		     或window.location.href="xxx.html?name=" + "name";
	 * 	接收页面：var name = boot.getParameter("name");
	 */
	getParameter: function(val) {
		var uri = window.location.search;
		var re = new RegExp("" + val + "=([^&?]*)", "ig");
		var str = ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
		return decodeURIComponent(str);
	},
	/*
	 * 去字符串中所有空格
	 */
	trim: function(str){
		
		return str.replace(/\s+/g, "");
	},
	/*
	 * 失去焦点时去空格
	 */
	textblur:function (jie){
		jie.value= jie.value.replace(/\s+/g, "");
	},
	/*
	 * 邮箱检查
	 */
	CheckMail:function (mail) {
				var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			 	if (filter.test(mail)) return true;
			 	else {
			 		return false;
			 	}
	},
	/*
	 * 验证电话号码
	 */
	CheckTel:function (tel) {
				var filter  = /^((1[358][0-9]{9})|((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})))$/;
			 	if (filter.test(tel)) return true;
			 	else {
			 		return false;
			 	}
	}
}
function hasClass(elements, cName) {
	return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断 
};

function addClass(elements, cName) {
	if (!hasClass(elements, cName)) {
		elements.className += " " + cName;
	}
}

function removeClass(elements, cName) {
	if (hasClass(elements, cName)) {
		elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换 
	}
}
	