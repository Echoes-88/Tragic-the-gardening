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
(1, 'canigou', 'Lorem ipsum', 7, 5, 4, 0, null, 0),
(2, 'Le faucheur', 'Lorem ipsum', 7, 5, 6, 0, null, 0),
(3, 'Dement Boucher', 'Lorem ipsum', 6, 4, 7, 0, null, 0),
(4, 'Le contrôleur', 'Lorem ipsum', 6, 7, 6, 0, null, 0),
(5, 'Le mastificateur', 'Lorem ipsum', 6, 5, 5, 0, null, 0),
(6, 'Les écorcheurs', 'Lorem ipsum', 5, 5, 5, 0, null, 0),
(7, 'Robots de combat', 'Lorem ipsum', 6, 10, 8, 0, null, 0),
(8, 'Brahmines', 'Lorem ipsum', 5, 7, 3, 0, null, 0),
(9, 'Griffemort', 'Lorem ipsum', 9, 7, 9, 0, null, 0),
(10, 'Gros rats', 'Lorem ipsum', 3, 3, 3, 0, null, 0),
(11, 'Mantes', 'Lorem ipsum', 4, 7, 4, 0, null, 0),
(12, 'Rats', 'Lorem ipsum', 2, 4, 3, 0, null, 0),
(13, 'Geckos de Feu', 'Lorem ipsum', 5, 5, 4, 0, null, 0);


-- -----------------------------------------------------
-- Ajout de données BOOSTER
-- -----------------------------------------------------
INSERT INTO "booster"("id", "title", "text", "special_effect_value", "special_effect_text", "special_effect_value_2", "special_effect_text_2", "position") VALUES
(1, 'Stimpack', 'Lorem ipsum', 3, 'heal', null, null, 0),
(2, 'Buffout', 'Lorem ipsum', 2, 'attack', 2, 'hit point', 0),
(3, 'Mentats', 'Lorem ipsum', 3, 'defense', null, null, 0),
(4, 'Hintbook', 'Lorem ipsum', 6, 'attack', 7, 'defense', 0),
(5, 'Premiers secours', 'Lorem ipsum', 4, 'heal', null, null, 0);

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