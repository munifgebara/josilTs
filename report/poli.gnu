
plot 'polinomial_best.csv' using 2:4 with points pt 7 ps 2 lc "grey" title 'previsto', \
               '' using 2:3 smooth csplines lt 1 title 'original'

pause 2
reread