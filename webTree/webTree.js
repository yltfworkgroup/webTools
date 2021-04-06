(function (window, document) {

    const $webTree = {
        element:'',
        callback:'',
        array:[],
        inited:false,

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
            drawWebTreeList(id,array,this);
            appendClickEvent(this.element);
            this.inited = true;
            this.hide();
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
        },
        show(){
            if(this.inited != true){ return; }
            this.element.style.height = this.options.height;
        },
        hide(){
            if(this.inited != true){ return; }
            this.element.style.height = "0px";
        },
        changeView(){
            if(this.inited != true){ return; }
            if(this.element.style.height!="0px"){
                this.hide();
            }else{
                this.show();
            }
        },
        lazyAjax(ajaxobj,callback){
            let this_ = this;
            this.options.lazyAjax(ajaxobj,function(arr){
                callback({ id:this_.element.id,array:arr,tree:this_ });
            });
        }
    }
    
    //绘画列表
    function drawWebTreeList(id,array,tree,append){
        $webTreeDrawElement(id,array,function(item,index){
            if($webTree.options.lazy!=undefined&&$webTree.options.lazy==true){
                if(item[$webTree.options.child]==undefined){
                    return $webTreeGetHtml(item,tree,true);
                }
                if(item[$webTree.options.child].length==0){
                    return $webTreeGetHtml(item,tree,false);
                }
            }else{
                if(item[$webTree.options.child]==undefined||item[$webTree.options.child].length==0){
                    return $webTreeGetHtml(item,tree,false);
                }
            }
            return $webTreeGetHtml(item,tree,true);
        },append);
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

    function $webTreeGetHtml(item,tree,hasChild){
        let lihtml = '';
        if( 
            (tree.options.lazy!=undefined&&tree.options.lazy == true) ||
            (item[tree.options.child]&&item[tree.options.child].length!=0)
        ){
            lihtml += '<li class="tree-item"><span class="tree-title"><i class="tree-icon-state"></i><i class="tree-icon-home"></i>'
        }else{
            lihtml += '<li class="tree-item tree-nochild"><span class="tree-title"><i class="tree-icon-state"></i><i class="tree-icon-home"></i>';
        }
        if(hasChild == false){
            lihtml = '<li class="tree-item tree-nochild"><span class="tree-title"><i class="tree-icon-state"></i><i class="tree-icon-home"></i>';
        }
        lihtml += '<a>' + item[tree.options.label] + '</a>';
        lihtml += '<i style="display:none">' + item[tree.options.label] + ',' + item[tree.options.value] + '</i></span>';
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
        let parent = "";
        if(e.parentElement.className.indexOf('tree-title')!=-1){
            parent = e.parentElement.parentElement;
        }else{
            parent = e.parentElement;
        }
        if(parent.className.indexOf('tree-open')!=-1){
            parent.classList.remove('tree-open');
        }else{
            if(parent.className.indexOf('tree-nochild')!=-1){
                if(parent.children[0].className.indexOf('tree-title')!=-1){
                    $webTreeLinkClick(parent.children[0].children[0]);
                }else{
                    $webTreeLinkClick(parent.children[0]);
                }
                return;
            }
            parent.classList.add('tree-open');
            if($webTree.options.lazy!=undefined&&$webTree.options.lazy==true){
                parent.classList.remove('tree-open');
                parent.classList.add('tree-loading');
                let oldlist = parent.getElementsByClassName('tree-list');
                for(let i=0;i<oldlist.length;i++){
                    parent.removeChild(oldlist[i]);
                }

                let searchInfo = '';
                if(parent.children[0].className.indexOf('tree-title')!=-1){
                    searchInfo = parent.children[0].children
                }else{
                    searchInfo = parent.children;
                }
                let searchArr = searchInfo[searchInfo.length-1].innerHTML.split(',');
                let ajaxobj = {};
                ajaxobj[$webTree.options.label] = searchArr[0];
                ajaxobj[$webTree.options.value] = searchArr[1];
                $webTree.lazyAjax(ajaxobj,function(obj){
                    if(obj.array.length == 0){
                        if(parent.children[0].className.indexOf('tree-title')!=-1){
                            $webTreeLinkClick(parent.children[0].children[0]);
                        }else{
                            $webTreeLinkClick(parent.children[0]);
                        }
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
        if(e.parentElement.parentElement.className.indexOf('tree-loading')!=-1){
            e.parentElement.parentElement.classList.remove('tree-loading');
        }
        //获取当前点击的对象的值
        let searchInfo = e.parentNode.children;
        let searchArr = searchInfo[searchInfo.length-1].innerHTML.split(',');
        let lastobj = {};
        lastobj[$webTree.options.label] = searchArr[0];
        lastobj[$webTree.options.value] = searchArr[1];
        // lastobj.pointlevel = searchArr[2];
        if(typeof $webTree.callback == "function"){
            $webTree.callback(lastobj);
            $webTree.hide();
        }
    }
    

    if (typeof module != 'undefined' && module.exports) {
        module.exports = $webTree;
    } else {
        window.$webTree = $webTree;
    }
})(window, document);