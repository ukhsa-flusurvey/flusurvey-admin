import React from 'react';
import SearchDocs from './search-docs';
import NavGroup from './navgroup';


const DocSidebar: React.FC = () => {
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
                    title='Basics'
                    level={0}
                    items={[
                        { title: 'Introduction', href: '/docs/intro' },
                        { title: 'Getting started', href: '/docs/getting-started' },
                        {
                            title: 'Survey editor',
                            items: [
                                { title: 'Test item', href: '/docs/test-item' },
                                { title: 'Test item 2', href: '/docs/test-item-2' },
                                {
                                    title: 'Expressions', items: [
                                        { title: 'Test item 3.1', href: '/docs/test-item-3-1' },
                                        { title: 'Test item 3.2', href: '/docs/test-item-3-2' },
                                        { title: 'Test item 3.3', href: '/docs/test-item-3-3' },
                                    ]
                                },
                            ]
                        },
                        {
                            title: 'Study configurator',
                            items: [
                                { title: 'Test item', href: '/docs/test-item' },
                                { title: 'Test item 2', href: '/docs/test-item-2' },
                                {
                                    title: 'Expressions', items: [
                                        { title: 'Test item 3.1', href: '/docs/test-item-3-1' },
                                        { title: 'Test item 3.2', href: '/docs/test-item-3-2' },
                                        { title: 'Test item 3.3', href: '/docs/test-item-3-3' },
                                    ]
                                },
                            ]
                        }
                    ]} />
            </nav>


        </aside>
    );
};

export default DocSidebar;
