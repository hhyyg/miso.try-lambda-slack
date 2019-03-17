tsc index.ts
zip -r ../try-lambda.zip .
aws lambda update-function-code --profile mymiso --function-name myFunctionMiso --zip-file fileb:///Users/hhyyg/Documents/projects/try-lambda.zip --publish