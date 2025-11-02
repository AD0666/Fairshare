import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { calculateNetBalance, simplifyDebts } from '../utils/debtSimplifier';

export const createSettlement = async (req: Request, res: Response) => {
  try {
    const { receiverId, amount, groupId, date } = req.body;

    if (receiverId === req.userId) {
      return res.status(400).json({ message: 'Cannot settle with yourself' });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
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

    const settlement = await prisma.settlement.create({
      data: {
        payerId: req.userId,
        receiverId,
        amount,
        date: date ? new Date(date) : new Date(),
        groupId,
      },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    res.status(201).json(settlement);
  } catch (error) {
    console.error('Create settlement error:', error);
    res.status(500).json({ message: 'Failed to create settlement' });
  }
};

export const getSettlements = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.query;

    const where: any = {
      OR: [
        { payerId: req.userId },
        { receiverId: req.userId },
      ],
    };

    if (groupId) {
      where.groupId = groupId;
    }

    const settlements = await prisma.settlement.findMany({
      where,
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(settlements);
  } catch (error) {
    console.error('Get settlements error:', error);
    res.status(500).json({ message: 'Failed to get settlements' });
  }
};

export const getSimplifiedDebts = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.query;

    // Get all expenses involving this user in the specified group
    const whereClause: any = groupId ? { groupId } : {};
    
    const expenses = await prisma.expense.findMany({
      where: {
        ...whereClause,
        OR: [
          { payerId: req.userId },
          { splits: { some: { userId: req.userId } } },
        ],
      },
      include: {
        payer: true,
        splits: {
          include: {
            user: true,
          },
        },
      },
    });

    // Get unique users involved in these expenses
    const userIds = new Set<string>();
    expenses.forEach(expense => {
      userIds.add(expense.payerId);
      expense.splits.forEach(split => userIds.add(split.userId));
    });

    // Calculate net balance for each user
    const balances = await Promise.all(
      Array.from(userIds).map(async (userId) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true },
        });

        if (!user) return null;

        // Get expenses where this user paid
        const expensesPaid = await prisma.expense.findMany({
          where: {
            ...whereClause,
            payerId: userId,
          },
          include: {
            splits: {
              where: { userId: userId },
            },
          },
        });

        // Get expenses where this user owes
        const expensesOwed = await prisma.expense.findMany({
          where: {
            ...whereClause,
            splits: {
              some: { userId },
            },
          },
          include: {
            splits: {
              where: { userId },
            },
          },
        });

        const expensesPaidFormatted = expensesPaid.map(exp => ({
          amount: exp.amount,
          totalSplits: exp.splits.reduce((sum, s) => sum + s.amountOwed, 0),
          userSplit: exp.splits[0]?.amountOwed || 0,
        }));

        const expensesOwedFormatted = expensesOwed.map(exp => ({
          amount: exp.splits[0]?.amountOwed || 0,
        }));

        const netBalance = calculateNetBalance(expensesPaidFormatted, expensesOwedFormatted);

        return {
          userId: user.id,
          userName: user.name,
          netAmount: netBalance,
        };
      })
    );

    const validBalances = balances.filter(Boolean) as Array<{ userId: string; userName: string; netAmount: number }>;
    
    // Only include users with non-zero balances
    const nonZeroBalances = validBalances.filter(b => Math.abs(b.netAmount) > 0.01);

    // Simplify debts
    const simplified = simplifyDebts(nonZeroBalances);

    res.json({
      balances: nonZeroBalances,
      simplified: simplified,
    });
  } catch (error) {
    console.error('Get simplified debts error:', error);
    res.status(500).json({ message: 'Failed to calculate simplified debts' });
  }
};

