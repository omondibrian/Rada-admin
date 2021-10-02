import { config } from "dotenv";
import { Client } from "minio";
config();
const minioBucket = "image-storage";
const minioHost = process.env.MINIO_HOST || "localhost";
export async function initMinIO() {
  const client = new Client({
    endPoint: minioHost,
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY as string,
    secretKey: process.env.MINIO_SECRET_KEY as string,
  });
  let success = false;
  while (!success) {
    try {
      const isBucket = await client.bucketExists(minioBucket);
      if (!isBucket) {
        client.makeBucket(minioBucket, "us-east-1", function (err) {
          if (err) return console.log(err);
          console.log('Bucket created successfully in "us-east-1".');
        });
      }
      success = true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return client;
}
