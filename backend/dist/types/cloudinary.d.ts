export interface CloudinaryResponse {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
}
export interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
}
export interface CloudinaryUploadOptions {
    folder?: string;
    resource_type?: string;
    public_id?: string;
    overwrite?: boolean;
    notification_url?: string;
    transformation?: any;
    format?: string;
    type?: string;
    access_mode?: string;
    use_filename?: boolean;
    unique_filename?: boolean;
    discard_original_filename?: boolean;
    proxy?: string;
    raw_convert?: string;
    colors?: boolean;
    faces?: boolean;
    quality_analysis?: boolean;
    image_metadata?: boolean;
    phash?: boolean;
    auto_tagging?: number;
    categorization?: string;
    detection?: string;
}
