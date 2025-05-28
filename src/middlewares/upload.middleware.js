import multer from 'multer';

/**
 * @param {{
 *  mimeTypes: (
 *    'application/pdf' |
 *    'application/msword' |
 *    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' |
 *    'image/jpeg' |
 *    'image/jpg' |
 *    'image/png' |
 *    'video/mp4' |
 *    'video/webm'
 *  )[];
 *  maxBytes: number;
 * }} options
 * @returns {multer.Multer}
 */
const upload = ({ mimeTypes, maxBytes }) => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (mimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const allowedExtensions = mimeTypes
          .map((mim) => mim.split('/')[1])
          .join(', ');
        cb(new Error(`Please upload only ${allowedExtensions} files.`), false);
      }
    },
    limits: { fileSize: maxBytes },
  });
};

export { upload };
