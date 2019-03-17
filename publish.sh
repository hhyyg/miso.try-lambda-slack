tsc index.ts
zip ../try-lambda.zip index.js
aws lambda update-function-code --profile mymiso --function-name myFunctionMiso --zip-file fileb:///Users/hhyyg/Documents/projects/try-lambda.zip --publish