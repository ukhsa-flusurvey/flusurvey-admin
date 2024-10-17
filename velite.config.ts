import { defineConfig, defineCollection, s } from 'velite';
import { stat } from 'fs/promises'
import { defineSchema } from 'velite'
import rehypeSlug from 'rehype-slug';

const computedFields = <T extends { slug: string }>(data: T) => {
    const pathParts = data.slug.split('/').splice(1);
    const category = pathParts.length > 1 ? pathParts[0] : '';
    const subcategory = pathParts.length > 2 ? pathParts[1] : '';
    return {
        ...data,
        slugAsParams: data.slug.split("/").slice(1).join("/"),
        category: category,
        subcategory: subcategory,
    }
};


const timestamp = defineSchema(() =>
    s
        .custom<string | undefined>(i => i === undefined || typeof i === 'string')
        .transform<string>(async (value, { meta, addIssue }) => {
            if (value != null) {
                addIssue({ fatal: false, code: 'custom', message: '`s.timestamp()` schema will resolve the file modified timestamp' })
            }

            const stats = await stat(meta.path)
            return stats.mtime.toISOString()
        })
)

const docs = defineCollection({
    name: 'DocsItem',
    pattern: 'docs/**/*.mdx',
    schema: s
        .object({
            title: s.string().max(99), // Zod primitive type
            slug: s.path(),
            date: timestamp(),
            content: s.mdx(),
            plainContent: s.markdown(),
            toc: s.toc(),
        }).transform(computedFields),
});


export default defineConfig({
    root: 'content',
    output: {
        data: ".velite",
        assets: "public/static/content-assets",
        base: "/static/content-assets/",
        name: "[name]-[hash:6].[ext]",
        clean: true,
    },
    mdx: {
        remarkPlugins: [],
        rehypePlugins: [
            rehypeSlug,
        ],
    },
    collections: {
        docs,
    },
})
