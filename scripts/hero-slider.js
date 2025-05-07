document.addEventListener('DOMContentLoaded', () => {
    // fetch('/api/completed-matches')
    // .then(res => res.json())
    // .then(data => {
        const bgcolors = {1: '#03fcc6', 2: '#ff4f72', 3: '#746af7', 4: '#f0b873'}
        const data = [
            { team1: "Wolves", score1: 2, score2: 2, team2: "Bulls", winner: "Draw", sportID: 3 },
            { team1: "Lions", score1: 3, score2: 1, team2: "Tigers", winner: "Lions", sportID: 1 },
            { team1: "Eagles", score1: 0, score2: 2, team2: "Sharks", winner: "Sharks", sportID: 2 },
          ];

        const container = document.getElementById('matches-container');

        data.forEach(match => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML =  `<div>
                                    ${match.team1} vs ${match.team2}
                                </div>
                                <div> Winner: ${match.winner} </div>`;
            container.appendChild(slide);
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
// });