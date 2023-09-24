const assert = require("assert");
const { pipe, tap, map, tryCatch } = require("rubico");
const Path = require("path");
const fs = require("fs").promises;

const { walkDir } = require("./walkDir");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;
const client = new S3Client({ region: AWS_REGION });

const log = require("logfilename")(__filename);

const uploadFileToS3 =
  ({ bucketUpload, keyPrefix, baseDir }) =>
  (filename) =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(bucketUpload);
          assert(baseDir);
          assert(keyPrefix);
        }),
        () => Path.resolve(baseDir, filename),
        (path) => fs.readFile(path),
        (Body) => ({
          Body,
          Bucket: bucketUpload,
          Key: Path.join(keyPrefix, filename),
        }),
        tap((params) => {
          assert(true);
        }),
        (input) => new PutObjectCommand(input),
        (command) => client.send(command),
      ]),
      (error) => {
        console.log(error);
        return { error };
      }
    )();

exports.uploadDirToS3 =
  ({ bucketUpload, keyPrefix }) =>
  (dir) =>
    pipe([
      tap(() => {
        log.debug(`uploadDirToS3 ${bucketUpload} ${keyPrefix}`);
        assert(bucketUpload);
        assert(keyPrefix);
        assert(dir);
        assert(AWSAccessKeyId);
        assert(AWSSecretKey);
        assert(AWS_REGION);
      }),
      () => "",
      walkDir({ baseDir: dir }),
      tap((files) => {
        assert(files);
        log.debug(`uploadDirToS3 #files ${files.length}`);
      }),
      map.pool(10, uploadFileToS3({ baseDir: dir, bucketUpload, keyPrefix })),
      tap((params) => {
        assert(params);
      }),
    ])();
