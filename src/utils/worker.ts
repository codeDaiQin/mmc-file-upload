interface MessageEventType {
  data: {
    file: File;
    index: number;
  };
  eventType: 'start' | 'progress' | 'finish' | 'stop';
}

self.onmessage = (e: MessageEvent<MessageEventType>) => {
  const { data, eventType } = e.data;

  switch (eventType) {
    case 'start':
      const { file, index } = data;
      // 分片文件
      const fileName = file.name;
      break;
    case 'stop':
      console.log('停止上传');
      break;
  }
};
