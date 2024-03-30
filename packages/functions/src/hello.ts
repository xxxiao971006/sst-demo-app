import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: "Come on Barbie, let's go party! 🎉",
  };
});
