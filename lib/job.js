'use strict';

const path = require('path');
const { JOB_TARGET } = require('./common');

exports.load = (app, config) => {
  const jobDir = path.join(app.baseDir, 'app', config.job.baseDir);
  const jobs = [];

  app.loader.loadToApp(jobDir, JOB_TARGET, {
    ignore: config.job.ignore,
    filter: job => job.isBus,
    initializer(job, pathInfo) {
      jobs.push({
        name: /\w+$/.exec(pathInfo.pathName)[0],
        attempts: job.attempts,
        queue: config.queue.prefix + ':' + (job.queue || config.queue.default),
      });
      return job;
    },
  });

  return jobs;
};