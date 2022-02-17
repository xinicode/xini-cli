
module.exports = core;
const path = require('path');
const colors = require('colors');
const semver = require('semver');
const pkg = require('../package.json');
const constant = require('./const');
const log = require('@xini-cli/log');
const init = require('@xini-cli/init');
const rootCheck  = require('root-check');
const pathExists = require('path-exists').sync;
const userHome = require('user-home');
const minimist = require('minimist');
const commander = require('commander');
const { getNpmSemverVersion } = require('@xini-cli/get-npm-info');
const exec = require('@xini-cli/exec')
const program = new commander.Command();

function core(){
    try {
        createDafaultConfig();
        // checkInputArgs();
        // checkVersion()
        checkNodeVersion()
        checkRoot();
        rootCheck();
        checkEnv();
        registeryCommand();

        // checkGlobalUpdate();
        // checkUserHome();
    } catch (e) {
        log.error(e.message)
    }
}


function registeryCommand(){
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启调试模式', false)
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

    program
        .command('init [projectName]')
        .option('-f, --force','是否强制初始化项目!')
        .action(exec)


    // 开启debug模式
    program.on('option:debug', function() {
        if (program.debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;

    });

    // 对未知命令监听
    program.on('command:*',function(obj){
        const availableCommands = program.commands.map(cmd => cmd.name());
        log.warn(`未知命令${obj[0]}`)
        if (availableCommands.length > 0) {
            log.warn(colors.red('可用命令：' + availableCommands.join(',')));
        }
    })

    program.on('option:targetPath',function(){
        process.env.CLI_TARTGET_PATH = program.targetPath;
    })

    program.parse(process.argv)

    //无任何命令的情况
    if (!program.debug && program.args && program.args.length < 1) {
        program.outputHelp();
        console.log();
    }
}




async function prepare(){
    checkVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
    await  checkGlobalUpdate();
}

function checkUserHome() {
    if(!userHome || pathExists(userHome)){
        throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}

function checkRoot(){
    rootCheck()
}

function checkNodeVersion(){
    let currentVersion = process.versions.node;
    let lowestVersion = constant.LOWEST_NODE_VERSION;
    if(!semver.gte(currentVersion,lowestVersion)){
        throw new Error(colors.red(`版本不能低于${lowestVersion}`))
    }
}

function checkVersion() {
    // require('npmlog').info('cli','aaa');
    log.success('sucess',pkg.version)
}

function checkInputArgs(){
    _args = minimist(process.argv.slice(2));
    checkArgs();
}

function checkArgs(){
    if(_args.debug){
        process.env.LOG_LEVEL = 'verbose';
    }else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

function checkEnv(){
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome,'.env');
    if(pathExists(dotenvPath)){
        dotenv.config({
            path: dotenvPath
        });
    }
    log.verbose('env',process.env.CLI_HOME_PATH);
}

function createDafaultConfig(){
    const cliConfig = {
        home: userHome
    };
    if(process.env.CLI_HOME){
        cliConfig['cliHome'] = path.join(userHome,process.env.CLI_HOME);
    }else {
        cliConfig['cliHome'] = path.join(userHome,constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

async function checkGlobalUpdate(){
    let currentVersion = pkg.version;
    let currentName = pkg.name;

    let lastVersion = await  getNpmSemverVersion(currentVersion,currentName)
    if(lastVersion && semver.gt(lastVersion,currentVersion)){
        log.warn(colors.yellow(`请手动更新${currentName},当前版本${currentVersion},最新版本${lastVersion},更新命令:npm install  -g ${currentName}`));}
}
















































