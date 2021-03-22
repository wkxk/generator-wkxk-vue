// 入口文件

const Generator = require('yeoman-generator')

const fs = require('fs')
const path = require('path')

module.exports = class extends Generator {
  // 发起问询
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      }
    ])
    .then(answer => {
      this.answer = answer
    })
  }

  writing () {
    // 获取模板文件夹所在路径 /Users/wkxk/Desktop/generator-wkxk-vue/generators/app/templates
    const path1 = this.templatePath()
    // 存储结果
    const result = []
    // 定义忽略文件
    const ignoreList = ['.DS_Store']
    // 读取文件方法
    const readFile = str => {
      // 根据文件夹路径读取对应的文件
      const arr = fs.readdirSync(str)
      // 遍历arr
      arr.forEach(filename => {
        // 拼接文件的绝对路径
        const filedir = path.join(str, filename);
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        const stats = fs.statSync(filedir)
        // 判断文件是否为文件夹stats.isDirectory()
        // 判断文件是否为文件stats.isFile()
        const isDir = stats.isDirectory()
          if (isDir) {
            // 如果是文件夹，递归获取
            readFile(filedir)
          } else {
            // 如果是文件，处理成文件的相对路径，追加到数组中
            const filePath = filedir.replace(`${this.templatePath()}/`, '')
            result.push(filePath)
          }
      })
      return result.filter(val => !ignoreList.includes(val))
    }
    console.log(readFile(path1));
    // fs.readdirSync(folderPath)
    // const path = [
    //   'public/favicon.ico',
    //   'public/index.html',
    //   'src/assets/logo.png',
    //   'src/components/HelloWorld.vue',
    //   'src/App.vue',
    //   '.gitignore',
    //   'babel.config.js',
    //   'package-lock.json',
    //   'package.json',
    //   'README.md'
    // ]
    result.forEach(item => {
      this.fs.copyTpl(this.templatePath(item), this.destinationPath(item), this.answer)
    })
  }

}