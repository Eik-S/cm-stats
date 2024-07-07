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
    await s3Client.send(headObjectRequest)
    return true
  } catch (error: any) {
    if (error instanceof S3ServiceException) {
      const statusCode = error.$metadata.httpStatusCode

      if (statusCode === 404) {
        return false
      }
      console.error('unknown s3 status code for headObjectRequest: ', statusCode)
      console.error(error.message)
    }
    return false
  }
}

export async function saveToS3(key: string, data: PriceList): Promise<void> {
  const uploadRequest = new Upload({
    client: s3Client,
    params: {
      Bucket: getPricelistsBucketName(),
      Key: key,
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    },
  })

  await uploadRequest.done()
}
