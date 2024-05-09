import {Helmet} from "react-helmet-async";
import React from "react";


interface OgpProps {
    title?: string,
    url?: string,
    description?: string,
}

export const OGP: React.FC<OgpProps> = ({
                                            title = 'IK.AM',
                                            url = 'https://ik.am',
                                            description = `@making's tech note`
                                        }) =>
    <Helmet prioritizeSeoTags>
        <title>{title}</title>
        <meta property='og:title' content={title}/>
        <meta property='og:url' content={url}/>
        <meta property='og:description' content={description}/>
        <meta name='description' content={description}/>
        <link rel='canonical' href={url}/>
    </Helmet>;