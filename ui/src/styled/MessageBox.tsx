import {styled} from "styled-components";

const colors = {
    success: '#5CBD9D',
    error: '#E74C3C',
    warning: '#F29C33',
    info: '#3998DB',
};
export type MessageStatus = 'success' | 'info' | 'warning' | 'error';
export const MessageBox = styled.p<{ status: MessageStatus }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${(props) => colors[props.status]};
  border-radius: 0.25rem;
  color: var(--fg2);
  gap: 0.5rem;
  line-height: 1.5;
  width: 800px;
  max-width: 100%;
  border-left: 5px solid ${(props) => colors[props.status]};

  strong {
    color: ${(props) => colors[props.status]};
  }
`;