
plot 'polinomial.csv' using 2:4 with points pt 7 ps 2 lc "grey" title 'previsto', \
     'polinomial.csv' using 2:3 smooth csplines lt 1 title 'original', \
     'polinomialCOPY.csv' using 2:4 with points pt 7 ps 2 lc "blue" title 'previsto2', \
     'polinomialCOPY.csv' using 2:3 smooth csplines lt 1 title 'original2', \

pause 1
reread