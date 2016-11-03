BEGIN;

DROP TABLE IF EXISTS person CASCADE;
DROP TABLE IF EXISTS profession CASCADE;
DROP TABLE IF EXISTS place CASCADE;
DROP TABLE IF EXISTS year CASCADE;
DROP TABLE IF EXISTS place_profession CASCADE;
DROP TABLE IF EXISTS creation CASCADE;
DROP TABLE IF EXISTS pageview CASCADE;
DROP TABLE IF EXISTS search CASCADE;

CREATE TABLE place
(
  id serial PRIMARY KEY,
  wiki_id integer,
  name text NOT NULL,
  slug CHARACTER VARYING(255),
  region CHARACTER VARYING(100),
  country_name CHARACTER VARYING(255),
  country_code CHARACTER VARYING(3),
  continent CHARACTER VARYING(100),
  is_country BOOLEAN NOT NULL DEFAULT FALSE,
  lat_lon point,
  pop real,
  soverign_date integer,
  soverign_date_latest integer,
  num_born integer,
  num_died integer,
  img_link CHARACTER VARYING(255),
  img_author CHARACTER VARYING(255),
  img_meta CHARACTER VARYING(255),
  born_rank integer,
  born_rank_unique integer
);

CREATE TABLE year
(
  id integer PRIMARY KEY,
  name text NOT NULL,
  slug CHARACTER VARYING(255),
  num_born integer,
  num_died integer
);

CREATE TABLE profession
(
  id serial PRIMARY KEY,
  slug CHARACTER VARYING(255) NOT NULL,
  name CHARACTER VARYING(255) NOT NULL,
  industry CHARACTER VARYING(255),
  industry_slug CHARACTER VARYING(255),
  domain CHARACTER VARYING(255),
  domain_slug CHARACTER VARYING(255),
  "group" CHARACTER VARYING(255),
  group_slug CHARACTER VARYING(255),
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

  profession integer NOT NULL REFERENCES profession (id),
  profession_rank integer,
  profession_rank_unique integer,

  occ_acc real,
  langs integer,
  langs_adopt integer,
  twitter CHARACTER VARYING(100),
  alive boolean,
  youtube CHARACTER VARYING(100)
);

CREATE TABLE place_profession
(
  place integer REFERENCES place (id),
  profession integer REFERENCES profession (id),
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

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE TABLE search (
    id integer,
    name character varying(255),
    slug character varying(255),
    weight real,
    primary_meta character varying(255),
    secondary_meta character varying(255),
    document tsvector,
    profile_type character varying(20)
);

COMMIT;
