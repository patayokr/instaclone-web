import { useReactiveVar } from "@apollo/client";

import styled from "styled-components";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../../../apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;

const Footer = styled.footer`
  margin-top: 20px;
`;
const DarkModeBtn = styled.button`
  cursor: pointer;
`;

function AuthLayout({ children }) {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
      <Footer></Footer>
      <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
        {darkMode ? "lightMode" : "darkMode"}
      </DarkModeBtn>
    </Container>
  );
}

export default AuthLayout;
