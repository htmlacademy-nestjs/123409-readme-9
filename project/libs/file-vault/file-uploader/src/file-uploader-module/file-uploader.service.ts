import 'multer';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ensureDir } from 'fs-extra';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import dayjs from 'dayjs';
import { extension } from 'mime-types';
import { randomUUID } from 'node:crypto';

import { FileVaultConfig } from '@project/file-vault-config';
import { FileUploaderRepository } from './file-uploader.repository';
import { StoredFile } from '@project/core';
import { FileUploaderFactory } from './file-uploader.factory';
import { FileUploaderEntity } from './file-uploader.entity';

@Injectable()
export class FileUploaderService {
  private readonly logger = new Logger(FileUploaderService.name);
  private readonly DATE_FORMAT = 'YYYY MM';

  constructor(
    @Inject(FileVaultConfig.KEY)
    private readonly config: ConfigType<typeof FileVaultConfig>,
    private readonly fileRepository: FileUploaderRepository
  ) {}

  private getUploadDirectoryPath(): string {
    return this.config.uploadDirectory;
  }

  private getDestinationFilePath(filename: string): string {
    return join(this.getUploadDirectoryPath(), this.getSubUploadDirectoryPath(), filename);
  }

  private getSubUploadDirectoryPath(): string {
    const [year, month] = dayjs().format(this.DATE_FORMAT).split(' ');
    return join(year, month);
  }

  public async writeFile(file: Express.Multer.File): Promise<StoredFile> {
    try {
      const uploadDirectoryPath = this.getUploadDirectoryPath();

      const subDirectory = this.getSubUploadDirectoryPath();
      const fileExtension = extension(file.mimetype);
      if (!fileExtension) {
        throw new Error(`Cannot determine file extension for MIME type: ${file.mimetype}`);
      }
      const filename = `${randomUUID()}.${fileExtension}`;

      const path = this.getDestinationFilePath(filename);

      await ensureDir(join(uploadDirectoryPath, subDirectory));
      await writeFile(path, file.buffer);

      return {
        fileExtension,
        filename,
        path,
        subDirectory,
      };
    } catch (error) {
      this.logger.error(`Error while saving file: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Can't save file`);
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<FileUploaderEntity> {
    const storedFile = await this.writeFile(file);
    const fileEntity = new FileUploaderFactory().create({
      hashName: storedFile.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: storedFile.path,
      size: file.size,
      subDirectory: storedFile.subDirectory,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fileDocument = await this.fileRepository.save(fileEntity);
    return fileDocument;
  }

  public async getFile(fileId: string): Promise<FileUploaderEntity> {
    const existFile = await this.fileRepository.findById(fileId);

    if (! existFile) {
      throw new NotFoundException(`File with ${fileId} not found.`);
    }

    return existFile;
  }
}