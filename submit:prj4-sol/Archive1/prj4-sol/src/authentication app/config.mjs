const CERT_BASE = `${process.env.HOME}/tmp/localhost-certs`;

export default {

  auth: {
    dbUrl:  'mongodb://localhost:27017/auth',
    tables: {
      authInfos: 'auths',
    },
    timeoutSeconds: 30,
    purgePeriodSeconds: 30,
    bcryptRounds: 5,
  },

  ws: {
    port: 1235,
  },

  https: {
    certPath: `${CERT_BASE}/localhost.crt`,
    keyPath: `${CERT_BASE}/localhost.key`,
  },
  

};
