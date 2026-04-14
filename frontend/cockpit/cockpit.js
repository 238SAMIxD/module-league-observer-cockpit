function getTeam() {
  const selectedTeam = document.querySelector("[name=team]:checked");
  return selectedTeam ? parseInt(selectedTeam.value, 10) : 100;
}

function triggerEvent(event, count = undefined) {
  const team = getTeam();
  
  const payload = {
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-event',
      version: 1
    },
    team,
    event
  };

  if (count !== undefined) {
    payload.count = count;
  }

  LPTE.emit(payload);
}

LPTE.onready(async () => {
  const onAirBadge = document.querySelector('.status.on-air');

  const updateTournament = (name) => {
    if (name && name.trim() !== '') {
      onAirBadge.textContent = `TOURNAMENT: ${name.toUpperCase()}`;
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

  try {
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
  } catch (err) {
    console.debug('Failed to load initial module-teams state:', err);
  }

  LPTE.on('module-teams', 'update', (data) => {
    if (data.tournamentName) {
      updateTournament(data.tournamentName);
    } else if (data.state && data.state.tournamentName) {
      updateTournament(data.state.tournamentName);
    }

    if (data.teams) {
      updateTeams(data.teams.blueTeam, data.teams.redTeam);
    } else if (data.state && data.state.teams) {
      updateTeams(data.state.teams.blueTeam, data.state.teams.redTeam);
    }
  });
});
