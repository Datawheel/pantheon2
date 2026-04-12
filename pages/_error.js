function ErrorPage({statusCode}) {
  const title =
    statusCode === 404
      ? "Page Not Found"
      : "Application Error";

  return (
    <main style={{padding: "40px", fontFamily: "Arial, sans-serif"}}>
      <h1>{statusCode || 500}</h1>
      <p>{title}</p>
    </main>
  );
}

ErrorPage.getInitialProps = ({res, err}) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return {statusCode};
};

export default ErrorPage;
