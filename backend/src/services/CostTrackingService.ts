import { Firestore } from '@google-cloud/firestore';
import { logger } from '../utils/logger.js';

export interface CostRecord {
  id: string;
  timestamp: Date;
  sessionId: string;
  modelName: string;
  modelProvider: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  actualCost?: number;
  channel: string;
  complexity: string;
  urgency: string;
  customerTier?: string;
  responseTime: number;
  success: boolean;
  errorMessage?: string;
}

export interface CostSummary {
  totalCost: number;
  totalRequests: number;
  averageCostPerRequest: number;
  costByModel: Record<string, number>;
  costByChannel: Record<string, number>;
  costByComplexity: Record<string, number>;
  costSavings: number;
  costSavingsPercentage: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export class CostTrackingService {
  private firestore: Firestore;
  private projectId: string;

  constructor() {
    this.projectId = process.env.FIRESTORE_PROJECT_ID || 'your-project-id';
    this.firestore = new Firestore({
      projectId: this.projectId,
    });
  }

  /**
   * Record a model usage event with cost information
   */
  async recordUsage(record: Omit<CostRecord, 'id' | 'timestamp'>): Promise<void> {
    try {
      const costRecord: CostRecord = {
        ...record,
        id: this.generateId(),
        timestamp: new Date(),
      };

      await this.firestore.collection('ai_model_usage').doc(costRecord.id).set(costRecord);

      logger.info('Recorded AI model usage', {
        id: costRecord.id,
        modelName: costRecord.modelName,
        estimatedCost: costRecord.estimatedCost,
        totalTokens: costRecord.totalTokens,
        channel: costRecord.channel
      });

    } catch (error) {
      logger.error('Error recording cost usage:', error);
      // Don't throw - cost tracking shouldn't break the main functionality
    }
  }

  /**
   * Get cost summary for a given time period
   */
  async getCostSummary(startDate: Date, endDate: Date): Promise<CostSummary> {
    try {
      const snapshot = await this.firestore.collection('ai_model_usage')
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', endDate)
        .get();

      const records = snapshot.docs.map((doc: any) => doc.data() as CostRecord);

      if (records.length === 0) {
        return this.getEmptySummary(startDate, endDate);
      }

      const totalCost: number = records.reduce((sum: number, record: CostRecord) => sum + (record.actualCost || record.estimatedCost), 0);
      const totalRequests = records.length;
      const averageCostPerRequest = totalCost / totalRequests;

      // Group costs by different dimensions
      const costByModel = this.groupCostsBy(records, 'modelName');
      const costByChannel = this.groupCostsBy(records, 'channel');
      const costByComplexity = this.groupCostsBy(records, 'complexity');

      // Calculate cost savings (comparison with always using most expensive model)
      const costSavings = this.calculateCostSavings(records);

      return {
        totalCost,
        totalRequests,
        averageCostPerRequest,
        costByModel,
        costByChannel,
        costByComplexity,
        costSavings,
        costSavingsPercentage: (costSavings / (totalCost + costSavings)) * 100,
        period: { startDate, endDate }
      };

    } catch (error) {
      logger.error('Error getting cost summary:', error);
      return this.getEmptySummary(startDate, endDate);
    }
  }

  /**
   * Get real-time cost metrics for the current day
   */
  async getCurrentDayMetrics(): Promise<{
    totalCost: number;
    requestCount: number;
    averageCostPerRequest: number;
    topModels: Array<{ model: string; cost: number; usage: number }>;
  }> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const summary = await this.getCostSummary(startOfDay, endOfDay);

    // Get top models by cost
    const topModels = Object.entries(summary.costByModel)
      .map(([model, cost]) => ({
        model,
        cost,
        usage: Object.values(summary.costByModel).reduce((a, b) => a + b, 0) > 0 ?
          (cost / Object.values(summary.costByModel).reduce((a, b) => a + b, 0)) * 100 : 0
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);

    return {
      totalCost: summary.totalCost,
      requestCount: summary.totalRequests,
      averageCostPerRequest: summary.averageCostPerRequest,
      topModels
    };
  }

  /**
   * Update actual cost for a previously recorded usage (when real billing data is available)
   */
  async updateActualCost(recordId: string, actualCost: number): Promise<void> {
    try {
      await this.firestore.collection('ai_model_usage').doc(recordId).update({
        actualCost,
        updatedAt: new Date()
      });

      logger.info('Updated actual cost for record', { recordId, actualCost });
    } catch (error) {
      logger.error('Error updating actual cost:', error);
    }
  }

  /**
   * Get cost trends over time for monitoring and alerting
   */
  async getCostTrends(days: number = 7): Promise<Array<{
    date: string;
    totalCost: number;
    requestCount: number;
    averageCost: number;
  }>> {
    try {
      const trends = [];
      const endDate = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const daySummary = await this.getCostSummary(startOfDay, endOfDay);

        trends.push({
          date: date.toISOString().split('T')[0] || date.toDateString(),
          totalCost: daySummary.totalCost,
          requestCount: daySummary.totalRequests,
          averageCost: daySummary.averageCostPerRequest
        });
      }

      return trends;
    } catch (error) {
      logger.error('Error getting cost trends:', error);
      return [];
    }
  }

  /**
   * Check if current spending is within budget and send alerts if needed
   */
  async checkBudgetAlert(dailyBudget: number): Promise<{
    withinBudget: boolean;
    currentSpending: number;
    budgetRemaining: number;
    alertTriggered: boolean;
  }> {
    const todayMetrics = await this.getCurrentDayMetrics();

    const withinBudget = todayMetrics.totalCost <= dailyBudget;
    const budgetRemaining = dailyBudget - todayMetrics.totalCost;
    const alertTriggered = todayMetrics.totalCost > (dailyBudget * 0.8); // Alert at 80% of budget

    if (alertTriggered) {
      logger.warn('Budget alert triggered', {
        currentSpending: todayMetrics.totalCost,
        dailyBudget,
        percentageUsed: (todayMetrics.totalCost / dailyBudget) * 100
      });
    }

    return {
      withinBudget,
      currentSpending: todayMetrics.totalCost,
      budgetRemaining,
      alertTriggered
    };
  }

  /**
   * Generate cost optimization recommendations based on usage patterns
   */
  async getOptimizationRecommendations(): Promise<Array<{
    type: 'model_switch' | 'channel_optimization' | 'time_based' | 'complexity_routing';
    description: string;
    potentialSavings: number;
    confidence: 'high' | 'medium' | 'low';
    implementationEffort: 'low' | 'medium' | 'high';
  }>> {
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const summary = await this.getCostSummary(last30Days, new Date());
      const recommendations = [];

      // Analyze model usage patterns
      const modelEntries = Object.entries(summary.costByModel);
      if (modelEntries.length > 0) {
        const [mostExpensiveModel, mostExpensiveCost] = modelEntries.reduce((max, current) =>
          current[1] > max[1] ? current : max
        );

        // If a cheaper model could handle some requests, suggest optimization
        const totalCost = summary.totalCost;
        const potentialSavings = mostExpensiveCost * 0.3; // Assume 30% could be optimized

        if (potentialSavings > 1.0) { // Only suggest if savings > $1
          recommendations.push({
            type: 'model_switch' as const,
            description: `Consider routing ${mostExpensiveModel} requests to more cost-effective alternatives where appropriate`,
            potentialSavings,
            confidence: 'medium' as const,
            implementationEffort: 'low' as const
          });
        }
      }

      // Analyze channel-based optimization
      const channelEntries = Object.entries(summary.costByChannel);
      if (channelEntries.length > 0) {
        const highCostChannels = channelEntries.filter(([_, cost]) => cost > summary.totalCost * 0.2);

        if (highCostChannels.length > 0) {
          recommendations.push({
            type: 'channel_optimization' as const,
            description: `High-cost channels detected (${highCostChannels.map(([ch]) => ch).join(', ')}). Consider model optimization for these channels.`,
            potentialSavings: highCostChannels.reduce((sum, [_, cost]) => sum + cost, 0) * 0.2,
            confidence: 'high' as const,
            implementationEffort: 'medium' as const
          });
        }
      }

      return recommendations;

    } catch (error) {
      logger.error('Error generating optimization recommendations:', error);
      return [];
    }
  }

  private groupCostsBy(records: CostRecord[], field: keyof CostRecord): Record<string, number> {
    return records.reduce((acc, record) => {
      const key = String(record[field]);
      const cost = record.actualCost || record.estimatedCost;
      acc[key] = (acc[key] || 0) + cost;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateCostSavings(records: CostRecord[]): number {
    // Calculate what it would cost if we always used the most expensive model
    const mostExpensiveModel = records.reduce((max, record) => {
      const modelCost = records.filter(r => r.modelName === record.modelName)
        .reduce((sum, r) => sum + (r.actualCost || r.estimatedCost), 0);
      return modelCost > max.cost ? { model: record.modelName, cost: modelCost } : max;
    }, { model: '', cost: 0 });

    if (mostExpensiveModel.model) {
      const mostExpensiveCostPerToken = Math.max(...records
        .filter(r => r.modelName === mostExpensiveModel.model)
        .map(r => r.estimatedCost / r.totalTokens));

      const totalTokens = records.reduce((sum, r) => sum + r.totalTokens, 0);
      const alwaysExpensiveCost = totalTokens * mostExpensiveCostPerToken;

      return alwaysExpensiveCost - records.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost), 0);
    }

    return 0;
  }

  private getEmptySummary(startDate: Date, endDate: Date): CostSummary {
    return {
      totalCost: 0,
      totalRequests: 0,
      averageCostPerRequest: 0,
      costByModel: {},
      costByChannel: {},
      costByComplexity: {},
      costSavings: 0,
      costSavingsPercentage: 0,
      period: { startDate, endDate }
    };
  }

  private generateId(): string {
    return `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}