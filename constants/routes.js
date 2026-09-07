const ROUTES = {
  LOGIN: '/web/auth/login',
  DASHBOARD: '/web/dashboard',
  ACCESS_PASS: '/web/dashboard/AccessPass',
  VALET_DRIVERS: '/web/dashboard/ValetDrivers',
  REPORTS: '/web/dashboard/Reports'
};

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator'
};

module.exports = { ROUTES, ROLES };
