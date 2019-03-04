import React from "react";
import "pages/HomeGrid.css";

const HomeGrid = () => {
  const featured = [
    {cat: "scitech", id: "ada", name: "Ada Lovelace", url: "/profile/person/ada_lovelace"},
    {cat: "arts", id: "dali", name: "Salvador Dali", url: "/profile/person/salvador_dali"},
    {cat: "inst", id: "tut", name: "Tutankhamun", url: "/profile/person/tutankhamun"},
    {cat: "sports", id: "ubolt", name: "Usain Bolt", url: "/profile/person/usain_bolt"},
    {cat: "print", id: "pubfig", name: "Printing Era", url: "/profile/era/printing"},
    {cat: "", id: "bair", name: "Buenos Aires", url: "/profile/place/buenos_aires"},
    {cat: "pubfig", id: "krishna", name: "Krishna", url: "/profile/person/krishna"},
    {cat: "arts", id: "cara", name: "Cara Delevingne", url: "/profile/person/cara_delevingne"},
    {cat: "pubfig", id: "gandhi", name: "Mahatma Gandhi", url: "/profile/person/mahatma_gandhi"},
    {cat: "scitech", id: "ein", name: "Albert Einstein", url: "/profile/person/albert_einstein"},
    {cat: "arts", id: "arch", name: "Architects", url: "/profile/occupation/architect"},
    {cat: "hum", id: "writer", name: "Writers", url: "/profile/occupation/writer"},
    {cat: "hum", id: "linguist", name: "Linguist", url: "/profile/occupation/linguist"},
    {cat: "arts", id: "fdir", name: "Film Directors", url: "/profile/occupation/film_director"},
    {cat: "", id: "nyc", name: "New York City", url: "/profile/place/new_york_city"},
    {cat: "pubfig", id: "aung", name: "Aung San Suu Kyi", url: "/profile/person/aung_san_suu_kyi/"},
    {cat: "inst", id: "mao", name: "Mao Zedong", url: "/profile/person/mao_zedong"},
    {cat: "", id: "london", name: "London", url: "/profile/place/london"},
    {cat: "expl", id: "explorers", name: "Explorers", url: "/profile/occupation/explorer"},
    {cat: "", id: "berlin", name: "Berlin", url: "/profile/place/berlin"},
    {cat: "inst", id: "muhammad", name: "Muhammad", url: "/profile/person/muhammad"},
    {cat: "scitech", id: "hawk", name: "Stephen Hawking", url: "/profile/person/stephen_hawking"},
    {cat: "", id: "tokyo", name: "Tokyo", url: "/profile/place/tokyo"},
    {cat: "arts", id: "evora", name: "Cesária Évora", url: "/profile/person/cesaria_evora"},
    {cat: "arts", id: "aish", name: "Aishwarya Rai Bachchan", url: "/profile/person/aishwarya_rai_bachchan"},
    {cat: "biz", id: "mark", name: "Mark Zuckerberg", url: "/profile/person/mark_zuckerberg"},
    {cat: "", id: "moscow", name: "Moscow", url: "/profile/place/moscow"},
    {cat: "sports", id: "ron", name: "Ronaldo", url: "/profile/person/ronaldo"},
    {cat: "hum", id: "budd", name: "Gautama Buddha", url: "/profile/person/gautama_buddha"},
    {cat: "scitech", id: "marx", name: "Karl Marx", url: "/profile/person/karl_marx"},
    {cat: "arts", id: "jet", name: "Jet Li", url: "/profile/person/jet_li"},
    {cat: "", id: "istanbul", name: "Istanbul", url: "/profile/place/istanbul"},
    {cat: "inst", id: "ban", name: "Ban Ki-Moon", url: "/profile/person/ban_kimoon"},
    {cat: "inst", id: "gmr", name: "George Maxwell Richards", url: "/profile/person/george_maxwell_richards"},
    {cat: "inst", id: "yulia", name: "Yulia Tymoshenko", url: "/profile/person/yulia_tymoshenko"},
    {cat: "arts", id: "frida", name: "Frida Kahlo", url: "/profile/person/frida_kahlo"}
  ];

  return <div className="profile-grid">
    <h4 className="grid-title">Explore People, Places, Occupations, and Eras</h4>
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
