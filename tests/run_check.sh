mkdir -p $(pwd)/results/input/
timeNow=$(date +%s)
tmpfile=$(mktemp $(pwd)/results/input/compute-jobs-$1-user-$2-jobs-each-${timeNow}-XXXXXX.log)
for i in $(seq 1 1 $1)
do
	./check.sh $2 $tmpfile $3 &
done

COMPLETE_DATA=$(cat $tmpfile  | grep "status :" | wc -l)
while [ $COMPLETE_DATA -ne "$(($1 * $2))" ]; do
	sleep 5
	COMPLETE_DATA=$(cat $tmpfile  | grep "status :" | wc -l)
	echo "Spawning tasks"
done
echo "Updates on log $tmpfile"
export TEMP_POLLY_JOB_FILE=$tmpfile
