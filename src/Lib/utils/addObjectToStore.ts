import { initMinIO } from "../minio";
import { addPath } from "./picPath";

const minioBucket = "image-storage";
export async function addObjectToStore(req: any, res: any, next: any) {
  if (req.files) {
    const minio = await initMinIO();
    const name = addPath(req.files.profilePic) 
    await minio.putObject(minioBucket, name, req.files.profilePic.data);
    req.name = name;
    next();
  }else{
    next()
  }
}
