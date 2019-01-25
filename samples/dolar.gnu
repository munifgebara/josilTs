
plot '../report/dolar.csv' using 2:3 with lines  title 'real',   '../report/dolar.csv' using 2:4 with lines  title 'previsto'
pause 3



plot '../report/serra.csv' using 2:4 with lines  title 'real',   '../report/serra.csv' using 2:5 with lines  title 'previsto'
pause 3

reread
