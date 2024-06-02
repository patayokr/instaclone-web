import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  makeVar,
} from "@apollo/client";

const TOKEN = "token";
const DARK_MODE = "darkMode";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const darkModeVar = makeVar(JSON.parse(localStorage.getItem(DARK_MODE)));
export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  window.location.reload(0);
};

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, true);
  darkModeVar(true);
};
export const disableDarkMode = () => {
  localStorage.setItem(DARK_MODE, false);
  darkModeVar(false);
};

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://used-tommi-instaclone-backend-3b5ed87d.koyeb.app/graphql"
      : "http://localhost:4000/graphql",
});

//강좌와 약간 다른부분....
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((context) => ({
    headers: {
      ...context.headers,
      token: localStorage.getItem(TOKEN),
    },
  }));
  return forward(operation);
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  //cache: new InMemoryCache(),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.username}`,
      },
    },
  }), //특정 객체의 특정필드를 고유식별자로 등록해 캐시키로 사용가능하도록 함(기본은 'id')
  connectToDevTools: true,
});
