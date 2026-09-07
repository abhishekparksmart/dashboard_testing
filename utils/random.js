class RandomUtils {
  static string(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  static number(min = 1, max = 10000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static mobileNumber() {
    return `9${Math.floor(100000000 + Math.random() * 900000000)}`; // Indian mobile format
  }

  static vehicleNumber() {
    const states = ['DL', 'MH', 'UP', 'HR', 'KA', 'TS'];
    const state = states[Math.floor(Math.random() * states.length)];
    const district = String(this.number(1, 99)).padStart(2, '0');
    const letters = this.string(2).toUpperCase();
    const numbers = String(this.number(1000, 9999));
    return `${state}${district}${letters}${numbers}`;
  }
}

module.exports = { RandomUtils };
