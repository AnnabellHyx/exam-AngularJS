/**
 * Created by Administrator on 2016/9/22.
 * 这是项目的核心js
 */
//左侧导航动画
$(function(){
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown();
    });
    $(".baseUI>li>a").eq(0).trigger("click");
    //背景色改变
    $(".baseUI ul>li").off("click");
    $(".baseUI ul>li").on("click",function () {
        if(!$(this).hasClass("current")){
            $(".baseUI ul>li").removeClass("current");
            $(this).addClass("current");
        }
    });
    $(".baseUI ul>li").eq(0).find("a").trigger("click");
});
//路由
angular.module("app",['ng','ngRoute','app.subjectModule','app.paperModule'])
    .controller("mainCtr",["$scope",function ($scope) {

    }])
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/SubjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCtr"
        }).when("/subjectMeger",{
            templateUrl:"tpl/subject/subjectMeger.html",
            controller:"subjectCtr"
        }).when("/addSubject",{
            templateUrl:"tpl/subject/addSubject.html",
            controller:"subjectCtr"
        }).when("/delSubject/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"delCtr"
        }).when("/checkSubject/id/:id/checkState/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"checkCtr"
        }).when("/paperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/paperAddStem",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectCtr"
        }).when("/addSubjectStem/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        });
    }]);