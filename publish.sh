tsc index.ts
zip -r ../try-lambda.zip . -x *.git*
aws lambda update-function-code --profile mymiso --function-name myFunctionMiso --zip-file fileb:///Users/hhyyg/Documents/projects/try-lambda.zip --publish