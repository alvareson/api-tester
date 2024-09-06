import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

const form = document.querySelector("[data-form]")
const queryParamsContainer = document.querySelector('[data-query-params]')
const requestHeadersContainer = document.querySelector('[data-request-headers]')

const keyValueTemplate = document.querySelector('[data-key-value-template]')

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

form.addEventListener('submit', (e) => {
  e.preventDefault()
  axios({
    url: document.querySelector('[data-url]').value,
    method: document.querySelector('[data-method]').value,
    params: keyValuePairsToObject(queryParamsContainer),
    headers: keyValuePairsToObject(requestHeadersContainer),
  }).then(response => {
    console.log(response)
  })
})

function keyValuePairsToObject(container) {
  const pairs = container.querySelectorAll('[data-key-value-pair]')
  return [...pairs].reduce((data, pair) => {
    const key = pair.querySelector('[data-key]').value
    const value = pair.querySelector('[data-value]').value
    if (key === '') return data
    return { ...data, [key]: value }
  }, {})
}


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
document.body.classList.add('dark-mode')