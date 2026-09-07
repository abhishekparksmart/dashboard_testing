const dotenv = require('dotenv');
const path = require('path');

class Env {
  static load() {
    // Default to 'dev' if not specified
    const env = process.env.TEST_ENV || 'dev';
    const envPath = path.resolve(__dirname, `../.env.${env}`);
    
    dotenv.config({ path: envPath, override: true });
    
    console.log(`[Config] Loaded environment variables for: ${env.toUpperCase()}`);
  }
}

module.exports = { Env };
