import {styled} from "styled-components";

export const SearchInput = styled.input`
  font-size: 1em;
  border: 1px solid var(--fg);
  border-radius: .375rem;
  padding: .25rem .5rem;
  @media (max-width: 800px) {
    width: 100px;
  }
`;