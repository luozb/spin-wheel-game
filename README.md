# 幸运转盘游戏

一个基于原生 HTML、CSS 和 JavaScript 开发的交互式转盘抽奖游戏。

## 功能特点

- 🎨 精美的渐变色UI设计
- 🎯 流畅的旋转动画效果
- 📱 响应式设计，支持移动端
- 🎁 8个奖品选项（根据图片内容）

## 奖品列表

1. 三等奖
2. 谢谢惠顾
3. 感恩奖
4. 特等奖
5. 二等奖
6. 非非啦
7. 纸巾
8. 咖啡杯

## 使用方法

1. 用浏览器打开 `index.html` 文件
2. 点击"开始抽奖"按钮
3. 等待转盘停止，查看中奖结果

## 技术栈

- HTML5 Canvas
- CSS3 动画
- 原生 JavaScript

## 文件结构

```
spin-wheel-game/
├── index.html      # 主页面
├── style.css       # 样式文件
├── script.js       # 游戏逻辑
└── README.md       # 说明文档
```

## 自定义

您可以在 `script.js` 中修改奖品列表和颜色配置：

```javascript
const prizes = [
    '三等奖',
    '谢谢惠顾',
    // ... 更多奖品
];

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    // ... 更多颜色
];
```

## 浏览器支持

支持所有现代浏览器，包括：
- Chrome
- Firefox
- Safari
- Edge

## 许可证

MIT License
