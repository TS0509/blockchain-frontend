// utils/faceAPI.ts
export const FACE_API_KEY = 'rRTC3O8cReDrE0uUcC_s9wwTPiYh9LQb';
export const FACE_API_SECRET = 'RA2sjRKGKg_tL92gPWU4amrgAQ5vnvX0';

const BASE_URL = 'https://api-us.faceplusplus.com/facepp/v3';

interface FaceDetectResponse {
  faces: Array<{
    face_token: string;
    face_rectangle: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  }>;
  image_id?: string;
  request_id?: string;
  time_used?: number;
  error_message?: string;
}

interface FaceCompareResponse {
  confidence: number;
  thresholds: {
    '1e-3': number;
    '1e-4': number;
    '1e-5': number;
  };
  request_id?: string;
  time_used?: number;
  error_message?: string;
}

/**
 * 检查图像中是否存在单一人脸
 */
export async function detectFace(base64Image: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('api_key', FACE_API_KEY);
  formData.append('api_secret', FACE_API_SECRET);
  formData.append('image_base64', base64Image);

  try {
    const response = await fetch(`${BASE_URL}/detect`, {
      method: 'POST',
      body: formData,
    });

    const data: FaceDetectResponse = await response.json();

    if (data.error_message) {
      console.error('Face++ detect error:', data.error_message);
      return false;
    }

    return data.faces?.length === 1;
  } catch (error) {
    console.error('Face++ detect request failed:', error);
    return false;
  }
}

/**
 * 比对注册图与登录图的相似度（返回 confidence）
 */
export async function compareFaces(base64Image: string, registeredImageUrl: string): Promise<number> {
  const formData = new FormData();
  formData.append('api_key', FACE_API_KEY);
  formData.append('api_secret', FACE_API_SECRET);
  formData.append('image_base64_1', base64Image.replace(/^data:image\/\w+;base64,/, ''));
  formData.append('image_url2', registeredImageUrl);

  try {
    const response = await fetch(`${BASE_URL}/compare`, {
      method: 'POST',
      body: formData,
    });

    const result: FaceCompareResponse = await response.json();

    if (result.error_message) {
      console.error('Face++ compare error:', result.error_message);
      return 0;
    }

    return result.confidence || 0;
  } catch (error) {
    console.error('Face++ compare request failed:', error);
    return 0;
  }
}
