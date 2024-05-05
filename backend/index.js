import express from "express";
import dotenv from "dotenv";
import aws from "aws-sdk";
import cors from 'cors'


dotenv.config();

const region = process.env.REGION;
const bucket = process.env.BUCKET;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKey,
  secAccessKey,
  signatureVersion: "v4",
});

aws.config.update(s3);

const app = express();
app.use(cors())
app.use(express.static("frontend"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function generateUploadURL(imgname) {
  const imageName = imgname;
  const params = {
    Bucket: bucket,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}

app.get('/getsignedurl', async (req, res) => {
  const url = await generateUploadURL(req.query.imgname)
  res.send({url})
})


app.listen(8000, () => console.log("Listening on port 8000"));