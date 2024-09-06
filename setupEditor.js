export default function setupEditors() {
  const jsonRequestBody = document.querySelector('[data-json-request-body]')
  const jsonResponseBody = document.querySelector('[data-json-response-body]')

  jsonRequestBody.value = "{\n\t\n}"

  function updateResponseEditor(value) {
    jsonResponseBody.value = JSON.stringify(value, null, 2)
  }

  return { updateResponseEditor }
}