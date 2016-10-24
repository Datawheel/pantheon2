UPDATE person
SET
	profession_rank=subq.profession_rank, profession_rank_unique=subq.profession_rank_unique,
	birthyear_rank=subq.birthyear_rank, birthyear_rank_unique=subq.birthyear_rank_unique,
	birthcountry_rank=subq.birthcountry_rank, birthcountry_rank_unique=subq.birthcountry_rank_unique,
	birthplace_rank=subq.birthplace_rank, birthplace_rank_unique=subq.birthplace_rank_unique,
	deathyear_rank=subq.deathyear_rank, deathyear_rank_unique=subq.deathyear_rank_unique,
	deathcountry_rank=subq.deathcountry_rank, deathcountry_rank_unique=subq.deathcountry_rank_unique,
	deathplace_rank=subq.deathplace_rank, deathplace_rank_unique=subq.deathplace_rank_unique
FROM (
	SELECT
		id AS person,
		dense_rank() OVER (PARTITION BY profession ORDER BY langs DESC) as profession_rank,
		row_number() OVER (PARTITION BY profession ORDER BY langs DESC) as profession_rank_unique,
		dense_rank() OVER (PARTITION BY birthyear ORDER BY langs DESC) as birthyear_rank,
		row_number() OVER (PARTITION BY birthyear ORDER BY langs DESC) as birthyear_rank_unique,
		dense_rank() OVER (PARTITION BY birthcountry ORDER BY langs DESC) as birthcountry_rank,
		row_number() OVER (PARTITION BY birthcountry ORDER BY langs DESC) as birthcountry_rank_unique,
		dense_rank() OVER (PARTITION BY birthplace ORDER BY langs DESC) as birthplace_rank,
		row_number() OVER (PARTITION BY birthplace ORDER BY langs DESC) as birthplace_rank_unique,
		dense_rank() OVER (PARTITION BY deathyear ORDER BY langs DESC WHERE deathyear is not null) as deathyear_rank,
		row_number() OVER (PARTITION BY deathyear ORDER BY langs DESC WHERE deathyear is not null) as deathyear_rank_unique,
		dense_rank() OVER (PARTITION BY deathcountry ORDER BY langs DESC) as deathcountry_rank,
		row_number() OVER (PARTITION BY deathcountry ORDER BY langs DESC) as deathcountry_rank_unique,
		dense_rank() OVER (PARTITION BY deathplace ORDER BY langs DESC) as deathplace_rank,
		row_number() OVER (PARTITION BY deathplace ORDER BY langs DESC) as deathplace_rank_unique
	FROM
		person
) AS subq
WHERE person.id=subq.person;

UPDATE profession
SET num_born=subq.num_born
FROM (SELECT profession, count(*) AS num_born FROM person GROUP BY profession) AS subq
WHERE profession.id=subq.profession;

UPDATE place
SET num_born=subq.num_born
FROM (SELECT birthcountry, count(*) AS num_born FROM person GROUP BY birthcountry) AS subq
WHERE place.id=subq.birthcountry;

UPDATE place
SET num_born=subq.num_born
FROM (SELECT birthplace, count(*) AS num_born FROM person GROUP BY birthplace) AS subq
WHERE place.id=subq.birthplace;

UPDATE place
SET num_died=subq.num_died
FROM (SELECT deathcountry, count(*) AS num_died FROM person GROUP BY deathcountry) AS subq
WHERE place.id=subq.deathcountry;

UPDATE place
SET num_died=subq.num_died
FROM (SELECT deathplace, count(*) AS num_died FROM person GROUP BY deathplace) AS subq
WHERE place.id=subq.deathplace;

UPDATE year
SET num_born=subq.num_born
FROM (SELECT birthyear, count(*) AS num_born FROM person GROUP BY birthyear) AS subq
WHERE year.id=subq.birthyear;

UPDATE year
SET num_died=subq.num_died
FROM (SELECT deathyear, count(*) AS num_died FROM person GROUP BY deathyear) AS subq
WHERE year.id=subq.deathyear;

INSERT INTO place_profession (place, profession, num_born) (
SELECT
    birthcountry, profession, count(*)
FROM
    person
WHERE
    birthcountry IS NOT NULL AND profession IS NOT NULL
GROUP BY
    birthcountry, profession
ORDER BY birthcountry, profession
);

UPDATE place_profession
SET num_died=subq.num_died
FROM (
    SELECT deathcountry, profession, count(*) AS num_died
    FROM person
    WHERE deathcountry IS NOT NULL AND profession IS NOT NULL
    GROUP BY deathcountry, profession
) AS subq
WHERE place_profession.place=subq.deathcountry AND place_profession.profession=subq.profession;

INSERT INTO place_profession (place, profession, num_born) (
SELECT
    birthplace, profession, count(*)
FROM
    person
WHERE
    birthplace IS NOT NULL AND profession IS NOT NULL
GROUP BY
    birthplace, profession
ORDER BY birthplace, profession
);

UPDATE place_profession
SET num_died=subq.num_died
FROM (
    SELECT deathplace, profession, count(*) AS num_died
    FROM person
    WHERE deathplace IS NOT NULL AND profession IS NOT NULL
    GROUP BY deathplace, profession
) AS subq
WHERE place_profession.place=subq.deathplace AND place_profession.profession=subq.profession;

UPDATE person
SET deathplace=NULL, deathplace_rank=NULL, deathplace_rank_unique=NULL, deathcountry=NULL, deathcountry_rank=NULL, deathcountry_rank_unique=NULL, deathyear=NULL, deathyear_rank=NULL, deathyear_rank_unique=NULL
WHERE alive=TRUE;

-- UPDATE places to add rank for people born in a given COUNTRY
UPDATE place
SET
	born_rank=subq2.born_rank, born_rank_unique=subq2.born_rank_unique
FROM (
	SELECT
		subq.country, subq.num_people,
		dense_rank() OVER (ORDER BY subq.num_people DESC) as born_rank,
		row_number() OVER (ORDER BY subq.num_people DESC) as born_rank_unique
	FROM (
		SELECT
			birthcountry AS country,
			count(*) as num_people
		FROM
			person
		WHERE
			birthcountry is not null
		GROUP BY country
	) AS subq
) AS subq2
WHERE place.id=subq2.country;

-- UPDATE places to add rank for people born in a give PLACE
UPDATE place
SET
	born_rank=subq2.born_rank, born_rank_unique=subq2.born_rank_unique
FROM (
	SELECT
		subq.place, subq.num_people,
		dense_rank() OVER (ORDER BY subq.num_people DESC) as born_rank,
		row_number() OVER (ORDER BY subq.num_people DESC) as born_rank_unique
	FROM (
		SELECT
			birthplace AS place,
			count(*) as num_people
		FROM
			person
		WHERE
			birthplace is not null
		GROUP BY place
	) AS subq
) AS subq2
WHERE place.id=subq2.place;
