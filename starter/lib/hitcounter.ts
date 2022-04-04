import * as cdk from 'aws-cdk-lib';
import { IFunction, Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface HitCountProps {
    downstream: IFunction
}

export class HitCounter extends Construct {

    public readonly handler: Function;

    constructor(scope: Construct, id: string, props: HitCountProps){
        super(scope, id);

        const table = new Table(this, "Hits", {
            partitionKey: { name: 'path', type: AttributeType.STRING }
        });

        this.handler = new Function(this, 'HitCounterHandler', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'hitcounter.handler',
            code: Code.fromAsset('lambda'),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName
            }
        });

        table.grantReadWriteData(this.handler);

        props.downstream.grantInvoke(this.handler);
    }
}