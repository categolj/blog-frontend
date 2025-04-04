import {Link} from "react-router-dom";
import {Category as CategoryModel} from "../clients/entry";
import React from "react";

interface CategoryProps {
    categories: CategoryModel[],
    className?: string,
}

// Category component without hard-coded colors
const Category: React.FC<CategoryProps> = ({categories, className}) => {
    return (
        <>
            {categories.map((category, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="mx-1">&nbsp;&gt;&nbsp;</span>}
                    <Link
                        to={`/categories/${categories.slice(0, index + 1).map(c => c.name).join(
                            ',')}/entries`}
                        className={className || ''}>
                        {category.name}
                    </Link>
                </React.Fragment>
            ))}
        </>
    );
};

export default Category;