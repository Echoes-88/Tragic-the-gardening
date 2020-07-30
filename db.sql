CREATE TABLE IF NOT EXISTS "player" (
  "id" SERIAL PRIMARY KEY,
  "firstname" TEXT,
  "lastname" TEXT,
  "pseudo" TEXT,
  "email" TEXT,
  "victory" INT,
  "defeat" INT,
  "psw" TEXT
),

ALTER TABLE "player"
ADD COLUMN psw TEXT;

INSERT INTO "player"("firstname", "lastname", "pseudo", "email", "victory", "defeat", "psw") VALUES
('Bender', 'Tordeur Rodríguez','Computer', 'futurama@aol.com', 0, 0, 'Bender'), ('Simon', 'Jacquemin','Computer', 'futurama@aol.com', 0, 0, '1234');


 id | firstname |     lastname      |  pseudo  |          email          | victory | defeat |  psw   
----+-----------+-------------------+----------+-------------------------+---------+--------+--------
  1 | Bender    | Tordeur Rodríguez | Computer | futurama@aol.com        |       0 |      0 | Bender
  2 | Simon     | Jacquemin         | Sim      | jacqueminsimon@yahoo.fr |       0 |      0 | 1234



CREATE TABLE IF NOT EXISTS "card" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "text" TEXT,
  "attack" INT,
  "defense" INT,
  "hit_point" INT,
  "special" INT
),


CREATE TABLE IF NOT EXISTS "booster" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "text" TEXT,
  "type" TEXT,
  "effect_1" INT,
  "effect_2" INT
),


INSERT INTO "card"("name", "text", "attack", "defense", "hit_point", "special") VALUES
('canigou', 'Lorem ipsum', 7, 5, 4, 0),
('Le faucheur', 'Lorem ipsum', 7, 5, 6, 0),
('Dement Boucher', 'Lorem ipsum', 6, 4, 7, 0),
('Le contrôleur', 'Lorem ipsum', 6, 7, 6, 0),
('Le mastificateur', 'Lorem ipsum', 6, 5, 5, 0),
('Les écorcheurs', 'Lorem ipsum', 5, 5, 5, 0),
('Robots de combat', 'Lorem ipsum', 6, 10, 8, 0),
('Brahmines', 'Lorem ipsum', 5, 7, 3, 0),
('Griffemort', 'Lorem ipsum', 9, 7, 9, 0),
('Gros rats', 'Lorem ipsum', 3, 3, 3, 0),
('Mantes', 'Lorem ipsum', 4, 7, 4, 0),
('Rats', 'Lorem ipsum', 2, 4, 3, 0),
('Geckos de Feu', 'Lorem ipsum', 5, 5, 4, 0),
