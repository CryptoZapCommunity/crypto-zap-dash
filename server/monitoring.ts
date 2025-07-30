interface RequestLog {
  timestamp: number;
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
}

class RequestMonitor {
  private requests: RequestLog[] = [];
  private maxLogs = 1000; // Keep last 1000 requests
  private alertThreshold = 50; // Alert if more than 50 requests in 1 minute

  logRequest(endpoint: string, method: string, duration: number, statusCode: number): void {
    const log: RequestLog = {
      timestamp: Date.now(),
      endpoint,
      method,
      duration,
      statusCode,
    };

    this.requests.push(log);

    // Keep only the last maxLogs entries
    if (this.requests.length > this.maxLogs) {
      this.requests = this.requests.slice(-this.maxLogs);
    }

    this.checkForExcessiveRequests();
  }

  private checkForExcessiveRequests(): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    const recentRequests = this.requests.filter(
      req => req.timestamp > oneMinuteAgo
    );

    if (recentRequests.length > this.alertThreshold) {
      console.warn(`🚨 EXCESSIVE REQUESTS DETECTED: ${recentRequests.length} requests in the last minute!`);
      
      // Group by endpoint to see which ones are being called most
      const endpointCounts = recentRequests.reduce((acc, req) => {
        acc[req.endpoint] = (acc[req.endpoint] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.warn('📊 Request breakdown:', endpointCounts);
    }
  }

  getStats(): {
    totalRequests: number;
    averageResponseTime: number;
    requestsPerMinute: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
  } {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    const recentRequests = this.requests.filter(
      req => req.timestamp > oneMinuteAgo
    );

    const totalRequests = this.requests.length;
    const averageResponseTime = totalRequests > 0 
      ? this.requests.reduce((sum, req) => sum + req.duration, 0) / totalRequests
      : 0;

    const endpointCounts = this.requests.reduce((acc, req) => {
      acc[req.endpoint] = (acc[req.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRequests,
      averageResponseTime,
      requestsPerMinute: recentRequests.length,
      topEndpoints,
    };
  }

  // Log stats every 5 minutes
  startPeriodicLogging(): void {
    setInterval(() => {
      const stats = this.getStats();
      console.log('📈 Request Monitor Stats:', {
        totalRequests: stats.totalRequests,
        requestsPerMinute: stats.requestsPerMinute,
        averageResponseTime: `${stats.averageResponseTime.toFixed(2)}ms`,
        topEndpoints: stats.topEndpoints,
      });
    }, 5 * 60 * 1000); // Every 5 minutes
  }
}

export const requestMonitor = new RequestMonitor();

// Start periodic logging
requestMonitor.startPeriodicLogging(); 