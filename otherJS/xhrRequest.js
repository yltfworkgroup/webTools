//基于es6的xhr原生请求插件
(function(window){
    class xhrRequest {
        xhrPool = [];//xhr线程池
        reqData = "";
        constructor(){
            this.xhrPool.push(new XMLHttpRequest());
        }
        /** 获取空闲xhr实例对象 */
        getInstance(){
            let freeXhr = null;
            //当线程池中有空闲对象时,直接使用此对象
            for(let i=0;i<this.xhrPool.length;i++){
                if(this.xhrPool[i].readyState == 0 || this.xhrPool[i].readyState == 4){
                    freeXhr = this.xhrPool[i];
                }
            };
            //否则新建一个xhr对象,然后加入到线程池中
            if(freeXhr == null){ freeXhr = new XMLHttpRequest();this.xhrPool.push(freeXhr); };
            return freeXhr;
        }

        post(data,url,option = {}){
            this.reqData = data;
            return new Promise((resolve,reject) => {
                let freeXhr = this.getInstance();
                freeXhr.open("post",url);
                this.setOption(option,freeXhr);
                freeXhr.onload = function(){ resolve(this.response) };
                freeXhr.onerror = function(){ reject(this) };
                freeXhr.send(this.reqData);
                //console.log(this.xhrPool);
            })
        }

        get(url,option = {}){
            return new Promise((resolve,reject) => {
                let freeXhr = this.getInstance();
                freeXhr.open("get",url);
                this.setOption(option,freeXhr);
                freeXhr.onload = function(){ resolve(this.response) };
                freeXhr.onerror = function(){ reject(this) };
                freeXhr.send(null);
                //console.log(this.xhrPool);
            })
        }

        setOption(option,xhr){
            let optionKeys = Object.keys(option);
            let optionValues = Object.values(option);
            for(let i=0;i<optionKeys.length;i++){
                //待完善
                if(optionKeys[i] == "dataType"){
                    if(optionValues[i] == "json"){
                        xhr.setRequestHeader("content-type","application/json");
                        this.reqData = JSON.stringify(this.reqData);
                    }
                    if(optionValues[i] == "formdata"){
                        xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
                        this.reqData = this.xhrFormData(this.reqData);
                    }
                }
                if(optionKeys[i] == "headers"){
                    let k = Object.keys(optionValues[i]);
                    let v = Object.values(optionValues[i]);
                    for(let j=0;j<k.length;j++){
                        xhr.setRequestHeader(k[j],v[j]);
                    }
                }
                if(optionKeys[i] == "withCredentials"){
                    xhr.withCredentials = optionValues[i];
                }
            }
        }

        //reqData为Object,且使用formData进行传输时,需要用此方法处理数据
        //最终数据格式为:'id=1&name=2&age=3'
        xhrFormData(data){
            let formatterData = "";
            for(let i=0;i<Object.keys(data).length;i++){
              formatterData += Object.keys(data)[i];
              formatterData += "=" + Object.values(data)[i] + "&";
            }
            return formatterData;
        }
    }

    const $xhr = new xhrRequest();
    if (typeof module != 'undefined' && module.exports) {
        module.exports = $xhr;
    } else {
        window.$xhr = $xhr;
    }
})(window)