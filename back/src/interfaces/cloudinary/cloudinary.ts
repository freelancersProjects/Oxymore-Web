export interface CloudinaryUploadResponse {
    public_id: string;
    secure_url: string;
    url: string;
    width?: number;
    height?: number;
    format: string;
    resource_type: string;
    bytes: number;
    created_at: string;
  }