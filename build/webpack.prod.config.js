const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const cleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const CompressionPlugin = require("compression-webpack-plugin");
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});
const time = new Date().getTime();
module.exports = merge(webpackBaseConfig, {
    output: {
        path: path.resolve(__dirname, `../dist/${time}`),
        publicPath: `https://cdn.dmh.bjhzkq.com/cdnppxhs/dist/${time}/`,    
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    externals: {
        'vue': 'Vue',
        'axios':'axios',
    },
    plugins: [
        // new cleanWebpackPlugin(['dist/*'], {
        //     root: path.resolve(__dirname, '../')
        // }),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // name: 'vendors',
            // filename: 'vendors.[hash].js',
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false
              }
            },
            sourceMap: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'td_icon.ico'
            },
            {
                from: 'src/styles/fonts',
                to: 'fonts'
            },
            {
                from: 'src/views/my-components/text-editor/tinymce'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'iView admin v' + package.version,
            favicon: './td_icon.ico',
            filename: '../index.html',
            template: '!!ejs-loader!./src/template/index.ejs',
            inject: false
        }),
        // 压缩js代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            // 排除关键字，不能混淆
            except:['$','exports','require']
        }),
    ]
});

// 删除目录
function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
  }
  
  
  // 删除 num run build 编译出来的目录
  function deleteOtherDir() {
    // 只保留最近的x个版本
    const RetainVersionNum = 5;
    let webapp_paths = fs.readdirSync(path.join(process.cwd(), 'dist'));
    webapp_paths = webapp_paths.filter(item => {
        if (item !== 'index.html') {
            return parseInt(item);
        }
    });
  
    webapp_paths = webapp_paths.sort();
    if (webapp_paths.length > RetainVersionNum) {
        let delete_webapp_paths = webapp_paths.slice(0, webapp_paths.length - RetainVersionNum);
        delete_webapp_paths.forEach(delete_webapp_path => {
            let delete_webapp_abs_path = path.join(process.cwd(), 'dist', delete_webapp_path);
            // console.log('delete_webapp_abs_path -->', delete_webapp_abs_path);
            deleteFolder(delete_webapp_abs_path)
        })
    }
  }
  deleteOtherDir();