(function (window, document) {

    const webTree = {
        element:'',
        callback:'',
        options:{
            label:'Name',
            value:'sort',
            child:'level',
            resize:true,
            isReset:false,
            lazy:true,
        },
        create(id,array,userOption){
            if(id&&array&&array.length!=0){
                $webTree.element = document.querySelector("#"+id);
            }
            if(userOption){ $webTree.options = userOption; }

            drawWebTreeList(id,array);
        },
    }

    //绘画列表
    function drawWebTreeList(id,array){
        $webTreeDrawElement(id,array,function(item,index){
            let html = $webTreeGetHtml(item);
            return html;
        })
    }


    /**
    * 绘画元素
    * @param {*} elementID 要添加内容的元素
    * @param {*} array 内容数组
    * @param {*} htmlFun 单个块元素的html回调,要求返回String
    */
     function $webTreeDrawElement(elementID,array,htmlFun,append){
       let element = document.querySelector("#"+elementID);
       let html = "";
       array.forEach((item,index) => {
           if(typeof htmlFun == "function"){
               html += htmlFun(item,index);
           }
       });
       if(append){
           element.innerHTML += html;
       }else{
           element.innerHTML  = html;
       }
    }

    function $webTreeGetHtml(item){
        let lihtml = '';
        lihtml += '<li class="tree-item"><span class="tree-title" onclick="spanClick(this)">';
        lihtml += '<i class="tree-icon-state"></i><i class="tree-icon-home"></i>';
        lihtml += '<a onclick="webTreeAclick(this,event)">' + item[$webTree.options.label] + '</a>';
        lihtml += '<i style="display:none">' + item[$webTree.options.value] + '</i></span>';
        if(item[$webTree.options.child]&&$webTree.options.lazy&&$webTree.options.lazy == false){
            lihtml += '<ul class="tree-list" style="min-width:' + $webTree.options.minWidth + '">';
            let array = item[$webTree.options.child];
            for(let i=0;i<array.length;i++){
                lihtml += $webTreeGetHtml(array[i]);
            }
            lihtml += '</ul>';
        }
        lihtml += '</li>'
        return lihtml;
    }
    
    // function drawlist(element,arr){
    //     let litag = document.createElement('li');
    //     litag.innerHTML = getWebTreeLiHtml(arr);
    //     element.appendChild(litag);
    // }
    // /** 开启webTree */
    // function openWebTree(elementID="webTree"){
    //     if(!element){
    //         element = document.getElementById(elementID);
    //     }
    //     if(element.clientHeight != 0){
    //         closeWebTree(elementID);
    //     }else{
    //         element.style.height = option.height;
    //     }
    // }
    // /** 关闭webTree */
    // function closeWebTree(elementID="webTree"){
    //     if(element){
    //         element.style.height = 0;
    //     }else{
    //         document.getElementById(elementID).style.height = 0;
    //     }
    // }
    // /**
    //  * 回调函数
    //  * @param {function} callback 
    //  */
    // function webTreeValue(callback){
    //     selectCallback = callback;
    // }



    if (typeof module != 'undefined' && module.exports) {
        module.exports = webTree;
    } else {
        window.$webTree = webTree;
    }
})(window, document);