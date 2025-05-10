document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/leagues')
      .then(res => res.json())
      .then(data => {
        const container = document.querySelector('#leagues .card-container');
        const matchList = document.querySelector('#leagues table');
  
        let activeLeagueId = null; // Track currently shown league's matches
  
        data.forEach(league => {
          const card = document.createElement('div');
          card.className = 'card league-card';
          card.innerHTML = `<h3>${league.name}</h3>`;
  
          card.addEventListener('click', () => {
            if (activeLeagueId === league.league_id) {
              // Same league clicked again → toggle off
              matchList.innerHTML = '';
              activeLeagueId = null;
              return;
            }
  
            // New league clicked → load its matches
            document.querySelector('#leagues .loading-message').style.display = 'block';
            fetch(`/api/leagues/${league.league_id}/matches`)
            .then(res => res.json())
            .then(matches => {
                document.querySelector('#leagues .loading-message').style.display = 'none';
                matchList.innerHTML = `
                  <thead>
                      <tr>
                          <th>Competing Teams</th>
                          <th>Status</th>
                          <th>Date & Venue</th>
                          <th>Venue</th>
                      </tr>
                  </thead>
                `; // Clear previous match list
                const tbody = document.createElement('tbody');
  
                let matchCount = 0;

                matches.forEach(match => {
                  const tr = document.createElement('tr');
                  tr.innerHTML = `
                    <td>${match.home_team_name} vs ${match.away_team_name}</td>
                    <td>${match.status}</td>
                    <td>${match.match_date}</td>
                    <td>${match.venue}</td>
                  `;
                  tbody.appendChild(tr);
                  matchCount++;
                });
                
                if(matchCount === 0){
                  document.querySelector('#leagues .empty-message').style.display = 'block';
                }else{
                  document.querySelector('#leagues .empty-message').style.display = 'none';
                }

                matchList.appendChild(tbody);
                activeLeagueId = league.league_id; // Set new active league
              });
          });
  
          container.appendChild(card);
        });
      });
  });
  