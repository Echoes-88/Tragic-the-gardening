BEGIN;

-- On supprime les tables de la BDD si elles existent déjà
DROP TABLE IF EXISTS 
"user",
"monster",
"booster",
"deck",
"deck_has_monster",
"deck_has_booster";

-- -----------------------------------------------------
-- Ajout de données USER
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS "user" (
  "id" SERIAL PRIMARY KEY,
  "firstname" text NOT NULL,
  "lastname" text NOT NULL,
  "pseudo" text NOT NULL,
  "email" text NOT NULL,
  "hit_point" INT NULL,
  "victory" INT NULL,
  "defeat" INT NULL,
  "level" INT DEFAULT 1,
  "psw" text NOT NULL,
  "role" text DEFAULT 'user',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

-- -----------------------------------------------------
-- Ajout de données MONSTER
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "monster" (
  "id" SERIAL PRIMARY KEY,
  "title" text NOT NULL,
  "text" text NULL,
  "attack" INT NULL,
  "defense" INT NULL,
  "hit_point" INT NULL,
  "special_effect_value" INT NULL,
  "special_effect_text" text NULL,
  "position" INT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

-- -----------------------------------------------------
-- Ajout de données BOOSTER
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "booster" (
  "id" SERIAL PRIMARY KEY,
  "title" text NOT NULL,
  "text" text NULL,
  "special_effect_value" INT NULL,
  "special_effect_text" text NULL,
  "special_effect_value_2" INT NULL,
  "special_effect_text_2" text NULL,
  "position" INT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

-- -----------------------------------------------------
-- DECK
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "deck" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "user_id" integer NOT NULL REFERENCES "user" ("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);
-- -----------------------------------------------------
-- DECK HAS MONSTER
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "deck_has_monster" (
  "deck_id" INT REFERENCES "deck"("id"),
  "monster_id" INT REFERENCES "monster"("id"),
  PRIMARY KEY ("deck_id", "monster_id"),
  "quantity" INT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

-- -----------------------------------------------------
-- DECK HAS BOOSTER
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "deck_has_booster" (
  "deck_id" INT REFERENCES "deck"("id"),
  "booster_id" INT REFERENCES "booster"("id"),
  PRIMARY KEY ("deck_id", "booster_id"),
  "quantity" INT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);


COMMIT;
