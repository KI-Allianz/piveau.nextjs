import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "tests/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,

    retries: {
      runMode: 1, // CI retries
      openMode: 0, // Local GUI retries
    },

    setupNodeEvents(on, config) {},
  },

  viewportWidth: 1280,
  viewportHeight: 720,
  reporter: "spec",
  video: false,
  screenshotOnRunFailure: true,
});
