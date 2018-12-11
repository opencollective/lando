'use strict';

// Modules
const _ = require('lodash');

// Builder
module.exports = {
  name: 'dotnet',
  config: {
    version: '2',
    supported: ['2', '2.0', '1', '1.1', '1.0'],
    patchesSupported: true,
    legacy: ['1', '1.1', '1.0'],
    command: 'tail -f /dev/null',
    path: [
      '/usr/local/sbin',
      '/usr/local/bin',
      '/usr/sbin',
      '/usr/bin',
      '/sbin',
      '/bin',
    ],
    ssl: false,
    volumes: [
      '/usr/local/bin',
      '/usr/local/share',
      '/usr/local/bundle',
      '/var/www/.asp',
    ],
  },
  parent: '_appserver',
  builder: (parent, config) => class LandoDotNet extends parent {
    constructor(id, options = {}) {
      options = _.merge({}, config, options);
      // Make sure our command is an array
      if (!_.isArray(options.command)) options.command = [options.command];
      options.command = options.command.join(' && ');
      // Build the nodez
      const dotnet = {
        image: `microsoft/dotnet:${options.version}-sdk-jessie`,
        environment: {
          PATH: options.path.join(':'),
          ASPNETCORE_URLS: 'http://+:80',
        },
        ports: (options.command !== 'tail -f /dev/null') ? ['80'] : [],
        volumes: options.volumes,
        command: `/bin/sh -c "${options.command}"`,
      };
      // Send it downstream
      super(id, options, {
        services: _.set({}, options.name, dotnet),
        volumes: _.set({}, 'data', {}),
      });
    };
  },
};
