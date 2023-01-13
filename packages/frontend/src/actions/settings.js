import 'whatwg-fetch'
import { sendRequest, buildHeaders } from 'utils/fetch'
import { apiURL } from 'utils/settings'

export const LIST_SETTINGS = 'LIST_SETTINGS'
export const EDIT_SETTINGS = 'EDIT_SETTINGS'
export const EDIT_LOGO = 'EDIT_LOGO'
export const REMOVE_LOGO = 'REMOVE_LOGO'
export const ADD_API_KEY = 'ADD_API_KEY'
export const REMOVE_API_KEY = 'REMOVE_API_KEY'

export function listSettings (json) {
  return {
    type: LIST_SETTINGS,
    settings: json
  }
}

export function editSettings (json) {
  return {
    type: EDIT_SETTINGS,
    settings: json
  }
}

export function editLogo (json) {
  return {
    type: EDIT_LOGO,
    logo: json
  }
}

export function removeLogo (logoID) {
  return {
    type: REMOVE_LOGO,
    logoID
  }
}

export function addApiKey (json) {
  return {
    type: ADD_API_KEY,
    apiKey: json
  }
}

export function removeApiKey (keyID) {
  return {
    type: REMOVE_API_KEY,
    keyID
  }
}

export const fetchSettings = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + '/api/settings', {
        headers: await buildHeaders()
      }, callbacks)
      dispatch(listSettings(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const fetchPublicSettings = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + '/api/public-settings', {}, callbacks)
      dispatch(listSettings(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const updateSettings = ({serviceName, backgroundColor, emailNotification} = {}, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { serviceName, backgroundColor, emailNotification }
      const json = await sendRequest(apiURL + '/api/settings', {
        headers: await buildHeaders(),
        method: 'PATCH',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(editSettings(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const subscribe = (emailAddress, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { emailAddress }
      await sendRequest(apiURL + '/api/subscribers/subscribe', {
        method: 'POST',
        body: JSON.stringify(body)
      }, callbacks)
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const postApiKey = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + '/api/settings/apikeys', {
        headers: await buildHeaders(),
        method: 'POST'
      }, callbacks)
      dispatch(addApiKey(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const deleteApiKey = (keyID, callbacks = {}) => {
  return async dispatch => {
    try {
      await sendRequest(`${apiURL}/api/settings/apikeys/${keyID}`, {
        headers: await buildHeaders(),
        method: 'DELETE'
      }, callbacks)
      dispatch(removeApiKey(keyID))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const uploadLogo = (file, callbacks = {}) => {
  return async dispatch => {
    let dataURL
    try {
      dataURL = await readImageFile(file)
    } catch (error) {
      callbacks.onFailure(error.message)
      return
    }

    try {
      const json = await sendRequest(apiURL + '/api/settings/logos', {
        headers: await buildHeaders(),
        method: 'POST',
        body: `{"data": "${dataURL}"}`
      }, callbacks)

      dispatch(editLogo(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const deleteLogo = (logoID, callbacks = {}) => {
  return async dispatch => {
    try {
      await sendRequest(apiURL + '/api/settings/logos/' + logoID, {
        headers: await buildHeaders(),
        method: 'DELETE'
      }, callbacks)
      dispatch(removeLogo(logoID))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

const validFileTypes = [
  'image/jpeg',
  'image/png'
]

export const readImageFile = (file) => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    if (!validFileTypes.includes(file.type)) {
      return reject(new Error('Unsupported image type'))
    }

    reader.onload = (event) => {
      return resolve(event.target.result)
    }
    reader.onerror = (event) => {
      return reject(event)
    }

    reader.readAsDataURL(file)
  })
}
