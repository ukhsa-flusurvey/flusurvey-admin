import caseAdminAPIInstance from "@/utils/server/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.error) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    // console.log(session);
    /*const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }*/
    const { study } = req.query as { study: string[] };
    console.log(study)
    // console.log(token.access_token);

    const studyKey = study[0];
    try {
        const response = await caseAdminAPIInstance.get(`/v1/study/${studyKey}/surveys`,
            {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            }
        );
        // console.log(response.data);

    }

    catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }


    res.status(200).json({ name: 'John Doe' })
}
