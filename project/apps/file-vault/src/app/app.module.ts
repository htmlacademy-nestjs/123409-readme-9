import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploaderModule } from '@project/file-uploader';
import { FileVaultConfigModule, getMongooseOptions } from '@project/file-vault-config';

@Module({
  imports: [
    FileVaultConfigModule,
    FileUploaderModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
