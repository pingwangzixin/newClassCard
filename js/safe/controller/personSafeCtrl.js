app.controller('personSafeCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval',function($scope,$state, $stateParams,$timeout,$http,$location,$interval) { 


   $scope.stuId = $stateParams.stuId;
    
     $.ajax({
	 	
			type: "get",
			url: classCardIp+ '/ClassCard/ShouhuanController/chaxguiji.do?stuId='+ $scope.stuId,
			async: false,
			success: function(res) {
				console.log(classCardIp+ '/ClassCard/ShouhuanController/chaxguiji.do?stuId=656bd8e93a844d1a95876041becdab6a')
				console.log(res)
				if(res.ret == 200) { 
					 
					 var map = new BMap.Map("allmap");
					//开始点 
					var pointStart = new BMap.Point(res.data[0].Lon, res.data[0].Lat);
					 map.centerAndZoom(pointStart, 20);
 					map.enableScrollWheelZoom(true);	
					 
					 //结束点
					 var pointEnd = new BMap.Point(res.data[res.data.length-1].Lon, res.data[res.data.length-1].Lat);
					 
					 
					 var piontList = [];
					 
					for (var i=0;i<res.data.length;i++) {
						if(i%3==0){
							
						
						console.log(res.data[i]);
						var point1 = new BMap.Point(res.data[i].Lon, res.data[i].Lat);
						var marker1 = new BMap.Marker(point1); // 创建点
						map.addOverlay(marker1);  
						piontList.push(point1);
						}
					}
					
					var polyline = new BMap.Polyline( piontList, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
					map.addOverlay(polyline); 
					
					var opts1 = {
	  				position : pointStart,    // 指定文本标注所在的地理位置
	 				 offset   : new BMap.Size(5, -5)    //设置文本偏移量
								}
					var label1 = new BMap.Label("起点", opts1);  // 创建文本标注对象
					label1.setStyle({
						 color : "red",
						 fontSize : "12px",
						 height : "20px",
						 lineHeight : "20px",
						 fontFamily:"微软雅黑"
						 });
					map.addOverlay(label1);  

 					var opts2 = {
						  position : pointEnd,    // 指定文本标注所在的地理位置
						  offset   : new BMap.Size(5, -5)    //设置文本偏移量
						}
					var label2 = new BMap.Label("终点", opts2);  // 创建文本标注对象
					label2.setStyle({
						 color : "red",
						 fontSize : "12px",
						 height : "20px",
						 lineHeight : "20px",
			 				fontFamily:"微软雅黑"
		 				});
						map.addOverlay(label2);  
    
					
				}
						
   		
				}
			});
			
    
    
    /*var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.3438376, 40.1340392);
	map.centerAndZoom(point, 20);
 	map.enableScrollWheelZoom(true);	*/
 	
 	
	  
	 
	/*var point1 = new BMap.Point(116.36438376, 40.1340392);
	var marker1 = new BMap.Marker(point1); // 创建点
	map.addOverlay(marker1);   
	

	var point2 = new BMap.Point(116.3438376, 40.1340392);
	var marker2 = new BMap.Marker( point2); // 创建点
	map.addOverlay(marker2); 
	 
	var point3 = new BMap.Point(116.3448376, 40.1350392);
	var marker3 = new BMap.Marker(point3); // 创建点
	map.addOverlay(marker3); */


	/*var polyline = new BMap.Polyline([
		point1  ,
		point2 ,
		point3 
	], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
	map.addOverlay(polyline); */

	 /*var opts1 = {
	  position : point1,    // 指定文本标注所在的地理位置
	  offset   : new BMap.Size(5, -5)    //设置文本偏移量
	}
	var label1 = new BMap.Label("起点", opts1);  // 创建文本标注对象
		label1.setStyle({
			 color : "red",
			 fontSize : "12px",
			 height : "20px",
			 lineHeight : "20px",
			 fontFamily:"微软雅黑"
		 });
	map.addOverlay(label1);  

 	var opts2 = {
	  position : point3,    // 指定文本标注所在的地理位置
	  offset   : new BMap.Size(5, -5)    //设置文本偏移量
	}
	var label2 = new BMap.Label("终点", opts2);  // 创建文本标注对象
		label2.setStyle({
			 color : "red",
			 fontSize : "12px",
			 height : "20px",
			 lineHeight : "20px",
			 fontFamily:"微软雅黑"
		 });
	map.addOverlay(label2);  
    
    */
    
    

}]);