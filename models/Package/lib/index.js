'use strict';

class Package {
    constructor(options) {
        console.log("~~~")
        if(!options){
            throw new Error('package类的options参数不能为空！')
        }
        if(!Object.prototype.toString.call(options)){
            throw new Error('package类的options参数必须为对象！')
        }
        let targetPath = options.targetPath;
        let storePath = options.storePath;
        console.log(targetPath)
        console.log(storePath)


    }


    update(){}
    getRootFilePath(){

    }
}
module.exports =  Package