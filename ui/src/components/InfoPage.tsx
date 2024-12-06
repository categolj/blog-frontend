import React from "react";
// @ts-expect-error TODO
import {JSONToHTMLTable} from '@kevincobain2000/json-to-html-table'
import useSWR from "swr";
import Loading from "./Loading.tsx";

interface InfoModel {
    name: string,
    info: object;
}

const InfoPage: React.FC = () => {
    const fetcher = (url: string) => fetch(url)
        .then(res => res.json());
    const {data, isLoading} = useSWR<InfoModel[]>('/api/info', fetcher);
    if (isLoading || !data) {
        return <Loading/>
    }
    return <>
        <h2>Info</h2>
        <ul>
            {data.map(d => <li key={`${d.name}-li`}><a href={`#${d.name}`}>{d.name}</a></li>)}
        </ul>
        {data.map(d => <>
            <h3 key={`${d.name}-h3`} id={d.name}>{d.name}</h3>
            <JSONToHTMLTable key={`${d.name}-table`} data={d.info}/>
        </>)}
    </>;
};

export default InfoPage;