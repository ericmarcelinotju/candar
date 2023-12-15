const jsonToFormData = (json: object): FormData => {
  const formData = new FormData()

  for (const key in json) {
    if (json[key] === null || json[key] === undefined) {
      continue
    }
    if (Array.isArray(json[key])) {
      for (const i in json[key]) {
        if (typeof json[key][i] === 'object') {
          formData.append(key + '[]', JSON.stringify(json[key][i]))
        } else {
          formData.append(key + '[]', json[key][i])
        }
      }
      continue
    }
    formData.append(key, json[key])
  }
  return formData
}

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  link.click()

  // For Firefox it is necessary to delay revoking the ObjectURL.
  setTimeout(() => {
    window.URL.revokeObjectURL(link.href)
  }, 250)
}

const serializeQueryParams = (paramObj: object): string => {
  if (paramObj) {
    return '?' + Object.keys(paramObj).map(k => {
      if (paramObj[k] && typeof paramObj[k] === 'object') {
        return paramObj[k].map(v => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
      } else {
        return `${encodeURIComponent(k)}=${encodeURIComponent(paramObj[k])}`
      }
    }).join('&')
  }
  return ''
}

const urlFriendlyName = (url: string): string => {
  let newUrl = url.toLowerCase()
  newUrl = newUrl.replace(/[&/\\#,+()$~%.'":*?<>{} ]/g, '-')
  newUrl = newUrl.replace(' ', '-')
  return newUrl
}

const parseDuration = (dur: string): number => {
  const durs = dur.split(':')
  return parseInt(durs[0]) * 3600 + parseInt(durs[1]) * 60 + parseInt(durs[2])
}

const numberFormat = (value: number, separator = '.'): string => {
  if (!value) return '0'
  return String(Math.abs(value)).replace(/(.)(?=(\d{3})+$)/g, '$1' + separator)
}

export {
  jsonToFormData,
  downloadBlob,
  serializeQueryParams,
  urlFriendlyName,
  parseDuration,
  numberFormat
}
