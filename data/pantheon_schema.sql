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
  country_code CHARACTER VARYING(3),
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
