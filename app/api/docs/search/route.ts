'use server'

import Fuse, { FuseResultMatch } from 'fuse.js'
import { docs } from ".velite"
import { NextRequest, NextResponse } from 'next/server'


const fuse = new Fuse(docs, {
    keys: ['title', 'plainContent'],
    includeMatches: true,
    threshold: 0.3,
    ignoreLocation: true,
})

export interface SearchResult {
    item: {
        slug: string;
        title: string;
        category: string;
        subcategory: string;
    };
    matches: readonly FuseResultMatch[] | undefined;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({
            results: [
                ...docs.map(doc => {
                    return {
                        item: {
                            slug: doc.slugAsParams,
                            title: doc.title,
                            category: doc.category,
                            subcategory: doc.subcategory,
                        },
                        matches: []
                    }
                })
            ]
        })
    }

    const results = fuse.search(query)

    // Limit the content in the response to reduce payload size
    const limitedResults = results.map(result => ({
        item: {
            slug: result.item.slugAsParams,
            title: result.item.title,
            category: result.item.category,
            subcategory: result.item.subcategory,
        },
        matches: result.matches
    }))

    return NextResponse.json({ results: limitedResults })
}
