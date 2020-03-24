app.controller('classIntroduceCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval','$compile',function($scope,$state, $stateParams,$timeout,$http,$location,$interval,$compile) {
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
          imageSrc:"",
          enclosureId:"",
          id:"",
	};
	if($scope.variablePacket.range=='school'){
		if($scope.variablePacket.nav=='class'){
			$scope.type = 4;
		}else{
			$scope.type = 3;
		}
	}else if($scope.variablePacket.range=='class'){
		$scope.type = 4;
	}
	var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
	var relationId ='';
	$scope.getClassIntroduce = function(){
		if($scope.variablePacket.nav=="class"){
			if($scope.variablePacket.range=="school"){
				relationId = "type="+$scope.type+"&relationId="+$scope.userObj.classId;
			}else{
				relationId = "type="+$scope.type+"&relationId="+sessionStorage.getItem('classId');
			}
		}else if($scope.variablePacket.nav=="school"){
			relationId = "type=3&relationId="+userSubObj.oid;
		}
		$.ajax({
			type:"get",
			url:jeucIp+"ea/eaSpaceIntroduce?"+relationId,
			async:false,
			success:function(jdata){
				if(jdata.ret == 200){
					console.log(jdata);
					$scope.variablePacket.text = jdata.data.content;
					$scope.variablePacket.imageSrc = jdata.data.imagePath;
					$scope.variablePacket.id = jdata.data.id;
				}
			}
		});
	}
	$scope.getClassIntroduce();
		
	//编辑事件
	$scope.edit=function(){
		$scope.variablePacket.showState=false;
		$scope.variablePacket.editState=true;
		var FileImg=document.getElementById("FileImg");
		FileImg.src = $scope.variablePacket.imageSrc;
		FileImg.style.display="block";
		
	};
	//上传图片
	$scope.filePhoto = function(me) {
		var imgFile = document.getElementById('FileInput').files[0];
		var FileImg=document.getElementById("FileImg");
		var fr = new FileReader();
		fr.readAsDataURL(imgFile);
		fr.addEventListener("load", function(argument) {
			
			FileImg.src = this.result;
			$scope.variablePacket.imageSrc=this.result;
			FileImg.style.display="block";
			$scope.variablePacket.imgError=false;
			$scope.$apply();
			
			var fd = new FormData();
	        var file = me.files[0];
	        fd.append('file', file);
	        fd.append('type', $scope.type);
	        fd.append("createBy",sessionStorage.getItem('userId'));
	        fd.append("officeId",sessionStorage.getItem('classId'));
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
	
	
	//文本域验证
	$scope.textBlur=function(){
		 if($scope.variablePacket.text!=""){
		 	 $scope.variablePacket.textError=false;
		 }else{
		 	 $scope.variablePacket.textError=true;
		 };
	};
	//保存验证
	$scope.save=function(content){
		 var params = {
               id:$scope.variablePacket.id,
               type:$scope.type,
               content:content,
               enclosureId:$scope.variablePacket.enclosureId,
               updateBy:sessionStorage.getItem('userId'),
		            };
		$http.post(jeucIp + "ea/eaSpaceIntroduce/updateIntroduceById",params
	    ).success(function (data) {
	   		if($scope.variablePacket.imageSrc==""){
			 	 $scope.variablePacket.imgError=true;
			 };
			 if($scope.variablePacket.text==""){
			 	 $scope.variablePacket.textError=true;
			 };
			 if($scope.variablePacket.imageSrc!="" && $scope.variablePacket.text!=""){
			 	  $scope.variablePacket.showState=true;
		          $scope.variablePacket.editState=false;
			 };
			 $scope.getClassIntroduce();
	    });
	};
    
    
}]);