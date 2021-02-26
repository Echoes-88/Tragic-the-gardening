BEGIN;

-- -----------------------------------------------------
-- Ajout de données USER
-- -----------------------------------------------------
/*
INSERT INTO "user"("id", "firstname", "lastname", "pseudo", "email", "hit_point", "victory", "defeat", "psw", "role") VALUES
(1, 'Bender', 'Tordeur Rodríguez','Computer', 'futurama@aol.com', 0, 0, 0, 'Bender', 'user'), (2, 'Simon', 'Jacquemin','Nikabalte', 'test@test.fr', 0, 0, 0, '1234', 'admin');
*/

-- -----------------------------------------------------
-- Ajout de données MONSTER
-- -----------------------------------------------------
INSERT INTO "monster"("id", "title", "text", "attack", "defense", "hit_point", "special_effect_value", "special_effect_text", "position") VALUES
(1, 'Super Mutant', 'Lorem ipsum', 7, 4, 6, 0, null, 0),
(2, 'Yao guai', 'Lorem ipsum', 5, 3, 4, 0, null, 0),
(3, 'Rataupe', 'Lorem ipsum', 3, 2, 3, 0, null, 0),
(4, 'Ghoule', 'Lorem ipsum', 4, 3, 5, 0, null, 0),
(5, 'Alien', 'Lorem ipsum', 6, 5, 5, 0, null, 0),
(6, 'Assaultron', 'Lorem ipsum', 8, 5, 7, 0, null, 0),
(7, 'Tourelle', 'Lorem ipsum', 6, 6, 5, 0, null, 0),
(8, 'Behemoth', 'Lorem ipsum', 8, 5, 8, 0, null, 0),
(9, 'Brahmine', 'Lorem ipsum', 2, 2, 3, 0, null, 0),
(10, 'Gardon', 'Lorem ipsum', 2, 4, 3, 0, null, 0),
(11, 'Centaure', 'Lorem ipsum', 5, 4, 5, 0, null, 0),
(12, 'Synthétique', 'Lorem ipsum', 6, 7, 6, 0, null, 0),
(13, 'Ghoule X', 'Lorem ipsum', 4, 3, 6, 0, null, 0),
(14, 'M. Handy', 'Lorem ipsum', 7, 7, 6, 0, null, 0),
(15, 'Red Ghoule', 'Lorem ipsum', 5, 5, 5, 0, null, 0);


-- -----------------------------------------------------
-- Ajout de données BOOSTER
-- -----------------------------------------------------
INSERT INTO "booster"("id", "title", "text", "special_effect_value", "special_effect_text", "special_effect_value_2", "special_effect_text_2", "position") VALUES
(1, 'Stimpack', 'Lorem ipsum', 3, 'hit_point', null, null, 0),
(2, 'Buffout', 'Lorem ipsum', 2, 'attack', 2, 'hit_point', 0),
(3, 'Psycho', 'Lorem ipsum', 3, 'attack', null, null, 0),
(4, 'Nuka Cola', 'Lorem ipsum', 2, 'defense', 7, 'defense', 0),
(5, 'Premiers secours', 'Lorem ipsum', 4, 'hit_point', null, null, 0),
(6, 'Med-x', 'Lorem ipsum', 3, 'defense', null, null, 0);

-- -----------------------------------------------------
-- Ajout de données DECK
-- -----------------------------------------------------
-- INSERT INTO "deck"("id", "title", "user_id") VALUES
-- (1, 'Deck computer 1', 1),
-- (2, 'Deck test 1', 2);

-- -----------------------------------------------------
-- Ajout de données DECK_HAS_MONSTER
-- -----------------------------------------------------
-- INSERT INTO "deck_has_monster"("deck_id", "monster_id", "quantity") VALUES
-- (1, 2, 1),
-- (1, 4, 3),
-- (1, 5, 2),
-- (1, 6, 1),
-- (1, 8, 2),
-- (1, 9, 2),
-- (1, 10, 1),
-- (1, 12, 3),
-- (1, 13, 1),
-- (2, 1, 2),
-- (2, 3, 3),
-- (2, 4, 1),
-- (2, 7, 2),
-- (2, 9, 2),
-- (2, 11, 3),
-- (2, 13, 3);

-- -----------------------------------------------------
-- Ajout de données DECK_HAS_BOOSTER
-- -----------------------------------------------------
-- INSERT INTO "deck_has_booster"("deck_id", "booster_id", "quantity") VALUES
-- (1, 1, 2),
-- (1, 3, 2),
-- (1, 5, 2),
-- (2, 2, 2),
-- (2, 4, 2),
-- (2, 5, 2);

COMMIT;