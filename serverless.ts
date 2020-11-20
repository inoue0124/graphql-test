import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'api',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 3030,
        inMemory: true,
        migrate: true,
        seed: false,
      },
    }
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dynamodb-local'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    graphql: {
      handler: 'handler.graphqlHandler',
      events: [
        {
          http: {
            method: 'get',
            path: 'graphql',
          }
        },
        {
          http: {
            method: 'post',
            path: 'graphql',
            cors: true,
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      PostTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          TableName: 'Posts'
        }
      }
    }
  }
}

module.exports = serverlessConfiguration;
