import styled from "styled-components";

const SNotification = styled.div`
  margin-top: 15px;
  color: #2ecc71;
`;

function Notification({ line }) {
  return line ? <SNotification>{line}</SNotification> : null;
}

export default Notification;
