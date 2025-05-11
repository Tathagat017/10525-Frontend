@action
async payShare(expenseId: string, amount: number) {
  try {
    const response = await api.post(`/expenses/${expenseId}/pay`, { amount });
    return response.data;
  } catch (error) {
    console.error('Error paying share:', error);
    throw error;
  }
} 