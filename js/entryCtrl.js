app.controller('entryCtrl',['$scope','$state','$timeout','$http','$location','$interval',function($scope,$state,$timeout,$http,$location,$interval) {


	//变量包
    $scope.variablePacket = {
    	data : [   //列表数据
		{id: 1, title: '通知公告',isMsg:0, data: [{id: 1, title: '保定市教育和体育局 关于2018年秋季种请认定高中阶段教师资格面试说课工作安排的通告',time:'2018-04 -28 00:24:46'}, {id: 2, title: '保定市教育和体育局关于2018年秋季申请认的通告',time:'2018-04 -28 00:24:46'}]},
		{id: 2, title: '新闻动态',isMsg:0, data: [{id: 1, title: '保定市教育和体育局 保定市教育和体育局关于2018年秋季申请认的通告',time:'2018-04 -28 00:24:46'}]},
		{id: 3, title: '系统消息',isMsg:1, data: [{id: 1, title: '三年级（2）班期末成绩',time:'2018-04 -28 00:24:46'}, {id: 2, title: '保定市教育和体育局关于2018年秋季申请认的通告',time:'2018-04 -28 00:24:46'}]}
		],
    	curr : 0   //初始化当前状态
    }
    var userId = "";
    $scope.userInfo = {
		userName : '',
		passWord : ''
	};
	
	/*$scope.loginA = function (){
   		$http.get(jeucIp + 'leaderLogin/login?userName='+$scope.userInfo.userName+'&passWord='+$scope.userInfo.passWord).success(function(res){
   			 
			if(res.ret==200){
				console.log(res);
				var managerSearch = {
					userId: res.data.id,
					name : res.data.name,
					scope: res.data.scope,
					provinceId: res.data.provinceId,
					provinceName: res.data.provinceName,
					cityId: res.data.cityId,
					cityName: res.data.cityName,
					countyId: res.data.countyId,
					countyName: res.data.countyName,
					officeId: res.data.officeId,
					officeName: res.data.officeName,
					officeCode: res.data.officeCode
				}
				console.log(managerSearch);
				managerSearch = JSON.stringify(managerSearch);
				sessionStorage.setItem('managerSearch',managerSearch);
				$state.go("secondNav.classCardWrap",{'range':'school','nav':'school','type':'school'})
			}else{
				alert("用户名或者密码错误");
				sessionStorage.clear();
				window.parent.location.href = backSpace;
			}
			
		})	
		
	} ;
		*/
   	 
	
	
	// tab切换
	$scope.toggle=function(num){
		$scope.variablePacket.curr=num;
	};
	
	//给详情页面传参
	 $scope.indexList = function (listId) {
	 	var listId=listId.id;
//	 	console.log(listId);
        $state.go('secondNav.leftTree.indexListDetails', {id: listId}); 
    };
	





}]);
