/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, forwardRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { DocumentModel } from 'src/app/services/document/models/document.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DocumentService } from 'src/app/services/document/document.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input()
  titulo: string;

  constructor(
    private documentService?: DocumentService,
    private modalService?: NzModalService
  ) {}

  private LIMIT_SIZE = 10485760; // 10 Mb
  private ALLOWED_EXTENSIONS = ['pdf', 'jpeg', 'png', 'docx'];

  public attachments: DocumentModel[] = [];
  public files: NzUploadFile[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (attachments: DocumentModel[]): void => {};
  onTouched = (): void => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeValue(attachments: DocumentModel[]): void {
    this.attachments = this.attachments.concat(attachments);
    this.onChange(this.attachments);
    this.onTouched();
  }

  registerOnChange(fn: (attachments: DocumentModel[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  cancel(file: DocumentModel): void {
    this.remove(file);
  }

  remove(file: DocumentModel): void {
    const indexFile = this.files.findIndex((f) => f.id === file.attachmentId);
    indexFile !== -1 ? this.files.splice(indexFile, 1) : false;

    const indexDocument = this.attachments.findIndex(
      (f) => f.attachmentId === file.attachmentId
    );
    indexDocument !== -1 ? this.attachments.splice(indexDocument, 1) : false;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  customRequestFile = async (item: NzUploadXHRArgs): Promise<void> => {
    const file = item.file;
    const fileReader = new FileReader();
    const fileReaderString = new FileReader();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //fileReaderString.readAsBinaryString(file as any);
    fileReaderString.readAsDataURL(file as never);
    fileReader.readAsArrayBuffer(file as never);
    fileReader.onload = async () => {
      if (file.size <= this.LIMIT_SIZE) {
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (this.verifyAllowedExtensions(fileExt)) {
          await this.createDocument(file, fileReader, fileReaderString);
        } else {
          this.error(
            `Não é possível incluir o arquivo selecionado, pois a extensão .${fileExt} não é permitida. Só possivel o envio de imagem, docx e pdf.`
          );
        }
      } else {
        this.error(
          'Não é possível incluir o arquivo selecionado, pois o tamanho excede o limite de 10Mb.'
        );
      }
    };
  };

  private async createDocument(
    file: NzUploadFile,
    fileReader: FileReader,
    fileReaderString: FileReader
  ): Promise<void> {
    const newAttachment: DocumentModel = {
      id: '',
      attachmentId: file.uid,
      name: file.name,
      size: file.size,
      binary: fileReader.result,
      binaryString: fileReaderString.result,
      isExclude: true,
    };

    this.attachments.push(newAttachment);

    this.onTouched();
    try {
      await this.uploadFiles();
    } catch (error) {
      console.error(error);
    }
  }

  private error(msg: string): void {
    this.modalService.error({
      nzMaskClosable: false,
      nzTitle: msg,
    });
  }

  private verifyAllowedExtensions(fileExt: string): boolean {
    return this.ALLOWED_EXTENSIONS.find((ext) => fileExt === ext) !== undefined;
  }

  /** Realiza o download do arquivo */
  public async download(file: DocumentModel): Promise<void> {
    await this.documentService.downloadFile(file);
  }

  /** Realiza o download e abre em uma nova aba do navegador */
  public async view(file: DocumentModel): Promise<void> {
    return await this.documentService.viewFile(file);
  }

  /** Realiza o upload dos arquivos */
  public async uploadFiles(): Promise<boolean> {
    let errorInUpload = false;

    await Promise.all(
      this.attachments.map(async (document) => {
        if (!document.id) {
          await this.documentService
            .uploadDocumentAndSaveID(document)
            .then((d) => {
              document.error = 'success';
              document.id = d.id;
              return document;
            })
            .catch(() => {
              document.error = 'error';
              errorInUpload = true;
            });
        }
      })
    );

    this.onChange(this.attachments);
    this.onTouched();

    return errorInUpload;
  }
}
