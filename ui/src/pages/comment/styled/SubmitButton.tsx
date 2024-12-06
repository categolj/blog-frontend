import styled from "styled-components";

export const SubmitButton = styled.button`
    align-self: flex-end;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;