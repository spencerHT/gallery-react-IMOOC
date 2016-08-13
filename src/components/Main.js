require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import {findDOMNode} from 'react-dom';
// 获取图片相关数据
var imageData = require('../data/imageData.json');

// 创建函数，将图片名信息转化成图片URL信息
let getImages = function(imageDataArr) {
    for (let i =0, j = imageDataArr.length; i<j; i++) {
        let singleImageData = imageDataArr[i];
        singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
}
imageData = getImages(imageData);

class ImgFigure extends React.Component {
    render() {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption>
                    <p className="img-title">{this.props.data.title}</p>
                </figcaption>
            </figure>
        )
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgsArrangeArr: [
            ]
        };
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: { // 水平方向取值范围
                leftSecX: [0,0],
                rightSecX: [0,0],
                y: [0,0]
            },
            vPosRange: { // 垂直方向取值范围
                x: [0,0],
                topY: [0,0]

            }
        }
    }
    /*
     *  重新布局所有图片
     *  @param centerIndex 指定居中排布哪个图片
     */
    rearrange(centerIndex) {
    }


    // 组件加载以后，为每张图片计算位置的范围
    componentDidMount() {
        // 首先拿到舞台的大小
        let stageDOM = findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil( stageW / 2),
            halfStageH = Math.ceil( stageH / 2);
        // 拿到一个imgFigure的大小
        let imgFigureDOM = findDOMNode(this.refs.ImgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        // 计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
        // 计算左侧，右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        // 计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfImgW - imgW;
        this.Constant.vPosRange.x[1] = halfImgW;

        this.rearrange(0);
    }
    render() {
        let controllerUnits = [],
            imgFigures = [];
        imageData.forEach(function (value, index) {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: '0',
                        top: '0'
                    }
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} />)
        }.bind(this))
        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
