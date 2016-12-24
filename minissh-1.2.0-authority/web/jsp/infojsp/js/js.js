var modalToggle = function (obj) {
    var whichModal = $(obj).text();
    if(whichModal.indexOf("系统消息") !=- 1){
        alert("no message");
    }else if(whichModal.indexOf("编辑") !=- 1){
        $("#modalid-editInfo").modal("toggle");
    }else if(whichModal.indexOf("注销") !=- 1){
        $("#modalid-offconf").modal("toggle");
    }
};
var offFunction = function(){
    window.location.href = "/login.html";
};

//angularModuleStart
angular.module("mainapp",[])
    .controller("maincontroller",function($scope){
        $scope.currentPage = 0;
        $scope.totalPage = 0;
        $scope.prevPage = "上一页";
        $scope.nextPage = "下一页";
        $scope.homePage = "首页";
        $scope.userManage = "用户管理";
        $scope.fileManage = "文件管理";

        $scope.rightDiv = function (obj) {
            if(obj == "首页"){
                $("#divid-homepage").show();
                $("#divid-usermanage").hide();
                $("#divid-filemanage").hide();
                $("#liid-homepage").attr("class","active");
                $("#liid-usermanage").removeClass("active");
                $("#liid-filemanage").removeClass("active");
            }else if(obj == "用户管理"){
                $("#divid-homepage").hide();
                $("#divid-usermanage").show();
                $("#divid-filemanage").hide();
                $("#liid-homepage").removeClass("active");
                $("#liid-usermanage").attr("class","active");
                $("#liid-filemanage").removeClass("active");

                $scope.getUserPageList();
            }else if(obj == "文件管理"){
                $("#divid-homepage").hide();
                $("#divid-usermanage").hide();
                $("#divid-filemanage").show();
                $("#liid-homepage").removeClass("active");
                $("#liid-usermanage").removeClass("active");
                $("#liid-filemanage").attr("class","active");
            }
        };
        $scope.deleteOne = function(obj){
            $.ajax({
                type:"POST",
                url:"/login/delete",
                data:{"id":obj.id},
                contentType:"application/x-www-form-urlencoded",
                dataType:"json",
                success:function(data){
                    //console.log(data);
                    $scope.getUserPageList();
                }
            });
        };
        $scope.getUserPageList = function(){
            if($scope.currentPage == 0){
                this.currentPage = 1;
            }else{
                this.currentPage = $scope.currentPage;
            }
            $.ajax({
                type:"POST",
                url:"/login/getUserPageList",
                data:{"currentPage":this.currentPage,"pageSize":5},
                contentType:"application/x-www-form-urlencoded",
                dataType:"json",
                success:function(data){
                    console.log(data);
                    /**16-11-5 16:05
                     * angularjs  必须在$scope上下文中刷新数据才能更新视图
                     * 要用$scope.$apply(function(){
				 *	//更新数据
				 *	})
                     * 用$http服务的ajax获取可以直接修改数据，因为这个服务是在$scope上下文中的，但是jquery方法不是
                     */
                    $scope.$apply(function(){
                        $scope.userList = new Array();
                        var obj = {};
                        for(var temp in data.page.list){
                            obj['id'] = data.page.list[temp].id;
                            obj['username'] = data.page.list[temp].username;
                            obj['email'] = data.page.list[temp].email;
                            obj['tel'] = data.page.list[temp].tel;
                            var datestr = new Date(parseInt(data.page.list[temp].createTime));
                            var temstr = datestr.getFullYear() + "年" + (parseInt(datestr.getMonth())+1) + "月" + datestr.getDate() + "日"
                            //+ datestr.getHours() + ":" + datestr.getMinutes() + ":" + datestr.getSeconds()
                                ;
                            obj['createTime'] = temstr;	//创建时间
                            $scope.userList.push(obj);obj = {};
                        }
                        //分页相关更新
                        $scope.currentPage = data.page.current;
                        $scope.totalPage = data.page.total;
                        if($scope.currentPage == 1){
                            $("#btnid-prevpage").attr("disabled","disabled");
                        }else{
                            $("#btnid-prevpage").removeAttr("disabled");
                        }
                        if($scope.currentPage == $scope.totalPage){
                            $("#btnid-nextpage").attr("disabled","disabled");
                        }else{
                            $("#btnid-nextpage").removeAttr("disabled");
                        }
                    });
                }
            });
        };
        $scope.makePagingList = function(obj){
            if(obj=="上一页"){
                if($scope.currentPage == 0){
                    //nothing to do
                }else if($scope.currentPage == 1){
                    alert("当前已经是第一页！");//其实并不会发生，因为disabled
                }else{
                    $scope.currentPage = $scope.currentPage - 1;
                    $scope.getUserPageList();
                }
            }else if(obj=="下一页"){
                if($scope.currentPage == 0){
                    //nothing to do
                }else if($scope.currentPage == $scope.totalPage){
                    alert("当前已经是最后一页！");//其实并不会发生，因为disabled
                }else{
                    $scope.currentPage = $scope.currentPage + 1;
                    $scope.getUserPageList();
                }
            }
        };
    })//main controller end
