/**
 * Created by Administrator on 2016/9/22.
 * 题库模块
 */

angular.module("app.subjectModule",['ng'])
    .controller("delCtr",["subjectServer","$location","$routeParams",function (subjectServer,$location,$routeParams) {
        //删除事件
            var flag = confirm("确定删除吗?");
            if(flag){
                subjectServer.deleteSubject( $routeParams.id,function (data) {
                    alert(data);
                });
            }
            $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("checkCtr",["subjectServer","$location","$routeParams",function (subjectServer,$location,$routeParams) {
        //审核功能
        console.log($routeParams);
        subjectServer.checkSubject( $routeParams.id,$routeParams.state,function (data) {
            alert(data);
        });
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("subjectCtr",["$scope","commenServer","$location","subjectServer","$filter","$routeParams",function ($scope,commenServer,$location,subjectServer,$filter,$routeParams) {
        console.log($routeParams);
        $scope.params=$routeParams;


        //封装复用条件查询函数
        var subjectModel =(function () {
            var obj = {};
            if($routeParams.typeId!=0){
                obj['subject.subjectType.id'] = $routeParams.typeId;
            }
            if($routeParams.dpId!=0){
                obj['subject.department.id'] = $routeParams.dpId;
            }
            if($routeParams.topicId!=0){
                obj['subject.topic.id'] = $routeParams.topicId;
            }
            if($routeParams.levelId!=0){
                obj['subject.subjectLevel.id'] = $routeParams.levelId;
            }
            console.log("参数对象",obj);
            return obj;
        })();
        //给添加页面绑定数据
        $scope.subject={
            departmentId:1,
            topicId:1,
            typeId:1,
            levelId:1,
            stem:"",
            answer:"",
            analysis:"",

            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };

        commenServer.getAllType(function (data) {
            $scope.types = data;
        });
        commenServer.getAllLevel(function (data) {
            $scope.levels = data;
        });
        commenServer.getAllDepartment(function (data) {
            $scope.departments = data;
        });
        commenServer.getAllTopic(function (data) {
            $scope.topics = data;
        });
        $scope.addSubject=function () {
            $location.path("/addSubject");
        };


        //subjectServer
        subjectServer.getAllSubjects(subjectModel,function (data) {
            //遍历所有的题目，计算出选择题的答案，并且将答案赋给subject.answer
            data.forEach(function (subject) {
                //获取正确答案
                if(subject.subjectType && subject.subjectType.id != 3){
                    var answer = [];
                    subject.choices.forEach(function (choice,index) {
                        if(choice.correct){
                            //将索引转换为A/B/C/D
                            var no = $filter('indexToNo')(index);
                            answer.push(no);
                        }
                    });
                    //将计算出来的正确答案赋给subject.answer
                    subject.answer = answer.toString();
            }

            });
            $scope.subjects = data;
        });
        //保存并继续事件
        $scope.saveAndCon = function () {
            subjectServer.saveSubjects($scope.subject,function (data) {
                alert(data);
            });
            var subject={
                departmentId:1,
                topicId:1,
                typeId:1,
                levelId:1,
                stem:"",
                answer:"",
                analysis:"",

                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            $scope.subject=subject;
        };
        //保存并返回事件
        $scope.saveAndClose = function () {
            subjectServer.saveSubjects($scope.subject,function (data) {
                alert(data);
            });
            $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
        };

    }])
    //封装操作题目的函数
    .service("subjectServer",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {

        this.deleteSubject = function (id ,handler) {
            var obj = {
                'subject.id': id
            };
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/delSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                handler(data);
            });
        };
        this.checkSubject = function (id ,state,handler) {
            var obj = {
                'subject.id': id,
                'subject.checkState':state
            };
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                handler(data);
            });
        };

        this.getAllSubjects=function (params,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action").success(function (data) {
           //$http.get("data/subjects.json",{
                params:params
            }).success(function (data) {
                handler(data);
            });
        };
        this.saveSubjects = function (subject,handler) {
            var obj = {};
            for(var key in subject){
                var val = subject[key];
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id']=val;
                        break;
                    case "department":
                        obj['subject.department.id']=val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id']=val;
                        break;
                    case "topicId":
                        obj['subject.topic.id']=val;
                        break;
                    case "stem":
                        obj['subject.stem']=val;
                        break;
                    case "answer":
                        obj['subject.answer']=val;
                        break;
                    case "analysis":
                        obj['subject.analysis']=val;
                        break;
                    case "choiceContent":
                        obj['choiceContent']=val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect']=val;
                        break;
                }
            }
            //将json格式的数据转换为表单格式的数据
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",
                obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                handler(data);
            });
        }


    }])
    //加载数据的服务
    .factory("commenServer",["$http",function ($http) {
        return {
            getAllType:function (handler) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                $http.get("data/types.json").success(function (data) {
                    handler(data);
                })
            },
            getAllLevel:function (handler) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
               $http.get("data/levels.json").success(function (data) {
                    handler(data);
                })
            },
            getAllDepartment:function (handler) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                $http.get("data/department.json").success(function (data) {
                    handler(data);
                })
            },
            getAllTopic:function (handler) {
                $http.get("data/topic.json").success(function (data) {
                    handler(data);
                })
            }
        };
    }])
    .filter("selectTopic",function () {
        return function (input,id) {
            if(input){
                return input.filter(function (item,index) {
                    return item.department.id==id;
                });
            }
        }
    })
    .filter("indexToNo",function () {
        return function (input) {
            var result ;
            switch (input){
                case 0:
                    result = 'A';
                    break;
                case 1:
                    result = 'B';
                    break;
                case 2:
                    result = 'C';
                    break;
                case 3:
                    result = 'D';
                    break;
                case 4:
                    result = 'E';
                    break;
                default:
                    result = 'F';
            }
            return result;
        }
    })
    .directive("pleaseChoice",function () {
        return {
            restrict:"A",
            link:function (scope,element) {
                //console.log(scope);//作用域
                //console.log(element);//当前操作的DOM对象
                element.on("change",function () {
                    var type = $(this).attr("type");
                    var ischecked = $(this).prop("checked");
                    if(type=="radio"){
                        scope.subject.choiceCorrect=[false,false,false,false];
                        var index = $(this).val();
                        scope.subject.choiceCorrect[index]=true;
                    }else if(type=="checkbox" && ischecked){
                        var index = $(this).val();
                        scope.subject.choiceCorrect[index]=true;
                    }
                    //console.log(scope.subject.choiceCorrect);//只会导致当前作用域的值改变，不会改变控制器中作用域的值
                    //强制将scope更新
                   scope.$digest();
                })

            }
        }
    });



