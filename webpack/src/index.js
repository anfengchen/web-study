import _ from 'lodash';
//引入css文件的语法，而它的实现会调用webpack.config.js中
//设置的rule
import './style.css';

//引入图片的语法，把图片转换为一个对象，
//它的实现会调用webpack.config.js中的rule
import catHouse from "./cat-house.jpg";

//载入xml文件，调用xml-loader来加载
import Data from './data.xml';


function component() {
    const element = document.createElement('div');

    //Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add("hello");

    //Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = catHouse; //相当于myIcon.src="./cat-house.jpg"

    element.appendChild(myIcon);

    console.log(Data);
    return element;
}
document.body.appendChild(component());