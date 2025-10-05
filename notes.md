
### setup ###
- package.json
- css & page.tsx
- title

### LAYOUT ###
- page structure with route grouping and page.tsx
- start with sidebar
- lib types
- navitems 
- icons.tsx
- sidebar nav then sidebar item



### DATABASE SETUP ###
- npm i -D prisma
- npm i @prisma/client
- npx prisma init
- vercel and blob 
- @vercel/blob
- better auth
- npm exec prisma migrate dev
- npm exec prisma generate
beat model
- title
- song path
- image
- author
- back to the user who uploaded it
- npm i -D tsx
- seed database:

```
      "start": "next start",
    "lint": "eslint",
    "db:seed": "prisma db seed"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
```

