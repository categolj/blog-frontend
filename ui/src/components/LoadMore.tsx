import React from "react";
import {Entry} from "../clients/entry";
import styled from 'styled-components';

interface LoadMoreProps {
    data: Entry[][] | undefined,
    limit: number,
    size: number,
    setSize: (size: number) => void;
    isPreLoaded?: boolean;
}

const Button = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.35rem;
  transition: background-color 0.3s;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 400px;

  &:hover {
    background-color: #333;
  }

  &:focus {
    outline: none;
  }
`;
const LoadMore: React.FC<LoadMoreProps> = ({data, limit, size, setSize, isPreLoaded}) => {
    if (!isPreLoaded && (!data || data[data.length - 1].length < limit)) return null;
    return <Button onClick={() => setSize(size + 1)}>Load More</Button>;
};

export default LoadMore;