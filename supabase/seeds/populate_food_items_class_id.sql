-- Populate YOLO/spreadsheet class IDs without changing database primary keys.
-- Source: fooddata_central_nutrients_wide.xlsx
-- Expected mapping: 216 classes, IDs 0-215.

BEGIN;

ALTER TABLE public.food_items
  ADD COLUMN IF NOT EXISTS class_id int4;

CREATE TEMP TABLE class_id_seed (
  class_id int4 PRIMARY KEY,
  name text NOT NULL UNIQUE
) ON COMMIT DROP;

INSERT INTO class_id_seed (class_id, name)
SELECT class_id, name
FROM jsonb_to_recordset('[{"class_id":0,"name":"adobo"},{"class_id":1,"name":"almond-jelly"},{"class_id":2,"name":"apple"},{"class_id":3,"name":"apple-pie"},{"class_id":4,"name":"babi-guling"},{"class_id":5,"name":"bagel"},{"class_id":6,"name":"bak-kut-teh"},{"class_id":7,"name":"ball-shaped-bun-with-pork"},{"class_id":8,"name":"barbecued-red-pork-in-sauce-with-rice"},{"class_id":9,"name":"bean-curd-family-style"},{"class_id":10,"name":"beef-bowl"},{"class_id":11,"name":"beef-curry"},{"class_id":12,"name":"beef-noodle-soup"},{"class_id":13,"name":"bibimbap"},{"class_id":14,"name":"boiled-chicken-and-vegetables"},{"class_id":15,"name":"boiled-fish"},{"class_id":16,"name":"boned-sliced-hainan-style-chicken-with-marinated-rice"},{"class_id":17,"name":"braised-pork-meat-ball-with-napa-cabbage"},{"class_id":18,"name":"broiled-eel-bowl"},{"class_id":19,"name":"brownie"},{"class_id":20,"name":"bubur-ayam"},{"class_id":21,"name":"cabbage-roll"},{"class_id":22,"name":"caesar-salad"},{"class_id":23,"name":"champon"},{"class_id":24,"name":"charcoal-boiled-pork-neck"},{"class_id":25,"name":"chicken-cutlet"},{"class_id":26,"name":"chicken-n-egg-on-rice"},{"class_id":27,"name":"chicken-nugget"},{"class_id":28,"name":"chicken-rice-curry-with-coconut"},{"class_id":29,"name":"chilled-noodle"},{"class_id":30,"name":"chop-suey"},{"class_id":31,"name":"churro"},{"class_id":32,"name":"clear-soup"},{"class_id":33,"name":"coconut-milk-flavored-crepes-with-shrimp-and-beef"},{"class_id":34,"name":"coconut-milk-soup"},{"class_id":35,"name":"cold-tofu"},{"class_id":36,"name":"crape"},{"class_id":37,"name":"cream-puff"},{"class_id":38,"name":"crispy-noodles"},{"class_id":39,"name":"croissant"},{"class_id":40,"name":"croquette"},{"class_id":41,"name":"crullers"},{"class_id":42,"name":"curry-puff"},{"class_id":43,"name":"custard-tart"},{"class_id":44,"name":"cutlet-curry"},{"class_id":45,"name":"dipping-noodles"},{"class_id":46,"name":"dish-consisting-of-stir-fried-potato-eggplant-and-green-pepper"},{"class_id":47,"name":"doughnut"},{"class_id":48,"name":"dried-fish"},{"class_id":49,"name":"dry-curry"},{"class_id":50,"name":"eels-on-rice"},{"class_id":51,"name":"egg-noodle-in-chicken-yellow-curry"},{"class_id":52,"name":"egg-roll"},{"class_id":53,"name":"egg-sunny-side-up"},{"class_id":54,"name":"eggplant-with-garlic-sauce"},{"class_id":55,"name":"fine-white-noodles"},{"class_id":56,"name":"fish-shaped-pancake-with-bean-jam"},{"class_id":57,"name":"french-bread"},{"class_id":58,"name":"french-fries"},{"class_id":59,"name":"french-toast"},{"class_id":60,"name":"fried-chicken"},{"class_id":61,"name":"fried-fish"},{"class_id":62,"name":"fried-mussel-pancakes"},{"class_id":63,"name":"fried-noodle"},{"class_id":64,"name":"fried-pork-dumplings-served-in-soup"},{"class_id":65,"name":"fried-pork-in-scoop"},{"class_id":66,"name":"fried-rice"},{"class_id":67,"name":"fried-shrimp"},{"class_id":68,"name":"fried-spring-rolls"},{"class_id":69,"name":"ginger-pork-saute"},{"class_id":70,"name":"glutinous-rice-balls"},{"class_id":71,"name":"goya-chanpuru"},{"class_id":72,"name":"gratin"},{"class_id":73,"name":"green-curry"},{"class_id":74,"name":"green-salad"},{"class_id":75,"name":"grilled-chicken"},{"class_id":76,"name":"grilled-eggplant"},{"class_id":77,"name":"grilled-pacific-saury"},{"class_id":78,"name":"gulai"},{"class_id":79,"name":"hambarg-steak"},{"class_id":80,"name":"hamburger"},{"class_id":81,"name":"haupia"},{"class_id":82,"name":"hot-and-sour-fish-and-vegetable-ragout"},{"class_id":83,"name":"hot-and-sour-soup"},{"class_id":84,"name":"hot-dog"},{"class_id":85,"name":"hot-pot"},{"class_id":86,"name":"hue-beef-rice-vermicelli-soup"},{"class_id":87,"name":"inarizushi"},{"class_id":88,"name":"jambalaya"},{"class_id":89,"name":"japanese-style-pancake"},{"class_id":90,"name":"japanese-tofu-and-vegetable-chowder"},{"class_id":91,"name":"jiaozi"},{"class_id":92,"name":"jjigae"},{"class_id":93,"name":"kamameshi"},{"class_id":94,"name":"kaya-toast"},{"class_id":95,"name":"khao-soi"},{"class_id":96,"name":"kinpira-style-sauteed-burdock"},{"class_id":97,"name":"kushikatu"},{"class_id":98,"name":"laksa"},{"class_id":99,"name":"lamb-kebabs"},{"class_id":100,"name":"lasagna"},{"class_id":101,"name":"laulau"},{"class_id":102,"name":"lightly-roasted-fish"},{"class_id":103,"name":"loco-moco"},{"class_id":104,"name":"lumpia"},{"class_id":105,"name":"macaroni-salad"},{"class_id":106,"name":"malasada"},{"class_id":107,"name":"mango-pudding"},{"class_id":108,"name":"meat-loaf"},{"class_id":109,"name":"mie-ayam"},{"class_id":110,"name":"minced-pork-rice"},{"class_id":111,"name":"minestrone"},{"class_id":112,"name":"miso-soup"},{"class_id":113,"name":"mixed-rice"},{"class_id":114,"name":"moon-cake"},{"class_id":115,"name":"muffin"},{"class_id":116,"name":"mushroom-risotto"},{"class_id":117,"name":"nachos"},{"class_id":118,"name":"nanbanzuke"},{"class_id":119,"name":"natto"},{"class_id":120,"name":"noodles-with-fish-curry"},{"class_id":121,"name":"oatmeal"},{"class_id":122,"name":"oden"},{"class_id":123,"name":"okinawa-soba"},{"class_id":124,"name":"omelet"},{"class_id":125,"name":"orange"},{"class_id":126,"name":"oshiruko"},{"class_id":127,"name":"oxtail-soup"},{"class_id":128,"name":"paella"},{"class_id":129,"name":"pancake"},{"class_id":130,"name":"parfait"},{"class_id":131,"name":"pho"},{"class_id":132,"name":"pilaf"},{"class_id":133,"name":"pizza"},{"class_id":134,"name":"pizza-toast"},{"class_id":135,"name":"popcorn"},{"class_id":136,"name":"pork-belly"},{"class_id":137,"name":"pork-cutlet"},{"class_id":138,"name":"pork-satay"},{"class_id":139,"name":"pork-sticky-noodles"},{"class_id":140,"name":"pork-with-lemon"},{"class_id":141,"name":"pot-au-feu"},{"class_id":142,"name":"potage"},{"class_id":143,"name":"potato-salad"},{"class_id":144,"name":"raisin-bread"},{"class_id":145,"name":"ramen-noodle"},{"class_id":146,"name":"rare-cheese-cake"},{"class_id":147,"name":"rice"},{"class_id":148,"name":"rice-ball"},{"class_id":149,"name":"rice-crispy-pork"},{"class_id":150,"name":"rice-gratin"},{"class_id":151,"name":"rice-gruel"},{"class_id":152,"name":"rice-vermicelli"},{"class_id":153,"name":"rice-with-roast-duck"},{"class_id":154,"name":"roast-chicken"},{"class_id":155,"name":"roast-duck"},{"class_id":156,"name":"roll-bread"},{"class_id":157,"name":"salmon"},{"class_id":158,"name":"salt-and-pepper-fried-shrimp-with-shell"},{"class_id":159,"name":"samul"},{"class_id":160,"name":"sandwiches"},{"class_id":161,"name":"sashimi"},{"class_id":162,"name":"sausage"},{"class_id":163,"name":"sauteed-spinach"},{"class_id":164,"name":"sauteed-vegetables"},{"class_id":165,"name":"scone"},{"class_id":166,"name":"scrambled-egg"},{"class_id":167,"name":"shortcake"},{"class_id":168,"name":"shrimp-patties"},{"class_id":169,"name":"shrimp-with-chill-source"},{"class_id":170,"name":"simmered-pork"},{"class_id":171,"name":"small-steamed-savory-rice-pancake"},{"class_id":172,"name":"soba-noodle"},{"class_id":173,"name":"sour-prawn-soup"},{"class_id":174,"name":"spaghetti"},{"class_id":175,"name":"spaghetti-meat-sauce"},{"class_id":176,"name":"spam-musubi"},{"class_id":177,"name":"spicy-chicken-salad"},{"class_id":178,"name":"spicy-chili-flavored-tofu"},{"class_id":179,"name":"steak"},{"class_id":180,"name":"steamed-egg-hotchpotch"},{"class_id":181,"name":"steamed-meat-dumpling"},{"class_id":182,"name":"steamed-rice-roll"},{"class_id":183,"name":"steamed-spareribs"},{"class_id":184,"name":"stew"},{"class_id":185,"name":"stewed-pork-leg"},{"class_id":186,"name":"stinky-tofu"},{"class_id":187,"name":"stir-fried-beef"},{"class_id":188,"name":"stir-fried-chicken"},{"class_id":189,"name":"stir-fried-mixed-vegetables"},{"class_id":190,"name":"sukiyaki"},{"class_id":191,"name":"sushi"},{"class_id":192,"name":"sushi-bowl"},{"class_id":193,"name":"sweet-and-sour-pork"},{"class_id":194,"name":"tacos"},{"class_id":195,"name":"takoyaki"},{"class_id":196,"name":"tanmen"},{"class_id":197,"name":"tempura"},{"class_id":198,"name":"tempura-bowl"},{"class_id":199,"name":"tempura-udon"},{"class_id":200,"name":"tensin-noodle"},{"class_id":201,"name":"teriyaki-grilled-fish"},{"class_id":202,"name":"thai-papaya-salad"},{"class_id":203,"name":"tiramisu"},{"class_id":204,"name":"toast"},{"class_id":205,"name":"tortilla"},{"class_id":206,"name":"trunip-pudding"},{"class_id":207,"name":"twice-cooked-pork"},{"class_id":208,"name":"udon-noodle"},{"class_id":209,"name":"vegetable-tempura"},{"class_id":210,"name":"vermicelli-noodles-with-snails"},{"class_id":211,"name":"waffle"},{"class_id":212,"name":"xiao-long-bao"},{"class_id":213,"name":"yakitori"},{"class_id":214,"name":"yellow-curry"},{"class_id":215,"name":"zha-jiang-mian"}]'::jsonb)
  AS x(class_id int4, name text);

-- Stop instead of silently producing a partial mapping.
DO $$
DECLARE
  missing_names text;
BEGIN
  SELECT string_agg(s.name, ', ' ORDER BY s.class_id)
  INTO missing_names
  FROM class_id_seed s
  LEFT JOIN public.food_items f ON f.name = s.name
  WHERE f.id IS NULL;

  IF missing_names IS NOT NULL THEN
    RAISE EXCEPTION 'food_items rows missing for class names: %', missing_names;
  END IF;
END $$;

UPDATE public.food_items f
SET class_id = s.class_id
FROM class_id_seed s
WHERE f.name = s.name
  AND f.class_id IS DISTINCT FROM s.class_id;

CREATE UNIQUE INDEX IF NOT EXISTS food_items_class_id_key
  ON public.food_items (class_id);

COMMIT;

-- Verification: should return 216 mapped foods, with IDs 0 through 215.
SELECT
  COUNT(*) FILTER (WHERE class_id IS NOT NULL) AS mapped_foods,
  MIN(class_id) AS minimum_class_id,
  MAX(class_id) AS maximum_class_id
FROM public.food_items;
