import Navigation from "/components/Navigation";
import Footer from "/components/Footer";
import Search from "/components/Search";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
