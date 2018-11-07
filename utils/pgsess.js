//!PG PROMISE ONLY FOR SESSION TABLE
const pgp = require('pg-promise')()(process.env.DB_CONN)
pgp.any('SELECT * FROM session;')
  .catch(err => {
    pgp.any('CREATE TABLE session("sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL) WITH(OIDS=FALSE);')
      .then(after => {
        pgp.any('ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;')
      }).catch(err => console.log(err))
  })
//!END USE OF PGP