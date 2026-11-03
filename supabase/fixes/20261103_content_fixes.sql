-- One-off content fixes for the live database (same corrections as supabase/seed.sql).
-- Run once in the Supabase SQL editor, or: psql "$DATABASE_URL" -f supabase/fixes/20261103_content_fixes.sql
-- Safe to re-run: updates set fixed values by id, and Lens answers are only added if missing.
-- Not a migration on purpose: on a fresh database migrations run before the seed, when these rows don't exist yet.

begin;

-- Categories ------------------------------------------------------------------
update public.categories set description = 'Země se ocitla na pokraji ekologického kolapsu a společnost se potácí v nejistotě.' where id = 11;
update public.categories set description = 'Aktuálně si zahrajte příběh MarsGate!' where id = 12;

-- Fun facts -------------------------------------------------------------------
update public.fun_facts set
  title = 'Do roku 2020 měla na Facebooku reakce „To mě štve“ v algoritmech až pětkrát vyšší hodnotu než lajk.',
  text  = 'Merrill, Jeremy B., and Will Oremus. 2021. “Five Points for Anger, One for a ‘Like’: How Facebook’s Formula Fostered Rage and Misinformation.” The Washington Post, October 26, 2021. https://www.washingtonpost.com/technology/2021/10/26/facebook-angry-emoji-algorithm/.'
where id = 12;

update public.fun_facts set
  title = 'Zatímco smutek v nás vzbuzuje bezmoc, vztek nás motivuje k akci, jako je komentování či sdílení příspěvku, který nemusí být pravdivý.',
  text  = 'Horner, Christy Galletta, Dennis Galletta, Jennifer Crawford, and Abhijeet Shirsat. 2021. “Emotions: The Unexplored Fuel of Fake News on Social Media.” Journal of Management Information Systems 38 (4): 1039–66. https://doi.org/10.1080/07421222.2021.1990610.'
where id = 14;

update public.fun_facts set
  text = 'Lühring, Jula, Apeksha Shetty, Corinna Koschmieder, David Garcia, Annie Waldherr, and Hannah Metzler. 2024. “Emotions in Misinformation Studies: Distinguishing Affective State From Emotional Response and Misinformation Recognition From Acceptance.” Cognitive Research: Principles and Implications 9 (1). https://doi.org/10.1186/s41235-024-00607-0.'
where id = 15;

update public.fun_facts set
  title = 'Pokud v nás příspěvek vyvolá jakékoli silné emoce, ať už pozitivní, nebo negativní, je větší šance, že ho budeme sdílet.'
where id = 16;

update public.fun_facts set
  title = 'Politické zprávy jsou nejvirálnější skupinou falešných zpráv. Šíří se až třikrát rychleji než jakákoli jiná kategorie falešných informací.'
where id = 17;

update public.fun_facts set text = trim(text) where id in (18, 19);

-- Intro article (Ivan's post): restore the lost emoji, en dash, strip trailing spaces and \r.
-- The shouting and the vy/ty switching are Ivan's voice and stay.
update public.intro_articles set content = 'Konec mlčení! Pravda musí ven!!!!!!!!!!!!
Dnes jsem zveřejnil první část exkluzivního materiálu, který jsem získal díky kontaktům napojeným na vládní aparát a politiky ze své strany.
Mars není budoucnost. Mars je současnost a elity už tam jsou.
Zatímco nám tvrdí, že „všichni jsme na jedné lodi“, oni si potichu budují nový svět. Obyčejné občany se snaží manipulovat různými dezinformacemi a maskovat svoji tajnou misi.
👉 Podívejte se – exkluzivně pro vás zveřejňuji první fotky:

Pokud chcete, aby tahle pravda nezmizela, sledujte můj kanál a podpořte mě. Vím toho dost, ale přesnější informace řeknu jen své důvěrné skupině. Pokud do ní chceš patřit, dej mi vědět a domluvíme se!
Sdílejte, než to smažou.
#MarsGate #PravdaSeŠíří #ElityUtíkají
'
where id = 6;

-- Glossary (level 1) ----------------------------------------------------------
update public.intro_questions set description = 'Úmyslně šířená nepravdivá informace.' where id = 8;
update public.intro_questions set description = 'Myšlenka, že důležité události nejsou náhodné, ale že za nimi stojí spiknutí mocných lidí. Její zastánci často nevěří oficiálním vysvětlením a místo toho spoléhají na domněnky.' where id = 9;

-- Motivations task (level 2) --------------------------------------------------
update public.manipulative_texts set
  instructions  = 'Jak už víš, zprávu rozšířil právě Ivan – komunální politik, který si říká MarsRebel. Má malou, ale hlasitou základnu sledujících. Tvrdí, že už léta odhaluje pravdu, kterou „nám elity nechtějí říct“. Jeho příspěvky jsou plné silných emocí, dramatických tvrzení a výzev k akci. Ale co ho k tomu vede? Podívej se blíž. Najdeš v jeho textech stopy po tom, proč to vlastně dělá? Vyber dvě hlavní motivace.',
  user_feedback = null
where id = 32;

update public.manipulative_motivations set definition = 'Autor si chce budovat vliv, status nebo autoritu.' where id = 3;
update public.manipulative_motivations set definition = 'Autor chce vydělat, získat podporu nebo zpeněžit obsah.' where id = 4;
update public.manipulative_motivations set definition = 'Autor nerozezná, co je věrohodné, a důvěřuje automaticky.' where id = 5;
update public.manipulative_motivations set definition = 'Komentář je reakcí na obavy nebo úzkost.' where id = 6;
update public.manipulative_motivations set definition = 'Autor se snaží zesměšnit, znevěrohodnit nebo urazit ty, kdo nesouhlasí.' where id = 7;
update public.manipulative_motivations set definition = 'Komentář staví lidi proti sobě a dělí svět na „my vs. oni“.' where id = 9;

update public.manipulative_comments set
  explanation = 'Polarizace společnosti: V komentáři se společnost dělí na „my“ (běžní lidé) a „oni“ (elity, které lžou a manipulují). Takové rozdělování lidí na dvě nesmiřitelné skupiny posiluje nedůvěru, konflikt a ztěžuje racionální diskuzi.'
where id = 6;

update public.manipulative_comments set
  comment     = 'To snad ne! Já mám dvě malé děti a jestli je tohle pravda, tak jsme úplně v háji. Oni nás tady fakt nechají chcípnout?! Jak se vůbec můžou takhle zachovat? Co máme dělat?! 😱😱😱',
  explanation = 'Emoce: Zmínka o dětech, zoufalé otázky a expresivní závěr komentáře („nechají nás chcípnout?!“) způsobují napětí a stres. Takové emoce snižují schopnost kriticky přemýšlet a zvyšují šanci, že člověk uvěří i neověřeným informacím.'
where id = 7;

update public.manipulative_comments set
  comment     = 'Vypadá to fakt reálně… a když to má už tolik sdílení, tak na tom asi něco bude, ne? Hned jsem to poslal všem známým, když to média tutlají!',
  explanation = 'Nízká mediální gramotnost: Autor komentáře vychází z dojmu, že něco musí být pravda, protože to vypadá reálně a má velký počet sdílení. Nechává se tedy ovlivnit vizuálním dojmem a popularitou obsahu, místo aby ověřoval zdroj nebo fakta.'
where id = 8;

update public.manipulative_comments set
  comment     = 'Ať mi ještě někdo z těch vládních poskoků zkusí říct, že tohle není pravda. Teď už mlčet nebudou, ovce. 🐑',
  explanation = 'Diskreditace oponenta: Komentující nevysvětluje svůj názor, ale zesměšňuje a uráží ty, kteří by mohli nesouhlasit. Místo argumentů používá nálepky („ovce“ nebo „vládní poskoci“), které mají snížit důvěryhodnost oponentů a umlčet diskuzi.'
where id = 9;

-- Cognitive biases (level 4) --------------------------------------------------
update public.cognitive_biases set
  example = 'Lidé si pamatují stereotyp, podle kterého jsou elity spojeny se zlými úmysly, jako je například touha po bohatství. Pokud by Ivan místo elit psal o zahrádkářích, asi by mu nikdo nevěřil.'
where id = 6;

update public.cognitive_biases set
  example = 'I když sledující později zjistili, že jde o dezinformaci, zůstal jim pocit: „Něco o misi na Marsu jsem někde slyšel…“'
where id = 8;

-- End quiz (level 5) ----------------------------------------------------------
update public.quiz_questions set
  answers = '[{"answer":"Pravdivá informace podaná zábavnou formou","correct":false},{"answer":"Neověřený názor zveřejněný na internetu","correct":false},{"answer":"Úmyslně šířená nepravdivá nebo zavádějící informace","correct":true}]'::jsonb
where id = 22;

update public.quiz_questions set
  question = 'Tvrzení „Přistání na Marsu nemá vědecký účel, jde o spiknutí elit, které se tam chystají žít“ odpovídá nejvíce:'
where id = 23;

update public.quiz_questions set
  question = 'Jaká může být jedna z hlavních motivací pro šíření dezinformací?',
  answers  = '[{"answer":"Pomoci lidem lépe se orientovat ve vědě","correct":false},{"answer":"Vyvolat strach, ovlivnit názory nebo získat pozornost či peníze","correct":true},{"answer":"Podpořit kvalitní novinářskou práci","correct":false}]'::jsonb
where id = 24;

update public.quiz_questions set
  question = 'Když někdo používá silné výrazy jako „vláda nás zradila“ nebo „pravda, kterou vám neřeknou“, jde pravděpodobně o:',
  answers  = '[{"answer":"manipulaci jazykem","correct":true},{"answer":"objektivní reportáž","correct":false},{"answer":"vědeckou analýzu","correct":false}]'::jsonb
where id = 25;

update public.quiz_questions set
  answers = '[{"answer":"Zeptám se autora, odkud ho má","correct":false},{"answer":"Prohlédnu si komentáře, jestli už zdroj někdo nezmínil","correct":false},{"answer":"Použiju zpětné vyhledávání obrázků (např. Google Lens)","correct":true}]'::jsonb
where id = 26;

-- The bug that matters most: no answer was marked correct.
update public.quiz_questions set
  question = 'Jaký je příklad konfirmačního zkreslení?',
  answers  = '[{"answer":"Podvědomě vyhledávám informace, které podporují mé přesvědčení","correct":true},{"answer":"Nechápu text, takže ho ignoruju","correct":false},{"answer":"Klikám jen na články s titulky, které mě nezajímají","correct":false}]'::jsonb
where id = 27;

-- Google Lens accepted answers (level 3) --------------------------------------
-- No explicit ids, so answers added through the admin since the import can't collide.
insert into public.lens_accepted_answers (photo_id, answer)
select v.photo_id, v.answer
from (values
  (1, 'Jordansko'),
  (1, 'Jordan'),
  (1, 'Wadi Rum Jordánsko'),
  (1, 'Wadi Rum, Jordansko'),
  (1, 'Wadi Rum Jordansko'),
  (1, 'poušť Wadi Rum'),
  (1, 'jordánská poušť'),
  (1, 'pust'),
  (2, 'film'),
  (2, 'film Marťan'),
  (2, 'film Martan'),
  (2, 'z filmu Marťan'),
  (2, 'Marťan film'),
  (2, 'Marťan (film, 2015)'),
  (2, 'Marťan 2015'),
  (2, 'film The Martian'),
  (2, 'The Martian (2015)'),
  (2, 'The Martian movie')
) as v(photo_id, answer)
where exists (select 1 from public.lens_photos p where p.id = v.photo_id)
  and not exists (
    select 1 from public.lens_accepted_answers a
    where a.photo_id = v.photo_id and lower(trim(a.answer)) = lower(trim(v.answer))
  );

-- Sanity check: every end-quiz question must have exactly one correct answer.
do $$
declare bad int;
begin
  select count(*) into bad
  from public.quiz_questions q
  where q.category_id = 11
    and (select count(*) from jsonb_array_elements(q.answers) e where (e->>'correct')::boolean) <> 1;
  if bad > 0 then
    raise exception '% quiz question(s) do not have exactly one correct answer', bad;
  end if;
end $$;

commit;
