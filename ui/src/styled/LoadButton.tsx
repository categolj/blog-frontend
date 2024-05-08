import styled from "styled-components";

export const LoadButton = styled.button`
  background-color: var(--fg);
  color: var(--bg);
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 0.35rem;
  transition: background-color 0.3s;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 600px;
  max-width: 100%;

  &:hover {
    background-color: var(--fg2);
  }

  &:focus {
    outline: none;
  }
`;