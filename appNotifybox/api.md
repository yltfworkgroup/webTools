```html
<div id="callboard">
    <ul>
        <li><span style="color:red;">通知一</span></li>
        <li><span style="color:red;">第二个通知</span></li>
        <li>通知3</li>
    </ul>
</div>

```js
//用法
$box.initElement(
    document.getElementById('callboard'),
    document.getElementsByTagName('ul')[0],
    document.getElementsByTagName('ul')[0].getElementsByTagName('div')
);
$box.run();
