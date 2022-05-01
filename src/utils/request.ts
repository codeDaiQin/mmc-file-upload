interface SuccessContext {
  e: ProgressEvent;
  response: any;
}

interface ErrorContext {
  e: ProgressEvent;
  response?: any;
}

interface ProgressContext {
  e: ProgressEvent;
  progress: number;
}

interface RequestType {
  url: string;
  method?: string;
  data: { [key: string]: any };
  headers: { [key: string]: string };
  action: string;
  withCredentials?: boolean;
  onSuccess: (context: SuccessContext) => void;
  onProgress: (context: ProgressContext) => void;
  onError: (context: ErrorContext) => void;
}

const request = ({
  method = 'POST',
  data = {},
  headers,
  action,
  withCredentials,
  onProgress,
  onError,
  onSuccess
}: RequestType) => {
  const xhr = new XMLHttpRequest();
  withCredentials && (xhr.withCredentials = true);
  const fromData = new FormData();

  // 把data转换成formData
  Object.keys(data).forEach((key) => {
    fromData.append(key, data[key]);
  });

  // 初始化一个请求
  xhr.open(method, action, true);

  // 设置请求头 必须在 open() 之后
  Object.keys(headers).forEach((key) => {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.onload = (e: ProgressEvent) => {
    if (xhr.status < 200 || xhr.status >= 300) {
      onError({ e });
      return;
    }
    const response = xhr.response;
    onSuccess({
      e,
      response
    });
  };

  xhr.onerror = (e: ProgressEvent) => {
    // 自定义错误回调
    onError({ e });
  };

  // 监听进度
  xhr.onprogress = (e: ProgressEvent) => {
    let progress = 0; // 初始化进度
    e.total > 0 && (progress = (e.loaded / e.total) * 100);
    // 自定义进度回调
    onProgress({
      e,
      progress
    });
  };

  xhr.send(fromData);

  return xhr;
};

export default request;
