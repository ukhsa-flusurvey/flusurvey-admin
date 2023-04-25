import caseAdminAPIInstance from "@/utils/server/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import { getSurveysForStudy, saveSurveyForStudy } from "@/utils/server/studyAPI";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { study } = req.query as { study: string };

    const studyKey = study;

    switch (req.method) {
        case 'GET':
            await handleGetStudySurveys(req, res, studyKey, session.accessToken);
            return;
        case 'POST':
            await handleNewStudySurvey(req, res, studyKey, session.accessToken);
            return;
    }
}

const handleGetStudySurveys = async (req: NextApiRequest, res: NextApiResponse, studyKey: string, accessToken: string) => {
    try {
        const response = await getSurveysForStudy(studyKey, accessToken);
        res.status(200).json(response.data);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
}

const handleNewStudySurvey = async (req: NextApiRequest, res: NextApiResponse, studyKey: string, accessToken: string) => {
    const survey = req.body;
    try {
        const response = await saveSurveyForStudy(studyKey, survey, accessToken);
        res.status(200).json(response.data);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
}
