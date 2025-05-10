document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/matches')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('matches-container');
        const cardContainer = document.querySelector('.scheduled-matches .card-container');

        data.forEach(match => {
            if(toLowerCase(match.status) === 'completed'){
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML =  `<div>
                                        ${match.team1} vs ${match.team2}
                                    </div>
                                    <div> Winner: ${match.winner} </div>`;
                container.appendChild(slide);
            }
            else if(toLowerCase(match.status) === ''){
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${match.home_team_name} vs ${match.away_team_name}</h3>
                    <p>${match.match_date}</p>
                    <p>${match.venue}</p>
                `;
                cardContainer.appendChild(card);
                cardContainer.parentElement.getElementsByTagName('h2').stlye.display = 'block';
            }
        });

        new Swiper(".mySwiper", {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            slidesPerView: 1,
            allowTouchMove: false,
        });
    });
});