import React from 'react';
import SearchDocs from './search-docs';
import NavGroup, { NavGroupDef, NavItem, NavItemDef } from './navgroup';
import { docs } from '.velite'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarSeparator } from '@/components/ui/sidebar';


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

export const getCategoryPathBySlug = (slug: string): string[] => {
    const parts = slug.split('/');
    if (parts.length < 2) {
        return [];
    }

    const category = parts[0];
    const subcategory = parts.length > 2 ? parts[1] : '';

    const path: string[] = [];
    const categoryTitle = categoriesWithSubcategories[category]?.title;
    if (categoryTitle) {
        path.push(categoryTitle);
    }
    const subcategoryTitle = categoriesWithSubcategories[category]?.items?.[subcategory]?.title;
    if (subcategoryTitle) {
        path.push(subcategoryTitle);
    }

    return path;
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

const parseForNav = (docs: Array<any>): { items: Array<NavItemDef>, navGroups: Array<NavGroupDef> } => {
    const navItems: Array<NavItemDef> = [];
    const navGroups: Array<NavGroupDef> = [];

    const rootLevel = docs.filter(doc => doc.category === '').map(doc => {
        return {
            title: doc.title,
            href: rootURL + doc.slugAsParams,
        }
    });

    navItems.push(...rootLevel);

    const categories = Object.keys(categoriesWithSubcategories);
    categories.forEach(category => {
        navGroups.push(generateNavGroupForKey(category));
    })

    return {
        items: navItems,
        navGroups: navGroups
    };
}


const DocSidebar: React.FC = () => {
    const groupedDocs = parseForNav(docs);

    return (
        <Sidebar
            variant='inset'
        >
            <SidebarHeader
                className=' border-b border-border'
            >
                <h1 className='text-lg font-semibold'>CASE Admin Documentation</h1>
                <div className='mb-2'>
                    <SearchDocs />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {groupedDocs.items.map(item => {
                                return <NavItem
                                    key={item.href}
                                    title={item.title}
                                    href={item.href}
                                />
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {
                    groupedDocs.navGroups.map((group, index) => {
                        return <div
                            key={index}
                        >
                            <SidebarSeparator />
                            <NavGroup
                                key={group.title}
                                title={group.title}
                                items={group.items}
                            />
                        </div>
                    })
                }
            </SidebarContent>




        </Sidebar>
    );
};

export default DocSidebar;
