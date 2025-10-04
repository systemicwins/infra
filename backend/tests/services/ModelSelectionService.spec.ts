import { ModelSelectionService, ModelSelectionCriteria } from '../../src/services/ModelSelectionService.js';

describe('ModelSelectionService', () => {
  let service: ModelSelectionService;

  beforeEach(() => {
    service = new ModelSelectionService();
  });

  describe('selectModel', () => {
    it('should select cheapest model for simple queries', () => {
      const criteria: ModelSelectionCriteria = {
        complexity: 'simple',
        urgency: 'low',
        contextLength: 5,
        channel: 'sms',
        customerTier: 'standard'
      };

      const result = service.selectModel(criteria, 100);

      expect(result.config.name).toBe('Gemini 1.5 Flash');
      expect(result.estimatedCost).toBeLessThan(0.01);
    });

    it('should select balanced model for moderate complexity', () => {
      const criteria: ModelSelectionCriteria = {
        complexity: 'moderate',
        urgency: 'normal',
        contextLength: 15,
        channel: 'chat',
        customerTier: 'premium'
      };

      const result = service.selectModel(criteria, 500);

      expect(['Claude 4.5 Sonnet', 'Claude 3.5 Sonnet', 'Claude 3 Sonnet', 'Grok-2', 'Grok-1.5', 'Gemini 2.5 Flash', 'Gemini 1.5 Flash']).toContain(result.config.name);
    });

    it('should select premium model for complex enterprise queries', () => {
      const criteria: ModelSelectionCriteria = {
        complexity: 'complex',
        urgency: 'high',
        contextLength: 50,
        channel: 'email',
        customerTier: 'enterprise',
        requiresReasoning: true
      };

      const result = service.selectModel(criteria, 2000);

      expect(['Claude Opus 4.1', 'Claude 3 Opus', 'Gemini 1.5 Pro', 'Grok-2', 'GPT-4o']).toContain(result.config.name);
    });

    it('should prioritize speed for urgent voice requests', () => {
      const criteria: ModelSelectionCriteria = {
        complexity: 'simple',
        urgency: 'high',
        contextLength: 3,
        channel: 'voice',
        customerTier: 'standard'
      };

      const result = service.selectModel(criteria, 200);

      // Should select a fast model
      expect(result.config.strengths).toContain('fast');
    });
  });

  describe('estimateTokens', () => {
    it('should estimate tokens correctly for typical text', () => {
      const text = 'This is a test message for token estimation';
      const tokens = service.estimateTokens(text);

      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(text.length); // Should be less than character count
    });

    it('should handle empty strings', () => {
      const tokens = service.estimateTokens('');
      expect(tokens).toBe(0);
    });
  });

  describe('cost calculation', () => {
    it('should calculate cost correctly', () => {
      const model = service.getAvailableModels()[0];
      const tokens = 1000;
      const expectedCost = (model.costPer1kTokens * tokens) / 1000;

      // Access private method through type assertion for testing
      const cost = (service as any).calculateCost(model, tokens);
      expect(cost).toBe(expectedCost);
    });
  });
});