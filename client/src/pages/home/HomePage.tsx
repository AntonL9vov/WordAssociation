import { useEffect } from "react";

export const HomePage = () => {
  useEffect(() => {
    console.log("home page");
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Multiplayer Game</h1>
      <div className="hero-section">
        <div className="hero-content">
          <h2>Join the Adventure</h2>
          <p>
            Connect with friends and compete in exciting multiplayer challenges.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Play Now</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>Real-time Multiplayer</h3>
          <p>Play with friends in real-time with low-latency connections.</p>
        </div>
        <div className="feature">
          <h3>Customizable Characters</h3>
          <p>Create and customize your own unique character.</p>
        </div>
        <div className="feature">
          <h3>Competitive Leaderboards</h3>
          <p>Compete for the top spot on global leaderboards.</p>
        </div>
      </div>
    </div>
  );
};
