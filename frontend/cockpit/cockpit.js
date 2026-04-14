LPTE.onready(async () => {
  const onAirBadge = document.querySelector(".status.on-air");
  const blueTeamLabel = document.querySelector(".blue-team .label");
  const redTeamLabel = document.querySelector(".red-team .label");

  const updateTournament = (name) => {
    if (onAirBadge) {
      onAirBadge.textContent =
        name && name.trim() !== ""
          ? `TOURNAMENT: ${name.toUpperCase()}`
          : "TOURNAMENT: WAITING...";
    }
  };

  const updateTeams = (blueTeam, redTeam) => {
    if (blueTeamLabel) {
      blueTeamLabel.textContent = blueTeam?.name?.trim()
        ? blueTeam.name.toUpperCase()
        : "BLUE TEAM";
    }
    if (redTeamLabel) {
      redTeamLabel.textContent = redTeam?.name?.trim()
        ? redTeam.name.toUpperCase()
        : "RED TEAM";
    }
  };

  const handleTeamsData = (data) => {
    if (!data) return;

    if (data.tournamentName !== undefined) {
      updateTournament(data.tournamentName);
    } else if (data.state && data.state.tournamentName !== undefined) {
      updateTournament(data.state.tournamentName);
    }

    if (data.teams) {
      updateTeams(data.teams.blueTeam, data.teams.redTeam);
    } else if (data.state && data.state.teams) {
      updateTeams(data.state.teams.blueTeam, data.state.teams.redTeam);
    }
  };

  try {
    const teamsData = await LPTE.request({
      meta: {
        namespace: "module-teams",
        type: "request-current",
        version: 1,
      },
    });

    handleTeamsData(teamsData);
  } catch (err) {
    console.debug("Failed to load initial module-teams state:", err);
  }

  LPTE.on("module-teams", "update", handleTeamsData);
});
