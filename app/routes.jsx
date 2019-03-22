import React from "react";
import {Route, IndexRoute} from "react-router";

import App from "App";
import Home from "pages/Home";

// profile components
import Profile from "pages/profile/Profile";
import Person from "pages/profile/person/Person";
import PersonScreenshot from "pages/profile/person/PersonScreenshot";
import Place from "pages/profile/place/Place";
import PlaceScreenshot from "pages/profile/place/PlaceScreenshot";
import Occupation from "pages/profile/occupation/Occupation";
import OccupationScreenshot from "pages/profile/occupation/OccupationScreenshot";
import Era from "pages/profile/era/Era";
import EraScreenshot from "pages/profile/era/EraScreenshot";

// about components
import About from "pages/about/About";
import Vision from "pages/about/Vision";
import Methods from "pages/about/Methods";
import Team from "pages/about/Team";
import Publications from "pages/about/Publications";
import DataSources from "pages/about/DataSources";
import Contact from "pages/about/Contact";

// // explore componenets
import Explore from "pages/explore/Explore";
import Viz from "pages/explore/viz/Viz";
import Rankings from "pages/explore/rankings/Rankings";

// data section components
import Data from "pages/data/Data";
import Datasets from "pages/data/Datasets";
import Api from "pages/data/Api";
import Permissions from "pages/data/Permissions";
import Faq from "pages/data/Faq";

// custom 404 page
import NotFound from "components/NotFound";

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default function RouteCreate() {

  function genRandId(path) {
    let candidates;
    if (path.includes("place")) {
      candidates = ["united_states", "london", "new_york_city", "japan", "paris", "italy", "china", "los_angeles", "chicago", "france", "rome", "spain", "tokyo", "iran", "liverpool", "sweden", "united_kingdom", "moscow", "russia", "vienna", "milan", "norway", "germany", "berlin", "egypt", "istanbul", "hungary", "boston", "greece", "san_jose", "madrid", "denmark", "copenhagen", "iraq", "turkey", "saint_petersburg", "philadelphia", "argentina", "stockholm", "korea,_south", "athens", "israel", "osaka", "croatia", "austria", "buenos_aires", "iceland", "barcelona", "australia", "budapest", "bulgaria", "stuttgart", "canada", "poland", "frankfurt_am_main", "czech_republic", "detroit", "washington,_d.c.", "syria", "amsterdam", "brazil", "india", "glasgow", "korea,_north", "brussels", "koln", "portugal", "switzerland", "ethiopia", "florence", "birmingham", "finland", "mongolia", "south_africa", "sao_paulo", "padova", "afghanistan", "seoul", "ireland", "belgium", "prague", "rotterdam", "vietnam", "dublin", "naples", "singapore", "munich", "algeria", "toronto", "saudi_arabia", "rio_de_janeiro", "georgia", "romania", "bologna", "kenya", "peru", "hamburg", "mexico", "new_zealand", "chile", "morocco", "netherlands", "cleveland", "armenia", "uruguay", "sydney", "cyprus", "cameroon", "cuba", "nepal", "indonesia", "libya", "lisbon", "estonia", "ukraine", "bristol", "guinea", "oslo", "sri_lanka", "pakistan", "mozambique", "serbia", "lithuania", "ghana", "luxembourg,_lux", "vanuatu", "lebanon", "monaco", "nigeria", "pittsburgh", "somalia", "haiti", "venezuela", "paraguay", "malta", "belarus", "uganda", "dresden", "mali", "panama,_pan", "dallas", "warsaw", "burundi", "madagascar", "maldives", "marshall_islands", "cote_d'ivoire_(ivory_coast)", "thailand", "jamaica", "kuwait", "papua_new_guinea", "bahrain", "slovakia", "samoa", "laos", "togo", "ecuador", "namibia", "kyrgyzstan", "slovenia", "trinidad_and_tobago", "latvia", "equatorial_guinea", "kazakhstan", "niger", "benin", "guyana", "colombia", "fiji", "sudan", "antigua_and_barbuda", "moldova", "senegal", "liberia", "guinea-bissau", "leeds", "barbados", "tuvalu", "albania", "china,_republic_of_(taiwan)", "philippines", "nicaragua", "azerbaijan", "kiribati", "zimbabwe", "montevideo", "turkmenistan", "qatar", "bolivia", "nauru", "burkina_faso", "bhutan", "united_arab_emirates", "tajikistan", "swaziland", "rwanda", "myanmar_(burma)", "montenegro", "oman", "grenada", "liechtenstein", "guatemala", "mauritania", "bangladesh", "andorra", "yemen", "zambia", "seattle", "honduras", "macedonia", "sao_tome_and_principe", "botswana", "chad", "tunisia", "seychelles", "san_marino", "solomon_islands", "sierra_leone", "south_sudan", "el_salvador", "malawi", "gambia,_the", "cambodia", "saint_kitts_and_nevis", "jordan", "eritrea", "tonga", "cook_islands", "malaysia", "palau", "niue", "ocean", "kosovo", "vatican_city", "belize", "cape_verde", "uzbekistan", "mauritius", "tanzania", "comoros", "angola", "bosnia_and_herzegovina", "dominican_republic", "bahamas,_the", "micronesia", "saint_vincent_and_the_grenadines", "dominica"];
    }
    else if (path.includes("occupation")) {
      candidates = ["architect", "social_activist", "political_leaders", "pilot", "physicist", "biologist", "astronomer", "athlete", "basketball_player", "baseball_player", "chef", "celebrity", "game_designer", "actor", "film_director", "philosopher", "computer_scientist", "snooker", "youtuber"];
    }
    else if (path.includes("person")) {
      // top 250 candidates by hpi
      const topCandidates = ["jesus", "aristotle", "alexander_the_great", "plato", "socrates", "muhammad", "julius_caesar", "leonardo_da_vinci", "abraham", "mary", "confucius", "moses", "pythagoras", "archimedes", "homer", "joseph", "solomon", "napoleon", "tutankhamun", "adolf_hitler", "david", "christopher_columbus", "william_shakespeare", "wolfgang_amadeus_mozart", "gautama_buddha", "galileo_galilei", "ludwig_van_beethoven", "charlemagne", "augustus", "paul_the_apostle", "isaac_newton", "albert_einstein", "john_the_baptist", "michelangelo", "nefertiti", "saint_peter", "suleiman_the_magnificent", "martin_luther", "cleopatra", "avicenna", "attila", "noah", "herodotus", "genghis_khan", "zoroaster", "joan_of_arc", "hannibal", "ramesses_ii", "johann_sebastian_bach", "augustine_of_hippo", "hippocrates", "dante_alighieri", "nicolaus_copernicus", "gilgamesh", "nero", "thales", "cicero", "qin_shi_huang", "heraclitus", "karl_marx", "epicurus", "rene_descartes", "marco_polo", "pablo_picasso", "aesop", "immanuel_kant", "sophocles", "saladin", "louis_xiv_of_france", "sigmund_freud", "spartacus", "saint_nicholas", "constantine_the_great", "ferdinand_magellan", "isaac", "vincent_van_gogh", "caligula", "joseph_stalin", "euclid", "hammurabi", "virgil", "jacob", "jeanjacques_rousseau", "mary_magdalene", "ali", "saint_george", "laozi", "adam", "pericles", "seneca_the_younger", "martin_luther_king,_jr.", "niccolo_machiavelli", "charles_darwin", "diogenes_of_sinope", "elijah", "nikola_tesla", "johann_wolfgang_von_goethe", "krishna", "robin_hood", "steve_jobs", "tina_fey", "vladimir_lenin", "friedrich_nietzsche", "johannes_gutenberg", "akhenaten", "marcus_aurelius", "thomas_edison", "charles_perrault", "job", "thomas_aquinas", "nelson_mandela", "judas_iscariot", "elizabeth_i_of_england", "king_arthur", "francis_of_assisi", "raphael", "vasco_da_gama", "fyodor_dostoyevsky", "voltaire", "marie_curie", "antonio_vivaldi", "mahatma_gandhi", "democritus", "daniel", "muhammad_ibn_musa_alkhwarizmi", "frederic_chopin", "andrew_the_apostle", "rembrandt", "elizabeth_ii", "trajan", "estee_lauder", "blaise_pascal", "ptolemy", "timur", "aeschylus", "joshua", "marie_antoinette", "darius_i", "hans_christian_andersen", "eratosthenes", "ovid", "saint_joseph", "methuselah", "henry_viii_of_england", "justinian_i", "salvador_dali", "aaron", "franz_kafka", "che_guevara", "saint_anne", "roxelana", "ragnar_lodbrok", "nebuchadnezzar_ii", "omar_khayyam", "george_boole", "samson", "euripides", "pontius_pilate", "vlad_the_impaler", "mustafa_kemal_ataturk", "nostradamus", "matthew_the_apostle", "hadrian", "stephen_hawking", "alfred_nobel", "cyrus_the_great", "leo_tolstoy", "abu_bakr", "leonidas_i", "sappho", "aeneas", "luke_the_evangelist", "desiderius_erasmus", "solon", "selim_ii", "mehmed_the_conqueror", "victor_hugo", "saint_barbara", "albrecht_durer", "georg_wilhelm_friedrich_hegel", "dmitri_mendeleev", "parmenides", "john_locke", "abraham_lincoln", "marilyn_monroe", "baruch_spinoza", "benito_mussolini", "adam_smith", "tiberius", "khufu", "charlie_chaplin", "carl_linnaeus", "arthur_schopenhauer", "hypatia", "john_the_apostle", "claude_monet", "sandro_botticelli", "ellen_degeneres", "richard_wagner", "otto_von_bismarck", "aristophanes", "caravaggio", "commodus", "saint_lucy", "philip_ii_of_macedon", "mark_the_evangelist", "hesiod", "saint_valentine", "james,_son_of_zebedee", "sun_tzu", "pyotr_ilyich_tchaikovsky", "karl_landsteiner", "frida_kahlo", "horace", "samuel", "giuseppe_verdi", "martin_of_tours", "giordano_bruno", "johannes_kepler", "theodosius_i", "gottfried_wilhelm_leibniz", "imhotep", "rachel", "jonah", "herod_the_great", "mao_zedong", "charles_v,_holy_roman_emperor", "petrarch", "murasaki_shikibu", "michelle_bachelet", "jeanpaul_sartre", "amerigo_vespucci", "richard_i_of_england", "johannes_vermeer", "louis_xvi_of_france", "freddie_mercury", "claudius", "moliere", "bruce_lee", "maria_theresa", "zeno_of_elea", "giovanni_boccaccio", "fatimah", "antoni_gaudi", "saul", "francisco_goya", "edgar_allan_poe", "mars", "pepin_the_short"];
      // random 250 candidates
      const randomCandidates = ["peter_lely", "emperor_richu", "marquinhos", "victor_amadeus_i,_duke_of_savoy", "princess_augusta_of_bavaria", "william_baffin", "nigel_marven", "mauno_pekkala", "marc_stendera", "philip_iv_of_macedon", "yunho", "zhou_dunyi", "zakir_hussain", "miley_cyrus", "alice_of_antioch", "zoran_jankovic", "stanley_clarke", "caro_emerald", "rick_allen", "gwangjong_of_goryeo", "charlotte_corday", "boris_vian", "bartholomeus_spranger", "robert_stack", "john_of_rila", "naoko_mori", "maria_von_trapp", "anna_lindh", "atia_balba_caesonia", "dorothea_tanning", "nina_ricci", "pope_innocent_i", "joe_budden", "saint_veronica", "kim_stanley_robinson", "a._e._waite", "lyudmila_gurchenko", "andrew_lang", "richard_leakey", "maria_kanellis", "ivar_jacobson", "martin_o'neill", "yakov_borisovich_zel'dovich", "vladimir_kokovtsov", "heath_slater", "edward_calvin_kendall", "ruth_rendell", "emile_griffith", "liu_wen", "eldar_ryazanov", "mitchel_musso", "costinha", "elsa_hosk", "carl_gustav_rehnskiold", "jacobus_kapteyn", "gian_maria_visconti", "isaiah_thomas", "greyson_chance", "thutmose", "suzanne_valadon", "ron_gilbert", "tukultininurta_ii", "howard_jacobson", "j._p._guilford", "jetty_paerl", "hanna_suchocka", "herodias", "yogi_berra", "chris_gardner", "thomas_pynchon", "robert_mulligan", "agnes_keleti", "ken_block", "edward_g._robinson", "pehr_evind_svinhufvud", "max_euwe", "otto_neurath", "vilfredo_pareto", "francis_jammes", "ana_blandiana", "thievy_bifouma", "william_golding", "francois_tombalbaye", "roy_bittan", "nicolas_terol", "felix_vallotton", "shepseskaf", "wodzimierz_smolarek", "owen_arthur", "henry_mintzberg", "ryokan", "parysatis", "alberto_moreno", "ana_belen", "michael_foale", "stephen_jay_gould", "thandie_newton", "fernando_de_napoli", "zalman_shazar", "siw_malmkvist", "li_xiaopeng", "sweyn_ii_of_denmark", "john_abbott", "theodosius_iii", "gunnar_gren", "javier_echevarria_rodriguez", "perdiccas_iii_of_macedon", "franzjoseph_muller_von_reichenstein", "georges_rouault", "alain_mimoun", "alessio_cerci", "emily_davison", "louis_moreau_gottschalk", "martha_stewart", "rhino", "guy_ligier", "pope_romanus", "evgeny_tarelkin", "aritatsu_ogi", "masatoshi_koshiba", "jaan_kross", "max_born", "patriarch_alexy_ii_of_moscow", "sade", "jon_montgomery", "lee_chungyong", "jeanluc_ponty", "winslow_homer", "stephen_wiltshire", "domenico_cimarosa", "blaz_kavcic", "marcel_iures", "margaret_chan", "neferirkare_kakai", "bill_murray", "julie_andrews", "welf_ii,_duke_of_bavaria", "musa_calil", "anky_van_grunsven", "ferdinand_ries", "paul_verhoeven", "alec_baldwin", "paul_lafargue", "jamie_carragher", "johanna_gurun_jonsdottir", "margo_martindale", "moshe_safdie", "abbey_lee_kershaw", "ante_covic", "benedetto_marcello", "robert_mak", "david_ferrer", "timothy_m._dolan", "arthur_rubinstein", "eugene_simon", "jean_girault", "ivan_pyryev", "aldo_van_eyck", "ambrosius_holbein", "friedrich_mohs", "andres_guardado", "heinrich_zille", "dick_francis", "igor_smirnov", "b.j._penn", "vladislaus_ii_of_hungary", "geraldine_farrar", "taylor_momsen", "david_blaine", "raymond_burr", "sergey_makarov", "stein_eriksen", "minette_walters", "ewald_georg_von_kleist", "leopold_iii,_margrave_of_austria", "louis_iii_of_naples", "oleg_bryjak", "alan_lloyd_hodgkin", "ernst_von_weizsacker", "w._eugene_smith", "margaret_mahler", "michael_apted", "marianne_cope", "shawn_michaels", "dan_donegan", "sebastien_loeb", "ken_follett", "olly_murs", "marcell_jansen", "william_morris", "baasha_of_israel", "mihail_kogalniceanu", "edward_william_lane", "pasquale_paoli", "justine_henin", "charles_i,_count_of_flanders", "scott_brown", "yasmina_reza", "m._c._gainey", "alberigo_evani", "xi_jinping", "aden_abdullah_osman_daar", "oxana_fedorova", "james_kottak", "sam_snead", "henri_mouhot", "peter_shor", "lady_gaga", "andreja_klepac", "khendjer", "kostis_palamas", "marcus_vipsanius_agrippa", "richard_teichmann", "bobby_fischer", "julius_fucik", "vladimir_arsenyev", "gianni_amelio", "jesus", "alessandro_marcello", "fritz_strassmann", "imi_lichtenfeld", "sviatopolk_ii_of_kiev", "neferkamin", "georg_trakl", "alaina_huffman", "nicolas_poussin", "howard_dean", "gaston_eyskens", "stefan_uros_v", "michael_andreas_barclay_de_tolly", "alfredo_casella", "michael_iii", "david_chipperfield", "andrew_bird", "agnes_of_antioch", "fred_armisen", "tamara_taylor", "sara_bareilles", "teruyoshi_ito", "nasrallah_boutros_sfeir", "john_mahoney", "franz_meyen", "john_ii_of_aragon_and_navarre", "aung_san_suu_kyi", "teymuraz_gabashvili", "adelaide_of_lowensteinwertheimrosenberg", "hans_krebs", "semion_chelyuskin", "frederick_chiluba", "salah_aldin_albitar", "vijender_singh"];
      candidates = topCandidates.concat(randomCandidates);
    }
    else if (path.includes("/era")) {
      candidates = ["scribal", "printing", "newspaper", "radio_and_film", "television", "personal_computer"];
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function checkForId(nextState, replace) {
    if (!nextState.params.id) {
      const reqestedUrl = nextState.location.pathname;
      const randId = genRandId(reqestedUrl);
      const nextUrl = reqestedUrl.slice(-1) === "/" ? `${reqestedUrl}${randId}` : `${reqestedUrl}/${randId}`;
      return replace({pathname: nextUrl});
    }
    else {
      // make sure it's legal
      return NotFound;
    }
  }


  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route path="explore" component={Explore}>
        <Route path="viz" component={Viz} pageType={"viz"} />
        <Route path="rankings" component={Rankings} pageType={"rankings"} />
      </Route>

      <Route path="about" component={About}>
        <Route path="vision" component={Vision} />
        <Route path="methods" component={Methods} />
        <Route path="team" component={Team} />
        <Route path="publications" component={Publications} />
        <Route path="data_sources" component={DataSources} />
        <Route path="contact" component={Contact} />
      </Route>

      <Route path="profile" component={Profile}>
        <Route path="person(/:id)" component={Person} onEnter={checkForId} />
        <Route path="person/:id/screenshot" component={PersonScreenshot} />
        <Route path="place(/:id)" component={Place} onEnter={checkForId} />
        <Route path="place/:id/screenshot" component={PlaceScreenshot} />
        <Route path="occupation(/:id)" component={Occupation} onEnter={checkForId} />
        <Route path="occupation/:id/screenshot" component={OccupationScreenshot} />
        <Route path="era(/:id)" component={Era} onEnter={checkForId} />
        <Route path="era/:id/screenshot" component={EraScreenshot} />
      </Route>

      <Route path="data" component={Data}>
        <Route path="datasets" component={Datasets} />
        <Route path="api" component={Api} />
        <Route path="permissions" component={Permissions} />
        <Route path="faq" component={Faq} />
      </Route>

      <Route path="*" component={NotFound} status={404} />

    </Route>
  );
}
