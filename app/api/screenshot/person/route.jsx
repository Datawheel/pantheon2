import { ImageResponse } from "next/og";
import { COLORS_DOMAIN } from "../../../../components/utils/consts";
import { NextResponse } from "next/server";

export const runtime = "edge";

async function fetchPersonImage(id) {
  try {
    const response = await fetch(
      `https://pantheon.world/images/profile/people/${id}.jpg`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageData = await response.arrayBuffer();

    if (imageData.byteLength === 0) {
      // The image data is empty
      console.log("The image file is empty.");
      return null; // or handle as appropriate
    } else {
      // The image data is not empty, proceed with your logic
      return imageData;
    }
  } catch (error) {
    console.error("Fetching image failed:", error);
    return null; // or handle the error as appropriate
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const MarcellusfontData = await fetch(
    new URL("../../../../public/fonts/Marcellus-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const AmikofontData = await fetch(
    new URL("../../../../public/fonts/Amiko-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const res = await fetch(
    `https://api.pantheon.world/person?id=eq.${id}&select=name,occupation(occupation,domain_slug),birthyear,deathyear`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.pgrst.object+json",
      },
    }
  );
  const person = await res.json();
  const { name, occupation, birthyear, deathyear } = person;

  if (!name) {
    return new NextResponse("ID mismatch", { status: 404 });
  }
  const backgroundColor = COLORS_DOMAIN[occupation.domain_slug];

  // const personImageData = await fetch(
  //   new URL(
  //     `../../../public/images/profile/people/${id}.jpg`,
  //     import.meta.url
  //   )
  // ).then((res) => res.arrayBuffer());
  // console.log("personImageData", personImageData);

  let hasImage = false;
  let imageD;
  await fetchPersonImage(id).then((imageData) => {
    if (imageData) {
      imageD = imageData;
      hasImage = true;
    } else {
      hasImage = false;
    }
  });

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: backgroundColor,
          display: "flex",
          flexDirection: "column",
          fontFamily: "Amiko,Helvetica,Arial,sans-serif",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <header style={{ position: "absolute" }}>
          <div
            style={{
              display: "flex",
              background: backgroundColor,
              alignItems: "stretch",
              height: "100vh",
              filter: "blur(6px) saturate(110%) contrast(200%)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "50%",
                border: "solid 2px green",
                transform: "scale(1.1, 1.1)",
              }}
            >
              {hasImage ? (
                <img
                  // src={`https://pantheon.world/images/profile/people/${id}.jpg`}
                  src={imageD}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                width: "50%",
                transform: "scale(-1.1, 1.1)",
              }}
            >
              {hasImage ? (
                <img
                  // src={`https://pantheon.world/images/profile/people/${id}.jpg`}
                  src={imageD}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </div>
            <div
              style={{
                background: "rgba(244, 244, 241, 0.7)",
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
              }}
            ></div>
          </div>
        </header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifyItems: "center",
            position: "absolute",
            top: "20px",
          }}
        >
          <img
            alt="Pantheon"
            height={53}
            src="data:image/svg+xml,%3Csvg width='380px' height='53px' viewBox='0 0 380 53' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 40.1 (33804) - http://www.bohemiancoding.com/sketch --%3E%3Ctitle%3EGroup 2%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cg id='Symbols' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='logo' transform='translate(-3.000000, -14.000000)'%3E%3Cg id='Group-2' transform='translate(3.000000, 14.000000)'%3E%3Cpath d='M0.937011719,0.764648438 L16.5698242,0.764648438 C20.0512869,0.764648438 23.4203939,2.30320727 26.6772461,5.38037109 C28.8335069,8.16554127 29.9116211,10.9731304 29.9116211,13.8032227 L29.9116211,15.0161133 C29.9116211,19.0591022 27.609398,22.9448056 23.0048828,26.6733398 C20.399401,28.2006912 17.3335137,28.9643555 13.8071289,28.9643555 L6.15917969,28.9643555 L6.15917969,31.8955078 C6.15917969,43.238338 6.66454573,48.909668 7.67529297,48.909668 C8.86572861,50.3247141 9.78661784,51.0322266 10.4379883,51.0322266 L10.4379883,51.3691406 L0.937011719,51.3691406 L0.633789062,51.0322266 L0.633789062,1.06787109 L0.937011719,0.764648438 Z M6.15917969,3.35888672 L6.15917969,27.1450195 L11.5161133,27.1450195 C17.2886031,27.1450195 21.1181546,24.7866447 23.0048828,20.0698242 C23.521487,18.160635 23.7797852,16.5771547 23.7797852,15.3193359 L23.7797852,13.331543 C23.7797852,9.9174634 21.8369335,7.00880108 17.9511719,4.60546875 C16.0644437,3.77440991 14.1777438,3.35888672 12.2910156,3.35888672 L6.15917969,3.35888672 Z M61.59375,0.259277344 C61.9531268,0.259277344 64.1205856,5.57123594 68.0961914,16.1953125 L80.7978516,47.3261719 C82.7295018,49.7070432 84.122066,50.8974609 84.9755859,50.8974609 L84.9755859,51.2006836 L71.3305664,51.2006836 L71.3305664,51.0322266 L73.0488281,49.0444336 L73.0488281,47.3261719 C73.0488281,46.023431 71.3979657,41.0708438 68.0961914,32.4682617 C67.916503,31.6372029 67.7031262,31.2216797 67.4560547,31.2216797 L51.3515625,31.2216797 C51.0146468,31.2216797 49.3637844,35.3544509 46.3989258,43.6201172 C45.8823216,44.4062539 45.3208038,46.1020378 44.7143555,48.7075195 C44.8041997,49.5385784 45.1635711,50.313473 45.7924805,51.0322266 L45.4892578,51.3691406 L35.71875,51.3691406 L35.71875,51.0322266 C37.1337961,50.7177719 38.6835853,49.7407309 40.3681641,48.1010742 C41.7382881,46.3266513 44.4223433,40.2959499 48.4204102,30.0087891 C54.4175105,16.0829382 58.3369049,6.16653344 60.1787109,0.259277344 L61.59375,0.259277344 Z M52.5981445,28.4589844 L52.5981445,28.59375 L66.3779297,28.59375 L66.3779297,28.4589844 C66.2880855,27.7851529 64.1206267,21.8442943 59.8754883,10.6362305 C59.6733388,10.6362305 57.2475818,16.577089 52.5981445,28.4589844 L52.5981445,28.4589844 Z M128.921387,1.23632812 L135.423828,1.23632812 L135.727051,1.53955078 C133.705556,3.13428532 132.694824,5.04344591 132.694824,7.26708984 C132.290525,8.50244758 132.088379,9.86132071 132.088379,11.34375 L132.088379,52.2451172 L131.818848,52.5483398 L131.515625,52.5483398 L96.4765625,12.3881836 L96.1733398,12.3881836 L96.1733398,42.7441406 C96.7573271,47.0566622 97.4086878,49.2128906 98.1274414,49.2128906 C98.1274414,49.4824232 98.8349539,50.1337839 100.25,51.1669922 L100.115234,51.3354492 L93.0063477,51.3354492 L92.703125,51.0322266 L92.703125,1.67431641 L93.0063477,1.37109375 L94.8256836,1.37109375 L128.314941,40.621582 L128.618164,40.621582 L128.618164,1.53955078 L128.921387,1.23632812 Z M143.589355,0.899414062 L184.89502,0.899414062 L185.198242,1.20263672 L185.198242,9.12011719 L184.89502,9.12011719 C184.176266,7.12108375 182.907236,5.64990706 181.087891,4.70654297 C178.30272,4.10009462 175.708508,3.796875 173.305176,3.796875 L165.690918,3.796875 L165.690918,34.2875977 C165.690918,43.8335438 166.196284,48.6064453 167.207031,48.6064453 C167.207031,49.0556663 168.12792,49.864252 169.969727,51.0322266 L169.969727,51.2006836 L160.367676,51.2006836 L160.064453,50.8637695 L160.064453,3.93164062 L154.101074,3.93164062 C148.800266,3.93164062 145.599615,4.79637807 144.499023,6.52587891 C143.892575,8.05323029 143.589355,9.01904095 143.589355,9.42333984 L143.589355,9.7265625 L143.286133,9.7265625 L143.286133,1.20263672 L143.589355,0.899414062 Z M230.424316,1.00048828 L230.559082,1.13525391 L230.559082,1.43847656 C228.245594,2.539068 227.088867,6.58199632 227.088867,13.5673828 L227.088867,26.1005859 C227.088867,40.9248788 227.538081,48.3369141 228.436523,48.3369141 C228.526368,48.8984403 229.436027,49.8080992 231.165527,51.065918 L230.862305,51.3691406 L222.102539,51.3691406 L221.799316,51.065918 L221.799316,26.5722656 L196.833984,26.5722656 C196.833984,39.8692071 197.283199,47.2250906 198.181641,48.6401367 C198.922855,49.4936566 199.832514,50.3022423 200.910645,51.065918 L200.607422,51.3691406 L191.982422,51.3691406 L191.679199,51.065918 L191.679199,1.43847656 L191.982422,1.13525391 L200.135742,1.13525391 L200.438965,1.43847656 C198.529776,2.8984448 197.575195,4.41454292 197.575195,5.98681641 C197.081052,5.98681641 196.833984,10.8832518 196.833984,20.6762695 L196.833984,23.6748047 L221.630859,23.6748047 L221.630859,1.43847656 L221.934082,1.13525391 L230.121094,1.13525391 L230.255859,1.00048828 L230.424316,1.00048828 Z M238.522461,1.1015625 L263.353027,1.1015625 L263.65625,1.40478516 L263.65625,8.109375 L263.353027,8.41259766 C261.893059,6.30125897 260.826175,5.18945369 260.152344,5.07714844 C258.310538,4.1562454 255.929702,3.69580078 253.009766,3.69580078 L243.710938,3.69580078 L243.710938,24.0791016 L260.624023,24.0791016 L260.927246,24.4160156 L260.927246,29.8740234 L260.624023,30.1772461 C260.624023,29.3686483 259.354993,28.4589894 256.816895,27.4482422 C254.772939,26.931638 251.673361,26.6733398 247.518066,26.6733398 L243.710938,26.6733398 L243.710938,29.4360352 C243.710938,40.2847222 244.160152,45.7089844 245.058594,45.7089844 C246.47364,47.6406347 249.573218,48.6064453 254.357422,48.6064453 L256.345215,48.6064453 C260.500509,48.6064453 263.701161,47.0341954 265.947266,43.8896484 L268.541504,41.1606445 L268.67627,41.1606445 L269.147949,41.5986328 L269.147949,41.7670898 C269.147949,42.1938498 267.373553,45.3383496 263.824707,51.2006836 L238.522461,51.2006836 L238.219238,50.8637695 L238.219238,1.40478516 L238.522461,1.1015625 Z M299.617188,1.1015625 L302.278809,1.1015625 C307.849149,1.1015625 313.060034,3.07810523 317.911621,7.03125 C323.055201,12.1748304 325.626953,18.1269193 325.626953,24.8876953 L325.626953,27.4145508 C325.626953,33.9282552 322.853055,39.8803441 317.305176,45.2709961 C312.341284,49.2241409 307.242702,51.2006836 302.009277,51.2006836 L299.313965,51.2006836 C293.766086,51.2006836 288.263211,48.7187748 282.805176,43.7548828 C278.155738,38.3642309 275.831055,32.917508 275.831055,27.4145508 L275.831055,25.0224609 C275.831055,18.3290681 278.953094,12.1411417 285.197266,6.45849609 C290.026391,2.88718917 294.832984,1.1015625 299.617188,1.1015625 L299.617188,1.1015625 Z M282.063965,23.7084961 L282.063965,25.4941406 C282.063965,31.3340136 284.152811,36.9828829 288.330566,42.440918 C292.059101,46.2817575 295.922343,48.2021484 299.92041,48.2021484 L301.706055,48.2021484 C308.040071,48.2021484 313.194804,45.2373343 317.17041,39.3076172 C318.944833,36.0058429 319.832031,32.6367359 319.832031,29.2001953 L319.832031,27.2797852 C319.832031,18.2504431 316.608919,11.3550043 310.162598,6.59326172 C307.107895,4.90868298 304.188002,4.06640625 301.402832,4.06640625 L299.92041,4.06640625 C295.113745,4.06640625 290.84621,5.99802756 287.117676,9.86132812 C283.748518,14.0390834 282.063965,18.6547599 282.063965,23.7084961 L282.063965,23.7084961 Z M372.402832,1.23632812 L378.905273,1.23632812 L379.208496,1.53955078 C377.187002,3.13428532 376.17627,5.04344591 376.17627,7.26708984 C375.771971,8.50244758 375.569824,9.86132071 375.569824,11.34375 L375.569824,52.2451172 L375.300293,52.5483398 L374.99707,52.5483398 L339.958008,12.3881836 L339.654785,12.3881836 L339.654785,42.7441406 C340.238772,47.0566622 340.890133,49.2128906 341.608887,49.2128906 C341.608887,49.4824232 342.316399,50.1337839 343.731445,51.1669922 L343.59668,51.3354492 L336.487793,51.3354492 L336.18457,51.0322266 L336.18457,1.67431641 L336.487793,1.37109375 L338.307129,1.37109375 L371.796387,40.621582 L372.099609,40.621582 L372.099609,1.53955078 L372.402832,1.23632812 Z' id='Pantheon' fill='%23353535'%3E%3C/path%3E%3Cellipse id='Oval' fill='%23363636' transform='translate(300.406250, 26.750000) rotate(-7.000000) translate(-300.406250, -26.750000) ' cx='300.40625' cy='26.75' rx='2.40625' ry='2.75'%3E%3C/ellipse%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
            width={380}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            justifyItems: "center",
            padding: "32px",
            background: "hsla(0,0%,95.7%,.85)",
            border: "1px solid #82817f",
            width: "450px",
          }}
        >
          <h2
            style={{
              color: "#363636",
              fontSize: "1rem",
              fontWeight: "400",
              letterSpacing: ".14rem",
              textTransform: "uppercase",
              margin: "0 auto 10px",
            }}
          >
            {occupation?.occupation}
          </h2>
          <h1
            style={{
              color: "#363636",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".3rem",
              fontSize: "2.4rem",
              margin: "10px 0",
              wordBreak: "break-word",
              hyphens: "auto",
              textAlign: "center",
            }}
          >
            {name}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              marginBottom: "15px",
              color: "#9e978d",
              letterSpacing: ".07rem",
              fontWeight: "400",
              marginTop: "14px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {birthyear < 0 ? `${Math.abs(birthyear)} BC` : birthyear} -{" "}
            {deathyear
              ? deathyear < 0
                ? `${Math.abs(deathyear)} BC`
                : deathyear
              : "Present"}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      debug: false,
      fonts: [
        {
          name: "Marcellus",
          data: MarcellusfontData,
          style: "normal",
        },
        {
          name: "Amiko",
          data: AmikofontData,
          style: "normal",
        },
      ],
    }
  );
}
