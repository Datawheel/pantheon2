BEGIN;

DROP TABLE IF EXISTS person_occupation_rank;
DROP TABLE IF EXISTS person_birthyear_rank;
DROP TABLE IF EXISTS person_birthplace_rank;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS occupation;
DROP TABLE IF EXISTS place;
DROP TABLE IF EXISTS year;

CREATE TABLE place
(
  id serial PRIMARY KEY,
  wiki_id integer,
  name text NOT NULL,
  slug CHARACTER VARYING(255),
  country_name CHARACTER VARYING(255),
  country_code CHARACTER VARYING(2),
  lat real,
  lon real,
  pop real,
  num_born integer,
  num_died integer
);

CREATE TABLE year
(
  id integer PRIMARY KEY,
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

  birthyear integer REFERENCES year (id),
  birthyear_rank integer,
  birthyear_rank_unique integer,

  deathyear integer REFERENCES year (id),
  deathyear_rank integer,
  deathyear_rank_unique integer,

  birthplace integer REFERENCES place (id),
  birthplace_rank integer,
  birthplace_rank_unique integer,

  birthcountry integer REFERENCES place (id),
  birthcountry_rank integer,
  birthcountry_rank_unique integer,

  deathplace integer REFERENCES place (id),
  deathplace_rank integer,
  deathplace_rank_unique integer,

  deathcountry integer REFERENCES place (id),
  deathcountry_rank integer,
  deathcountry_rank_unique integer,

  occupation integer NOT NULL REFERENCES occupation (id),
  occupation_rank integer,
  occupation_rank_unique integer,

  occ_acc real,
  langs integer,
  langs_adopt integer,
  twitter CHARACTER VARYING(100),
  alive boolean
);

CREATE TABLE place_occupation
(
  place integer REFERENCES place (id),
  occupation integer REFERENCES occupation (id),
  num_born integer,
  num_died integer
);

CREATE TABLE creation
(
  person integer REFERENCES person (id),
  lang CHARACTER VARYING(16) NOT NULL,
  creation_date timestamp NOT NULL
);

CREATE TABLE pageview
(
  person integer REFERENCES person (id),
  pageview_date timestamp NOT NULL,
  num_pageviews integer
);

COMMIT;

UPDATE person
SET
	occupation_rank=subq.occupation_rank, occupation_rank_unique=subq.occupation_rank_unique,
	birthyear_rank=subq.birthyear_rank, birthyear_rank_unique=subq.birthyear_rank_unique,
	birthcountry_rank=subq.birthcountry_rank, birthcountry_rank_unique=subq.birthcountry_rank_unique,
	birthplace_rank=subq.birthplace_rank, birthplace_rank_unique=subq.birthplace_rank_unique,
	deathyear_rank=subq.deathyear_rank, deathyear_rank_unique=subq.deathyear_rank_unique,
	deathcountry_rank=subq.deathcountry_rank, deathcountry_rank_unique=subq.deathcountry_rank_unique,
	deathplace_rank=subq.deathplace_rank, deathplace_rank_unique=subq.deathplace_rank_unique
FROM (
	SELECT
		id AS person,
		dense_rank() OVER (PARTITION BY occupation ORDER BY langs DESC) as occupation_rank,
		row_number() OVER (PARTITION BY occupation ORDER BY langs DESC) as occupation_rank_unique,
		dense_rank() OVER (PARTITION BY birthyear ORDER BY langs DESC) as birthyear_rank,
		row_number() OVER (PARTITION BY birthyear ORDER BY langs DESC) as birthyear_rank_unique,
		dense_rank() OVER (PARTITION BY birthcountry ORDER BY langs DESC) as birthcountry_rank,
		row_number() OVER (PARTITION BY birthcountry ORDER BY langs DESC) as birthcountry_rank_unique,
		dense_rank() OVER (PARTITION BY birthplace ORDER BY langs DESC) as birthplace_rank,
		row_number() OVER (PARTITION BY birthplace ORDER BY langs DESC) as birthplace_rank_unique,
		dense_rank() OVER (PARTITION BY deathyear ORDER BY langs DESC) as deathyear_rank,
		row_number() OVER (PARTITION BY deathyear ORDER BY langs DESC) as deathyear_rank_unique,
		dense_rank() OVER (PARTITION BY deathcountry ORDER BY langs DESC) as deathcountry_rank,
		row_number() OVER (PARTITION BY deathcountry ORDER BY langs DESC) as deathcountry_rank_unique,
		dense_rank() OVER (PARTITION BY deathplace ORDER BY langs DESC) as deathplace_rank,
		row_number() OVER (PARTITION BY deathplace ORDER BY langs DESC) as deathplace_rank_unique
	FROM
		person
) AS subq
WHERE person.id=subq.person;

-- UPDATE occupation
-- SET num_born=subq.num_born
-- FROM (SELECT occupation, count(*) AS num_born FROM person GROUP BY occupation) AS subq
-- WHERE occupation.id=subq.occupation;

-- UPDATE place
-- SET num_born=subq.num_born
-- FROM (SELECT birthcountry, count(*) AS num_born FROM person GROUP BY birthcountry) AS subq
-- WHERE place.id=subq.birthcountry;

-- UPDATE place
-- SET num_born=subq.num_born
-- FROM (SELECT birthplace, count(*) AS num_born FROM person GROUP BY birthplace) AS subq
-- WHERE place.id=subq.birthplace;

-- UPDATE place
-- SET num_died=subq.num_died
-- FROM (SELECT deathcountry, count(*) AS num_died FROM person GROUP BY deathcountry) AS subq
-- WHERE place.id=subq.deathcountry;
--
-- UPDATE place
-- SET num_died=subq.num_died
-- FROM (SELECT deathplace, count(*) AS num_died FROM person GROUP BY deathplace) AS subq
-- WHERE place.id=subq.deathplace;

-- UPDATE year
-- SET num_born=subq.num_born
-- FROM (SELECT birthyear, count(*) AS num_born FROM person GROUP BY birthyear) AS subq
-- WHERE year.id=subq.birthyear;

-- UPDATE year
-- SET num_died=subq.num_died
-- FROM (SELECT deathyear, count(*) AS num_died FROM person GROUP BY deathyear) AS subq
-- WHERE year.id=subq.deathyear;

-- INSERT INTO place_occupation (place, occupation, num_born) (
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
--
-- UPDATE place_occupation
-- SET num_died=subq.num_died
-- FROM (
-- 	SELECT deathcountry, occupation, count(*) AS num_died
-- 	FROM person
-- 	WHERE deathcountry IS NOT NULL AND occupation IS NOT NULL
-- 	GROUP BY deathcountry, occupation
-- ) AS subq
-- WHERE place_occupation.place=subq.deathcountry AND place_occupation.occupation=subq.occupation;
--
-- INSERT INTO place_occupation (place, occupation, num_born) (
-- SELECT
-- 	birthplace, occupation, count(*)
-- FROM
-- 	person
-- WHERE
-- 	birthplace IS NOT NULL AND occupation IS NOT NULL
-- GROUP BY
-- 	birthplace, occupation
-- ORDER BY birthplace, occupation
-- );
--
-- UPDATE place_occupation
-- SET num_died=subq.num_died
-- FROM (
-- 	SELECT deathplace, occupation, count(*) AS num_died
-- 	FROM person
-- 	WHERE deathplace IS NOT NULL AND occupation IS NOT NULL
-- 	GROUP BY deathplace, occupation
-- ) AS subq
-- WHERE place_occupation.place=subq.deathplace AND place_occupation.occupation=subq.occupation;
