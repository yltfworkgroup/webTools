/**
 * 创建时间:2021-02-04
 * 作者:XueLiang.Zhai
 * 更新时间:2021-04-10 v0.1.1
 */
(function (window, document, Math) {

    /**
     * 在DOM准备就绪后,执行callback
     */
    function $ready(callback){
        window.addEventListener('load',function(){
            if(typeof callback == "function"){
                callback();
            }
        })
    }

    /**
     * 在浏览器窗口变化后,执行callback
     */
    function $resize(callback){
        window.addEventListener('resize',function(){
            if(typeof callback == "function"){
                callback();
            }
        })
    }

    /**
     * 获取指定的cookie值
     * @param {string} str 要查询的Cookie字段名
     */
    function getCookie(str){
        let arr = document.cookie.split("; ");
        let cookieValue = "undefined";
        for(let i=0;i<arr.length;i++){
            let arr2 = arr[i].split("=");
            if(str == arr2[0]){
                cookieValue = arr2[1];
            }
        }
        return cookieValue;
    }

    /**
     * 删除指定的cookie值
     * @param {string} str 要删除的Cookie字段名
     */
    function removeCookie(str){
        let date = new Date();
        date.setTime(date.getTime() - 1);
        document.cookie = str + "=''" + "; expires=" + date.toUTCString();
    }

    /**
     * 按指定字段对非基础类型数组进行排序,指定字段的类型必须是int
     * @param {Array} arr 要排序的数组
     * @param {String} attr 指定的字段名
     * @param {Boolean} asc 是否升序,默认升序排列 
     */
    function arraySort(arr,attr,asc) {
        if(!arr){ arr=[]; }
        if(!attr){ attr=""; };
        if(asc==undefined){ asc=true; };
        if (arr.length <= 1) { return arr; }
        if (arr[0][attr] == undefined) {
          console.log("arraySort() Error->>"+attr + " is undefined!");
          return arr;
        }
        return arr.sort(function(a, b){
          if (asc) { return a[attr] - b[attr]; } //升序
          else { return b[attr] - a[attr]; } //降序
        });
    }

    /**
     * 获取计算后的时间
     * @param {number} count 0-返回当前时间,正数增加天数,负数减小天数
     * @param {object} options 配置项:defaultDate-设置默认时间 isFormatter-是否格式化日期(返回字符串) hasTime-格式化后的字符串是否带有时间
     */
    function getDate(count,options){
        if(!count){ count=0; }
        if(!options){ options={}; }
        if(!options.defaultDate){ defaultDate=new Date(); }
        console.log(typeof options.isFormatter != "Boolean");
        if(options.isFormatter==undefined&&typeof options.isFormatter != "Boolean"){ options.isFormatter = true; }
        let currentTime = new Date(options.defaultDate).getTime();
        let result = new Date(currentTime + (1000*60*60*24*count));
        if(isFormatter==false){ return result; }
        let formatter = "";
        let year=result.getFullYear(),month=result.getMonth()+1,day=result.getDate();
        let hours=result.getHours(),minute=result.getMinutes(),second=result.getSeconds();
        if(month<10){ month = "0" + month; }
        if(day  <10){ day = "0" + day; }
        formatter += year + "-" + month + "-" + day;
        if(options.hasTime==true){
            if(hours<10){ hours = "0" + hours; }
            if(minute<10){ minute = "0" + minute; }
            if(second<10){ second = "0" + second; }
            formatter += " " + hours + ":" + minute + ":" + second;
        }
        return formatter;
    }

    /**
     * 获取start-end时间段内一共有多少天
     * @param {string} startDate 开始时间 2021-04-10或可以转换为日期的其他格式
     * @param {string} endDate 结束时间 2021-04-10或可以转换为日期的其他格式
     */
    function getCountDay(startDate,endDate){
        let msecond1 = new Date(startDate).getTime();
        let msecond2 = new Date(endDate).getTime();
        return (msecond1 - msecond2) / (1000 * 60 * 60 * 24);
    }

    /**
     * 格式化日期字符串
     * @param {string} 日期字符串 2021-04-10或可以转换为日期的其他格式
     * @param {object} 配置项:hasTime-是否带有时间 datelabel-日期分隔符 timelabel-时间分隔符 separator-日期与时间的分隔符
     */
    function dateFormatter(date,options){
        if(!options){ options = {}; }
        if(options.hasTime==undefined){ options.hasTime=false; }
        if(!options.datelabel){ options.datelabel="-"; }
        if(!options.timelabel){ options.timelabel=":"; }
        if(!options.separator){ options.separator=" "; }
        let d = new Date(date);
        let year=d.getFullYear(),month=d.getMonth()+1,day=d.getDate();
        let hours=d.getHours(),minute=d.getMinutes(),second=d.getSeconds();
        let formatter = "";
        formatter += year + options.datelabel + month + options.datelabel + day;
        if(options.hasTime==true){
            formatter += options.separator + hours + options.timelabel + minute + options.timelabel + second;
        }else if(options.hasTimeUnit){
            formatter += options.separator + hours + "时" + minute + "分" + second + "秒";
        }
        return formatter;
    }

    /**
     * 简单加载框
     */
    function EasyLoading(options){
        this.element = {
            mask:"",
            view:"",
            icon:"",
            text:"",
            style:""
        };

        EasyLoading.prototype.init = function(){
            let mask,view,icon,text,style;
            style = document.createElement('style');
            mask = document.createElement('div');
            view = document.createElement('div');
            icon = document.createElement('div');
            text = document.createElement('span');
            mask.classList.add('e-load-mask');
            view.classList.add('e-load-view');
            icon.classList.add('e-load-icon');
            text.classList.add('e-load-text');
            view.appendChild(icon);
            view.appendChild(text);
            mask.appendChild(view);
            document.body.appendChild(mask);
        }

        EasyLoading.prototype.show = function(){
            this.element.mask.classList.add('e-mask-show');
        }
        
        EasyLoading.prototype.hide = function(){
            this.element.mask.classList.add('e-mask-hide');
        }

        this.init();
    }

    /**
     * 简单ajax请求-无request方法
     */
    function EasyXhrRequest(){
        this.pool = [];

        let formatterdata = function(data){
            let fd = "";
            for(let i=0;i<Object.keys(data).length;i++){
                fd += Object.keys(data)[i];
                fd += "=" + Object.values(data)[i] + "&";
            }
            fd = fd.substring(0,fd.length-1);
            return fd;
        }
        //获取当前xhr实例
        EasyXhrRequest.prototype.getInstance = function(){
            for(let i=0;i<this.pool.length;i++){
                if(this.pool[i].readyState==0||this.pool[i].readyState==4){
                    return this.pool[i];
                }
            }
            let newXhr = new XMLHttpRequest();
            this.pool.push(newXhr);
            return newXhr;
        }
        //配置当前xhr参数
        EasyXhrRequest.prototype.setOptions = function(xhr,data,options){
            let reqdata = "";
            if(!options){ reqdata = data; }
            if(options.dataType=="json"){
                xhr.setRequestHeader("content-type","application/json");
                reqdata = JSON.stringify(data);
            }else if(options.dataType=="formdata"){
                xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
                reqdata = formatterdata(data);
            }
            return reqdata;
        }
        //发送post请求
        EasyXhrRequest.prototype.post = function(data,url,callback,options){
            let freexhr = this.getInstance();
            freexhr.open('post',url);
            if(typeof callback == "function"){
                freexhr.onload = function(){
                    callback(JSON.parse(this.response));
                }
                freexhr.onerror = function(){
                    callback(this);
                }
            }
            let reqdata = this.setOptions(freexhr,data,options);
            freexhr.send(reqdata);
        }
        //发送get请求
        EasyXhrRequest.prototype.get = function(data,url,callback,options){
            let freexhr = this.getInstance();
            url += "?" + formatterdata(data);
            freexhr.open('get',url);
            if(typeof callback == "function"){
                freexhr.onload = function(){
                    callback(JSON.parse(this.response));
                }
                freexhr.onerror = function(){
                    callback(this);
                }
            }
            freexhr.send(null);
        }
    }

    /**
     * 绘画元素
     * @param {*} elem 要添加内容的元素,ID或者Dom对象
     * @param {*} array 内容数组
     * @param {*} htmlFun 单个块元素的html回调,要求返回String
     */
    function drawElement(elem,array,htmlFun,append){
        let element = (typeof elem=='string'&&elem.indexOf("#")!=-1)?document.querySelector(elem):elem;
        let html = "";
        array.forEach(function(item,index){
            if(typeof htmlFun == "function"){
                html += htmlFun(item,index);
            }
        });
        if(append!=undefined&&append==true){
            element.innerHTML += html;
        }else{
            element.innerHTML  = html;
        }
    }

    /**
     * 将elementIDArray中的元素的display设置为view
     */
    function showElement(elementIDArray,view){
        if(view == undefined){ view = "block" }
        for(let i=0;i<elementIDArray.length;i++){
          document.querySelector("#"+elementIDArray[i]).style.display = view;
        }
    }

    /**
     * 将elementIDArray中的元素的display设置为none
     */
    function hiddenElement(elementIDArray){
        for(let i=0;i<elementIDArray.length;i++){
          document.querySelector("#"+elementIDArray[i]).style.display = "none";
        }
    }

    /**
     * 给element元素添加class
     */
    function addClass(elem,className){
        let element = (typeof elem=='string')?document.querySelector('#'+elem):elem;
        element.classList.add(className);
    }

    /**
     * 移除element元素的class
     */
    function removeClass(elem,className){
        let element = (typeof elem=='string')?document.querySelector('#'+elem):elem;
        element.classList.remove(className);
    }

    /**
     * 获取地址栏的参数
     */
    function  getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        //if (r != null) return unescape(r[2]);//unescape已被弃用
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    /**
     * 简单深拷贝
     */
    function deepCopy(object){
        return JSON.parse(JSON.stringify(object));
    }

    const tools = {
        $ready,
        $resize,
        getCookie,
        removeCookie,
        arraySort,
        getDate,
        getCountDay,
        dateFormatter,
        drawElement,
        showElement,
        hiddenElement,
        addClass,
        removeClass,
        getUrlParam,
        deepCopy,

        EasyLoading,
        EasyXhrRequest
    }
    
    if (typeof module != 'undefined' && module.exports) {
        module.exports = tools;
    } else {
        window.tools = tools;
    }
})(window, document, Math);