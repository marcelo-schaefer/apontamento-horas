import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NewAttachmentModel } from './models/newAttachment.model';
import { AttachmentAccessModel } from './models/attachmentAccess.model';
import { DocumentModel } from './models/document.model';
import { GetAttachmentModel } from './models/getAttachment.model';
import { AttachmentModel } from './models/attachment.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(public http: HttpClient) {}

  // ----------------------------- MÉTODOS DE UPLOAD ------------------------------------- //

  /** Realiza o upload do documento na G7 e adiciona o ID retornado pela PlataformaX no objeto de origem. */
  public async uploadDocumentAndSaveID(
    document: DocumentModel
  ): Promise<AttachmentModel> {
    try {
      let file = new AttachmentModel();
      await this.mergeUploadFile(document).then((data) => {
        document.id = data.attachment.id;
        file = data.attachment;
      });

      return file;
    } catch (error) {
      throw new Error(error);
    }
  }

  /** Divide o upload do documento em algumas etapas. */
  private async mergeUploadFile(
    dataFile: DocumentModel
  ): Promise<NewAttachmentModel> {
    try {
      const attachment = await this.newDocument(dataFile);
      await this.uploadUrl(attachment, dataFile.binary);
      await this.commitDocument(attachment);
      return attachment;
    } catch (error) {
      throw new Error(error);
    }
  }

  /** Solicita à PlataformaX um espaço para o armazenamento do arquivo e a mesma retorna com uma URL. */
  private newDocument(dataFile: DocumentModel): Promise<NewAttachmentModel> {
    return this.http
      .post<NewAttachmentModel>(environment.attachments.NEW_ATTACHMENT, {
        name: dataFile.name,
        size: dataFile.size,
      })
      .toPromise();
  }

  /** Realiza o upload do arquivo no caminho especificado pela PlataformaX. (Até o momento é na AWS)
   *  O arquivo precisa ser enviado no formato do tipo Blob.
   *  A requisição retorna com um ID.
   */
  private uploadUrl(
    attachment: NewAttachmentModel,
    binary: string | ArrayBuffer
  ): Promise<void> {
    const uploadUrl = attachment.uploadUrl;
    const data = binary;

    return this.http
      .put<void>(uploadUrl, data, {
        headers: { 'Content-Type': 'application/octet-stream' },
      })
      .toPromise();
  }

  /** Envia o ID recebido na requisição de upload para a PlataformaX.
   *  Essa requisição é importante para ser possível realizar o download do arquivo posteriormente.
   */
  private commitDocument(attachment: NewAttachmentModel): Promise<void> {
    const id = attachment.attachment.id;
    return this.http
      .post<void>(environment.attachments.COMMIT_ATTACHMENT, { id })
      .toPromise();
  }

  // ----------------------------- MÉTODOS DE DOWNLOAD ------------------------------------- //

  /** Realiza o download do arquivo, utilizando como parâmetro principal o ID, que deve estar dentro do objeto DocumentModel.
   * Essa função foi dividida em duas partes: solicitar o arquivo à PlataformaX e realizar o download no serviço em questão.
   */
  public async downloadFile(doc: DocumentModel): Promise<void> {
    try {
      const resolve = await this.requestDocumentAccess(doc.id);
      this.download(resolve.accessUrl, doc);
    } catch (error) {
      console.error(error);
    }
  }

  /** Realiza o download do arquivo e abre em uma nova aba do navegador */
  public async viewFile(doc: DocumentModel): Promise<void> {
    try {
      const resolve = await this.requestDocumentAccess(doc.id);
      this.download(resolve.accessUrl, doc, 'view');
    } catch (error) {
      console.error(error);
    }
  }

  public async getFileURL(doc: DocumentModel): Promise<Blob> {
    try {
      const resolve = await this.requestDocumentAccess(doc.id);
      const response = await this.http
        .get<Blob>(resolve.accessUrl, { responseType: 'blob' as 'json' })
        .toPromise();

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /** Solicita à PlataformaX o arquivo com o ID especificado, a requisição retorna com uma URL que aponta para onde o
   * arquivo foi salvo originalmente (Atualmente na AWS).
   */
  private requestDocumentAccess(id: string): Promise<AttachmentAccessModel> {
    return this.http
      .post<AttachmentAccessModel>(
        environment.attachments.REQUEST_ATTACHMENT_ACCESS,
        { id }
      )
      .toPromise();
  }

  /** Solicita o arquivo para download utilizando a URL recebida pela PlataformaX.
   * A requisição retorna com um dado no formato do tipo blob.
   */
  private download(
    accessUrl: string,
    file: DocumentModel,
    mode?: 'download' | 'view'
  ) {
    return (
      this.http
        .get<Blob>(accessUrl, { responseType: 'blob' as 'json' })
        .subscribe((response) => {
          this.writeContents(response, file, mode);
        }),
      (error) => console.error(error)
    );
  }

  /** Recria o blob como URL e executa a ação de click para o serviço em questão realizar o download do documento. */
  private writeContents(
    content: Blob,
    file: DocumentModel,
    mode: 'download' | 'view' = 'download'
  ) {
    const ext = file.name.split('.').pop().toLowerCase();
    let contentType = '';
    if (ext === 'pdf') {
      contentType = 'application/pdf';
    } else {
      if (ext === 'doc' || ext === 'docx') {
        contentType = 'application/msword';
      } else {
        if (ext === 'jpg' || ext === 'png' || ext === 'jpeg') {
          contentType = 'image/*';
        }
      }
    }
    const a = document.createElement('a');
    const fileBlob = new Blob([content], { type: contentType });

    if (mode === 'download') {
      a.href = URL.createObjectURL(fileBlob);
      a.download = file.name;
      a.click();
    } else {
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, '_blank');
    }
  }

  // ----------------------------- MÉTODOS DE SINCRONIZAÇÃO ------------------------------------- //

  /** Verifica os arquivos que já foram sincronizados anteriormente no processo e envia apenas os faltantes. */
  public async createLinkDocs(
    processInstanceId: number,
    docs: DocumentModel[]
  ): Promise<void> {
    await this.getDocuments(processInstanceId)
      .then((attachmentList) => {
        if (attachmentList.attachments) {
          const ids = [];
          docs.forEach((doc) => {
            const attachment = attachmentList.attachments.find(
              (a) => a.id === doc.id
            );
            if (!attachment) {
              ids.push(doc.id);
            }
          });
          if (ids.length > 0) {
            this.linkDocuments(processInstanceId, ids)
              .then(() => console.log('Documentos sincronizados com sucesso'))
              .catch((error) => console.error(error));
          }
        }
      })
      .catch((error) => {
        console.error('Falha ao tentar sincronizar documentos na G7', error);
      });
  }

  /** Busca os arquivos que já foram sincronizados ao processo */
  private getDocuments(processInstance: number): Promise<GetAttachmentModel> {
    return this.http
      .post<GetAttachmentModel>(environment.attachments.GET_ATTACHMENTS, {
        processInstance,
      })
      .toPromise();
  }

  /** Sincroniza os novos arquivos, com base no id dos mesmos */
  private linkDocuments(processInstance: number, ids: string[]): Promise<void> {
    return this.http
      .post<void>(environment.attachments.LINK_ATTACHMENTS, {
        processInstance,
        ids,
      })
      .toPromise();
  }
}
