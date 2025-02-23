set timestamp=%DATE:/=-% %TIME::=-%
set timestamp=%timestamp: =%
set timestamp=%timestamp:~0,-3%
set timestamp=%timestamp:~0,3% %timestamp:~3%
set timestamp=%timestamp:_= %
set arg1=%1
set arg1WithoutQuotes=%arg1:"=%
set commit_msg="Optimizations at %timestamp% %arg1WithoutQuotes%"

git status
git add src/*
git add *.json
git add *.ts
git add *.tsx
git add *.md
git add csv/*
git add excels/*
git add wiki/*
git add pnpm-lock.yaml
git add prisma/*
git add push_to_git.bat
git commit -m %commit_msg%
git push origin master
git status