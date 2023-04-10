import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./types/user";
import * as NotesApi from "./network/notes_api";
import LoginPage from "./pages/LoginPage";
import NotesPage from "./pages/NotesPage";
import NotFoundPage from "./pages/NotFoundPage";
import Signup from "./pages/SignupPage";
import styles from "./styles/App.module.css";
import routes, { renderRoutes } from "./routes";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const fetchLoggedInUser = async () => {
    try {
      const user = await NotesApi.getLoggedInUser();
      setLoggedInUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => setLoggedInUser(null)}
        />
        <Container className={styles.pageContainer}>
          {/* <Routes>
            <Route
              path="/"
              element={<NotesPage loggedInUser={loggedInUser} />}
            />
            <Route
              path="/login"
              element={
                <LoginPage
                  onLoginSuccessful={(user) => {
                    setLoggedInUser(user);
                  }}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <Signup
                  onSignUpSuccessful={(user) => {
                    setLoggedInUser(user);
                  }}
                />
              }
            />

          </Routes> */}

          {renderRoutes(routes)}
        </Container>

        {showSignUpModal && (
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccessful={(user) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }}
          />
        )}

        {showLoginModal && (
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccessful={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
