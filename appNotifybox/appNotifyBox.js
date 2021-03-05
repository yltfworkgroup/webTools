(function (window, document) {
    
    let element = "";
    let ulElement = "";
    let childElements = "";
    let firstChild = "";
    let timer = "";

    let option = {
        elementID:"",
        element:"",
        ulElement:"",
        liElement:"",
        marginTop:"marginTop",
        transition:'margin-top 1s linear',
    };

    function checkInit(){
        if(element == undefined){ return false };
        if(ulElement == undefined){ return false };
        if(childElements == undefined || childElements.length == 0){ return false };
    }

    function setOption(o){
        option = o;
    }

    function initElement(boxElement,listElement,blockElements){
        element = boxElement;
        ulElement = listElement;
        childElements = blockElements;
    }

    function infiniteRoll(){
        firstChild = childElements[0];
        let clientHeight = firstChild.clientHeight;
        firstChild.style.transition = option.transition;
        firstChild.style[option.marginTop] = "-" + clientHeight + "px";
        firstChild.addEventListener('transitionend',function(){
            ulElement.removeChild(firstChild);
            firstChild.style.transition = "";
            firstChild.style[option.marginTop] = "";
            ulElement.appendChild(firstChild);
        })
    }

    function run(delayTime){
        if(checkInit == false){ return };
        if(delayTime == undefined){ delayTime=3000 };
        timer = setInterval(infiniteRoll,delayTime);
    }

    function clearTimer(){
        clearInterval(timer);
    }

    const $box = {
        initElement,
        clearTimer,
        run
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = $box;
    } else {
        window.$box = $box;
    }
})(window, document);