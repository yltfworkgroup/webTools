```js
//<div id="callboard"> <ul> <li>123</li><li>456</li><li>789</li> </ul> </div>
//用法
$box.initElement(
    document.getElementById('callboard'),
    document.getElementsByTagName('ul')[0],
    document.getElementsByTagName('ul')[0].getElementsByTagName('li')
);
$box.run();
