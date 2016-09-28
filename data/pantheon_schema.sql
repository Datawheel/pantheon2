BEGIN;

DROP TABLE IF EXISTS person_occupation_rank;
DROP TABLE IF EXISTS person_birthyear_rank;
DROP TABLE IF EXISTS person_birthcountry_rank;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS occupation;
DROP TABLE IF EXISTS place;
DROP TABLE IF EXISTS country;
DROP TABLE IF EXISTS year;

CREATE TABLE place
(
  id serial PRIMARY KEY,
  wiki_id integer,
  name text NOT NULL,
  slug CHARACTER VARYING(255)
);

CREATE TABLE year
(
  id integer PRIMARY KEY,
  name text NOT NULL,
  slug CHARACTER VARYING(255),
  num_born integer,
  num_died integer
);

CREATE TABLE country
(
  id CHARACTER VARYING(2) PRIMARY KEY,
  name text NOT NULL,
  slug CHARACTER VARYING(255),
  num_born integer,
  num_died integer
);

CREATE TABLE occupation
(
  id serial PRIMARY KEY,
  slug CHARACTER VARYING(255) NOT NULL,
  name text NOT NULL,
  industry text NOT NULL,
  domain text NOT NULL,
  "group" text NOT NULL,
  num_born integer
);

CREATE TABLE person
(
  id serial PRIMARY KEY,
  wiki_id integer,
  name text NOT NULL,
  slug CHARACTER VARYING(255) NOT NULL,
  gender boolean,
  birthyear integer REFERENCES year (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  deathyear integer REFERENCES year (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  birthplace integer REFERENCES place (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  birthcountry CHARACTER VARYING(2) REFERENCES country (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  deathplace integer REFERENCES place (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  occupation integer NOT NULL REFERENCES occupation (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  occ_acc real,
  langs integer,
  langs_adopt integer
);

CREATE TABLE person_occupation_rank
(
  person integer REFERENCES person (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  occupation integer REFERENCES occupation (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  rank integer,
  rank_unique integer,
  langs integer
);

CREATE TABLE person_birthyear_rank
(
  person integer REFERENCES person (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  birthyear integer REFERENCES year (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  rank integer,
  rank_unique integer,
  langs integer
);

CREATE TABLE person_birthcountry_rank
(
  person integer REFERENCES person (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  birthcountry CHARACTER VARYING(2) REFERENCES country (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  rank integer,
  rank_unique integer,
  langs integer
);

CREATE TABLE country_occupation
(
  country CHARACTER VARYING(2) REFERENCES country (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  occupation integer REFERENCES occupation (id)
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  num_people integer
);

COMMIT;


-- INSERT into person_occupation_rank (person, occupation, langs, rank, rank_unique) (
-- 	SELECT
-- 		id as person, occupation, langs,
-- 		dense_rank() OVER (PARTITION BY occupation ORDER BY langs DESC),
-- 		row_number() OVER (PARTITION BY occupation ORDER BY langs DESC)
-- 	FROM
-- 		person
-- 	ORDER BY occupation, langs DESC
-- );

-- INSERT into person_birthyear_rank (person, birthyear, langs, rank, rank_unique) (
-- 	SELECT
-- 		id as person, birthyear, langs,
-- 		dense_rank() OVER (PARTITION BY birthyear ORDER BY langs DESC),
-- 		row_number() OVER (PARTITION BY birthyear ORDER BY langs DESC)
-- 	FROM
-- 		person
-- 	WHERE
-- 		birthyear IS NOT NULL
-- 	ORDER BY birthyear DESC, langs DESC
-- );

-- INSERT into person_birthcountry_rank (person, birthcountry, langs, rank, rank_unique) (
-- 	SELECT
-- 		id as person, birthcountry, langs,
-- 		dense_rank() OVER (PARTITION BY birthcountry ORDER BY langs DESC),
-- 		row_number() OVER (PARTITION BY birthcountry ORDER BY langs DESC)
-- 	FROM
-- 		person
-- 	WHERE
-- 		birthcountry IS NOT NULL
-- 	ORDER BY birthcountry, langs DESC
-- );

-- UPDATE occupation
-- SET num_born=subq.num_born
-- FROM (SELECT occupation, count(*) AS num_born FROM person GROUP BY occupation) AS subq
-- WHERE occupation.id=subq.occupation;

-- UPDATE country
-- SET num_born=subq.num_born
-- FROM (SELECT birthcountry, count(*) AS num_born FROM person GROUP BY birthcountry) AS subq
-- WHERE country.id=subq.birthcountry;

-- UPDATE year
-- SET num_born=subq.num_born
-- FROM (SELECT birthyear, count(*) AS num_born FROM person GROUP BY birthyear) AS subq
-- WHERE year.id=subq.birthyear;

-- UPDATE year
-- SET num_died=subq.num_died
-- FROM (SELECT deathyear, count(*) AS num_died FROM person GROUP BY deathyear) AS subq
-- WHERE year.id=subq.deathyear;

-- UPDATE year
-- SET num_died=subq.num_died
-- FROM (SELECT deathyear, count(*) AS num_died FROM person GROUP BY deathyear) AS subq
-- WHERE year.id=subq.deathyear;

-- INSERT INTO country_occupation (country, occupation, num_people) (
-- SELECT
-- 	birthcountry, occupation, count(*)
-- FROM
-- 	person
-- WHERE
-- 	birthcountry IS NOT NULL AND occupation IS NOT NULL
-- GROUP BY
-- 	birthcountry, occupation
-- ORDER BY birthcountry, occupation
-- );
