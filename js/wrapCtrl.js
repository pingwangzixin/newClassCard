
app.controller('wrapCtrl',['$scope','$state','$timeout','$http','$location','$q','$rootScope',function($scope,$state,$timeout,$http,$location,$q,$rootScope,templateServer) {
	
	
	//退出登录
	$scope.loginOut = function (){
		$scope.loggedIn = false;
		sessionStorage.clear();
		$state.go('wrap.index',null,{reload:true})
	};
	if($location.$$search.state==1){
		$scope.loginOut();
	}
	$scope.userLoggedMsg = {};
	console.log(sessionStorage.getItem('userId'));
	var userId = sessionStorage.getItem('userId') || '';
	var userType = sessionStorage.getItem('userType') || '';
	var userName = '';
	if(userId){
		$scope.loggedIn = true;
		$http.get(requireIp + 'jeuc/api/uc/ucUser/'+userId+'/'+userType).success(function(data) {
			console.log(data);
			if(data.ret==200){
				if(userType=="1"){
					$scope.userLoggedMsg = data.data.userInfo;
					$scope.roles = data.data.userRole;
					$scope.rolesShow = true;
					$scope.spaceShow = true;
				}else if(userType=="2"){
					$scope.userLoggedMsg = data.data.stuInfo;
					$scope.rolesShow = false;
					$scope.spaceShow = true;
				}else if(userType=="3"){
					$scope.userLoggedMsg = data.data.parInfo;
					$scope.roles = data.data.userRole;
					$scope.rolesShow = false;
					$scope.spaceShow = false;
				}else if(userType=="4"){
					$scope.userLoggedMsg = data.data.userInfo;
					$scope.roles = data.data.userRole;
					for (var i=0;i<$scope.roles.length;i++) {
						$scope.roles[i].roleName = $scope.roles[i].name;
						$scope.roles[i].rid = $scope.roles[i].id;
						if($scope.roles[i].rid == 25){
							$scope.adminBtn =true;
						}
					}
					$scope.rolesShow = true;
					$scope.spaceShow = false;
				}else{
					
				}
				console.log($scope.userLoggedMsg)
				$scope.userLoggedMsg.surname = $scope.userLoggedMsg.realname.substring(0,1);
				userName = $scope.userLoggedMsg.loginName;
				console.log($scope.roles)
			}
		}).error(function (){
			
		});
	}
		
		
}]);
//新闻展示时间过滤器
app.filter('unique', function() {
	return function(collection) {
		var output = [],
			keys = [];
		angular.forEach(collection, function(item) {
			var key = item.roleName;
			if(keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	}
});

