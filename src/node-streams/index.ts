import * as fs from "fs";
import { pipeline } from "stream";
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

export const streamingImplememntation = () => {
  pipeline(
    fs.createReadStream(filePath, "utf-8"),
    parser(),
    streamArray(),
    /* 
        async generator function 
        perfect for working with streams or iterators, that produce data over time.

        source is expected to be an async iterable (stream of parsed json objects)
        await .. of is used to asnychronously iterate through chunks
        value is a produced single item in the source

        yield sends the new object to the next step in the pipeline asynchronously
    */
    async function* (source) {
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
