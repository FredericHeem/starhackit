const assert = require("assert");
const { pipe, tap, map, tryCatch } = require("rubico");
const Path = require("path");
const fs = require("fs").promises;

const { walkDir } = require("./walkDir");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;
const client = new S3Client({ region: AWS_REGION });

const uploadFileToS3 =
  ({ bucketUpload, baseDir }) =>
  (filename) =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(bucketUpload);
          assert(baseDir);
        }),
        () => Path.resolve(baseDir, filename),
        (path) => fs.readFile(path),
        (Body) => ({
          Body,
          Bucket: bucketUpload,
          Key: filename,
        }),
        (input) => new PutObjectCommand(input),
        (command) => client.send(command),
      ]),
      (error) => {
        console.log(error);
        return { error };
      }
    )();

exports.uploadDirToS3 = (config) => (dir) =>
  pipe([
    tap(() => {
      assert(config);
      assert(config.aws);
      assert(dir);
      assert(AWSAccessKeyId);
      assert(AWSSecretKey);
      assert(AWS_REGION);
    }),
    () => "",
    walkDir({ baseDir: dir }),
    tap((params) => {
      assert(params);
    }),
    map.pool(10, uploadFileToS3({ baseDir: dir, ...config.aws })),
    tap((params) => {
      assert(params);
    }),
  ])();
