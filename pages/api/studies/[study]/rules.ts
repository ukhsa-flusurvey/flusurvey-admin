import caseAdminAPIInstance from "@/utils/server/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { saveStudyRules } from "@/utils/server/studyAPI";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { study } = req.query as { study: string, survey: string };

    const studyKey = study;
    try {
        const response = await saveStudyRules(studyKey, req.body, session.accessToken)
        res.status(200).json(response.data);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    return;
}
