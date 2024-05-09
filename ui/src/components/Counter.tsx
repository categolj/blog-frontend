import React from "react";
import {Fetcher} from 'swr';
import useSWRImmutable from "swr/immutable";

interface CounterProps {
    entryId: string;
}

interface Counter {
    counter: number;
}

const Counter: React.FC<CounterProps> = ({entryId}) => {
    const fetcher: Fetcher<Counter, string> = (entryId) =>
        fetch(`/api/counter`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({entryId: Number(entryId)})
        }).then(res => res.json());
    const {data, error} = useSWRImmutable<Counter>(entryId, fetcher);
    return <>{(data && !error) ? data.counter : 'N/A'} Views</>;

};

export default Counter;