import React, {lazy, Suspense} from 'react';
import {OGP} from '../../components/OGP.tsx';
import PageHeader from '../../components/PageHeader.tsx';
import Loading from '../../components/Loading.tsx';

const MovToGifConverter = lazy(() => import('./MovToGifConverter'))

const MovToGifPage: React.FC = () => (
    <>
        <OGP title="MOV to GIF Converter - Lab - IK.AM"/>
        <PageHeader title="MOV to GIF Converter"
                    description="Convert video files to GIF animations entirely in your browser."/>
        <Suspense fallback={<Loading/>}>
            <MovToGifConverter/>
        </Suspense>
    </>
)

export default MovToGifPage
