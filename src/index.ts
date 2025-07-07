import {
  naiveImplementation,
  streamingPipelineImplementation,
  streamingDataProcessing,
} from "./node-streams/index";

try {
  main();
} catch (err) {
  console.log(err);
}

async function main() {
  console.log("Hello Node JS streams learning together sample app!");
  console.time("Naive (in memory) 5MB json transformation");
  naiveImplementation();
  console.timeEnd("Naive (in memory) 5MB json transformation");

  console.time("Streaming 5MB json transformation");
  streamingDataProcessing();
  console.timeEnd("Streaming 5MB json transformation");

  console.time("Streaming pipeline 5MB json transformation");
  await streamingPipelineImplementation();
  console.timeEnd("Streaming pipeline 5MB json transformation");
}
