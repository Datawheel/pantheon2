/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
const {Storage} = require("@google-cloud/storage");
const {
  reviveFromBase64Representation,
  replaceJsonWithBase64,
} = require("@neshca/json-replacer-reviver");
const {CacheHandler} = require("@neshca/cache-handler");
// const parser = require("html-dom-parser");

const storage = new Storage({
  // Only use keyFilename when not running on Cloud Run
  ...(process.env.K_SERVICE
    ? {}
    : {keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS}),
  retryOptions: {
    autoRetry: true,
    maxRetries: 3,
  },
});

const bucketName = "pantheon-cache";
const folderName = "release-nov/nov-";

const renameKey = key => {
  const decodedKey = decodeURIComponent(key);

  try {
    const url = new URL(decodedKey);
    return `${folderName}${url.pathname}`;
  } catch (e) {
    let baseName = decodedKey.split(/[?#]/)[0];

    if (!decodedKey.includes("?")) {
      [baseName] = baseName.split("&");
    }

    return `${folderName}${baseName}`;
  }
};

CacheHandler.onCreation(() => {
  const bucket = storage.bucket(bucketName);

  const handler = {
    name: "pantheon-cache-handler",
    async get(key) {
      try {
        const file = await bucket.file(renameKey(key));
        const exists = await file.exists();

        if (!exists[0]) {
          // If the key does not exist, return null.
          //   console.log(
          //     `[CACHE-HANDLER] File for ${key} doesn't exists on bucket.`
          //   );
          return null;
        }
        // console.log(
        //   `[CACHE-HANDLER] File for ${key} found in bucket. Retrieving from cache.`
        // );

        const data = await file.download();
        const cacheValue = JSON.parse(
          data.toString(),
          reviveFromBase64Representation
        );

        if (!cacheValue) {
          // If the cache value has no tags, return it  early.
          return null;
        }

        const [metadata] = await file.getMetadata();
        const expirationDate = metadata.metadata?.expirationDate;

        if (expirationDate) {
          const unixExpirationDate = new Date(expirationDate).getTime();

          // If the expiration date is less than the current time of the cache value
          if (
            unixExpirationDate &&
            Number.parseInt(unixExpirationDate, 10) < new Date().toISOString()
          ) {
            // Delete the key from bucket
            await file.delete();
            // Return null to indicate cache miss
            return null;
          }
        }

        return cacheValue;
      } catch (error) {
        console.error(
          `[CACHE-HANDLER] Error getting cache file for key ${key}:`,
          error
        );
        return null;
      }
    },
    async set(key, value) {
      try {
        const file = await bucket.file(renameKey(key));

        if (value?.value === null) return;

        if (
          value?.value?.kind === "REDIRECT" &&
          (value?.value?.props?.pageProps?.__N_REDIRECT?.includes("/404") ||
            value?.value?.props?.pageProps?.__N_REDIRECT_STATUS === 308)
        )
          return;

        // NA Test - TODO
        // Regular expression to match content inside <body> tags
        // const bodyContentRegex = /<body>([\s\S]*?)<\/body>/i;

        // Extracting content inside <body> tags
        // const match = bodyContentRegex.exec(value.value.html);
        // const bodyContent = match ? match[1] : null;

        // console.log(parser(`<body>${bodyContent}</body>`)[0].getElementById("Profile"));

        await file.save(JSON.stringify(value, replaceJsonWithBase64));
        // console.log(
        //   `[CACHE-HANDLER] Cache file generated succesfully for ${key}`
        // );

        if (value.lifespan) {
          const expirationDate = new Date(value.lifespan.expireAt * 1000);
          await file.setMetadata({
            metadata: {
              expirationDate: expirationDate.toISOString(),
            },
          });
        }
      } catch (error) {
        console.error(
          `[CACHE-HANDLER] Error generating cache file for ${key}:`,
          error
        );
      }
    },
  };

  return {
    handlers: [handler],
  };
});

module.exports = CacheHandler;
