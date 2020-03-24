app.controller('classCardWrapCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
    $scope.variablePacket = {
    	rang:$location.$$search.range,//进入的角色
    	rangeData:$location.$$search.range == 'school' ? [
    		{"name":'学校信息',url:"secondNav.classCardWrap.classCardSecondNav({'range':'school','nav':'school','type':'school'})"},
    		{"name":'班级信息',url:"secondNav.classCardWrap.classCardSecondNav({'range':'school','nav':'class','type':'class'})"}
    	] : [{"name":'班级信息',url:"secondNav.classCardWrap.classCardSecondNav({'range':'class','nav':'class','type':'class'})"}]
    }
   
    $scope.cancel = function(){
    	history.back();
    }
    
}]);