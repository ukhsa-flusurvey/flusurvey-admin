import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface ItemListCardWrapperWithAddButtonProps {
    isLoading: boolean;
    children: React.ReactNode;
    title: string;
    description: string;
    addHref: string;
    addLabel: string;
    className?: string;
    contentClassName?: string;
    hideAddButton?: boolean;
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

            <CardContent className={props.contentClassName}>
                {props.children}
            </CardContent>

            {!props.hideAddButton && (
                <CardFooter>
                    <Button
                        disabled={props.isLoading}
                        asChild={!props.isLoading}
                    >
                        <Link
                            href={props.addHref}>
                            {props.addLabel}
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
