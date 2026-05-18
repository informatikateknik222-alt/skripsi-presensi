@echo off
git config user.name "informatikateknik222-alt"
git config user.email "informatikateknik222-alt@github.com"
git add .
git commit -m "Update: Refactor arsitektur menjadi Enterprise Monorepo (apps/web & apps/api)"
git branch -M main
git remote add origin https://github.com/informatikateknik222-alt/skripsi-presensi.git
git push -u origin main
