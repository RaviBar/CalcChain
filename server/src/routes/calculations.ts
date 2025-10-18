import express, { Response } from 'express'; // FIX: Imported Response
import { body, validationResult } from 'express-validator';
import { CalculationModel, CalculationWithUser } from '../models/Calculation';
import { performOperation, isValidOperation } from '../utils/operations';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper function to build tree structure
function buildCalculationTree(calculations: CalculationWithUser[]): any[] {
  const calculationMap = new Map();
  const roots: any[] = [];

  calculations.forEach(calc => {
    calculationMap.set(calc.id, { ...calc, children: [] });
  });

  calculations.forEach(calc => {
    if (calc.parent_id === null) {
      roots.push(calculationMap.get(calc.id));
    } else {
      const parent = calculationMap.get(calc.parent_id);
      if (parent) {
        parent.children.push(calculationMap.get(calc.id));
      }
    }
  });

  return roots;
}


// Get all calculation trees
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => { // FIX: Added Response type
  try {
    const calculations = await CalculationModel.findCalculationTree();
    const tree = buildCalculationTree(calculations);
    
    return res.json({
      calculations: tree,
      user: req.user || null
    });
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new calculation (starting number or operation)
router.post('/', authenticateToken, [
  body('number').isNumeric().withMessage('Number must be a valid number'),
  body('parentId').optional().isInt().withMessage('Parent ID must be a valid integer'),
  body('operation').optional().isIn(['+', '-', '*', '/']).withMessage('Operation must be one of: +, -, *, /')
], async (req: AuthRequest, res: Response) => { // FIX: Added Response type
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { number, parentId, operation } = req.body;
    const userId = req.user!.id;

    let result: number;
    let finalOperation: string | null = null;

    if (parentId) {
      if (!operation || !isValidOperation(operation)) {
        return res.status(400).json({ error: 'A valid operation is required when parentId is provided' });
      }

      const parentCalculation = await CalculationModel.findById(parentId);
      if (!parentCalculation) {
        return res.status(404).json({ error: 'Parent calculation not found' });
      }

      const operationResult = performOperation(parentCalculation.result, operation, number);
      if (!operationResult.isValid) {
        return res.status(400).json({ error: operationResult.error });
      }

      result = operationResult.result;
      finalOperation = operation;
    } else {
      if (operation) {
        return res.status(400).json({ error: 'Operation should not be provided for starting numbers' });
      }
      result = number;
    }

    const calculation = await CalculationModel.create({
      user_id: userId,
      parent_id: parentId || null,
      operation: finalOperation,
      number,
      result
    });

    const calculationWithUser = await CalculationModel.findByIdWithUser(calculation.id);
    
    return res.status(201).json({
      message: 'Calculation created successfully',
      calculation: calculationWithUser
    });
  } catch (error) {
    console.error('Error creating calculation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get children of a specific calculation
router.get('/:id/children', optionalAuth, async (req: AuthRequest, res: Response) => { // FIX: Added Response type
  try {
    const parentId = parseInt(req.params.id, 10);
    if (isNaN(parentId)) {
      return res.status(400).json({ error: 'Invalid calculation ID' });
    }

    const children = await CalculationModel.findChildren(parentId);
    
    return res.json({
      children,
      user: req.user || null
    });
  } catch (error) {
    console.error('Error fetching calculation children:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;