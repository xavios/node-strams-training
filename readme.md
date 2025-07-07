## Node Typescript Skeleton

- use `yarn start` for hot reloading and constant executing on file changes
- use `yarn run debug` to launch the project in inspect mode. Attach from VS Code with the Attach command.
- run tests with `yarn run test` or with `yarn run test-watch`. Pass in individual file pathes with `yarn run test -- ./path-to/file.test.ts`
- run `yarn run execute` to build js files and execute with Node.

---

# Agenda

1. naive implementation to read a 5 BM file
2. streams and why they are useful
3. .pipe() and the shortcomings of it
4. pipeline()
5. await pipeline()
6. additional prerequisities
7. hands-on dev workshop for publisher

## Node JS streams

Node.js streams are great because they handle large amounts of data efficiently by
processing it in chunks instead of loading everything into memory at once. This makes
them ideal for tasks like reading files, handling HTTP requests, or working with real-time data.

Here’s why they’re useful:

Memory-efficient: Only small parts of data are processed at a time.
Faster performance: Data can be processed as it’s received, reducing latency.
Composable: Streams can be piped together (e.g., read → transform → write), making code modular and clean.
Built-in support: Node.js has native stream modules, so no extra libraries are needed.

### Types of Node JS stream

Readable streams: emit data in chunks, that can be consumed. Ie.: fs.createReadStream()
Writable streams: acceps data in chunks to be written. Ie.: fs.createWriteStream()
Duplex streams: Both readable and writeable. Ie.: TCP sockets
Transform streams: special type of duplex stream that can modify the data as it is written / read.
ie.: zlib.createGzip()

Each stream type is built on the same base API, making them easy to work with and compose using .pipe().
Having the .pipe() function on all streams enables an unified, composable and declerative way
to build data-processing pipelines (think about Unix pipelines) across all types of streams.

All type of stream can be connected like LEGO pieces, clearly expressing intent of data flow.

```js
readStream.pipe(jsonParserDuplex).pipe(arrayStreamerDuplex);
```

Additionally each of the streams in a pipe() chain is a pure, testable unit itself.

TODO: check `streamingDataProcessing()` function and identify the different type of streams.
TODO: check the error handling of the pipe() chaining in the code under these TODOs:
'pipe() chaining error handling'

### pipeline()

The pipeline() function in Node.js is incredibly useful because it simplifies and secures
the process of connecting multiple streams together, especially when dealing with asynchronous
errors and backpressure.

In a pipeline any error can be propagated to the final callback - making the code more robust and safer.
pipeline() is returning a promise, so you can await the result of a pipeline run.

If we are using the `await pipeline()` from "node:stream/promises" we are then introducing a
blocking behaviour whcih prevents parallelism. In contrast, a naive in-memory transformation
might process everything in a tight loop, leveraging CPU cache and avoiding async overhead.

| Approach                     | Best For                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| `await pipeline()` + streams | Large files, low memory usage, clean async error handling    |
| `.pipe()` chains             | Performance-critical pipelines with native stream support    |
| In-memory transforms         | Small/medium files where speed is more important than memory |

Other parts for the Dev Workshop could include:

- Install azure-cli and use it for downloading some blobs
- using xq and jq to measure the amount of the products that are serialised into the feeds
  `cat cz-2025-07-04-google.xml| xq -j | jq '.feed.entry[].id' | wc -l`
