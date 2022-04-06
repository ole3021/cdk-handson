import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { ConsoleLayer } from '../../lib'

export class ExamplesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new Function(this, 'ExampleCDK', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('lambda'),
      handler: 'hello.handler',
      environment: { 
        MY_ENV: 'the value',
        // AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-extension/internal/exec-wrapper.sh',
        // OTEL_RESOURCE_ATTRIBUTES: 'sls_service_name=aws-node-multi,sls_stage=dev,sls_org_id=xfjKJH8tf8MKQC2S2N',
        // SLS_OTEL_REPORT_LOGS_URL: 'https://core.serverless.com/ingestion/kinesis/v1/logs',
        // SLS_OTEL_REPORT_METRICS_URL: 'https://core.serverless.com/ingestion/kinesis/v1/metrics',
        // SLS_OTEL_REPORT_REQUEST_HEADERS: 'serverless_token=ba0f637c-a3a0-46bf-b2f0-d5b407f425aa',
        // SLS_OTEL_REPORT_TRACES_URL: 'https://core.serverless.com/ingestion/kinesis/v1/traces'
      }
    });

    hello.addLayers(new ConsoleLayer(this, 'myConsoleLayer'));
  }
}

// export class ExamplesStackInit extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);

//     const hello = new Function(this, 'ExampleCDK', {
//       runtime: Runtime.NODEJS_14_X,
//       code: Code.fromAsset('lambda'),
//       handler: 'hello.handler',
//     });

//     hello.addLayers(new ConsoleLayer(this, 'myConsoleLayer', {
//       secretToken: 'token_of_user_console_account',
//       service: 'my_aws_cdk_demo', // default to AWS function name.
//       stage: 'dev', // default to dev.
//       version: '1', // default to 1
//     }));
//   }
// }

export class ExamplesStackInit extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const slsConsole = new ConsoleLayer(this, 'myConsoleLayer', {
      secretToken: 'token_of_user_console_account',
      service: 'my_aws_cdk_demo', // default to AWS function name.
      stage: 'dev', // default to dev.
      version: '1', // default to 1
    })

    const hello = new Function(this, 'ExampleCDK', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('lambda'),
      handler: 'hello.handler',
      layers: [slsConsole]
    });
  }