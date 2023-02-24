import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';

const caseAdminAPIInstance = axios.create({
    baseURL: process.env.MANAGEMENT_API_URL ? process.env.MANAGEMENT_API_URL : '',
    httpsAgent: new https.Agent({
        key: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_KEY_PATH ? process.env.MUTUAL_TLS_CLIENT_KEY_PATH : ''),
        cert: fs.readFileSync(process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CLIENT_CERTIFICATE_PATH : ''),
        ca: fs.readFileSync(process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH ? process.env.MUTUAL_TLS_CA_CERTIFICATE_PATH : '')
    })
});

export default caseAdminAPIInstance;
