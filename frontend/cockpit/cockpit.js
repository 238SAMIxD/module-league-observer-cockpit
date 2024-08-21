function getTeam() {
  return parseInt(document.querySelector("[name=team]:checked").value);
}

function triggerEvent(event) {
  const team = getTeam();
  
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-event',
      version: 1
    },
    team,
    event
  })
}
