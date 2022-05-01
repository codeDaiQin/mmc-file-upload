import SparkMD5 from 'spark-md5';

// https://juejin.cn/post/6992508040113029134
export interface workerConfigType {
  chunkSize: number;
  retry: number; // 重传次数
  uploadPrice: (chunk: Blob, index: number) => Promise<any>; // 分片上传
  onFinish: () => Promise<any>; // 上次完成的回调
}
const defaultChunkSize = 1024 * 1024 * 2; // 2M
export default class WorkerUpload {
  private options;
  constructor(config: workerConfigType) {
    this.options = { ...config };
  }

  /**
   * 将file分片, 并返回分片数组
   * @param file 要上传的文件
   * @return chunks 分片
   */
  public async getChunks(file: File): Promise<Blob[]> {
    return new Promise((resolve, reject) => {
      const chunkSize = this.options.chunkSize || defaultChunkSize;
      const chunks: Blob[] = [];
      const total = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;
      while (currentChunk < total) {
        const start = currentChunk * chunkSize;
        const end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        const chunk = file.slice(start, end);
        chunks.push(chunk);
      }
      resolve(chunks);
    });
  }

  /**
   * 将file对象进行切片，然后根据切片计算md5
   * @param chunks 要上传的文件
   * @return md5
   */
  public async getMd5(chunks: Blob[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      let index = 0;
      chunks.forEach((chunk) => {
        fileReader.readAsArrayBuffer(chunk);
        index++;
      });

      fileReader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          spark.append(e.target.result);
        }
        if (index === chunks.length) {
          resolve(spark.end());
        }
      };

      fileReader.onerror = (e) => {
        console.error(`[error] 读取文件失败`, e);
        reject(e);
      };
    });
  }
}
