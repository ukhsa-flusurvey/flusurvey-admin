import CaseAdminHeader from "@/components/CaseAdminHeader";
import Container from "@/components/Container";
import { Navbar, NavbarBrand } from "@nextui-org/navbar";
import { Card, CardBody } from "@nextui-org/card";
import Image from 'next/image';
import { Link as NextUILink } from '@nextui-org/link'
import { Avatar } from "@nextui-org/avatar";
import clsx from "clsx";
import { BsEnvelopeAt, BsCloudCheck, BsClipboard2Data, BsPersonFillGear, BsJournalMedical } from "react-icons/bs";

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    iconClassName: string;
    icon: React.ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = (props) => {
    return (
        <Card
            as={NextUILink}
            href={props.href}
            isPressable
            radius="sm"
            shadow="sm"
            isHoverable
        >
            <CardBody>
                <div className="flex gap-unit-4">
                    <div>

                        <span className={clsx(
                            "w-14 h-14 block shadow-sm rounded-medium flex items-center justify-center text-center text-3xl",
                            props.iconClassName
                        )}>
                            {props.icon}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold">{props.title}</h3>
                        <p className="text-small text-default-500">{props.description}</p>
                    </div>
                </div>

            </CardBody>

        </Card>
    )
}

export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <main className="h-screen">
            <Navbar isBordered
                maxWidth="xl"
                shouldHideOnScroll

            >
                <NavbarBrand
                    className="flex flex-col items-start border-l-2 border-cyan-800 ps-unit-2"
                >
                    <p className='font-normal text-cyan-800 text-tiny'>CASE ADMIN</p>
                    <p className='font-semibold tracking-wider text-small'>{appName}</p>

                </NavbarBrand>

            </Navbar>
            <div className="relative w-full h-80">
                <Image
                    src="/images/crowd.png"
                    fill
                    objectFit="cover"
                    alt=""
                />
                <Container className="h-full flex items-center justify-start">
                    <Card
                        isBlurred
                        className=" bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                        shadow="sm"
                    >
                        <div className=" p-8 h-full my-auto flex flex-col justify-center">
                            <div>
                                <CaseAdminHeader
                                    appName={appName}
                                />
                                <p className='mt-4'>This is the admin tool, to manage studies, surveys, messages and participants.</p>
                            </div>
                        </div>
                    </Card>
                </Container>
            </div>

            <section>
                <Container className="py-unit-xl">
                    <h2 className="text-2xl font-bold mb-unit-lg">Available Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg">
                        <ToolCard
                            title='Study configurator'
                            description='Graphical user interface to upload and manage configuration files and templates.'
                            href='/tools/admin-v1'
                            iconClassName="bg-gradient-to-b from-sky-400 to-sky-600 text-white"
                            icon={<BsJournalMedical />}
                        />
                        <ToolCard
                            title='Participants'
                            description='Graphical user interface to upload and manage configuration files and templates.'
                            href='/tools/admin-v1'
                            iconClassName="bg-gradient-to-b from-orange-400 to-orange-600 text-white"
                            icon={<BsClipboard2Data />}
                        />
                        <ToolCard
                            title='User management'
                            description='Graphical user interface to upload and manage configuration files and templates.'
                            href='/tools/admin-v1'
                            iconClassName="bg-gradient-to-b from-emerald-400 to-emerald-600 text-white"
                            icon={<BsPersonFillGear />}

                        />
                        <ToolCard
                            title='Messaging'
                            description='Graphical user interface to upload and manage configuration files and templates.'
                            href='/tools/admin-v1'
                            iconClassName="bg-gradient-to-b from-indigo-400 to-indigo-600 text-white"
                            icon={<BsEnvelopeAt />}
                        />
                        <ToolCard
                            title='Service status'
                            description='Graphical user interface to upload and manage configuration files and templates.'
                            href='/tools/admin-v1'
                            iconClassName="bg-gradient-to-b from-neutral-400 to-neutral-600 text-white"
                            icon={<BsCloudCheck />}
                        />
                    </div>
                </Container>
            </section>

            <footer className="bg-content3">
                <Container className="py-unit-xl flex justify-center text-default-600">
                    <span className="me-1">© {(new Date()).getFullYear()},</span>
                    <a href="https://coneno.com" target="blank"> coneno GmbH</a>
                </Container>
            </footer>

            {/*
            
            <div className="h-full bg-primary-50">


                <div className='h-52 bg-content3 -mb-52'>
                </div>

                <Container>
                    <div className="border-t border-white/25"></div>
                </Container>
                <section className="mt-8">
                    <Container className="">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card
                                isBlurred
                                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                                shadow="sm"
                            >
                                <div className=" p-8 h-full my-auto flex flex-col justify-center">
                                    <div>
                                        <CaseAdminHeader
                                            appName={process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools'}
                                        />
                                        <p className='mt-4'>This is the admin tool, to manage studies, surveys, messages and participants.</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="">
                                <CardBody>
                                    <h2 className="text-xl font-bold">Tools</h2>
                                    <div className="flex flex-col gap-4 mt-4">
                                        <ToolCard
                                            title='Admin v1'
                                            description='Graphical user interface to upload and manage configuration files and templates.'
                                            href='/tools/admin-v1'
                                        />
                                        <ToolCard
                                            title='Service Status'
                                            description='Check the status of the services. You can use this to test, if the services are reachable from your network.'
                                            href='/service-status'
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                        </div>
                    </Container>
                </section>
            </div >
    */}
        </main>

    )
}
