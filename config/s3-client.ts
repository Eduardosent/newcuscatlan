import { S3Client } from "@aws-sdk/client-s3";

const R2_ENDPOINT = process.env.NEXT_PUBLIC_CLOUDFLARE_ENDPOINT;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;

export const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY!,
    secretAccessKey: SECRET_KEY!,
  },
  forcePathStyle: true,
});