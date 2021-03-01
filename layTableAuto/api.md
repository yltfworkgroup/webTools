```js
//自动生成表格的基本配置
let GenerateOption = {
    maxCountExistInHeader: false,//列表接口的请求值是否在header中返回,如果为真则调用xhr.getRequestHeader函数获取请求头,目前只能获取totalCount字段值
    //获取表格数据-向服务器请求的参数,reqPage与reqSize不能写在reqOther中
    listReqdata: {
        reqPage: { key: 'pageIndex', value: 1 },
        reqSize: { key: 'pageSize', value: 10 },
        reqOther: [
            { key: 'sort', value:'desc' }
        ],
        reqDataType: 'formData'//请求列表的数据格式,暂时只有formData与json两种类型
    },
    //获取表格数据-向服务器请求的地址
    listRequrl: '我是表格数据的url',
    listResponse: function (res, xhr, callback) {//列表页请求数据后的回调
        if (res.state == 200) {
            layui.layer.msg('请求成功', {
                time: 1000
            });
        } else {
            layui.layer.msg('请求失败', {
                time: 1000
            });
        }
        callback(res, xhr);//数据处理完成后必须要调用此回调,否则表格无法渲染
    },
    //动态创建html模板
    module: {
        name: ['rowCtrl'],//模板的id
        elementArray: [[//右侧操作工具栏-如果tableRowCtrl为true则可直接显示
            { tag: 'a', class: 'layui-btn layui-btn-xs layui-icolayui-icon-form', 'lay-event': 'detail', htmlText: '查看' },
        ]]
    },
    rowToolCallback: function (event, row) {//监听表格右侧行按钮的点击事监听lay-event=""
        if (event == 'detail') {//查看详情

        }
    },
    headToolCallback: function (event) {//layui.table头部工具栏点击事件
        if (event == "multiDel") 
        }
    },
    tableRowCtrl: true,//开启每行的右侧操作菜单
    tableToolsbar: true,//开启头部的工具菜单
    //tableToolsbarTop为左上角工具菜单样式,lay-event=""必填
    // tableToolsbarTop:'<div class="layui-table-tool-tempstyle="display: flex;align-items: center;"><div class="layui-inlinelay-event="multiDel"><i class="layui-icon layui-icon-home"></i>div>批量删除</div>',
    tableToolsbarTop: true,
    tableColState: [ //layui.table的col属性
        {checkbox:true}
        { field: 'name', title: '名称' },
        //此处工具栏若固定,则只能固定在右侧,否则会渲染错误--待解决
        { toolbar: '#rowCtrl', title: '操作', width: 80, fixed: 'right'//右侧操作工具栏-toolbar为模板id,必传#号
    ]
}
//开始生成表格
layuiTbaleGenerate('layuiTablePage', GenerateOption, functio(autoLayuiTable) {
    autolayuiTbale = autoLayuiTable //layui.table对象
});