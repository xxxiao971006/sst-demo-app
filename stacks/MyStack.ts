import { StackContext, Api, StaticSite, Bucket } from "sst/constructs";


export function API({ stack }: StackContext) {
  const audience = `api-ExpensesApp-xiao`
  const assetBucket = new Bucket(stack, "assets");

  const api = new Api(stack, "api", {
    authorizers: {
    myAuthorizer: {
      type: "jwt",
      jwt: {
        issuer: "https://expensetrackerxiao.kinde.com",
        audience: [audience],
      },
    },
    },
    defaults: {
      authorizer: "myAuthorizer",
      function: {
        environment: {
          POSTGRES_URL: process.env.POSTGRES_URL!,
        }
      }
    },

    routes: {
      "GET /": {
        authorizer: 'none',
        function:{
          handler: "packages/functions/src/lambda.handler"
        }
      },

      "GET /cs" : {
        authorizer: 'none',
        function: {
          handler: "packages/csharp/MyFirstCSharpFunction",
          runtime: "container",
        }
      },

      "GET /pets": {
       authorizer: 'none',
        function:{
          handler: "packages/functions/src/pets.handler"
        }
      },
      "POST /pets": "packages/functions/src/pets.handler",
      "DELETE /pets/{id}": "packages/functions/src/pets.handler",
      "POST /new-user": "packages/functions/src/pets.handler",
      "POST /signed-url": {
        function: {
          environment: {
            ASSETS_BUCKET_NAME: assetBucket.bucketName,
          },
          handler: "packages/functions/src/s3.handler",
        }
      },
      "DELETE /delete-object/{key}": {
        function: {
          environment: {
            ASSETS_BUCKET_NAME: assetBucket.bucketName,
          },
          handler: "packages/functions/src/s3.handler",
        }
      },
    },
  });

  api.attachPermissionsToRoute("POST /signed-url", [assetBucket, 'grantPut']);
  api.attachPermissionsToRoute("DELETE /delete-object/{key}", [assetBucket, 'grantDelete']);

  const web = new StaticSite(stack, "web", {
  path: "packages/web",
  buildOutput: "dist",
  buildCommand: "npm run build",
  environment: {
    VITE_APP_API_URL: api.url,
    VITE_APP_KINDE_AUDIENCE: audience,
  },
});

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebsiteURL: web.url,
  });
}
