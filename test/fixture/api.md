# Demo

-   category: Components
-   chinese: 测试
-   type: 表单

## Guide

hello world

## API

| 属性 | 说明    | 类型 | 默认值   |
| :------------- | :------------- |:------------- |:------------- |
| type | 设置类型，可选值为 normal 或者 inline | String | normal |
| onChange | 数值被改变的事件, `function(value:Number, e:Event)` |Function |
| editable | 用户是否可以输入 | bool | true
| step | 步长 | number | 1
| min | 最小值 | number | 0
| max | 最大值 | number | 100
| value | 当前值 | number | null
| defaultValue | 默认值 | number | 0
| disabled | 禁用 | boolean | false
| inputWidth | 输入框的宽度 | Number/String |
| onDisabled | 按钮被禁用时候点击的回调, `function(e:Event)` | Function |
| onCorrect | 数值订正后的回调, `function({currentValue,oldValue:String})` |Function |
