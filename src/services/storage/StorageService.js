import fs from "fs";

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  }

  writeFile(file, meta) {
    const originalString = meta.filename;
    const modifiedString = originalString.split(" ").join("-").toLowerCase();

    const filename = +new Date() + modifiedString;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      file.pipe(fileStream);
      file.on("end", () => resolve(filename));
    });
  }
}

export default StorageService;
