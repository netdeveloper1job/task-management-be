import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const multerConfig = {
  dest: 'upload',
};

function uuidRandom(file) {
  const result = `${uuid()}${extname(file.originalname)}`;
  return result;
}

export const multerOptions = {
  limits: {
    fileSize: 10485760,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|csv)$/)) {
      cb(null, true);
    } else if (file.mimetype.match(/\/(mpeg|mp4)$/)) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(
        new HttpException(
          `Unsupporyted file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const myArray = req.path.split('/');
      const dest = myArray[1];
      const uploadPath = `${multerConfig.dest}`;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, uuidRandom(file));
    },
  }),
};
