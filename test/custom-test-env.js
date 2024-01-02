const environment = require('jest-environment-jsdom');

/**
 * a custom environment to set the TextEncoder that is required by tensorflow.js.
 */
module.exports = class customtestenvironment extends environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util');
      this.global.TextDecoder = TextDecoder;
    }
  }
};
