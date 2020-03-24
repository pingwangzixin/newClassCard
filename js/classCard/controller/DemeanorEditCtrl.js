app.controller('DemeanorEditCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
    $scope.variablePacket = {
    	photoBox : false,		//查看大图容器
		viewPhotoIndex : 0,		//大图下标
		moveWidth : 650,		//移动宽度
		moveLen : 0	,			//移动次数
		leftBtn : false,			//大图左按钮
		rightBtn : false,			//大图右按钮
		userRights : $stateParams.state,	//角色二级导航：class为班主任，school为校领导(导航栏标题)
		newEnclosureId:[],
		enclosureId:[],
		state:$stateParams.type, //  1：是修改   其他是创建
		ProvingOff:false,//验证开关
		ProvingTaskname:false,//文件名称验证
		ProvingDate:false,//描述验证
		folderId:$stateParams.id, //文件夹id
    };
	console.log($scope.variablePacket.userRights)
	var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
	//照片模拟数据
	$scope.photoArr = [
//		{name:'11111',src:'ad_1.jpg'},
//		{name:'22222',src:'cs.jp'},
//		{name:'33333',src:'newsImg.jpg'},
//		{name:'44444',src:'zyx_starstudent_head.jpg'},
//		{name:'55555',src:'zy_main_after.jpg'},
//		{name:'66666',src:'teacherShow.jpg'},
//		{name:'77777',src:'zyx-file.png'},
//		{name:'88888',src:'zyx_xiala.png'},
//		{name:'99999',src:'zyx_starstudent1.png'},
//		{name:'10',src:'zyx_starstudent1.png'},
//		{name:'11111',src:'ad_1.jpg'},
//		{name:'22222',src:'cs.jpg'},
//		{name:'33333',src:'newsImg.jpg'},
	];
	if($scope.variablePacket.state == 1){
		 $.ajax({
			type:"get",
			url:jeucIp+"ea/eaSpacePhoto/photoDetails?photoId="+$scope.variablePacket.folderId,
			async:false,
			success:function(jdata){
				if(jdata.ret == 200){
                    $scope.photoName = jdata.data.photoName;
                    $scope.photoDesc = jdata.data.photoDesc;
					angular.forEach(jdata.data.photos,function(e,i){
						$scope.photoArr.push({"id":e.imageId,"src":e.filePath})
	                })
					
				}
			}
		});
	}
	
	//删除照片事件
	$scope.deletePhoto = function (index,imageId){
		$scope.promptShow('确认删除吗？',false);
		$scope.delOk = function (){
			$scope.photoArr.splice(index,1);
			var params ='imageId='+imageId;
			$http.get(jeucIp+"ea/eaSpaceImage/deleteImageById?"+params)
			.success(function (data) {
				$scope.variablePacket.prompt = false;
				$scope.wranShow('删除成功',true);
		    });
			
		};
	};
	
	//照片点击大图
	$scope.photoEnlarge = function (i){
		$scope.variablePacket.viewPhotoIndex = i;
		$scope.variablePacket.photoBox = true;
		if($scope.photoArr.length > 1){
			if(i>0 && i<$scope.photoArr.length - 2){
				$scope.variablePacket.leftBtn = true;
				$scope.variablePacket.rightBtn = true;
			}else if(i <= 0){
				$scope.variablePacket.leftBtn = false;
				$scope.variablePacket.rightBtn = true;
			}else if(i >= $scope.photoArr.length - 1){
				$scope.variablePacket.leftBtn = true;
				$scope.variablePacket.rightBtn = false;
			}
		}
		if(angular.element('.zy_pic_big_box ul')){
			$timeout(function (){
				angular.element('.zy_pic_big_box ul').css({left : -$scope.variablePacket.moveWidth * i});
			});
		}
	};
	
	$scope.cancel = function(){
    	history.back();
    }
	
	$scope.filePhoto = function(me){
		var imgFile = document.getElementById('FileInput').files[0];
		var fr = new FileReader();
		fr.readAsDataURL(imgFile);
		var file = me.files[0];
	    var fileName = file.name;
		var photo = {};
	    photo.name = fileName;
	    var index = null;
		fr.onload = function(){
		   photo.src= this.result;
           $scope.$apply(function (){
	     		index = $scope.photoArr.push(photo);
	     		index -= 1;
	     		
	       });
        }
		var fd = new FormData();
	    fd.append('file', file);
        fd.append("imageName",fileName);
        fd.append("createBy",sessionStorage.getItem('userId'));
		$http({
    		url:jeucIp + "ea/eaSpaceImage/uploadImage",
    		method:'POST',
    		data:fd,
    		headers: {'Content-Type':undefined},
            transformRequest: angular.identity 
    	})
    	.success(function(res){
    		if($scope.variablePacket.state==1){
    			$scope.variablePacket.enclosureId.push(res.data.imageId);
    		}else{
    			$scope.variablePacket.newEnclosureId.push(res.data.imageId);
    		}
    		$scope.photoArr[index].imageId = res.data.imageId;
    		$scope.photoArr[index].src = res.data.imagePath;
    	})
    	.error(function(e) {
			error(e)
		})
	}
	
	/**
	 * 创建相册或者修改相册
	 */
	$scope.save = function(ueditor){
		var params = {};
		var parameters = "";
		if($scope.variablePacket.userRights == "class"){
			parameters={'range':'class','nav':'class','type':'class'};
			params.relationId = sessionStorage.getItem("classId");
		}else if($scope.variablePacket.userRights == "school"){
			parameters={'range':'school','nav':'school','type':'school'};
			params.relationId = userSubObj.oid;
		}
		params.photoName= $scope.photoName;
		params.photoDesc = $scope.photoDesc;
		if (params.photoName!=undefined) {
			if($scope.variablePacket.state==1){
				params.id= $scope.variablePacket.folderId;
				params.updateBy = sessionStorage.getItem('userId');
				params.imageIds = $scope.variablePacket.enclosureId.join(",");
				$http.post(jeucIp + "ea/eaSpacePhoto/updateSpacePhoto",params
			    ).success(function (data) {
			    	$state.go('secondNav.classCardWrap.classCardSecondNav.classDemeanor',parameters);
			    });
			}else{//创建相册
				params.imageIds= $scope.variablePacket.newEnclosureId.join(",");
				params.createBy = sessionStorage.getItem('userId');
				$http.post(jeucIp + "ea/eaSpacePhoto/createSpacePhoto",params
			    ).success(function (data) {
			    	$state.go('secondNav.classCardWrap.classCardSecondNav.classDemeanor',parameters);
			    });
			}
		}else{
		    if(!$scope.variablePacket.ProvingTaskcont&& !$scope.variablePacket.ProvingOff){
				$scope.variablePacket.ProvingTaskcont = true;
			}
			if(!$scope.variablePacket.ProvingDate && !$scope.variablePacket.ProvingOff){
				$scope.variablePacket.ProvingDate = true;
			}
			if(!$scope.variablePacket.ProvingTaskname && !$scope.variablePacket.ProvingOff){
				$scope.variablePacket.ProvingTaskname = true;
			}
		}
	}
	
}]);
//照片
app.directive('viewPhoto',function (){
	return {
		restrict:'EA',
		link : function (scope,element,attrs){
			if(scope.$last){
				scope.variablePacket.moveLen = element.parents('ul').children().length;
				var lenW = scope.variablePacket.moveLen * element.width();
//				scope.variablePacket.moveLen = parseInt(lenW / scope.variablePacket.moveWidth);
				element.parents('ul').css({width : lenW});
				//右点击
				element.parent().parent().next().on('click',function (){
					scope.variablePacket.viewPhotoIndex ++;
					if(scope.variablePacket.viewPhotoIndex >= scope.variablePacket.moveLen - 1){
						scope.variablePacket.viewPhotoIndex = scope.variablePacket.moveLen - 1;
						scope.$apply(function (){
							scope.variablePacket.rightBtn = false;
						});
					}else{
						scope.$apply(function (){
							scope.variablePacket.leftBtn = true;
						});
					}
					element.parent().stop().animate({left : -scope.variablePacket.moveWidth*scope.variablePacket.viewPhotoIndex},400);
				});
				//左点击
				console.log(element.parent().parent().prev())
				element.parent().parent().prev().on('click',function (){
					console.log(scope.variablePacket.viewPhotoIndex)
					scope.variablePacket.viewPhotoIndex --;
					if(scope.variablePacket.viewPhotoIndex <= 0){
						scope.variablePacket.viewPhotoIndex = 0;
						scope.$apply(function (){
							scope.variablePacket.leftBtn = false;
						});
					}else{
						scope.$apply(function (){
							scope.variablePacket.rightBtn = true;
						});
					}
					element.parent().stop().animate({left : -scope.variablePacket.moveWidth*scope.variablePacket.viewPhotoIndex},400);
				});
			}
		}
	};
});