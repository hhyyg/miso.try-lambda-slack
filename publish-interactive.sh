rm index.js
tsc index-interactive.ts
mv index-interactive.js index.js
zip -r ../try-lambda-interactive.zip . -x *.git*
aws lambda update-function-code --profile mymiso --function-name myFunctionMisoInteractive --zip-file fileb:///Users/hhyyg/Documents/projects/try-lambda-interactive.zip --publish