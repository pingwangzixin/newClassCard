app.controller('safeIndexCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) {
	
	
	var totalCount = "0";
	var zhengchang= "0";
	var queqing = "0";
	var chidao = "0";
	var zaotui = "0";
	
	var zhengchangList = [];
					var queqingList = [];
					var chidaoList = [];
		
					var zaotuiList = [];
				var organizationLevel = "";
				var organizationId = "";
				
		var rid = sessionStorage.getItem("rid")	;	
		
		console.log(rid);
		
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
			url: classCardIp+ '/ClassCard/ShouhuanController/findchuq.do?organizationId='+organizationId+ '&organizationLevel='+organizationLevel,
			async: false,
			success: function(res) {
				
				console.log(res)
				if(res.ret == 200) {
						 
					
						totalCount = res.count;
						for(var i= 0;i<res.list.length;i++)
						{
							if(res.list[i].type == "早退")
							{
								zaotui = res.list[i].count;
								
							}
							else if(res.list[i].type == "正常")
							{
								if(zhengchang=="0"||res.list[i].count<zhengchang)
								{
									zhengchang = res.list[i].count;
								} 
							}else if(res.list[i].type == "缺勤")
							{
								queqing = res.list[i].count;
							}else if(res.list[i].type == "迟到")
							{
								chidao = res.list[i].count;
							}
						}
						
						}
						
   		
				}
			});
			
			 $scope.todayData = [
    	{'name':'到校时间',startTime:'7:30',endTime:'8:00'},
    	{'name':'午休时间',startTime:'11:30',endTime:'13:00'},
    	{'name':'离校时间',startTime:'15:00',endTime:'15:30'},
    	{'name':'活动时间',startTime:'16:00',endTime:'18:00'}
    ];
		
		 //表格数据模拟
    $scope.studentData = [ ];
    
     $scope.tzguiji = tzguiji;
    // console.log(tzguiji);
    //历史出勤率折线图
	var linedata = [{
		name: '考勤正常率',
		data: [0, 0, 0, 0, 0, 0]
	}, {
		name: '学生缺勤率',
		data:  [0, 0, 0, 0, 0, 0]
	}, {
		name: '学生迟到率',
		data:  [0, 0, 0, 0, 0, 0]
	}, {
		name: '学生早退率',
		data: [0, 0, 0, 0, 0, 0]
	}]
	
	
		 
			var dateKeyList = [];
					//查询学生历史考勤情况
			$.ajax({
			type: "get",
			url: classCardIp + '/ClassCard/ShouhuanController/findOldStu.do?organizationId='+organizationId+ '&organizationLevel='+organizationLevel,
					async: false,
			success: function(res) {
				console.log(res)
				if(res.ret == 200) {
					totalCount = res.totalCount ;
					
					var arry = [];
					for(key in res.dataMap)
					{
						arry.push(key);
				  		
					}
					arry.sort();

					
					for(var i in arry)
					{
						var item = res.dataMap[arry[i]]/totalCount;
							
						if(arry[i].match("缺勤"))
						{
							queqingList.push(parseInt(item*100))
						}
						else if(arry[i].match("正常"))
						{
							zhengchangList.push(parseInt(item*100))
						}
						else if(arry[i].match("迟到"))
						{
							chidaoList.push(parseInt(item*100))
						}
						else if(arry[i].match("早退"))
						{
							zaotuiList.push(parseInt(item*100))
						}
						if(dateKeyList.indexOf(arry[i].split(",")[0])==-1)
						{
							dateKeyList.push(arry[i].split(",")[0]);
						}
				  		console.log(arry[i] );
					}
					 
	 				console.log(queqingList);
	 				console.log(zhengchangList);
	 				
	 				
   					linedata[0].data = zhengchangList;
   					linedata[1].data = queqingList;
   					linedata[2].data = chidaoList;
   					linedata[3].data = zaotuiList;
   					
   					
   					
   					
   					console.log(linedata[0].data );
   					console.log(linedata[1].data );
   					console.log(linedata[2].data );
   					console.log(linedata[3].data );
				}
			}
			});
		
	
	
	/*var linedata = [{
		name: '考勤正常率',
		data: zhengchangList
	}, {
		name: '学生缺勤率',
		data:  queqingList
	}, {
		name: '学生迟到率',
		data:  chidaoList
	}, {
		name: '学生早退率',
		data: zaotuiList
	}]*/
	
	$scope.changeZheline = function() {
		var chart_line_user_data = {
			"colors": ["#46a2d2", "#c72036", "#d18604"],
			"title": "",
			"categories": dateKeyList,
			"ytitle": "",
			"tip_type":2,
			"data": linedata
		};
		chart_line('.chart_line_user', chart_line_user_data.colors, chart_line_user_data.title, chart_line_user_data.categories, chart_line_user_data.ytitle, chart_line_user_data.data,true,true,chart_line_user_data.tip_type,false);
	};
	$scope.changeZheline();
	
		
		
			
	//变量包
    $scope.variablePacket = {
    	late : '' //迟到人数  用来页面判断显示哪部分内容
    }
    //今日出勤统计表 数据模拟
   
   
	//今日出勤情况 实心饼图
	var pieSolidArr = {
			"target": ".pieSolid",
			"title": "",
			"enabled":false,
			"data": [{
				type: 'pie',
				data: [
					{
						'name':'正常考勤学生',
						'y':zhengchang*1,
						'color':'#f4b242',
					},
					{
						'name':'非正常考勤学生',
						'y':  totalCount*1-zhengchang*1,
						'color':'#48bd7e',
					}
				]
			}],
			"labels": true
		};
		pie_solid(pieSolidArr);
		
		var pieSolidArr = {
			"target": ".pieSolid1",
			"title": "",
			"enabled":false,
			"data": [{
				type: 'pie',
				data: [
					{
						'name':'缺勤学生',
						'y':queqing*1,
						'color':'#e0e0e0',
					},
					{
						'name':'非缺勤学生',
						'y': totalCount*1-queqing*1,
						'color':'#48bd7e',
					}
				]
			}],
			"labels": true
		};
		pie_solid(pieSolidArr)
		$scope.variablePacket.late = pieSolidArr.data[0].data[0].y;
		var pieSolidArr = {
			"target": ".pieSolid2",
			"title": "",
			"enabled":false,
			"data": [{
				type: 'pie',
				data: [
					{
						'name':'迟到学生',
						'y':chidao*1,
						'color':'#46a2d2',
					},
					{
						'name':'非迟到学生',
						'y':totalCount*1-chidao*1,
						'color':'#48bd7e',
					}
				]
			}],
			"labels": true
		};
		pie_solid(pieSolidArr);
		var pieSolidArr = {
			"target": ".pieSolid3",
			"title": "",
			"enabled":false,
			"data": [{
				type: 'pie',
				data: [
					{
						'name':'早退学生',
						'y':zaotui*1,
						'color':'#46a2d2',
					},
					{
						'name':'非早退学生',
						'y':totalCount*1 - zaotui*1,
						'color':'#48bd7e',
					}
				]
			}],
			"labels": true
		};
		pie_solid(pieSolidArr)
		
		
		 
		$.ajax({
			type: "get",
			url: classCardIp + '/ClassCard/ShouhuanController/findEveryStu.do?organizationId='+organizationId+ '&organizationLevel='+organizationLevel,
			async: false,
			success: function(res) {
				console.log(res)
				if(res.ret == 200) { 
					
				  $scope.studentData  = res.list;
				console.log($scope.studentData );
				
				}
						
   		
				}
			});
				
			
}]);