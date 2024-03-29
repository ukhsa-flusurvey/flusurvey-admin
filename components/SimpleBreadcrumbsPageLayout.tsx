import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface SimpleBreadcrumbsPageLayoutProps {
    children: React.ReactNode;
    links: Array<{
        title: string | React.ReactNode;
        href?: string;
    }>
}

const SimpleBreadcrumbsPageLayout: React.FC<SimpleBreadcrumbsPageLayoutProps> = (props) => {
    return (
        <div className="px-6 h-full">
            <div className="pt-3 flex gap-8">
                <Breadcrumbs
                    links={props.links}
                />
            </div>
            <main className="py-6 h-full">
                {props.children}
            </main>
        </div>
    );
};

export default SimpleBreadcrumbsPageLayout;
