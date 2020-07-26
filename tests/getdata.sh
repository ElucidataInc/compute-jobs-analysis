IFS=
COMPLETE_DATA=$(cat $1  | grep "status :" |  cut -d':' -f2)
node ./getdata.js $COMPLETE_DATA $1
