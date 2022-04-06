import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';

export interface ConsoleCdkProps {
  // Define construct properties here
}

/**
 * Serverless Console Layer include the Serverless Runtime 
 */
export class ConsoleLayer extends LayerVersion {
    // arn:aws:lambda:us-east-1:676229676629:layer:sls-console-otel-extension-0-2-9:1

  constructor(scope: Construct, id: string, props: ConsoleCdkProps = {}) {
    super(scope, id, {
      code: Code.fromAsset(path.join(__dirname, '..', 'layer', 'sls-console-otel-extension-0-2-9-76556afb-3ae2-479b-b8e6-d6e331e9eb3f.zip')),
      // code: Code.fromAsset(path.join(__dirname, '..', 'layer')),
      description: 'Serverless Console Layer CDK',
      compatibleRuntimes: [
        Runtime.NODEJS_12_X,
        Runtime.NODEJS_14_X,
      ]
    });

    // CDK output configurations. Will show in AWS Stack console Outputs tab.
    new CfnOutput(this, 'ConsoleURL', {
      value: 'TODO: Replace with real console URL.',
      description: 'Vist the URL to manage your Serverless App.',
      exportName: 'ConsoleURL'
    })
  }
}
