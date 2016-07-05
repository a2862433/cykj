
var files=[];
// 上传文件
function upload(){
	if(files.length<=0){
		alert("没有添加上传文件！");
		return;
	}
	outSet("开始上传：")
	var wt=plus.nativeUI.showWaiting();
	var task=plus.uploader.createUpload(server,
		{method:"POST"},
		function(t,status){ //上传完成
			if(status==200){
				outLine("上传成功："+t.responseText);
				plus.storage.setItem("uploader",t.responseText);
				var w=plus.webview.create("uploader_ret.html","uploader_ret.html",{scrollIndicator:'none',scalable:false});
				w.addEventListener("loaded",function(){
					wt.close();
					w.show("slide-in-right",300);
				},false);
			}else{
				outLine("上传失败："+status);
				wt.close();
			}
		}
	);
	task.addData("client","HelloH5+");
	task.addData("uid",getUid());
	for(var i=0;i<files.length;i++){
		var f=files[i];
		task.addFile(f.path,{key:f.name});
	}
	task.start();
}
// 拍照添加文件
function appendByCamera(){
	mui('.mui-popover').popover('toggle');
	plus.camera.getCamera().captureImage(function(p){
		plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
			displayFile( entry );
		}, function ( e ) {
		} );
		});	
}
// 从相册添加文件
function appendByGallery(){
	mui('.mui-popover').popover('toggle');
	plus.gallery.pick(function(p){
		displayFile(p);
    });
}
// 添加文件

function displayFile( entry ) {
	var url;
	if((typeof entry)=='object'){
		url=entry.toLocalURL();
		
	}else{
		url=entry;
	}
	var uploader = plus.webview.create("uploadIcon.html", "uploadIcon.html",null,{
		"path":url
	});
	uploader.show( "slide-in-right", 300 );
}
// 产生一个随机数
function getUid(){
	return Math.floor(Math.random()*100000000+10000000).toString();
}
