'use strict';

/**
 * Centralized test data and constants for ParkSmart dashboard tests.
 * All tests should import from here - no magic strings in specs.
 */

const PARKSMART = {
  SITE_NAME: 'ParkSmart',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'abhishekkumar',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Akkiibaghel2@',
  BASE_URL: process.env.BASE_URL || 'https://web.parksmart.io',

  URLS: {
    LOGIN: '/web/auth/login',
    DASHBOARD: '/web/dashboard',
    PARKING_LOGS: '/web/dashboard/Logs',
    TRANSACTIONS: '/web/dashboard/Transactions',
    ACCESS_PASSES: '/web/dashboard/AccessPasses',
    VALET_DRIVERS: '/web/dashboard/ValetDrivers',
    GENERATE_REPORTS: '/web/dashboard/GenerateReports',
    USER_ACTIVITY: '/web/dashboard/UserActivity',
  },

  FILTERS: {
    VISITOR: 'Visitor',
    ACCESS_PASS: 'Access Pass',
  },

  SUMMARY_KPIS: {
    ENTERED: 'Entered',
    EXITED: 'Exited',
    NOT_EXITED: 'Not- Exited',
    AMOUNT: 'Amount',
  },

  LOGS_COLUMNS: ['Vehicle', 'User', 'Direction', 'Type', 'Time', 'Amount', 'Gate', 'Mode', 'Operator'],

  DEFAULT_PAGE_SIZE: 10,

  VEHICLES: {
    VALID_PLATE: 'DL01XX0001',
    VALID_PLATE_2: 'HR26BR5636',
    INVALID_PLATE: 'ZZZZZZZZZZZ99999',
  },

  USERS: {
    ADMIN_PHONE: process.env.ADMIN_PHONE || '6394255782',
    OPERATOR_PHONE: process.env.OPERATOR_PHONE || '8953675413',
  },

  ACCESS_PASS: {
    VEHICLE_TYPES: ['Car', 'Bike/Scooter'],
    IDENTIFICATION_MODES: ['ANPR', 'RFID', 'FasTag'],
    TEST_HOLDER: {
      name: 'Test Automation User',
      email: 'testautomation@parksmart.io',
      additionalInfo: 'Created by Playwright automation',
      gender: 'Male',
    },
    TEST_VEHICLE: {
      type: 'Car',
      number: 'DL99AT9999',
      identificationMode: 'RFID',
    },
  },

  REPORTS: {
    TYPES: ['Parking Logs', 'Visitor Transactions', 'Access Pass Transactions'],
    STATUSES: ['Requested', 'Processing', 'Completed'],
  },

  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 15000,
    LONG: 30000,
    DATA_VALIDATION: 60000,
  },
};

module.exports = { PARKSMART };
