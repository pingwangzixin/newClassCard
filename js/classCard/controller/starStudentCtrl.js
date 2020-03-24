app.controller('starStudentCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
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
          text:"" ,//文本内容
          prompt:false,  //删除弹框
          imageSrc:"",
          starStudent:[],
          id:"",
    };
    
    $scope.getStarStudentList = function(){
    	var relationId = '';
	    if($scope.variablePacket.range=="school"){
	   		relationId= $scope.userObj.classId;
	   	}else if($scope.variablePacket.range=="class"){
	   		relationId = sessionStorage.getItem('classId');
	   	}
	   	$scope.variablePacket.starStudent=[];
	    $.ajax({
			type:"get",
			url:jeucIp+"ea/eaSpaceIntroduce/list?type=6&relationId="+relationId,
			async:false,
			success:function(jdata){
				if(jdata.ret == 200){
					angular.forEach(jdata.data.list,function(e,i){
						$scope.variablePacket.starStudent.push({"id":e.id,"img":e.imagePath,"name":e.title,"content":e.content});
	                })
				}
			}
		});
    }
   $scope.getStarStudentList();
    
    //明星学生数据模拟
//  $scope.starStudent=[
//      {
//      	 id:1,
//      	 img:"img/default_avatar.png",//头像
//      	 name:"张三",     //姓名
//      	 content:"我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。"//简介
//      },
//      {
//      	 id:2,
//      	 img:"img/default_avatar.png",
//      	 name:"李四",
//      	 content:"我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。"
//      },
//      {
//      	 id:3,
//      	 img:"img/default_avatar.png",
//      	 name:"王五",
//      	 content:"我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。"
//      },
//      {
//      	 id:4,
//      	 img:"img/default_avatar.png",
//      	 name:"赵六",
//      	 content:"我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。我喜欢学习，学习使我快乐。"
//      }
//  
//  
//    ];
      
    /*$timeout(function(){
    	angular.element(".zmj_starStudent_list").mCustomScrollbar({
			mouseWheelPixels : 1000,	//滚动速度
			theme: "dark-thin"			//滚动条样式
		});
    })*/
      
    //编辑事件
	$scope.edit=function(id){
		 $scope.variablePacket.showState=false;
		 $scope.variablePacket.editState=true;
		 $scope.variablePacket.id = id;
		 if($scope.variablePacket.id !=undefined){
			$http.get(jeucIp+"ea/eaSpaceIntroduce/findIntroduceByIdWithEnclosure?type=6&id="+id).success(function (data){
				if(data.data!=null){
					$scope.variablePacket.name = data.data.title;
					$scope.variablePacket.text = data.data.content;
					if(data.data.enclosure!=""){
						$scope.variablePacket.imageSrc = data.data.enclosure.filePath;
						var FileImg=document.getElementById("FileImg");
						FileImg.src = $scope.variablePacket.imageSrc;
						FileImg.style.display="block";
					}else{
						$scope.constants.defaultImage = false;
					}
				}
				
			})
		 }
		 
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
	        fd.append('type', '6');
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
	$scope.save = function(text) {
		if($scope.variablePacket.name == "") {
			$scope.variablePacket.nameError = true;
		};
		if($scope.variablePacket.imageSrc == "") {
			$scope.variablePacket.imgError = true;
		};
		if($scope.variablePacket.text == "") {
			$scope.variablePacket.textError = true;
		};
		if($scope.variablePacket.name != "" && $scope.variablePacket.imageSrc != "" && $scope.variablePacket.text != "") {
			$scope.variablePacket.showState = true;
			$scope.variablePacket.editState = false;
			$scope.saveOrUpdate(text);
		};
	};	
	
	//创建或者保存
	$scope.saveOrUpdate = function(text){
		var params = {
			title: $scope.variablePacket.name,
			type: 6,
			content: text,
			enclosureId: $scope.variablePacket.enclosureId,
		};
		if($scope.variablePacket.id == undefined) {
			params.createBy=sessionStorage.getItem('userId');
			params.relationId=sessionStorage.getItem('classId');
			$http.post(jeucIp + "ea/eaSpaceIntroduce/publishIntroduce", params).success(function(data) {
				$scope.getStarStudentList();
			});
		}else{
			params.id = $scope.variablePacket.id;
			params.updateBy= sessionStorage.getItem('userId');
			$http.post(jeucIp + "ea/eaSpaceIntroduce/updateIntroduceById", params).success(function(data) {
				$scope.getStarStudentList();
			});
		}
	}
	//删除弹框
	$scope.Del = function(i,id) {    
		$scope.promptShow('确认删除吗？',false);
		$scope.delOk = function (){
			$scope.variablePacket.prompt = false;
			$scope.sureDelete(i,id);
			$scope.wranShow('删除成功',true);
		};
	};
	
	//删除列表中单挑数据的事件
	$scope.sureDelete = function (i,id){
		$http.get(jeucIp+"ea/eaSpaceIntroduce/deleteEaSpaceIntroduce?id="+id+"&type=6")
		.success(function (data) {
			if(data.ret==200){
				$scope.wranShow('删除成功',true);     //删除成功的调用
				$scope.getStarStudentList();
			}else{
				$scope.wranShow('删除失败',false);
			}
		});
	};
}]);