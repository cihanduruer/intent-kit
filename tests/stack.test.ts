import { StackSelector, Architecture } from '../src/core/stack';
import { ScaleLevel } from '../src/core/intent';

describe('StackSelector', () => {
  let selector: StackSelector;
  
  beforeEach(() => {
    selector = new StackSelector();
  });
  
  describe('selectStack', () => {
    it('should select monolith for solo scale', () => {
      const intent = {
        name: 'test',
        scale: ScaleLevel.SOLO,
        requirements: ['Build a web app']
      };
      
      const stack = selector.selectStack(intent);
      expect(stack.architecture).toBe(Architecture.MONOLITH);
    });
    
    it('should select microservices for enterprise scale', () => {
      const intent = {
        name: 'test',
        scale: ScaleLevel.ENTERPRISE,
        requirements: ['Build a large platform']
      };
      
      const stack = selector.selectStack(intent);
      expect(stack.architecture).toBe(Architecture.MICROSERVICES);
    });
    
    it('should select serverless when explicitly mentioned', () => {
      const intent = {
        name: 'test',
        scale: ScaleLevel.SOLO,
        requirements: ['Build a serverless API']
      };
      
      const stack = selector.selectStack(intent);
      expect(stack.architecture).toBe(Architecture.SERVERLESS);
    });
    
    it('should select jamstack for static sites', () => {
      const intent = {
        name: 'test',
        scale: ScaleLevel.SOLO,
        requirements: ['Build a static blog']
      };
      
      const stack = selector.selectStack(intent);
      expect(stack.architecture).toBe(Architecture.JAMSTACK);
    });
    
    it('should include websocket for real-time requirements', () => {
      const intent = {
        name: 'test',
        scale: ScaleLevel.STARTUP,
        requirements: ['Build a real-time chat app']
      };
      
      const stack = selector.selectStack(intent);
      expect(stack.technologies.messaging?.type).toBe('WebSocket');
    });
    
    it('should include database when storage is needed', () => {
      const intent = {
        name: 'test',
        scale: ScaleLevel.SOLO,
        requirements: ['Build an app with database']
      };
      
      const stack = selector.selectStack(intent);
      expect(stack.technologies.database).toBeDefined();
    });
    
    it('should respect language constraints', () => {
      const intent = {
        name: 'test',
        scale: ScaleLevel.SOLO,
        requirements: ['Build an API'],
        constraints: {
          languages: ['python']
        }
      };
      
      const stack = selector.selectStack(intent);
      expect(stack.technologies.backend?.language).toBe('Python');
    });
  });
});
