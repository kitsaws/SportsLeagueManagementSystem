document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/leagues')
      .then(res => res.json())
      .then(data => {
        const container = document.querySelector('#leauges .card-container');
        const matchList = document.querySelector('#leagues .match-list');
  
        let activeLeagueId = null; // Track currently shown league's matches
  
        data.forEach(league => {
          const card = document.createElement('div');
          card.className = 'league-card';
          card.innerHTML = `<h3>${league.name}</h3>`;
  
          card.addEventListener('click', () => {
            if (activeLeagueId === league.league_id) {
              // Same league clicked again → toggle off
              matchList.innerHTML = '';
              activeLeagueId = null;
              return;
            }
  
            // New league clicked → load its matches
            fetch(`/api/leagues/${league.league_id}/matches`)
              .then(res => res.json())
              .then(matches => {
                matchList.innerHTML = ''; // Clear previous match list
                const ul = document.createElement('ul');
  
                matches.forEach(match => {
                  const li = document.createElement('li');
                  li.innerHTML = `
                    <div>
                      <div>${match.home_team_name} vs ${match.away_team_name}</div>
                      <div>${match.status}</div>
                      <div>${match.match_date}</div>
                      <div>${match.venue}</div>
                    </div>
                  `;
                  ul.appendChild(li);
                });
  
                matchList.appendChild(ul);
                activeLeagueId = league.league_id; // Set new active league
              });
          });
  
          container.appendChild(card);
        });
      });
  });
  