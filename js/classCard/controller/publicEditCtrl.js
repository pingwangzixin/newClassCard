app.controller('publicEditCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
	$scope.mmm = "";
	$scope.variablePacket = {
		name:$stateParams.name,  //establish:创建    edit:编辑
		state:$stateParams.state,    //classNotice：班务公示  classActivity：特色活动   schoolActivity：学校活动
		id:$stateParams.id,
		range:$stateParams.range,
		taskName : '', // 公示名称文字
		selectDate:'',  // 日期选择默认
		inputVal: true,
		taskCont:'',   //公示内容文字
		UploadFile_show:true,//页面--上传文件是否显示
		uploadFile:[
//			{'ResourceSrc':'0',"name":"2016—2017学年六年级语文...",'ResourceNum':0},
//			{'ResourceSrc':'1',"name":"2015—2017学年六年级语文...",'ResourceNum':1},
//			{'ResourceSrc':'2',"name":"2016—2017学年六年级语文...",'ResourceNum':2},
//			{'ResourceSrc':'3',"name":"2015—2017学年六年级语文...",'ResourceNum':3},
//			{'ResourceSrc':'4',"name":"2016—2017学年六年级语文...",'ResourceNum':4}
		],
		ProvingOff:false,//验证开关
		ProvingTaskname:false,//公示名称验证
		ProvingDate:false,//活动时间验证
		ProvingTaskcont:false,//公示内容验证
		prompt:false,  //删除弹框
	}
	
	$scope.clickyts = function(){
		if($("#yts").val()!=""){
			$scope.variablePacket.inputVal = false
		}else{
			$scope.variablePacket.inputVal = true
		}
	}
	
	/*$scope.$watch('mmm',function(newValue,oldValue){
		console.log(11111111121212121);
		console.log(newValue)
		if(newValue == '' || newValue == undefined){
			$scope.variablePacket.inputVal = true
		}else {
			$scope.variablePacket.inputVal = false
		}
    });*/
	//公示名称
	$scope.mlh_taskName = function(){
		if($scope.variablePacket.taskName.length>0){
			$scope.variablePacket.ProvingTaskname = false;
			$scope.variablePacket.ProvingOff = true;
		}
	}
//	//双日历
//	$scope.ChangeDate = function(){
//		$scope.variablePacket.selectDate = $("#yts").html();
//		$scope.variablePacket.ProvingDate = true;
//		$scope.variablePacket.ProvingOff = true;
//		console.log($("#time").val())
//	}
//	$scope.sss = function(){
//		$scope.variablePacket.selectDate = $("#time").val();
//		$scope.variablePacket.ProvingDate = true;
//		$scope.variablePacket.ProvingOff = true;
//		console.log($("#time").val())
//	}
	// 公示内容
	$scope.mlh_taskCont = function(){
		if($scope.variablePacket.taskCont.length>0){
			$scope.variablePacket.ProvingTaskcont = false;
			$scope.variablePacket.ProvingOff = true;
		}
	}
	//验证
	$scope.Verification = function(ok,obj,name){
			$scope.wranShow('验证成功!',true,'');
			$scope.publish(obj,name);
	}
	//页面--上传文件的删除
	$scope.uploadFile = function (i,index,title){
		$scope.promptShow('确认删除吗？',false,title);
		$scope.delOk = function (){
			$scope.variablePacket.uploadFile.splice(index,1);
			$scope.variablePacket.prompt = false;
			$scope.wranShow('删除成功',true,title);
			if($scope.variablePacket.uploadFile.length == 0){
					$scope.variablePacket.UploadFile_show = false;
			}
		};
	};
	$scope.cancel = function(){ //返回
//  	$state.go("secondNav.classCardWrap.classCardSecondNav")
		history.back();
    };
    
    if($scope.variablePacket.name=='edit'){
    	$.ajax({
		    type: "GET",
		    url: jeucIp+"ea/eaSpaceIntroduce/findIntroduceByIdWithEnclosure?id="+$scope.variablePacket.id,
		    async:false,
		    success: function(data){
		    	if(data.ret == 200){
		    		$scope.variablePacket.taskName = data.data.title;
		    		$scope.variablePacket.selectDate = data.data.createDate;
		    		$scope.variablePacket.taskCont = data.data.content;
		    		angular.forEach(data.data.enclosures,function(cla,index){
						$scope.variablePacket.uploadFile.push({'ResourceSrc':index,"name":cla.enclosureName,'ResourceNum':index});
					})
		    	}
		   	}
		});
    }
	
	//删除
//	$scope.uploadFile = function(i,fileId){
//		$scope.variable.deleteBox = true;
//		$scope.sureDelete = function(){
//			//删除上传附件
//			var params ='type='+$scope.constants.type+'&enclosureId='+fileId;
//			$http.get(jeucIp+"ea/eaSpaceIntroduceEnclosure/deleteEnclosureById?"+params)
//			.success(function (data) {
//				var fileIds = [];
//				angular.forEach($scope.constants.enclosureIds,function(data,index){
//					if(data!=fileId){
//						fileIds.push(data);
//					}
//				})
//				$scope.constants.enclosureIds = fileIds;
//				$scope.variable.deleteBox = false;
//				$scope.classNoticeAcce.splice(i,1);
//				tipBoxShow(true,'删除成功');      //删除成功的调用
//		    });
//		}
//	}
	
	/**
	 * 发布学校资讯（新增）
	 */
	$scope.publish = function(obj){
		var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
		var params = {
				title:$scope.variablePacket.taskName,
				content:$scope.variablePacket.taskCont,
				enclosureId:$scope.variablePacket.uploadFile.join(","),
			}
		var parameters = "";
		if($scope.variablePacket.range == "class"){
			parameters={'range':'class','nav':'class','type':'class'};
			params.relationId = sessionStorage.getItem("classId");
			params.type=8;
		}else if($scope.variablePacket.range == "school"){
			parameters={'range':'school','nav':'school','type':'school'};
			params.relationId = userSubObj.oid;
			params.type=7;
			
		}
		if($scope.variablePacket.name=='edit'){
				params.id=$scope.variablePacket.id,
				params.updateBy=sessionStorage.getItem('userId')
			
			$http.post(jeucIp + "ea/eaSpaceIntroduce/updateIntroduceWithEnclosure",params
		    ).success(function (data) {
		   		$state.go("secondNav.classCardWrap.classCardSecondNav."+$scope.variablePacket.state,parameters);
		    });
		}else if($scope.variablePacket.name=='establish'){
		    params.createBy=sessionStorage.getItem('userId')
			$http.post(jeucIp + "ea/eaSpaceIntroduce/publishIntroduce?",params
		    ).success(function (data) {
		    	if($scope.variablePacket.state == 'schoolActivity'){
		    		$scope.variablePacket.state = 'classActivity';
		    	}
		   		$state.go("secondNav.classCardWrap.classCardSecondNav."+$scope.variablePacket.state,parameters);
		    });
		}
	}
	
	/**
	 *上传附件
	 */
	$scope.fileUpload=function(me){
	    var file = me.files[0];
	    var fileName = file.name;
	   		var index = null;
	       	var flag = true;
			var index = fileName.lastIndexOf(".");
	        var suffix =fileName.substring(index + 1,fileName.length).toLowerCase();
	        switch (suffix){
	        	case "doc":
	        	case "docx":
	        	break;
	 			case "xls":
	        	case "xlsx":
	        	break;
	        	case "ppt":
	        	case "pptx":
	        	break;
	        	case "pdf":
	        	break;
	        	case "jpg":
	        	case "png":
	        	break;
	        	case "bpm":
	        	break;
	        	case "jpeg":
	        	break;
	        	case "gif":
	        	break;
	        	default:
	        	flag=false;
	        	break;
	        }
	        if (flag) { 
		       	    var classNoticeAcce = {};
				    classNoticeAcce.Classname = iconBySuffix(me);
				    classNoticeAcce.name = fileName;
			    $scope.$apply(function (){
				     	//index = $scope.classNoticeAcce.push(classNoticeAcce)-1;
				    });
					    var fd = new FormData();
					    fd.append('file', file);
				        fd.append('type', 8);
				        fd.append("officeId",sessionStorage.getItem("classId"));
				        fd.append("createBy",sessionStorage.getItem('userId'));
		     	    $http({
			    		url:jeucIp + "/ea/eaSpaceEnclosure/uploadEnclosure",
			    		method:'POST',
			    		data:fd,
			    		headers: {'Content-Type':undefined},
			            transformRequest: angular.identity  }).success(function(res){
			    		if (res.ret==200) {
				    		$scope.variablePacket.uploadFile.push(res.data.enclosureId);
				    		//$scope.variablePacket.uploadFile.ResourceSrc = res.data.enclosureId;
				    		//$scope.classNoticeAcce[index].imagePath = res.data.filePath;
			    		}
			    	}) 
	        } else{
//	        	$scope.constants.tixbox=true;
//					$timeout(function(){
//						$scope.constants.tixbox=false;
//					},1500);
						return true;//跳出方法
	        }
	}
	
	/**
	 * 通过上传文件后缀获取附件icon图片
	 */
	function iconBySuffix(obj){
		 var word = [".docx",".doc"];
		 var image =[".gif",".jpeg",".jpg",".png",".svg"];
		 var ppt =[".pptx",".ppt"];
		 var excel = [".xlsx",".xls"];
		 
		 var filesuffix = obj.value.substring(obj.value.lastIndexOf('.'));
		 if($.inArray(filesuffix,word)!=-1){
		 	return "icon-word";
		 }else if($.inArray(filesuffix,image)!=-1){
		 	return "icon-techreport-";
		 }else if($.inArray(filesuffix,ppt)!=-1){
		 	return "icon-ppt1";
		 }else if($.inArray(filesuffix,excel)!=-1){
		 	return "icon-dashboard_excel";
		 }else{
		 	return "";
		 }
		 
	}
    
}]);