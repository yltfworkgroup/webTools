(function (window, document) {
  
  
  //全局element
  let element;
  //全局elementID
  let webTreeID;
  //全局json数组
  let jsonArray;
  //全局配置
  let option = {
    height: "300px",
    width: "180px",
    label: "name",
    value: "value",
    child: "child",
    resize: false,
    isReset: true,
  };
  //全局回调
  let selectCallback;

  /**
   * 开启webTree
   */
  function openWebTree(elementID = "webTree") {
    if (!element) {
      element = document.getElementById(elementID);
    }
    if (element.clientHeight != 0) {
      closeWebTree(elementID);
    } else {
      element.style.height = option.height;
    }
  }
  /**
   * 关闭webTree
   */
  function closeWebTree(elementID = "webTree") {
    if (element) {
      element.style.height = 0;
    } else {
      document.getElementById(elementID).style.height = 0;
    }
  }

  /**
   * 回调函数
   * @param {function} callback
   */
  function webTreeValue(callback) {
    selectCallback = callback;
  }

  /**
   * 初始化webTree
   * @param {String} id 元素的id
   * @param {Array} arr 要渲染的数组
   * @param {Object} userOption 渲染前的一些配置
   */
  function webTreeSetOption(id, arr, userOption = {}) {
    element = document.getElementById(id);
    webTreeID = id;
    jsonArray = arr;
    if (Object.keys(userOption).length != 0) {
      webTreeSetOption(userOption);
    }
    drawlist(element, arr);
  }

  function drawlist(element, arr) {
    let litag = document.createElement("li");
    litag.innerHTML = getWebTreeLiHtml(arr);
    element.appendChild(litag);
  }

  //获取将要渲染的列表html
  function getWebTreeLiHtml(arr) {
    let lihtml = "";
    for (let i = 0; i < arr.length; i++) {
      lihtml += '<li class="tree-item">';
      if (arr[i][option.child] != undefined) {
        lihtml +=
          '     <span class="tree-title" onclick="spanClick(this)"><i class="tree-icon"></i><a onclick="webTreeAclick(this,event)">' +
          arr[i][option.label] +
          '</a><i style="display:none">' +
          arr[i][option.value] +
          "</i></span>";
      } else {
        lihtml +=
          '     <span class="tree-title" onclick="spanClick(this)"><i class="tree-nochild"></i><a onclick="webTreeAclick(this,event)">' +
          arr[i][option.label] +
          '</a><i style="display:none">' +
          arr[i][option.value] +
          "</i></span>";
      }
      if (arr[i][option.child] != undefined) {
        lihtml +=
          '<ul class="tree-list" style="min-width:' + option.width + '">';
        lihtml += getWebTreeLiHtml(arr[i][option.child]);
        lihtml += "</ul>";
      }
      lihtml += "</li>";
    }
    return lihtml;
  }

  //li中的span元素的点击事件
  function spanClick(e) {
    let childlist = "";
    if (e.parentElement.childNodes[2] != undefined) {
      childlist = e.parentElement.childNodes[2];
      if (childlist.clientHeight == 0) {
        childlist.style.height = "auto";
      } else {
        childlist.style.height = 0;
      }
    } else {
      /**
       * 点击span且同级ul不存在时,触发全局回调函数,将选择值返回
       */
      let object = {};
      object[option.label] = e.childNodes[1].innerHTML;
      object[option.value] = e.childNodes[2].innerHTML;
      selectCallback(object);
      closeWebTree();
      if (option.isReset) {
        element.innerHTML = "";
        initWebTree(webTreeID, jsonArray, option);
      }
    }
    let childicon = "";
    // console.log(e.parentElement.childNodes[1].childNodes[0].className);
    if (e.parentElement.childNodes[1].childNodes[0] != undefined) {
      childicon = e.parentElement.childNodes[1].childNodes[0];
      if (childicon.className.indexOf("tree-open") != -1) {
        childicon.classList.remove("tree-open");
      } else {
        childicon.className += " tree-open";
      }
    }
  }

  //li中的a元素的点击事件
  function webTreeAclick(el, event) {
    event.stopPropagation(); //阻止冒泡
    // console.log(e.parentElement.childNodes);
    /**
     * 点击a标签时,直接触发全局回调函数
     */
    let object = {};
    object[option.label] = el.parentElement.childNodes[1].innerHTML;
    object[option.value] = el.parentElement.childNodes[2].innerHTML;
    selectCallback(object);
    closeWebTree();
    if (option.isReset) {
      element.innerHTML = "";
      initWebTree(webTreeID, jsonArray, option);
    }
  }

  /**
   * webTree初始化配置
   * @param {Object} userOption 用户自定义配置
   */
  function webTreeSetOption(userOption) {
    if (userOption.width != undefined) {
      option.width = userOption.width;
    }
    if (userOption.label != undefined) {
      option.label = userOption.label;
    }
    if (userOption.value != undefined) {
      option.value = userOption.value;
    }
    if (userOption.child != undefined) {
      option.child = userOption.child;
    }
    if (userOption.resize != undefined && userOption.resize == true) {
      option.resize = true;
      element.style.resize = "auto";
    }
    if (userOption.isReset != undefined && userOption.isReset == false) {
      option.isReset = false;
    }
  }

  /**
   * 插件名称-webTree
   * 创建时间-2021-01-31
   * 作者-Xueliang.Zhai
   * 耗费时间-4~5小时
   * 版本-v0.0.2
   */
  const webTree = {
    webTreeSetOption,
    openWebTree,
    webTreeValue
  }

  if(typeof module != undefined && module.exports){
      module.exports = webTree
  }else{
      window.webTree = webTree;
  }
})(window, document);
