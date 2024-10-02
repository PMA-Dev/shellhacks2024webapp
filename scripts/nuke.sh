# delete db.json, tmp folder and run bun start listen in the cli folder
rm db.json
rm -rf tmp
cd ../cli
bun start listen