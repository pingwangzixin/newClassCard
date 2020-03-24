app.controller('classAtmosphereCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$http', '$location', '$interval','$rootScope', function($scope, $state, $stateParams, $timeout, $http, $location, $interval,$rootScope) {
	//变量包
	$scope.variablePacket = {
		range:$location.$$search.range,//学校还是班主任进入的角色
		nav:$location.$$search.nav,//导航显示的角色
		showState:true,  //展示模块状态
		editState:false, //编辑模块状态
        imgError:false,//上传图片提示
        textError:false, //文本提示
        imagePath:"" ,     //上传图片路径
        text:"",          //文本内容
        content:"",
        imageSrc:"",
        enclosureId:"",
        id:"",
	};
	var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
	
	
	
	$rootScope.getClassAtmosphere = function(id){
		var param = '';
		if($scope.variablePacket.nav=="class"){
			$('.image').attr('src','');
			$scope.variablePacket.text = "";
			$scope.variablePacket.imageSrc = "";
			if($scope.variablePacket.range=="school"){
				param = "type=3&relationId="+$scope.userObj.classId;
			}else{
				param = "type=4&relationId="+sessionStorage.getItem('classId');
			}
		}else if($scope.variablePacket.nav=="school"){
			var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
			param = "type=3&relationId="+userSubObj.oid;
		}
		$.ajax({
			type:"get",
			url:jeucIp+"ea/eaSpaceIntroduce?"+param,
			async:false,
			success:function(jdata){
				if(jdata.ret == 200){
					console.log(jdata);
					$scope.variablePacket.text = jdata.data.content;
					$scope.variablePacket.imageSrc = jdata.data.imagePath;
					$scope.variablePacket.id = jdata.data.id;
					
					$scope.variablePacket.classClass = i ;
    	
    	
    /*	$scope.userObj.classId = id;
    	$rootScope.getClassAtmosphere();
    	$state.go("secondNav.classCardWrap.classCardSecondNav.classAtmosphere");
*/
					
				}
			}
		});
	}
	
	
	$rootScope.getClassAtmosphere();
	
	
	//编辑事件
	$scope.edit=function(){
		 $scope.variablePacket.showState=false;
		 $scope.variablePacket.editState=true;
		 
	};
	//上传图片
	$scope.filePhoto = function(me) {
		var imgFile = document.getElementById('FileInput').files[0];
		var FileImg=document.getElementById("FileImg");
		var fr = new FileReader();
		fr.readAsDataURL(imgFile);
		fr.addEventListener("load", function(argument) {
			
			FileImg.src = this.result;
			$scope.variablePacket.imagePath=this.result;
			FileImg.style.display="block";
			$scope.variablePacket.imgError=false;
			$scope.$apply();
			
			var fd = new FormData();
	        var file = me.files[0];
	        fd.append('file', file);
	        fd.append('type', '1');
	        fd.append("createBy",sessionStorage.getItem('userId'));
	        fd.append("officeId",userSubObj.oid);
	        $http({
	    		url:jeucIp + "ea/eaSpaceEnclosure/uploadEnclosure",
	    		method:'POST',
	    		data:fd,
	    		headers: {'Content-Type':undefined},
	            transformRequest: angular.identity 
	    	})
	    	.success(function(res){
	    		$scope.variablePacket.enclosureId = res.data.enclosureId;
	    		$scope.variablePacket.imageSrc = res.data.filePath;
	    	})
	    	.error(function(e) {
				error(e)
			})
		
		});

	};
	//文本域失去焦点
	$scope.textBlur=function(){
		 if($scope.variablePacket.text!=""){
		 	 $scope.variablePacket.textError=false;
		 }else{
		 	  $scope.variablePacket.textError=true;
		 };
	};
	//保存验证
	$scope.save=function(content){
		var type = 0;
		if($scope.variablePacket.range=="school"){
			type = 1;
		}else{
			type = 2;
		}
		 var params = {
               id:$scope.variablePacket.id,
               type:type,
               content:content,
               enclosureId:$scope.variablePacket.enclosureId,
               updateBy:sessionStorage.getItem('userId'),
		            };
		$http.post(jeucIp + "ea/eaSpaceIntroduce/updateIntroduceById",params
	    ).success(function (data) {
	   		if($scope.variablePacket.imagePath==""){
			 	 $scope.variablePacket.imgError=true;
			 };
			 if($scope.variablePacket.text==""){
			 	 $scope.variablePacket.textError=true;
			 };
			 if($scope.variablePacket.imagePath!="" && $scope.variablePacket.text!=""){
			 	  $scope.variablePacket.showState=true;
		          $scope.variablePacket.editState=false;
			 };
			 $rootScope.getClassAtmosphere();
	    });
		 
		   //根据交互效果来确定是否用else if
		 
	};
	
	
}]);