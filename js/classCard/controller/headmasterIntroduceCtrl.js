app.controller('headmasterIntroduceCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
	$scope.variablePacket = {
		range:$location.$$search.range,//学校还是班主任进入的角色
		nav:$location.$$search.nav,//导航显示的角色
		  showState:true,  //展示模块状态
		  editState:false, //编辑模块状态
		  nameError:false, //姓名提示
          imgError:false,//上传图片提示
          textError:false, //文本提示
          name:"",         //姓名
          imagePath:"" ,     //上传图片路径
          text:"",          //文本内容
          imageSrc:"",
          enclosureId:"",
          id:"",
	};
	
	$scope.headmaster = function(){
		var relationId = '';
	    if($scope.variablePacket.range=="school"){
	   		relationId= $scope.userObj.classId;
	   	}else if($scope.variablePacket.range=="class"){
	   		relationId = sessionStorage.getItem('classId');
	   	}
		$.ajax({
			type:"get",
			url:jeucIp+"ea/eaSpaceIntroduce?type=5&relationId="+relationId,
			async:false,
			success:function(jdata){
				if(jdata.ret == 200){
					$scope.variablePacket.text=jdata.data.content;
					$scope.variablePacket.imageSrc=jdata.data.imagePath;
					$scope.variablePacket.id=jdata.data.id;
				}
			}
		});
	}
	$scope.headmaster();
	
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
			var fd = new FormData();
			var file = me.files[0];
		    fd.append('file', file);
	       	fd.append('type', 5);
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
	    		$scope.variablePacket.imageSrc = res.data.imagePath;
	    	})
	    	.error(function(e) {
				error(e)
			})
			FileImg.style.display="block";
			$scope.variablePacket.imgError=false; 
		});
	};
	//文本验证
	$scope.nameBlur=function(){
		 if($scope.variablePacket.name!=""){
		 	 $scope.variablePacket.nameError=false;
		 }else{
		 	  $scope.variablePacket.nameError=true;
		 };
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
	$scope.save=function(){
//		 if($scope.variablePacket.name==""){
//		 	 $scope.variablePacket.nameError=true;
//		 };
		 if($scope.variablePacket.imageSrc==""){
		 	 $scope.variablePacket.imgError=true;
		 };
		 if($scope.variablePacket.text==""){
		 	 $scope.variablePacket.textError=true;
		 };
		 if(/*$scope.variablePacket.name!="" &&*/ $scope.variablePacket.imageSrc!="" && $scope.variablePacket.text!=""){
		 	  $scope.variablePacket.showState=true;
	          $scope.variablePacket.editState=false;
		 };
		 
		 var params = {
		               id:$scope.variablePacket.id,
		               type:5,
		               content:$scope.variablePacket.text,
		               enclosureId:$scope.variablePacket.enclosureId,
		               updateBy:sessionStorage.getItem('userId')
		            };
		$http.post(jeucIp + "ea/eaSpaceIntroduce/updateIntroduceById?",params
	    ).success(function (data) {
	    	console.log(data);
	    	if (data.ret==200) {
//	    		$state.go('secondNav.classCardWrap.classCardSecondNav.headmasterIntroduce');
$scope.headmaster();
	    	}
	    });
	};
	
    
}]);