import { HeadObjectCommand, S3Client, S3ServiceException } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PriceList } from '.'
import { getPricelistsBucketName } from './environment'

const s3Client = new S3Client({ region: 'eu-central-1', retryMode: 'standard' })
const bucket = process.env.PRICE_BUCKET_NAME || 'fhdsbfstoaf8s798fosuafpzisauoijl'

const baseParams = {
  Bucket: bucket,
}

export async function checkIfS3ObjectExists(key: string) {
  const headObjectRequest = new HeadObjectCommand({ ...baseParams, Key: key })
  try {
    const response = await s3Client.send(headObjectRequest)
    console.log(`s3 object with key ${key} already exists`, { response })
    return true
  } catch (error: any) {
    if (error instanceof S3ServiceException) {
      const statusCode = error.$metadata.httpStatusCode

      if (statusCode === 404) {
        console.log(`no s3 object with key ${key} exists yet`)
        return false
      }
      console.error(
        `unhandled s3 status code while checking 
        if document exists using s3 head request: ${statusCode}`,
        { error },
      )
    }
    return false
  }
}

export async function saveToS3(key: string, data: PriceList): Promise<void> {
  const bucketName = getPricelistsBucketName()
  const uploadRequest = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    },
  })
  console.log(`saving ${key} to s3 bucket ${bucketName}`)
  try {
    await uploadRequest.done()
    console.log(`s3 save successfull`)
  } catch (error: unknown) {
    console.error(`saving ${key} to s3 failed`, { error })
  }
}
