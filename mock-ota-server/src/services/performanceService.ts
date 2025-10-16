import { logger } from '../config/logger';
import { PerformanceMetrics } from '../types';

export class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    requestsPerSecond: 0,
    errorRate: 0,
    lastUpdated: new Date()
  };

  private responseTimes: number[] = [];
  private requestTimestamps: number[] = [];
  private readonly maxResponseTimeHistory = 1000; // Keep last 1000 response times
  private readonly maxRequestHistory = 10000; // Keep last 10000 request timestamps

  private constructor() {
    // Start metrics collection interval
    this.startMetricsCollection();
  }

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  private startMetricsCollection(): void {
    const interval = parseInt(process.env['METRICS_COLLECTION_INTERVAL'] || '60000'); // 1 minute default
    
    setInterval(() => {
      this.updateMetrics();
    }, interval);

    logger.info(`Performance metrics collection started with ${interval}ms interval`);
  }

  public recordRequest(success: boolean, responseTime: number): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Record response time
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > this.maxResponseTimeHistory) {
      this.responseTimes.shift();
    }

    // Record request timestamp
    this.requestTimestamps.push(Date.now());
    if (this.requestTimestamps.length > this.maxRequestHistory) {
      this.requestTimestamps.shift();
    }

    // Update metrics immediately for real-time monitoring
    this.updateMetrics();
  }

  private updateMetrics(): void {
    // Calculate average response time
    if (this.responseTimes.length > 0) {
      this.metrics.averageResponseTime = this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
    }

    // Calculate requests per second (based on last minute)
    const oneMinuteAgo = Date.now() - 60000;
    const recentRequests = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
    this.metrics.requestsPerSecond = recentRequests.length / 60; // requests per second

    // Calculate error rate
    if (this.metrics.totalRequests > 0) {
      this.metrics.errorRate = (this.metrics.failedRequests / this.metrics.totalRequests) * 100;
    }

    this.metrics.lastUpdated = new Date();
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getDetailedMetrics(): any {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const fiveMinutesAgo = now - 300000;
    const oneHourAgo = now - 3600000;

    const recentRequests = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
    const fiveMinuteRequests = this.requestTimestamps.filter(timestamp => timestamp > fiveMinutesAgo);
    const hourlyRequests = this.requestTimestamps.filter(timestamp => timestamp > oneHourAgo);

    return {
      ...this.metrics,
      detailed: {
        requestsPerMinute: recentRequests.length,
        requestsPerFiveMinutes: fiveMinuteRequests.length,
        requestsPerHour: hourlyRequests.length,
        responseTimeStats: {
          min: this.responseTimes.length > 0 ? Math.min(...this.responseTimes) : 0,
          max: this.responseTimes.length > 0 ? Math.max(...this.responseTimes) : 0,
          average: this.metrics.averageResponseTime,
          p50: this.getPercentile(this.responseTimes, 50),
          p95: this.getPercentile(this.responseTimes, 95),
          p99: this.getPercentile(this.responseTimes, 99)
        },
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
  }

  private getPercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  public resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      requestsPerSecond: 0,
      errorRate: 0,
      lastUpdated: new Date()
    };
    this.responseTimes = [];
    this.requestTimestamps = [];
    logger.info('Performance metrics reset');
  }

  public getHealthStatus(): any {
    const metrics = this.getMetrics();
    
    // Define health thresholds
    const thresholds = {
      maxErrorRate: 10, // 10% error rate threshold
      maxResponseTime: 2000, // 2 seconds response time threshold
      minRequestsPerSecond: 0.1 // Minimum requests per second
    };

    const isHealthy = 
      metrics.errorRate <= thresholds.maxErrorRate &&
      metrics.averageResponseTime <= thresholds.maxResponseTime &&
      metrics.requestsPerSecond >= thresholds.minRequestsPerSecond;

    return {
      isHealthy,
      status: isHealthy ? 'healthy' : 'unhealthy',
      metrics,
      thresholds,
      timestamp: new Date().toISOString()
    };
  }

  // Method to simulate load for testing
  public simulateLoad(duration: number = 60000, requestsPerSecond: number = 10): void {
    logger.info(`Simulating load: ${requestsPerSecond} requests/second for ${duration}ms`);
    
    const interval = 1000 / requestsPerSecond; // Interval between requests
    const endTime = Date.now() + duration;
    
    const simulateRequest = () => {
      if (Date.now() >= endTime) {
        logger.info('Load simulation completed');
        return;
      }

      const startTime = Date.now();
      const success = Math.random() > 0.1; // 90% success rate
      const responseTime = Math.random() * 1000 + 100; // 100-1100ms response time
      
      this.recordRequest(success, responseTime);
      
      setTimeout(simulateRequest, interval);
    };

    simulateRequest();
  }
}

const performanceService = PerformanceService.getInstance();
export { performanceService };
export default performanceService;
