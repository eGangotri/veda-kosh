vedakosh.in
https://vedicscripture.com/rigveda


Official Email
vedakosha.in@gmail.com
Pwd: a*h*....108

Pre-Deployment
Run pnpm run build
fix all errors 

Deployment on Vercel

# Code is mirrored @ https://github.com/vedakosha/veda-kosh.git
Steps - 1 Time only

1. git remote add vedakosha_mirror https://github.com/vedakosha/veda-kosh.git
2. git push vedakosha_mirror --mirror

Must add Source repo associated email as collobarator to Mirror-Repo in github.
and then accept the invitation by Soure Repo

# If you dont add a GitHub Actions to Mirror-Repo, then you have to manually push the changes to Mirror-Repo.
each time you push to Source Repo.
git push vedakosha_mirror --mirror

#DB is hosted @ indicj********@gmail.com
#https://cloud.mongodb.com/v2/67b99f587a0e7c0050aebdbf#/clusters

https://veda-kosh-git-master-egangotris-projects.vercel.app/

https://v0-new-project-lwqgdzc8klq.vercel.app/vedas/yajurveda

# to start in local
pnpm run dev