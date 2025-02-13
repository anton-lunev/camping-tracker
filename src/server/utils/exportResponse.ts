import * as fs from "node:fs";
import path from "path";

export function exportResponse(jsonData: unknown, fileName: string) {
  try {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const filePath = path.resolve(
      __dirname.replace("[project]/", ""),
      "..",
      "..",
      "responses",
      `${fileName}.json`,
    );
    // 1. Extract the directory path from the filePath
    const directoryPath = path.dirname(filePath);

    // 2. Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      // 3. Create the directory if it doesn't exist (recursively)
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory "${directoryPath}" created.`);
    }
    console.log("saving response", filePath);
    fs.writeFileSync(filePath, jsonString);
  } catch (error) {
    console.error("Error saving response", error);
  }
}
