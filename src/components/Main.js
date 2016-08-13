require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关数据
let imageData = require('../data/imageData.json');

// 创建函数，将图片名信息转化成图片URL信息
let getImages = function(imageDataArr) {
    for (let i =0, j = imageDataArr.length; i<j; i++) {
        let singleImageData = imageDataArr[i];
        singleImageData.imageUrl = require("../images/" + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
}
imageData = getImages(imageData);

class AppComponent extends React.Component {
  render() {
    return (
        <section className="stage">
            <section className="img-sec">
            </section>
            <nav className="controller-nav">
            som
            </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
