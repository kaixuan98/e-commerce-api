const AWS = require('aws-sdk');
const crypto = require('crypto');

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = 'foliage-products-images';
const region = 'ca-central-1';


const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

// get the upload link 
const generateUploadURL = async() => {
    const rawBytes = await crypto.randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    // get a link to upload
    const uploadURL = s3.getSignedUrlPromise('putObject', params);
    return uploadURL; 
}

module.exports = generateUploadURL; 

