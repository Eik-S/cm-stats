export function getPricelistsBucketName() {
  const nodeEnv = process.env.NODE_ENV
  const bucketNameEnv = process.env.PRICELISTS_BUCKET_NAME
  console.log({ NODE_ENV: process.env.NODE_ENV })
  if (nodeEnv !== 'production') {
    return '643625685022-cm-pricelists'
  }

  if (bucketNameEnv == null) {
    throw new Error(
      'PRICELISTS_BUCKET_NAME env variable needs to be set on deployed crawler lambda',
    )
  }

  return bucketNameEnv
}
