(function (window, document) {


    /** cityPicker插件
     * @author  yltfWorkgroup
     * @date    2021.03.26
     * @version 0.0.0
     */
    function cityPicker (options){
        /** cityPicker的赋值对象 若此值为空,则需要手动进行赋值 */
        this.userElement = '';
        /** 一些基本dom元素 */
        this.element = {
            mask:'',
            select:'',
            header:'',
            content:'',
            button:'',
            search:'',
            loading:''
        }
        /** json级联数组 其格式只支持逐级递减json结构 */
        this.json = [];
        /** json数组的label标签 */
        this.label = 'label';
        /** json数组的value标签 */
        this.value='value';
        /** json数组的child标签 */
        this.child='child';
        /** header中所保存的数组 */
        this.xlist=[];
        /** content中所保存的数组 */
        this.ylist=[];
        /** search中搜索结果保存的数组 */
        this.searchlist=[];
        /** ylist回调函数 */
        this.ycallback=function(){};
        /** xlist回调函数 */
        this.xcallback=function(){};
        /** 最终回调函数 */
        this.callback=function(){};

        /** 是否开启cityPicker的查询功能 */
        this.search=false;
        /** 是否开启cityPicker的懒加载功能,该功能只在级联模式生效 */
        this.lazy=false;
        /** 是否开启非级联模式(仅选择一项) */
        this.single=true;
        /** 非级联模式下的提示文字  */
        this.placeholder="";

        this.init(options);
    }

    /** 初始化cityPicker插件 */
    cityPicker.prototype.init = function(options){
        this.setPickerOption(options);
        this.creatPickerElement();
        this.addPickerEvent();
        this.drawYlist(this.json);
    }

    /** cityPicker搜索功能 */
    cityPicker.prototype.searchYlist = function (name){
        if(name== ""){
            this.drawYlist(this.ylist);
            return;
        }
        this.searchlist = [];
        let temp = this.deepCopy(this.ylist);
        for(let i=0;i<temp.length;i++){
            if(temp[i][this.label].indexOf(name)!=-1){
                this.searchlist.push(temp[i]);
            }
        }
        this.drawYlist(this.deepCopy(this.searchlist),true);
    }


    /** 格式化cityPicker插件的最终回调值 */
    cityPicker.prototype.formatterResult = function (){
        let text = "";
        for(let i=0;i<this.xlist.length;i++){
            text += this.xlist[i][this.label];
            if(i!=this.xlist.length-1){
                text += " ";
            }
        }
        let code = this.xlist[this.xlist.length-1][this.value];
        this.callback(text,code,this.deepCopy(this.xlist));
        if(this.userElement!=''){
            this.userElement.value = text;
        }
        this.hide();
    }

    /** 重置xlist */
    cityPicker.prototype.resetXlist = function (item,keep){
        let newXlist = this.deepCopy(this.xlist);
        for(let i=newXlist.length-1;i>0;i--){
            if(item[this.value]!=newXlist[i][this.value]){
                newXlist.pop();
            }else{ break; }
        }
        if(!keep){
            newXlist.pop();
        }
        if(newXlist.length!=0){
            this.drawXlist(newXlist);
            this.drawYlist(newXlist[newXlist.length-1][this.child]);
        }else{
            this.drawXlist([]);
            this.drawYlist(this.json);
        }
    }

    /** xlist中close图标的点击事件 */
    cityPicker.prototype.xlistCloseClick = function (_this,e){
        let name = _this.parentElement.innerHTML;
        name = name.replace(/<span class=\"e-cityselect-close\"><\/span>/,'');
        let object = this.getCurrentObject(name,this.xlist);
        this.resetXlist(object);
        e.stopPropagation();
    }

    /** xlist中span的点击事件 */
    cityPicker.prototype.xlistClick = function (_this){
        let name = _this.innerHTML;
        name = name.replace(/<span class=\"e-cityselect-close\"><\/span>/,'');
        let object = this.getCurrentObject(name,this.xlist);
        this.xcallback(object,_this);
        if(JSON.stringify(object[this.child])!=JSON.stringify(this.ylist)){
            this.resetXlist(object,true)
            this.drawYlist(object[this.child]);
        }
    }

    /** ylist中span的点击事件 */
    cityPicker.prototype.ylistClick = function (_this){
        let object = this.getCurrentObject(_this.innerHTML,this.ylist);
        if(this.lazy==true){
            this.element.loading.style.height="calc(50% - 40px)";
            let picker = this;
            this.ycallback(object,function(asyncArr){
                picker.element.loading.style.height="0px";
                if(!asyncArr||asyncArr.length==0){
                    picker.xlist.push(picker.deepCopy(object));
                    picker.formatterResult();
                    return;
                }
                object[picker.child] = asyncArr;
                picker.xlist.push(picker.deepCopy(object));
                if(picker.search){
                    picker.element.search.value = "";
                }
                picker.drawXlist(picker.xlist);
                picker.drawYlist(object[picker.child]);
            },_this);
            return;
        }
        this.ycallback(object,_this);
        this.xlist.push(this.deepCopy(object));
        if(this.search){
            this.element.search.value = "";
        }
        if(this.single==true){
            this.formatterResult();
            return;
        }
        this.drawXlist(this.xlist);
        if(object[this.child]&&object[this.child].length!=0){
            this.drawYlist(object[this.child]);
        }else{
            this.formatterResult();
        }
    }

    /** 根据名称获取当前点击的对象 */
    cityPicker.prototype.getCurrentObject = function (name,array){
        for(let i=0;i<array.length;i++){
            if(name == array[i][this.label]){
                return array[i];
            }
        }
    }

    /** 给header结果展现层的元素添加事件 */
    cityPicker.prototype.addXlistEvent = function (){
        let _this = this;
        let spans = this.element.header.getElementsByClassName('e-cityselect-span');
        for(let i=0;i<spans.length;i++){
            spans[i].addEventListener('click',function(e){
                _this.xlistClick(e.srcElement);
            })
        }
        let closeIcos = this.element.header.getElementsByClassName('e-cityselect-close');
        for(let i=0;i<closeIcos.length;i++){
            closeIcos[i].addEventListener('click',function(e){
                _this.xlistCloseClick(e.srcElement,e);
            })
        }
    }

    /** 给content级联选择层的元素添加事件 */
    cityPicker.prototype.addYlistEvent = function (){
        let _this = this;
        let spans = this.element.content.getElementsByClassName('e-cityselect-span');
        for(let i=0;i<spans.length;i++){
            spans[i].addEventListener('click',function(e){
                _this.ylistClick(e.srcElement);
            })
        }
    }

    /** 绘画cityPicker的header结果展现层的元素 */
    cityPicker.prototype.drawXlist = function (array){
        let _this = this;
        /* 存储当前要绘画元素的数组 */
        this.xlist = this.deepCopy(array);
        this.drawElement(this.element.header,array,function(item,index){
            let html  = '';
            if(index==_this.xlist.length-1){
                html += '<div class="e-cityselect-span e-checked">'+item[_this.label]+'<span class="e-cityselect-close"></span></div>'
            }else{
                html += '<div class="e-cityselect-span">'+item[_this.label]+'<span class="e-cityselect-close"></span></div>'
            }
            return html;
        })
        this.element.header.scrollTo(10000,0);
        this.addXlistEvent();
    }

    /** 绘画cityPicker的content级联选择层的元素 */
    cityPicker.prototype.drawYlist = function (array,search){
        if(!search){
             /* 存储当前要绘画元素的数组 */
            this.ylist = this.deepCopy(array);
        }
        let _this = this;
        this.drawElement(this.element.content,array,function(item,index){
            let html  = '';
            html += '<span class="e-cityselect-span">'+item[_this.label]+'</span>';
            return html;
        })
        this.element.content.scrollTo(0,0);
        this.addYlistEvent();
    }

    /** 切换cityPicker插件的显示与隐藏 */
    cityPicker.prototype.changeView = function (){
        (this.element.mask.style.height == "0px")?this.show():this.hide();
    }

    /** 隐藏cityPicker插件 */
    cityPicker.prototype.hide = function (){
        let _this = this;
        this.element.select.style.height = "0px";
        this.element.mask.style.backgroundColor = "transparent";
        if(this.search){
            this.element.search.parentElement.style.display = "none";
        }
        setTimeout(function(){
            _this.element.mask.style.height = "0px";
        }, 100);
    }

    /** 显示cityPicker插件 */
    cityPicker.prototype.show = function (){
        let _this = this;
        if(this.xlist.length!=0){
            this.xlist.pop();
            if(this.single==false){
                this.drawXlist(this.xlist);
            }
            if(this.xlist.length!=0){
                this.drawYlist(this.xlist[this.xlist.length-1][this.child]);
            }else if(this.xlist.length==0){
                this.drawYlist(this.json);
            }
        }
        this.element.header.scrollTo(10000,0);
        this.element.content.scrollTo(0,0);
        this.element.mask.style.height = "100%";
        setTimeout(function(){
            _this.element.select.style.height = "50%";
            setTimeout(function(){
                if(_this.search){
                    _this.element.search.parentElement.style.display = "flex";
                }
                _this.element.mask.style.backgroundColor = "rgba(0,0,0,0.3)";
            }, 100);
        }, 14);
    }

    /** cityPicker插件的xlist回调事件 */
    cityPicker.prototype.xCallback = function (xcallback){
        if(typeof xcallback == 'function'){
            this.xcallback = xcallback;
        }
    }

    /** cityPicker插件的ylist回调事件 */
    cityPicker.prototype.yCallback = function (ycallback){
        if(typeof ycallback == 'function'){
            this.ycallback = ycallback;
        }
    }

    /** cityPicker插件的最终回调事件 */
    cityPicker.prototype.getValue = function (callback){
        if(typeof callback == 'function'){
            this.callback = callback;
        }
    }

    /** 绑定cityPicker的基本事件 */
    cityPicker.prototype.addPickerEvent = function (){
        let _this = this;
        if(this.userElement){
            this.userElement.addEventListener('click',function(){
                _this.changeView();
            })
        }
        this.element.mask.addEventListener('click',function(e){
            if(e.srcElement.className.indexOf('e-mask')>-1){
                _this.hide();
            }
        })
        if(this.single==false){
            this.element.button.addEventListener('click',function(){
                _this.formatterResult();
            })
        }
        if(this.search){
            this.element.search.addEventListener('input',function(){
                _this.searchYlist(_this.element.search.value);
            })
        }
    }

    /** 创建cityPicker所需要的基本dom元素 */
    cityPicker.prototype.creatPickerElement = function (){
        /* mask遮罩层 */
        this.element.mask = document.createElement('div');
        this.element.mask.classList.add('e-mask');
        this.element.mask.style.height = "0px";
        document.documentElement.appendChild(this.element.mask);
        /* select选择层 */
        this.element.select = document.createElement('div');
        this.element.select.classList.add('e-cityselect');
        this.element.mask.appendChild(this.element.select);
        /* header结果展现层 */
        let temp1 = document.createElement('div');
        temp1.classList.add('e-cityselect-header');
        this.element.select.appendChild(temp1);
        if(this.search==true){
            let temp3 = document.createElement('div');
            temp3.classList.add('e-cityselect-search');
            temp1.appendChild(temp3);
            this.element.search = document.createElement('input');
            this.element.search.placeholder = "输入名称查询";
            this.element.search.classList.add('e-input-search');
            temp3.appendChild(this.element.search);
        }
        this.element.header = document.createElement('div');
        if(this.single==true){
            this.element.header.innerHTML = this.placeholder;
            this.element.header.style.justifyContent = 'center';
        }
        this.element.header.classList.add('e-cityselect-xlist');
        temp1.appendChild(this.element.header);
        let temp2 = document.createElement('div');
        temp2.style.flex = "1";
        temp2.style.display = "flex";
        temp2.style.alignItems = "center";
        temp2.style.justifyContent = "center";
        temp1.appendChild(temp2);
        if(this.single==false){
            this.element.header.style.width = "80%";
            this.element.button = document.createElement('div');
            this.element.button.classList.add('e-cityselect-confirm');
            this.element.button.innerHTML = '确定';
            temp2.appendChild(this.element.button);
        }
        
        /* content级联选择层 */
        this.element.content = document.createElement('div');
        this.element.content.classList.add('e-cityselect-content');
        this.element.select.appendChild(this.element.content);

        if(this.lazy==true&&this.single==false){
            this.element.loading = document.createElement('div');
            this.element.loading.classList.add('e-cityselect-load');
            this.element.select.appendChild(this.element.loading);
            let temp4 = document.createElement('div');
            temp4.classList.add('e-refresh');
            this.element.loading.appendChild(temp4);
        }
    }

    /** 配置cityPicker的基本项 */
    cityPicker.prototype.setPickerOption = function (options){
        if(!options){ return; }
        if(options.element&&typeof options.element=="string"){
            this.userElement = document.querySelector(options.element);
        }
        if(options.data&&options.data.length!=0){
            this.json = this.deepCopy(options.data);
        }
        if(options.label){
            this.label = options.label;
        }
        if(options.value){
            this.value = options.value;
        }
        if(options.child){
            this.child = options.child;
        }
        if(options.search!=undefined){
            this.search = options.search;
        }
        if(options.single!=undefined){
            this.single = options.single;
            this.placeholder = options.placeholder;
        }
        if(options.lazy!=undefined){
            this.lazy = options.lazy;
        }
    }

    /** (基础类型)数组/对象深拷贝 */
    cityPicker.prototype.deepCopy = function(data){
        return JSON.parse(JSON.stringify(data));
    }
    /** 绘画元素
    * @param { document } elem 要添加内容的元素ID或者DOM元素
    * @param { array } array 内容数组
    * @param { boolean } append 是否将html追加至elem中
    * @param { funtion } htmlFun 单个块元素的html回调,要求返回String
    */
    cityPicker.prototype.drawElement = function(elem,array,htmlFun,append){
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
    /** 获取object在array中的所有祖先(包括自己) */
    cityPicker.prototype.getArrayByObject = function(object,array,callback,options){
        let value = options.value;
        let child = options.child;
        for(let i=0;i<array.length;i++){
            if(object[value]==array[i][value]){
                callback(array);
            }else{
                if(!array[child]){ continue; }
                getArrayByObject(object,array[child],function(resultArr){
                    console.log(resultArr);
                    callback(resultArr);
                },options)
            }
        }
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = cityPicker;
    } else {
        window.cityPicker = cityPicker;
    }
})(window, document);