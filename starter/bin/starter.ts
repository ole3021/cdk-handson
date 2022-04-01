#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StarterStack } from '../lib/starter-stack';

const app = new cdk.App();
new StarterStack(app, 'StarterStack');
