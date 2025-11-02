import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getBalance = async (req: Request, res: Response) => {
  try {
    // Get all expenses and splits involving this user
    const expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { payerId: req.userId },
          { splits: { some: { userId: req.userId } } },
        ],
      },
      include: {
        payer: {
          select: { id: true, name: true, profilePicture: true },
        },
        splits: {
          include: {
            user: {
              select: { id: true, name: true, profilePicture: true },
            },
          },
        },
      },
    });


    // Calculate individual balances with each person
    const balancesByPerson = new Map<string, any>();

    expenses.forEach(expense => {
      const payer = expense.payer;
      const userSplit = expense.splits.find(s => s.userId === req.userId);

      if (!userSplit) return;

      // If user paid the expense
      if (payer.id === req.userId) {
        // User paid the expense, so others owe them
        const otherParticipants = expense.splits.filter(s => s.userId !== req.userId);

        otherParticipants.forEach(split => {
          const balance = balancesByPerson.get(split.userId) || {
            userId: split.userId,
            userName: split.user.name,
            userProfilePicture: split.user.profilePicture,
            totalOwed: 0,
            totalReceiving: 0,
            netAmount: 0,
          };
          balance.totalReceiving += split.amountOwed;
          balance.netAmount = balance.totalReceiving - balance.totalOwed;
          balancesByPerson.set(split.userId, balance);
        });
      } else {
        // User owes money
        const balance = balancesByPerson.get(payer.id) || {
          userId: payer.id,
          userName: payer.name,
          userProfilePicture: payer.profilePicture,
          totalOwed: 0,
          totalReceiving: 0,
          netAmount: 0,
        };
        balance.totalOwed += userSplit.amountOwed;
        balance.netAmount = balance.totalReceiving - balance.totalOwed;
        balancesByPerson.set(payer.id, balance);
      }
    });

    const balances = Array.from(balancesByPerson.values()).filter(b => Math.abs(b.netAmount) > 0.01);

    // Calculate totals
    const totalOwed = balances.reduce((sum, b) => sum + (b.netAmount < 0 ? Math.abs(b.netAmount) : 0), 0);
    const totalReceiving = balances.reduce((sum, b) => sum + (b.netAmount > 0 ? b.netAmount : 0), 0);
    const netAmount = totalReceiving - totalOwed;

    res.json({
      balances,
      summary: {
        totalOwed,
        totalReceiving,
        netAmount,
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Failed to get balance' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupId } = req.query;

    const whereClause: any = {
      OR: [
        { payerId: req.userId },
        { splits: { some: { userId: req.userId } } },
      ],
    };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate as string);
      if (endDate) whereClause.date.lte = new Date(endDate as string);
    }

    if (groupId) {
      whereClause.groupId = groupId;
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        splits: {
          where: { userId: req.userId },
        },
      },
    });

    // Calculate stats by category
    const categoryStats = new Map<string, { total: number; count: number }>();
    const monthlyStats = new Map<string, { total: number; count: number }>();

    let totalSpent = 0;
    let totalPaid = 0;

    expenses.forEach(expense => {
      const userSplit = expense.splits[0];
      if (!userSplit) return;

      // Category stats
      const catStat = categoryStats.get(expense.category) || { total: 0, count: 0 };
      catStat.total += userSplit.amountOwed;
      catStat.count += 1;
      categoryStats.set(expense.category, catStat);

      // Monthly stats
      const month = new Date(expense.date).toISOString().slice(0, 7);
      const monthStat = monthlyStats.get(month) || { total: 0, count: 0 };
      monthStat.total += userSplit.amountOwed;
      monthStat.count += 1;
      monthlyStats.set(month, monthStat);

      // Total calculations
      totalSpent += userSplit.amountOwed;
      if (expense.payerId === req.userId) {
        totalPaid += expense.amount;
      }
    });

    res.json({
      categoryBreakdown: Array.from(categoryStats.entries()).map(([category, stats]) => ({
        category,
        ...stats,
      })),
      monthlyBreakdown: Array.from(monthlyStats.entries()).map(([month, stats]) => ({
        month,
        ...stats,
      })),
      totals: {
        totalSpent,
        totalPaid,
        difference: totalPaid - totalSpent,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to get stats' });
  }
};

