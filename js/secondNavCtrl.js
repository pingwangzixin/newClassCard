app.controller('secondNavCtrl', ['$scope', '$state', '$timeout', '$http', '$location', '$interval', '$stateParams', function($scope, $state, $timeout, $http, $location, $interval, templateServer, $stateParams) {

	$scope.variablePacket = {
		promptState: false, //提示框显示状态
		surname:'',
		name:'',

	};

    console.log(sessionStorage.getItem('scope')+'**************');
	$scope.tzdlIp = tzdlIp +"?username=" +sessionStorage.getItem("userName");
	//导航参数获取
	$scope.$on('nav', function(event, data) {
		$scope.navShowDet = data;
		concole.log($scope.navShowDet);
	});
	$scope.variablePacket.name = JSON.parse(sessionStorage.getItem('managerSearch')).name;
	$scope.variablePacket.surname=$scope.variablePacket.name.substring(0,1);
//	console.log($scope.variablePacket.name);

	  sessionStorage.getItem("userName");
//	var token = $stateParams.token;
	//通过token获取用户信息
//	console.log(jeucIp + 'leaderLogin/findUserByToken?token=' + token);
	//var mdjUrl = mdjIp+'/Api/SchoolInfo/getSchool?clientId='+clientId+'&clientSecret='+clientSecret+'&token='+token;
	/*$http.get(jeucIp + 'leaderLogin/findUserByToken?token=' + token).success(function(res) {
		console.log(res);
		if(res.ret == '1') {
			var userName = res.teacherInfo.teaTel;
			var jmhPassWord = res.teacherInfo.teaPassword;

			console.log(jeucIp + 'leaderLogin/login?userName=' + userName + '&jmhPassWord=' + jmhPassWord);
			$http.get(jeucIp + 'leaderLogin/login?userName=' + userName + '&jmhPassWord=' + jmhPassWord).success(function(res) {

				if(res.ret == 200) {
					console.log(res);
					var managerSearch = {
						userId: res.data.id,
						name: res.data.name,
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
					if(managerSearch.scope != 2 && managerSearch.scope != 3 && managerSearch.scope != 4) {
						$scope.variablePacket.promptState = true;
						setTimeout(function() {
							$scope.variablePacket.promptState = false;
							window.parent.location.href = mdjIp;

						}, 1500);

					} else {
						managerSearch = JSON.stringify(managerSearch);
						sessionStorage.setItem('managerSearch', managerSearch);
						$scope.name = JSON.parse(sessionStorage.getItem('managerSearch')).name;
					};
				} else {
					//console.log("ID获取用户失败")
					alert("用户名或者密码错误");
					sessionStorage.clear();
					//window.parent.location.href = mdjIp;
				}

			})

		} else {
			//	window.parent.location.href = mdjIp;
		}
	});*/

	$scope.logOut = function() {
		sessionStorage.clear();
		window.parent.location.href=logout;

	}

	$scope.jinrujiuban = function() {
		window.parent.location.href = olderLeaderIp;
	}

 

}]);