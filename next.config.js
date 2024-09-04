/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                       key: "Content-Security-Policy",
                       value: process.env.CSP_HEADER_VALUE || "default-src 'self'; frame-ancestors 'none'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:",
                    },
                    {
                      key: "Permissions-Policy",
                      value: process.env.PERMISSIONS_POLICY_HEADER_VALUE || "camera=(), microphone=(), geolocation=()",
                    }
                ]
            }
	]
    }
}

module.exports = nextConfig
