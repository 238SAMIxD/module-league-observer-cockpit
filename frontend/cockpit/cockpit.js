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

LPTE.onready(async () => {
  const onAirBadge = document.querySelector('.status.on-air');

  const updateTournament = (name) => {
    if (name && name.trim() !== '') {
      onAirBadge.innerHTML = `TOURNAMENT: ${name.toUpperCase()}`;
    }
  };

  const updateTeams = (blueTeam, redTeam) => {
    if (blueTeam && blueTeam.name) {
      document.querySelector('.blue-team .label').innerText = `${blueTeam.name.toUpperCase()}`;
    }
    if (redTeam && redTeam.name) {
      document.querySelector('.red-team .label').innerText = `${redTeam.name.toUpperCase()}`;
    }
  };

  const teamsData = await LPTE.request({
    meta: {
      namespace: 'module-teams',
      type: 'request-current',
      version: 1
    }
  });

  if (teamsData) {
    if (teamsData.tournamentName) {
      updateTournament(teamsData.tournamentName);
    } else if (teamsData.state && teamsData.state.tournamentName) {
      updateTournament(teamsData.state.tournamentName);
    }
    
    if (teamsData.teams) {
      updateTeams(teamsData.teams.blueTeam, teamsData.teams.redTeam);
    } else if (teamsData.state && teamsData.state.teams) {
      updateTeams(teamsData.state.teams.blueTeam, teamsData.state.teams.redTeam);
    }
  }

  LPTE.on('module-teams', 'update', (data) => {
    if (data.tournamentName) {
      updateTournament(data.tournamentName);
    }
    if (data.teams) {
      updateTeams(data.teams.blueTeam, data.teams.redTeam);
    }
  });
});
