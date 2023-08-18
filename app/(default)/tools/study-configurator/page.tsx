import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { BsHouseFill, BsPlus } from "react-icons/bs";
import { Link as NextUILink } from '@nextui-org/link'
import StudyList from "./_components/StudyList";


export const dynamic = 'force-dynamic';

export default async function Page() {
    return (
        <>
            <main
                className="px-unit-lg"
            >
                <div className="flex justify-center items-center p-unit-lg h-full">
                    <Card
                        fullWidth={false}
                        className="bg-white/50 w-full sm:w-[600px]"
                        isBlurred
                        isFooterBlurred
                    >
                        <CardHeader className="bg-content2">
                            <h2 className="text-2xl font-bold">Studies</h2>
                        </CardHeader>
                        <Divider />
                        <CardBody className="">
                            <StudyList />

                        </CardBody>
                        <Divider />
                        <CardFooter

                        >
                            <Button
                                variant="flat"
                                color="primary"
                                as={NextUILink}
                                href="/tools/study-configurator/new"
                            >
                                <BsPlus />
                                Create new study
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </>
    )
}
