import fs from "node:fs";
import { parse } from "csv-parse";

const path = new URL("../tasks.csv", import.meta.url);;

export const proccessFile = async () => {
  const records = [];
  const parser = fs.createReadStream(path)
                  .pipe(parse({
                    from_line: 2,
                    delimiter: ","
                  }));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
};