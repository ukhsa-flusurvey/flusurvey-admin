import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getCASEManagementAPIURL, getTokenHeader } from "@/utils/server/api";

export async function GET(request: NextRequest, { params: { segments } }: { params: { segments: string[] } }) {
    console.log(segments.join('/'));
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error("Not authenticated");
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    })

    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.accessToken) },
    });

    const resp = new Response(apiResponse.body, {
        status: apiResponse.status,
        headers: { 'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json' }
    });

    return resp;

}

export async function POST(request: NextRequest, { params: { segments } }: { params: { segments: string[] } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error("Not authenticated");
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    const body = await request.json();

    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.accessToken) },
        method: 'POST',
        body: JSON.stringify(body),
    });

    const resp = new Response(apiResponse.body, {
        status: apiResponse.status,
        headers: { 'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json' }
    });

    return resp;
}

export async function DELETE(request: NextRequest, { params: { segments } }: { params: { segments: string[] } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error("Not authenticated");
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.accessToken) },
        method: 'DELETE',
    });

    const resp = new Response(apiResponse.body, {
        status: apiResponse.status,
        headers: { 'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json' }
    });

    return resp;
}
