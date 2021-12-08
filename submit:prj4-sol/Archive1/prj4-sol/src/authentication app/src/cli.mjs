import authentication from './auth.mjs';
import serve from './ws-server.mjs';

import fs from 'fs';
import https from 'https';

import { cwdPath, } from 'cs544-node-utils';

import Path from 'path';

async function main(args) {
  if (args.length < 1) usage();
  const config = (await import(cwdPath(args[0]))).default;
  const port = getPort(config.ws.port);
  let auth;
  try {
    auth = await authentication(config.auth);
    exitOnErrors(auth);
    const app = serve(auth);
    const serverOpts = {
      key: fs.readFileSync(config.https.keyPath),
      cert: fs.readFileSync(config.https.certPath),
    };
    https.createServer(serverOpts, app)
      .listen(config.ws.port, function() {
	console.log(`listening on port ${config.ws.port}`);
      });
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
  finally {
//    if (auth && !auth.errors) await auth.close();
  }
}

export default function () { return main(process.argv.slice(2)); }

function getPort(portStr) {
  let port;
  if (!/^\d+$/.test(portStr) || (port = Number(portStr)) < 1024) {
    usageError(`bad port ${portStr}: must be >= 1024`);
  }
  return port;
}

/** Output usage message to stderr and exit */
function usage() {
  const prog = Path.basename(process.argv[1]);
  console.error(`usage: ${prog} CONFIG_MJS`);
  process.exit(1);
}

function usageError(err=null) {
  if (err) console.error(err);
  usage();
}

function exitOnErrors(result) {
  if (result.errors) {
    result.errors.forEach(e => console.error(e.toString()));
    process.exit(1);
  }
}
