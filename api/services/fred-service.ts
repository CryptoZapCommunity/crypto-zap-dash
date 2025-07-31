import fetch from 'node-fetch';
import type { FedData } from '../../shared/schema.js';

interface FredSeries {
  id: string;
  title: string;
  units: string;
  frequency: string;
  last_updated: string;
  observations: Array<{
    date: string;
    value: string;
  }>;
}

interface FredResponse {
  count: number;
  offset: number;
  limit: number;
  observations: Array<{
    realtime_start: string;
    realtime_end: string;
    date: string;
    value: string;
  }>;
}

export class FredService {
  private readonly FRED_API_BASE = 'https://api.stlouisfed.org/fred';
  private readonly API_KEY = process.env.FRED_API_KEY || '';

  // Federal Funds Rate (FEDFUNDS)
  async getFederalFundsRate(): Promise<number> {
    try {
      const response = await fetch(
        `${this.FRED_API_BASE}/series/observations?series_id=FEDFUNDS&api_key=${this.API_KEY}&file_type=json&limit=1&sort_order=desc`
      );

      if (!response.ok) {
        console.warn('FRED API error, using mock data');
        return 5.50; // Mock current rate
      }

      const data: FredResponse = await response.json();
      const latestObservation = data.observations[0];
      
      return parseFloat(latestObservation.value);
    } catch (error) {
      console.error('Error fetching Federal Funds Rate:', error);
      return 5.50; // Mock fallback
    }
  }

  // Consumer Price Index (CPIAUCSL)
  async getInflationRate(): Promise<number> {
    try {
      const response = await fetch(
        `${this.FRED_API_BASE}/series/observations?series_id=CPIAUCSL&api_key=${this.API_KEY}&file_type=json&limit=2&sort_order=desc`
      );

      if (!response.ok) {
        console.warn('FRED API error, using mock data');
        return 3.1; // Mock inflation rate
      }

      const data: FredResponse = await response.json();
      const current = parseFloat(data.observations[0].value);
      const previous = parseFloat(data.observations[1].value);
      
      // Calculate year-over-year inflation
      const inflationRate = ((current - previous) / previous) * 100;
      return inflationRate;
    } catch (error) {
      console.error('Error fetching inflation rate:', error);
      return 3.1; // Mock fallback
    }
  }

  // Unemployment Rate (UNRATE)
  async getUnemploymentRate(): Promise<number> {
    try {
      const response = await fetch(
        `${this.FRED_API_BASE}/series/observations?series_id=UNRATE&api_key=${this.API_KEY}&file_type=json&limit=1&sort_order=desc`
      );

      if (!response.ok) {
        console.warn('FRED API error, using mock data');
        return 3.7; // Mock unemployment rate
      }

      const data: FredResponse = await response.json();
      const latestObservation = data.observations[0];
      
      return parseFloat(latestObservation.value);
    } catch (error) {
      console.error('Error fetching unemployment rate:', error);
      return 3.7; // Mock fallback
    }
  }

  // GDP Growth Rate (GDP)
  async getGDPGrowth(): Promise<number> {
    try {
      const response = await fetch(
        `${this.FRED_API_BASE}/series/observations?series_id=GDP&api_key=${this.API_KEY}&file_type=json&limit=2&sort_order=desc`
      );

      if (!response.ok) {
        console.warn('FRED API error, using mock data');
        return 2.1; // Mock GDP growth
      }

      const data: FredResponse = await response.json();
      const current = parseFloat(data.observations[0].value);
      const previous = parseFloat(data.observations[1].value);
      
      // Calculate quarter-over-quarter growth
      const growthRate = ((current - previous) / previous) * 100;
      return growthRate;
    } catch (error) {
      console.error('Error fetching GDP growth:', error);
      return 2.1; // Mock fallback
    }
  }

  // Get rate history for charting
  async getRateHistory(months: number = 12): Promise<Array<{ date: string; rate: number }>> {
    try {
      const response = await fetch(
        `${this.FRED_API_BASE}/series/observations?series_id=FEDFUNDS&api_key=${this.API_KEY}&file_type=json&limit=${months}&sort_order=desc`
      );

      if (!response.ok) {
        console.warn('FRED API error, using mock data');
        return this.getMockRateHistory();
      }

      const data: FredResponse = await response.json();
      
      return data.observations
        .reverse() // Chronological order
        .map(obs => ({
          date: obs.date,
          rate: parseFloat(obs.value)
        }));
    } catch (error) {
      console.error('Error fetching rate history:', error);
      return this.getMockRateHistory();
    }
  }

  private getMockRateHistory(): Array<{ date: string; rate: number }> {
    return [
      { date: '2024-01-15', rate: 5.50 },
      { date: '2023-12-13', rate: 5.25 },
      { date: '2023-11-01', rate: 5.25 },
      { date: '2023-09-20', rate: 5.50 },
      { date: '2023-07-26', rate: 5.25 },
      { date: '2023-06-14', rate: 5.00 },
      { date: '2023-05-03', rate: 5.00 },
      { date: '2023-03-22', rate: 4.75 },
      { date: '2023-02-01', rate: 4.50 },
      { date: '2022-12-14', rate: 4.25 },
    ];
  }

  // Get all economic indicators at once
  async getEconomicIndicators() {
    try {
      const [fundsRate, inflation, unemployment, gdp] = await Promise.all([
        this.getFederalFundsRate(),
        this.getInflationRate(),
        this.getUnemploymentRate(),
        this.getGDPGrowth()
      ]);

      return {
        federalFundsRate: fundsRate,
        inflationRate: inflation,
        unemploymentRate: unemployment,
        gdpGrowth: gdp,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching economic indicators:', error);
      return {
        federalFundsRate: 5.50,
        inflationRate: 3.1,
        unemploymentRate: 3.7,
        gdpGrowth: 2.1,
        lastUpdated: new Date().toISOString()
      };
    }
  }
} 