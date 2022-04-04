import * as cdk from 'aws-cdk-lib';
import { IFunction, Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { AttributeType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface HitCountProps {
    downstream: IFunction;
    readCapacity?: number;
}

export class HitCounter extends Construct {

    public readonly handler: Function;
    public readonly table: Table;

    constructor(scope: Construct, id: string, props: HitCountProps){
        if(props.readCapacity !== undefined && (props.readCapacity < 5 || props.readCapacity > 20)) {
            throw new Error('readCapacity must be greater than 5 and less than 20.');
        }

        super(scope, id);

        const table = new Table(this, "Hits", {
            partitionKey: { name: 'path', type: AttributeType.STRING },
            encryption: TableEncryption.AWS_MANAGED,
            readCapacity: props.readCapacity ?? 5
        });
        this.table = table;

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