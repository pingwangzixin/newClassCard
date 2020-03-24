app.controller('classDemeanorCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
    $scope.variablePacket = {
    	albumArr : [//相册模拟数据
//			{name : '相册1',src:'teacherShow.jpg'},
//			{name : '相册2',src:'ad_1.jpg'},
//			{name : '相册3',src:'teacherShow.jpg'},
//			{name : '相册4',src:'ad_1.jpg'},
//			{name : '相册5',src:'teacherShow.jpg'},
//			{name : '相册6',src:'ad_1.jpg'}
		],
		userType : $stateParams.range,  //判断角色：class为班主任，school为校领导
		userRights : $stateParams.nav,	//角色二级导航：class为班主任，school为校领导
		urlUser : ($stateParams.range == 'school' && $stateParams.nav == 'school') ? 'school' : 'class',   //编辑页面及详情页传递角色
		urlPower : $stateParams.range,		//管理员进入班级
    };
    
    var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
    if($scope.variablePacket.userType=="class"){
    	
    	relationId = sessionStorage.getItem('classId');
    	
	}else if($scope.variablePacket.userType=="school"){
		
		if($scope.variablePacket.userRights=="class"){
			relationId = $scope.userObj.classId;
    	}else{
    		relationId = userSubObj.oid;
    	}
	}
	$.ajax({
			type:"get",
			url:jeucIp+"ea/eaSpacePhoto/photoList?relationId="+relationId,
			async:false,
			success:function(data){
				if(data.ret == 200){
					var photos = data.data.photos;
					var stuYearList = data.data.stuYear;
					if(photos!=undefined){
						for(var i=0;i<stuYearList.length;i++){
							var stuYearGroup = {};
							var stuYear = stuYearList[i];
							stuYearGroup.stuYear = stuYear+'-'+(parseInt(stuYear)+1)
							var list = []
							angular.forEach(photos,function(photo,index){
								if(photo.year == stuYear){
									var album = {};
									album.id = photo.id;
									album.name = photo.photoName;
									album.src = photo.photoCover;
									album.count = photo.count;
									album.createDate = photo.createDate.substring(0,10);
									list.push(album);
								}
							})
							stuYearGroup.list = list;
							$scope.variablePacket.albumArr.push(stuYearGroup);
						}
					}
				}
			}
		});
	
	//删除相册事件
	$scope.deleteAlbum = function (index,photoId){
		$scope.promptShow('确认删除吗？',false);
		$scope.delOk = function (){
			console.log($scope.wranShow)
			$scope.variablePacket.albumArr.splice(index,1);
			var params = "photoId="+photoId;
			$http.get(jeucIp+"ea/eaSpacePhoto/deletePhoto?"+params).success(function (data){
			if(data.ret==200){
				$scope.variablePacket.prompt = false;
				$scope.wranShow('删除成功',true);
				window.location.reload();//刷新页面
			}});
		};
	};
	
}]);