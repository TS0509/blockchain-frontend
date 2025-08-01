import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

/**
 * 上传图像 Blob 到 Firebase Storage
 * @param ic 身份证号/用户名
 * @param imageBlob 用户图像 Blob
 * @returns 下载链接
 */
export const handleUpload = async (ic: string, imageBlob: Blob): Promise<string> => {
  try {
    const imageRef = ref(storage, `faces/${ic}.jpg`);
    const snapshot = await uploadBytes(imageRef, imageBlob);
    console.log("✅ Upload successful:", snapshot.metadata.fullPath);

    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};
