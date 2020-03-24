app.controller('safeMoreCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
    $scope.variablePacket = {
    	
    }
    //今日情况 数据模拟
    $scope.todayData = [
    	{'name':'到校时间',startTime:'7:30',endTime:'8:00'},
    	{'name':'午休时间',startTime:'11:30',endTime:'13:00'},
    	{'name':'离校时间',startTime:'15:00',endTime:'15:30'},
    	{'name':'活动时间',startTime:'16:00',endTime:'18:00'}
    ];
    //表格数据模拟
    $scope.studentData = [
    	{'name':'孙若镤','time':'07:38:53','behavior':'进校','performance':'正常'},
    	{'name':'孙国宝','time':'08:02:53','behavior':'离校','performance':'早退'},
    	{'name':'任凯琪','time':'12:45:34','behavior':'午休','performance':'正常'},
    	{'name':'朱恩瑜','time':'13:02:33','behavior':'活动','performance':'午休异常'},
    	{'name':'李智学','time':'07:41:02','behavior':'活动','performance':'早退'},
    	{'name':'孙若镤','time':'07:38:53','behavior':'进校','performance':'正常'},
    	{'name':'孙国宝','time':'08:02:53','behavior':'离校','performance':'早退'},
    	{'name':'任凯琪','time':'12:45:34','behavior':'午休','performance':'正常'},
    	{'name':'朱恩瑜','time':'13:02:33','behavior':'活动','performance':'午休异常'},
    	{'name':'李智学','time':'07:41:02','behavior':'活动','performance':'早退'}
    ];
}]);