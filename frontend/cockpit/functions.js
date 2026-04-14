document.addEventListener("keydown", (e) => {
  if (
    e.target.getAttribute("role") === "button" &&
    (e.key === "Enter" || e.key === " ")
  ) {
    e.preventDefault();
    e.target.click();
  }
});

function getTeam() {
  const selectedTeam = document.querySelector("[name=team]:checked");
  return selectedTeam ? parseInt(selectedTeam.value, 10) : 100;
}

function triggerEvent(event, count = undefined) {
  const team = getTeam();

  const payload = {
    meta: {
      namespace: "module-league-in-game",
      type: "test-event",
      version: 1,
    },
    team,
    event,
  };

  if (count !== undefined) {
    payload.count = count;
  }

  LPTE.emit(payload);
}
