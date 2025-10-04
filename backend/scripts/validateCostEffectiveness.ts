#!/usr/bin/env tsx

/**
 * Cost Effectiveness Validation Script
 *
 * This script validates that the dynamic model selection is working correctly
 * and providing cost savings compared to always using the most expensive model.
 */

import { ModelSelectionService, ModelSelectionCriteria } from '../src/services/ModelSelectionService.js';
import { CostTrackingService } from '../src/services/CostTrackingService.js';

interface ValidationScenario {
  name: string;
  criteria: ModelSelectionCriteria;
  messageLength: number;
  expectedModelPattern: string;
  description: string;
}

class CostEffectivenessValidator {
  private modelSelectionService: ModelSelectionService;
  private costTrackingService: CostTrackingService;

  constructor() {
    this.modelSelectionService = new ModelSelectionService();
    this.costTrackingService = new CostTrackingService();
  }

  async runValidation(): Promise<void> {
    console.log('🚀 Starting Cost Effectiveness Validation...\n');

    // Define test scenarios
    const scenarios: ValidationScenario[] = [
      {
        name: 'Simple SMS Query',
        criteria: {
          complexity: 'simple',
          urgency: 'low',
          contextLength: 2,
          channel: 'sms',
          customerTier: 'standard'
        },
        messageLength: 50,
        expectedModelPattern: 'Flash|Haiku|Instant|mini',
        description: 'Should use cheapest model for simple SMS'
      },
      {
        name: 'Complex Enterprise Email',
        criteria: {
          complexity: 'complex',
          urgency: 'normal',
          contextLength: 20,
          channel: 'email',
          customerTier: 'enterprise',
          requiresReasoning: true
        },
        messageLength: 300,
        expectedModelPattern: 'Opus|Pro|GPT-4o',
        description: 'Should use premium model for complex enterprise queries'
      },
      {
        name: 'Urgent Voice Request',
        criteria: {
          complexity: 'moderate',
          urgency: 'high',
          contextLength: 5,
          channel: 'voice',
          customerTier: 'premium'
        },
        messageLength: 100,
        expectedModelPattern: 'Flash|Pro',
        description: 'Should prioritize speed for urgent voice requests'
      },
      {
        name: 'Standard Chat Query',
        criteria: {
          complexity: 'moderate',
          urgency: 'normal',
          contextLength: 10,
          channel: 'chat',
          customerTier: 'standard'
        },
        messageLength: 150,
        expectedModelPattern: 'Flash|mini',
        description: 'Should use balanced cost/performance for standard chat'
      }
    ];

    const results = [];

    for (const scenario of scenarios) {
      console.log(`📋 Testing: ${scenario.name}`);
      console.log(`   ${scenario.description}`);

      const selectedModel = this.modelSelectionService.selectModel(
        scenario.criteria,
        this.modelSelectionService.estimateTokens('x'.repeat(scenario.messageLength))
      );

      const isExpectedModel = scenario.expectedModelPattern.split('|')
        .some(pattern => selectedModel.config.name.includes(pattern));

      console.log(`   Selected: ${selectedModel.config.name} (Cost: $${selectedModel.estimatedCost.toFixed(4)})`);
      console.log(`   Expected pattern: ${scenario.expectedModelPattern}`);
      console.log(`   ✅ Model selection: ${isExpectedModel ? 'PASS' : 'FAIL'}`);

      results.push({
        scenario: scenario.name,
        selectedModel: selectedModel.config.name,
        estimatedCost: selectedModel.estimatedCost,
        expectedPattern: scenario.expectedModelPattern,
        passed: isExpectedModel
      });

      console.log('');
    }

    // Summary
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const successRate = (passedTests / totalTests) * 100;

    console.log('📊 Validation Summary:');
    console.log(`   Tests passed: ${passedTests}/${totalTests} (${successRate.toFixed(1)}%)`);

    if (successRate >= 80) {
      console.log('   ✅ Overall: PASS');
    } else {
      console.log('   ❌ Overall: FAIL');
    }

    // Cost analysis
    await this.analyzeCostSavings();

    console.log('\n🎯 Validation completed!');
  }

  private async analyzeCostSavings(): Promise<void> {
    console.log('💰 Cost Savings Analysis:');

    try {
      // Get current day metrics (will be empty for new installation)
      const metrics = await this.costTrackingService.getCurrentDayMetrics();

      console.log(`   Current period cost: $${metrics.totalCost.toFixed(4)}`);
      console.log(`   Requests processed: ${metrics.requestCount}`);

      if (metrics.requestCount > 0) {
        console.log(`   Average cost per request: $${metrics.averageCostPerRequest.toFixed(4)}`);

        // Calculate potential savings vs always using most expensive model
        const mostExpensiveModel = metrics.topModels[0];
        if (mostExpensiveModel) {
          const potentialSavings = mostExpensiveModel.cost * 0.3; // Assume 30% could be optimized
          console.log(`   Potential monthly savings: $${(potentialSavings * 30).toFixed(2)}`);
        }
      } else {
        console.log('   No usage data available yet. Run some test queries first.');
      }

      // Show available models and their costs
       const models = this.modelSelectionService.getAvailableModels();
       console.log('\n📋 Available Models:');
       models.forEach(model => {
         const avgCost = (model.pricing.inputCostPer1kTokens + model.pricing.outputCostPer1kTokens) / 2;
         console.log(`   ${model.name}: $${avgCost.toFixed(3)} per 1k tokens avg`);
       });

    } catch (error) {
      console.log('   Error analyzing costs:', error);
    }
  }

  async simulateLoadTest(requests: number = 100): Promise<void> {
    console.log(`\n🔥 Running load test with ${requests} simulated requests...`);

    const scenarios = [
      { weight: 0.4, criteria: { complexity: 'simple' as const, urgency: 'low' as const, contextLength: 3, channel: 'sms' as const, customerTier: 'standard' as const }},
      { weight: 0.3, criteria: { complexity: 'moderate' as const, urgency: 'normal' as const, contextLength: 10, channel: 'chat' as const, customerTier: 'premium' as const, requiresCreativity: true }},
      { weight: 0.1, criteria: { complexity: 'moderate' as const, urgency: 'normal' as const, contextLength: 8, channel: 'chat' as const, customerTier: 'standard' as const }},
      { weight: 0.2, criteria: { complexity: 'complex' as const, urgency: 'normal' as const, contextLength: 20, channel: 'email' as const, customerTier: 'enterprise' as const }},
      { weight: 0.1, criteria: { complexity: 'moderate' as const, urgency: 'high' as const, contextLength: 5, channel: 'voice' as const, customerTier: 'premium' as const }}
    ];

    let totalCost = 0;
    let totalRequests = 0;
    const modelUsage: Record<string, number> = {};

    for (let i = 0; i < requests; i++) {
      // Select scenario based on weight
      const random = Math.random();
      let scenario = scenarios[0];
      let weightSum = 0;

      for (const s of scenarios) {
        weightSum += s.weight;
        if (random <= weightSum) {
          scenario = s;
          break;
        }
      }

      // Generate random message length
      const messageLength = Math.floor(Math.random() * 200) + 50;

      const selectedModel = this.modelSelectionService.selectModel(scenario.criteria, messageLength * 0.25);

      totalCost += selectedModel.estimatedCost;
      totalRequests++;
      modelUsage[selectedModel.config.name] = (modelUsage[selectedModel.config.name] || 0) + 1;

      // Record for cost tracking
      await this.costTrackingService.recordUsage({
        sessionId: `load_test_${i}`,
        modelName: selectedModel.config.name,
        modelProvider: selectedModel.config.provider,
        inputTokens: Math.floor(messageLength * 0.25),
        outputTokens: Math.floor(messageLength * 0.15),
        totalTokens: Math.floor(messageLength * 0.4),
        estimatedCost: selectedModel.estimatedCost,
        channel: scenario.criteria.channel,
        complexity: scenario.criteria.complexity,
        urgency: scenario.criteria.urgency,
        customerTier: scenario.criteria.customerTier,
        responseTime: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds
        success: true
      });
    }

    console.log(`\n📊 Load Test Results:`);
    console.log(`   Total requests: ${totalRequests}`);
    console.log(`   Total cost: $${totalCost.toFixed(4)}`);
    console.log(`   Average cost per request: $${(totalCost / totalRequests).toFixed(4)}`);

    console.log(`\n📈 Model Usage Distribution:`);
    Object.entries(modelUsage)
      .sort(([,a], [,b]) => b - a)
      .forEach(([model, count]) => {
        const percentage = (count / totalRequests) * 100;
        console.log(`   ${model}: ${count} requests (${percentage.toFixed(1)}%)`);
      });

    // Calculate cost savings vs always using most expensive model
    const mostExpensiveModel = Object.entries(modelUsage)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostExpensiveModel) {
      const expensiveModelConfig = this.modelSelectionService.getAvailableModels()
        .find(m => m.name === mostExpensiveModel[0]);

      if (expensiveModelConfig) {
        const avgCostPer1kTokens = (expensiveModelConfig.pricing.inputCostPer1kTokens + expensiveModelConfig.pricing.outputCostPer1kTokens) / 2;
        const alwaysExpensiveCost = totalRequests * (avgCostPer1kTokens * 0.4); // Assume 400 tokens per request
        const savings = alwaysExpensiveCost - totalCost;
        const savingsPercentage = (savings / alwaysExpensiveCost) * 100;

        console.log(`\n💸 Cost Savings:`);
        console.log(`   Cost if always used ${mostExpensiveModel[0]}: $${alwaysExpensiveCost.toFixed(4)}`);
        console.log(`   Actual cost with optimization: $${totalCost.toFixed(4)}`);
        console.log(`   Savings: $${savings.toFixed(4)} (${savingsPercentage.toFixed(1)}%)`);
      }
    }
  }
}

// Main execution
async function main() {
  const validator = new CostEffectivenessValidator();

  await validator.runValidation();

  // Ask if user wants to run load test
  console.log('\n❓ Run load test with simulated requests? (y/N)');
  // In a real implementation, you'd get user input here
  // For now, we'll run a small load test
  await validator.simulateLoadTest(50);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { CostEffectivenessValidator };