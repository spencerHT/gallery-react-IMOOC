require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import {findDOMNode} from 'react-dom';
// 获取图片相关数据
var imageData = require('../data/imageData.json');

// 创建函数，将图片名信息转化成图片URL信息
let getImages = (imageDataArr) => {
    for (let i =0, j = imageDataArr.length; i<j; i++) {
        let singleImageData = imageDataArr[i];
        singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
}
imageData = getImages(imageData);

/*
 * 获取区间内的一个随机值
 */
let getRangeRandom = (low, high) => Math.ceil(Math.random() * (high - low) + low);


/*
 * 获取0-30deg 之前的一个任意正负值
 */
let gt30degRandom = () => (Math.random > 0.5 ? '': '-') + Math.ceil(Math.random() * 30);

class ImgFigure extends React.Component {
    constructor() {
        super();
    }
    /*
     * imgFigure的点击处理函数
     */
    handleClick = (e) => {
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center()
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let styleObj = {};

        // 如果props属性指定图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值并且不为0，添加旋转角度
        if (this.props.arrange.rotate) {
            (['Moz', 'ms', 'Webkit', '']).forEach((value) => {
                styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            });
        }

        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}
// 控制组件
class ControllerUnit extends React.Component{
    constructor() {
        super();
    }

    handleClick = (e) => {
        // 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        }
        else {
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    }
    render() {
        let controllerUnitClassName = 'controller-unit';
        // 如果所对应的是居中的图片，显示按钮的居中态
        if (this.props.arrange.isCenter) {
            controllerUnitClassName += ' is-center';
            // 如果同时对应的是翻转图片，显示控制按钮的翻转态
            if (this.props.arrange.isInverse) {
                controllerUnitClassName += ' is-inverse';
            }
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick} >
            </span>
        )
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgsArrangeArr: [
                // pos: {
                //     top: 0,
                //     left: 0
                // },
                // rotate: 0,
                // isInverse: false,
                // inCenter: false
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
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            {centerPos, hPosRange, vPosRange} = Constant,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            // 布置在上部区域范围的图片数组
            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), // 取0个或1个
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中 centerIndex 的图片,居中 centenIndex 图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true,
            isInverse: false
        }

        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() *  (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
            
        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach((value, index) => {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: gt30degRandom(),
                isInverse: false,
                isCenter: false
            }
        })
        // 布局左右两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null; // 通过k和i比较区分图片在左侧或是右侧
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            }
            else {
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: gt30degRandom(),
                isInverse: false,
                isCenter: false
            }
        }

        // 将上侧区域图片重新插入回图片数组对应位置
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        // 将中心区域图片重新插入回图片数组对应位置
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        // 设置 state 触发组件渲染
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        })
    }

    /*
     * 利用 rearrange 函数，居中对应index的图片
     * @param index，需要被居中的图片对应的图片信息数组的index值
     * @return {Function}
     */
    center = (index) => {
        return () => {
            this.rearrange(index);
        };
    }

    /*
     * 翻转图片
     * @param index 输入被执行 inverse 图片在数组内的index值
     * @return {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
     */

    inverse = (index) => {
        return () => {
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        };
    }

    // 组件加载以后，为每张图片计算位置的范围
    componentDidMount() {
        // 首先拿到舞台的大小
        let stageDOM = findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        // 拿到一个imgFigure的大小
        let imgFigureDOM = findDOMNode(this.refs.imgFigure0),
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
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }
    render() {
        let controllerUnits = [],
            imgFigures = [];
        imageData.forEach((value, index) => {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: '0',
                        top: '0'
                    },
                    rotate: 0,
                    isInverse: false,
                    inCenter: false
                }
            }
            imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
            controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        })
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
