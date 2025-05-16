const express = require('express');
const app = express();
const cors = require('cors');
const port = 3002;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 1. GET all matches with winner_team_name
app.get('/api/matches/', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        home_team: {
          select: { name: true }
        },
        away_team: {
          select: { name: true }
        }
      }
    });

    const matchData = matches.map(match => {
      // Logic to determine winner based on status 
      let winner_team_name = null;
      if (match.status.toLowerCase() === 'completed') {
        // You can add a field like `winner_team_id` in Match model for precision
        // Example placeholder logic (customize it based on your actual winner tracking method)
        const randomWinner = Math.random() > 0.5 ? match.home_team.name : match.away_team.name;
        winner_team_name = randomWinner;
      }

      return {
        match_id: match.match_id,
        t1_name: match.home_team.name,
        t2_name: match.away_team.name,
        match_date: match.match_date,
        venue: match.venue,
        status: match.status,
        winner_team_name
      };
    });

    res.json(matchData);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: 'Error fetching matches' });
  }
});

// 2. GET team info including coach and players
app.get('/api/teams/team_info', async (req, res) => {
  const { team_id } = req.query;

  try {
    const coaches = await prisma.coach.findMany({
      where: { team_id: parseInt(team_id) },
      select: {
        first_name: true,
        last_name: true
      }
    });

    const players = await prisma.player.findMany({
      where: { team_id: parseInt(team_id) },
      select: {
        first_name: true,
        last_name: true,
        age: true
      }
    });

    const coachData = coaches.map(c => ({
      name: `(Coach) ${c.first_name} ${c.last_name}`,
      age: null,
      role: 'Coach',
      sort_order: 0
    }));

    const playerData = players.map(p => ({
      name: `${p.first_name} ${p.last_name}`,
      age: p.age,
      role: 'Player',
      sort_order: 1
    }));

    const teamInfo = [...coachData, ...playerData].sort((a, b) => {
      if (a.sort_order === b.sort_order) {
        return a.name.localeCompare(b.name);
      }
      return a.sort_order - b.sort_order;
    });

    res.json(teamInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching team info' });
  }
});

// 3. GET all teams 
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        league: {
          select: { name: true }
        },
        sport: {
          select: { name: true }
        }
      }
    });

    const result = teams.map(team => ({
      team_id: team.team_id,
      name: team.name,
      league_name: team.league.name,
      sport_name: team.sport.name
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching teams' });
  }
});

// 4. GET all leagues 
app.get('/api/leagues', async (req, res) => {
  try {
    const leagues = await prisma.league.findMany();
    res.status(200).json(leagues);
  } catch (error) {
    console.error("Error fetching leagues:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// GET matches for a league (via query param)
app.get('/api/leagues/matches', async (req, res) => {
  const leagueId = parseInt(req.query.league_id);

  if (isNaN(leagueId)) {
    return res.status(400).json({ error: 'Invalid or missing league_id' });
  }

  try {
    const matches = await prisma.match.findMany({
      where: {
        league_id: leagueId
      },
      include: {
        home_team: {
          select: { name: true }
        },
        away_team: {
          select: { name: true }
        }
      }
    });

    const formatted = matches.map(match => {
      let winner_team_name = null;

      if (match.status.toLowerCase() === 'completed') {
        // Replace with actual logic if you have winner_team_id
        const randomWinner = Math.random() > 0.5 ? match.home_team.name : match.away_team.name;
        winner_team_name = randomWinner;
      }

      return {
        match_id: match.match_id,
        t1_name: match.home_team.name,
        t2_name: match.away_team.name,
        match_date: match.match_date,
        venue: match.venue,
        status: match.status,
        winner_team_name
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching matches for league:', error);
    res.status(500).json({ error: 'Error fetching league matches' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
