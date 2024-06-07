const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create storage engine
export function upload() {
  const mongooseUrl = process.env.MONGOOSE_URL;
  const storage = new GridFsStorage({
    url: mongooseUrl,
    file: (req, file) => {
      return new Promise((resolve, _reject) => {
        const fileInfo = {
          filename: file.originalname,
          bucketName: "filesBucket",
        };
        resolve(fileInfo);
      });
    },
  });
  return multer({ storage });
}


module.exports = { upload };