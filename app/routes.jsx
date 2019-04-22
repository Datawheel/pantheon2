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

      const topCandidates = ["Mustafa_Kemal_Atatürk", "Judas_Iscariot", "Salvador_Dalí", "Solon", "Nikola_Tesla", "Paul_the_Apostle", "Giuseppe_Verdi", "Saint_Lucy", "Galileo_Galilei", "King_Arthur", "Zoroaster", "Saladin", "Giordano_Bruno", "Abraham_Lincoln", "Homer", "Vasco_da_Gama", "Thomas_Edison", "Saint_Anne", "Elizabeth_II", "Archimedes", "Hypatia", "Vlad_the_Impaler", "Luke_the_Evangelist", "Sigmund_Freud", "Pyotr_Ilyich_Tchaikovsky", "Avicenna", "Constantine_the_Great", "Immanuel_Kant", "Marilyn_Monroe", "Caravaggio", "Charles_Perrault", "Benito_Mussolini", "Maria_Theresa", "Akhenaten", "Diogenes", "Martin_Luther", "Blaise_Pascal", "Mary,_mother_of_Jesus", "Samuel", "Pablo_Picasso", "Petrarch", "Joan_of_Arc", "Sappho", "Julius_Caesar", "Commodus", "Georg_Wilhelm_Friedrich_Hegel", "Saint_Nicholas", "Virgil", "Suleiman_the_Magnificent", "Seneca_the_Younger", "Franz_Kafka", "Gottfried_Wilhelm_Leibniz", "Nostradamus", "Ludwig_van_Beethoven", "Isaac_Newton", "Ferdinand_Magellan", "Antoni_Gaudí", "Dante_Alighieri", "Christopher_Columbus", "Frédéric_Chopin", "Che_Guevara", "Henry_VIII_of_England", "William_Shakespeare", "Jean-Paul_Sartre", "Hesiod", "Victor_Hugo", "Edgar_Allan_Poe", "Niccolò_Machiavelli", "Elizabeth_I_of_England", "Fyodor_Dostoevsky", "Jonah", "Nero", "Stephen_Hawking", "Samson", "Jesus", "James,_son_of_Zebedee", "Marco_Polo", "Khufu", "Democritus", "Erasmus", "Muhammad_ibn_Musa_al-Khwarizmi", "Euripides", "Adam", "Michelangelo", "Marie_Antoinette", "Michelle_Bachelet", "Saint_Valentine", "Darius_the_Great", "Noah", "Hadrian", "Johann_Sebastian_Bach", "Parmenides", "Pythagoras", "John_Locke", "Marie_Curie", "Cleopatra", "George_Boole", "Leonidas_I", "Hannibal", "Cyrus_the_Great", "Elijah", "Saint_Joseph", "Mary_Magdalene", "Abraham", "Joshua", "Robin_Hood", "John_the_Apostle", "Adolf_Hitler", "Muhammad", "Tutankhamun", "Louis_XVI_of_France", "Wolfgang_Amadeus_Mozart", "Trajan", "Augustine_of_Hippo", "Saint_Barbara", "Claude_Monet", "Molière", "Napoleon", "Hippocrates", "Leonardo_da_Vinci", "Martin_Luther_King_Jr.", "Euclid", "Caligula", "Joseph_(Genesis)", "Vincent_van_Gogh", "Mao_Zedong", "Qin_Shi_Huang", "Carl_Linnaeus", "Justinian_I", "Nefertiti", "Plato", "Nelson_Mandela", "Charles_V,_Holy_Roman_Emperor", "Eratosthenes", "Martin_of_Tours", "Krishna", "Herodotus", "Fatimah", "Heraclitus", "Laozi", "Dmitri_Mendeleev", "Augustus", "Timur", "Charlie_Chaplin", "Mehmed_the_Conqueror", "Thales_of_Miletus", "Pepin_the_Short", "Socrates", "Leo_Tolstoy", "Richard_Wagner", "Aristotle", "Claudius", "Sophocles", "Omar_Khayyam", "Friedrich_Nietzsche", "Francisco_Goya", "Moses", "Mars_(mythology)", "Saint_Peter", "Gautama_Buddha", "Spartacus", "Johannes_Gutenberg", "Francis_of_Assisi", "Ovid", "Vladimir_Lenin", "Albrecht_Dürer", "Estée_Lauder_(businesswoman)", "Cicero", "Steve_Jobs", "Horace", "Johannes_Vermeer", "Ramesses_II", "Bruce_Lee", "Epicurus", "Theodosius_I", "Voltaire", "Aesop", "Ellen_DeGeneres", "Albert_Einstein", "Hurrem_Sultan", "Thomas_Aquinas", "Zeno_of_Elea", "Gilgamesh", "Andrew_the_Apostle", "Ragnar_Lodbrok", "Marcus_Aurelius", "Sun_Tzu", "Amerigo_Vespucci", "Charlemagne", "Otto_von_Bismarck", "Richard_I_of_England", "Confucius", "Antonio_Vivaldi", "Philip_II_of_Macedon", "Johannes_Kepler", "Pericles", "Tina_Fey", "Tiberius", "Adam_Smith", "Ptolemy", "Aeschylus", "Aristophanes", "Giovanni_Boccaccio", "Ali", "Alfred_Nobel", "Hammurabi", "Daniel_(biblical_figure)", "Karl_Landsteiner", "Aeneas", "Charles_Darwin", "Arthur_Schopenhauer", "Sandro_Botticelli", "Joseph_Stalin", "Selim_II", "Jean-Jacques_Rousseau", "Murasaki_Shikibu", "John_the_Baptist", "René_Descartes", "Solomon", "Job_(biblical_figure)", "Methuselah", "Attila", "Saul", "Jacob", "Isaac", "Frida_Kahlo", "Hans_Christian_Andersen", "Raphael", "Louis_XIV_of_France", "Rembrandt", "Mark_the_Evangelist", "Abu_Bakr", "Mahatma_Gandhi", "Herod_the_Great", "Genghis_Khan", "Baruch_Spinoza", "Imhotep", "Nebuchadnezzar_II", "Alexander_the_Great", "Johann_Wolfgang_von_Goethe", "Karl_Marx", "Pontius_Pilate", "Nicolaus_Copernicus", "Aaron", "Saint_George", "Rachel", "Matthew_the_Apostle", "David"];
      // random 250 candidates
      const randomCandidates = ["Ernst_von_Weizsäcker", "Ken_Follett", "Mihail_Kogălniceanu", "Isaiah_Thomas_(basketball)", "Oxana_Fedorova", "Joe_Budden", "Ivan_Pyryev", "Hanna_Suchocka", "Olly_Murs", "Maria_von_Trapp", "Jamie_Carragher", "Hans_Krebs_(Wehrmacht_general)", "Sergey_Makarov_(javelin_thrower)", "Henry_Mintzberg", "Aden_Adde", "Minette_Walters", "Anna_Lindh", "Shepseskaf", "Pope_Romanus", "Julius_Fučík_(journalist)", "Eldar_Ryazanov", "Suzanne_Valadon", "Costinha", "Ambrosius_Holbein", "Charlotte_Corday", "Andreja_Klepač", "Yasmina_Reza", "Ruth_Rendell", "Taylor_Momsen", "Alice_of_Antioch", "Peter_Shor", "Stefan_Uroš_V", "Justine_Henin", "Carl_Gustav_Rehnskiöld", "Rhyno", "Robert_Mulligan", "Ferdinand_Ries", "Max_Born", "Eugène_Simon", "Atia_(mother_of_Augustus)", "Marcus_Vipsanius_Agrippa", "Greyson_Chance", "Franz_Meyen", "Kim_Stanley_Robinson", "Marc_Stendera", "Liu_Wen", "John_Abbott", "Jesus", "Edward_G._Robinson", "Richard_Leakey", "William_Morris", "Domenico_Cimarosa", "Moshe_Safdie", "Henri_Mouhot", "Stephen_Wiltshire", "Emile_Griffith", "Vladimir_Kokovtsov", "Jacobus_Kapteyn", "Otto_Neurath", "Tamara_Taylor", "Jean_Girault", "Baasha_of_Israel", "Mauno_Pekkala", "Neferirkare_Kakai", "Louis_Moreau_Gottschalk", "François_Tombalbaye", "Ágnes_Keleti", "Teymuraz_Gabashvili", "Vladislaus_II_of_Hungary", "Theodosius_III", "Sweyn_II_of_Denmark", "Sara_Bareilles", "Patriarch_Alexy_II_of_Moscow", "Edward_Calvin_Kendall", "Bartholomeus_Spranger", "Sam_Snead", "Zakir_Hussain_(musician)", "Nina_Ricci_(designer)", "James_Kottak", "Julie_Andrews", "Shawn_Michaels", "Andrew_Lang", "Thutmose_(sculptor)", "Benedetto_Marcello", "Bobby_Fischer", "Semyon_Chelyuskin", "Ewald_Georg_von_Kleist", "Margo_Martindale", "Michael_III", "Stein_Eriksen", "Alessandro_Marcello", "Winslow_Homer", "Alan_Lloyd_Hodgkin", "Emily_Davison", "Vijender_Singh", "Peter_Lely", "A._E._Waite", "Fritz_Strassmann", "Ana_Blandiana", "Ryōkan", "Jaan_Kross", "Imi_Lichtenfeld", "Martha_Stewart", "Perdiccas_III_of_Macedon", "Leopold_III,_Margrave_of_Austria", "Stephen_Jay_Gould", "Heath_Slater", "Charles_I,_Count_of_Flanders", "Alessio_Cerci", "Friedrich_Mohs", "Vladimir_Arsenyev", "Jóhanna_Guðrún_Jónsdóttir", "William_Golding", "Salah_al-Din_al-Bitar", "Bill_Murray", "Robert_Stack", "Raymond_Burr", "John_of_Rila", "Alain_Mimoun", "Xi_Jinping", "Elsa_Hosk", "Richard_Teichmann", "Ron_Gilbert", "Pasquale_Paoli", "Siw_Malmkvist", "Georg_Trakl", "Michael_Apted", "Gwangjong_of_Goryeo", "Francis_Jammes", "Igor_Smirnov", "Li_Xiaopeng_(gymnast)", "Ana_Belén", "Gunnar_Gren", "Alec_Baldwin", "Saint_Veronica", "Timothy_M._Dolan", "Blaž_Kavčič", "Aritatsu_Ogi", "Lyudmila_Gurchenko", "Anky_van_Grunsven", "Max_Euwe", "Alberigo_Evani", "Nigel_Marven", "Philip_IV_of_Macedon", "Pope_Innocent_I", "Emperor_Richū", "Heinrich_Zille", "William_Baffin", "John_II_of_Aragon", "W._Eugene_Smith", "Javier_Echevarría_Rodríguez", "Yogi_Berra", "Thomas_Pynchon", "Abbey_Lee_Kershaw", "Adelaide_of_Löwenstein-Wertheim-Rosenberg", "Tukulti-Ninurta_II", "Félix_Vallotton", "Marcel_Iureș", "Edward_William_Lane", "Jetty_Paerl", "Pehr_Evind_Svinhufvud", "Gianni_Amelio", "Georges_Rouault", "Dorothea_Tanning", "Zhou_Dunyi", "Marcell_Jansen", "Fred_Armisen", "Jon_Montgomery", "Vilfredo_Pareto", "Aldo_van_Eyck", "Thandie_Newton", "Michael_Andreas_Barclay_de_Tolly", "John_Mahoney", "Chris_Gardner", "Parysatis", "Alfredo_Casella", "Boris_Vian", "Mitchel_Musso", "Louis_III_of_Naples", "Maria_Kanellis", "Kostis_Palamas", "Zalman_Shazar", "Gian_Maria_Visconti", "Aung_San_Suu_Kyi", "David_Blaine", "Sviatopolk_II_of_Kiev", "B.J._Penn", "Jean-Luc_Ponty", "David_Chipperfield", "Scott_Brown_(footballer,_born_June_1985)", "Evgeny_Tarelkin", "Paul_Verhoeven", "Franz-Joseph_Müller_von_Reichenstein", "Włodzimierz_Smolarek", "Nicolás_Terol", "Stanley_Clarke", "Naoko_Mori", "David_Ferrer", "Neferkamin", "M._C._Gainey", "Arthur_Rubinstein", "Khendjer", "Welf_II,_Duke_of_Bavaria", "Nicolas_Poussin", "Lady_Gaga", "Musa_Cälil", "Andrew_Bird", "Agnes_of_Antioch", "Masatoshi_Koshiba", "Fernando_De_Napoli", "Alaina_Huffman", "Ante_Covic", "Ivar_Jacobson", "Nasrallah_Boutros_Sfeir", "Geraldine_Farrar", "Paul_Lafargue", "Owen_Arthur", "Oleg_Bryjak", "Herodias", "Zoran_Janković_(politician)", "J._P._Guilford", "Michael_Foale", "Frederick_Chiluba", "Gaston_Eyskens", "Princess_Augusta_of_Bavaria", "Victor_Amadeus_I,_Duke_of_Savoy", "Margaret_Mahler", "Lee_Chung-yong", "Howard_Jacobson", "Teruyoshi_Ito", "Dick_Francis", "Caro_Emerald", "Marianne_Cope", "Miley_Cyrus", "Sébastien_Loeb", "Howard_Dean", "Margaret_Chan"];
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
