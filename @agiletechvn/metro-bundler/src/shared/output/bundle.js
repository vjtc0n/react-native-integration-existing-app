/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};
const path = require('path');
const Server = require('../../Server');

const meta = require('./meta');
const relativizeSourceMap = require('../../lib/relativizeSourceMap');
const writeFile = require('./writeFile');





function buildBundle(packagerClient, requestOptions) {
  if (requestOptions.exclude) {
    const manifest = require(path.resolve(process.cwd(), requestOptions.exclude));
    requestOptions.excludedModules = manifest.modules;
    requestOptions.startId = manifest.lastId ? manifest.lastId + 1 : 0;
  }

  return packagerClient.buildBundle(_extends({},
  Server.DEFAULT_BUNDLE_OPTIONS,
  requestOptions, {
    isolateModuleIDs: true }));

}

function createCodeWithMap(
bundle,
dev,
sourceMapSourcesRoot)
{
  const map = bundle.getSourceMap({ dev });
  const sourceMap = relativizeSourceMap(
  typeof map === 'string' ? JSON.parse(map) : map,
  sourceMapSourcesRoot);
  return {
    code: bundle.getSource({ dev }),
    map: sourceMap };

}

function saveBundleAndMap(
bundle,
options,
log)



{const

  bundleOutput =





  options.bundleOutput,encoding = options.bundleEncoding,dev = options.dev,sourcemapOutput = options.sourcemapOutput,sourcemapSourcesRoot = options.sourcemapSourcesRoot,manifestOutput = options.manifestOutput;

  log('start');
  const origCodeWithMap = createCodeWithMap(bundle, !!dev, sourcemapSourcesRoot);
  const codeWithMap = bundle.postProcessBundleSourcemap(_extends({},
  origCodeWithMap, {
    outFileName: bundleOutput }));

  const manifest = {
    modules: Object.create(null),
    lastId: -1 };

  bundle.getModules().forEach(module => {
    if (!module.polyfill && !module.virtual) {
      manifest.modules[module.name] = {
        id: module.id };

    }
    if (module.id && module.id > manifest.lastId) {
      manifest.lastId = module.id;
    }
  });
  if (manifest.lastId === -1) {
    delete manifest.lastId;
  }
  log('finish');

  log('Writing bundle output to:', bundleOutput);const

  code = codeWithMap.code;
  const writeBundle = writeFile(bundleOutput, code, encoding);
  const writeMetadata = writeFile(
  bundleOutput + '.meta',
  meta(code, encoding),
  'binary');
  Promise.all([writeBundle, writeMetadata]).
  then(() => log('Done writing bundle output'));

  const writePromises = [writeBundle, writeMetadata];
  if (sourcemapOutput) {
    log('Writing sourcemap output to:', sourcemapOutput);
    const map = typeof codeWithMap.map !== 'string' ?
    JSON.stringify(codeWithMap.map) :
    codeWithMap.map;
    const writeMap = writeFile(sourcemapOutput, map, null);
    writeMap.then(() => log('Done writing sourcemap output'));
    writePromises.push(writeMap);
  }

  if (manifestOutput) {
    log('Writing manifest output to:', manifestOutput);
    const writeManifest = writeFile(manifestOutput, JSON.stringify(manifest, null, 2), null);
    writeManifest.then(() => log('Done writing manifest output'));
    writePromises.push(writeManifest);
  }

  return Promise.all(writePromises);
}

exports.build = buildBundle;
exports.save = saveBundleAndMap;
exports.formatName = 'bundle';