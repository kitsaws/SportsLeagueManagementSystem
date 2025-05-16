document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3002/api/leagues')
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        const container = document.querySelector('#leagues .card-container');
        const matchList = document.querySelector('#leagues table');
  
        let activeLeagueId = null; // Track currently shown league's matches
  
        data.forEach(league => {
          const card = document.createElement('div');
          card.className = 'card league-card';
          card.innerHTML = `<h3>${league.name}</h3>`;
  
          card.addEventListener('click', () => {
            matchList.innerHTML = '';
            if (activeLeagueId === league.league_id) {
              // Same league clicked again → toggle off
              activeLeagueId = null;
              return;
            }
  
            // New league clicked → load its matches
            document.querySelector('#leagues .loading-message').style.display = 'block';
            fetch(`http://localhost:3002/api/matches?league_id=${league.league_id}`)
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
                    <td>${match.t1_name} vs ${match.t2_name}</td>
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
  