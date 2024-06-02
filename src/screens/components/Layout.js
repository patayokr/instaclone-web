import styled from "styled-components";
import Header from "./Header";

const Content = styled.main`
  /* margin-top: 45px; */
  max-width: 930px;
  width: 100%;
  margin: 45px auto 0 auto;
`;

function Layout({ children }) {
  return (
    <>
      <Header />
      <Content>{children}</Content>
    </>
  );
}

export default Layout;
