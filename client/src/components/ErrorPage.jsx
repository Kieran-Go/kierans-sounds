import { useRouteError, Link } from "react-router-dom";
import { useEffect } from "react";

export default function ErrorPage() {
  const error = useRouteError();

  // Change document title
    useEffect(() => {
      document.title = "Oops - Kieran's Sounds";
    }, []);

  return (
    <>
        <div className="error-page">
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p className="error-message">
              <i>{error.statusText || error.message}</i>
          </p>
        <Link to="/">Back to Home</Link>
        </div>
    </>
  );
}
