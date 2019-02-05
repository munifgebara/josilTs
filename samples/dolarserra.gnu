
plot '../report/dollar.csv' using 2:3 with lines  title 'real', '../report/dollar.csv' using 2:4 with lines  title 'previsto',
pause 4
plot '../report/serra.csv' using 2:5 with lines  title 'previsto',               '../report/serra.csv' using 2:4 with lines  title 'real'
pause 4


reread