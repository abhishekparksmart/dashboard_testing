class VehicleApi {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    this.baseUrl = process.env.API_URL || 'https://api.parksmart.in';
  }

  async createVehicle(payload) {
    const response = await this.request.post(`${this.baseUrl}/api/v1/vehicles`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok()) {
        throw new Error(`Failed to create vehicle via API: ${response.status()}`);
    }
    return await response.json();
  }

  async deleteVehicle(vehicleId) {
    const response = await this.request.delete(`${this.baseUrl}/api/v1/vehicles/${vehicleId}`);
    return response.ok();
  }
}

module.exports = { VehicleApi };
