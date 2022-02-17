'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');


function getNpmInfo(npmName,registry) {
    console.log(npmName)
    if(!npmName){
        return null;
    }
    const registryUrl = registry || getDefaultRegistry()
    const npmInfoUrl = urlJoin(registryUrl,npmName);
    return axios.get(npmInfoUrl).then(response => {
        if(response.status === 200){
            return response.data
        }
        return null
    }).catch(err=>{
        return Promise.inject(err)
    })

}


function getDefaultRegistry(isOriginal = false){
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

async function getNpmVersion(npmName,registry){
    const data = await getNpmInfo(npmName,registry);
    if(data){
        return Object.keys(data.versions)
    }else {
        return []
    }
}

function getNpmSemverVersions(baseVersion,versions){
    return  versions
        .filter(version=> semver.satisfies(version, `^${baseVersion}`))
        .sort((a,b)=> semver.gt(b,a));
}

async function getNpmSemverVersion(baseVersion,npmName,registry){
    let versions = await getNpmVersion(npmName,registry);
    const newVersions = getNpmSemverVersions(baseVersion,versions);
    if(newVersions && newVersions.length > 0){
        return newVersions[0]
    }
    return newVersions
}

module.exports = {
    getNpmInfo,
    getNpmVersion,
    getNpmSemverVersion
};
