import Breadcrumbs from "@/components/Breadcrumbs";
import AppbarWithProfile from "@/components/navbar/AppbarWithProfile";
import NavbarAuth from "@/components/navbar/NavbarAuth";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import App from "next/app";
import { BsHouse, BsHouseFill, BsJournalMedical } from "react-icons/bs";


export const dynamic = 'force-dynamic';

export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <>

            <div className="pt-unit-sm pb-unit-1 border-b border-b-default bg-content2">
                <AppbarWithProfile
                    toolName='Study Configurator'
                    toolIcon={<div
                        className="w-8 h-8 shadow-sm rounded-small flex items-center justify-center text-center text-lg bg-gradient-to-b from-sky-400 to-sky-600 text-white"
                    >
                        <BsJournalMedical />
                    </div>}
                />
                <div className="px-unit-lg mt-1">
                    <Breadcrumbs
                        links={
                            [
                                {
                                    href: '/tools/study-configurator',
                                    title: <BsHouseFill />
                                },
                                {
                                    href: '/tools',
                                    title: 'Tools'
                                },
                                {
                                    href: '/tools/study-configurator',
                                    title: 'Study Configurator'
                                }
                            ]
                        }
                    />

                </div>

            </div>
            <div className="bg-content3 px-unit-lg py-unit-sm border-b border-b-default shadow-sm">
                Sub-feature specific menu
            </div>
            <main className="px-unit-lg">
                <div className="h-96 bg-content1">
                    page content
                </div>
                <div className="h-96 bg-content3"></div>
                <div className="h-96 bg-content4"></div>
                <div className="h-96 bg-content2"></div>
                <div className="h-96 bg-content3"></div>
            </main>
        </>
    )
}
