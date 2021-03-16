//使用rem进行适配
(function(document,window){
    //使用示例:$useRem.init('window',1920,100);
    const $useRem = {
        platform:"android",//android,ios,window
        designWidth:1080,//设计稿宽度
        fontSize:100,
        init:function(platform,width,fontsize){
            $useRem.platform = platform;
            $useRem.designWidth = width;
            $useRem.fontSize = fontsize;
            $useRem.reset(width,fontsize);
            if($useRem.platform == "window"){
                $useRem.addResize();
            }
        },
        reset:function(width,fontsize){
            if(width == undefined){ width=1080 };
            if(fontsize == undefined){ fontsize=100 };
            setRem(width,fontsize);
        },
        addResize:function(){
            addWindowResizeEvent(function(){
                $useRem.reset($useRem.designWidth,$useRem.fontSize);
            });
        }
    }
    /**
     * 避免覆盖现有的window.resize的方法
     * @param {any} callback 回调函数,在window.resize执行后执行此函数
     * @author XueLiang.Zhai
     * @text 参考文章:https://www.cnblogs.com/jackson-yqj/p/5949060.html
     * @date 2021-01-24
     */
    function addWindowResizeEvent(callback) {
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

    function setRem(width,fontsize){
        let clientWidth = document.documentElement.clientWidth;
        //设置页面为设计稿<-宽度->时的fontSize值
        document.documentElement.style.fontSize = (clientWidth / width) * fontsize + "px";
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = $useRem;
    } else {
        window.$useRem = $useRem;
    }
})(document,window)