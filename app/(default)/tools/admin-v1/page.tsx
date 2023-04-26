import Link from "next/link";

export default async function Page() {
    return (
        <div>
            Admin v1
            <Link href='/tools/admin-v1/messaging'>
                test
            </Link>
        </div>
    )
}
