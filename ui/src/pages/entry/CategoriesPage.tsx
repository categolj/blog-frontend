import React from 'react'
import useSWR from 'swr';
import Loading from "../../components/Loading.tsx";
import Category from "../../components/Category.tsx";
import {OGP} from "../../components/OGP.tsx";
import { Category as CategoryModel, getCategories } from "../../api/entryApi";

export interface CategoriesProps {
    preLoadedCategories?: CategoryModel[][];
}

const CategoriesPage: React.FC<CategoriesProps> = ({preLoadedCategories}) => {
    const isPreLoaded = !!preLoadedCategories;
    const {data, isLoading} = useSWR(isPreLoaded ? null : 'categories', getCategories);
    const categories = data || preLoadedCategories;
    if (isLoading || !categories) {
        return <Loading/>
    }
    return (<>
        <OGP title={`Categories - IK.AM`} />
        <div id="categories">
            <h2>Categories</h2>
            <ul>
                {categories.map(c => <li key={c.map(x => x.name).join('-')}><Category categories={c}/></li>)}
            </ul>
        </div>
    </>)
}

export default CategoriesPage
