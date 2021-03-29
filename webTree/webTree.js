(function (window, document) {

    const $webTree = {
        element:'',
        callback:'',
        array:[],

        options:{
            label:'label',
            value:'value',
            child:'child',
            width:'180px',
            height:'300px',
            resize:true,
            lazy:false,
            lazyAjax:async function(){}
        },
        create(id,array,userOption){
            if(id&&array&&array.length!=0){
                this.element = document.querySelector("#"+id);
                this.array = array;
            }
            if(userOption){ this.options = userOption; }
            this.setOption();
            this.hide();
            drawWebTreeList(id,array,this);
            appendClickEvent(this.element);
        },
        setOption(){
            if(this.options.width){
                this.element.style.width = this.options.width;
                this.element.style.minWidth = this.options.width;
            }
            if(this.options.height){
                this.element.style.height = this.options.height;
            }
            if(this.options.resize){
                this.element.style.resize = "both";
            }
            if(this.options.lazy&&this.options.lazyAjax==undefined){
                if(typeof this.options.lazyAjax != 'function'){
                    console.log('webTree → lazyAjax is undefined!');
                    this.options.lazyAjax = function(callback){
                        setTimeout(function(){
                            callback([]);
                        }, 1000);
                    }
                }
            }

            //配置json数组级别,记录当前显示的与点击的是第几级数组
            if(this.array[0].pointlevel == undefined){
                this.array.forEach(function(item,index){
                    item.pointlevel = 1;
                })
            }
        },
        show(){
            this.element.style.height = this.options.height;
        },
        hide(){
            this.element.style.height = "0px";
        },
        changeView(){
            if(this.element.style.height!="0px"){
                this.hide();
            }else{
                this.show();
            }
        },
        lazyAjax(callback){
            let this_ = this;
            this.options.lazyAjax(function(arr){
                callback({ id:this_.element.id,array:arr,tree:this_ });
            });
        },
        setValue(){
            let object = {}
            this.callback(object);
        }
    }

    //绘画列表
    function drawWebTreeList(id,array,tree,append){
        $webTreeDrawElement(id,array,function(item,index){
            let html = $webTreeGetHtml(item,tree);
            return html;
        },append)
    }


    /**
    * 绘画元素
    * @param {*} elem 要添加内容的元素ID或者DOM元素
    * @param {*} array 内容数组
    * @param {*} htmlFun 单个块元素的html回调,要求返回String
    */
    function $webTreeDrawElement(elem,array,htmlFun,append){
        let element = "";
        if(typeof elem == 'string'){
            element = document.querySelector("#"+elem);
        }else{
            element = elem;
        }
        let html = "";
        array.forEach((item,index) => {
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

    function $webTreeGetHtml(item,tree){
        let lihtml = '';
        if( 
            (tree.options.lazy!=undefined&&tree.options.lazy == true) ||
            (item[tree.options.child]&&item[tree.options.child].length!=0)
        ){
            lihtml += '<li class="tree-item"><span class="tree-title"><i class="tree-icon-state"></i><i class="tree-icon-home"></i>'
        }else{
            lihtml += '<li class="tree-item tree-nochild"><span class="tree-title"><i class="tree-icon-state"></i><i class="tree-icon-home"></i>';
        }
        lihtml += '<a>' + item[tree.options.label] + '</a>';
        lihtml += '<i style="display:none">' + item[tree.options.value] + ',' + item.pointlevel + '</i></span>';
        if(
            (tree.options.lazy!=undefined&&tree.options.lazy == false) &&
            (item[tree.options.child]&&item[tree.options.child].length!=0)
        ){
            lihtml += '<ul class="tree-list" style="min-width:' + tree.options.width + '">';
            let array = item[tree.options.child];
            for(let i=0;i<array.length;i++){
                lihtml += $webTreeGetHtml(array[i],tree);
            }
            lihtml += '</ul>';
        }
        lihtml += '</li>'
        return lihtml;
    }
    
    function appendClickEvent(ele){
        let spans = ele.getElementsByTagName('span');
        for(let i=0;i<spans.length;i++){
            spans[i].addEventListener('click',function(e){
                $webTreeSpanClick(e.srcElement)
            })
        }
        let links = ele.getElementsByTagName('a');
        for(let i=0;i<links.length;i++){
            links[i].addEventListener('click',function(e){
                $webTreeLinkClick(e.srcElement);
                e.stopPropagation();
            })
        }
    }
    function $webTreeSpanClick(e){
        let parent = e.parentElement;
        if(parent.className.indexOf('tree-open')!=-1){
            parent.classList.remove('tree-open');
        }else{
            parent.classList.add('tree-open');
            if($webTree.options.lazy!=undefined&&$webTree.options.lazy==true){
                parent.classList.remove('tree-open');
                parent.classList.add('tree-loading');
                let oldlist = parent.getElementsByClassName('tree-list');
                for(let i=0;i<oldlist.length;i++){
                    parent.removeChild(oldlist[i]);
                }
                $webTree.lazyAjax(function(obj){
                    if(obj.array.length == 0){
                        parent.classList.add('tree-nochild');
                        return;
                    }
                    let ul = document.createElement('ul');
                    ul.classList.add('tree-list');
                    ul.style.minWidth = obj.tree.options.width;
                    parent.appendChild(ul);
                    drawWebTreeList(ul,obj.array,obj.tree);
                    appendClickEvent(ul);
                    parent.classList.remove('tree-loading');
                    parent.classList.add('tree-open');
                });
                
            }
        }
    }
    function $webTreeLinkClick(e){
        //获取当前点击的对象的值
        let searchInfo = e.parentNode.children;
        console.log(searchInfo);
    }
    

    if (typeof module != 'undefined' && module.exports) {
        module.exports = $webTree;
    } else {
        window.$webTree = $webTree;
    }
})(window, document);