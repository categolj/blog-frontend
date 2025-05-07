import React, { useState } from 'react'
import useSWR from 'swr';
import Loading from "../../components/Loading.tsx";
import Category from "../../components/Category.tsx";
import {OGP} from "../../components/OGP.tsx";
import { FolderIcon, ChevronDownIcon, ChevronRightIcon } from "../../components/icons"; 
import { Category as CategoryModel, getCategories } from "../../api/entryApi";
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';

export interface CategoriesProps {
    preLoadedCategories?: CategoryModel[][];
}

const CategoriesPage: React.FC<CategoriesProps> = ({preLoadedCategories}) => {
    const isPreLoaded = !!preLoadedCategories;
    const {data, isLoading} = useSWR(isPreLoaded ? null : 'categories', getCategories);
    const categories = data || preLoadedCategories;
    
    // State to track collapsed categories
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    
    // Toggle collapsed state for a category group
    const toggleCollapse = (groupName: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };
    
    if (isLoading || !categories) {
        return <Loading/>
    }
    
    // Group categories by their first element for better organization
    const groupedCategories: Record<string, CategoryModel[][]> = {};
    categories.forEach(categoryChain => {
        if (categoryChain.length > 0) {
            const firstCategory = categoryChain[0].name;
            if (!groupedCategories[firstCategory]) {
                groupedCategories[firstCategory] = [];
            }
            groupedCategories[firstCategory].push(categoryChain);
        }
    });

    return (<>
        <OGP title={`Categories - IK.AM`} />
        <div id="categories" className="mx-auto">
            <PageHeader title="Categories" />

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(groupedCategories).map(([groupName, categoryChains]) => (
                    <Card key={groupName} className="p-0 overflow-hidden">
                        <div 
                            className="bg-fg2 text-bg px-4 py-2 font-bold flex items-center justify-between cursor-pointer"
                            onClick={() => toggleCollapse(groupName)}
                        >
                            <div className="flex items-center">
                                <FolderIcon className="h-5 w-5 mr-2" />
                                {groupName}
                            </div>
                            {collapsedGroups[groupName] ? 
                                <ChevronRightIcon className="h-5 w-5" /> : 
                                <ChevronDownIcon className="h-5 w-5" />
                            }
                        </div>
                        {!collapsedGroups[groupName] && (
                            <ul className="p-4">
                                {categoryChains.map(chain => (
                                    <li key={chain.map(x => x.name).join('-')} 
                                        className="py-2 hover:bg-(color:--bg) transition-colors rounded-sm px-2">
                                        <div className="flex items-center">
                                            <Category 
                                                categories={chain} 
                                                className="hover:text-(color:--accent) transition-colors"
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    </>)
}

export default CategoriesPage
