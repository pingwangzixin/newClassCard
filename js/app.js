var app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'ngAnimate', 'ui.sortable', 'ng.ueditor', 'me-lazyload', 'datatables']);

app.run(['$rootScope', '$location', '$state', '$http', function($rootScope, $location, $state, $window, $http) {
	//用户在各个模块停留时间统计开始——————————————————————
	var second, startTime, endTime;
	$rootScope.$on('$viewContentLoaded', function() {
		$.ajax({
			type: "get",
			url: jeucIp + "userStatistic/getCurrentTime",
			async: false,
			success: function(res) {
				startTime = res.data.currentTime
			}
		});
	});

	function getStopTime() {
		$.ajax({
			type: "get",
			url: jeucIp + "/getCurrentTime",
			async: false,
			success: function(res) {
				endTime = res.data.currentTime
			}
		});
		var dataArr = {
			'stopTimes': (endTime - startTime) / 1000 + '秒',
			'startTime': startTime,
			'endTime': endTime
		};
		console.log(dataArr)

		$.ajax({
			type: "post",
			url: jeucIp + "behavior",
			async: false,
			data: dataArr,
			dataType: 'json',
			success: function(data) {
				console.log(data)

			}
		});
	}


	window.onbeforeunload = function() {
		getStopTime()
	};
	//用户在各个模块停留时间统计结束——————————————————————

	window.onload = function() {
		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 50);
	}


	//判断角色 进入我的空间
	var userType = sessionStorage.getItem('userType');

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if(toState.name == 'secondNav.classCardWrap') { //班牌管理-默认到班风页面
			$state.go('secondNav.classCardWrap.classCardSecondNav.classAtmosphere');
		} else if(toState.name == 'secondNav.classCardWrap.classCardSecondNav') { //班牌管理-默认到班风页面
			$state.go('secondNav.classCardWrap.classCardSecondNav.classAtmosphere');
		}
	})
}]);

app.factory('UserInterceptor', ["$q", "$rootScope", function($q, $rootScope) {
	return {
		request: function(config) {
			console.log(config)
			config.headers["TOKEN"] = '12312312';
			return config;
		},
	};
}]);

app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider", "$httpProvider", "$locationProvider",
	function($provide, $compileProvider, $controllerProvider, $filterProvider, $httpProvider, $locationProvider) {
		// $httpProvider.interceptors.push('UserInterceptor');
		app.controller = $controllerProvider.register;
		app.directive = $compileProvider.directive;
		app.filter = $filterProvider.register;
		app.factory = $provide.factory;
		app.service = $provide.service;
		app.constant = $provide.constant;
		//转化post请求传参-------------------------------------------------
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.transformRequest = [function(data) {
			var param = function(obj) {
				var query = '';
				var name, value, fullSubName, subName, subValue, innerObj, i;
				for(name in obj) {
					value = obj[name];
					if(value instanceof Array) {
						for(i = 0; i < value.length; ++i) {
							subValue = value[i];
							fullSubName = name + '[' + i + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if(value instanceof Object) {
						for(subName in value) {
							subValue = value[subName];
							fullSubName = name + '[' + subName + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if(value !== undefined && value !== null) {
						query += encodeURIComponent(name) + '=' +
							encodeURIComponent(value) + '&';
					}
				}
				return query.length ? query.substr(0, query.length - 1) : query;
			};
			return angular.isObject(data) && String(data) !== '[object File]' ?
				param(data) :
				data;
		}];
		//转化post请求传参------------------------------------------------------
	}
]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/entry');
	$stateProvider
		.state('wrap', {
			url: "/wrap",
			templateUrl: 'tpl/wrap.html',
			controller: "wrapCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/wrapCtrl.js");
				}]
			}
		})

		.state('secondNav', { //深蓝色导航--个人设置、我的空间等使用
			url: "/secondNav",
			templateUrl: 'tpl/secondNav.html',
			controller: "secondNavCtrl",
			params: {
				token: null
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/secondNavCtrl.js");
				}]
			}
		})

		
		.state('entry', { //登录
			url: "/entry",
			templateUrl: 'tpl/entry.html',
			controller: "entryCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/entryCtrl.js");
				}]
			}
		})
		
		//班牌管理开始 
		.state('secondNav.classCardWrap', { //班牌管理--（班级/学习）导航
			url: "/classCardWrap",
			templateUrl: 'tpl/classCard/classCardWrap.html',
			controller: "classCardWrapCtrl",
			params: {
				range: null, //进入的角色--school是学校管理权限 	 class是班主任权限
				nav: null, //控制学校和班级导航切换--school是学校管理导航 		class是班主任导航
				type: null, //控制类型切换--scholl是学校管理导航 		class是班主任导航，
				id:null
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/classCardWrapCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav', { //班牌管理--二级分类
			url: "/classCardSecondNav",
			templateUrl: 'tpl/classCard/classCardSecondNav.html',
			controller: "classCardSecondNavCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/classCardSecondNavCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav.classAtmosphere', { //班风/校训
			url: "/classAtmosphere",
			templateUrl: 'tpl/classCard/classAtmosphere.html',
			controller: "classAtmosphereCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/classAtmosphereCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav.classNotice', { //班务公示
			url: "/classNotice",
			templateUrl: 'tpl/classCard/classNotice.html',
			controller: "classNoticeCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/classNoticeCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav.headmasterIntroduce', { //班主任介绍
			url: "/headmasterIntroduce",
			templateUrl: 'tpl/classCard/headmasterIntroduce.html',
			controller: "headmasterIntroduceCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/headmasterIntroduceCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav.classIntroduce', { //班级介绍/学校简介
			url: "/classIntroduce",
			templateUrl: 'tpl/classCard/classIntroduce.html',
			controller: "classIntroduceCtrl",
			params: {
				type: null, //scholl是学校 	 class是班主任
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/classIntroduceCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav.starStudent', { //明星学生
			url: "/starStudent",
			templateUrl: 'tpl/classCard/starStudent.html',
			controller: "starStudentCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/starStudentCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav.classActivity', { //特色活动/学校活动
			url: "/classActivity",
			templateUrl: 'tpl/classCard/classActivity.html',
			controller: "classActivityCtrl",
			params: {
				type: null //scholl是学校 	 class是班主任
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/classActivityCtrl.js");
				}]
			}
		})
		.state('secondNav.classCardWrap.classCardSecondNav.classDemeanor', { //班级风采/校园风采
			url: "/classDemeanor",
			templateUrl: 'tpl/classCard/classDemeanor.html',
			controller: "classDemeanorCtrl",
			params: {
				id:null,
				type: null, //scholl是学校 	 class是班主任
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/classDemeanorCtrl.js");
				}]
			}
		})
		.state('secondNav.DemeanorEdit', { //创建/编辑风采
			url: "/DemeanorEdit",
			templateUrl: 'tpl/classCard/DemeanorEdit.html',
			controller: "DemeanorEditCtrl",
			params: {
				state: null, //scholl是学校 	 class是班主任
				type:null, //1：编辑  其他是添加
				id:null,
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/DemeanorEditCtrl.js");
				}]
			}
		})
		.state('secondNav.DemeanorDetails', { //风采详情
			url: "/DemeanorDetails",
			templateUrl: 'tpl/classCard/DemeanorDetails.html',
			controller: "DemeanorDetailsCtrl",
			params: {
				id:null,
				state: null, //scholl是学校 	 class是班主任
				power: null, //school校管理员进入班级 class班主任进入班级
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/DemeanorDetailsCtrl.js");
				}]
			}
		})
		.state('secondNav.publicEdit', { //班务公示编辑，特色活动的创建/编辑，学校活动创建/编辑
			url: "/publicEdit",
			templateUrl: 'tpl/classCard/publicEdit.html',
			controller: "publicEditCtrl",
			params: {
				name: 'establish', //establish:创建    edit:编辑
				state: 'classNotice', //classNotice：班务公示  classActivity：特色活动   schoolActivity：学校活动
				id:null,
				range:null
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/publicEditCtrl.js");
				}]
			}
		})
		.state('secondNav.publicDetails', { //班务公示详情/特色活动详情/学校活动详情
			url: "/publicDetails",
			templateUrl: 'tpl/classCard/publicDetails.html',
			controller: "publicDetailsCtrl",
			params: {
				id: null, //传递列表id
				title: null, //传递列表标题
				state: 'classNotice' //classNotice:班务公示详情 classActivity：特色活动 schoolActivity：学校活动
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/classCard/controller/publicDetailsCtrl.js");
				}]
			}
		})
		//班牌管理结束


		//安全管理开始
		.state('secondNav.safeIndex', { //安全管理-首页
			url: "/safeIndex",
			templateUrl: 'tpl/safe/safeIndex.html',
			controller: "safeIndexCtrl",
			params:{
				stuId:null
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/safe/controller/safeIndexCtrl.js");
				}]
			}
		})
		.state('secondNav.safeMore', { //安全管理-更多
			url: "/safeMore",
			templateUrl: 'tpl/safe/safeMore.html',
			controller: "safeMoreCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/safe/controller/safeMoreCtrl.js");
				}]
			}
		})
		
		.state('personSafe', { //安全管理-更多
			url: "/personSafe",
			templateUrl: 'tpl/safe/personSafe.html',
			controller: "personSafeCtrl",
			params: {
				stuId: null
			},
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/safe/controller/personSafeCtrl.js");
				}]
			}
		})
		
		//安全管理结束
		
		
		//健康管理开始
		.state('secondNav.healthyIndex', { //健康管理-首页
			url: "/healthyIndex",
			templateUrl: 'tpl/healthy/healthyIndex.html',
			controller: "healthyIndexCtrl",
			resolve: {
				deps: ["$ocLazyLoad", function($ocLazyLoad) {
					return $ocLazyLoad.load("js/healthy/controller/healthyIndexCtrl.js");
				}]
			}
		})
		//健康管理结束

	

}]);

//图片加载失败替换
app.directive('errSrc', function() {
	return {
		link: function(scope, element, attrs) {
			element.bind('error', function() {
				if(attrs.src != attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});
		}
	}
});



//底部新
app.directive('zFooter', function($timeout) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			content: '='
		},
		template: '<footer class="footer_end"><p>©Copyright 2004-2019  北京捷成世纪科技股份有限公司 保留所有权利</p><p>京ICP证 05020513号 - 京公网安备 11010802011761 - Designed by Jetsen</p><p class="zy_support">技术支持：北京捷成世纪科技股份有限公司&nbsp; &nbsp;<img src="./img/jetsen_logo.png"></p><p class="jx_bottom_fw mt10"><a href="http://www.12377.cn/" target="_blank"><img src="http://www.jxeduyun.com/App.ResourceCloud/Src/apps/changyan/_static/common/images/jx_footer_pic01.png" alt="不良信息举报中心"></a><a href="http://www.cyberpolice.cn/wfjb/" target="_blank"><img src="http://www.jxeduyun.com/App.ResourceCloud/Src/apps/changyan/_static/common/images/jx_footer_pic02.png" alt="网络110报警服务"></a></p></footer>',
		link: function(scope, element, attrs) {
			//			
		}
	}
});

//人数统计
app.directive('zScore', function($timeout, $http) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			cont: '=cont'
		},
		template: '<div class="z_numlist"><ul><li ng-repeat="i in length track by $index"><div class="ullist"><p>0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>0</p></div></li></ul></div>',
		link: function(scope, element, attrs) {
			$http.get(requireIp + "jeuc/api/sys/userStatistics/findUserAmount?areaId=360200").success(function(data) {
				console.log("人数")
				console.log(data.data);
				if(scope.cont.p == "tot") {
					scope.cont.num = data.data.amount;
				} else if(scope.cont.p == "tea") {
					scope.cont.num = data.data.teacherAmount;
				} else if(scope.cont.p == "stu") {
					scope.cont.num = data.data.studentAmount;
				} else if(scope.cont.p == "par") {
					scope.cont.num = data.data.parentAmount;
				}
				scope.cont.fontSize = scope.cont.fontSize ? scope.cont.fontSize : 24;
				scope.length = new Array(scope.cont.num.toString().length);
				console.log(scope.cont)
				console.log(scope.length)

				angular.element(document).bind('scroll', function() {
					if($('.zy_watch_list').length && ($(document).scrollTop() + $(window).height()) >= $('.zy_watch_list').offset().top) {
						clearInterval(timer);
						var timer = setTimeout(function() {
							//console.log(scope.cont.num)
							var arrNum = scope.cont.num.toString().split('');
							var oul = element[0].querySelectorAll('.ullist');
							//var arrUl = Array.prototype.slice.call(oul);
							var arrUl = [].slice.call(oul);
							//[].slice.call(oul).forEach(function(v,i){
							arrUl.forEach(function(v, i) {
								arrUl[i].style.top = -scope.cont.fontSize * parseInt(arrNum[i]) + 'px'
							})
						}.bind(this));
					}
				});
			});

		}
	}
});

//门户管理 模板
app.directive('templateSet', function(templateServer) {
	return {
		restrice: 'CE',
		replace: true,
		templateUrl: './tpl/sharedTemplate/templateSetting.html',
		controller: 'templateSettingCtrl'
	}
});


//共用头部(除门户外)
app.directive('system', function($timeout) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: './tpl/sharedTemplate/navsecond.html',
		//		template: '<div class="zy_admin_set"><div class="zy_set_wrap_bg"><div class="zy_set_wrap"><div class="zy_set_bar clearfix"><div class="fl"><span class="zy_bar_big_tit" ng-bind="nav.title"></span><span class="zy_bar_tit" ng-bind="nav.secondTitle"></span></div><ul class="fl" ng-show="nav.middleAdmin"><li class="fl" ui-sref="organization" ui-sref-active="active">机构管理</li><li class="fl" ui-sref="user" ui-sref-active="active">用户管理</li><li class="fl" ui-sref="role" ui-sref-active="active">角色权限</li></ul><p class="zy_set_users fr"><i>李</i><span>李朋霖老师</span></p><div class="zy_more_platform fr" ng-show="nav.goBackCloud"><span class="fl"><i class="iconfont icon-shouye"></i><a ui-sref="wrap.index">捷成教育云平台</a></span></div></div></div></div></div>',
		scope: {
			nav: '=',
		},
		link: function(scope, element, attrs) {
			$timeout(function() {
				//				console.log(scope.nav)
			})

			scope.loginOut = function() {
				sessionStorage.clear();
				window.parent.location.href = backSpace;
			}

		}
	}
});

//repeat 加载完之后
app.directive('repeatFinish', function($timeout) {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				scope.$eval(attr.repeatFinish);
			}
		}
	}
});

//无缝滚动
app.directive('seamlessRolling', function($timeout) {
	return {
		restrict: 'EA',
		replace: true,
		link: function(scope, ele, attrs) {
			if(scope.$last == true) {
				$timeout(function() {
					var moveBox = $(ele).parent();
					var html = moveBox.html();
					var i = 0;
					var timer = null;
					var liHeight = moveBox.children().outerHeight(true);
					var liLength = moveBox.children().length / 2;
					//					moveBox.html(html + html);

					function toUp() {
						if(parseInt(moveBox.css('margin-top')) > (-liHeight * liLength)) {
							i++;
							moveBox.animate({
								marginTop: -liHeight * i + 'px'
							}, 'slow');
						} else {
							i = 0;
							moveBox.css('margin-top', '0px');
						}
					}

					timer = setInterval(toUp, 2500);

					moveBox.hover(function() {
						clearInterval(timer);
					}, function() {
						clearInterval(timer);
						timer = setInterval(toUp, 2500);
					});
				});
			}
		}
	}
});

//身份证号码验证
app.factory('IDCheck', function() {
	function checkID(ID) {
		//		console.log(ID);
		if(typeof ID !== 'string') return '非法字符串';
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		};
		var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
		var d = new Date(birthday);
		var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
		var currentTime = new Date().getTime();
		var time = d.getTime();
		var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		var sum = 0,
			i, residue;
		//if(!/^\d{17}(\d|x)$/i.test(ID)) return '非法身份证';
		if(!/^\d{17}(\d|x)$/i.test(ID)) return false;
		//if(city[ID.substr(0,2)] === undefined) return "非法地区";
		if(city[ID.substr(0, 2)] === undefined) return false;
		//if(time >= currentTime || birthday !== newBirthday) return '非法生日';
		if(time >= currentTime || birthday !== newBirthday) return false;
		for(i = 0; i < 17; i++) {
			sum += ID.substr(i, 1) * arrInt[i];
		}
		residue = arrCh[sum % 11];
		//if (residue !== ID.substr(17, 1)) return '非法身份证哦';
		if(residue !== ID.substr(17, 1)) return false;
		console.log(city[ID.substr(0, 2)] + "," + birthday + "," + (ID.substr(16, 1) % 2 ? " 男" : "女"))
		return city[ID.substr(0, 2)] + "," + birthday + "," + (ID.substr(16, 1) % 2 ? " 男" : "女");
		return true;
	}
	return {
		checkID: checkID
	}

});


//确认框以及提示框（题库、资源库）
app.directive('promptBox', function($timeout) {
	return {
		restrict: 'EA',
		//		replace : false,
		scope: {
			variablePacket: '=',
			promptShow: '=',
			wranShow: '=',
			delOk: '=',
			maskZindex: '='
		},
		 
		controller: function($scope) {
			//			this.aaa = 123;
		},
		link: function(scope, ele, attrs) {
			/*提示框变量参数
				prompt:false,    //是否显示-提示框
				warn:false,      //是否显示-警示框
				warn_src:false,  //警示框的感叹图片为false，对勾的图片是true；
				warn_title:'',   //警示框的文件名字
				warn_text:'',    //警示框的提示文字
				prompt_src:false,//提示框的感叹图片为false，对勾的图片是true；
				prompt_title:'', //提示框的文件名字
				prompt_text:''   //提示框的提示文字
			*/

			//警示框函数（定时自动关闭）
			//参数一：第二行文字，大字;
			//参数二：感叹图片为false，对勾的图片是true;
			//参数三：第一行文字，小字（没有可不传参）;
			scope.wranShow = function(texts, srcpic, title) {
				scope.variablePacket.warn = true;
				scope.variablePacket.warn_title = title || '';
				scope.variablePacket.warn_text = texts;
				scope.variablePacket.warn_src = srcpic;
				$timeout(function() {
					scope.variablePacket.warn = false;
				}, 1500);
			}
			//提示框函数（手动操作关闭）
			//参数一：第二行文字，大字; 
			//参数二：感叹图片为false，对勾的图片是true;
			//参数三：第一行文字，小字（没有可不传参）;
			scope.promptShow = function(texts, srcpic, title) {
				scope.variablePacket.prompt = true;
				scope.variablePacket.prompt_title = title || '';
				scope.variablePacket.prompt_text = texts;
				scope.variablePacket.prompt_src = srcpic;
			}
		}

	};
});

//分享弹框（资源库、题库）
app.directive('shareBox', function($http) {
	return {
		restrict: 'EA',
		replace: false,
		//		require : '^?ccc',
		scope: {
			variablePacket: '=',
			wranShow: '=',
			shareShow: '=',
			resource: '='
		},
		template: `<div class="gy_del_down zy_share_box" ng-if="variablePacket.shareCase">
					    <div class="gy_hide"></div>
					    <div class="gy_con">
					    	<div class="zy_share_tit">
					    		<b>分享</b>
					    		<i class="iconfont icon-guanbi1 fr" ng-click="closeCase()"></i>
					    	</div>
					    	<div class="zy_share_object_choose">
					    		<span ng-class="{'active':variablePacket.shareIndex==0}" ng-click="shareTab(0)">分享给老师</span>
					    		<span ng-class="{'active':variablePacket.shareIndex==1}" ng-click="shareTab(1)">分享给学生</span>
					    	</div>
					    	<div class="zy_share_object_box">
					    		<div class="zy_object_coordinate">
					    			<div class="zy_select_choose" ng-if="variablePacket.shareIndex==0">
					    				选择学科：
					    				<select name="" ng-model="variablePacket.selectedSubject" ng-options="i.id as i.name for i in variablePacket.selectSubject" ng-change="getTeacher()" >
					    					<option value="">请选择学科</option>
					    				</select>
					    			</div>
					    			<div class="zy_select_choose" ng-if="variablePacket.shareIndex==1">
					    				选择年级：
					    				<select id="gradeId" ng-change="getClass()" name="" ng-model="variablePacket.selectedGrade" ng-options="i.id as i.grade for i in variablePacket.selectGrade">
					    					<option value="">请选择年级</option>
					    				</select>
					    				选择班级：
					    				<select id="classId" name="" ng-model="variablePacket.selectedClass" ng-options="i.id as i.class for i in variablePacket.selectClass" ng-change="getTeacher()">
					    					<option value="">请选择班级</option>
					    				</select>
					    			</div>
					    		</div>
					    		<div class="zy_object_all">
					    			<div ng-class="{'active':variablePacket.shareAllBtn}"><label for="all" ng-if="variablePacket.shareAllBtnShow" ng-click="shareSelectAll(variablePacket.shareAllBtn)"><input type="checkbox" name="all" id="all" ng-model="variablePacket.shareAllBtn" value=""/>全选</label></div>
					    			<div class="zy_objec_aggregate">
					    				<ul class="clearfix">
					    					<li class="fl" ng-class="{'active':i.state,'active_state':i.disabled}" ng-repeat="i in variablePacket.SharePeopleArr">
					    						<input type="checkbox" name="" ng-attr-id="{{i.id}}" ng-disabled="i.disabled" ng-model="i.state" value="" ng-click="shareSelectOne($index,$event,i.state)" /><label ng-attr-for="{{i.id}}" ng-bind="i.name"></label>
					    					</li>
					    				</ul>
					    			</div>
					    		</div>
					    	</div>
					    	<div class="zy_btn_group">
					    		<button ng-if="variablePacket.shareBtn" ng-click="shareSuccess()">分享</button>
					    	</div>
						</div>
					</div>`,
		link: function(scope, ele, attrs, Fctr) {
			//分享弹框展示
			scope.shareShow = function() {
				scope.variablePacket.shareCase = true;
				//默认展示教师列表
				scope.variablePacket.shareIndex = 0;
				scope.variablePacket.SharePeopleArr = [];
				scope.variablePacket.shareAllBtnShow = scope.variablePacket.SharePeopleArr.length ? true : false;
			};
			scope.getTeacher = function() {
				var subjectId = scope.variablePacket.selectedSubject;
				var url = zyxrequireIp + '/uc/user?officeId=office_86316e3f8e14462d99e465836a6ba186&delFlag=0&state=1&userType=1';
				//              scope.variablePacket.shareIndex
				if(scope.variablePacket.shareIndex == "0") {
					if(subjectId != null) {
						url += "&subjectId=" + subjectId;
					}
				}
				if(scope.variablePacket.shareIndex == "1") {
					var gradeId = scope.variablePacket.selectedGrade;
					var classId = scope.variablePacket.selectedClass;
					if(gradeId != null) {
						url += "&gradeId=" + gradeId;
					}
					if(classId != null) {
						url += "&classId=" + classId;
					}
				}

				$http.get(url).success(function(suc) {
					if(suc.ret == 200) {
						var list = new Array();
						angular.forEach(suc.data.list, function(data) {
							var obj = {
								id: data.id,
								name: data.realname,
								state: false,
								disabled: false
							}
							list.push(obj)
						});
						scope.variablePacket.SharePeopleArr = list;
						scope.variablePacket.shareAllBtnShow = scope.variablePacket.SharePeopleArr.length ? true : false;
					};
				});

			}

			scope.getClass = function() {
				var gradeId = scope.variablePacket.selectedGrade;
				$http.get(zyxrequireIp + '/ea/eaClass?gradeId=' + gradeId).success(function(suc) {
					if(suc.ret == 200) {
						var list = new Array();
						angular.forEach(suc.data, function(data) {
							var obj = {
								id: data.id,
								class: data.name + "班",
							}
							list.push(obj)
						});
						scope.variablePacket.selectClass = list;
					};
				});
			}

			//分享按钮成功提示
			scope.shareSuccess = function() {
				scope.variablePacket.shareCase = false;

				var userId = "";
				console.log(scope.variablePacket.SharePeopleArr)
				angular.forEach(scope.variablePacket.SharePeopleArr, function(data) {
					if(data.state) {
						userId += data.id + ",";
					}
				});
				var url = resourcesIp + "/a/resource/share?token=29B5DF07F7FC514807CE5FBC12EA1506";
				url += "&userId=" + userId;
				url += "&type=" + scope.variablePacket.shareIndex;
				url += "&resourceIds=" + scope.variablePacket.resource.id;
				url += "&authorIds=" + scope.variablePacket.resource.createBy;
				var classId = scope.variablePacket.selectedClass;
				if(classId != null) {
					url += "&classId=" + classId;
					var className = $("#classId").find("option:selected").text();
					var gradeId = $("#gradeId").find("option:selected").text();
					console.log(className)
					console.log(gradeId)
					url += "&className=" + gradeId + className;
				}
				$http.post(url).success(function(suc) {
					if(suc.code == 200) {
						scope.wranShow('分享成功', false);
					};
				});
				clearAll();
			};
			//关闭按钮
			scope.closeCase = function() {
				clearAll();
				scope.variablePacket.shareCase = false;
			};
			//弹框多选变量
			var varpage = {
				disabledNo: 0, //不能选的数量
				checkedNum: 0 //多选数量
			};
			//分享弹框已分享过的样式展示
			function disabledNoFn() {
				angular.forEach(scope.variablePacket.SharePeopleArr, function(e, i) {
					if(e.disabled) {
						e.state = true;
						varpage.disabledNo++;
					}
				});
			}
			disabledNoFn();
			//清空状态（全选按钮/已勾选数量/禁止勾选数量/分享按按钮/数据列表）
			function clearAll() {
				scope.variablePacket.shareAllBtn = false;
				varpage.checkedNum = 0;
				varpage.disabledNo = 0;
				scope.variablePacket.shareBtn = false;
				scope.variablePacket.SharePeopleArr = [];
			}

			//分享对象切换（学生、教师）
			scope.shareTab = function(i) {
				scope.variablePacket.shareIndex = i;
				clearAll();
				if(i) { //学生
					scope.variablePacket.SharePeopleArr = [];
					disabledNoFn();
					scope.variablePacket.selectedGrade = null;
					scope.variablePacket.selectedClass = null;
				} else { //教师
					scope.variablePacket.SharePeopleArr = scope.variablePacket.teacherList;
					scope.variablePacket.selectedSubject = null;
					disabledNoFn();
				}
				scope.variablePacket.shareAllBtnShow = scope.variablePacket.SharePeopleArr.length ? true : false;
				angular.forEach(scope.variablePacket.SharePeopleArr, function(e, i) {
					e.state = false;
				});
			};

			//分享框全选/反选事件
			scope.shareSelectAll = function(allState) {
				console.log(scope.variablePacket.shareBtn)
				if(allState) {
					angular.forEach(scope.variablePacket.SharePeopleArr, function(e, i) {
						e.state = true;
						varpage.checkedNum = scope.variablePacket.SharePeopleArr.length - varpage.disabledNo;
						scope.variablePacket.shareBtn = true;
					});
				} else {
					angular.forEach(scope.variablePacket.SharePeopleArr, function(e, i) {
						if(e.disabled == false) {
							e.state = false;
						}
					});
					varpage.checkedNum = 0;
					scope.variablePacket.shareBtn = false;
				}
			};
			//分享框多选事件
			scope.shareSelectOne = function(i, ele, state) {
				state ? varpage.checkedNum++ : varpage.checkedNum--;
				if(varpage.checkedNum == scope.variablePacket.SharePeopleArr.length - varpage.disabledNo) {
					scope.variablePacket.shareAllBtn = true;
				} else {
					scope.variablePacket.shareAllBtn = false;
				}
				scope.variablePacket.shareBtn = varpage.checkedNum ? true : false;
			};
		}
	};
});


//分页组件
app.directive('zjyPagination', function() {
	return {
		restrict: 'EA',
		template: '<div class="page-list">' +
			'<ul class="handle_paging clearfix">' +
			'<li  ng-class="{disabled: conf.currentPage == 1}" ng-click="Page(1)">首页</li>' +
			'<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()">< 上一页</li>' +
			//        '<li class="firstpage" style="padding:0 5px;white-space: nowrap;border-left:1px solid #e4e4e4;width: auto;" ng-click="changeCurrentPage(1)">第一页</li>'+
			'<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
			'ng-click="changeCurrentPage(item)">' +
			'<span>{{ item }}</span>' +
			'</li>' +
			'<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()">下一页 ></li>' +
			'<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="Page(conf.numberOfPages)">尾页</li>' +
			//        '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><i class="iconfont icon-youjiatou"></i></li>' +
			'</ul>' +
			'<span>共<b ng-bind="conf.numberOfPages"></b>页</span>' +
			'<span>到<input type="text" ng-model="pageCount" ng-blur="pageGo()"/>页</span>' +
			'</div>',
		replace: true,
		scope: {
			conf: '='
		},
		link: function(scope, element, attrs) {
			var conf = scope.conf;
			var defaultPagesLength = 15;
			var defaultPerPageOptions = [5, 10, 15, 20, 30, 50];
			var defaultPerPage = 5;
			if(conf.pagesLength) {
				// 判断一下分页长度
				conf.pagesLength = parseInt(conf.pagesLength, 10);
				if(!conf.pagesLength) {
					conf.pagesLength = defaultPagesLength;
				}
				// 分页长度必须为奇数，如果传偶数时，自动处理
				if(conf.pagesLength % 2 === 0) {
					conf.pagesLength += 1;
				}
			} else {
				conf.pagesLength = defaultPagesLength
			}
			// 分页选项可调整每页显示的条数
			if(!conf.perPageOptions) {
				conf.perPageOptions = defaultPagesLength;
			}
			// pageList数组
			function getPagination(newValue, oldValue) {
				// conf.currentPage
				if(conf.currentPage) {
					conf.currentPage = parseInt(scope.conf.currentPage, 10);
				}
				if(!conf.currentPage) {
					conf.currentPage = 1;
				}
				// conf.totalItems
				if(conf.totalItems) {
					conf.totalItems = parseInt(conf.totalItems, 10);
				}
				// conf.totalItems
				if(!conf.totalItems) {
					conf.totalItems = 0;
					return;
				}
				if(conf.itemsPerPage) {
					conf.itemsPerPage = parseInt(conf.itemsPerPage, 10);
				}
				if(!conf.itemsPerPage) {
					conf.itemsPerPage = defaultPerPage;
				}
				conf.numberOfPages = Math.ceil(conf.totalItems / conf.itemsPerPage);
				// 如果分页总数>0，并且当前页大于分页总数

				if(scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages) {
					scope.conf.currentPage = scope.conf.numberOfPages;
				}
				// 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
				var perPageOptionsLength = scope.conf.perPageOptions.length;
				// 定义状态
				var perPageOptionsStatus;
				for(var i = 0; i < perPageOptionsLength; i++) {
					if(conf.perPageOptions[i] == conf.itemsPerPage) {
						perPageOptionsStatus = true;
					}
				}
				// 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
				if(!perPageOptionsStatus) {
					conf.perPageOptions.push(conf.itemsPerPage);
				}
				// 对选项进行sort
				conf.perPageOptions.sort(function(a, b) {
					return a - b
				});
				// 页码相关
				scope.pageList = [];
				if(conf.numberOfPages <= conf.pagesLength) {
					// 判断总页数如果小于等于分页的长度，若小于则直接显示
					for(i = 1; i <= conf.numberOfPages; i++) {
						scope.pageList.push(i);
					}
				} else {
					// 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
					// 计算中心偏移量
					var offset = (conf.pagesLength - 1) / 2;
					if(conf.currentPage <= offset) {
						// 左边没有...
						for(i = 1; i <= offset + 1; i++) {
							scope.pageList.push(i);
						}
					} else if(conf.currentPage > conf.numberOfPages - offset) {
						for(i = offset + 1; i >= 1; i--) {
							scope.pageList.push(conf.numberOfPages - i);
						}
					} else {
						// 最后一种情况，两边都有...
						for(i = Math.ceil(offset / 2); i >= 1; i--) {
							scope.pageList.push(conf.currentPage - i);
						}
						scope.pageList.push(conf.currentPage);
						for(i = 1; i <= offset / 2; i++) {
							scope.pageList.push(conf.currentPage + i);
						}
					}
				}
				scope.$parent.conf = conf;
			};
			scope.Page = function(page) {
				conf.currentPage = page;
				getPagination();
				if(conf.onChange) {
					conf.onChange();
				};
			};
			scope.pageGo = function() {
				if(scope.pageCount < 1) {
					scope.pageCount = 1;
				};
				if(scope.pageCount > conf.numberOfPages) {
					scope.pageCount = conf.numberOfPages;
				};
				conf.currentPage = scope.pageCount;
				getPagination();
				if(conf.onChange) {
					conf.onChange();
				};

			};
			scope.prevPage = function() {
				if(conf.currentPage == 1) {
					return false;
				}
				if(conf.currentPage > 1) {
					conf.currentPage -= 1;
				}
				getPagination();
				if(conf.onChange) {
					conf.onChange();
				}
			};
			// nextPage
			scope.nextPage = function() {
				if(conf.currentPage == conf.numberOfPages) {
					return false;
				}
				if(conf.currentPage < conf.numberOfPages) {
					conf.currentPage += 1;
				}
				getPagination();
				if(conf.onChange) {
					conf.onChange();
				}
			};
			// 变更当前页
			scope.changeCurrentPage = function(item) {
				if(item == '...') {
					return;
				} else {
					if(conf.currentPage == item) {
						return;
					}
					conf.currentPage = item;
					getPagination();
					// conf.onChange()函数
					if(conf.onChange) {
						conf.onChange(item);
					}
				}
			};
			// 修改每页展示的条数
			scope.changeItemsPerPage = function() {
				// 一发展示条数变更，当前页将重置为1
				conf.currentPage = 1;
				getPagination();
				// conf.onChange()函数
				if(conf.onChange) {
					conf.onChange();
				}
			};
			// 跳转页
			scope.jumpToPage = function() {
				num = scope.jumpPageNum;
				if(num.match(/\d+/)) {
					num = parseInt(num, 10);
					if(num && num != conf.currentPage) {
						if(num > conf.numberOfPages) {
							num = conf.numberOfPages;
						}
						// 跳转
						conf.currentPage = num;
						getPagination();
						// conf.onChange()函数
						if(conf.onChange) {
							conf.onChange();
						}
						scope.jumpPageNum = '';
					}
				}
			};
			scope.jumpPageKeyUp = function(e) {
				var keycode = window.event ? e.keyCode : e.which;
				if(keycode == 13) {
					scope.jumpToPage();
				}
			}
			scope.$watch('conf.totalItems', function(value, oldValue) {
				// 在无值或值相等的时候，去执行onChange事件
				if(!value || value == oldValue) {
					if(conf.onChange) {
						// conf.onChange();
					}
				}
				getPagination();
			})
		}
	}
});

//日期组件
app.directive('zjyLaydate', function($timeout) {
	return {
		require: '?ngModel',
		restrict: 'ECA',
		scope: {
			ngModel: '=',
			maxDate: '@',
			minDate: '@'
		},
		link: function(scope, element, attr, ngModel) {
			var _date = null,
				_config = {};
			$timeout(function() {
				// 初始化参数
				_config = {
					elem: '#' + attr.id,
					format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
					max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
					min: attr.hasOwnProperty('minDate') ? attr.minDate : '',
					choose: function(data) {
						scope.$apply(setViewValue);

					},
					clear: function() {
						ngModel.$setViewValue(null);

					}
				};
				_date = laydate(_config);
				// 监听日期最大值
				if(attr.hasOwnProperty('maxDate')) {
					attr.$observe('maxDate', function(val) {
						_config.max = val;
					})
				}
				// 监听日期最小值
				if(attr.hasOwnProperty('minDate')) {
					attr.$observe('minDate', function(val) {
						_config.min = val;
					})
				}
				ngModel.$render = function() {
					element.val(ngModel.$viewValue || '');
				};

				element.on('blur keyup change', function() {
					scope.$apply(setViewValue);
				});
				setViewValue();

				function setViewValue() {
					var val = element.val();
					ngModel.$setViewValue(val);
				}
			}, 0);
		}
	};
});





function getKnowledgeIds(node) {
	var ids = node.id;
	if(node.level != 0) {
		console.log(ids);
		ids = getKnowledgeIds(node.getParentNode()) + "," + ids;
	}
	return ids;
}


//全国联动
app.directive("selectAddress", function($http, $timeout, scrollbar) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "./tpl/sharedTemplate/selectarea.html",
		link: function(scope, element) {
			scope.scrollbar = scrollbar.scroollAction;
			scope.county = "区县";
			scope.school = "学校";
			//定义所要渲染的数据
			scope.schoolData = "";
			//定义显示状态
			scope.directiveState = false;
			//定义没有数据时；
			scope.schoolempty= true;

			scope.revealstate = function() {
				var managerSearch = JSON.parse(sessionStorage.getItem('managerSearch'))
				var scopeValue = managerSearch.scope;
				if(scopeValue == 2) {
					areaCode = managerSearch.cityId
				} else if(scopeValue == 3) {
					areaCode = managerSearch.countyId
				} else if(scopeValue == 4) {
					areaCode = managerSearch.officeId
				}
				scope.directiveState = true;
				$http.post(jeucIp + 'eaArea/findChildByCode', {
					code: areaCode
				}).success(function(suc) {
					if(suc.ret == 200) {
						scope.countyData = suc.data;
					};
				});
			};

			document.body.addEventListener('click', function(e) {
				$timeout(function(e) {
					scope.directiveState = false;
				});

			}, false);
			var areaone = document.getElementsByClassName("areaone");
			for(var i = 0; i < areaone.length; i++) {
				areaone[i].addEventListener('click', function(e) {
					e.stopPropagation();
				}, false);
			};
			scope.$on('ngCFinished', function(ngRepeatFinishedEvent) {
				scope.scrollbar("zmj_county_mainbox", "zmj_county_contentbox", "draw");

			});
            scope.$on('ngSFinished', function(ngRepeatFinishedEvent) {
				scope.scrollbar("zmj_school_mainbox", "zmj_school_contentbox", "draw");

			});
			

			//监听数据变化来判断图片是否显示
			scope.$watch("schoolData", function() {
				if(scope.schoolData.length > 0) {
					scope.schoolempty = false;
				} else {
					scope.schoolempty = true;
					var main = document.getElementById("zmj_school_mainbox") ? document.getElementById("zmj_school_mainbox") : null;
					var scroll = main ? main.getElementsByClassName("scrollwrap") : null;
					scroll ? main.removeChild(scroll[0]) : null;
				};
			});

			/* 请求其他数据*/
			scope.set = {
				county: function(item) { //点击区县
					scope.county = item.name;
					$http.post(jeucIp + '/schoolInfo/findAllSchoolByarea', {
						areaId: item.id
					}).success(function(suc) {
						if(suc.status == 200) {
							scope.schoolData = suc.data; //学校数据
						};
					});
				},
				school: function(item) { //点击学校
					scope.school = item.name;															
					scope.schoolname = item.name;
				    scope.directiveState = false;
					console.log(item.id)//学校的id
					
				}

			};
			/*点击清空*/
			scope.clear = {
				county: function() {
					scope.county = "区县";
					scope.school = "学校";
					scope.schoolData = "";

				}
			};
		}

	}

});