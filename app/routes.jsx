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
import Country from "pages/profile/country/Country";
import CountryScreenshot from "pages/profile/country/CountryScreenshot";
import Occupation from "pages/profile/occupation/Occupation";
import OccupationScreenshot from "pages/profile/occupation/OccupationScreenshot";
import Era from "pages/profile/era/Era";
import EraScreenshot from "pages/profile/era/EraScreenshot";
import OccupationCountry from "pages/profile/occupation-country/OccupationCountry";
import SelectOccupationCountry from "pages/profile/occupation-country/SelectOccupationCountry";

// about components
import About from "pages/about/About";
import Vision from "pages/about/Vision";
import Methods from "pages/about/Methods";
import Team from "pages/about/Team";
import Publications from "pages/about/Publications";
import DataSources from "pages/about/DataSources";
import Contact from "pages/about/Contact";
import PrivacyPolicy from "pages/about/PrivacyPolicy";
import TermsOfService from "pages/about/TermsOfService";

// explore componenets
import Explore from "pages/explore/Explore";
import Viz from "pages/explore/viz/Viz";
import VizEmbed from "pages/explore/viz/VizEmbed";
import Rankings from "pages/explore/rankings/Rankings";

// data section components
import Data from "pages/data/Data";
import Datasets from "pages/data/Datasets";
import Api from "pages/data/Api";
import Permissions from "pages/data/Permissions";
import Faq from "pages/data/Faq";

// apps section components
import Apps from "pages/apps/Apps";
import YearbookIndex from "pages/apps/yearbook/Index";
import Yearbook from "pages/apps/yearbook/Yearbook";
import Trivia from "pages/apps/trivia/Trivia";

// custom 404 page
import NotFound from "components/NotFound";

/**
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default function RouteCreate() {

  /** */
  function checkForCountryId(nextState, replace) {
    const countryCandidates = ["usa", "gbr", "fra", "deu", "ita", "jpn", "rus", "esp", "bra", "swe", "pol", "chn", "nld", "tur", "ind", "can", "aut", "ukr", "grc", "arg", "bel", "dnk", "aus", "che", "nor", "hun", "egy", "rou", "hrv", "irn", "prt", "irl", "fin", "mex", "srb", "isr", "irq", "bgr", "zaf", "ury", "svk", "blr", "geo", "col", "svn", "est", "sau", "bih", "ltu", "cze", "lva", "chl", "nzl", "nga", "cub", "kaz", "dza", "pak", "syr", "per", "kor", "isl", "tun", "mar", "aze", "jam", "pry", "ven"];
    const reqestedUrl = nextState.location;
    console.log("nextState", nextState);
    console.log("reqestedUrl!!!", reqestedUrl);
    if (reqestedUrl.pathname === "viz/country" && reqestedUrl.search === "") {
      const randCountryId = countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
      const nextUrl = `explore/viz?viz=treemap&show=occupations&years=-3501,2015&place=${randCountryId}`;
      return replace({pathname: nextUrl});
    }
  }

  /** */
  function genRandId(path) {
    let candidates;
    if (path.includes("place")) {
      candidates = ["new-york-city", "paris", "london", "rome", "los-angeles", "moscow", "chicago", "vienna", "brooklyn", "berlin", "saint-petersburg", "budapest", "madrid", "philadelphia", "tokyo", "buenos-aires", "prague", "stockholm", "seoul", "copenhagen", "boston", "munich", "washington-dc", "barcelona", "florence", "rio-de-janeiro", "sao-paulo", "milan", "san-francisco", "athens", "venice", "detroit", "mumbai", "istanbul", "montevideo", "toronto", "the-bronx", "dublin", "manhattan", "amsterdam", "houston", "sydney", "st-louis", "warsaw", "mexico-cityfederal-district", "tbilisi", "hamburg", "belgrade", "montreal", "baltimore", "melbourne", "lisbon", "oslo", "glasgow", "naples", "kiev", "istanbul", "dallas", "bucharest", "cairo", "pittsburgh", "bologna", "cleveland", "lyon", "turin", "frankfurt", "kyoto", "atlanta", "riga", "san-diego", "zagreb", "santiago", "alexandria", "edinburgh", "tehran", "dresden", "new-orleans", "liverpool", "seattle", "vancouver", "helsinki", "tallinn", "shizuoka-city", "marseillehistory", "geneva", "miami", "stuttgart", "brussels", "queens", "baku", "santa-monica-california", "the-hague", "mecca", "cologne", "jerusalem", "split-croatia", "cincinnati", "rotterdam", "lima", "krakow", "gothenburg", "leipzig", "yokohama", "beijing", "reykjavik", "shizuoka-prefecture", "odessa", "hanover", "zurich", "antwerp", "newark-new-jersey", "portland-oregon", "milwaukee", "wroclaw", "memphis-tennessee", "ljubljana", "saitama-city", "minsk", "denver", "baghdad", "asuncion", "sofia", "shanghai", "genoa", "minneapolis", "indianapolis", "seville", "birmingham", "columbus-ohio", "strasbourg", "kolkata", "kanagawa-prefecture", "buffalo-new-york", "konigsberg", "rosario-santa-fe", "neuilly-sur-seine", "johannesburg", "kansas-city-missouri", "bratislava", "honolulu", "sarajevo", "sparta", "oakland-california", "valencia", "lvivhabsburg-empire", "vilnius", "basel", "karlsruhe"];
    }
    else if (path.includes("country")) {
      candidates = ["united-states", "united-kingdom", "france", "germany", "italy", "japan", "russia", "spain", "brazil", "poland", "india", "sweden", "canada", "netherlands", "china", "austria", "turkey", "ukraine", "greece", "czechia", "argentina", "belgium", "australia", "denmark", "south-korea", "switzerland", "norway", "hungary", "romania", "croatia", "ireland", "portugal", "finland", "iran", "mexico", "serbia", "egypt", "israel", "south-africa", "slovakia", "uruguay", "belarus", "georgia", "bulgaria", "saudi-arabia", "estonia", "slovenia", "latvia", "colombia", "lithuania", "bosnia-and-herzegovina", "iraq", "chile", "new-zealand", "cuba", "nigeria", "peru", "morocco", "pakistan", "algeria", "syria", "tunisia", "jamaica", "iceland", "azerbaijan", "paraguay", "venezuela", "vietnam", "afghanistan", "armenia", "lebanon", "kenya", "ecuador", "kazakhstan", "thailand", "uzbekistan", "macedonia-fyrom", "north-korea", "cameroon", "ghana", "costa-rica", "cote-divoire", "indonesia", "montenegro", "senegal", "philippines", "taiwan", "moldova", "ethiopia", "cyprus", "luxembourg", "honduras", "libya", "haiti", "malta", "hong-kong", "panama", "trinidad-and-tobago", "malaysia", "nepal", "mongolia", "bolivia", "bangladesh", "dominican-republic", "kyrgyzstan", "guatemala", "angola", "mali", "congo-kinshasa", "albania", "somalia", "madagascar", "zimbabwe", "sri-lanka", "jordan", "uganda", "zambia", "democratic-republic-of-the-congo", "singapore", "cambodia", "myanmar-burma", "nicaragua", "mozambique", "guinea", "burkina-faso", "the-bahamas", "suriname", "tanzania", "sudan", "guadeloupe", "turkmenistan", "yemen", "monaco", "benin", "el-salvador", "burundi", "liberia", "united-arab-emirates", "gabon", "central-african-republic", "qatar", "guyana", "togo", "kuwait", "martinique", "niger", "tajikistan", "bosnia-herzegovina"];
    }
    else if (path.includes("occupation")) {
      candidates = ["architect", "social-activist", "politician", "pilot", "physicist", "biologist", "astronomer", "athlete", "basketball-player", "baseball-player", "chef", "celebrity", "game-designer", "actor", "film-director", "philosopher", "computer-scientist", "snooker", "youtuber"];
    }
    else if (path.includes("person")) {
      // top 250 candidates by hpi

      const topCandidates = ["Sebastian_Nerz", "Radik_Isayev", "Aleksander_Barkov_Jr.", "Mustafa_Kemal_Atatürk", "Judas_Iscariot", "Salvador_Dalí", "Solon", "Nikola_Tesla", "Paul_the_Apostle", "Giuseppe_Verdi", "Saint_Lucy", "Galileo_Galilei", "King_Arthur", "Zoroaster", "Saladin", "Giordano_Bruno", "Abraham_Lincoln", "Homer", "Vasco_da_Gama", "Thomas_Edison", "Saint_Anne", "Elizabeth_II", "Archimedes", "Greta_Thunberg", "Vlad_the_Impaler", "Luke_the_Evangelist", "Sigmund_Freud", "Pyotr_Ilyich_Tchaikovsky", "Avicenna", "Constantine_the_Great", "Immanuel_Kant", "Marilyn_Monroe", "Caravaggio", "Charles_Perrault", "Benito_Mussolini", "Maria_Theresa", "Akhenaten", "Diogenes", "Martin_Luther", "Blaise_Pascal", "Mary,_mother_of_Jesus", "Samuel", "Pablo_Picasso", "Petrarch", "Joan_of_Arc", "Sappho", "Julius_Caesar", "Commodus", "Georg_Wilhelm_Friedrich_Hegel", "Saint_Nicholas", "Virgil", "Suleiman_the_Magnificent", "Seneca_the_Younger", "Franz_Kafka", "Gottfried_Wilhelm_Leibniz", "Nostradamus", "Ludwig_van_Beethoven", "Isaac_Newton", "Ferdinand_Magellan", "Antoni_Gaudí", "Dante_Alighieri", "Christopher_Columbus", "Frédéric_Chopin", "Che_Guevara", "Henry_VIII_of_England", "William_Shakespeare", "Jean-Paul_Sartre", "Hesiod", "Victor_Hugo", "Edgar_Allan_Poe", "Niccolò_Machiavelli", "Elizabeth_I_of_England", "Fyodor_Dostoevsky", "Jonah", "Nero", "Stephen_Hawking", "Samson", "Jesus", "James,_son_of_Zebedee", "Marco_Polo", "Khufu", "Democritus", "Erasmus", "Muhammad_ibn_Musa_al-Khwarizmi", "Euripides", "Adam", "Michelangelo", "Marie_Antoinette", "Michelle_Bachelet", "Saint_Valentine", "Darius_the_Great", "Noah", "Hadrian", "Johann_Sebastian_Bach", "Parmenides", "Pythagoras", "John_Locke", "Marie_Curie", "Cleopatra", "George_Boole", "Leonidas_I", "Hannibal", "Cyrus_the_Great", "Elijah", "Saint_Joseph", "Mary_Magdalene", "Abraham", "Joshua", "Robin_Hood", "John_the_Apostle", "Adolf_Hitler", "Muhammad", "Tutankhamun", "Louis_XVI_of_France", "Wolfgang_Amadeus_Mozart", "Trajan", "Augustine_of_Hippo", "Saint_Barbara", "Claude_Monet", "Molière", "Napoleon", "Hippocrates", "Leonardo_da_Vinci", "Martin_Luther_King_Jr.", "Euclid", "Caligula", "Joseph_(Genesis)", "Vincent_van_Gogh", "Mao_Zedong", "Qin_Shi_Huang", "Carl_Linnaeus", "Justinian_I", "Nefertiti", "Plato", "Nelson_Mandela", "Charles_V,_Holy_Roman_Emperor", "Eratosthenes", "Martin_of_Tours", "Krishna", "Herodotus", "Fatimah", "Heraclitus", "Laozi", "Dmitri_Mendeleev", "Augustus", "Timur", "Charlie_Chaplin", "Mehmed_the_Conqueror", "Thales_of_Miletus", "Pepin_the_Short", "Socrates", "Leo_Tolstoy", "Richard_Wagner", "Aristotle", "Claudius", "Sophocles", "Omar_Khayyam", "Friedrich_Nietzsche", "Francisco_Goya", "Moses", "Mars_(mythology)", "Saint_Peter", "Gautama_Buddha", "Spartacus", "Johannes_Gutenberg", "Francis_of_Assisi", "Ovid", "Vladimir_Lenin", "Albrecht_Dürer", "Estée_Lauder_(businesswoman)", "Cicero", "Steve_Jobs", "Horace", "Johannes_Vermeer", "Ramesses_II", "Bruce_Lee", "Epicurus", "Theodosius_I", "Voltaire", "Aesop", "Ellen_DeGeneres", "Albert_Einstein", "Hurrem_Sultan", "Thomas_Aquinas", "Zeno_of_Elea", "Gilgamesh", "Andrew_the_Apostle", "Ragnar_Lodbrok", "Marcus_Aurelius", "Sun_Tzu", "Amerigo_Vespucci", "Charlemagne", "Otto_von_Bismarck", "Richard_I_of_England", "Confucius", "Antonio_Vivaldi", "Philip_II_of_Macedon", "Johannes_Kepler", "Pericles", "Tina_Fey", "Tiberius", "Adam_Smith", "Ptolemy", "Aeschylus", "Aristophanes", "Giovanni_Boccaccio", "Ali", "Alfred_Nobel", "Hammurabi", "Daniel_(biblical_figure)", "Karl_Landsteiner", "Aeneas", "Charles_Darwin", "Arthur_Schopenhauer", "Sandro_Botticelli", "Joseph_Stalin", "Selim_II", "Jean-Jacques_Rousseau", "Murasaki_Shikibu", "John_the_Baptist", "René_Descartes", "Solomon", "Job_(biblical_figure)", "Methuselah", "Attila", "Saul", "Jacob", "Isaac", "Frida_Kahlo", "Hans_Christian_Andersen", "Raphael", "Louis_XIV_of_France", "Rembrandt", "Mark_the_Evangelist", "Abu_Bakr", "Mahatma_Gandhi", "Herod_the_Great", "Genghis_Khan", "Baruch_Spinoza", "Imhotep", "Nebuchadnezzar_II", "Alexander_the_Great", "Johann_Wolfgang_von_Goethe", "Karl_Marx", "Pontius_Pilate", "Nicolaus_Copernicus", "Luiz_Inácio_Lula_da_Silva", "Saint_George", "Rachel", "Matthew_the_Apostle", "David"];
      // random 250 candidates
      const randomCandidates = ["Ernst_von_Weizsäcker", "Ken_Follett", "Mihail_Kogălniceanu", "Isaiah_Thomas_(basketball)", "Oxana_Fedorova", "Joe_Budden", "Ivan_Pyryev", "Hanna_Suchocka", "Olly_Murs", "Maria_von_Trapp", "Jamie_Carragher", "Hans_Krebs_(Wehrmacht_general)", "Sergey_Makarov_(javelin_thrower)", "Henry_Mintzberg", "Aden_Adde", "Minette_Walters", "Anna_Lindh", "Shepseskaf", "Pope_Romanus", "Julius_Fučík_(journalist)", "Eldar_Ryazanov", "Suzanne_Valadon", "Costinha", "Ambrosius_Holbein", "Charlotte_Corday", "Andreja_Klepač", "Yasmina_Reza", "Ruth_Rendell", "Taylor_Momsen", "Alice_of_Antioch", "Peter_Shor", "Stefan_Uroš_V", "Justine_Henin", "Carl_Gustav_Rehnskiöld", "Rhyno", "Robert_Mulligan", "Ferdinand_Ries", "Max_Born", "Eugène_Simon", "Atia_(mother_of_Augustus)", "Marcus_Vipsanius_Agrippa", "Greyson_Chance", "Franz_Meyen", "Kim_Stanley_Robinson", "Marc_Stendera", "Liu_Wen", "John_Abbott", "Jesus", "Edward_G._Robinson", "Richard_Leakey", "William_Morris", "Domenico_Cimarosa", "Moshe_Safdie", "Henri_Mouhot", "Stephen_Wiltshire", "Emile_Griffith", "Vladimir_Kokovtsov", "Jacobus_Kapteyn", "Otto_Neurath", "Tamara_Taylor", "Jean_Girault", "Baasha_of_Israel", "Mauno_Pekkala", "Neferirkare_Kakai", "Louis_Moreau_Gottschalk", "François_Tombalbaye", "Ágnes_Keleti", "Teymuraz_Gabashvili", "Vladislaus_II_of_Hungary", "Theodosius_III", "Sweyn_II_of_Denmark", "Sara_Bareilles", "Patriarch_Alexy_II_of_Moscow", "Edward_Calvin_Kendall", "Bartholomeus_Spranger", "Sam_Snead", "Zakir_Hussain_(musician)", "Nina_Ricci_(designer)", "James_Kottak", "Julie_Andrews", "Shawn_Michaels", "Andrew_Lang", "Thutmose_(sculptor)", "Benedetto_Marcello", "Bobby_Fischer", "Semyon_Chelyuskin", "Ewald_Georg_von_Kleist", "Margo_Martindale", "Michael_III", "Stein_Eriksen", "Alessandro_Marcello", "Winslow_Homer", "Alan_Lloyd_Hodgkin", "Emily_Davison", "Vijender_Singh", "Peter_Lely", "A._E._Waite", "Fritz_Strassmann", "Ana_Blandiana", "Ryōkan", "Jaan_Kross", "Imi_Lichtenfeld", "Martha_Stewart", "Perdiccas_III_of_Macedon", "Leopold_III,_Margrave_of_Austria", "Stephen_Jay_Gould", "Heath_Slater", "Charles_I,_Count_of_Flanders", "Alessio_Cerci", "Friedrich_Mohs", "Vladimir_Arsenyev", "Jóhanna_Guðrún_Jónsdóttir", "William_Golding", "Salah_al-Din_al-Bitar", "Bill_Murray", "Robert_Stack", "Raymond_Burr", "John_of_Rila", "Alain_Mimoun", "Xi_Jinping", "Elsa_Hosk", "Richard_Teichmann", "Ron_Gilbert", "Pasquale_Paoli", "Siw_Malmkvist", "Georg_Trakl", "Michael_Apted", "Gwangjong_of_Goryeo", "Francis_Jammes", "Igor_Smirnov", "Li_Xiaopeng_(gymnast)", "Ana_Belén", "Gunnar_Gren", "Alec_Baldwin", "Saint_Veronica", "Timothy_M._Dolan", "Blaž_Kavčič", "Aritatsu_Ogi", "Lyudmila_Gurchenko", "Anky_van_Grunsven", "Max_Euwe", "Alberigo_Evani", "Nigel_Marven", "Philip_IV_of_Macedon", "Pope_Innocent_I", "Emperor_Richū", "Heinrich_Zille", "William_Baffin", "John_II_of_Aragon", "W._Eugene_Smith", "Javier_Echevarría_Rodríguez", "Yogi_Berra", "Thomas_Pynchon", "Abbey_Lee_Kershaw", "Adelaide_of_Löwenstein-Wertheim-Rosenberg", "Tukulti-Ninurta_II", "Félix_Vallotton", "Marcel_Iureș", "Edward_William_Lane", "Jetty_Paerl", "Pehr_Evind_Svinhufvud", "Gianni_Amelio", "Georges_Rouault", "Dorothea_Tanning", "Zhou_Dunyi", "Marcell_Jansen", "Fred_Armisen", "Jon_Montgomery", "Vilfredo_Pareto", "Aldo_van_Eyck", "Thandie_Newton", "Michael_Andreas_Barclay_de_Tolly", "John_Mahoney", "Chris_Gardner", "Parysatis", "Alfredo_Casella", "Boris_Vian", "Mitchel_Musso", "Louis_III_of_Naples", "Maria_Kanellis", "Kostis_Palamas", "Zalman_Shazar", "Gian_Maria_Visconti", "Aung_San_Suu_Kyi", "David_Blaine", "Sviatopolk_II_of_Kiev", "B.J._Penn", "Jean-Luc_Ponty", "David_Chipperfield", "Scott_Brown_(footballer,_born_June_1985)", "Evgeny_Tarelkin", "Paul_Verhoeven", "Franz-Joseph_Müller_von_Reichenstein", "Włodzimierz_Smolarek", "Nicolás_Terol", "Stanley_Clarke", "Naoko_Mori", "David_Ferrer", "Neferkamin", "M._C._Gainey", "Arthur_Rubinstein", "Khendjer", "Welf_II,_Duke_of_Bavaria", "Nicolas_Poussin", "Lady_Gaga", "Musa_Cälil", "Andrew_Bird", "Agnes_of_Antioch", "Masatoshi_Koshiba", "Fernando_De_Napoli", "Alaina_Huffman", "Ante_Covic", "Ivar_Jacobson", "Nasrallah_Boutros_Sfeir", "Geraldine_Farrar", "Paul_Lafargue", "Owen_Arthur", "Oleg_Bryjak", "Herodias", "Zoran_Janković_(politician)", "J._P._Guilford", "Michael_Foale", "Frederick_Chiluba", "Gaston_Eyskens", "Princess_Augusta_of_Bavaria", "Victor_Amadeus_I,_Duke_of_Savoy", "Margaret_Mahler", "Lee_Chung-yong", "Howard_Jacobson", "Teruyoshi_Ito", "Dick_Francis", "Caro_Emerald", "Marianne_Cope", "Miley_Cyrus", "Sébastien_Loeb", "Howard_Dean", "Margaret_Chan", "Solange_Knowles", "Billie_Eilish", "Godfrey_Gao", "Fred_Rogers", "Princess_Alice_of_Battenberg", "Prince_Philip,_Duke_of_Edinburgh", "Anne,_Princess_Royal", "Rian_Johnson", "Pete_Buttigieg", "Goo_Hara", "Michael_Bloomberg", "Jimmy_Hoffa", "Princess_Margaret,_Countess_of_Snowdon", "Dennis_Rodman", "Mike_Trout"];
      candidates = topCandidates.concat(randomCandidates);
    }
    else if (path.includes("/era")) {
      candidates = ["scribal", "printing", "newspaper", "radio_and_film", "television", "personal_computer"];
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /** */
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
        <Route path="viz/embed" component={VizEmbed} pageType={"viz"} />
        <Route path="rankings" component={Rankings} pageType={"rankings"} />
      </Route>
      {/* <Route path="explore/viz" component={Viz} pageType={"viz"} />
      <Route path="explore/rankings" component={Rankings} pageType={"rankings"} /> */}

      <Route path="about" component={About}>
        <Route path="vision" component={Vision} />
        <Route path="methods" component={Methods} />
        <Route path="team" component={Team} />
        <Route path="publications" component={Publications} />
        <Route path="data_sources" component={DataSources} />
        <Route path="contact" component={Contact} />
        <Route path="privacy" component={PrivacyPolicy} />
        <Route path="terms" component={TermsOfService} />
      </Route>

      <Route path="profile" component={Profile}>
        <Route path="person(/:id)" component={Person} onEnter={checkForId} />
        <Route path="person/:id/screenshot" component={PersonScreenshot} />
        <Route path="place(/:id)" component={Place} onEnter={checkForId} />
        <Route path="place/:id/screenshot" component={PlaceScreenshot} />
        <Route path="country(/:id)" component={Country} onEnter={checkForId} />
        <Route path="country/:id/screenshot" component={CountryScreenshot} />
        <Route path="occupation(/:id)" component={Occupation} onEnter={checkForId} />
        <Route path="occupation/:id/screenshot" component={OccupationScreenshot} />
        <Route path="era(/:id)" component={Era} onEnter={checkForId} />
        <Route path="era/:id/screenshot" component={EraScreenshot} />
        <Route path="occupation/:occupationSlug/country/:countrySlug" component={OccupationCountry} />
        <Route path="select-occupation-country" component={SelectOccupationCountry} />
      </Route>

      <Route path="data" component={Data}>
        <Route path="datasets" component={Datasets} />
        <Route path="api" component={Api} />
        <Route path="permissions" component={Permissions} />
        <Route path="faq" component={Faq} />
      </Route>

      <Route path="app" component={Apps}>
        <Route path="yearbook" component={YearbookIndex}>
          <Route path=":year" component={Yearbook} />
        </Route>
        <Route path="trivia" component={Trivia} />
      </Route>

      <Route path="*" component={NotFound} status={404} />

    </Route>
  );
}
