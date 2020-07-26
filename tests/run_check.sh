mkdir -p $(pwd)/results/input/
timeNow=$(date +%s)
tmpfile=$(mktemp $(pwd)/results/input/compute-jobs-$1-user-$2-jobs-each-${timeNow}-XXXXXX.log)
for i in $(seq 1 1 $1)
do
	./check.sh $2 $tmpfile $3 &
done
echo "Updates on log $tmpfile"
