import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from 'multer'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const bucketName = process.env.BUCKET_NAME!
const bucketRegion = process.env.BUCKET_REGION!
const accessKey = process.env.BUCKET_ACCESS_KEY!
const secretKey = process.env.BUCKET_SECRET_KEY!

export const s3 = new S3Client({
    credentials:{
        accessKeyId:accessKey,
        secretAccessKey:secretKey
    },
    region:bucketRegion
})


const storage = multer.memoryStorage();
export const upload = multer({storage})