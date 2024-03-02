import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ItemListCardWrapperWithAddButtonProps {
    isLoading: boolean;
    children: React.ReactNode;
    title: string;
    description: string;
    addHref: string;
    addLabel: string;
    className?: string;
}

export const ItemListCardWrapperWithAddButton: React.FC<ItemListCardWrapperWithAddButtonProps> = (props) => {
    return (
        <Card
            variant={"opaque"}
            className={props.className}
        >
            <CardHeader>
                <CardTitle>
                    {props.title}
                </CardTitle>
                <CardDescription>
                    {props.description}
                </CardDescription>
            </CardHeader>
            <div className='px-6'>
                {props.children}
            </div>
            <div className='p-6'>
                <Button
                    disabled={props.isLoading}
                    asChild={!props.isLoading}
                >
                    <Link
                        href={props.addHref}>
                        {props.addLabel}
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
