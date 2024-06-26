import React from 'react'
import {Category as CategoryModel, CategoryService} from "../../clients/entry";
import useSWR, {Fetcher} from 'swr';
import Loading from "../../components/Loading.tsx";
import Category from "../../components/Category.tsx";
import {OGP} from "../../components/OGP.tsx";

export interface CategoriesProps {
    preLoadedCategories?: CategoryModel[][];
}

const CategoriesPage: React.FC<CategoriesProps> = ({preLoadedCategories}) => {
    const isPreLoaded = !!preLoadedCategories;
    const fetcher: Fetcher<CategoryModel[][], string> = () => CategoryService.categories();
    const {data, isLoading} = useSWR(isPreLoaded ? null : '/api/categories', fetcher);
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
