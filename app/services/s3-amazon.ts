



import { v4 as uuidv4 } from 'uuid';
import mime from "mime-types";

import { S3Client, ListBucketsCommand ,PutObjectCommand} from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: 'us-west-2' }); // Thay 'us-west-2' bằng region của bạn

const uploadParams = {
  Bucket: 'your-bucket-name', // Thay bằng tên bucket của bạn
  Key: 'file-name', // Tên file muốn lưu trên S3
  Body: 'file-content', // Nội dung file (hoặc có thể là Buffer, ReadStream...)
};

const uploadImageS3Amazon = async  (fileBuffer:Buffer, originalName:string)=>{
    const fileExtension = mime.extension(mime.lookup(originalName) || "application/octet-stream");
    const fileKey = `${uuidv4()}.${fileExtension}`;
  
    const uploadParams = {
      Bucket: process.env.TZ,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: mime.lookup(originalName) || "application/octet-stream",
      ACL: "public-read", // hoặc private tuỳ use case
    };
  
    await s3.send(new PutObjectCommand(uploadParams));
  
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  
    return { fileKey, fileUrl };
}


export {uploadImageS3Amazon}