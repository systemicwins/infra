#!/usr/bin/env node

/**
 * Simple Demo Script for AI Model Selection
 *
 * This script demonstrates the model selection logic without any dependencies.
 * It shows the core algorithm and cost calculations.
 */

interface ModelConfig {
  name: string;
  provider: string;
  pricing: {
    inputCostPer1kTokens: number;
    outputCostPer1kTokens: number;
  };
  strengths: string[];
}

interface ModelSelectionCriteria {
  complexity: 'simple' | 'moderate' | 'complex';
  urgency: 'low' | 'normal' | 'high';
  contextLength: number;
  channel: 'sms' | 'voice' | 'email' | 'chat';
  customerTier: 'standard' | 'premium' | 'enterprise';
}

class SimpleModelSelectionDemo {
  private models: ModelConfig[] = [
    // Cost-effective models
    { name: 'Gemini 1.5 Flash', provider: 'Google', pricing: { inputCostPer1kTokens: 0.075, outputCostPer1kTokens: 0.30 }, strengths: ['fast', 'efficient'] },
    { name: 'Claude 3.5 Haiku', provider: 'Anthropic', pricing: { inputCostPer1kTokens: 0.25, outputCostPer1kTokens: 1.25 }, strengths: ['fast', 'efficient'] },
    { name: 'Grok-1', provider: 'xAI', pricing: { inputCostPer1kTokens: 0.50, outputCostPer1kTokens: 2.50 }, strengths: ['helpful', 'truthful'] },
    { name: 'GPT-4o-mini', provider: 'OpenAI', pricing: { inputCostPer1kTokens: 0.15, outputCostPer1kTokens: 0.60 }, strengths: ['fast', 'efficient'] },

    // Balanced models
    { name: 'Gemini 2.5 Flash', provider: 'Google', pricing: { inputCostPer1kTokens: 0.15, outputCostPer1kTokens: 0.60 }, strengths: ['balanced', 'multimodal'] },
    { name: 'Claude 4.5 Sonnet', provider: 'Anthropic', pricing: { inputCostPer1kTokens: 3.00, outputCostPer1kTokens: 15.00 }, strengths: ['creative', 'coding'] },
    { name: 'Grok-2', provider: 'xAI', pricing: { inputCostPer1kTokens: 2.00, outputCostPer1kTokens: 10.00 }, strengths: ['helpful', 'real_time'] },
    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', pricing: { inputCostPer1kTokens: 3.00, outputCostPer1kTokens: 15.00 }, strengths: ['creative', 'coding'] },

    // Premium models
    { name: 'Claude Opus 4.1', provider: 'Anthropic', pricing: { inputCostPer1kTokens: 15.00, outputCostPer1kTokens: 75.00 }, strengths: ['complex_reasoning', 'creative'] },
    { name: 'Gemini 1.5 Pro', provider: 'Google', pricing: { inputCostPer1kTokens: 1.25, outputCostPer1kTokens: 5.00 }, strengths: ['large_context', 'reasoning'] },
    { name: 'GPT-4o', provider: 'OpenAI', pricing: { inputCostPer1kTokens: 2.50, outputCostPer1kTokens: 10.00 }, strengths: ['creative', 'vision'] },
    { name: 'Claude 3 Opus', provider: 'Anthropic', pricing: { inputCostPer1kTokens: 15.00, outputCostPer1kTokens: 75.00 }, strengths: ['complex_reasoning', 'creative'] }
  ];

  selectModel(criteria: ModelSelectionCriteria, estimatedTokens: number): { config: ModelConfig; estimatedCost: number; reasoning: string } {
    // Filter models based on criteria
    const candidates = this.filterModelsByCriteria(criteria);

    if (candidates.length === 0) {
      const fallback = this.models.find(m => m.name === 'Gemini 1.5 Flash') || this.models[0];
      return {
        config: fallback,
        estimatedCost: this.calculateCost(fallback, estimatedTokens),
        reasoning: 'No models matched criteria, using fallback'
      };
    }

    // Score candidates by cost-effectiveness
    const scoredCandidates = candidates.map(model => {
      const cost = this.calculateCost(model, estimatedTokens);
      const effectiveness = this.calculateEffectivenessScore(model, criteria);
      const score = effectiveness / Math.log(cost + 1);

      return { model, cost, effectiveness, score };
    });

    // Sort by score (higher is better)
    scoredCandidates.sort((a, b) => b.score - a.score);

    const selected = scoredCandidates[0];
    return {
      config: selected.model,
      estimatedCost: selected.cost,
      reasoning: `Selected for optimal cost-effectiveness (score: ${selected.score.toFixed(2)})`
    };
  }

  private filterModelsByCriteria(criteria: ModelSelectionCriteria): ModelConfig[] {
    return this.models.filter(model => {
      // Complexity filtering
      switch (criteria.complexity) {
        case 'simple':
          return model.strengths.includes('fast') || model.strengths.includes('efficient');
        case 'moderate':
          return model.strengths.includes('balanced') || model.strengths.includes('creative');
        case 'complex':
          return model.strengths.includes('complex_reasoning') || model.strengths.includes('large_context');
        default:
          return true;
      }
    });
  }

  private calculateEffectivenessScore(model: ModelConfig, criteria: ModelSelectionCriteria): number {
    let score = 0.5; // Base score

    // Complexity matching
    if (criteria.complexity === 'simple' && model.strengths.includes('fast')) score += 0.3;
    if (criteria.complexity === 'moderate' && model.strengths.includes('creative')) score += 0.3;
    if (criteria.complexity === 'complex' && model.strengths.includes('complex_reasoning')) score += 0.4;

    // Urgency matching
    if (criteria.urgency === 'high' && model.strengths.includes('fast')) score += 0.2;

    // Customer tier alignment
    if (criteria.customerTier === 'enterprise' && model.pricing.inputCostPer1kTokens > 1.0) score += 0.2;
    if (criteria.customerTier === 'standard' && model.pricing.inputCostPer1kTokens < 0.5) score += 0.1;

    return Math.min(score, 1.0);
  }

  private calculateCost(model: ModelConfig, tokens: number, inputRatio: number = 0.6): number {
    // Estimate input vs output token distribution (default 60% input, 40% output)
    const inputTokens = tokens * inputRatio;
    const outputTokens = tokens * (1 - inputRatio);

    const inputCost = (model.pricing.inputCostPer1kTokens * inputTokens) / 1000;
    const outputCost = (model.pricing.outputCostPer1kTokens * outputTokens) / 1000;

    return inputCost + outputCost;
  }

  runDemo(): void {
    console.log('🤖 AI Model Selection Demo - Cost Optimization in Action\n');
    console.log('This demo shows intelligent model selection for cost savings.\n');

    console.log('📊 Available Models:');
    this.models.forEach(model => {
      const avgCost = (model.pricing.inputCostPer1kTokens + model.pricing.outputCostPer1kTokens) / 2;
      console.log(`   ${model.name} (${model.provider}): $${avgCost.toFixed(3)}/1k tokens avg`);
    });

    console.log('\n' + '='.repeat(80));

    const scenarios = [
      {
        name: 'Simple SMS Query',
        criteria: { complexity: 'simple' as const, urgency: 'low' as const, contextLength: 2, channel: 'sms' as const, customerTier: 'standard' as const },
        tokens: 150
      },
      {
        name: 'Moderate Chat Support',
        criteria: { complexity: 'moderate' as const, urgency: 'normal' as const, contextLength: 8, channel: 'chat' as const, customerTier: 'premium' as const },
        tokens: 400
      },
      {
        name: 'Complex Enterprise Email',
        criteria: { complexity: 'complex' as const, urgency: 'normal' as const, contextLength: 25, channel: 'email' as const, customerTier: 'enterprise' as const },
        tokens: 800
      },
      {
        name: 'Urgent Voice Call',
        criteria: { complexity: 'moderate' as const, urgency: 'high' as const, contextLength: 5, channel: 'voice' as const, customerTier: 'premium' as const },
        tokens: 300
      }
    ];

    let totalCost = 0;
    const modelUsage: Record<string, number> = {};

    for (const scenario of scenarios) {
      console.log(`\n🎯 ${scenario.name}:`);
      console.log(`   Criteria: ${scenario.criteria.complexity} complexity, ${scenario.criteria.urgency} urgency, ${scenario.criteria.customerTier} tier`);

      const result = this.selectModel(scenario.criteria, scenario.tokens);

      console.log(`   🤖 Selected: ${result.config.name} (${result.config.provider})`);
      console.log(`   💰 Cost: $${result.estimatedCost.toFixed(4)} for ${scenario.tokens} tokens`);
      console.log(`   📋 ${result.reasoning}`);

      totalCost += result.estimatedCost;
      modelUsage[result.config.name] = (modelUsage[result.config.name] || 0) + 1;
    }

    console.log('\n' + '='.repeat(80));
    console.log('📈 Summary:');
    console.log(`   Total cost for 4 scenarios: $${totalCost.toFixed(4)}`);
    console.log(`   Average cost per scenario: $${(totalCost / 4).toFixed(4)}`);

    console.log('\n📋 Model Usage:');
    Object.entries(modelUsage).forEach(([model, count]) => {
      console.log(`   ${model}: ${count} scenarios`);
    });

    // Cost savings calculation
    const expensiveModel = this.models.find(m => m.name === 'Claude Opus 4.1');
    if (expensiveModel) {
      const avgTokens = 400;
      const alwaysExpensiveCost = 4 * this.calculateCost(expensiveModel, avgTokens);
      const savings = alwaysExpensiveCost - totalCost;
      const savingsPercent = (savings / alwaysExpensiveCost) * 100;

      console.log('\n💸 Cost Savings:');
      console.log(`   Cost if always using ${expensiveModel.name}: $${alwaysExpensiveCost.toFixed(4)}`);
      console.log(`   Optimized cost: $${totalCost.toFixed(4)}`);
      console.log(`   Savings: $${savings.toFixed(4)} (${savingsPercent.toFixed(1)}%)`);
    }

    console.log('\n✅ Demo completed! The system intelligently selects cost-effective models');
    console.log('   while maintaining quality for different customer support scenarios.');
  }
}

// Run the demo
const demo = new SimpleModelSelectionDemo();
demo.runDemo();