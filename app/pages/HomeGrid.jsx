import React from "react";
import {Link} from "react-router";
import "pages/HomeGrid.css";

const HomeGrid = () => {
  const featured = [
    {cat: "pubfig", id: "greta", name: "Greta Thunberg", url: "/profile/person/Greta_Thunberg"},
    {cat: "scitech", id: "ada", name: "Ada Lovelace", url: "/profile/person/Ada_Lovelace"},
    {cat: "arts", id: "dali", name: "Salvador Dali", url: "/profile/person/Salvador_Dalí"},
    {cat: "inst", id: "tut", name: "Tutankhamun", url: "/profile/person/Tutankhamun"},
    {cat: "sports", id: "ubolt", name: "Usain Bolt", url: "/profile/person/Usain_Bolt"},
    {cat: "print", id: "pubfig", name: "Printing Era", url: "/profile/era/printing"},
    {cat: "", id: "bair", name: "Buenos Aires", url: "/profile/place/buenos-aires"},
    {cat: "sports", id: "senna", name: "Ayrton Senna", url: "/profile/person/Ayrton_Senna"},
    {cat: "arts", id: "cara", name: "Cara Delevingne", url: "/profile/person/Cara_Delevingne"},
    {cat: "pubfig", id: "gandhi", name: "Mahatma Gandhi", url: "/profile/person/Mahatma_Gandhi"},
    {cat: "scitech", id: "ein", name: "Albert Einstein", url: "/profile/person/Albert_Einstein"},
    {cat: "arts", id: "arch", name: "Architects", url: "/profile/occupation/architect"},
    {cat: "hum", id: "writer", name: "Writers", url: "/profile/occupation/writer"},
    {cat: "hum", id: "linguist", name: "Linguist", url: "/profile/occupation/linguist"},
    {cat: "arts", id: "fdir", name: "Film Directors", url: "/profile/occupation/film-director"},
    {cat: "", id: "nyc", name: "New York City", url: "/profile/place/new-york-city"},
    {cat: "pubfig", id: "aung", name: "Aung San Suu Kyi", url: "/profile/person/Aung_San_Suu_Kyi/"},
    {cat: "inst", id: "mao", name: "Mao Zedong", url: "/profile/person/Mao_Zedong"},
    {cat: "", id: "london", name: "London", url: "/profile/place/london"},
    {cat: "expl", id: "explorers", name: "Explorers", url: "/profile/occupation/explorer"},
    {cat: "", id: "berlin", name: "Berlin", url: "/profile/place/berlin"},
    {cat: "inst", id: "muhammad", name: "Muhammad", url: "/profile/person/Muhammad"},
    {cat: "", id: "tokyo", name: "Tokyo", url: "/profile/place/tokyo"},
    {cat: "arts", id: "evora", name: "Cesária Évora", url: "/profile/person/Cesaria_Evora"},
    {cat: "arts", id: "aish", name: "Aishwarya Rai Bachchan", url: "/profile/person/Aishwarya_Rai_Bachchan"},
    {cat: "biz", id: "mark", name: "Mark Zuckerberg", url: "/profile/person/Mark_Zuckerberg"},
    {cat: "", id: "moscow", name: "Moscow", url: "/profile/place/moscow"},
    {cat: "sports", id: "ron", name: "Ronaldo", url: "/profile/person/Ronaldo"},
    {cat: "hum", id: "budd", name: "Gautama Buddha", url: "/profile/person/Gautama_Buddha"},
    {cat: "scitech", id: "marx", name: "Karl Marx", url: "/profile/person/Karl_Marx"},
    {cat: "arts", id: "jet", name: "Jet Li", url: "/profile/person/Jet_Li"},
    {cat: "", id: "istanbul", name: "Istanbul", url: "/profile/place/istanbul"},
    {cat: "inst", id: "ban", name: "Ban Ki-Moon", url: "/profile/person/Ban_Kimoon"},
    {cat: "inst", id: "gmr", name: "George Maxwell Richards", url: "/profile/person/George_Maxwell_Richards"},
    {cat: "inst", id: "yulia", name: "Yulia Tymoshenko", url: "/profile/person/Yulia_Tymoshenko"},
    {cat: "arts", id: "frida", name: "Frida Kahlo", url: "/profile/person/Frida_Kahlo"}
  ];

  return <div className="profile-grid">
    <h4 className="grid-title">Explore <Link to="/profile/person">People</Link>, <Link to="/profile/place">Places</Link>, <Link to="/profile/occupation">Occupations</Link>, and <Link to="/profile/era">Eras</Link></h4>
    <ul className="grid-row">
      {featured.map(profile =>
        <li className="grid-box" key={profile.id}>
          <a href={profile.url}>
            <div className="grid-box-bg-container">
              <div className="grid-box-bg-img-mask">
                <div className={`grid-box-bg-img ${profile.id} ${profile.cat}`}></div>
              </div>
            </div>
            <h3>{profile.name}</h3>
          </a>
        </li>
      )}
    </ul>
  </div>;
};

export default HomeGrid;
