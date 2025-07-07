import {
  naiveImplementation,
  streamingPipelinePromiseImplementation,
  streamingDataProcessing,
  streamingPipelineImplementation,
} from "./node-streams/index";

try {
  main();
} catch (err) {
  console.log(err);
}

async function main() {
  console.log("Hello Node JS streams learning together sample app!");
  console.log();
  console.log();

  console.time("Naive (in memory) 5MB json transformation");
  naiveImplementation();
  console.timeEnd("Naive (in memory) 5MB json transformation");
  console.log();

  console.time("Streaming 5MB json transformation");
  streamingDataProcessing();
  console.timeEnd("Streaming 5MB json transformation");
  console.log();

  console.time("Streaming pipeline 5MB json transformation");
  streamingPipelineImplementation();
  console.timeEnd("Streaming pipeline 5MB json transformation");
  console.log();

  // This one is a lot smaller, but check the Readme.Md
  console.time("Streaming pipeline promise 5MB json transformation");
  await streamingPipelinePromiseImplementation();
  console.timeEnd("Streaming pipeline promise 5MB json transformation");
  console.log();
}
