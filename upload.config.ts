// upload.config.ts
import { diskStorage } from 'multer';
import type { File } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import type { FileFilterCallback } from 'multer';

export function articleImageUploadOpts() {
  return {
    storage: diskStorage({
      destination: './uploads/article-images',
      filename: (
        _req: Request,
        file: File,
        callback: (error: Error | null, filename: string) => void
      ) => {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        callback(null, `article-${suffix}${ext}`);
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024, // max 2 Mo
    },
    fileFilter: (
      _req: Request,
      file: File,
      callback: FileFilterCallback
    ) => {
      if (!file.mimetype.match(/\/(jpe?g|png|gif)$/)) {
        // BadRequestException est une Error, donc OK pour FileFilterCallback
        return callback(
          new BadRequestException('Type de fichier non autorisé'),
          false
        );
      }
      callback(null, true);
    },
  };
}
