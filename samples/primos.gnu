
plot 'primos_best.csv' using 2:3 with lines  title 'real',   'primos_best.csv' using 2:4 with lines  title 'previsto'
pause 5


plot 'polinomial_best.csv' using 2:4 with linespoints, 'polinomial_best.csv' using 2:3 with linespoints
pause 5



plot 'polinomial_best.csv' using 2:4 with points pt 7 ps 2 lc "grey" title 'previsto', \
               '' using 2:3 smooth csplines lt 1 title 'original'

pause 5



plot 'serra_best.csv' using 2:5 with lines  title 'previsto',               'serra_best.csv' using 2:4 with lines  title 'real'

pause 5



plot 'dolar_best.csv' using 1:3 with lines  title 'real',   'dolar_best.csv' using 1:4 with lines  title 'previsto'
pause 5
reread