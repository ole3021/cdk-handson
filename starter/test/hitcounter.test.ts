import { Template, Capture } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HitCounter } from '../lib/hitcounter';

test('DynamoDB Table Created', () => {
    const stack = new Stack();

    new HitCounter(stack, 'TestHitCounstruct', {
        downstream: new Function(stack, 'TestFunction', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'hello.handler',
            code: Code.fromAsset('lambda')
        })
    })

    const template = Template.fromStack(stack);
    template.resourceCountIs("AWS::DynamoDB::Table", 1);
})

test('Lambda has Environment Variables', () => {
    const stack = new Stack();

    new HitCounter(stack, 'TestHitCounstruct', {
        downstream: new Function(stack, 'TestFunction', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'hello.handler',
            code: Code.fromAsset('lambda')
        })
    });

    const template = Template.fromStack(stack);
    const envCapture = new Capture();
    template.hasResourceProperties("AWS::Lambda::Function", {
        Environment: envCapture,
    });

    expect(envCapture.asObject()).toEqual(
        {
            Variables: {
                DOWNSTREAM_FUNCTION_NAME: {
                    Ref: "TestFunction22AD90FC"
                },
                HITS_TABLE_NAME: {
                    Ref: "TestHitCounstructHits4010127C"
                }
            }
        }
    );
})

test('DynamoDB Table Created With Encryption', () => {
    const stack = new Stack();

    new HitCounter(stack, 'TestHitConstruct', {
        downstream: new Function(stack, 'TestFunction', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'hello.handler',
            code: Code.fromAsset('lambda')
        })
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DynamoDB::Table', {
        SSESpecification: {
            SSEEnabled: true
        }
    });
});

test('read capacity can be configured', () => {
    const stack = new Stack();

    expect(() => {
        new HitCounter(stack, 'TestHitConstruct', {
            downstream: new Function(stack, 'TestFunction', {
                runtime: Runtime.NODEJS_14_X,
                handler: 'hello.handler',
                code: Code.fromAsset('lambda')
            }),
            readCapacity: 3
        })
    }).toThrowError(/readCapacity must be greater than 5 and less than 20./);
})