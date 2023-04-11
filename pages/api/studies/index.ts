import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { getStudies, createStudy } from '@/utils/server/studyAPI';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    switch (req.method) {
        case 'GET':
            await handleGetStudies(req, res, session.accessToken);
            return;
        case 'POST':
            await handleNewStudy(req, res, session.accessToken);
            return;
    }
}

const handleGetStudies = async (req: NextApiRequest, res: NextApiResponse, accessToken: string) => {
    try {
        const response = await getStudies(accessToken);
        res.status(200).json(response.data)
        return

    }
    catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
}

const handleNewStudy = async (req: NextApiRequest, res: NextApiResponse, accessToken: string) => {
    try {
        const response = await createStudy(req.body, accessToken);
        res.status(200).json(response.data)
        return

    }
    catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
}
