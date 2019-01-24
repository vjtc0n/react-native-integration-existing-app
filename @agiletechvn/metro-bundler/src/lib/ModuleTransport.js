/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @format
 */

'use strict';














class ModuleTransport {










  constructor(data)









  {
    this.name = data.name;

    assertExists(data, 'id');
    this.id = data.id;

    assertExists(data, 'code');
    this.code = data.code;

    assertExists(data, 'sourceCode');
    this.sourceCode = data.sourceCode;

    assertExists(data, 'sourcePath');
    this.sourcePath = data.sourcePath;

    this.virtual = !!data.virtual;
    this.meta = data.meta;
    this.polyfill = !!data.polyfill;
    this.map = data.map;

    Object.freeze(this);
  }}


module.exports = ModuleTransport;

function assertExists(obj, field) {
  if (obj[field] == null) {
    throw new Error('Modules must have `' + field + '`');
  }
}