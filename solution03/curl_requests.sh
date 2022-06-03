#Adding a message
time curl --location --request POST 'http://localhost:9001/message' \
--header 'Content-Type: application/json' \
--data-raw '{
  "body": "this is a body",
 "destination": "madrid"
}'

echo "\n POST made new record added \n"

# Getting a list of messages
time curl --location --request GET 'http://localhost:9001/messages' \
--header 'Content-Type: application/json' \
--data-raw '{
  "destination": "STRING",
  "body": "STRING"
}'


