import React from 'react';
import SearchDocs from './search-docs';
import NavGroup, { NavItem } from './navgroup';
import { docs } from '.velite'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarSeparator } from '@/components/ui/sidebar';
import { parseForNav } from './utils';



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
