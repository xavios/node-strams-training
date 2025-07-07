import * as fs from "fs";
import { pipeline, Readable } from "stream";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { stringer } from "stream-json/jsonl/Stringer";
import * as beautify from "json-beautify";

type EmployeeCore = {
  name: string;
  language: string;
  id: string;
};

const filePath = "data/5MB-min.json";

export const naiveImplementation = () => {
  const data = fs.readFileSync(filePath, "utf8");
  const jsonContent = JSON.parse(data);
  const filteredData = jsonContent.map(
    (employee: EmployeeCore): EmployeeCore => {
      return {
        id: employee.id,
        name: employee.name,
        language: employee.language,
      };
    }
  );
  // @ts-ignore
  const text = beautify(filteredData, null, 2, 100);
  fs.writeFileSync("data/5MB-naive.json", text);
};

export const streamingDataProcessing = () => {
  const readStream = fs.createReadStream(filePath, "utf-8");

  // parse() - core straming JSON parser
  //
  // reads raw JSON from the fs readstring and emits a stream of tokens
  // like {key}, {value}, {startArray}, {endObject}, etc.
  //
  // it parses the file incrementailly, does not load the whole file into memory.
  const jsonParserDuplex = parser();

  // awaits full json entries in a an array, and emits them once collected.
  // receives the tokens and waits for a full object that is in an array.
  const arrayStreamerDuplex = streamArray();

  readStream.pipe(jsonParserDuplex).pipe(arrayStreamerDuplex);

  /* 
        async generator function 
        perfect for working with streams or iterators, that produce data over time.

        source is expected to be an async iterable (stream of parsed json objects)
        await .. of is used to asnychronously iterate through chunks
        value is a produced single item in the source

        yield sends the new object to the next step in the pipeline asynchronously
  */
  const transformStream = async function* (source: any) {
    for await (const { value } of source) {
      // TODO: pipe() chaining error handling #1
      // Uncomment the lines that create an error, and observe
      // how the .pipe() chaining does not catches the errors thrown from streams.
      // Each stream needs to handle the errors one-by-one.
      //
      // if (value.id % 2 != 0) {
      //   throw new Error(
      //     "manually thrown error, that is not handled by default by the .pipe() chaining"
      //   );
      // }
      yield {
        id: value.id,
        name: value.name,
        language: value.language,
      };
    }
  };

  const transformReadable = Readable.from(transformStream(arrayStreamerDuplex));

  // TODO: pipe() chaining error handling #2
  // Observe, how the error is caught for the single stream.
  transformReadable.on("error", (err) => {
    if (err) {
      console.log("Error from the transform stream caught", err);
    }
  });

  const writeStream = fs.createWriteStream("data/5MB-stream.json");
  // stringer() takes Javascript objects and serializes them into JSON strings, chunk by chunk
  const stringerDuplex = stringer();

  transformReadable
    .pipe(stringerDuplex)
    .pipe(writeStream)
    .on("error", (err) => {
      console.error("Stream failed:", err);
    });
};

export const streamingPipelineImplementation = async () => {
  await pipeline(
    fs.createReadStream(filePath, "utf-8"),
    parser(),
    streamArray(),
    async function* (source: { value: EmployeeCore }[]) {
      for await (const { value } of source) {
        yield {
          id: value.id,
          name: value.name,
          language: value.language,
        };
      }
    },
    stringer(),
    fs.createWriteStream("data/5MB-stream.json"),
    (err) => {
      if (err) {
        console.error("Pipeline failed:", err);
      }
    }
  );
};
