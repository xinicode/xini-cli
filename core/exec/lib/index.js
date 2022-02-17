'use strict';

module.exports = exec;

const Package = require('@xini-cli/package')
const log = require('@xini-cli/log')

const SETTINGS = {
    init: '@xini-cli/init'
}

function exec() {
    const targetPath = process.env.CLI_TARTGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;

    const cmdObj = arguments[arguments.length -1];
    const cmdName = cmdObj.name()
    const packageName = SETTINGS[cmdName];
    const packageVersion =  'latest';
    const pkg = new Package(
        {
            targetPath,
            packageName,
            packageVersion
        }
    );
    console.log(arguments)


}
