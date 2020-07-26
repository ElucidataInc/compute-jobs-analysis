for i in $(seq 1 1 $1)
do
	polly jobs submit --workspace-id $3 --job-file $(pwd)/sampleJob.json >> $2
done
