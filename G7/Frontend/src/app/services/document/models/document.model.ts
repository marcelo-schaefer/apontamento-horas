export interface DocumentModel {
  id?: string;
  attachmentId?: string;
  name?: string;
  size?: number;
  error?: 'error' | 'success' | '';
  binary?: string | ArrayBuffer | null;
  binaryString?: string | ArrayBuffer | null;
  isExclude?: boolean;
}
