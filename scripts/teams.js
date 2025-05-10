document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        const container = document.querySelector('#teams .card-container');
        const teamsInfoList = document.querySelector('#teams table');
  
        let activeTeamId = null; // Track currently shown team info
  
        data.forEach(team => {
          const card = document.createElement('div');
          card.className = 'card team-card';
          card.innerHTML = `
          <h3>${team.name}</h3>
          <p>${team.league_name} || ${team.sport_name}</p>
          `;
  
          card.addEventListener('click', () => {
            if (activeTeamId === team.team_id) {
              // Same team clicked again → toggle off
              teamsInfoList.innerHTML = '';
              activeLeagueId = null;
              return;
            }
  
            document.querySelector('#teams .loading-message').style.display = 'block';
            // New team clicked → load its team info
            fetch(`/api/teams/${team.team_id}/team_info`)
            .then(res => res.json())
            .then(members => {
                document.querySelector('#teams .loading-message').style.display = 'none';
                teamsInfoList.innerHTML = `
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                  </tr>
                </thead>
                `; // Clear previous team info list
                const tbody = document.createElement('tbody');
                members.forEach(member => {
                  const tr = document.createElement('tr');
                  tr.innerHTML = `
                    <td>${member.name}</td>
                    <td>${member.age}</td>
                  `;
                  tbody.appendChild(tr);
                });
  
                teamsInfoList.appendChild(tbody);
                activeTeamId = team.team_id; // Set new active team
              });
          });
  
          container.appendChild(card);
        });
      });
  });
  