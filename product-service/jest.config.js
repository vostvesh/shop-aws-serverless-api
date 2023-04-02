module.exports = {
  rootDir: ".",
  roots: ["./src"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleNameMapper: {
    "@functions/(.*)": "<rootDir>/src/functions/$1",
    "@libs/(.*)": "<rootDir>/src/libs/$1",
    "@mocks/(.*)": "<rootDir>/src/mocks/$1",
  },
};
