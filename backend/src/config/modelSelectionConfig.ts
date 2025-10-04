export interface ModelSelectionConfig {
  // Enable/disable dynamic model selection
  enabled: boolean;

  // Default fallback model when selection fails
  defaultModel: string;

  // Cost optimization settings
  costOptimization: {
    enabled: boolean;
    maxDailyBudget?: number;
    budgetAlertThreshold: number; // Alert when spending exceeds X% of budget
    prioritizeCostOverQuality: boolean;
  };

  // Model-specific overrides
  modelOverrides: {
    [key: string]: {
      enabled: boolean;
      maxTokens?: number;
      temperature?: number;
      priority?: 'cost' | 'quality' | 'speed' | 'balanced';
    };
  };

  // Channel-specific rules
  channelRules: {
    sms: {
      preferredModels: string[];
      maxResponseTime: number;
      costPriority: 'low' | 'medium' | 'high';
    };
    voice: {
      preferredModels: string[];
      maxResponseTime: number;
      costPriority: 'low' | 'medium' | 'high';
    };
    email: {
      preferredModels: string[];
      maxResponseTime: number;
      costPriority: 'low' | 'medium' | 'high';
    };
    chat: {
      preferredModels: string[];
      maxResponseTime: number;
      costPriority: 'low' | 'medium' | 'high';
    };
  };

  // Customer tier rules
  customerTierRules: {
    standard: {
      allowedModels: string[];
      maxCostPerRequest: number;
      priority: 'cost';
    };
    premium: {
      allowedModels: string[];
      maxCostPerRequest: number;
      priority: 'balanced';
    };
    enterprise: {
      allowedModels: string[];
      maxCostPerRequest: number;
      priority: 'quality';
    };
  };

  // Complexity-based rules
  complexityRules: {
    simple: {
      preferredModels: string[];
      maxTokens: number;
      temperature: number;
    };
    moderate: {
      preferredModels: string[];
      maxTokens: number;
      temperature: number;
    };
    complex: {
      preferredModels: string[];
      maxTokens: number;
      temperature: number;
    };
  };

  // Business hours vs off-hours optimization
  timeBasedRules: {
    businessHours: {
      startHour: number;
      endHour: number;
      costPriority: 'low' | 'medium' | 'high';
    };
    offHours: {
      costPriority: 'low' | 'medium' | 'high';
      reduceQuality: boolean;
    };
  };

  // Monitoring and alerting
  monitoring: {
    enabled: boolean;
    costAlertThreshold: number;
    performanceAlertThreshold: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

export const defaultModelSelectionConfig: ModelSelectionConfig = {
  enabled: true,
  defaultModel: 'gemini-2.5-flash',

  costOptimization: {
    enabled: true,
    maxDailyBudget: 50.0, // $50 per day
    budgetAlertThreshold: 0.8, // Alert at 80% of budget
    prioritizeCostOverQuality: false
  },

  modelOverrides: {
    'gemini-2.5-flash': {
      enabled: true,
      maxTokens: 8192,
      temperature: 0.7,
      priority: 'balanced'
    },
    'gemini-1.5-flash': {
      enabled: true,
      maxTokens: 8192,
      temperature: 0.7,
      priority: 'cost'
    },
    'claude-3-5-haiku': {
      enabled: true,
      maxTokens: 8192,
      temperature: 0.7,
      priority: 'cost'
    },
    'claude-4-5-sonnet': {
      enabled: true,
      maxTokens: 8192,
      temperature: 0.7,
      priority: 'balanced'
    },
    'claude-3-5-sonnet': {
      enabled: true,
      maxTokens: 8192,
      temperature: 0.7,
      priority: 'balanced'
    },
    'claude-3-haiku': {
      enabled: true,
      maxTokens: 4096,
      temperature: 0.7,
      priority: 'cost'
    },
    'claude-3-sonnet': {
      enabled: true,
      maxTokens: 4096,
      temperature: 0.7,
      priority: 'balanced'
    },
    'claude-instant-1.2': {
      enabled: true,
      maxTokens: 4096,
      temperature: 0.7,
      priority: 'cost'
    },
    'gemini-1.5-pro': {
      enabled: true,
      maxTokens: 32768,
      temperature: 0.3,
      priority: 'quality'
    },
    'claude-opus-4.1': {
      enabled: true,
      maxTokens: 4096,
      temperature: 0.7,
      priority: 'quality'
    },
    'claude-3-opus': {
      enabled: true,
      maxTokens: 4096,
      temperature: 0.7,
      priority: 'quality'
    },
    'gpt-4o': {
      enabled: true,
      maxTokens: 16384,
      temperature: 0.7,
      priority: 'quality'
    },
    'gpt-4o-mini': {
      enabled: true,
      maxTokens: 16384,
      temperature: 0.7,
      priority: 'cost'
    },
    'grok-2': {
      enabled: true,
      maxTokens: 4096,
      temperature: 0.7,
      priority: 'balanced'
    },
    'grok-1.5': {
      enabled: true,
      maxTokens: 4096,
      temperature: 0.7,
      priority: 'cost'
    },
    'grok-1': {
      enabled: true,
      maxTokens: 2048,
      temperature: 0.7,
      priority: 'cost'
    }
  },

  channelRules: {
    sms: {
      preferredModels: ['gemini-1.5-flash', 'claude-3-5-haiku', 'claude-3-haiku', 'claude-instant-1.2', 'grok-1', 'gpt-4o-mini'],
      maxResponseTime: 5000, // 5 seconds
      costPriority: 'high' // Prioritize cost for SMS
    },
    voice: {
      preferredModels: ['claude-3-5-haiku', 'claude-3-haiku', 'grok-2', 'gemini-2.5-flash', 'gemini-1.5-pro'],
      maxResponseTime: 3000, // 3 seconds for real-time
      costPriority: 'medium'
    },
    email: {
      preferredModels: ['claude-opus-4.1', 'claude-4-5-sonnet', 'claude-3-5-sonnet', 'claude-3-sonnet', 'grok-2', 'gemini-1.5-pro', 'claude-3-opus', 'gpt-4o'],
      maxResponseTime: 30000, // 30 seconds
      costPriority: 'low' // Can use higher quality for email
    },
    chat: {
      preferredModels: ['claude-4-5-sonnet', 'claude-3-5-sonnet', 'claude-3-sonnet', 'grok-2', 'gemini-2.5-flash', 'gemini-1.5-flash'],
      maxResponseTime: 10000, // 10 seconds
      costPriority: 'medium'
    }
  },

  customerTierRules: {
    standard: {
      allowedModels: ['gemini-1.5-flash', 'claude-3-5-haiku', 'claude-3-haiku', 'claude-instant-1.2', 'grok-1', 'gpt-4o-mini'],
      maxCostPerRequest: 0.01, // $0.01 max per request
      priority: 'cost'
    },
    premium: {
      allowedModels: ['claude-4-5-sonnet', 'claude-3-5-sonnet', 'claude-3-sonnet', 'grok-2', 'gemini-2.5-flash', 'gemini-1.5-flash', 'claude-3-5-haiku', 'claude-3-haiku', 'gpt-4o-mini'],
      maxCostPerRequest: 0.05, // $0.05 max per request
      priority: 'balanced'
    },
    enterprise: {
      allowedModels: ['claude-opus-4.1', 'claude-4-5-sonnet', 'claude-3-5-sonnet', 'claude-3-sonnet', 'claude-3-opus', 'grok-2', 'gemini-1.5-pro', 'gpt-4o', 'gemini-2.5-flash'],
      maxCostPerRequest: 0.20, // $0.20 max per request
      priority: 'quality'
    }
  },

  complexityRules: {
    simple: {
      preferredModels: ['gemini-1.5-flash', 'claude-3-5-haiku', 'claude-3-haiku', 'claude-instant-1.2', 'grok-1', 'gpt-4o-mini'],
      maxTokens: 1000,
      temperature: 0.5
    },
    moderate: {
      preferredModels: ['claude-4-5-sonnet', 'claude-3-5-sonnet', 'claude-3-sonnet', 'grok-2', 'grok-1.5', 'gemini-2.5-flash', 'gemini-1.5-flash'],
      maxTokens: 4000,
      temperature: 0.7
    },
    complex: {
      preferredModels: ['claude-opus-4.1', 'claude-3-opus', 'gemini-1.5-pro', 'gpt-4o', 'claude-4-5-sonnet', 'claude-3-5-sonnet', 'claude-3-sonnet', 'grok-2'],
      maxTokens: 16000,
      temperature: 0.3
    }
  },

  timeBasedRules: {
    businessHours: {
      startHour: 9,
      endHour: 17,
      costPriority: 'medium' // Normal priority during business hours
    },
    offHours: {
      costPriority: 'high', // Prioritize cost savings outside business hours
      reduceQuality: false
    }
  },

  monitoring: {
    enabled: true,
    costAlertThreshold: 100.0, // Alert if daily cost exceeds $100
    performanceAlertThreshold: 10000, // Alert if response time exceeds 10 seconds
    logLevel: 'info'
  }
};

/**
 * Load configuration from environment variables with fallbacks to defaults
 */
export function loadModelSelectionConfig(): ModelSelectionConfig {
  return {
    ...defaultModelSelectionConfig,
    enabled: process.env.MODEL_SELECTION_ENABLED !== 'false',
    defaultModel: process.env.DEFAULT_AI_MODEL || defaultModelSelectionConfig.defaultModel,

    costOptimization: {
      ...defaultModelSelectionConfig.costOptimization,
      enabled: process.env.COST_OPTIMIZATION_ENABLED !== 'false',
      maxDailyBudget: process.env.MAX_DAILY_BUDGET ? parseFloat(process.env.MAX_DAILY_BUDGET) : defaultModelSelectionConfig.costOptimization.maxDailyBudget || 50.0,
      budgetAlertThreshold: process.env.BUDGET_ALERT_THRESHOLD ? parseFloat(process.env.BUDGET_ALERT_THRESHOLD) : defaultModelSelectionConfig.costOptimization.budgetAlertThreshold,
      prioritizeCostOverQuality: process.env.PRIORITIZE_COST_OVER_QUALITY === 'true'
    },

    monitoring: {
      ...defaultModelSelectionConfig.monitoring,
      enabled: process.env.MONITORING_ENABLED !== 'false',
      costAlertThreshold: process.env.COST_ALERT_THRESHOLD ? parseFloat(process.env.COST_ALERT_THRESHOLD) : defaultModelSelectionConfig.monitoring.costAlertThreshold,
      performanceAlertThreshold: process.env.PERFORMANCE_ALERT_THRESHOLD ? parseInt(process.env.PERFORMANCE_ALERT_THRESHOLD) : defaultModelSelectionConfig.monitoring.performanceAlertThreshold,
      logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || defaultModelSelectionConfig.monitoring.logLevel
    }
  };
}