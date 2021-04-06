# webTree开发思路

## 1、非懒加载

```js
//使用者直接传入一个包含所有节点的json数组
//然后使用$webTree.create()方法初始化树控件,并配置一些参数
$webTree.create('webTree',jsonArray,{
	label:'label',//jsonArray的label名称
	value:'value',//jsonArray的value名称
	child:'child',//jsonArray的child名称
	width:'180px',//树控件的最小宽度
	height:'300px',//树控件的高度
	resize:true,//是否可以拖动改变大小(注:即使开启此项,宽度也无法小于width)
	lazy:false,//非懒加载
});

//在树控件初始化时,会根据jsonArray数组的第一级节点来创建相应数量的li
//然后查询如果一级节点中有二级节点的数组,会在一级节点的li中创建一个ul元素
//然后将此一级节点的所有二级节点渲染到ul中,如此循环往复,直至所有节点都不含有子级节点为止
function $webTreeGetHtml(item,tree,hasChild){
    //...
    lihtml += $webTreeGetHtml(item.array[i],tree);
    //...
}

//在每一个ul元素渲染完成后,会给li下的span和a标签添加监听点击的事件
//如果点击span标签后,此节点没有下一级节点时,会触发$webTree.callback()函数,并返回相应值
//如果点击a标签时,则直接触发回调函数,返回相应值
function appendClickEvent(ele){
    //...
    spans[i].addEventListener('click',function(e){
        //...
    })
    //...
    links[i].addEventListener('click',function(e){
        //...
    })
    //...
}
function $webTreeSpanClick(e){
    //...
    $webTreeLinkClick(e.children[0]);
    //...
}
function $webTreeLinkClick(e){
    //...
    $webTree.callback(lastobj);
    $webTree.hide();
    //...
}
```

2、懒加载

```js
//开启懒加载模式时,其大部分思路和(1)中保持了一致
//首先也是先渲染一级节点,然后通过配置参数中的lazyAjax方法获取二级节点的值
```

