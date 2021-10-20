import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { S3 } from 'aws-sdk'

const s3 = new S3()
const bucketName = process.env.PHOTO_BUCKET_NAME!

const generateUrls = async (obj: S3.Object): Promise<{ url: string; fileName: string }> => {
  const url = await s3.getSignedUrlPromise('getObject', {
    Bucket: bucketName,
    Key: obj.Key!,
    Expires: 15 * 60 // expire in 15 min
  })
  return {
    url,
    fileName: obj.Key!
  }
}

async function getPhotos(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
  console.log('EVENT: ', JSON.stringify(event, null, 2))

  try {
    const { Contents: results } = await s3.listObjects({ Bucket: bucketName }).promise()
    const photos = await Promise.all(results!.map((obj) => generateUrls(obj)))
    return {
      statusCode: 200,
      body: JSON.stringify(photos, null, 2)
    }
  } catch (err) {
    console.log('ERROR: ', JSON.stringify(err, null, 2))
    return {
      statusCode: 500,
      body: 'Something went wrong!'
    }
  }
}

export { getPhotos }
