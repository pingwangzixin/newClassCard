app.controller('classCardSecondNavCtrl',['$scope','$state','$stateParams','$timeout','$http','$location','$interval','$rootScope',function($scope,$state, $stateParams,$timeout,$http,$location,$interval,$rootScope) {
	
	$scope.officeName =  sessionStorage.getItem('officeName');
    //变量包
    $scope.variablePacket = {
    	range:$location.$$search.range,//学校还是班主任进入的角色
    	nav:$location.$$search.nav,//导航显示的角色
    	schoolType:0,//学校--类型切换样式
    	classType:0,//班级--类型切换样式
    	classGrade:0,//班级--年级切换样式
    	classClass:0,//班级--班级切换样式
    }
    //自定义变量
    $scope.userObj = {
    	classId:'',
    	content:'',
		imageSrc:'',
		className:'',
		gradeName:'',
    }
    
  /////////////////  
     var openType ;
    var relationId ;
    var createBy ;
    var parentRelationId ;
    if(sessionStorage.getItem("rid")==1)//班级别
    {
    	 openType = 2;
    	relationId = sessionStorage.getItem("classId");
    	createBy =  sessionStorage.getItem("managerSearch").userId;
    	parentRelationId = sessionStorage.getItem("officeId");
    	
    	
    }
    else{//校级别
    	
    	 openType = 1;
    	relationId = sessionStorage.getItem("officeId");
    	createBy =  sessionStorage.getItem("managerSearch").userId;
    	
    
    }
   $http.post(jeucIp + 'ea/eaSpaceIntroduce/openEaSpaceIntroduce', {
				openType: openType,
				relationId: relationId,
				createBy: createBy,
				parentRelationId: parentRelationId
				 
			}).success(function(res) {
				console.log(res)
				if(res.ret == 200) 
				{
				console.log("ktcg")
				} else { 
				console.log("ktsb")
				}
			}).error(function(e) 
			{
			console.log("ktsb")
			})
    //////////////////////////////
    
    
    
    $scope.schoolTypeData = [
    
    	/*{'name':'校训','url':"secondNav.classCardWrap.classCardSecondNav.classAtmosphere({'type':'"+$scope.variablePacket.nav+"'})"},
    	*/
    	{'name':'学校简介','url':"secondNav.classCardWrap.classCardSecondNav.classIntroduce({'type':'"+$scope.variablePacket.nav+"'})"},
    	
    	{'name':'学校公告','url':"secondNav.classCardWrap.classCardSecondNav.classActivity({'type':'"+$scope.variablePacket.nav+"'})"},
    	
    	{'name':'校园风采','url':"secondNav.classCardWrap.classCardSecondNav.classDemeanor({'type':'"+$scope.variablePacket.nav+"'})"},
    ]
    $scope.classTypeData = [
    
    	/*{'name':'班级介绍','url':"secondNav.classCardWrap.classCardSecondNav.classAtmosphere({'type':'"+$scope.variablePacket.nav+"'})"},
    */	
   		 {'name':'班级介绍','url':"secondNav.classCardWrap.classCardSecondNav.classIntroduce({'type':'"+$scope.variablePacket.nav+"'})"},
    	
    		{'name':'班主任介绍','url':"secondNav.classCardWrap.classCardSecondNav.headmasterIntroduce"},
    	
    	{'name':'班级通告','url':"secondNav.classCardWrap.classCardSecondNav.classNotice"},
    
    	/*{'name':'明星学生','url':"secondNav.classCardWrap.classCardSecondNav.starStudent"},
    */	
    	/*{'name':'特色活动','url':"secondNav.classCardWrap.classCardSecondNav.classActivity({'type':'"+$scope.variablePacket.nav+"'})"},
    	*/
    	{'name':'班级风采','url':"secondNav.classCardWrap.classCardSecondNav.classDemeanor({'type':'"+$scope.variablePacket.nav+"'})"},
    ]
    
     $scope.gradeData = [
//  	{'name':'一年级'},
//  	{'name':'二年级'},
//  	{'name':'三年级'},
//  	{'name':'四年级'},
//  	{'name':'五年级'},
//  	{'name':'六年级'},
//  	{'name':'初一'},
//  	{'name':'初二'},
//  	{'name':'初三'},
//  	{'name':'高一'},
//  	{'name':'高二'},
//  	{'name':'高三'},
    ]
     
     $scope.classData = [
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
//  	{'name':'（1）班'},
    ]
     
     $scope.getClassListByGrade = function(grade){
     	$scope.variablePacket.classId = '';
     	$scope.classData = [];
    	$.ajax({
			type:"post",
			data: {schoolId:userSubObj.oid,subStages:grade},
			url:jeucIpApi+"ClassInfo/getClassBySchoolIdAndSubStages",
			async:false,
			success:function(data){
				if(data.classInfo.length > 0){
					var i = 0;
					angular.forEach(data.classInfo,function(cla,index){
						 
						$scope.classData.push({'id':cla.classId,'name':'('+cla.classNo+')班'});
						 
					})
					$scope.userObj.classId = $scope.classData[0].id;
				}
//			$state.go("secondNav.classCardWrap.classCardSecondNav.classAtmosphere",{'type':'school'});
			}
		});
    }
     
     var userSubObj = JSON.parse(sessionStorage.getItem('userObj'));
     console.log(userSubObj);
     $.ajax({
		type:"get",
		url:jeucIpApi+"SchoolInfo/getSubStagesBySchoolId?schoolId="+userSubObj.oid,
		async:false,
		success:function(data){
			if(data.ret == "1"){
				angular.forEach(data.subStagesInfo,function(grade,index){
					$scope.gradeData.push({'name':grade.SchoolSubStages});
				})
//				sessionStorage.setItem('classId','');
				$scope.getClassListByGrade($scope.gradeData[0].name);
			}
		}
	});
	
	$.ajax({
		type:"get",
		url:jeucIp+"ea/eaClass?classId="+sessionStorage.getItem('classId'),
		async:false,
		success:function(data){
			if(data.ret == 200){
				$scope.userObj.className = '('+data.data.name+')班';
				$scope.userObj.gradeName = data.data.gradeName;
			}
		}
	});
    
    
    $scope.schoolType = function(i){
    	$scope.variablePacket.schoolType = i ;
    }
    
    $scope.classType = function(i){
    	$scope.variablePacket.classType = i ;
    }
    
    $scope.gradeTab = function(i,id){
    	$scope.variablePacket.classGrade = i ;
    	$scope.variablePacket.classClass = 0 ;
    	$scope.getClassListByGrade(id);
    	$rootScope.getClassAtmosphere();
    }
    
     $scope.classTab = function(i,id){
    	$scope.variablePacket.classClass = i ;
    	$scope.userObj.classId = id;
    	$rootScope.getClassAtmosphere();
    	$state.go("secondNav.classCardWrap.classCardSecondNav.classAtmosphere");
    }
}]);