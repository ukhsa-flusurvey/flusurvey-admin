import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserDetails, { UserDetailsSkeleton } from "./_components/UserDetails";
import Permissions, { PermissionsSkeleton } from "./_components/Permissions";
import DeleteUserCard from "./_components/DeleteUserCard";


export default function Page({
    params: {
        userID,
    },
}: {
    params: {
        userID: string;
    };
}) {

    return (
        <div className="space-y-6">
            <div className="flex" >
                <Card
                    variant={"opaque"}
                    className="p-1"
                >
                    <Button
                        variant={"ghost"}
                        asChild
                    >
                        <Link
                            prefetch={false}
                            href={`/tools/user-management/management-users`}
                        >
                            <ArrowLeft className="size-5 me-1" />
                            Back
                        </Link>
                    </Button>
                </Card>
            </div>

            <Suspense
                fallback={<UserDetailsSkeleton />}
            >
                <UserDetails
                    userId={userID}
                />
            </Suspense>

            <Suspense
                fallback={<PermissionsSkeleton />}
            >
                <Permissions
                    userId={userID}
                />
            </Suspense>

            <DeleteUserCard userId={userID} />
        </div>
    );
}
