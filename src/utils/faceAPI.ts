// utils/faceAPI.ts
export const FACE_API_KEY = 'rRTC3O8cReDrE0uUcC_s9wwTPiYh9LQb';
export const FACE_API_SECRET = 'RA2sjRKGKg_tL92gPWU4amrgAQ5vnvX0';

const BASE_URL = 'https://api-us.faceplusplus.com/facepp/v3';

/**
 * 检查图像中是否存在单一人脸
 */
export async function detectFace(base64Image: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('api_key', FACE_API_KEY);
  formData.append('api_secret', FACE_API_SECRET);
  formData.append('image_base64', base64Image);
  formData.append('return_attributes', 'none');

  const response = await fetch(`${BASE_URL}/detect`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.faces && data.faces.length === 1) {
    return true;
  } else {
    console.warn('Face detection results:', data);
    return false;
  }
}

/**
 * 比对注册图与登录图的相似度
 */
export async function compareFaces(base64Image: string, registeredImageUrl: string): Promise<number> {
  const formData = new FormData();
  formData.append('api_key', FACE_API_KEY);
  formData.append('api_secret', FACE_API_SECRET);
  formData.append('image_base64_1', base64Image.replace(/^data:image\/\w+;base64,/, ""));
  formData.append('image_url2', registeredImageUrl);

  const response = await fetch(`${BASE_URL}/compare`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result.confidence || 0;
}
