import Navigation from "/components/Navigation";
import Footer from "/components/Footer";
// import Search from "/components/Search";
import "../styles/globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Pantheon</title>
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
