BEGIN;

DROP TABLE IF EXISTS person CASCADE;
DROP TABLE IF EXISTS occupation CASCADE;
DROP TABLE IF EXISTS place CASCADE;
DROP TABLE IF EXISTS year CASCADE;
DROP TABLE IF EXISTS indicators CASCADE;
DROP TABLE IF EXISTS search CASCADE;

CREATE TABLE place
(
  id integer PRIMARY KEY,
  name text NOT NULL,
  slug CHARACTER VARYING(255),
  region CHARACTER VARYING(100),
  country_name CHARACTER VARYING(255),
  country_code CHARACTER VARYING(3),
  country_num smallint,
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
  born_rank_unique integer,
  died_rank integer,
  died_rank_unique integer
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
  occupation CHARACTER VARYING(255) NOT NULL,
  occupation_slug CHARACTER VARYING(255) NOT NULL,
  industry CHARACTER VARYING(255),
  industry_slug CHARACTER VARYING(255),
  "group" CHARACTER VARYING(255),
  group_slug CHARACTER VARYING(255),
  domain CHARACTER VARYING(255),
  domain_slug CHARACTER VARYING(255),
  num_born integer,
  num_born_men integer,
  num_born_women integer
);

CREATE TABLE person
(
  id integer PRIMARY KEY,
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
  hpi real,
  twitter CHARACTER VARYING(100),
  alive boolean,
  youtube CHARACTER VARYING(100)
);

CREATE TABLE indicators
(
  person integer REFERENCES person (id),
  pageview_date timestamp NOT NULL,
  num_pageviews integer,
  num_langs integer,
  l_nw real,
  l_mw real,
  r integer,
  r_mr real,
  c real,
  c_n real,
  s real,
  s_n real
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
