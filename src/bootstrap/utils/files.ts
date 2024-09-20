import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Env } from "./helper";

export const bucketName = Env("BUCKET_NAME");
const bucketRegion = Env("BUCKET_REGION");
const accessKey = Env("BUCKET_ACCESS_KEY");
const secretKey = Env("BUCKET_SECRET_KEY");

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage });
