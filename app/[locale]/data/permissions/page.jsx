import "/styles/About.css";

export default async function Page() {
  return (
    <div>
      <h1>Permissions</h1>
      <p>If you use the Pantheon dataset, please cite:</p>
      <input
        type="text"
        value="Yu, A. Z., et al. (2016). Pantheon 1.0, a manually verified dataset of globally famous biographies. Scientific Data 2:150075. doi: 10.1038/sdata.2015.75"
      />
      <a
        className="cc-img"
        href="http://creativecommons.org/licenses/by-sa/4.0/"
      >
        <img
          src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
          alt="Creative Commons"
        />
      </a>
      <p>
        Pantheon by <a href="https://datawheel.us/">Datawheel</a> is licensed
        under a{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">
          Creative Commons Attribution-ShareAlike 4.0 International License
        </a>
        .
      </p>
    </div>
  );
}
