## Node Typescript Skeleton

- use `yarn start` for hot reloading and constant executing on file changes
- use `yarn run debug` to launch the project in inspect mode. Attach from VS Code with the Attach command.
- run tests with `yarn run test` or with `yarn run test-watch`. Pass in individual file pathes with `yarn run test -- ./path-to/file.test.ts`
- run `yarn run execute` to build js files and execute with Node.

## Node Streams training

In order to understand the core principles and ideas of stream processing.

- dev workshop like what we have done with the Online Club would be quite usuable
- with some example project make sense of
- node js streams (readable, writeable, duplex, transform)
- why use streams?
  memory efficiency, faster processing of large data (1.7gb UK export)
  great for real time data
- node:stream/promises
- chunking - highWaterMark
- json data streaming form a big big json file
  const { parser } = require('stream-json');
  import JsonlParser from 'stream-json/jsonl/Parser.js';

using xq and jq to measure the amount of the products that are serialised into the feeds
cat cz-2025-07-04-google.xml| xq -j | jq '.feed.entry[].id' | wc -l
Install azure-cli and use it for downloading some blobs
