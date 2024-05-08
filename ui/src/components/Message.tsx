import React, {ReactElement} from "react";
import {styled} from "styled-components";

const colors = {
    success: '#5CBD9D',
    error: '#E74C3C',
    warning: '#F29C33',
    info: '#3998DB',
};

const MessageBox = styled.p<MessageProps>`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${(props) => colors[props.status]};
  border-radius: 0.25rem;
  color: #333;
  gap: 0.5rem;
  line-height: 1.5;
  width: 800px;
  max-width: 100%;
  border-left: 5px solid ${(props) => colors[props.status]};

  strong {
    color: ${(props) => colors[props.status]};
  }
`;


export interface MessageProps {
    status: 'success' | 'info' | 'warning' | 'error',
    text: ReactElement | null,
}

const Message: React.FC<MessageProps> = ({status, text}) => {
    return text && <MessageBox status={status} text={null}><strong>{status}</strong> {text}</MessageBox>;

};

export default Message;