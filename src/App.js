import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";

import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "./screens/styles";
import SignUp from "./screens/SignUp";
import routes from "./screens/routes";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./screens/components/Layout";
import Profile from "./screens/Profile";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <div>
      <ApolloProvider client={client}>
        <HelmetProvider>
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyles />
            <Router>
              <Switch>
                <Route path={routes.home} exact>
                  {isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Login />
                  )}
                </Route>
                <Route path={routes.signUp}>
                  {!isLoggedIn ? <SignUp></SignUp> : null}
                </Route>
                <Route path={`/users/:username`}>
                  <Layout>
                    <Profile />
                  </Layout>
                </Route>
                <Route>
                  <NotFound />
                  {/* <Redirect to="/"></Redirect> */}
                </Route>
              </Switch>
            </Router>
          </ThemeProvider>
        </HelmetProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
