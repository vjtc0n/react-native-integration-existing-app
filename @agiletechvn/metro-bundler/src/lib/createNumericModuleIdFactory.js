/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 */

"use strict";
const crypto = require("crypto");

function createNumericModuleIdFactory(startId) {
  return module => module.localPath;
  // const fileToIdMap = new Map();
  // let nextId = startId;
  // return module => {
  //   module.localPath
  //   if (!fileToIdMap.has(module.path)) {
  //     fileToIdMap.set(module.path, nextId);
  //     nextId += 1;
  //   }
  //   return fileToIdMap.get(module.path);
  // };
}

module.exports = createNumericModuleIdFactory;
