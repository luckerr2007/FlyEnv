import { notarize } from '@electron/notarize'

export default async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  const appleApiIssuer = process.env.APPLE_API_ISSUER
  const appleApiKeyId = process.env.APPLE_API_KEY_ID
  const appleApiKey = process.env.APPLE_API_KEY_PATH

  if (!appleApiIssuer || !appleApiKeyId || !appleApiKey) {
    console.log('Skipping notarization: Apple API credentials not configured')
    return
  }

  const appName = context.packager.appInfo.productFilename
  let param = {
    tool: 'notarytool',
    appPath: `${appOutDir}/${appName}.app`,
    appleApiIssuer,
    appleApiKeyId,
    appleApiKey
  }
  await notarize(param)
  return
}
