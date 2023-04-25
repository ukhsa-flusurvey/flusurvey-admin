import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    console.error('fetching status for all services is not implemented yet');
    res.status(501).json({ error: 'Not Implemented' });
}
