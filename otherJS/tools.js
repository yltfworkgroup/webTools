/**
 * 创建时间:2021-02-04
 * 作者:XueLiang.Zhai
 */
(function (window, document, Math) {

    /** loading全局变量 */
    let loadingbox = {
        init:false,
        mask:"",
        box:"",
        title:""
    }
    /**
     * 避免覆盖现有的window.onload的方法
     * @param {any} callback 回调函数,在window.onload执行后执行此函数
     * @author XueLiang.Zhai
     * @text 参考文章:https://www.cnblogs.com/jackson-yqj/p/5949060.html
     * @date 2021-01-24
     */
    function $ready(callback) {
        let oldOnload = window.onload;
        //console.log(oldOnload)
        if (typeof oldOnload != "function") {
            //console.log("newOnload")
            window.onload = callback;
        } else {
            window.onload = function () {
                oldOnload();
                callback();
            }
        }
    }

    /**
     * 避免覆盖现有的window.resize的方法
     * @param {any} callback 回调函数,在window.resize执行后执行此函数
     * @author XueLiang.Zhai
     * @text 参考文章:https://www.cnblogs.com/jackson-yqj/p/5949060.html
     * @date 2021-01-24
     */
    function $resize(callback) {
        let oldResize = window.onresize;
        //console.log(oldResize)
        if (typeof oldResize != "function") {
            //console.log("newResize")
            window.onresize = callback;
        } else {
            window.onresize = function () {
                oldResize();
                callback();
            }
        }
    }

    /**
     * 获取指定的cookie值
     * @param {String} str 要查询的Cookie字段名
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
     * @param {String} str 要删除的Cookie字段名
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
    function arraySort(arr = [], attr, asc) {
        if(attr == undefined){ attr = ""; };
        if(asc == undefined){ asc = true; };
        if (arr.length <= 1) { return arr; }
        if (arr[0][attr] == undefined) {
          console.log(attr + " is undefined!");
          return arr;
        }
        return arr.sort((a, b) => {
          if (asc) { return a[attr] - b[attr]; } //升序
          else { return b[attr] - a[attr]; } //降序
        });
    }


    /**
     * 获取计算后的时间
     * @param {String} attr 增加或减少的字段名
     * @param {Number} inc 增加或减少的量,正数为增加,负数为减小
     * @param {Date,String} defaultDate 设置当前时间
     * @return {String} 不传参数时,返回当前时间,返回格式为:2020-01-01
     * 开发此方法消耗时间为:3小时15分
     */
    function getDateByCount(attr = "day", inc = 0, defaultDate) {
        if(defaultDate == undefined){ defaultDate = new Date(); }
        let date = new Date(defaultDate);
        let year = date.getFullYear();
        let month = date.getMonth() + 1; //获取的月份默认为0-11,0为一月份
        let day = date.getDate();
        if (inc != 0) {
        // console.log("计算前的日期:"+date.toLocaleDateString());
        // console.log(attr + "字段,增加/减少" + inc +",计算开始");
        }
        // console.log(month + "月份有多少天:"+new Date(2020, 2, 0).getDate());
        //增加monthCount个月
        let appendMonth = function(monthCount) {
        // console.log("进入增加月份算法");
        if (monthCount < 1) {
            return;
        }
        month += monthCount;
        // console.log("增加后的月份为:" + month);
        while (month > 12) {
            // console.log("月份超过一年,增加年份");
            month -= 12;
            // console.log("剩余月份:" + month);
            year++;
        }
        };
        //增加dayCount天
        let appendDay = function(dayCount) {
        // console.log("进入增加天数算法");
        if (dayCount < 1) {
            return;
        }
        //获取本月份总天数
        let monthCountDay;
        monthCountDay = new Date(year, month, 0).getDate();
        // console.log("本月份总天数:"+monthCountDay);
        day += dayCount;
        while (day > monthCountDay) {
            // console.log("天数"+day+"超过-本-月份天数");
            // console.log("计算:" + day + "-" + monthCountDay);
            day = day - monthCountDay;
            // console.log("剩余天数:" + day);
            appendMonth(1);
            monthCountDay = new Date(year, month, 0).getDate();
            // console.log("计算"+year+"年"+month+"月份的天数:"+monthCountDay);
        }
        // console.log("增加天数算法计算完成");
        };
        //减少monthCount个月
        let subMonth = function(monthCount) {
        // console.log("进入减少月份的算法");
        if (monthCount < 1) {
            return;
        }
        //先减年份
        while (monthCount > 12) {
            // console.log("减少的月份大于一年");
            year--;
            monthCount -= 12;
        }
        if (monthCount >= month) {
            // console.log("减少的月份大于等于今年所在月份");
            year--;
            month = month + 12 - monthCount;
        } else {
            month = month - monthCount;
        }
        // console.log("减少月份后的时间:"+year+"年"+month+"月");
        };
        //减少dayCount天
        let subDay = function(dayCount) {
        // console.log("进入减少天数的算法");
        if (dayCount >= day) {
            // console.log("减少的天数大于等于当前所在月份的天数");
            //计算上个月的总天数
            let preMonthCountDay;
            if (month == 1) {
            preMonthCountDay = new Date(year - 1, 12, 0).getDate();
            // console.log("上个月是:"+(year-1)+"年"+12+"月,总天数为:"+preMonthCountDay);
            } else {
            preMonthCountDay = new Date(year, month - 1, 0).getDate();
            // console.log("上个月是:"+year+"年"+(month-1)+"月,总天数为:"+preMonthCountDay);
            }
            subMonth(1);
            dayCount -= day;
            while (dayCount >= preMonthCountDay) {
            // console.log("剩余未减天数大于前一个月的总天数,剩余未减天数:"+dayCount);
            dayCount -= preMonthCountDay;
            subMonth(1);
            // console.log("重新设置上个月天数");
            if (month == 1) {
                preMonthCountDay = new Date(year - 1, 12, 0).getDate();
                // console.log("上个月是:"+(year-1)+"年"+12+"月,总天数为:"+preMonthCountDay);
            } else {
                preMonthCountDay = new Date(year, month - 1, 0).getDate();
                // console.log("上个月是:"+year+"年"+(month-1)+"月,总天数为:"+preMonthCountDay);
            }
            }
            day = new Date(year, month, 0).getDate() - dayCount;
            // console.log("当前位于所在月份的第"+day+"天");
        } else {
            day -= dayCount;
        }
            // console.log("减少天数算法计算完成");
        };
    
        //触发增加月份
        if (attr == "month" && inc > 0) {
            // console.log("增加"+ inc + "个月,一个月按照30天计算");
            let countDay = 0;
            for (let i = 0; i < inc; i++) {
                //一个月按30天计算
                countDay += 30;
            }
            // console.log("总计增加天数:"+countDay);
            appendDay(countDay);
        }
        //触发增加天数
        if (attr == "day" && inc > 0) {
            appendDay(inc);
        }
        //触发减少月份
        if (attr == "month" && inc < 0) {
            inc = -inc;
            // console.log("减少"+ inc + "个月,一个月按照30天计算");
            let countDay = 0;
            for (let i = 0; i < inc; i++) {
                //一个月按30天计算
                countDay += 30;
            }
            // console.log("总计减少天数:"+countDay);
            subDay(countDay);
        }
        //触发减少天数
        if (attr == "day" && inc < 0) {
            subDay(-inc);
        }
        //格式化时间
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        let formatter = year + "-" + month + "-" + day;
        // console.log("getDateByCount()返回值:"+formatter);
        return formatter;
    }

    /**
     * 传入时间,获取格式化后的时间
     * @param {Date} defaultDate
     * @date 2021-03-03
     */
     function dateFormatter(defaultDate,hasTime,formatterText){
        if(defaultDate == undefined){ defaultDate = new Date(); };
        if(hasTime == undefined){ hasTime = true; }
        if(formatterText == undefined){ formatterText=''}
        let date = new Date(defaultDate);
        let year = date.getFullYear();
        let month = date.getMonth() + 1; //获取的月份默认为0-11,0为一月份
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        //格式化时间
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if(hour < 10){
            hour = "0" + hour;
        }
        if(minute < 10){
            minute = "0" + minute;
        }
        if(second < 10){
            second = "0" + second;
        }
        let formatter = year + "-" + month + "-" + day;
        if(hasTime){
            formatter += " " + hour + ":" + minute + ":" + second;
        }
        if(formatterText != undefined && formatterText !=''){
            let textArr = formatterText.split('-')
            if(textArr.length != 6){ return formatter; }
            formatter = year + textArr[0] + month + textArr[1] + day + textArr[2];
            if(hasTime){
                formatter += " " + hour + textArr[3] + minute + textArr[4] + second + textArr[5];
            }
        }
        // console.log("getDateByCount()返回值:"+formatter);
        return formatter;
    }
    
    /**
     * 自定义loading
     * @author XueLiang.Zhai
     * @date 2021-02-22
     */
    function initLoading(){
        //初始化toolsLoading.开始
        loadingbox.mask = document.createElement('div');
        loadingbox.mask.style.cssText = 
            'position:fixed;top:0;left:0;height:100%;width:100%;display:none';
        document.body.appendChild(loadingbox.mask);

        loadingbox.box = document.createElement('div');
        loadingbox.box.style.cssText = 
            'position:fixed;top:calc(50% - 75px);left:calc(50% - 75px);height:150px;' + 
            'width:150px;background-color:rgba(0,0,0,0.6);border-radius:6px;' +
            'display:none;flex-direction: column;align-items:center;';
        document.body.appendChild(loadingbox.box);

        let icon = document.createElement('div');
        icon.style.cssText = 
            'height:60%;width:60%;display:flex;align-items:center;' +
            'justify-content:center;margin-top:8px';
        loadingbox.box.appendChild(icon);

        let style = document.createElement('style');
        let keyframe = "@keyframes toolsLoading {"+
            "            0% {"+
            "                transform: rotate(0deg);"+
            "            }"+
            "            100% {"+
            "                transform: rotate(360deg);"+
            "            }"+
            "        }";
        style.innerHTML = keyframe;
        document.body.appendChild(style);

        let circle = document.createElement('div');
        circle.style.cssText = 
            'width:80%;height:80%;border-radius:50%;border:5px solid rgba(0,0,0,0.2);' +
            'border-top:5px solid #fff;animation:toolsLoading 0.8s linear infinite';
        icon.appendChild(circle);

        loadingbox.title = document.createElement('span');
        loadingbox.title.style.cssText = 
            'color:#fff;margin-top:10px';
        loadingbox.box.appendChild(loadingbox.title);
        loadingbox.init = true;
        //初始化toolsLoading.结束
    }
    //显示loading
    function showLoading(messgae){
        if(messgae == undefined){ messgae = "Loading..."; }
        if(loadingbox.init == false){
            initLoading();
        }
        loadingbox.mask.style.display = "block";
        loadingbox.box.style.display = 'flex';
        loadingbox.title.innerHTML = messgae;
    }
    //隐藏loading
    function closeLoading(callback){
        loadingbox.mask.style.display = "none";
        loadingbox.box.style.display = 'none';
        //此方法为非异步--此回调为预留回调
        if(typeof callback == "function"){
            callback()
        }
    }

    //简单get请求
    function xhrGet(url,callback){
        let xhr = new XMLHttpRequest();
        xhr.open("get",url);
        xhr.onload = function(){
            callback(this.response);
        }
        xhr.send(null);
    }

    //简单post请求
    function xhrPost(data,url,callback,option){
        let xhr = new XMLHttpRequest();
        xhr.open("post",url);
        if(option != undefined){
          if(option.json == true){
            xhr.setRequestHeader('content-type','application/json');
            data= JSON.stringify(data);
          }
          if(option.formData == true){
            xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            data = xhrFormData(data);
          }
        }
        xhr.onload = function(){
          callback(JSON.parse(this.response));
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

    /**
     * 绘画元素
     * @param {*} elementID 要添加内容的元素
     * @param {*} array 内容数组
     * @param {*} htmlFun 单个块元素的html回调,要求返回String
     */
    function drawElement(elementID,array,htmlFun,append){
        let element = (typeof elem=='string')?document.querySelector(elem):elem;
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

    //将elementIDArray中的元素的display设置为view
    function showElement(elementIDArray,view){
        if(view == undefined){ view = "block" }
        for(let i=0;i<elementIDArray.length;i++){
          document.querySelector("#"+elementIDArray[i]).style.display = view;
        }
    }

    //将elementIDArray中的元素的display设置为none
    function hiddenElement(elementIDArray){
        for(let i=0;i<elementIDArray.length;i++){
          document.querySelector("#"+elementIDArray[i]).style.display = "none";
        }
    }

    //获取地址栏的参数
    function  getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        //if (r != null) return unescape(r[2]);//unescape已被弃用
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    











    const tools = {
        $ready,
        $resize,
        getCookie,
        removeCookie,
        arraySort,
        getDateByCount,
        dateFormatter,
        showLoading,
        closeLoading,
        xhrPost,
        xhrGet,
        hiddenElement,
        showElement,
        drawElement,
        getUrlParam
    }
    if (typeof module != 'undefined' && module.exports) {
        module.exports = tools;
    } else {
        window.tools = tools;
    }
})(window, document, Math);