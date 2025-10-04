# AI Model Cost Optimization Guide

This document explains how to use different AI models for different tasks to optimize costs while maintaining quality customer support.

## Overview

The system now intelligently selects AI models based on:
- **Task complexity** (simple, moderate, complex)
- **Customer tier** (standard, premium, enterprise)
- **Communication channel** (SMS, voice, email, chat)
- **Urgency level** (low, normal, high)
- **Context requirements** (length, reasoning needed, creativity needed)

## Available Models

### Google Gemini Models
| Model | Provider | Cost per 1k tokens | Use Case | Strengths |
|-------|----------|-------------------|----------|-----------|
| Gemini 1.5 Flash | Google | $0.075 | Simple queries | Fast, efficient, multimodal |
| Gemini 2.5 Flash | Google | $0.15 | General purpose | Balanced performance, latest features |
| Gemini 1.5 Pro | Google | $1.25 | Complex tasks | Large context (2M tokens), advanced reasoning |

### Anthropic Claude Models
| Model | Provider | Cost per 1k tokens | Use Case | Strengths |
|-------|----------|-------------------|----------|-----------|
| **Claude Opus 4.1** | Anthropic | $15.00 input / $75.00 output | **Latest premium model** | Latest premium features, highest quality, advanced reasoning, multilingual |
| **Claude 4.5 Sonnet** | Anthropic | $3.00 input / $15.00 output | **Latest general purpose** | Latest features, balanced performance, creative tasks, coding |
| Claude 3.5 Haiku | Anthropic | $0.25 input / $1.25 output | Simple queries | Fastest Claude, cost-effective, quick responses |
| Claude 3.5 Sonnet | Anthropic | $3.00 input / $15.00 output | General purpose | Balanced performance, creative tasks, coding |
| Claude 3 Opus | Anthropic | $15.00 input / $75.00 output | Complex tasks | Highest quality, nuanced understanding, multilingual |
| Claude 3 Haiku | Anthropic | $0.25 input / $1.25 output | Simple queries | Previous version, stable, cost-effective |
| Claude 3 Sonnet | Anthropic | $3.00 input / $15.00 output | General purpose | Previous version, balanced performance |
| Claude Instant 1.2 | Anthropic | $0.80 input / $2.40 output | Legacy support | Older model, budget option, basic tasks |

### OpenAI GPT Models
| Model | Provider | Cost per 1k tokens | Use Case | Strengths |
|-------|----------|-------------------|----------|-----------|
| GPT-4o | OpenAI | $5.00 input / $15.00 output | Premium features | Creative, nuanced understanding, vision |
| GPT-4o-mini | OpenAI | $0.15 | Simple tasks | Most cost-effective GPT option |

### xAI Grok Models
| Model | Provider | Cost per 1k tokens | Use Case | Strengths |
|-------|----------|-------------------|----------|-----------|
| **Grok-2** | xAI | $2.00 input / $10.00 output | **Latest xAI model** | Latest features, helpful, maximal truth-seeking, real-time access |
| Grok-1.5 | xAI | $1.00 input / $5.00 output | General purpose | Balanced performance, helpful, real-time access |
| Grok-1 | xAI | $0.50 input / $2.50 output | Simple tasks | Cost-effective, helpful, basic tasks |

## Claude Model Deep Dive

### Claude 3.5 Haiku
- **Best for**: Simple queries, quick responses, cost-sensitive applications
- **Performance**: Fastest Claude model, optimized for speed
- **Cost**: Most affordable Claude option ($0.25 input / $1.25 output per 1k tokens)
- **Use cases**: SMS responses, basic customer inquiries, real-time chat
- **Advantages**:
  - 3x faster than Claude 3 Sonnet
  - Excellent for straightforward tasks
  - Lower latency for real-time interactions

### Claude 4.5 Sonnet
- **Best for**: Latest general purpose, creative tasks, coding assistance
- **Performance**: Latest features with balanced speed and intelligence
- **Cost**: Moderate pricing ($3.00 input / $15.00 output per 1k tokens)
- **Use cases**: Customer support, content generation, code review, latest AI features
- **Advantages**:
  - Latest Claude model with newest capabilities
  - Strong coding capabilities
  - Creative writing and content creation
  - Best balance of cost and performance
  - Excellent for conversational AI

### Claude 3.5 Sonnet
- **Best for**: General purpose, creative tasks, coding assistance
- **Performance**: Balanced speed and intelligence
- **Cost**: Moderate pricing ($3.00 input / $15.00 output per 1k tokens)
- **Use cases**: Customer support, content generation, code review
- **Advantages**:
  - Strong coding capabilities
  - Creative writing and content creation
  - Good balance of cost and performance
  - Excellent for conversational AI

### Claude Opus 4.1
- **Best for**: Latest premium tasks, complex analysis, nuanced understanding, multilingual tasks
- **Performance**: Latest highest quality Claude model with enhanced capabilities
- **Cost**: Premium pricing ($15.00 input / $75.00 output per 1k tokens)
- **Use cases**: Enterprise customers, complex problem-solving, international support, latest AI features
- **Advantages**:
  - Latest premium Claude model with newest capabilities
  - Superior reasoning capabilities
  - Excellent multilingual support
  - Best for creative and analytical tasks
  - Highest context understanding

### Claude 3 Opus
- **Best for**: Complex analysis, nuanced understanding, multilingual tasks
- **Performance**: Highest quality Claude model
- **Cost**: Premium pricing ($15.00 input / $75.00 output per 1k tokens)
- **Use cases**: Enterprise customers, complex problem-solving, international support
- **Advantages**:
  - Superior reasoning capabilities
  - Excellent multilingual support
  - Best for creative and analytical tasks
  - Highest context understanding

### Claude 3 Haiku
- **Best for**: Simple queries, previous version stability, budget-conscious applications
- **Performance**: Fast and reliable, slightly slower than 3.5 Haiku but very stable
- **Cost**: Same as 3.5 Haiku ($0.25 input / $1.25 output per 1k tokens)
- **Use cases**: SMS responses, basic inquiries, when stability is preferred over latest features
- **Advantages**:
  - Proven track record and stability
  - Same cost as latest version
  - Good for straightforward tasks

### Claude 3 Sonnet
- **Best for**: General purpose, previous version reliability, balanced workloads
- **Performance**: Well-tested and reliable, slightly less advanced than 3.5 Sonnet
- **Cost**: Same as 3.5 Sonnet ($3.00 input / $15.00 output per 1k tokens)
- **Use cases**: Customer support, content generation, when proven reliability is needed
- **Advantages**:
  - Extensive testing and proven performance
  - Same cost as latest version
  - Excellent for production environments

### Claude Instant 1.2
- **Best for**: Legacy support, basic tasks, budget applications
- **Performance**: Older model, faster than some newer options for simple tasks
- **Cost**: Very affordable ($0.80 input / $2.40 output per 1k tokens)
- **Use cases**: Simple queries, legacy system support, when cost is the primary concern
- **Advantages**:
  - Lowest cost option among Claude models
  - Fast response times for basic tasks
  - Good for high-volume, low-complexity requests

## xAI Grok Models Deep Dive

### Grok-2
- **Best for**: Latest xAI features, helpful responses, maximal truth-seeking
- **Performance**: Latest Grok model with enhanced capabilities
- **Cost**: Moderate pricing ($2.00 input / $10.00 output per 1k tokens)
- **Use cases**: General purpose, customer support, when latest xAI features are needed
- **Advantages**:
  - Built by xAI with unique perspective
  - Focus on maximal truth-seeking
  - Real-time access to information
  - Helpful and engaging responses

### Grok-1.5
- **Best for**: General purpose, balanced performance, cost-effective xAI option
- **Performance**: Well-tested and reliable
- **Cost**: Affordable pricing ($1.00 input / $5.00 output per 1k tokens)
- **Use cases**: Customer support, general inquiries, when xAI perspective is valued
- **Advantages**:
  - Good balance of cost and performance
  - Real-time information access
  - Helpful and truthful responses
  - Built by xAI ecosystem

### Grok-1
- **Best for**: Simple tasks, budget applications, basic customer support
- **Performance**: Fast and efficient for straightforward tasks
- **Cost**: Very affordable ($0.50 input / $2.50 output per 1k tokens)
- **Use cases**: Simple queries, high-volume basic tasks, cost-sensitive applications
- **Advantages**:
  - Most cost-effective xAI option
  - Quick response times
  - Helpful for basic tasks
  - xAI's foundational model

## When to Use Different AI Providers

### Choose xAI Grok When:
- **xAI perspective**: When you want responses aligned with xAI's philosophy
- **Truth-seeking**: Grok models are designed for maximal truth-seeking
- **Real-time info**: Grok has real-time access to information
- **Engaging responses**: Grok is known for being helpful and engaging
- **Cost alternatives**: Good middle-ground pricing between basic and premium models

## When to Use Claude Models

### Choose Claude When:
- **Creative tasks**: Claude 3.5 Sonnet excels at content generation and creative writing
- **Coding tasks**: Claude models have superior coding capabilities and code understanding
- **Speed is critical**: Claude 3.5 Haiku is the fastest option for simple queries
- **Multilingual support**: Claude 3 Opus provides excellent language understanding
- **Balanced performance**: Claude 3.5 Sonnet offers great value for general use

### Choose Gemini When:
- **Multimodal tasks**: Gemini models handle text, images, and other media types
- **Large context windows**: Gemini 1.5 Pro supports up to 2M tokens
- **Google ecosystem integration**: Better for Google Cloud environments
- **Cost-sensitive simple tasks**: Gemini 1.5 Flash is the cheapest option

### Choose GPT When:
- **Vision tasks**: GPT-4o excels at image understanding and analysis
- **Specific OpenAI features**: When you need GPT-specific capabilities
- **Enterprise integrations**: For existing OpenAI ecosystem investments

## Cost Optimization Strategies

### 1. Complexity-Based Selection

- **Simple queries** (short, straightforward questions) → Gemini 1.5 Flash, Claude 3.5 Haiku, Grok-1, or GPT-4o-mini
- **Moderate queries** (standard support requests) → Claude 4.5 Sonnet, Claude 3.5 Sonnet, Grok-2, Grok-1.5, or Gemini 2.5 Flash
- **Complex queries** (detailed analysis, troubleshooting) → Claude Opus 4.1, Claude 3 Opus, Gemini 1.5 Pro, Grok-2, or GPT-4o

### 2. Channel-Based Optimization

- **SMS**: Prioritizes cost efficiency due to character limits
- **Voice**: Balances speed and quality for real-time interaction
- **Email**: Can use higher-quality models for detailed responses
- **Chat**: Uses balanced approach for conversational support

### 3. Customer Tier Optimization

- **Standard customers**: Cost-optimized models only
- **Premium customers**: Balanced cost/quality models
- **Enterprise customers**: Premium models for best experience

### 4. Time-Based Optimization

- **Business hours**: Normal model selection
- **Off-hours**: Increased cost optimization when appropriate

## Configuration

### Environment Variables

```bash
# Enable/disable dynamic model selection
MODEL_SELECTION_ENABLED=true

# Default fallback model
DEFAULT_AI_MODEL=gemini-1.5-flash

# Cost optimization settings
COST_OPTIMIZATION_ENABLED=true
MAX_DAILY_BUDGET=50.0
BUDGET_ALERT_THRESHOLD=0.8
PRIORITIZE_COST_OVER_QUALITY=false

# Monitoring settings
MONITORING_ENABLED=true
COST_ALERT_THRESHOLD=100.0
PERFORMANCE_ALERT_THRESHOLD=10000
LOG_LEVEL=info
```

### Configuration File

The system uses `backend/src/config/modelSelectionConfig.ts` for detailed configuration:

```typescript
export const defaultModelSelectionConfig: ModelSelectionConfig = {
  enabled: true,
  costOptimization: {
    enabled: true,
    maxDailyBudget: 50.0,
    budgetAlertThreshold: 0.8,
    prioritizeCostOverQuality: false
  },
  channelRules: {
    sms: {
      preferredModels: ['gemini-1.5-flash', 'gpt-4o-mini'],
      maxResponseTime: 5000,
      costPriority: 'high'
    }
    // ... other channels
  }
  // ... more configuration options
};
```

## Monitoring and Analytics

### Cost Tracking

The system automatically tracks:
- Model usage by type and channel
- Cost per request and per customer
- Performance metrics (response time)
- Success/failure rates

### Cost Analysis Endpoints

```typescript
// Get current day metrics
const metrics = await costTrackingService.getCurrentDayMetrics();

// Get cost trends over time
const trends = await costTrackingService.getCostTrends(7);

// Get optimization recommendations
const recommendations = await costTrackingService.getOptimizationRecommendations();
```

### Budget Monitoring

```typescript
// Check if within budget
const budgetStatus = await costTrackingService.checkBudgetAlert(dailyBudget);

// Get cost summary for date range
const summary = await costTrackingService.getCostSummary(startDate, endDate);
```

## Expected Cost Savings

Based on typical usage patterns:

| Scenario | Before (Always Gemini 2.5 Flash) | After (Dynamic Selection) | Savings |
|----------|----------------------------------|---------------------------|---------|
| Simple SMS queries | $0.15/1k tokens | $0.075/1k tokens (Gemini 1.5 Flash) | 50% |
| Quick responses | $0.15/1k tokens | $0.25/1k input (Claude 3.5 Haiku) | Variable* |
| Mixed support load | $0.15/1k tokens | $0.12/1k tokens average | 20% |
| Enterprise complex queries | $0.15/1k tokens | $15.00/1k input (Claude 3 Opus) | -9900%** |

*Claude 3.5 Haiku offers different pricing but superior speed for simple tasks
**Enterprise queries use more expensive models for better quality, but represent only ~10% of total requests and provide significantly better results

## Testing and Validation

### Run Cost Effectiveness Tests

```bash
cd backend
npx tsx scripts/validateCostEffectiveness.ts
```

This script will:
1. Test model selection for various scenarios
2. Run simulated load tests
3. Calculate potential cost savings
4. Validate configuration is working correctly

### Unit Tests

```bash
cd backend
npm run test  # Includes ModelSelectionService tests
```

## Troubleshooting

### Common Issues

1. **Models not switching as expected**
   - Check configuration in `modelSelectionConfig.ts`
   - Verify environment variables are set correctly
   - Review logs for model selection reasoning

2. **Cost higher than expected**
   - Run validation script to check model selection
   - Review cost tracking data for usage patterns
   - Adjust complexity detection thresholds

3. **Performance issues**
   - Check if urgency detection is working correctly
   - Verify model response times meet requirements
   - Review channel-specific rules

### Debugging

Enable debug logging:

```bash
export LOG_LEVEL=debug
```

Monitor model selection decisions:

```typescript
// The system logs all model selection decisions with reasoning
logger.info('Using dynamic model selection', {
  sessionId,
  originalModel: 'gemini-2.5-flash',
  selectedModel: selectedModel.config.name,
  estimatedCost: selectedModel.estimatedCost,
  reasoning: selectedModel.reasoning
});
```

## Best Practices

1. **Start conservative**: Begin with moderate cost optimization and adjust based on results
2. **Monitor regularly**: Review cost trends and model usage patterns weekly
3. **Test thoroughly**: Use the validation script before deploying changes
4. **Customer-focused**: Always prioritize customer experience over cost savings
5. **Gradual rollout**: Implement for specific channels first, then expand

## Support

For issues or questions about cost optimization:
1. Check the validation script output
2. Review cost tracking data in Firestore
3. Examine application logs for model selection details
4. Test with specific scenarios using the validation script