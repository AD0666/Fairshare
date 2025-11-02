interface BalanceEntry {
  userId: string;
  userName: string;
  netAmount: number;
}

export interface SettlementTransaction {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

/**
 * Simplifies debts using a greedy algorithm to minimize transactions
 * This is an approximation of the optimal solution which is NP-hard
 */
export const simplifyDebts = (balances: BalanceEntry[]): SettlementTransaction[] => {
  const transactions: SettlementTransaction[] = [];
  const sortedBalances = [...balances].sort((a, b) => b.netAmount - a.netAmount);
  
  let left = 0;
  let right = sortedBalances.length - 1;

  while (left < right) {
    const debtor = sortedBalances[left];
    const creditor = sortedBalances[right];

    // Skip zero balances
    if (creditor.netAmount >= 0) break;
    if (debtor.netAmount <= 0) break;

    const settlementAmount = Math.min(
      Math.abs(creditor.netAmount),
      debtor.netAmount
    );

    if (settlementAmount > 0.01) { // Only create transactions for meaningful amounts
      transactions.push({
        fromUserId: creditor.userId,
        fromUserName: creditor.userName,
        toUserId: debtor.userId,
        toUserName: debtor.userName,
        amount: settlementAmount,
      });

      debtor.netAmount -= settlementAmount;
      creditor.netAmount += settlementAmount;
    }

    // Move pointers based on remaining balances
    if (Math.abs(debtor.netAmount) < 0.01) left++;
    if (Math.abs(creditor.netAmount) < 0.01) right--;
  }

  return transactions;
};

/**
 * Calculate net balance for a user
 * Returns positive amount if user is owed money, negative if user owes money
 */
export const calculateNetBalance = (
  expensesPaid: { amount: number; totalSplits: number; userSplit: number }[],
  expensesOwed: { amount: number }[]
): number => {
  let totalOwed = 0;
  expensesOwed.forEach(exp => {
    totalOwed += exp.amount;
  });

  let totalPaidForOthers = 0;
  expensesPaid.forEach(exp => {
    // Only count the portion that others owe
    totalPaidForOthers += (exp.amount - exp.userSplit);
  });

  return totalPaidForOthers - totalOwed;
};

