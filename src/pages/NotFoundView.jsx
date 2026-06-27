import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const REDIRECT_SECONDS = 5;

function NotFoundView({ isAuthenticated }) {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const redirectPath = isAuthenticated ? "/dashboard" : "/login";

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setSecondsLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    };
  }, []);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, REDIRECT_SECONDS * 1000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [navigate, redirectPath]);

  const handleNavigateNow = () => {
    navigate(redirectPath, { replace: true });
  };

  return (
    <section className="not-found-stage">
      <div className="not-found-card">
        <Logo />
        <p className="not-found-code">404</p>
        <h1>Page not found</h1>
        <p className="not-found-text">
          The route you entered does not exist. We will redirect you shortly.
        </p>
        <p className="not-found-countdown">
          Redirecting in <strong>{secondsLeft}</strong> second
          {secondsLeft === 1 ? "" : "s"}.
        </p>

        <button
          type="button"
          className="not-found-btn"
          onClick={handleNavigateNow}
        >
          {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
        </button>
      </div>
    </section>
  );
}

export default NotFoundView;
