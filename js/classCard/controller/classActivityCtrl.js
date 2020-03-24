app.controller('classActivityCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
    $scope.variablePacket = {
    	range:$location.$$search.range,//学校还是班主任进入的角色
		nav:$location.$$search.nav,//导航显示的角色
    	type : $stateParams.type,  //接收的参数
    	prompt:false, //删除弹框
    	count:0,
    	publicity:[],
    	schoolActivity:[],
    	current:0,
    }
    
		var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
		var param = '';
		if($scope.variablePacket.nav=="class"){
			if($scope.variablePacket.range=="school"){
				param = "type=8&relationId="+$scope.userObj.classId;
			}else{
				param = "type=8&relationId="+sessionStorage.getItem('classId');
			}
		}else if($scope.variablePacket.nav=="school"){
			param = "type=7&relationId="+userSubObj.oid;
		}
		$.ajax({
		    type: "GET",
		    url: jeucIp+"ea/eaSpaceIntroduce/list?"+param,
		    async:false,
		    success: function(data){
		    	$scope.variablePacket.count = data.data.count;
		    	var j = data.data.count/data.data.pageSize;
				if(j<=1){
					$scope.variablePacket.current = 1;
				}else if(j>1){
					$scope.variablePacket.current  = Math.ceil(j);
				}
		   	}
		});

		$('#page').paging({
	        initPageNo: 1, // 初始页码
	        totalPages: $scope.variablePacket.current, //总页数
	        slideSpeed: 500, // 缓动速度。单位毫秒
	        jump: false, //是否支持跳转
	        callback: function(page) { // 回调函数
	            $.ajax({
		            type: "GET",
		            url: jeucIp+"ea/eaSpaceIntroduce/list?"+param,
		            async:false,
		            success: function(data){
		            	var oneClass = data.data.list;
	                    var newArr = [];
						for (var i = 0; i < oneClass.length; i += data.data.pageSize) {
						    newArr.push(oneClass.slice(i, i + data.data.pageSize));
						}
	                    for(var i=0;i<5;i++){
	                    	if(page==i+1){
	                    		$scope.variablePacket.pageNo = page;
								angular.forEach(newArr[i],function(comment, commentIndex){
									$scope.variablePacket.schoolActivity.push({"id":comment.id,"title":comment.title,"time":comment.createDate})
								})
			            	}
	                    }
	               	}
		        });
	        }
	    })

	

    //数据模拟
//  $scope.publicityData = {
//		publicity : [
//	    	{id:'1',title:'运动会运动会立即报名运动会立即报名立即报名',time:'2017-07-07  08：23'},
//	    	{id:'2',title:'运动会立即报名1',time:'2017-01-05  07：00'},
//	    	{id:'3',title:'运动会立即报名2',time:'2017-07-07  08：23'},
//	    	{id:'4',title:'运动会立即报名3',time:'2017-05-07  12：43'},
//	    	{id:'5',title:'运动会立即报名4',time:'2017-07-07  08：03'},
//	    	{id:'6',title:'运动会立即报名5',time:'2017-09-10  05：23'}
//  	],
//  	schoolActivity : [
//	    	{id:'1',title:'运动会运动会立即报名运动会立即报名立即报名',time:'2017-07-07',read:'123'},
//	    	{id:'2',title:'运动会立即报名1',time:'2017-01-05',read:'23'},
//	    	{id:'3',title:'运动会立即报名2',time:'2017-07-07',read:'12'},
//	    	{id:'4',title:'运动会立即报名3',time:'2017-05-07',read:'56'},
//	    	{id:'5',title:'运动会立即报名4',time:'2017-07-07',read:'123'},
//	    	{id:'6',title:'运动会立即报名5',time:'2017-09-10',read:'123'}
//  	]
//  }
    // 删除班级-特色活动列表
    $scope.deleteData = function (i,type,title){
		$scope.promptShow('确认删除吗？',false,title);
		$scope.delOk = function (){
			$scope.publicityData[type].splice(i,1);
			$scope.variablePacket.prompt = false;
			$scope.wranShow('删除成功',true,title);
		};
	};
	 // 删除学校信息-学校活动列表
	  $scope.deleteData = function (i,type,title,id){
		$scope.promptShow('确认删除吗？',false,title);
		var k=0;
		if(type=="publicity"){
    		k=8;
    	}else if(type=="schoolActivity"){
    		k=7;
    	}
		$scope.delOk = function (){
			var params ='type='+k+'&id='+id;
			$http.get(jeucIp+"ea/eaSpaceIntroduce/deleteEaSpaceIntroduce?"+params)
			.success(function (data) {
				if(data.ret==200){
						$scope.variablePacket.schoolActivity.splice(i,1);
						$scope.variablePacket.prompt = false;
						$scope.wranShow('删除成功',true,title);   //删除成功的调用
					$scope.variablePacket.count--;
				}else{
					$scope.wranShow('删除失败',false);
				}
		    });
		};
	};
	
	
    
}]);