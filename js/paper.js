/**
 * Created by Administrator on 2016/9/28.
 * 这是一个试卷模块
 */
angular.module("app.paperModule",['ng','app.subjectModule'])
    .controller("paperListController",["$scope",function ($scope) {

    }])
    .controller("paperAddController",["$scope","commenServer","paperStemServer","$routeParams",function ($scope,commenServer,paperStemServer,$routeParams) {
        //查询所有的方向数据绑定
        commenServer.getAllDepartment(function (data) {
            $scope.deparmentes = data;
        });
        //双向绑定对象
        console.log($routeParams);
        $scope.model=paperStemServer.model;
        var id = $routeParams.id;
        if(id!=0){
            paperStemServer.addSubjectId(id);
            paperStemServer.addSubjects(angular.copy($routeParams));
        }
    }])
    .factory("paperStemServer",function () {
        return {
            model:{
                dId:1,
                title:"",
                dcs:"",
                total:"",
                time:"",
                scores:[],
                subjectIds:[],
                subjects:[]
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubjects:function (subject) {
                this.model.subjects.push(subject);
            },
            addScore:function (index,score) {
                this.model.scores[index] = score;
            }
        }
    });