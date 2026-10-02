import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const MONTHLY_DATA_DIR = path.join(process.cwd(), "public", "data", "monthly");
const MONTHLY_IMAGE_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "monthly",
);

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const EDITION_META = {
  "2026-09": {
    headline: "Lizzie Borden Takes September",
    subhead:
      "A Netflix season put a woman acquitted in 1893 at the top of the chart, and true crime took the next three places with her. Zverev and Rybakina won in New York, Gloria Steinem died at 92, and August's obituaries gave back almost everything they had gained.",
    editorial: {
      intro:
        'September belonged to a woman acquitted in 1893. <a href="/profile/person/Lizzie_Borden">Lizzie Borden</a> added more than thirteen million views &mdash; a nearly fifteenfold jump to just over fourteen million, by far the month\'s largest gain &mdash; after <em>Monster: The Lizzie Borden Story</em>, the fourth season of Netflix\'s true-crime anthology and the first built around a woman and around someone never convicted, premiered on September 17. The season pulled its whole call sheet onto the chart: <a href="/profile/person/Vicky_Krieps">Vicky Krieps</a>, who plays the Bordens\' maid Bridget Sullivan, rose fifteenfold, alongside <a href="/profile/person/Charlie_Hunnam">Charlie Hunnam</a> and <a href="/profile/person/Rebecca_Hall">Rebecca Hall</a> as the murdered Andrew and Abby Borden and <a href="/profile/person/Jessica_Barden">Jessica Barden</a> as the actress Nance O\'Neil. Its detours did the same work. <a href="/profile/person/Sarah_Paulson">Sarah Paulson</a> appears as <a href="/profile/person/Aileen_Wuornos">Aileen Wuornos</a>, who climbed almost tenfold to become the month\'s fourth-biggest riser; Krieps doubles as <a href="/profile/person/Elizabeth_Báthory">Elizabeth Báthory</a>, up nearly sevenfold; and <a href="/profile/person/Ed_Gein">Ed Gein</a>, the subject of last year\'s season, rose again. Even the lead\'s parents moved: Ella Beatty, who plays Lizzie, is the daughter of <a href="/profile/person/Warren_Beatty">Warren Beatty</a> and <a href="/profile/person/Annette_Bening">Annette Bening</a>, and both gained. True crime filled the rest of the podium. <a href="/profile/person/Elizabeth_Holmes">Elizabeth Holmes</a> rose twenty-one-fold after <em>You Can See Everything</em>, an A24 documentary by <a href="/profile/person/Nathan_Fielder">Nathan Fielder</a> and Lance Oppenheim filmed in the weeks before she reported to prison, premiered as a surprise screening at Telluride on September 6 &mdash; Fielder himself rose twentyfold &mdash; and again when the Bureau of Prisons disclosed on September 22 that she had been approved for transfer to a Texas halfway house next August. <a href="/profile/person/Ted_Kaczynski">Ted Kaczynski</a> gained more than sixfold on the September 25 release of Netflix\'s <em>Unabomber</em>, starring Russell Crowe, which also lifted cast member <a href="/profile/person/Shailene_Woodley">Shailene Woodley</a>.',
      middle:
        'Sport\'s contribution came from Flushing Meadows. <a href="/profile/person/Elena_Rybakina">Elena Rybakina</a> beat defending champion <a href="/profile/person/Aryna_Sabalenka">Aryna Sabalenka</a> 6&ndash;4, 5&ndash;7, 6&ndash;2 for her first US Open title and her second major of the year, and <a href="/profile/person/Alexander_Zverev">Alexander Zverev</a> beat <a href="/profile/person/Ben_Shelton">Ben Shelton</a> in four sets to become the first German man to win in New York since Boris Becker in 1989, adding it to the French Open he won in June. Shelton\'s run to a first Grand Slam final &mdash; through a fifth-set tiebreak against <a href="/profile/person/Carlos_Alcaraz">Carlos Alcaraz</a> that ended at 3:33 a.m. and an all-American semi-final against <a href="/profile/person/Frances_Tiafoe">Frances Tiafoe</a> &mdash; carried his father and coach <a href="/profile/person/Bryan_Shelton">Bryan Shelton</a> up twenty-two-fold, with <a href="/profile/person/Karen_Khachanov">Karen Khachanov</a>, <a href="/profile/person/Emma_Navarro">Emma Navarro</a>, <a href="/profile/person/Coco_Gauff">Coco Gauff</a>, and <a href="/profile/person/Iva_Jovic">Iva Jovic</a> rising behind them. Elsewhere, <a href="/profile/person/Katie_Taylor">Katie Taylor</a> became undisputed champion again in front of 83,000 at Croke Park on September 5, <a href="/profile/person/Brandon_McNulty">Brandon McNulty</a> won the world road race title in Montreal as the first American to do so since 1993, <a href="/profile/person/Kimi_Antonelli">Kimi Antonelli</a> won his home Grand Prix, and <a href="/profile/person/Justin_Verlander">Justin Verlander</a> pitched the last game of a 21-season career on September 26, taking <a href="/profile/person/Kate_Upton">Kate Upton</a> up with him. The month\'s loudest argument started at MetLife Stadium, where <a href="/profile/person/Macklemore">Macklemore</a> used his opening set on <a href="/profile/person/Ed_Sheeran">Ed Sheeran</a>\'s Loop Tour to declare "Free Palestine" and was dropped from the tour on September 14; he rose twenty-two-fold, and <a href="/profile/person/Robert_Kraft">Robert Kraft</a>, who led the push to remove him, nearly twenty-nine-fold, with <a href="/profile/person/Pink_(singer)">Pink</a> drawn in after siding against him. The second season of <em>The Gentlemen</em> on September 3 lifted <a href="/profile/person/Theo_James">Theo James</a>, <a href="/profile/person/Kaya_Scodelario">Kaya Scodelario</a>, <a href="/profile/person/Vinnie_Jones">Vinnie Jones</a>, and <a href="/profile/person/Guy_Ritchie">Guy Ritchie</a>; <em>Resident Evil</em> on September 18 lifted director <a href="/profile/person/Zach_Cregger">Zach Cregger</a> and lead <a href="/profile/person/Austin_Abrams">Austin Abrams</a>; and the Emmys on September 14 lifted three-time winner <a href="/profile/person/Matthew_Rhys">Matthew Rhys</a>, <a href="/profile/person/Tom_Pelphrey">Tom Pelphrey</a>, and <a href="/profile/person/Michael_J._Fox">Michael J. Fox</a>. <a href="/profile/person/Celine_Dion">Celine Dion</a> returned to the stage in Paris on September 12, her first run of concerts since her stiff-person syndrome diagnosis. <a href="/profile/person/John_Ternus">John Ternus</a> took over from Tim Cook as Apple\'s chief executive on September 1; <a href="/profile/person/Alice_Weidel">Alice Weidel</a> rose sevenfold as the AfD took 43.8 percent in Saxony-Anhalt on September 6, its best state result ever; <a href="/profile/person/Hashim_Thaçi">Hashim Thaçi</a> was convicted of war crimes and sentenced to 25 years on September 16; and <a href="/profile/person/Maria_Bartiromo">Maria Bartiromo</a> was dismissed by Fox on September 3. The 25th anniversary of the September 11 attacks returned <a href="/profile/person/Osama_bin_Laden">Osama bin Laden</a>, <a href="/profile/person/Mohamed_Atta">Mohamed Atta</a>, <a href="/profile/person/Ziad_Jarrah">Ziad Jarrah</a>, <a href="/profile/person/Marwan_al-Shehhi">Marwan al-Shehhi</a>, and <a href="/profile/person/Khalid_Sheikh_Mohammed">Khalid Sheikh Mohammed</a> to the chart together, a day after the first anniversary of <a href="/profile/person/Charlie_Kirk">Charlie Kirk</a>\'s assassination.',
      conclusion:
        'The obituary column was shorter than August\'s but not short. <a href="/profile/person/Gloria_Steinem">Gloria Steinem</a> died at her Manhattan home on September 2 at 92 and rose thirty-four-fold. The wrestler Pac &mdash; <a href="/profile/person/Neville_(wrestler)">Neville</a> in his WWE years &mdash; was found dead in Des Plaines, Illinois, on September 27 at 40, the day after wrestling at AEW\'s All Out, and rose more than eightyfold. <a href="/profile/person/Emma_Bonino">Emma Bonino</a>, the Italian Radical and former foreign minister, died on September 11 at 78; the same day Norway lost <a href="/profile/person/Princess_Astrid,_Mrs._Ferner">Princess Astrid</a> at 94, two days after she attended the state funeral of her brother <a href="/profile/person/Harald_V">Harald V</a>. The month also took <a href="/profile/person/Marina_Vlady">Marina Vlady</a> at 88, Inter great <a href="/profile/person/Sandro_Mazzola">Sandro Mazzola</a> at 83, Chinese singer <a href="/profile/person/Liu_Huan">Liu Huan</a> at 63, jazz singer <a href="/profile/person/Cassandra_Wilson">Cassandra Wilson</a>, director <a href="/profile/person/Jean-Paul_Rappeneau">Jean-Paul Rappeneau</a>, and <em>Man About the House</em> star <a href="/profile/person/Richard_O\'Sullivan">Richard O\'Sullivan</a>; <a href="/profile/person/Cindy_Crawford">Cindy Crawford</a> quadrupled after the death of her son Presley Gerber on September 20 at 27. The decline column, as ever, is last month\'s front page. <a href="/profile/person/Hayden_Panettiere">Hayden Panettiere</a> gave back nineteen million of the twenty million views she had gained and <a href="/profile/person/Dolly_Parton">Dolly Parton</a> fourteen million, with <a href="/profile/person/Tim_Curry">Tim Curry</a> and the Cambridge sociologist <a href="/profile/person/Jason_Arday">Jason Arday</a>, found dead on August 14 days after resigning over misconduct allegations, completing the top four &mdash; and Panettiere\'s orbit of <a href="/profile/person/Jansen_Panettiere">Jansen Panettiere</a>, <a href="/profile/person/Wladimir_Klitschko">Wladimir Klitschko</a>, and <a href="/profile/person/Michelle_Trachtenberg">Michelle Trachtenberg</a> receding with her. The Norwegian royals eased back after the funeral, <a href="/profile/person/Tom_Holland_(actor)">Tom Holland</a>, <a href="/profile/person/Zendaya">Zendaya</a>, <a href="/profile/person/Sadie_Sink">Sadie Sink</a>, and <a href="/profile/person/Jon_Bernthal">Jon Bernthal</a> cooled as <em>Spider-Man: Brand New Day</em> left its opening weeks behind, <a href="/profile/person/Christopher_Nolan">Christopher Nolan</a> and <a href="/profile/person/Matt_Damon">Matt Damon</a> kept sliding with <em>The Odyssey</em>, and <a href="/profile/person/Charles_Manson">Charles Manson</a> fell as the true-crime audience moved on to Fall River. One footnote: a cluster of very small pages &mdash; <a href="/profile/person/Angélica_André">Angélica André</a>, <a href="/profile/person/Albert_Kluyver">Albert Kluyver</a>, <a href="/profile/person/Li_Yunqi">Li Yunqi</a> &mdash; multiplied several hundred times over from bases of a few hundred views, and we could find no news event behind any of them.',
    },
    moverSummaries: {
      "rising:Lizzie_Borden":
        "Lizzie Borden was September's biggest mover, rising nearly fifteenfold to more than fourteen million views after Netflix released Monster: The Lizzie Borden Story on September 17.",
      "rising:Elizabeth_Holmes":
        "Elizabeth Holmes rose twenty-one-fold after an A24 documentary about her last weeks before prison premiered at Telluride on September 6, and again when her 2027 halfway-house transfer was disclosed.",
      "rising:Ted_Kaczynski":
        "Ted Kaczynski gained more than sixfold after Netflix released Unabomber, a drama starring Russell Crowe, on September 25.",
      "falling:Hayden_Panettiere":
        "Hayden Panettiere was September's steepest faller, giving back nineteen million of the twenty million views that followed her death at 36 on August 16.",
      "falling:Dolly_Parton":
        "Dolly Parton fell by nearly fourteen million views as the surge that followed her death in Nashville on August 25 subsided.",
      "falling:Tim_Curry":
        "Tim Curry dropped by about six and a half million views, returning toward baseline a month after his death at 80 on August 25.",
    },
  },
  "2026-08": {
    headline: "Dolly, Hayden, and the King of Norway",
    subhead:
      "August read almost entirely as an obituary page. Hayden Panettiere's sudden death at 36 produced the largest single-month rise anywhere in this dataset, followed over the next twelve days by Dolly Parton, Tim Curry, and King Harald V — while every World Cup name from July collapsed at once.",
    editorial: {
      intro:
        'August was the heaviest month of loss the monthly dataset has recorded. <a href="/profile/person/Hayden_Panettiere">Hayden Panettiere</a> added more than twenty million views &mdash; the largest one-month gain of any name across the six editions published so far &mdash; after the <em>Heroes</em> and <em>Nashville</em> actress was found in cardiac arrest at a residence in Greenville, South Carolina, on August 16 and pronounced dead at 36. The surge pulled her whole orbit onto the chart with her: her late brother <a href="/profile/person/Jansen_Panettiere">Jansen Panettiere</a>, who died in 2023, rose sixtyfold; her former partner <a href="/profile/person/Wladimir_Klitschko">Wladimir Klitschko</a>, with whom she shared a daughter, was the month\'s fourth-biggest mover; and <a href="/profile/person/Michelle_Trachtenberg">Michelle Trachtenberg</a>, her co-star in Disney\'s <em>Ice Princess</em>, climbed again eighteen months after her own death at 39. Nine days later the chart absorbed two more: <a href="/profile/person/Dolly_Parton">Dolly Parton</a> died in Nashville on August 25 at 80 after a brief battle with cancer, adding nearly sixteen million views and lifting her longtime duet partner <a href="/profile/person/Porter_Wagoner">Porter Wagoner</a> thirtyfold in the process, and <a href="/profile/person/Tim_Curry">Tim Curry</a> died at his Toluca Lake home the same day at 80, more than a decade after the stroke that had slowed the career built on <em>The Rocky Horror Picture Show</em>, <em>Clue</em>, and <em>It</em>.',
      middle:
        'The roll kept going. <a href="/profile/person/Harald_V">Harald V</a> died at Oslo University Hospital on August 28 at 89, ending a 35-year reign and Europe\'s oldest living monarchy, and the accession lit up the entire Norwegian royal line at once &mdash; <a href="/profile/person/Haakon,_Crown_Prince_of_Norway">Haakon</a>, now Haakon VIII, alongside <a href="/profile/person/Queen_Sonja_of_Norway">Queen Sonja</a>, <a href="/profile/person/Mette-Marit,_Crown_Princess_of_Norway">Mette-Marit</a>, and Harald\'s father <a href="/profile/person/Olav_V_of_Norway">Olav V</a>, dead since 1991. Japan lost <a href="/profile/person/Yayoi_Kusama">Yayoi Kusama</a>, the polka-dot painter of the Infinity Mirror Rooms, at 97; China lost reformist premier <a href="/profile/person/Zhu_Rongji">Zhu Rongji</a>, also 97, on August 12; and mountaineering lost <a href="/profile/person/Nirmal_Purja">Nirmal Purja</a>, whose death in a Broad Peak avalanche that killed ten was confirmed on August 1. <a href="/profile/person/Peter_Cullen">Peter Cullen</a>, the voice of Optimus Prime, died on August 26 at 85; <em>Sopranos</em> actor <a href="/profile/person/Vincent_Pastore">Vincent Pastore</a> on August 1 at 80; <a href="/profile/person/Shelley_Fabares">Shelley Fabares</a> on August 22 at 82; ZZ Top drummer <a href="/profile/person/Frank_Beard_(musician)">Frank Beard</a> on August 17 at 77; Italian cantautore <a href="/profile/person/Francesco_Guccini">Francesco Guccini</a> on August 6; and <a href="/profile/person/Ratko_Mladić">Ratko Mladić</a>, the Srebrenica commander, in his cell at The Hague on August 27 at 84. Away from the obituaries, <a href="/profile/person/Tom_Holland_(actor)">Tom Holland</a> and <a href="/profile/person/Sadie_Sink">Sadie Sink</a> rose on <em>Spider-Man: Brand New Day</em>, which opened July 31 to a record $360 million domestic weekend and passed a billion dollars in six days, carrying <a href="/profile/person/Zendaya">Zendaya</a> and <a href="/profile/person/Florence_Pugh">Florence Pugh</a> up with them. <a href="/profile/person/Perez_Hilton">Perez Hilton</a> spiked seventyfold after a livestreamed mental-health crisis left him hospitalized in Miami, <a href="/profile/person/Enes_Kanter">Enes Kanter Freedom</a> after his August 23 ejection and subsequent ban from Chicago Sky home games, and a wave of true-crime programming lifted <a href="/profile/person/Charles_Manson">Charles Manson</a>, <a href="/profile/person/Lizzie_Borden">Lizzie Borden</a>, and <a href="/profile/person/Chris_Hansen">Chris Hansen</a> together. A tail of European track and field names &mdash; <a href="/profile/person/Amanal_Petros">Amanal Petros</a>, <a href="/profile/person/Niklas_Kaul">Niklas Kaul</a>, <a href="/profile/person/Jazmin_Sawyers">Jazmin Sawyers</a> &mdash; came from Birmingham, which hosted the European Athletics Championships from August 10 to 16, the first British city ever to do so.',
      conclusion:
        'The decline column is the World Cup, deleted. Seventeen of August\'s twenty steepest falls are footballers, and the top five are simply July\'s top five in reverse: <a href="/profile/person/Erling_Haaland">Erling Haaland</a> shed more than fifteen million views, <a href="/profile/person/Lamine_Yamal">Lamine Yamal</a> more than thirteen, and <a href="/profile/person/Lionel_Messi">Lionel Messi</a>, <a href="/profile/person/Kylian_Mbappé">Kylian Mbappé</a>, and <a href="/profile/person/Jude_Bellingham">Jude Bellingham</a> between six and ten million each. <a href="/profile/person/Cristiano_Ronaldo">Cristiano Ronaldo</a>, <a href="/profile/person/Harry_Kane">Harry Kane</a>, <a href="/profile/person/Neymar">Neymar</a>, <a href="/profile/person/Folarin_Balogun">Folarin Balogun</a>, and the managers &mdash; <a href="/profile/person/Thomas_Tuchel">Thomas Tuchel</a>, <a href="/profile/person/Luis_de_la_Fuente_(footballer,_born_1961)">Luis de la Fuente</a>, <a href="/profile/person/Lionel_Scaloni">Lionel Scaloni</a>, <a href="/profile/person/Didier_Deschamps">Didier Deschamps</a> &mdash; all followed the tournament off the chart, as did FIFA president <a href="/profile/person/Gianni_Infantino">Gianni Infantino</a> and halftime headliner <a href="/profile/person/Shakira">Shakira</a>. July\'s farewells cooled on the same schedule: <a href="/profile/person/Lindsey_Graham">Lindsey Graham</a>, <a href="/profile/person/Sam_Neill">Sam Neill</a>, <a href="/profile/person/Bonnie_Tyler">Bonnie Tyler</a>, and <a href="/profile/person/Ann_Widdecombe">Ann Widdecombe</a> each gave back the great majority of what they had gained a month earlier. <a href="/profile/person/Christopher_Nolan">Christopher Nolan</a> halved as <em>The Odyssey</em> settled into its run, <a href="/profile/person/Jannik_Sinner">Jannik Sinner</a> fell back after Wimbledon, and <a href="/profile/person/Andy_Burnham">Andy Burnham</a> receded from his June by-election. Same signature, sixth month running: this month\'s front page is next month\'s steepest fall.',
    },
    moverSummaries: {
      "rising:Hayden_Panettiere":
        "Hayden Panettiere posted the largest one-month rise in the dataset, adding more than twenty million views after the 36-year-old actress was found in cardiac arrest in Greenville, South Carolina, on August 16.",
      "rising:Dolly_Parton":
        "Dolly Parton surged more than fiftyfold after dying in Nashville on August 25 at 80, following a brief battle with cancer — a loss that drew tributes worldwide.",
      "rising:Tim_Curry":
        "Tim Curry climbed nearly thirty-five-fold after his death at 80 on August 25, sending audiences back to The Rocky Horror Picture Show, Clue, and It.",
      "falling:Erling_Haaland":
        "Erling Haaland was August's steepest faller, giving back more than fifteen million views as the World Cup traffic that had made him July's biggest riser vanished almost entirely.",
      "falling:Lamine_Yamal":
        "Lamine Yamal shed more than thirteen million views, the sharpest correction of Spain's title run as the tournament left the news cycle.",
      "falling:Lionel_Messi":
        "Lionel Messi fell by more than ten million views after Argentina's extra-time defeat in the final closed out his record sixth World Cup.",
    },
  },
  "2026-07": {
    headline: "A Cup, an Odyssey, and a Brutal Week",
    subhead:
      "Spain beat Argentina in extra time to win the World Cup, and Erling Haaland topped the month for a Norway side that reached its first-ever quarter-final. But July's other signature was a single week in early July that took Bonnie Tyler, Ann Widdecombe, Lindsey Graham, and Sam Neill.",
    editorial: {
      intro:
        'July closed the tournament that had opened June, and closed it loudly. <a href="/profile/person/Erling_Haaland">Erling Haaland</a> was the single biggest mover of the month, tripling to more than sixteen million views as Norway went further than it ever had: his winner against Côte d\'Ivoire in the round of 32 and a late brace against Brazil in the last 16 carried the Norwegians to a first World Cup quarter-final, where England ended the run in Miami on July 11. Barely behind him, <a href="/profile/person/Lamine_Yamal">Lamine Yamal</a> finished the job &mdash; Spain beat Argentina 1&ndash;0 after extra time at MetLife Stadium on July 19, <a href="/profile/person/Ferran_Torres">Ferran Torres</a> striking in the 106th minute for a second world title, and 65-year-old <a href="/profile/person/Luis_de_la_Fuente_(footballer,_born_1961)">Luis de la Fuente</a> becoming the oldest manager ever to win it. <a href="/profile/person/Jude_Bellingham">Jude Bellingham</a> was the third-biggest riser as England reached the semi-finals, and <a href="/profile/person/Kylian_Mbappé">Kylian Mbappé</a> took the Golden Boot with ten goals, one place ahead of <a href="/profile/person/Lionel_Messi">Lionel Messi</a>, whose record sixth World Cup ended in the final.',
      middle:
        'Around the podium, the whole Spanish and Argentine sides climbed together &mdash; <a href="/profile/person/Rodri_(footballer,_born_1996)">Rodri</a>, <a href="/profile/person/Marc_Cucurella">Marc Cucurella</a>, <a href="/profile/person/Pau_Cubarsí">Pau Cubarsí</a>, <a href="/profile/person/Mikel_Oyarzabal">Mikel Oyarzabal</a>, and <a href="/profile/person/Aymeric_Laporte">Aymeric Laporte</a> for Spain; <a href="/profile/person/Leandro_Paredes">Leandro Paredes</a>, <a href="/profile/person/Enzo_Fernández">Enzo Fernández</a>, and manager <a href="/profile/person/Lionel_Scaloni">Lionel Scaloni</a> for Argentina, with <a href="/profile/person/Diego_Maradona">Diego Maradona</a> pulled back into view a sixth year after his death. FIFA president <a href="/profile/person/Gianni_Infantino">Gianni Infantino</a> was the seventh-biggest mover, and <a href="/profile/person/Shakira">Shakira</a> rose after headlining the first halftime show ever staged at a World Cup final, performing the tournament anthem alongside Madonna, BTS, and Burna Boy. Cinema supplied the month\'s other engine: <a href="/profile/person/Christopher_Nolan">Christopher Nolan</a> climbed eightfold on the July 17 release of <em>The Odyssey</em>, shot entirely on IMAX 70mm, and lifted his cast with him &mdash; <a href="/profile/person/Matt_Damon">Matt Damon</a> as Odysseus, <a href="/profile/person/Tom_Holland_(actor)">Tom Holland</a> as Telemachus, plus <a href="/profile/person/Zendaya">Zendaya</a>, <a href="/profile/person/Elliot_Page">Elliot Page</a>, <a href="/profile/person/Lupita_Nyong\'o">Lupita Nyong\'o</a>, <a href="/profile/person/Samantha_Morton">Samantha Morton</a>, and <a href="/profile/person/Benny_Safdie">Benny Safdie</a>. <a href="/profile/person/Homer">Homer</a> himself gained eightfold. Elsewhere in sport, <a href="/profile/person/Jannik_Sinner">Jannik Sinner</a> defended his Wimbledon title on July 12 against <a href="/profile/person/Alexander_Zverev">Alexander Zverev</a>, and <a href="/profile/person/Tadej_Pogačar">Tadej Pogačar</a> won a record-equalling fifth Tour de France on July 26.',
      conclusion:
        'The month\'s other story was a run of losses compressed into six days. <a href="/profile/person/Bonnie_Tyler">Bonnie Tyler</a> died in a Portuguese hospital on July 8 at 75, weeks after emerging from a medically induced coma; the same day, former Conservative MP <a href="/profile/person/Ann_Widdecombe">Ann Widdecombe</a> was killed at her Devon home at 78, her body found the following morning, a case referred to counterterrorism police that lifted her a hundred and ninety times over. Senator <a href="/profile/person/Lindsey_Graham">Lindsey Graham</a> died of an aortic dissection on July 11 at 71 &mdash; the fourth-biggest mover of the month &mdash; and the vacancy pulled in <a href="/profile/person/Mitch_McConnell">Mitch McConnell</a>, himself on medical leave after a June fall. <a href="/profile/person/Sam_Neill">Sam Neill</a>, the <em>Jurassic Park</em> paleontologist, died in Sydney on July 13 at 78, months after announcing he was cancer-free. Later in the month came Japanese mystery novelist <a href="/profile/person/Keigo_Higashino">Keigo Higashino</a> at 68, Oscar-winning Irish musician <a href="/profile/person/Glen_Hansard">Glen Hansard</a> in a Dublin motorcycle crash at 56, and AC Milan captain <a href="/profile/person/Franco_Baresi">Franco Baresi</a> at 66. The fallers, meanwhile, were June\'s front page in retreat: <a href="/profile/person/Oliver_Tree">Oliver Tree</a>, last month\'s biggest riser, was July\'s steepest fall, and June\'s group-stage breakouts &mdash; <a href="/profile/person/Zion_Suzuki">Zion Suzuki</a>, <a href="/profile/person/Deniz_Undav">Deniz Undav</a>, <a href="/profile/person/Luca_Zidane">Luca Zidane</a> &mdash; dropped away as the knockout rounds narrowed the field. The NBA Finals cooled too, taking <a href="/profile/person/Jalen_Brunson">Jalen Brunson</a> and <a href="/profile/person/Victor_Wembanyama">Victor Wembanyama</a> with it, and June\'s farewells &mdash; <a href="/profile/person/Daveigh_Chase">Daveigh Chase</a>, <a href="/profile/person/Anthony_Head">Anthony Head</a>, <a href="/profile/person/Marjane_Satrapi">Marjane Satrapi</a> &mdash; eased back toward baseline.',
    },
    moverSummaries: {
      "rising:Erling_Haaland":
        "Erling Haaland was July's biggest mover, tripling to over sixteen million views as Norway reached its first World Cup quarter-final before falling to England in Miami.",
      "rising:Lamine_Yamal":
        "Lamine Yamal added nearly eleven million views as Spain beat Argentina 1–0 after extra time on July 19 to win a second World Cup.",
      "rising:Jude_Bellingham":
        "Jude Bellingham rose more than sixfold as England went to the semi-finals, finishing among the tournament's leading scorers.",
      "falling:Oliver_Tree":
        "Oliver Tree was July's steepest faller, shedding six and a half million views as the obituary traffic from his June 14 death receded.",
      "falling:Zion_Suzuki":
        "Zion Suzuki fell back sharply once Japan's World Cup ended, giving up almost all of the group-stage attention that had made him June's third-biggest riser.",
      "falling:Jalen_Brunson":
        "Jalen Brunson dropped as the NBA Finals moved out of the news cycle, following his June title run with the Knicks back toward baseline.",
    },
  },
  "2026-06": {
    headline: "The Month Football Swallowed the Chart",
    subhead:
      "Football swept June's chart as the 48-team World Cup kicked off across North America, pulling Messi, Ronaldo, Mbappé, Haaland, and a new generation of breakout names to the top. But the month's single largest surge came from outside the tournament, after the sudden death of Oliver Tree in Rio de Janeiro.",
    editorial: {
      intro:
        'June belonged to football. The 48-team FIFA World Cup opened across the United States, Canada, and Mexico on June 11, and the tournament reshaped the top of the chart almost single-handedly: eight of the month\'s ten biggest risers were footballers. <a href="/profile/person/Lionel_Messi">Lionel Messi</a>, turning 39 during a record sixth World Cup, surged again as he stretched his run of scoring form and pushed deeper into the tournament\'s record books, while <a href="/profile/person/Cristiano_Ronaldo">Cristiano Ronaldo</a>, <a href="/profile/person/Kylian_Mbappé">Kylian Mbappé</a>, and Spain\'s teenage star <a href="/profile/person/Lamine_Yamal">Lamine Yamal</a> climbed in lockstep. Norway\'s <a href="/profile/person/Erling_Haaland">Erling Haaland</a> was one of the month\'s breakout stories, dragging his country to its first World Cup since 1998 and then scoring the winner in Norway\'s first-ever World Cup knockout victory. The single largest mover, though, was not a footballer at all: American musician <a href="/profile/person/Oliver_Tree">Oliver Tree</a> added more than seven million views to top the month outright after his death in a Rio de Janeiro helicopter collision on June 14, at just 32.',
      middle:
        'The tournament\'s pull ran deep into the field. Japan goalkeeper <a href="/profile/person/Zion_Suzuki">Zion Suzuki</a> was the third-biggest mover of the month, and the group stage lifted an unlikely supporting cast: host-nation forwards <a href="/profile/person/Folarin_Balogun">Folarin Balogun</a> of the United States and <a href="/profile/person/Julián_Quiñones">Julián Quiñones</a> of Mexico, Germany\'s <a href="/profile/person/Deniz_Undav">Deniz Undav</a>, France\'s <a href="/profile/person/Michael_Olise">Michael Olise</a>, and <a href="/profile/person/Luca_Zidane">Luca Zidane</a> &mdash; <a href="/profile/person/Zinedine_Zidane">Zinedine Zidane</a>\'s son, keeping goal for Algeria. Even FIFA president <a href="/profile/person/Gianni_Infantino">Gianni Infantino</a> and retired Swedish icon <a href="/profile/person/Zlatan_Ibrahimović">Zlatan Ibrahimović</a> rode the broader World Cup media wave. Away from football, June delivered two more championship climaxes: <a href="/profile/person/Alexander_Zverev">Alexander Zverev</a> won the French Open on June 7 for his first Grand Slam title, and <a href="/profile/person/Jalen_Brunson">Jalen Brunson</a> carried the New York Knicks to their first NBA title since 1973, taking Finals MVP as a series that began in May finished in June. Off the field, Britain\'s <a href="/profile/person/Andy_Burnham">Andy Burnham</a> surged after winning the June 18 Makerfield by-election and emerging as the likely successor to Keir Starmer. And June carried its own roll of farewells beyond Oliver Tree: <em>The Ring</em> and <em>Lilo &amp; Stitch</em> actress <a href="/profile/person/Daveigh_Chase">Daveigh Chase</a> died on June 16 at 35, <em>Buffy</em> and <em>Ted Lasso</em> actor <a href="/profile/person/Anthony_Head">Anthony Head</a> on June 1, and <em>Persepolis</em> author <a href="/profile/person/Marjane_Satrapi">Marjane Satrapi</a> on June 4.',
      conclusion:
        'The decline column was, once again, last month\'s front page in retreat. May\'s single biggest riser, Indian superstar <a href="/profile/person/Vijay_(actor)">Vijay</a>, became June\'s steepest faller, shedding more than four million views. May\'s heavy cluster of deaths eased back toward baseline almost in unison &mdash; NASCAR\'s <a href="/profile/person/Kyle_Busch">Kyle Busch</a>, racer <a href="/profile/person/Alex_Zanardi">Alex Zanardi</a>, CNN founder <a href="/profile/person/Ted_Turner">Ted Turner</a>, and basketball\'s <a href="/profile/person/Brandon_Clarke">Brandon Clarke</a> all falling sharply as their memorial surges passed. <a href="/profile/person/David_Attenborough">David Attenborough</a> receded from his 100th-birthday spike, and the <em>Michael</em> biopic wave that had run since April finally broke, with <a href="/profile/person/Michael_Jackson">Michael Jackson</a>, <a href="/profile/person/Debbie_Rowe">Debbie Rowe</a>, and <a href="/profile/person/Jaafar_Jackson">Jaafar Jackson</a> sliding together. May\'s Champions League touchline cooled as managers <a href="/profile/person/Mikel_Arteta">Mikel Arteta</a> and <a href="/profile/person/Luis_Enrique_(footballer)">Luis Enrique</a> gave way to the international game, while screen names <a href="/profile/person/Gina_Carano">Gina Carano</a>, <a href="/profile/person/Meryl_Streep">Meryl Streep</a>, and <a href="/profile/person/Stanley_Tucci">Stanley Tucci</a> drifted back down. It is one of the dataset\'s most reliable signatures: this month\'s headlines become next month\'s steepest falls.',
    },
    moverSummaries: {
      "rising:Oliver_Tree":
        "Oliver Tree was June's single biggest mover, adding more than seven million views after the 32-year-old musician was killed in a helicopter collision near Rio de Janeiro on June 14.",
      "rising:Lionel_Messi":
        "Lionel Messi surged as the World Cup opened across North America, staying in scoring form at 39 during a record sixth World Cup appearance.",
      "rising:Zion_Suzuki":
        "Zion Suzuki, Japan's goalkeeper, climbed nearly thirtyfold during the World Cup group stage — one of dozens of footballers the tournament pulled onto the chart.",
      "falling:Vijay_(actor)":
        "Vijay was June's steepest faller, shedding more than four million views as May's chart-topping surge around the Indian superstar cooled back toward baseline.",
      "falling:Kyle_Busch":
        "Kyle Busch fell back sharply as the obituary traffic from his May 21 death faded — one of several May farewells receding at once.",
      "falling:David_Attenborough":
        "David Attenborough dropped as the attention around his 100th birthday in May eased, returning him toward baseline.",
    },
  },
  "2026-05": {
    headline: "The Month the World Said Goodbye",
    subhead:
      "A heavy run of farewells—Kyle Busch, Alex Zanardi, Ted Turner, and Brandon Clarke among them—topped May's chart, even as a Champions League climax lifted football's managers and the Michael Jackson revival rolled on",
    editorial: {
      intro:
        'May\'s rankings were shaped, more than anything, by loss. Four of the month\'s ten biggest risers were people the world was mourning &mdash; an unusually heavy concentration of obituary traffic at the very top of the chart. Motorsport lost two of its own within the same weeks: NASCAR champion <a href="/profile/person/Kyle_Busch">Kyle Busch</a> spiked more than a hundredfold after his death on May 21, while Italian racer-turned-Paralympian <a href="/profile/person/Alex_Zanardi">Alex Zanardi</a> surged on May 1. Basketball\'s <a href="/profile/person/Brandon_Clarke">Brandon Clarke</a> posted the single sharpest jump of the month &mdash; a 122x ratio &mdash; after his death on May 11, and media mogul <a href="/profile/person/Ted_Turner">Ted Turner</a>, the founder of CNN, climbed from near-zero to over two million views following his passing on May 6. The single largest mover, though, belonged to the living: Indian superstar <a href="/profile/person/Vijay_(actor)">Vijay</a> added more than four million views to top the month outright.',
      middle:
        'Live sport supplied May\'s other engine. A Champions League climax pulled Europe\'s touchline into the spotlight, lifting managers <a href="/profile/person/Luis_Enrique_(footballer)">Luis Enrique</a>, <a href="/profile/person/Mikel_Arteta">Mikel Arteta</a>, and <a href="/profile/person/Pep_Guardiola">Pep Guardiola</a> in lockstep. Across the Atlantic, an NBA Finals between the Knicks and the Spurs carried two of the league\'s brightest stars upward together &mdash; New York\'s <a href="/profile/person/Jalen_Brunson">Jalen Brunson</a> and San Antonio\'s <a href="/profile/person/Victor_Wembanyama">Victor Wembanyama</a>, the eighth-biggest mover of the month. Culture provided the rest. Pop star <a href="/profile/person/Olivia_Rodrigo">Olivia Rodrigo</a> surged on the release of a new album, while the <em>Michael</em> biopic wave that defined April rolled into May: <a href="/profile/person/Michael_Jackson">Michael Jackson</a> rose again as the third-biggest mover, with the King of Pop\'s former wife <a href="/profile/person/Debbie_Rowe">Debbie Rowe</a> rippling alongside him. British naturalist <a href="/profile/person/David_Attenborough">David Attenborough</a> surged in his ninety-ninth year, and a cluster of screen names &mdash; <a href="/profile/person/Spencer_Pratt">Spencer Pratt</a>, <a href="/profile/person/Sally_Field">Sally Field</a>, and <a href="/profile/person/Gina_Carano">Gina Carano</a> &mdash; rounded out the risers. Jazz lost a giant late in the month as <a href="/profile/person/Sonny_Rollins">Sonny Rollins</a> joined the long roll of May farewells.',
      conclusion:
        'The decline column is, almost line for line, April\'s front page in retreat. Hungary\'s election drama cooled fastest: <a href="/profile/person/Péter_Magyar">Péter Magyar</a>, April\'s giant-killer, was the single biggest faller of May, with the man he unseated, <a href="/profile/person/Viktor_Orbán">Viktor Orbán</a>, close behind. NASA\'s Artemis II crew came back down to earth in the data as well &mdash; <a href="/profile/person/Christina_Koch">Christina Koch</a>, <a href="/profile/person/Reid_Wiseman">Reid Wiseman</a>, and <a href="/profile/person/Jeremy_Hansen">Jeremy Hansen</a> all shed the bulk of their April homecoming traffic. Golf\'s <a href="/profile/person/Rory_McIlroy">Rory McIlroy</a> faded after his back-to-back Masters, and April\'s wave of obituaries &mdash; <a href="/profile/person/Asha_Bhosle">Asha Bhosle</a>, <a href="/profile/person/Nathalie_Baye">Nathalie Baye</a>, <a href="/profile/person/Nadia_Farès">Nadia Farès</a>, and <a href="/profile/person/Mircea_Lucescu">Mircea Lucescu</a> &mdash; eased back toward baseline as their moments passed. It is the monthly dataset\'s clearest signature: this month\'s headlines become next month\'s steepest falls.',
    },
    moverSummaries: {
      "rising:Vijay_(actor)":
        "Vijay was the single biggest mover of May, adding more than four million views as the Indian superstar dominated attention across the month.",
      "rising:Kyle_Busch":
        "Kyle Busch spiked more than a hundredfold following his death on May 21 — the most prominent of a striking cluster of motorsport and athletic losses this month.",
      "rising:Michael_Jackson":
        "Michael Jackson rose again as the Michael biopic wave carried over from April, pulling former wife Debbie Rowe and the wider Jackson story back into view.",
      "falling:Péter_Magyar":
        "Péter Magyar was May's steepest faller, cooling sharply after April's stunning Hungarian election victory moved off the front pages.",
      "falling:Christina_Koch":
        "Christina Koch dropped back toward baseline as the Artemis II crew's April lunar homecoming faded from the news cycle.",
      "falling:Viktor_Orbán":
        "Viktor Orbán fell alongside the broader Hungarian election story, shedding most of the attention his April defeat had generated.",
    },
  },
  "2026-04": {
    headline: "Michael, the Moon, and a Hungarian Upset",
    subhead:
      "A Jackson family revival, a stunning election in Budapest, and the Artemis II crew's return from the Moon defined April's biggest attention swings",
    editorial: {
      intro:
        'April\'s clearest story wasn\'t a single name &mdash; it was a family. The late-April release of <em>Michael</em>, the long-anticipated biopic starring <a href="/profile/person/Jaafar_Jackson">Jaafar Jackson</a> as his late uncle <a href="/profile/person/Michael_Jackson">Michael Jackson</a>, pulled the entire Jackson dynasty back into the spotlight. Attention rippled outward from the King of Pop to <a href="/profile/person/Janet_Jackson">Janet</a>, <a href="/profile/person/Jermaine_Jackson">Jermaine</a>, <a href="/profile/person/Katherine_Jackson">Katherine</a>, <a href="/profile/person/Paris_Jackson">Paris</a>, and <a href="/profile/person/Debbie_Rowe">Debbie Rowe</a> &mdash; a cultural reawakening that turned a single film premiere into a family-wide search wave.',
      middle:
        'The other story of the month came from Budapest. <a href="/profile/person/Péter_Magyar">Péter Magyar</a>\'s Tisza Party unseated <a href="/profile/person/Viktor_Orbán">Viktor Orbán</a>\'s long-ruling Fidesz government in the April 12 election, ending one of Europe\'s most entrenched political dynasties and turning challenger and incumbent alike into global search subjects. Above the planet, NASA\'s Artemis II crew made history of their own: <a href="/profile/person/Christina_Koch">Christina Koch</a>, <a href="/profile/person/Reid_Wiseman">Reid Wiseman</a>, <a href="/profile/person/Jeremy_Hansen">Jeremy Hansen</a>, and <a href="/profile/person/Victor_Glover">Victor Glover</a> all surged in lockstep after returning to Earth on April 10 from the first crewed lunar mission in over fifty years. Sport added its own headlines &mdash; <a href="/profile/person/Rory_McIlroy">Rory McIlroy</a> won back-to-back Masters titles to join a club of just four golfers ever to do so, while Kenyan marathoner <a href="/profile/person/Sabastian_Sawe">Sabastian Sawe</a> went from near-invisible to a household name overnight after running London in 1:59:30, the first sub-two-hour marathon under race conditions.',
      conclusion:
        'April was also a month of farewells. Bollywood great <a href="/profile/person/Asha_Bhosle">Asha Bhosle</a> died at 92, French actresses <a href="/profile/person/Nathalie_Baye">Nathalie Baye</a> and <a href="/profile/person/Nadia_Farès">Nadia Farès</a> passed within days of one another, <a href="/profile/person/Patrick_Muldoon">Patrick Muldoon</a> died unexpectedly, and Romanian football icon <a href="/profile/person/Mircea_Lucescu">Mircea Lucescu</a> was lost at 80 &mdash; each name spiking on Wikipedia as the obituaries hit. Smaller news-cycle bumps included <a href="/profile/person/John_Ternus">John Ternus</a>, named Apple\'s incoming CEO succeeding Tim Cook, and <a href="/profile/person/Meryl_Streep">Meryl Streep</a> amid the press cycle for <em>The Devil Wears Prada 2</em>. The fallers tell the other half of the same story. <a href="/profile/person/Ali_Khamenei">Ali Khamenei</a> dropped from 16.7M views to under a million as the Iran succession story moved off front pages, with <a href="/profile/person/Mojtaba_Khamenei">Mojtaba Khamenei</a> and <a href="/profile/person/Ruhollah_Khomeini">Ruhollah Khomeini</a> fading alongside him. <a href="/profile/person/Chuck_Norris">Chuck Norris</a>, whose attention had spiked after his March 19 death, returned toward baseline as the obituary moment ended.',
    },
    moverSummaries: {
      "rising:Michael_Jackson":
        "Michael Jackson surged after the late-April theatrical release of Michael, the biopic starring his nephew Jaafar — pulling the entire Jackson family back into the cultural conversation.",
      "rising:Péter_Magyar":
        "Péter Magyar climbed as his Tisza Party unseated Viktor Orbán's Fidesz government in Hungary's April 12 election, ending more than a decade of one-party rule.",
      "rising:Jaafar_Jackson":
        "Jaafar Jackson rose into global attention after starring as his uncle Michael in the biopic that premiered in late April.",
      "falling:Ali_Khamenei":
        "Ali Khamenei's March spike around the Iran succession crisis cooled sharply in April as the story moved off front pages.",
      "falling:Chuck_Norris":
        "Chuck Norris fell back toward baseline after his March 19 death drove a one-month obituary surge that didn't carry into April.",
      "falling:Mojtaba_Khamenei":
        "Mojtaba Khamenei dropped alongside his father as speculation around Iran's leadership transition faded from the news cycle.",
    },
  },
  "2026-03": {
    headline: "March's Attention Earthquake",
    subhead:
      "War in the Middle East, award season's close, and the long fade after February's olympics",
    editorial: {
      intro:
        'March 2026 was defined by sharp, event-driven spikes in attention rather than broad, sustained interest. The month\'s biggest risers clustered around Washington politics, Middle East conflict, and a few high-salience cultural moments, with names like <a href="/profile/person/Ali_Khamenei">Ali Khamenei</a>, <a href="/profile/person/Mojtaba_Khamenei">Mojtaba Khamenei</a>, <a href="/profile/person/Benjamin_Netanyahu">Benjamin Netanyahu</a>, <a href="/profile/person/Markwayne_Mullin">Markwayne Mullin</a>, <a href="/profile/person/Chuck_Norris">Chuck Norris</a>, and <a href="/profile/person/Michael_B._Jordan">Michael B. Jordan</a> drawing attention because they became tied to live, unfolding stories.',
      middle:
        'The strongest political surge came from the escalation around Iran and the wider regional conflict, which pushed <a href="/profile/person/Ali_Khamenei">Ali Khamenei</a>, <a href="/profile/person/Mojtaba_Khamenei">Mojtaba Khamenei</a>, <a href="/profile/person/Benjamin_Netanyahu">Benjamin Netanyahu</a>, <a href="/profile/person/Masoud_Pezeshkian">Masoud Pezeshkian</a>, and <a href="/profile/person/Ahmad_Vahidi">Ahmad Vahidi</a> into the center of public attention. In the U.S., <a href="/profile/person/Markwayne_Mullin">Markwayne Mullin</a>, <a href="/profile/person/Pete_Hegseth">Pete Hegseth</a>, <a href="/profile/person/Kristi_Noem">Kristi Noem</a>, <a href="/profile/person/Pam_Bondi">Pam Bondi</a>, and <a href="/profile/person/Robert_Mueller">Robert Mueller</a> also spiked as Washington politics kept generating fresh controversy and confirmation drama. On the cultural side, <a href="/profile/person/Chuck_Norris">Chuck Norris</a> and <a href="/profile/person/Michael_B._Jordan">Michael B. Jordan</a> gained sudden attention, showing how quickly celebrity interest can be pulled upward when names become attached to widely discussed events or appearances.',
      conclusion:
        'The decline side tells the other half of the month\'s story. Several of March\'s biggest fallers were names that had already spiked in February and then eased back, including <a href="/profile/person/Jeffrey_Epstein">Jeffrey Epstein</a>, <a href="/profile/person/Ghislaine_Maxwell">Ghislaine Maxwell</a>, <a href="/profile/person/Virginia_Giuffre">Virginia Giuffre</a>, <a href="/profile/person/Savannah_Guthrie">Savannah Guthrie</a>, <a href="/profile/person/Lindsey_Vonn">Lindsey Vonn</a>, and <a href="/profile/person/James_Van_Der_Beek">James Van Der Beek</a>. The list also shows a clear Winter Olympics-related cooldown, with names such as <a href="/profile/person/Alysa_Liu">Alysa Liu</a>, <a href="/profile/person/Ilia_Malinin">Ilia Malinin</a>, <a href="/profile/person/Eileen_Gu">Eileen Gu</a>, and other winter-sports and awards-cycle figures falling after their earlier February attention. That pattern suggests March was less about one continuous news narrative and more about a series of short, intense bursts followed by rapid normalization.',
    },
    moverSummaries: {
      "rising:Ali_Khamenei":
        "Ali Khamenei surged as the Iran succession crisis and regional escalation pushed him to the center of global attention.",
      "rising:Chuck_Norris":
        "Chuck Norris jumped on a burst of celebrity-driven curiosity, with his name getting pulled into a sharp March visibility spike.",
      "rising:Mojtaba_Khamenei":
        "Mojtaba Khamenei climbed because speculation around Iran's leadership transition made him a central figure in the succession story.",
      "falling:Jeffrey_Epstein":
        "Jeffrey Epstein dropped because February's renewed attention around the files and related scandal had already peaked, then cooled in March.",
      "falling:Alysa_Liu":
        "Alysa Liu fell after the Olympics and awards-cycle attention around figure skating faded, leaving her March visibility much lower.",
      "falling:Bad_Bunny":
        "Bad Bunny declined because his February Super Bowl spike had already passed, and March brought a sharp normalization in attention.",
    },
  },
};

const editionCache = new Map();
let editionKeysPromise;

export async function getEdition(year, month) {
  const monthNum = monthToNum(month);
  if (!monthNum) return null;

  const key = `${year}-${String(monthNum).padStart(2, "0")}`;
  if (!editionCache.has(key)) {
    editionCache.set(key, loadEdition(key));
  }

  return editionCache.get(key);
}

export async function getAllEditionKeys() {
  if (!editionKeysPromise) {
    editionKeysPromise = loadEditionKeys();
  }

  return editionKeysPromise;
}

export async function getEditionHeroImage(key) {
  return resolveHeroImage(key);
}

async function loadEdition(key) {
  const csvPath = path.join(MONTHLY_DATA_DIR, `${key}.csv`);
  const [yearPart, monthPart] = key.split("-");
  const year = Number(yearPart);
  const monthNum = Number(monthPart);

  try {
    const [csvText, archive, heroImage] = await Promise.all([
      fs.readFile(csvPath, "utf8"),
      buildArchive(),
      resolveHeroImage(key),
    ]);

    const rows = parseMonthlyCsv(csvText);
    if (!rows.length) return null;

    const risers = rows
      .filter(row => row.diff > 0)
      .sort((a, b) => b.diff - a.diff || b.anomalyScore - a.anomalyScore);

    const fallers = rows
      .filter(row => row.diff < 0)
      .sort((a, b) => a.diff - b.diff || b.anomalyScore - a.anomalyScore);

    const meta = buildEditionMeta(key, year, monthNum);
    const topRiser = risers[0] || null;

    return {
      year,
      month: MONTH_NAMES[monthNum - 1],
      monthNum,
      headline: meta.headline,
      subhead: meta.subhead,
      heroImage,
      editorial: meta.editorial,
      stats: buildStats(topRiser),
      movers: [
        ...buildMovers(risers.slice(0, 3), "rising", monthNum, meta),
        ...buildMovers(fallers.slice(0, 3), "falling", monthNum, meta),
      ],
      trends: risers,
      fallers,
      deceasedSlugs: rows
        .filter(row => row.deathdate && row.deathdate.startsWith(key))
        .map(row => row.slug),
      archive,
    };
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function loadEditionKeys() {
  try {
    const files = await fs.readdir(MONTHLY_DATA_DIR);
    return files
      .filter(file => /^\d{4}-\d{2}\.csv$/.test(file))
      .map(file => file.replace(/\.csv$/, ""))
      .sort();
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function buildArchive() {
  const keys = await getAllEditionKeys();

  return keys.map(key => {
    const [yearPart, monthPart] = key.split("-");
    const year = Number(yearPart);
    const monthNum = Number(monthPart);

    return {
      year,
      month: MONTH_NAMES[monthNum - 1],
      label: `${formatMonthName(year, monthNum, "short").toUpperCase()} ${year}`,
    };
  });
}

async function resolveHeroImage(key) {
  const extensions = ["jpg", "jpeg", "png"];

  for (const ext of extensions) {
    const filename = `${key}-hero.${ext}`;
    const filepath = path.join(MONTHLY_IMAGE_DIR, filename);

    try {
      await fs.access(filepath);
      return `/images/monthly/${filename}`;
    } catch {
      // Try next extension
    }
  }

  return null;
}

function buildEditionMeta(key, year, monthNum) {
  const monthLabel = formatMonthName(year, monthNum, "long");
  const defaultMeta = {
    headline: `${monthLabel}'s Biggest Attention Swings`,
    subhead: `The Pantheon monthly dataset for ${monthLabel} ${year}, ranked by who rose fastest and who cooled off most.`,
    editorial: {
      intro: `${monthLabel} ${year} captures the sharpest changes in attention across Pantheon's monthly anomaly dataset. The risers below highlight the people who gained the most views versus the prior month, while the fallers show which previously hot names returned toward baseline.`,
      middle:
        "Because the page is built directly from the monthly CSV, the rankings, movers, and death markers now come from the same source of truth instead of a hand-maintained JavaScript payload.",
      conclusion:
        "To publish a future edition, add the next CSV to public/data/monthly using the YYYY-MM.csv format. The page can reuse the same loader and derive the monthly tables automatically.",
    },
    moverSummaries: {},
  };

  return {
    ...defaultMeta,
    ...EDITION_META[key],
    editorial: {
      ...defaultMeta.editorial,
      ...(EDITION_META[key]?.editorial || {}),
    },
    moverSummaries: {
      ...defaultMeta.moverSummaries,
      ...(EDITION_META[key]?.moverSummaries || {}),
    },
  };
}

function buildStats(topRiser) {
  if (!topRiser) {
    return {
      anomalyScore: "0.00x",
      anomalyLabel: "Anomaly Score",
      globalVisibility: "0",
      globalVisibilityLabel: "Global Visibility",
    };
  }

  return {
    anomalyScore: `${topRiser.ratio.toFixed(2)}x`,
    anomalyLabel: "Anomaly Score",
    globalVisibility: formatCompactViews(topRiser.diff),
    globalVisibilityLabel: "Global Visibility",
  };
}

function buildMovers(rows, direction, monthNum, meta) {
  const monthLabel = formatMonthName(2000, monthNum, "long");

  return rows.map((row, index) => ({
    ...row,
    name: row.title,
    direction,
    diffLabel: formatDiffLabel(row.diff, direction),
    score: row.anomalyScore,
    rank: index + 1,
    summary:
      meta?.moverSummaries?.[`${direction}:${row.slug}`] ||
      buildMoverSummary(row, direction, monthLabel),
  }));
}

function buildMoverSummary(row, direction, monthLabel) {
  if (direction === "rising") {
    return `${row.title} climbed from ${formatCompactViews(row.prevViews)} to ${formatCompactViews(row.latestViews)} in ${monthLabel}, adding ${formatCompactViews(row.diff)} in monthly visibility.`;
  }

  return `${row.title} fell from ${formatCompactViews(row.prevViews)} to ${formatCompactViews(row.latestViews)} in ${monthLabel}, shedding ${formatCompactViews(Math.abs(row.diff))} after the prior month's spike.`;
}

function formatDiffLabel(diff, direction) {
  const value = formatCompactViews(Math.abs(diff));
  return direction === "rising" ? `${value} Diff` : `${value} Loss`;
}

function formatCompactViews(value) {
  const absValue = Math.abs(value);

  if (absValue >= 1e6) return `${(absValue / 1e6).toFixed(1)}M`;
  if (absValue >= 1e3) return `${(absValue / 1e3).toFixed(0)}K`;
  return String(absValue);
}

function formatMonthName(year, monthNum, format) {
  return new Intl.DateTimeFormat("en-US", {
    month: format,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthNum - 1, 1)));
}

function monthToNum(month) {
  if (typeof month === "number") return month;
  if (/^\d+$/.test(String(month))) return Number(month);

  return MONTH_NAMES.indexOf(String(month).toLowerCase()) + 1;
}

function parseMonthlyCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row = headers.reduce((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});

    return {
      wpId: toNumber(row.wp_id),
      slug: row.slug,
      title: row.title,
      deathdate: row.deathdate || null,
      description: row.description || "",
      prevViews: toNumber(row.prev_views),
      latestViews: toNumber(row.latest_views),
      diff: toNumber(row.diff),
      ratio: toNumber(row.ratio),
      pctChange: toNumber(row.pct_change),
      anomalyScore: toNumber(row.anomaly_score),
    };
  });
}

function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default EDITION_META;
