This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment variables

```
NEXTAUTH_URL=<url-to-your-app>
NEXTAUTH_SECRET=<supersecretvalue>

NEXT_PUBLIC_DEFAULT_LANGUAGE=nl
NEXT_PUBLIC_APP_NAME=<app name>
NEXT_PUBLIC_SUPPORTED_LOCALES=nl,en
INSTANCE_ID=<instance id>
MANAGEMENT_API_URL=<url-to-the-management-api-server>
```

### Git commands

Update upstream branch from reference project

```
git fetch reference-project
git pull reference-project main:upstream
git push origin upstream
```

Rebase local branch onto upstream branch

```
git rebase --onto <new-base-commit> <old-case-commit>
```

Push local upstream branch to reference project main branch

```
git push reference-project upstream:main
```

```
