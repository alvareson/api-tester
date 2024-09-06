import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

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