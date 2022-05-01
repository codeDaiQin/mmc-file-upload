import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback
} from 'react';
import webWorker from '../worker.ts?worker';

interface FileType {}

interface FilesType extends FileType {
  uid: string; // 每个文件的唯一标识
}

interface UploadProps {
  disabled?: boolean;
  chiledre?: React.ReactNode;
  multiple?: boolean;
  accept?: string;
  action?: string; // 上传地址
  worker?: boolean; // 是否使用webWorker
  fileList?: FilesType[]; // todo 完善files类型
  workerConfig?: {
    chunkSize: number;
    retry: number; // 重传次数
    uploadPrice: (chunk: Blob, index: number) => Promise<any>; // 分片上传
    onFinish: () => Promise<any>; // 上次完成的回调
  };
}

const Upload: React.ForwardRefRenderFunction<unknown, UploadProps> = (
  props,
  ref
) => {
  const {
    disabled,
    chiledre,
    multiple,
    accept,
    action,
    worker,
    fileList = []
  } = props;

  const uploadRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<FilesType[]>(fileList);

  const handleClick = () => {
    uploadRef?.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const { files } = e.target;
    const reader = new FileReader();
    // todo
  };

  const upload = useCallback(() => {
    // todo 上传
    if (worker) {
      // 为每个文件创建webWorker 并且上传
      filesRef.current.forEach((element) => {});
    } else {
    }
  }, [action]);

  useImperativeHandle(ref, () => ({
    upload: uploadRef.current,
    handleClick
  }));

  return (
    <div>
      <input
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        ref={uploadRef}
        type="file"
        hidden
        onChange={handleChange}
      />
      <button onClick={handleClick}>click me!</button>
    </div>
  );
};

export default forwardRef<unknown, UploadProps>(Upload);
