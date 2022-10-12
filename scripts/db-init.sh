sudo nano /etc/postgresql/12/main/pg_hba.conf
# https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge
sudo service postgresql restart
# createuser -s user_p2
# brew services restart postgresql

sudo su - postgres
psql 

# Increase number of connections on the server
# https://stackoverflow.com/questions/30778015/how-to-increase-the-max-connections-in-postgres 
sudo nano /etc/postgresql/12/main/postgresql.conf

# https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge
sudo nano /etc/postgresql/12/main/pg_hba.conf

ALTER USER user_p2 PASSWORD 'p@nth30_db_2022';
CREATE ROLE user_p2 WITH ENCRYPTED PASSWORD 'p@nth30_db_2022';
CREATE DATABASE db_pantheon_games OWNER user_p2;

GRANT ALL PRIVILEGES ON DATABASE db_pantheon_games TO user_p2;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_p2;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO user_p2;

createdb db_pantheon_games
psql -d db_pantheon_games

GRANT ALL PRIVILEGES ON DATABASE db_pantheon_games TO user_p2;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_p2;

ALTER ROLE user_p2 WITH LOGIN;

\c db_pantheon_games user_p2
psql -d db_pantheon_games -h 127.0.0.1 -U user_p2

127.0.0.1:5432:db_pantheon_games:user_mp:p@nth30_db_2022

## CUSTOM
host    all             user_p2             127.0.0.1/32       md5
host    all             user_p2             ::1/128            md5

# ALTER DATABASE db_project_jd OWNER TO user_p2;

# GRANT CONNECT ON DATABASE db_project_jd TO user_p2;
# GRANT USAGE ON SCHEMA public TO user_p2;
# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_p2;
# sudo chown $USER:$USER /var/cache/mon_programme
# sudo chown -R navarrete:www-data /var/cache/mon_programme

CREATE TABLE IF NOT EXISTS consent(
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    ip_hash VARCHAR NOT NULL,
    universe VARCHAR NOT NULL,
    locale VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    score_bot DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS participant(
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    ip_hash VARCHAR NOT NULL,
    country_id INT NOT NULL,
    location_id VARCHAR NOT NULL,
    age_id INT NOT NULL,
    sex_id VARCHAR NOT NULL,
    language_ids VARCHAR NOT NULL,
    education_id INT NOT NULL,
    universe VARCHAR NOT NULL,
    locale VARCHAR NOT NULL,
    score_bot DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game(
    id SERIAL PRIMARY KEY,
    game_date VARCHAR NOT NULL,
    game_number INT,
    sorted_person_1 VARCHAR NOT NULL,
    sorted_person_2 VARCHAR NOT NULL,
    sorted_person_3 VARCHAR NOT NULL,
    sorted_person_4 VARCHAR NOT NULL,
    sorted_person_5 VARCHAR NOT NULL,
    score_bot DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_participation(
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    ip_hash VARCHAR NOT NULL,
    universe VARCHAR NOT NULL,
    game_id INT NOT NULL,
    trials VARCHAR NOT NULL,
    solved INT NOT NULL,
    level INT NOT NULL,
    score_bot DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS trivia_game(
    id SERIAL PRIMARY KEY,
    date VARCHAR NOT NULL,
    game_number INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS trivia_score(
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    ip_hash VARCHAR NOT NULL,
    game_id INT,
    question_id INT,
    answer VARCHAR NOT NULL,
    correct_answer VARCHAR NOT NULL,
    score_bot DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS trivia_question(
    id SERIAL PRIMARY KEY,
    game_id INT,
    text VARCHAR NOT NULL,
    answer_a VARCHAR NOT NULL,
    answer_b VARCHAR NOT NULL,
    answer_c VARCHAR NOT NULL,
    answer_d VARCHAR NOT NULL,
    correct_answer VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


scp user@condorcet:db.sql ~./db.sql
DELETE FROM participant;
DELETE FROM consent;

DELETE FROM game;
DELETE FROM game_participation;

DELETE FROM trivia_game;
DELETE FROM trivia_score;
DELETE FROM trivia_question;

pg_dump -d db_pantheon_games -h 127.0.0.1 -U user_p2 -Fc -f db.sql


DROP TABLE participant;
DROP TABLE consent;

DROP TABLE game;
DROP TABLE game_participation;

DROP TABLE trivia_game;
DROP TABLE trivia_score;
DROP TABLE trivia_question;