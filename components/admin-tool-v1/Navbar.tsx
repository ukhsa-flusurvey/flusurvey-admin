import React from 'react';
import Container from '../Container';
import Breadcrumbs from '../Breadcrumbs';

interface NavbarProps {
    links: { href?: string; title: string }[];
}

const Navbar: React.FC<NavbarProps> = (props) => {
    return (
        <div className="bg-[url(/images/colorful-circles.png)] bg-cover bg-center  border-b border-gray-200">
            <div className="backdrop-blur-3xl bg-white/90 h-full">
                <Container>
                    <h2 className="flex items-center py-4">
                        <span className="bg-red-400 rounded-full text-white w-12 h-12 flex text-3xl items-center justify-center me-4">
                            A
                        </span>
                        <span className="text-3xl font-bold">
                            Admin Tool V1
                        </span>
                    </h2>
                    <div className="py-2">
                        <Breadcrumbs
                            links={props.links}
                        />
                    </div>

                </Container>
            </div>
        </div>
    );
};

export default Navbar;
