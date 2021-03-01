(function(document,layui){
    //此js文件至少需要使用layui.table与layui.laypage两个layui插件
    if(layui.table == undefined || layui.laypage == undefined){ return; }

    let pageElement;
    let layuiPagenation = layui.laypage;
    let layuiTable = layui.table;

    //请求表格数据信息
    let listReqdata = {
        // reqPage:{ key:'page',value:1 },
        // reqSize:{ key:'size',value:10 },
        // reqOther:[{ key:'SortOrder',value:'desc'}]
    }
    //请求表格数据信息的url
    let listRequrl = 'http://newapi.hccszl.com:8062/chinadistrict/list'

    //行工具栏点击事件
    let rowToolCallback;
    //头工具栏点击事件
    let headToolCallback;

    let defaultOption = {

        maxCountExistInHeader:true,
        tableRowClick:true,
        tableRowCtrl:true,
        tableToolsbar:true,
        tableColState:[
            {checkbox:true},
            {field: 'id', title: 'ID'},
            {field: 'extname',title:'名称'},
        ]
    }

    //配置默认选项
    function loadDefaultOption(option){
        defaultOption = option;
        if(defaultOption.listReqdata != undefined){ listReqdata = defaultOption.listReqdata };
        if(defaultOption.listRequrl != undefined){ listRequrl = defaultOption.listRequrl };
        if(defaultOption.rowToolCallback != undefined){ rowToolCallback = defaultOption.rowToolCallback };
        if(defaultOption.headToolCallback != undefined){ headToolCallback = defaultOption.headToolCallback };
        if(defaultOption.tableColState == undefined){ layuiLog('请传入表格列参数') };
        if(defaultOption.tableRowCtrl != undefined && defaultOption.tableRowCtrl == false){
            defaultOption.tableColState.pop();
        }
        if(defaultOption.tableToolsbar != undefined && defaultOption.tableToolsbar == false){
            defaultOption.tableToolsbarTop = false
        }
    }


    //输出控制台日志
    function layuiLog(msg){
        console.log('autoLayuiTable-Say: '+msg);
    }
    //加载表格模板
    function loadTableModule(nameArray,modulesArray){

        for(let i=0;i<nameArray.length;i++){
            drawChildElement(pageElement,[
                { tag:'script',type:'text/html',id:nameArray[i]}
            ])
            drawModulesElement(document.getElementById(nameArray[i]),modulesArray[i])
        }
    }

    //向element元素中添加TextNode节点元素
    function drawModulesElement(element,optionArray){
        for(let i=0;i<optionArray.length;i++){
            let tempDiv = document.createElement('div');
            if(optionArray[i].tag == undefined){ continue; };
            let newElement = document.createElement(optionArray[i].tag);
            let array = Object.keys(optionArray[i]);
            for(let j=0;j<array.length;j++){
                if(array[j] == 'tag'){ continue; }
                if(array[j] == 'htmlText'){
                    let textHtml = document.createTextNode(Object.values(optionArray[i])[j]);
                    newElement.appendChild(textHtml);
                    continue;
                };
                if(array[j] == 'class'){
                    newElement.className = Object.values(optionArray[i])[j];
                    continue;
                }
                newElement.setAttribute([array[j]],Object.values(optionArray[i])[j]);
            }
            if(optionArray[i].style != undefined){
                for(let j=0;j<Object.keys(optionArray[i].style).length;j++){
                    newElement.style[Object.keys(optionArray[i].style)[j]] = Object.values(optionArray[i].style)[j];
                }
            }
            tempDiv.appendChild(newElement);
            element.appendChild(document.createTextNode(newElement.parentElement.innerHTML));
        }
        
    }

    /**
     * pc端表格页自动生成
     */
    function layuitable(elementID,option,callback){
        //配置页面基础布局.开始
        pageElement = document.querySelector("#"+elementID);
        pageElement.style.height = "100%";
        pageElement.style.width = "100%";
        pageElement.className = 'layui-layout layui-layout-admin';
        let elementOptionArray = [
            {
                id:'layui-search-wrap',
                tag:'div',
                class:'layui-search',
                style:{},
            },{
                id:'layui-table-wrap',
                tag:'div',
                class:'layui-body',
                style:{
                    width: "100%",
                    left:'0',
                    top:'0',
                    bottom:'0',
                    'z-index':'0',
                    position: "inherit",
                    padding:"0 15px",
                    'padding-top':'0px'
                }
            },{
                id:'auto-layui-pagenation',
                tag:'div',
                class:'layui-footer',
                style:{
                    left:'0',
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "flex-end",
                    "background-color":"#fff",
                    "white-space":"nowrap"
                }
            }
        ]
        if(layui.device().mobile == true){
            elementOptionArray[1].style.padding = '0 5px';
            elementOptionArray[2].style.padding = '0 5px';
        }
        drawChildElement(pageElement,elementOptionArray);
        // createLayuiSearch();
        drawChildElement(document.getElementById('layui-table-wrap'),[{
            tag:'table',
            id:'auto-layui-table',
            filter:'auto-layui-table'
        }])
        //配置页面基础布局.结束
        //加载默认配置
        loadDefaultOption(option);
        //加载表格模板
        if(option.module != undefined){
            loadTableModule(option.module.name,option.module.elementArray);
        }
        if(option.updataReqdata != undefined){
            updataReqdata = option.updataReqdata;
        }
        if(option.updataTable != undefined){
            updataTable = option.updataTable
        }
        //加载表格数据
        getLayuiTableList(function(){
            if(defaultOption.tableRowClick == true){
                //表格操作按钮开启时,行内点击事件不可开启
                if(defaultOption.tableRowCtrl != true){ 
                    //添加表格行点击事件--待添加功能
                    // layuiTable.on('row(auto-layui-table)', function(obj){
                    //     let rowElement = document.querySelector(obj.tr.selector);
                    //     let boxElement = rowElement.getElementsByClassName('layui-form-checkbox')[0];
                    //     boxElement.click();//未阻止冒泡,待优化
                    // });
                }
            }
            if(defaultOption.tableRowCtrl == true){
                //监听表格行操作按钮组点击事件
                layuiTable.on('tool(auto-layui-table)',function(obj){
                    // console.log(obj);
                    rowToolCallback(obj.event,obj.data)
                });
            }
            if(defaultOption.tableToolsbar == true){
                //监听表格头部操作按钮组点击事件
                layuiTable.on('toolbar(auto-layui-table)',function(obj){
                    //console.log(obj);
                    headToolCallback(obj.event,obj.data)
                });
                // function(obj){
                //     var checkStatus = layuiTable.checkStatus(obj.config.id);
                //     // console.log(checkStatus);//checkbox已勾选的行
                //     console.log(obj);
                // }
            }
        });
        if(typeof callback == "function"){
            callback(getLayuiTableList);
        }
        if(option.listResponse != undefined){
            listResponse = option.listResponse;
        }
    }
    
    //创建搜索区元素
    function createLayuiSearch(elementID){
        let searchElement = document.getElementById(elementID);
        searchElement.style.display = "flex";
        searchElement.style.padding = "10px 10px";
        searchElement.style.paddingBottom = "0";
        searchElement.style.boxSizing = "border-box";
        let searchElementArray = [
            {
                tag:'input',
                class:'layui-input',
                style:{
                    width:"200px",
                    "margin-right":"10px"
                }
            },{
                tag:'button',
                class:'layui-btn'
            }
        ]
        drawChildElement(searchElement,searchElementArray)
    }

    /**
     * 向element元素中添加子元素,配置项为optionArray
     * @param {Object} element 父元素
     * @param {Array} optionArray 子元素配置项,其中tag必传,否则跳过渲染
     */
    function drawChildElement(element,optionArray){
        for(let i=0;i<optionArray.length;i++){
            if(optionArray[i].tag == undefined){ continue; };
            let newElement = document.createElement(optionArray[i].tag);
            if(optionArray[i].id != undefined){
                newElement.id = optionArray[i].id;
            }
            if(optionArray[i].class != undefined){
                newElement.className = optionArray[i].class;
            }
            if(optionArray[i].style != undefined){
                for(let j=0;j<Object.keys(optionArray[i].style).length;j++){
                    newElement.style[Object.keys(optionArray[i].style)[j]] = Object.values(optionArray[i].style)[j];
                }
            }
            if(optionArray[i].filter == 'auto-layui-table'){
                newElement.setAttribute('lay-filter','auto-layui-table')
            }
            if(optionArray[i].type != undefined){
                newElement.type = optionArray[i].type;
            }
            element.appendChild(newElement);
        }
    }

    //刷新分页控件-重载
    function refreshPagenation(count){
        let layout = ['count','limit','skip','prev','page','next']
        if(layui.device().mobile == true){
            layout = ['count','skip']
        }
        layuiPagenation.render({
          elem: 'auto-layui-pagenation'
          ,count: count //数据总数，从服务端得到
          ,limit: listReqdata.reqSize.value
          ,limits:[10,20,50,100]
          ,curr: listReqdata.reqPage.value
          ,layout:layout
          ,jump:function(obj,first){
                listReqdata.reqPage.value = obj.curr;
                if(listReqdata.reqSize.value != obj.limit){
                    listReqdata.reqSize.value = obj.limit;
                    listReqdata.reqPage.value = 1;
                    getLayuiTableList();
                    return;
                }
                //首次不执行
                if(!first){
                    getLayuiTableList();
                }
                //解决limits的下拉框位置不正确的问题
                pageElement.getElementsByClassName('layui-box')[0].style.display = "flex";
          }
        });
        //解决limits的下拉框位置不正确的问题
        pageElement.getElementsByClassName('layui-box')[0].style.display = "flex";
    }
    
    let updataTable;
    //刷新表格控件-重载
    function refreshTable(list){
        if(typeof updataTable == "function"){
            defaultOption = updataTable(defaultOption);
        }
        let defaultToolbar = ['filter','exports','print'];
        let defaultHeight = 'full-60';
        if(layui.device().mobile == true){
            defaultToolbar = ['filter','exports'];
            defaultHeight = 'full-120';
        }
        layuiTable.render({
            elem: '#auto-layui-table'
            ,data:list
            // ,skin:'line'
            ,height:defaultHeight
            ,toolbar:defaultOption.tableToolsbarTop
            ,defaultToolbar: defaultToolbar
            ,limit:listReqdata.reqSize.value
            // ,toolbar:true
            ,cols: [defaultOption.tableColState]
        });
    }

    let listResponse;
    let updataReqdata;//更新list请求数据
    //获取表格数据
    function getLayuiTableList(callback){
        if(typeof updataReqdata == 'function'){
            listReqdata = updataReqdata(listReqdata,'data');
            listRequrl = updataReqdata(listRequrl,'url');
        }
        let reqdata = {}
        reqdata[listReqdata.reqPage.key] = listReqdata.reqPage.value;
        reqdata[listReqdata.reqSize.key] = listReqdata.reqSize.value;
        if(listReqdata.reqOther.length != 0){
            let array = listReqdata.reqOther;
            for(let i=0;i<array.length;i++){
                reqdata[listReqdata.reqOther[i].key] = listReqdata.reqOther[i].value;
            }
        }
        let dataType = {
            json:true
        }
        if(listReqdata.reqDataType == 'formData'){
            dataType = {
                formData:true
            }
        }
        xhrPost(reqdata,listRequrl,function(res,xhr){
            res = JSON.parse(res);
            //maxCount: "3"
            res.maxCount = parseInt(res.data.maxCount);
            if(defaultOption.maxCountExistInHeader == true){
                res.maxCount = parseInt(xhr.getResponseHeader('totalCount'));
            }
            if(typeof listResponse == "function"){
                listResponse(res,xhr,function(res,xhr){
                    refreshTable(res.data.list);
                    refreshPagenation(res.maxCount);
                    if(typeof callback == "function"){
                        callback();
                    }
                });
                return;
            }
            refreshTable(res.data.list);
            refreshPagenation(res.maxCount);
            if(typeof callback == "function"){
                callback();
            }
        },dataType)
    }

    //简单post请求
    function xhrPost(data,url,callback,option){
        let xhr = new XMLHttpRequest();
        xhr.open("post",url);
        if(option != undefined){
          if(option.json == true){
            xhr.setRequestHeader('content-type','application/json');
            data = JSON.stringify(data);
          }
          if(option.formData == true){
            xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            data = xhrFormData(data);
          }
        }
        xhr.onload = function(){
          callback(this.response,this);
        }
        xhr.send(data);
    }
    //xhr中请求头为application/x-www-form-urlencoded时,data需要转换
    function xhrFormData(data){
        let formatterData = "";
        for(let i=0;i<Object.keys(data).length;i++){
          formatterData += Object.keys(data)[i];
          formatterData += "=" + Object.values(data)[i] + "&";
        }
        return formatterData;
    }
    
    if(typeof module != 'undefined' && module.exports){
        module.exports = layuitable;
    }else{
        window.layuiTbaleGenerate = layuitable;
    }
})(document,layui)