import { logger } from '../../../shared/observability/logger.service';
import { getBackendClient } from '../../../shared/infrastructure/supabase/client';

export interface FraudRiskScore {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendation: string;
}

export interface FraudDetectionRequest {
  idComprador: string;
  amount: number;
  paymentMethod: string;
  customerEmail: string;
  customerPhone?: string;
  customerIp?: string;
  customerDeviceId?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cardNumber?: string;
  orderId?: string;
}

export class FraudDetectionService {
  private static instance: FraudDetectionService;
  private riskThresholds = {
    low: 30,
    medium: 60,
    high: 80,
  };

  private constructor() {}

  static getInstance(): FraudDetectionService {
    if (!FraudDetectionService.instance) {
      FraudDetectionService.instance = new FraudDetectionService();
    }
    return FraudDetectionService.instance;
  }

  async assessRisk(request: FraudDetectionRequest): Promise<FraudRiskScore> {
    logger.info('Assessing fraud risk', 'fraud-detection-service', { idComprador: request.idComprador, amount: request.amount });

    let score = 0;
    const factors: string[] = [];

    // Amount-based risk
    if (request.amount > 10000) {
      score += 20;
      factors.push('High transaction amount');
    } else if (request.amount > 5000) {
      score += 10;
      factors.push('Medium transaction amount');
    }

    // Payment method risk
    if (request.paymentMethod === 'card') {
      score += 5;
      factors.push('Card payment (higher risk profile)');
    }

    // Email domain risk
    if (this.isSuspiciousEmail(request.customerEmail)) {
      score += 15;
      factors.push('Suspicious email domain');
    }

    // Address mismatch
    if (request.billingAddress && request.shippingAddress) {
      if (this.addressesDiffer(request.billingAddress, request.shippingAddress)) {
        score += 10;
        factors.push('Billing and shipping addresses differ');
      }
    }

    // Velocity checks (would need database integration)
    // For now, this is a placeholder
    const recentTransactions = await this.getRecentTransactionCount(request.idComprador);
    if (recentTransactions > 10) {
      score += 20;
      factors.push('High transaction velocity');
    } else if (recentTransactions > 5) {
      score += 10;
      factors.push('Elevated transaction velocity');
    }

    // IP-based risk (would need IP geolocation service)
    if (request.customerIp) {
      const ipRisk = await this.assessIpRisk(request.customerIp);
      score += ipRisk.score;
      if (ipRisk.factors.length > 0) {
        factors.push(...ipRisk.factors);
      }
    }

    // Device fingerprinting (would need device intelligence service)
    if (request.customerDeviceId) {
      const deviceRisk = await this.assessDeviceRisk(request.customerDeviceId);
      score += deviceRisk.score;
      if (deviceRisk.factors.length > 0) {
        factors.push(...deviceRisk.factors);
      }
    }

    // Cap score at 100
    score = Math.min(score, 100);

    const level = this.determineRiskLevel(score);
    const recommendation = this.getRecommendation(level);

    logger.info('Fraud risk assessment complete', 'fraud-detection-service', {
      idComprador: request.idComprador,
      score,
      level,
      factors,
    });

    return {
      score,
      level,
      factors,
      recommendation,
    };
  }

  private isSuspiciousEmail(email: string): boolean {
    const suspiciousDomains = ['tempmail.com', 'throwaway.com', 'fakeemail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return suspiciousDomains.includes(domain || '');
  }

  private addressesDiffer(billing: any, shipping: any): boolean {
    return (
      billing.city !== shipping.city ||
      billing.state !== shipping.state ||
      billing.zipCode !== shipping.zipCode ||
      billing.country !== shipping.country
    );
  }

  private async getRecentTransactionCount(idComprador: string): Promise<number> {
    try {
      const supabase = getBackendClient();
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .schema('finance')
        .from('payments')
        .select('id')
        .eq('id_comprador', idComprador)
        .gte('created_at', twentyFourHoursAgo);
      
      if (error) {
        logger.error('Error fetching recent transactions', 'fraud-detection-service', { error, idComprador });
        return 0;
      }
      
      return data?.length || 0;
    } catch (error) {
      logger.error('Exception in getRecentTransactionCount', 'fraud-detection-service', { error, idComprador });
      return 0;
    }
  }

  private async assessIpRisk(ip: string): Promise<{ score: number; factors: string[] }> {
    const factors: string[] = [];
    let score = 0;

    if (!ip) {
      return { score: 0, factors: [] };
    }

    // Check for private/reserved IP ranges
    const privateIpPatterns = [
      /^10\./,                    // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12
      /^192\.168\./,              // 192.168.0.0/16
      /^127\./,                   // 127.0.0.0/8 (localhost)
      /^::1$/,                    // IPv6 localhost
      /^fc00:/i,                  // IPv6 unique local
      /^fe80:/i,                  // IPv6 link-local
    ];

    const isPrivate = privateIpPatterns.some(pattern => pattern.test(ip));
    
    if (isPrivate) {
      // Private IPs are generally safer
      return { score: 0, factors: [] };
    }

    // Basic IP validation
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const isValidIp = ipv4Pattern.test(ip) || ip.includes(':');

    if (!isValidIp) {
      score += 15;
      factors.push('Invalid IP format');
    }

    // Check for known proxy/VPN indicators (basic heuristic)
    if (ip.includes('.') && ip.split('.').length === 4) {
      const parts = ip.split('.').map(Number);
      // Check for data center IP ranges (simplified)
      if (parts[0] === 104 || parts[0] === 52 || parts[0] === 54) {
        score += 10;
        factors.push('IP from known data center range');
      }
    }

    // Note: Full IP geolocation and risk assessment requires external service integration
    // This is a basic implementation using heuristics
    logger.info('IP risk assessment completed', 'fraud-detection-service', { ip, score, factors });

    return { score, factors };
  }

  private async assessDeviceRisk(deviceId: string): Promise<{ score: number; factors: string[] }> {
    const factors: string[] = [];
    let score = 0;

    if (!deviceId) {
      score += 5;
      factors.push('No device ID provided');
      return { score, factors };
    }

    // Basic device ID validation
    if (deviceId.length < 8) {
      score += 10;
      factors.push('Device ID too short (possible fake)');
    }

    // Check for suspicious patterns (basic heuristic)
    const suspiciousPatterns = [
      /^test-/,
      /^fake-/,
      /^demo-/,
      /^mock-/,
      /^temp-/,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(deviceId))) {
      score += 20;
      factors.push('Device ID contains suspicious pattern');
    }

    // Check if deviceId is a common placeholder
    const placeholders = ['unknown', 'undefined', 'null', 'none', 'default'];
    if (placeholders.includes(deviceId.toLowerCase())) {
      score += 15;
      factors.push('Device ID is a placeholder value');
    }

    // Note: Full device fingerprinting and risk assessment requires external service integration
    // This is a basic implementation using heuristics
    logger.info('Device risk assessment completed', 'fraud-detection-service', { deviceId, score, factors });

    return { score, factors };
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < this.riskThresholds.low) return 'low';
    if (score < this.riskThresholds.medium) return 'medium';
    if (score < this.riskThresholds.high) return 'high';
    return 'critical';
  }

  private getRecommendation(level: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (level) {
      case 'low':
        return 'Proceed with payment normally';
      case 'medium':
        return 'Proceed with additional verification (e.g., 3D Secure)';
      case 'high':
        return 'Require manual review or additional authentication';
      case 'critical':
        return 'Block payment and require manual investigation';
      default:
        return 'Proceed with payment normally';
    }
  }

  async reportFraudulentActivity(paymentId: string, reason: string): Promise<void> {
    logger.warn('Reporting fraudulent activity', 'fraud-detection-service', { paymentId, reason });
    // TODO: Implement fraud reporting and blacklist logic
  }

  async addToBlacklist(idComprador: string, reason: string): Promise<void> {
    void idComprador;
    logger.warn('Adding customer to fraud blacklist', 'fraud-detection-service', { idComprador, reason });
    // TODO: Implement blacklist management
  }

  async isBlacklisted(idComprador: string): Promise<boolean> {
    void idComprador;
    // TODO: Implement blacklist check
    return false;
  }
}

export const fraudDetectionService = FraudDetectionService.getInstance();
