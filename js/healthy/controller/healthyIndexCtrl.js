app.controller('healthyIndexCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	//变量包
    $scope.variablePacket = {
    	
    }
   	//心率  数据模拟
    $scope.Normal = [
    	{'name':' ',num:'1',state:' '},
    	{'name':' ',num:'1',state:' '}
    ];
    var dateData = [];
	var bushuData = [];
	 $scope.jintianbushu = "0";	
	 
    var organizationLevel = "";
	var organizationId = "";
		
		var rid = sessionStorage.getItem("rid")	;	
		if(rid==1)
		{
			organizationLevel = "class";
			organizationId = sessionStorage.getItem("classId")	;
					
		}
		else 
		{
			organizationLevel = "school";
			organizationId = sessionStorage.getItem("officeId")	;
		
		}
		
		$.ajax({
			type: "get",
			url: classCardIp + '/ClassCard/ShouhuanController/findbushu.do?organizationId='+organizationId+ '&organizationLevel='+organizationLevel,
				async: false,
			success: function(res) {
				console.log(res)
				if(res.ret == 200) {
						 
				  var date = new Date();
				    
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? '0' + m : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var time = y + '-' + m + '-' + d;  

				for(key in res.data)
				{
					
					dateData.push(key);
					var dataSplit = res.data[key].split(",");
					var agv = dataSplit[0]/dataSplit[1];
					bushuData.push(agv*1);
					if(time==key)
					{
						 $scope.jintianbushu = agv;
					}
				}
			 console.log(dateData);
   			
   		}
				}
			});
			
	var linedata = [{
		name: '步数',
		data: bushuData
	}]
	
	
	$scope.changeZheline = function() {
		 
		
		console.log(dateData);
		console.log(bushuData);
		
		 var chart_line_user_data = {
			"colors": ["#61aee4"],
			"title": "",
			"categories": dateData ,
			"ytitle": "",
			"tip_type":4,
			"data": linedata
		};
		chart_line('.chart_line_user', chart_line_user_data.colors, chart_line_user_data.title, chart_line_user_data.categories, chart_line_user_data.ytitle, chart_line_user_data.data,true,false,chart_line_user_data.tip_type,false);
	};
	$scope.changeZheline();
	
	//表格数据模拟
    $scope.classData = [ ];
    //调用dataTable
	app.controller('tableAreaCtrl', function($scope) {
		var vm = this;
		vm.tabledata_area = $scope.classData;
		vm.dtOptions = {
			paging: false, // 不分页
			info: false, // 不显示info
			searching: false, // 不显示搜索框
			language: {
				emptyTable: "暂无数据"
			},
			columnDefs: [{
				orderable: false
			}],
			order:[1]
		}});
		
	 
	 $.ajax({
			type: "get",
			url: classCardIp + '/ClassCard/ShouhuanController/findStuShouhuanInfor.do?organizationId='+organizationId+ '&organizationLevel='+organizationLevel,
			async: false,
			success: function(res) {
				
				console.log(res)
				if(res.ret == 200) { 
				console.log(res);
				 $scope.classData = res.data 
				
				}
						
   		
				}
			});
			
	 
	 $.ajax({
			type: "get",
			url: classCardIp + '/ClassCard/ShouhuanController/findAbnormalStu.do?organizationId='+organizationId+ '&organizationLevel='+organizationLevel,
			async: false,
			success: function(res) {
				
				console.log(res)
				if(res.ret == 200) { 
				 $scope.Normal = res.Normal;
				}
						
   		
				}
			});
			
   		 
	
	 
}]);