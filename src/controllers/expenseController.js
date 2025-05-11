// Get net balances per member
const getBalances = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const expenses = await Expense.find({ householdId });

  const balanceMap = {};

  for (const exp of expenses) {
    const { payer, participants, amount } = exp;

    // Add the full amount to payer's balance
    balanceMap[payer] = (balanceMap[payer] || 0) + amount;

    // Subtract each participant's share
    for (const { user, share, amountPaid } of participants) {
      const shareAmount = amount * share;
      balanceMap[user] = (balanceMap[user] || 0) - shareAmount;

      // If participant has paid, add their payment to their balance
      if (amountPaid > 0) {
        balanceMap[user] = (balanceMap[user] || 0) + amountPaid;
        balanceMap[payer] = (balanceMap[payer] || 0) - amountPaid;
      }
    }
  }

  res.json(balanceMap);
});

// Settle up suggestion (minimize transactions)
const getSettleUpSuggestions = asyncHandler(async (req, res) => {
  const { householdId } = req.params;
  const expenses = await Expense.find({ householdId });

  const balanceMap = {};

  // Calculate balances using the same logic as getBalances
  for (const exp of expenses) {
    const { payer, participants, amount } = exp;

    // Add the full amount to payer's balance
    balanceMap[payer] = (balanceMap[payer] || 0) + amount;

    // Subtract each participant's share
    for (const { user, share, amountPaid } of participants) {
      const shareAmount = amount * share;
      balanceMap[user] = (balanceMap[user] || 0) - shareAmount;

      // If participant has paid, add their payment to their balance
      if (amountPaid > 0) {
        balanceMap[user] = (balanceMap[user] || 0) + amountPaid;
        balanceMap[payer] = (balanceMap[payer] || 0) - amountPaid;
      }
    }
  }

  const debtors = [];
  const creditors = [];

  Object.entries(balanceMap).forEach(([user, balance]) => {
    if (Math.abs(balance) < 0.01) return;
    if (balance < 0) debtors.push({ user, balance });
    else creditors.push({ user, balance });
  });

  const transactions = [];

  debtors.sort((a, b) => a.balance - b.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  while (debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(-debtor.balance, creditor.balance);

    transactions.push({
      from: debtor.user,
      to: creditor.user,
      amount: Math.round(amount * 100) / 100,
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 0.01) debtors.shift();
    if (Math.abs(creditor.balance) < 0.01) creditors.shift();
  }

  res.json(transactions);
});
