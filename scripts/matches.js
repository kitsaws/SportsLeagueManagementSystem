document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3002/api/teams')
     .then(res => res.json())
     .then(data =>{
            const filterDropDown = document.getElementById('team-filter');
            data.forEach(team => {
                const option = document.createElement('option');
                option.value = `${team.name}`;
                option.text = `${team.name}`;
                filterDropDown.appendChild(option);
            });
        })

    fetch('http://localhost:3002/api/matches')
        .then(res => res.json())
        .then(data => {
            const venueDropDown = document.getElementById('venue-filter');
            const seenVenues = new Set();
            data.forEach(match => {
                if (!seenVenues.has(match.venue)) {
                    const optionVenue = document.createElement('option');
                    optionVenue.value = match.venue;
                    optionVenue.text = match.venue;
                    venueDropDown.appendChild(optionVenue);
                    seenVenues.add(match.venue);
                }
            });

            document.querySelector('#matches .loading-message').style.display = 'none';
            const container = document.querySelector('#matches table');
            const tbody = document.createElement('tbody');
            container.appendChild(tbody);

            const filters = {
                team: document.getElementById('team-filter'),
                status: document.getElementById('status-filter'),
                date: document.getElementById('date-filter'),
                venue: document.getElementById('venue-filter')
            };

            const filterValues = {
                team: '',
                status: '',
                date: '',
                venue: '',
            };

            function renderTable() {
                tbody.innerHTML = ''; // Clear old rows
                data.forEach(match => {
                    match.match_date = match.match_date.split('T')[0];
                    if (
                        (filterValues.team === '' || filterValues.team === match.t1_name || filterValues.team === match.t2_name)
                        && (filterValues.status === '' || filterValues.status === match.status) 
                        && (filterValues.date === '' || filterValues.date === match.match_date)
                        && (filterValues.venue === '' || filterValues.venue === match.venue)
                    ) {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${match.t1_name} vs ${match.t2_name}</td>
                            <td>${match.status}</td>
                            <td>${match.match_date}</td>
                            <td>${match.venue}</td>
                        `;
                        tbody.appendChild(tr);
                    }
                });
                if(tbody.innerHTML === ''){
                    document.querySelector('#matches .empty-message').style.display = 'block';
                }else{
                    document.querySelector('#matches .empty-message').style.display = 'none';
                }
            }

            // Initial render
            renderTable();

            // Listen for filter changes
            Object.entries(filters).forEach(([key, element]) => {
                element.addEventListener('change', () => {
                    filterValues[key] = element.value;
                    renderTable();
                });
            });
        });
});
