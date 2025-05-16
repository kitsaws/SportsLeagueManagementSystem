document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3002/api/teams')
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
            teamsInfoList.innerHTML = '';
            document.querySelector('#teams > h3').innerText = '';
            if (activeTeamId === team.team_id) {
              // Same team clicked again → toggle off
              activeLeagueId = null;
              return;
            }
  
            document.querySelector('#teams .loading-message').style.display = 'block';
            // New team clicked → load its team info
            fetch(`http://localhost:3002/api/teams/team_info?team_id=${team.team_id}`)
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
                `;
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
                document.querySelector('#teams > h3').innerText = team.name;
              });
          });
  
          container.appendChild(card);
        });
      });
  });
  