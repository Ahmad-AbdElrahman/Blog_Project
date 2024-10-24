module.exports = {
    setupFilesAfterEnv: ['./tests/setup.js'], // This ensure the setup is applied to all test files
    testTimeout: 10000, // Increase the timeout if needed
    maxWorkers: 1,
  };
  