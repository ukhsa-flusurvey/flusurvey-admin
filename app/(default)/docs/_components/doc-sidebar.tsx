import React from 'react';
import SearchDocs from './search-docs';
import NavGroup, { NavGroupDef, NavItemDef } from './navgroup';
import { docs } from '.velite'


const rootURL = '/docs/';


type CategoriesWithSubcategories = {
    [key: string]: {
        title: string;
        items?: {
            [key: string]: {
                title: string;
            }
        }
    };
}

const categoriesWithSubcategories: CategoriesWithSubcategories = {
    'survey-editor': {
        title: 'Survey editor',
        items: {
            'basics': {
                title: 'Basics',
            },
            'guides': {
                title: 'Guides',
            }
        }
    },
    'study-configurator': {
        title: 'Study configurator',
    }
}



const generateNavGroupForKey = (key: string): NavGroupDef => {
    const items = docs.filter(doc => doc.category === key && doc.subcategory === '').map(doc => {
        return {
            title: doc.title,
            href: rootURL + doc.slugAsParams,
        }
    });
    const subCategories = Object.keys(categoriesWithSubcategories[key]?.items || {});

    const subGroups = subCategories.map(subCategory => {
        const subCatItems = categoriesWithSubcategories[key].items || {};
        const subCatDef = subCatItems[subCategory];

        return {
            title: subCatDef.title,
            items: docs.filter(doc => doc.category === key && doc.subcategory === subCategory).map(doc => {
                return {
                    title: doc.title,
                    href: rootURL + doc.slugAsParams,
                }
            })
        }
    });

    return {
        title: categoriesWithSubcategories[key as keyof typeof categoriesWithSubcategories].title,
        items: [
            ...items,
            ...subGroups,
        ]
    }
}

const parseForNav = (docs: Array<any>): Array<NavGroupDef | NavItemDef> => {
    const navItems: Array<NavGroupDef | NavItemDef> = [];

    const rootLevel = docs.filter(doc => doc.category === '').map(doc => {
        return {
            title: doc.title,
            href: rootURL + doc.slugAsParams,
        }
    });

    navItems.push(...rootLevel);

    const categories = Object.keys(categoriesWithSubcategories);
    categories.forEach(category => {
        navItems.push(generateNavGroupForKey(category));
    })

    return navItems;
}


const DocSidebar: React.FC = () => {
    const groupedDocs = parseForNav(docs);

    console.log(groupedDocs)
    return (
        <aside className="overflow-auto">
            <div className='sticky top-0 bg-secondary backdrop-blur-md py-2 px-3 border-b border-border'>
                <h2 className='text-lg font-semibold mb-4'>CASE Admin Documentation</h2>
                <div className='mb-2'>
                    <SearchDocs />
                </div>
            </div>

            <nav>

                <NavGroup
                    title='docs'
                    level={0}
                    items={groupedDocs}
                />
            </nav>


        </aside>
    );
};

export default DocSidebar;
