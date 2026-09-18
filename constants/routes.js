const ROUTES = {
  LOGIN: '/web/auth/login',
  DASHBOARD: '/web/dashboard',
  ACCESS_PASS: '/web/dashboard/AccessPasses',
  PARKING_LOGS: '/web/dashboard/ParkingLogs',
  TRANSACTIONS: '/web/dashboard/Transactions',
  VALET_DRIVERS: '/web/dashboard/ValetDrivers',
  REPORTS: '/web/dashboard/Reports',
  GENERATE_REPORTS: '/web/dashboard/GenerateReports',
  SCHEDULE_REPORTS: '/web/dashboard/ScheduleReports',
  USER_ACTIVITY: '/web/dashboard/UserActivity',
};

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator'
};

module.exports = { ROUTES, ROLES };
