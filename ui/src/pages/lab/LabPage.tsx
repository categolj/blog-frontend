import React from 'react';
import {Link} from 'react-router-dom';
import {OGP} from '../../components/OGP.tsx';
import PageHeader from '../../components/PageHeader.tsx';
import Card from '../../components/Card.tsx';

interface LabTool {
    title: string;
    description: string;
    path: string;
}

const tools: LabTool[] = [
    {
        title: 'MOV to GIF Converter',
        description: 'Convert video files to GIF animations entirely in your browser using FFmpeg WebAssembly.',
        path: '/lab/mov-to-gif',
    },
];

const accentColor = '#F4E878';

const LabPage: React.FC = () => {
    return (
        <>
            <OGP title="Lab - IK.AM"/>
            <PageHeader title="Lab"
                        description="Experimental tools and utilities."/>
            <div className="space-y-4">
                {tools.map(tool => (
                    <Card key={tool.path}
                          accentColor={accentColor}
                          isHighlighted={true}>
                        <Link to={tool.path}
                              className="block mb-2 font-medium text-base hover:underline">
                            {tool.title}
                        </Link>
                        <p className="text-sm text-fg2/80 mb-0">{tool.description}</p>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default LabPage
