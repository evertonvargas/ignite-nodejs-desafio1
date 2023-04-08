import { parse } from "csv-parse";
import fs from "node:fs";

const csvPath = new URL("../file.csv", import.meta.url);

const options = {
  delimiter: ",",
  from_line: 2,
  skip_lines_with_error: true,
};

const readCSV = async () => {
  const readStream = fs.createReadStream(csvPath);
  const parseStream = readStream.pipe(parse(options));

  for await (const line of parseStream) {
    const [title, description] = line;

    fetch("http://localhost:4000/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
      duplex: "half",
    });
  }
};

readCSV();
