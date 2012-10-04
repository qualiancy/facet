module.exports = process.env.FACET_COV
  ? require('./lib-cov/facet')
  : require('./lib/facet');
