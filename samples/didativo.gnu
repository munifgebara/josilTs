
plot '../report/didatico.csv' using 2:3 with lines title 'real',   '../report/didatico.csv' using 2:4 with lines  title 'previsto'
pause 3





git filter-branch -f \
    --prune-empty \
    --tag-name-filter cat \
    --tree-filter 'rm -rf bkp/*' \
    -- --all
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d
git reflog expire --expire=now --all && git gc --prune=now --aggressive
