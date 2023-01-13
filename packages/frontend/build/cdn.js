const {spawnSync} = require('child_process')

let depsCache

const listDependencies = function () {
  if (depsCache !== undefined) return depsCache

  const rawDeps = spawnSync('npm', ['list', '--json'])
  depsCache = JSON.parse(rawDeps.stdout)
  return depsCache
}

const getVersion = function (cdnModule) {
  let curr = listDependencies()
  cdnModule.dependedBy.forEach(function (dep) {
    curr = curr.dependencies[dep]
  })
  return curr.dependencies[cdnModule.moduleName].version
}

const buildScriptURL = function (cdnModule) {
  const version = getVersion(cdnModule)
  return `https://cdnjs.cloudflare.com/ajax/libs/${cdnModule.libraryName}/${version}/${cdnModule.scriptPath}`
}

const buildCSSURL = function (cdnModule) {
  const version = getVersion(cdnModule)
  return `https://cdnjs.cloudflare.com/ajax/libs/${cdnModule.libraryName}/${version}/${cdnModule.cssPath}`
}

module.exports = {buildScriptURL, buildCSSURL}
