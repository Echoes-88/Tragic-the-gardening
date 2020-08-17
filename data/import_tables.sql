CREATE TABLE IF NOT EXISTS "user" (
  "id" SERIAL PRIMARY KEY,
  "firstname" text NOT NULL,
  "lastname" text NOT NULL,
  "nickname" text NOT NULL,
  "email" text NOT NULL,
  "hit_point" INT NULL,
  "victory" INT NULL,
  "defeat" INT NULL,
  "psw" text NOT NULL
);


CREATE TABLE IF NOT EXISTS "card" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "text" TEXT NULL,
  "attack" INT NULL,
  "defense" INT NULL,
  "hit_point" INT NULL,
  "special" INT NULL
);


CREATE TABLE IF NOT EXISTS "booster" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "text" TEXT NULL,
  "type" TEXT NULL,
  "effect_1" INT NULL,
  "effect_2" INT NULL
);

CREATE TABLE IF NOT EXISTS "deck" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NULL,
  "user_id" integer NOT NULL REFERENCES "user" ("id")
);

CREATE TABLE IF NOT EXISTS "deck_has_card" (
  "deck_id" integer REFERENCES "deck"("id"),
  "card_id" integer REFERENCES "card" ("id"),
  PRIMARY KEY ("deck_id", "card_id")
);

CREATE TABLE IF NOT EXISTS "deck_has_booster" (
  "deck_id" integer REFERENCES "deck"("id"),
  "booster_id" integer REFERENCES "booster" ("id"),
  PRIMARY KEY ("deck_id", "booster_id")
);


