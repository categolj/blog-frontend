import React from 'react'
import {Category as CategoryModel} from "./types.ts";
import useSWR, {Fetcher} from 'swr';
import Loading from "./components/Loading.tsx";
import Category from "./components/Category.tsx";

export interface CategoriesProps {
    preLoadedCategories: CategoryModel[][];
}

const Categories: React.FC<CategoriesProps> = ({preLoadedCategories}) => {
    const isPreLoaded = !!preLoadedCategories;
    const fetcher: Fetcher<CategoryModel[][], string> = (url) => fetch(url).then(res => res.json());
    const {data, isLoading} = useSWR(isPreLoaded ? null : '/api/categories', fetcher);
    const categories = data || preLoadedCategories;
    if (isLoading || !categories) {
        return <Loading/>
    }
    return (<>
        <div id="categories">
            <h2>Categories</h2>
            <ul>
                {categories.map(c => <li key={c.map(x => x.name).join('-')}><Category categories={c}/></li>)}
            </ul>
        </div>
    </>)
}

export default Categories
