import {
  naiveImplementation,
  streamingImplememntation,
} from "./node-streams/index";

try {
  main();
} catch (err) {
  console.log(err);
}

function main() {
  console.log("Hello Node JS streams learning together sample app!");
  console.time("Naive (in memory) 5MB json transformation");
  naiveImplementation();
  console.timeEnd("Naive (in memory) 5MB json transformation");

  console.time("Streaming  5MB json transformation");
  streamingImplememntation();
  console.timeEnd("Streaming  5MB json transformation");
}
