import { useRef, useState } from 'react';
import type { Attachment } from '../types';
import { fileUrl, formatFileSize } from '../types';

interface Props {
  attachments: Attachment[];
}

export function AttachmentList({ attachments }: Props) {
  if (!attachments.length) return null;

  return (
    <div className="attachments">
      {attachments.map((a) => {
        const href = fileUrl(a.url);
        return (
        <a
          key={a.id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="attachment"
        >
          {a.isImage ? (
            <img src={href} alt={a.fileName} className="attachment__image" />
          ) : (
            <span className="attachment__file">
              📎 {a.fileName} ({formatFileSize(a.size)})
            </span>
          )}
        </a>
        );
      })}
    </div>
  );
}

interface UploadProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
}

export function FileUpload({ onUpload, multiple = true, accept, label = 'Прикрепить файлы' }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) {
      setPreviews((prev) => [...prev, ...files]);
      onUpload(files);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="file-upload">
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="file-upload__input"
      />
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => inputRef.current?.click()}>
        📎 {label}
      </button>
      {previews.length > 0 && (
        <div className="file-upload__previews">
          {previews.map((f, i) => (
            <span key={`${f.name}-${i}`} className="file-upload__preview">{f.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
