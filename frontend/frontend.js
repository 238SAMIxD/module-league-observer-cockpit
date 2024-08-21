const updateUi = async () => {
  const server = await window.constants.getWebServerPort()
  const location = `http://${server}/pages/op-module-league-observer-cockpit/cockpit`

  const apiKey = await window.constants.getApiKey()

  document.querySelector('#cockpit-embed').value = `${location}/index.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
}

updateUi()
