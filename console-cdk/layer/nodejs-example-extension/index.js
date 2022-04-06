#!/usr/bin/env node
const { register, next } = require('./extensions-api');

const EventType = {
    INVOKE: 'INVOKE',
    SHUTDOWN: 'SHUTDOWN',
};

function handleShutdown(event) {
    console.log('shutdown', { event });
    process.exit(0);
}

function handleInvoke(event) {
    console.log('invoke');
}

(async function main() {
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    console.log('node.version', process.node && process.node.version);
    console.log('lambda name', process.env.AWS_LAMBDA_FUNCTION_NAME);
    console.log('lambda version', process.env.AWS_LAMBDA_FUNCTION_VERSION);

    process.env.testManual = 'newValue';
    process.env.MY_VALUE = 'Test';

    console.log('hello from extension', process);



    /**
process {
  version: 'v14.19.1',
  versions: {
    node: '14.19.1',
    v8: '8.4.371.23-node.85',
    uv: '1.42.0',
    zlib: '1.2.11',
    brotli: '1.0.9',
    ares: '1.18.1',
    modules: '83',
    nghttp2: '1.42.0',
    napi: '8',
    llhttp: '2.1.4',
    openssl: '1.1.1n',
    cldr: '39.0',
    icu: '69.1',
    tz: '2021a',
    unicode: '13.0'
  },
  arch: 'x64',
  platform: 'linux',
  domain: null,
  env: {
    AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
    AWS_SESSION_TOKEN: 'IQoJb3JpZ2luX2VjEPX//////////wEaCXVzLWVhc3QtMSJIMEYCIQDb5S/1UJ52egx/fSqDQ3ROi8dVOTpNKoYZNRB/vyvOpQIhAJVrrU6gC1UKazVJFUYPwpz2Dafm+l3373zrS0Mx9Fi1KrsCCI3//////////wEQAhoMNjc2MjI5Njc2NjI5IgyS+1i2yW4/wajeVn4qjwLCDo8hVcIBdfkkD74FIpos1MN86rkWLwO4zTk6mSO4dvDY8JjEHTeXdBNlndNALj9I0DJ/eWcAZ45i0mJYTkDlzZlQlhpBvY8Kd7yGsMU4w7+SFn3qnQDmvUPqGzZgeDDEJNO0d3cZD5XN0CQp9sOsk8vGZuxrgSm8dJmH+Sd88AHAuqkwrR2UClOi0suVRgZbCCvU//FWe/cO+5m250N871/em1Fx7rqPcYIv6PtRyFzDADnm4S8m9F72Xictc2EAEyQDMIb7Ivdk1zbWJ6cJAgm0RRCFpkEeDpoh6hwCY4Nxf7qMQDzebB1fkbRqqFEO+gOUat1dQh1mt5xN67t/vcgDhlbAQX2i8CvBLpjcMMfosJIGOpkBnJ1QHSFEc0xAyQg35oEEv7LAyx06pBSh/dyiRrS2u9jTxgxNi+hJyu0jBcLzHHk5OOkQ4kULalcfI4bfuojIYgygvVGmvNSKGEVSX7Sx15LLtPBPZcz1itD5ezgskA/oSiTuHJqz4gfEn8bZsDTmQSHS8RA1av57m23WpNknblhH8uyTuouTxD8te3GuwKpgIasrf0I7TIeF',
    LD_LIBRARY_PATH: '/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib',
    AWS_LAMBDA_RUNTIME_API: '127.0.0.1:9001',
    AWS_LAMBDA_FUNCTION_NAME: 'ExamplesStack-ExampleCDK832B0E69-uWT74hFVfpMV',
    PATH: '/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin',
    AWS_DEFAULT_REGION: 'us-east-1',
    PWD: '/',
    AWS_SECRET_ACCESS_KEY: 'dZPnswfw2ggxCYc1SIRKrmZ4EgSvRCzn2S1VGgS3',
    LANG: 'en_US.UTF-8',
    AWS_LAMBDA_INITIALIZATION_TYPE: 'on-demand',
    TZ: ':UTC',
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY_ID: 'ASIAZ24TN7ZKV7K5KRS7',
    SHLVL: '0',
    testManual: 'testValue',
    AWS_LAMBDA_FUNCTION_MEMORY_SIZE: '128'
  },
  title: 'node',
  argv: [ '/var/lang/bin/node', '/opt/nodejs-example-extension/index.js' ],
  execArgv: [],
  pid: 9,
  ppid: 1,
  execPath: '/var/lang/bin/node',
  debugPort: 9229,
  argv0: 'node',
}
     */

    console.log('register');
    const extensionId = await register();
    console.log('extensionId', extensionId);

    // execute extensions logic

    while (true) {
        console.log('next');
        const event = await next(extensionId);
        switch (event.eventType) {
            case EventType.SHUTDOWN:
                handleShutdown(event);
                break;
            case EventType.INVOKE:
                handleInvoke(event);
                break;
            default:
                throw new Error('unknown event: ' + event.eventType);
        }
    }
})();