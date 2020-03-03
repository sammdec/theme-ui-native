module.exports = {
  preset: "@testing-library/react-native",
  setupFilesAfterEnv: ["@testing-library/react-native/cleanup-after-each"],
  testMatch: ["**/test/*.{js,ts,tsx}"]
};
