import {Link} from "react-router-dom";
import {Category as CategoryModel} from "../clients/entry";
import React from "react";

interface CategoryProps {
    categories: CategoryModel[]
}

const Category: React.FC<CategoryProps> = ({categories}) => {
    const categoriesList: string[] = [];
    const links: React.ReactNode[] = [];
    categories.forEach(c => {
        categoriesList.push(c.name);
        const segment = categoriesList.join(',');
        links.push(link(segment, categoriesList));
        links.push(<span key={segment + '-slash'}>{` > `}</span>);
    });
    links.pop();
    return links;
}

function link(segment: string, categories: string[]): React.ReactNode {
    const name = categories[categories.length - 1];
    return <Link key={segment} to={`/categories/${segment}/entries`}>{`${name}`}</Link>;
}

export default Category;