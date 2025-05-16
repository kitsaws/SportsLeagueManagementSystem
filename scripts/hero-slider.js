document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3002/api/matches')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('matches-container');
        const cardContainer = document.querySelector('.scheduled-matches .card-container');
        console.log(data);
        
        data.forEach(match => {
            match.match_date = match.match_date.split('T')[0]
            if(match.status.toLowerCase() === 'completed'){
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML =  `<div>
                                        ${match.t1_name} vs ${match.t2_name}
                                    </div>
                                    <div> Winner: ${match.winner_team_name} </div>`;
                container.appendChild(slide);
            }
        });
        data.forEach(match => {
            if(match.status.toLowerCase() === 'scheduled'){
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${match.t1_name} vs ${match.t2_name}</h3>
                    <p>${match.match_date}</p>
                    <p>${match.venue}</p>
                `;
                cardContainer.appendChild(card);
                cardContainer.parentElement.getElementsByTagName('h2')[0].style.display = 'block';
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