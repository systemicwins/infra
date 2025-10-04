import { VertexAI } from '@google-cloud/aiplatform';
import OpenAI from 'openai';
import { logger } from '../utils/logger.js';

export interface ModelConfig {
  name: string;
  provider: 'vertex' | 'openai';
  modelId: string;
  costPer1kTokens: number;
  contextWindow: number;
  strengths: string[];
  maxTokens?: number;
  temperature?: number;
}

export interface ModelSelectionCriteria {
  complexity: 'simple' | 'moderate' | 'complex';
  urgency: 'low' | 'normal' | 'high';
  contextLength: number;
  requiresReasoning?: boolean;
  requiresCreativity?: boolean;
  customerTier?: 'standard' | 'premium' | 'enterprise';
  channel: 'sms' | 'voice' | 'email' | 'chat';
}

export interface SelectedModel {
  config: ModelConfig;
  estimatedCost: number;
  reasoning: string;
}

export class ModelSelectionService {
  private vertexAI: VertexAI;
  private openAI: OpenAI;
  private projectId: string;
  private location: string;

  // Model configurations with cost and capability data
  private models: ModelConfig[] = [
    // Free/Low-cost models for simple tasks
    {
      name: 'Gemini 1.5 Flash',
      provider: 'vertex',
      modelId: 'gemini-1.5-flash',
      costPer1kTokens: 0.075, // $0.075 per 1k tokens
      contextWindow: 1048576,
      strengths: ['fast', 'efficient', 'good_for_simple'],
      maxTokens: 8192,
      temperature: 0.7
    },
    // Claude Haiku - Fast and cost-effective
    {
      name: 'Claude 3.5 Haiku',
      provider: 'vertex',
      modelId: 'claude-3-5-haiku',
      costPer1kTokens: 0.25, // $0.25 per 1k tokens input, $1.25 output
      contextWindow: 200000,
      strengths: ['fast', 'efficient', 'good_for_simple', 'quick_responses'],
      maxTokens: 8192,
      temperature: 0.7
    },
    // Current model - moderate cost
    {
      name: 'Gemini 2.5 Flash',
      provider: 'vertex',
      modelId: 'gemini-2.5-flash',
      costPer1kTokens: 0.15, // $0.15 per 1k tokens (estimated)
      contextWindow: 1048576,
      strengths: ['balanced', 'good_for_moderate', 'multimodal'],
      maxTokens: 8192,
      temperature: 0.7
    },
    // Claude Sonnet - Balanced performance (Latest 4.5)
    {
      name: 'Claude 4.5 Sonnet',
      provider: 'vertex',
      modelId: 'claude-4-5-sonnet',
      costPer1kTokens: 3.00, // $3.00 per 1k tokens input, $15.00 output
      contextWindow: 200000,
      strengths: ['balanced', 'good_for_moderate', 'creative', 'coding', 'latest'],
      maxTokens: 8192,
      temperature: 0.7
    },
    // Previous Claude 3.5 Sonnet for comparison
    {
      name: 'Claude 3.5 Sonnet',
      provider: 'vertex',
      modelId: 'claude-3-5-sonnet',
      costPer1kTokens: 3.00, // $3.00 per 1k tokens input, $15.00 output
      contextWindow: 200000,
      strengths: ['balanced', 'good_for_moderate', 'creative', 'coding'],
      maxTokens: 8192,
      temperature: 0.7
    },
    // Previous Claude 3 models for cost comparison
    {
      name: 'Claude 3 Haiku',
      provider: 'vertex',
      modelId: 'claude-3-haiku',
      costPer1kTokens: 0.25, // $0.25 per 1k tokens input, $1.25 output
      contextWindow: 200000,
      strengths: ['fast', 'efficient', 'good_for_simple'],
      maxTokens: 4096,
      temperature: 0.7
    },
    {
      name: 'Claude 3 Sonnet',
      provider: 'vertex',
      modelId: 'claude-3-sonnet',
      costPer1kTokens: 3.00, // $3.00 per 1k tokens input, $15.00 output
      contextWindow: 200000,
      strengths: ['balanced', 'good_for_moderate', 'creative'],
      maxTokens: 4096,
      temperature: 0.7
    },
    // Legacy Claude models for comprehensive options
    {
      name: 'Claude Instant 1.2',
      provider: 'vertex',
      modelId: 'claude-instant-1.2',
      costPer1kTokens: 0.80, // $0.80 per 1k tokens input, $2.40 output (estimated)
      contextWindow: 100000,
      strengths: ['fast', 'efficient', 'legacy_support'],
      maxTokens: 4096,
      temperature: 0.7
    },
    // Premium models for complex tasks
    {
      name: 'Claude Opus 4.1',
      provider: 'vertex',
      modelId: 'claude-opus-4.1',
      costPer1kTokens: 15.00, // $15.00 per 1k tokens input, $75.00 output
      contextWindow: 200000,
      strengths: ['complex_reasoning', 'creative', 'nuanced_understanding', 'multilingual', 'latest_premium'],
      maxTokens: 4096,
      temperature: 0.7
    },
    {
      name: 'Gemini 1.5 Pro',
      provider: 'vertex',
      modelId: 'gemini-1.5-pro',
      costPer1kTokens: 1.25, // $1.25 per 1k tokens
      contextWindow: 2097152,
      strengths: ['complex_reasoning', 'large_context', 'high_accuracy'],
      maxTokens: 32768,
      temperature: 0.3
    },
    {
      name: 'Claude 3 Opus',
      provider: 'vertex',
      modelId: 'claude-3-opus',
      costPer1kTokens: 15.00, // $15.00 per 1k tokens input, $75.00 output
      contextWindow: 200000,
      strengths: ['complex_reasoning', 'creative', 'nuanced_understanding', 'multilingual'],
      maxTokens: 4096,
      temperature: 0.7
    },
    {
      name: 'GPT-4o',
      provider: 'openai',
      modelId: 'gpt-4o',
      costPer1kTokens: 5.00, // $5.00 per 1k tokens input, $15.00 output
      contextWindow: 128000,
      strengths: ['creative', 'nuanced_understanding', 'good_for_creative'],
      maxTokens: 16384,
      temperature: 0.7
    },
    {
      name: 'GPT-4o-mini',
      provider: 'openai',
      modelId: 'gpt-4o-mini',
      costPer1kTokens: 0.15, // $0.15 per 1k tokens
      contextWindow: 128000,
      strengths: ['fast', 'efficient', 'good_for_simple'],
      maxTokens: 16384,
      temperature: 0.7
    },
    // xAI Grok models
    {
      name: 'Grok-2',
      provider: 'vertex',
      modelId: 'grok-2',
      costPer1kTokens: 2.00, // $2.00 per 1k tokens input, $10.00 output (estimated)
      contextWindow: 128000,
      strengths: ['creative', 'helpful', 'maximal_truth', 'real_time'],
      maxTokens: 4096,
      temperature: 0.7
    },
    {
      name: 'Grok-1.5',
      provider: 'vertex',
      modelId: 'grok-1.5',
      costPer1kTokens: 1.00, // $1.00 per 1k tokens input, $5.00 output (estimated)
      contextWindow: 128000,
      strengths: ['balanced', 'helpful', 'real_time'],
      maxTokens: 4096,
      temperature: 0.7
    },
    {
      name: 'Grok-1',
      provider: 'vertex',
      modelId: 'grok-1',
      costPer1kTokens: 0.50, // $0.50 per 1k tokens input, $2.50 output (estimated)
      contextWindow: 8192,
      strengths: ['fast', 'efficient', 'helpful'],
      maxTokens: 2048,
      temperature: 0.7
    }
  ];

  constructor() {
    this.projectId = process.env.FIRESTORE_PROJECT_ID || 'your-project-id';
    this.location = process.env.VERTEX_AI_LOCATION || 'us-central1';

    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location,
    });

    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Select the most cost-effective model based on criteria
   */
  selectModel(criteria: ModelSelectionCriteria, estimatedTokens: number): SelectedModel {
    const candidates = this.filterModelsByCriteria(criteria);
    const selectedModel = this.findOptimalModel(candidates, criteria, estimatedTokens);

    const estimatedCost = this.calculateCost(selectedModel.config, estimatedTokens);

    logger.info('Model selected for task', {
      criteria,
      selectedModel: selectedModel.config.name,
      estimatedCost,
      estimatedTokens,
      reasoning: selectedModel.reasoning
    });

    return {
      config: selectedModel.config,
      estimatedCost,
      reasoning: selectedModel.reasoning
    };
  }

  /**
   * Filter models based on task requirements
   */
  private filterModelsByCriteria(criteria: ModelSelectionCriteria): ModelConfig[] {
    return this.models.filter(model => {
      // Filter by complexity requirements
      switch (criteria.complexity) {
        case 'simple':
          return model.strengths.includes('good_for_simple') || model.strengths.includes('fast');
        case 'moderate':
          return model.strengths.includes('good_for_moderate') || model.strengths.includes('balanced');
        case 'complex':
          return model.strengths.includes('complex_reasoning') || model.strengths.includes('large_context');
        default:
          return true;
      }
    }).filter(model => {
      // Filter by context length requirements
      return model.contextWindow >= criteria.contextLength;
    }).filter(model => {
      // Filter by customer tier requirements
      if (criteria.customerTier === 'enterprise') {
        return model.costPer1kTokens >= 0.5; // Premium models for enterprise
      }
      if (criteria.customerTier === 'premium') {
        return model.costPer1kTokens >= 0.1; // Mid-tier models for premium
      }
      return true;
    }).filter(model => {
      // Filter by channel requirements
      if (criteria.channel === 'voice' && criteria.urgency === 'high') {
        return model.strengths.includes('fast'); // Fast models for urgent voice requests
      }
      return true;
    });
  }

  /**
   * Find the optimal model from candidates based on cost-effectiveness
   */
  private findOptimalModel(candidates: ModelConfig[], criteria: ModelSelectionCriteria, estimatedTokens: number): { config: ModelConfig; reasoning: string } {
    if (candidates.length === 0) {
      // Fallback to cheapest available model
      let fallback: ModelConfig;
      if (this.models.length > 0) {
        fallback = this.models.reduce((cheapest, current) =>
          current.costPer1kTokens < cheapest.costPer1kTokens ? current : cheapest
        );
      } else {
        fallback = {
          name: 'Gemini 1.5 Flash',
          provider: 'vertex' as const,
          modelId: 'gemini-1.5-flash',
          costPer1kTokens: 0.075,
          contextWindow: 1048576,
          strengths: ['fast', 'efficient', 'good_for_simple'],
          maxTokens: 8192,
          temperature: 0.7
        };
      }
      return {
        config: fallback,
        reasoning: 'No models matched criteria, using cheapest fallback'
      };
    }

    // Calculate cost-effectiveness score for each candidate
    const scoredCandidates = candidates.map(model => {
      const cost = this.calculateCost(model, estimatedTokens);
      const effectiveness = this.calculateEffectivenessScore(model, criteria);

      return {
        model,
        cost,
        effectiveness,
        score: effectiveness / Math.log(cost + 1) // Cost-effectiveness ratio
      };
    });

    // Sort by cost-effectiveness score (higher is better)
    scoredCandidates.sort((a, b) => b.score - a.score);

    const selected = scoredCandidates[0];

    if (!selected) {
      // Ultimate fallback
      let fallback: ModelConfig;
      if (this.models.length > 0 && this.models[0]) {
        fallback = this.models[0];
      } else {
        fallback = {
          name: 'Gemini 1.5 Flash',
          provider: 'vertex' as const,
          modelId: 'gemini-1.5-flash',
          costPer1kTokens: 0.075,
          contextWindow: 1048576,
          strengths: ['fast', 'efficient', 'good_for_simple'],
          maxTokens: 8192,
          temperature: 0.7
        };
      }
      return {
        config: fallback,
        reasoning: 'Selection failed, using first available model'
      };
    }

    return {
      config: selected.model,
      reasoning: `Selected based on cost-effectiveness score: ${selected.score.toFixed(2)} (cost: $${selected.cost.toFixed(4)}, effectiveness: ${selected.effectiveness.toFixed(2)})`
    };
  }

  /**
   * Calculate effectiveness score based on how well model matches requirements
   */
  private calculateEffectivenessScore(model: ModelConfig, criteria: ModelSelectionCriteria): number {
    let score = 0.5; // Base score

    // Complexity matching
    if (criteria.complexity === 'simple' && model.strengths.includes('good_for_simple')) score += 0.3;
    if (criteria.complexity === 'moderate' && model.strengths.includes('good_for_moderate')) score += 0.3;
    if (criteria.complexity === 'complex' && model.strengths.includes('complex_reasoning')) score += 0.4;

    // Urgency matching
    if (criteria.urgency === 'high' && model.strengths.includes('fast')) score += 0.2;
    if (criteria.urgency === 'low' && model.costPer1kTokens < 0.5) score += 0.1;

    // Context length efficiency
    if (model.contextWindow > criteria.contextLength * 2) score += 0.1;

    // Customer tier alignment
    if (criteria.customerTier === 'enterprise' && model.costPer1kTokens > 1.0) score += 0.2;
    if (criteria.customerTier === 'standard' && model.costPer1kTokens < 0.2) score += 0.1;

    return Math.min(score, 1.0); // Cap at 1.0
  }

  /**
   * Calculate estimated cost for token usage
   */
  private calculateCost(model: ModelConfig, tokens: number): number {
    return (model.costPer1kTokens * tokens) / 1000;
  }

  /**
   * Get the appropriate client for the selected model
   */
  getModelClient(modelConfig: ModelConfig): VertexAI | OpenAI {
    if (modelConfig.provider === 'vertex') {
      return this.vertexAI;
    } else {
      return this.openAI;
    }
  }

  /**
   * Create Vertex AI model instance
   */
  createVertexModel(modelConfig: ModelConfig) {
    return this.vertexAI.getGenerativeModel({
      model: modelConfig.modelId,
      generationConfig: {
        temperature: modelConfig.temperature || 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: modelConfig.maxTokens || 2048,
      },
    });
  }

  /**
   * Get all available models for debugging/monitoring
   */
  getAvailableModels(): ModelConfig[] {
    return [...this.models];
  }

  /**
   * Estimate tokens for a given text length (rough approximation)
   */
  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for most languages
    return Math.ceil(text.length / 4);
  }
}