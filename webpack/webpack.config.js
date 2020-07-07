const path = require("path");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.css$/, //筛选适用于该rule的文件的pattern
            use: [
                //用于处理css文件的loader，调用顺序是由后往前
                //先调用css-loader, 然后style-loader
                'style-loader',
                'css-loader',
            ],

        }, { //加载图片的loader
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader', //只是加载文件，相当于copy，并改为hash命名
            ],

        }, { //字体的加载
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader',
            ]
        }, {
            //tsv: tab separated values
            //csv: comma separated values
            //纯文本格式的电子表格的加载
            test: /\.(tsv|csv)$/,
            use: [
                'csv-loader',
            ]
        }, {
            //xml可拓展标记语言文件的加载
            test: /\.xml$/,
            use: [
                'xml-loader',
            ]
        }],
    },
}