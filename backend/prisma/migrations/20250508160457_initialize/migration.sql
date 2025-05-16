-- CreateTable
CREATE TABLE "League" (
    "league_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("league_id")
);

-- CreateTable
CREATE TABLE "Sport" (
    "sport_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("sport_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sport_id" INTEGER NOT NULL,
    "league_id" INTEGER NOT NULL,
    "home_campus" VARCHAR(100),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "coach_id" INTEGER NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "sport_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("coach_id")
);

-- CreateTable
CREATE TABLE "Player" (
    "player_id" INTEGER NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "student_id" VARCHAR(20) NOT NULL,
    "age" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "Match" (
    "match_id" INTEGER NOT NULL,
    "league_id" INTEGER NOT NULL,
    "sport_id" INTEGER NOT NULL,
    "home_team_id" INTEGER NOT NULL,
    "away_team_id" INTEGER NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "venue" VARCHAR(100) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("match_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "Sport"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_league_id_key" ON "Team"("name", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_team_id_key" ON "Coach"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Player_student_id_key" ON "Player"("student_id");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "Sport"("sport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("league_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "Sport"("sport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "League"("league_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "Sport"("sport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- League: end_date >= start_date
ALTER TABLE "League" ADD CONSTRAINT chk_dates CHECK ("end_date" >= "start_date");

-- Player: age between 16 and 30
ALTER TABLE "Player" ADD CONSTRAINT chk_age CHECK ("age" >= 16 AND "age" <= 30);

-- Match: teams must be different
ALTER TABLE "Match" ADD CONSTRAINT chk_teams_different CHECK ("home_team_id" != "away_team_id");

-- Match: status must be valid
ALTER TABLE "Match" ADD CONSTRAINT chk_status CHECK ("status" IN ('Scheduled', 'Completed', 'Cancelled'));
