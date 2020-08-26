const multer = require('multer');
const path = require('path');
const hashHelper = require('./otherhelpers');
/**
 * Uploads files from the frontend to the destination directory.
 *
 * @param filePath - The destination path for the files.
 */
const fileUploadHelper = (filePath) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.resolve(filePath);
      try {
        if (uploadPath) {
          cb(null, uploadPath);
        } else {
          cb(null, '');
        }
      } catch (err) {
        cb(err);
      }
    },
    filename: async (req, file, cb) => {
      const randomString = await hashHelper.generateRandomHexString(15);
      cb(null, `${randomString}-${file.originalname}`);
    },
    onFileUploadStart: (file) => {
      const recentFile = file;
      recentFile.finished = false;
    },
    onFileUploadComplete: (file) => {
      const recentFile = file;
      recentFile.finished = true;
    },
  });
  const upload = { uploader: multer({ storage }) };
  return upload;
};

module.exports = fileUploadHelper;
