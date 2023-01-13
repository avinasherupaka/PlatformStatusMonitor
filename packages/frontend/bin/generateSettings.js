import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { getOutputs } from './utils/cloudFormation'

dotenv.config({path: `${__dirname}/../../../.env`})

const { STACK_NAME: stackName } = process.env
const configDir = path.normalize(`${__dirname}/../config`)

const fetchSettings = async () => {
  const keys = ['AdminPageCloudFrontURL', 'StatusPageCloudFrontURL', 'UserPoolID', 'UserPoolClientID']
  try {
    return await getOutputs(stackName, keys)
  } catch (err) {
    throw err
  }
}

const generateAdminSettings = async () => {
  const settings = await fetchSettings()
  const body = `__LAMBSTATUS_API_URL__ = '${settings.AdminPageCloudFrontURL}';
__LAMBSTATUS_USER_POOL_ID__ = '${settings.UserPoolID}';
__LAMBSTATUS_CLIENT_ID__ = '${settings.UserPoolClientID}';
`
  const adminSettingsJsPath = `${configDir}/admin-settings.js`
  fs.writeFileSync(adminSettingsJsPath, body)
}

const generateStatusSettings = async () => {
  const settings = await fetchSettings()
  const body = `__LAMBSTATUS_API_URL__ = '${settings.StatusPageCloudFrontURL}';
`
  const statusSettingsJsPath = `${configDir}/status-settings.js`
  fs.writeFileSync(statusSettingsJsPath, body)
}

let promise
if (process.env.PAGE_TYPE === 'admin') {
  promise = generateAdminSettings()
} else if (process.env.PAGE_TYPE === 'status') {
  promise = generateStatusSettings()
}

promise.then(() => {
  console.log('settings.js generated')
})
