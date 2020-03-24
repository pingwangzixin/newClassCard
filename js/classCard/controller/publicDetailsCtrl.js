app.controller('publicDetailsCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
    $scope.variablePacket = {
    	   id:$stateParams.id, //列表页传递的参数id
    	   title:$stateParams.title, //列表页传递的参数标题
    	   state:$stateParams.state, //接收传递的参数
    	   content:"",
    	   createDate:"",
    	   obj:{}
    }
    
     $.ajax({
			type:"get",
			url:jeucIp+"ea/eaSpaceIntroduce/findIntroduceByIdWithEnclosure?id="+$stateParams.id,
			async:false,
			success:function(jdata){
				if(jdata.ret == 200){
					var obj={};
					obj.fileId =jdata.data.id;
					obj.Classname = icon(jdata.enclosureType);
					obj.name = jdata.data.enclosureName;
					obj.enclosurePath = jdata.filePath;
					//obj.enclosureName=jdata.data.enclosures.enclosureName;
					obj.enclosures=jdata.data.enclosures;
					
					$scope.variablePacket.title=jdata.data.title;
					$scope.variablePacket.content=jdata.data.content;
					// 获取某个时间格式的时间戳
					var stringTime = jdata.data.createDate;
					var timestamp2 = Date.parse(new Date(stringTime ));
					var timestamp =new Date(timestamp2);
					var year = timestamp.getFullYear();//获取完整的年份
					var month = timestamp.getMonth()+1;//获取月份
					var today = timestamp.getDate();//获取月中某一日
					obj.createDate=	year+"年"+month+"月"+today+"日";
					$scope.variablePacket.obj = obj;
					
				}
			}
		});
		
		function icon(enclosureType){
		 if(enclosureType=="1"){
		 	return "icon-word";
		 }else if(enclosureType=="2"){
		 	return "icon-dashboard_excel";
		 }else if(enclosureType=="3"){
		 	return "icon-ppt1";
		 }else if(enclosureType=="4"){
		 	return "";
		 }else if(enclosureType=="5"){
		 	return "icon-techreport-";
		 }else{
		 	return "";
		 }
		 
	}
    //返回上一路由
    $scope.cancel = function(){
    	history.back();
    }
}]);