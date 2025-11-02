import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { EXPENSE_CATEGORIES } from '../config/constants';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { groupId, startDate, endDate, category, limit = '50', offset = '0' } = req.query;

    const where: any = {
      OR: [
        { payerId: req.userId },
        { splits: { some: { userId: req.userId } } },
      ],
    };

    if (groupId) {
      where.groupId = groupId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (category) {
      where.category = category;
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Failed to get expenses' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, description, date, category, payerId, groupId, receiptImage, splitType, splits } = req.body;

    // Validate category
    if (!EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate split totals
    let totalSplit = 0;
    if (splitType === 'equal') {
      totalSplit = amount;
    } else if (splitType === 'unequal' || splitType === 'shares') {
      totalSplit = splits.reduce((sum: number, split: { amount: number }) => sum + split.amount, 0);
    } else if (splitType === 'percentage') {
      const percentages = splits.reduce((sum: number, split: { percentage: number }) => sum + split.percentage, 0);
      if (Math.abs(percentages - 100) > 0.01) {
        return res.status(400).json({ message: 'Percentages must sum to 100' });
      }
      totalSplit = amount;
    }

    if (Math.abs(totalSplit - amount) > 0.01) {
      return res.status(400).json({ message: 'Split amounts do not match expense amount' });
    }

    // Check group membership if groupId provided
    if (groupId) {
      const groupMember = await prisma.groupMember.findFirst({
        where: {
          groupId,
          userId: req.userId,
        },
      });

      if (!groupMember) {
        return res.status(403).json({ message: 'You are not a member of this group' });
      }
    }

    // Create expense and splits
    const expense = await prisma.expense.create({
      data: {
        amount,
        description,
        date: new Date(date),
        category,
        payerId,
        groupId,
        createdBy: req.userId,
        receiptImage,
        splits: {
          create: splits.map((split: any) => {
            let amountOwed = 0;
            if (splitType === 'equal') {
              amountOwed = amount / splits.length;
            } else if (splitType === 'percentage') {
              amountOwed = (amount * split.percentage) / 100;
            } else {
              amountOwed = split.amount;
            }

            return {
              userId: split.userId,
              amountOwed,
            };
          }),
        },
      },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        OR: [
          { payerId: req.userId },
          { splits: { some: { userId: req.userId } } },
        ],
      },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or access denied' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Failed to get expense' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, description, date, category, payerId, splits } = req.body;

    // Check if user is creator
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        createdBy: req.userId,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or you are not the creator' });
    }

    // Validate category if provided
    if (category && !EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Update expense with transaction to handle split changes
    const updatedExpense = await prisma.$transaction(async (tx) => {
      // First, update the expense basic fields
      const updated = await tx.expense.update({
        where: { id },
        data: {
          ...(amount && { amount }),
          ...(description && { description }),
          ...(date && { date: new Date(date) }),
          ...(category && { category }),
          ...(payerId && { payerId }),
        },
      });

      // If splits are provided, update them
      if (splits && Array.isArray(splits) && splits.length > 0) {
        // Delete existing splits
        await tx.expenseSplit.deleteMany({
          where: { expenseId: id },
        });

        // Create new splits
        await Promise.all(
          splits.map((split: any) =>
            tx.expenseSplit.create({
              data: {
                expenseId: id,
                userId: split.userId,
                amountOwed: split.amount || 0,
              },
            })
          )
        );
      }

      // Return the updated expense with all relations
      return await tx.expense.findUnique({
        where: { id },
        include: {
          payer: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
            },
          },
          splits: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  profilePicture: true,
                },
              },
            },
          },
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is creator
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        createdBy: req.userId,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or you are not the creator' });
    }

    await prisma.expense.delete({
      where: { id },
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

