import React, { useState } from 'react';

const App = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const startGame = (game) => {
    setSelectedGame(game);
  };

  const backToHome = () => {
    setSelectedGame(null);
  };

  // ✅ Dynamically detect environment
  const getBaseUrl = () => {
    const host = window.location.hostname;

    // For Azure AKS (public cloud)
    if (host.includes("cloudapp.azure.com")) {
      return "http://playhive.southindia.cloudapp.azure.com";
    }

    // For local development (Minikube or Docker)
    if (host.includes("gamehub.local") || host.includes("localhost")) {
      return "";
    }

    // Default fallback
    return "";
  };

  // ✅ Map microservice paths correctly
  const getGameUrl = (game) => {
    const baseUrl = getBaseUrl();

    if (game === "2048") return `${baseUrl}/2048/`;
    if (game === "snake") return `${baseUrl}/snake/`;
    return "/";
  };

  const redirectToGame = (game) => {
    window.location.href = getGameUrl(game); // Redirect user
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121212",
        color: "#f8f8f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "#121212",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        {!selectedGame ? (
          <>
            <h1 style={{ marginBottom: "20px" }}>Welcome to the Game Hub!</h1>
            <div>
              <button
                onClick={() => redirectToGame("2048")}
                style={{
                  fontSize: "20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginBottom: "20px",
                  marginRight: "30px",
                }}
              >
                Play 2048
              </button>

              <button
                onClick={() => redirectToGame("snake")}
                style={{
                  fontSize: "20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Play Snake Game
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={backToHome}
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
