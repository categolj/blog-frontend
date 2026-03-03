import React, {lazy, Suspense} from 'react';
import {OGP} from '../../components/OGP.tsx';
import PageHeader from '../../components/PageHeader.tsx';
import Loading from '../../components/Loading.tsx';

const LineDrawingConverter = lazy(() => import('./LineDrawingConverter'))

const LineDrawingPage: React.FC = () => (
    <>
        <OGP title="Line Drawing Converter - Lab - IK.AM"/>
        <PageHeader title="Line Drawing Converter"
                    description="Convert photos to line drawings in your browser using OpenCV.js."/>
        <Suspense fallback={<Loading/>}>
            <LineDrawingConverter/>
        </Suspense>
    </>
)

export default LineDrawingPage
