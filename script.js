import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import prettyBytes from 'pretty-bytes'
import setupEditors from './setupEditor'

// form section
const form = document.querySelector("[data-form]")
const queryParamsContainer = document.querySelector('[data-query-params]')
const requestHeadersContainer = document.querySelector('[data-request-headers]')
const keyValueTemplate = document.querySelector('[data-key-value-template]')

// response section
const responseHeadersContainer = document.querySelector('[data-response-headers]')

// listener for button with data-add-query-param-btn attribute
document
  .querySelector('[data-add-query-param-btn]')
  .addEventListener('click', () => {
    queryParamsContainer.append(createKeyValuePair())
  })

// listener for button with data-add-request-header-btn attribute
document
  .querySelector('[data-add-request-header-btn]')
  .addEventListener('click', () => {
    requestHeadersContainer.append(createKeyValuePair())
  })

// append a key-value pair to the query params and request headers
queryParamsContainer.append(createKeyValuePair())
requestHeadersContainer.append(createKeyValuePair())

function createKeyValuePair() {
  const element = keyValueTemplate.content.cloneNode(true) // clone the template
  // add event listener to the remove button
  element.querySelector('[data-remove-btn]').addEventListener('click', (e) => {
    e.target.closest('[data-key-value-pair]').remove()
  })
  return element
}

function keyValuePairsToObject(container) {
  const pairs = container.querySelectorAll('[data-key-value-pair]')
  return [...pairs].reduce((data, pair) => {
    const key = pair.querySelector('[data-key]').value
    const value = pair.querySelector('[data-value]').value
    if (key === '') return data
    return { ...data, [key]: value }
  }, {})
}

/* 
  Block of code to make the request and update the response
*/
axios.interceptors.request.use(request => {
  request.customData = request.customData || {}
  request.customData.startTime = new Date().getTime()
  return request
})

function updateEndTime(response) {
  response.customData = response.customData || {}
  response.customData.time =
    new Date().getTime() - response.config.customData.startTime
  return response
}

axios.interceptors.response.use(updateEndTime, e => {
  return Promise.reject(updateEndTime(e.response))
})

const { updateResponseEditor } = setupEditors();
const jsonRequestBody = document.querySelector('[data-json-request-body]')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  axios({
    url: document.querySelector('[data-url]').value,
    method: document.querySelector('[data-method]').value,
    params: keyValuePairsToObject(queryParamsContainer),
    headers: keyValuePairsToObject(requestHeadersContainer),
    data: JSON.parse(jsonRequestBody.value),
  })
  .catch(e => e)
  .then(response => {
    document.querySelector('[data-response-section]').classList.remove('d-none')
    updateResponseDetails(response)
    updateResponseEditor(response.data)
    updateResponseHeaders(response.headers)
    console.log(response)
  })
})

function updateResponseDetails(response) {
  document.querySelector('[data-status]').textContent = response.status
  document.querySelector('[data-time]').textContent = response.customData.time
  document.querySelector('[data-size]').textContent = prettyBytes(
    JSON.stringify(response.data).length +
    JSON.stringify(response.headers).length
  )
}

function updateResponseHeaders(headers) {
  responseHeadersContainer.innerHTML = ''
  Object.entries(headers).forEach(([key, value]) => {
    const keyElement = document.createElement('div')
    keyElement.textContent = key
    responseHeadersContainer.append(keyElement)
    const valueElement = document.createElement('div')
    valueElement.textContent = value
    responseHeadersContainer.append(valueElement)
  })
}

/* 
  Block of code to update dark/light mode
*/
const darkModeToggle = document.getElementById('darkModeToggle')
darkModeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode')) {
    document.body.classList.remove('dark-mode')
    document.body.classList.add('light-mode')
  } else {
    document.body.classList.remove('light-mode')
    document.body.classList.add('dark-mode')
  }
})
document.body.classList.add('light-mode')
