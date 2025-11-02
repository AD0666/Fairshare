export const mockUsers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    profilePicture: '',
    phone: '+1234567890',
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    profilePicture: '',
    phone: '+1234567891',
  },
  {
    id: '3',
    email: 'mike.johnson@example.com',
    name: 'Mike Johnson',
    profilePicture: '',
    phone: '+1234567892',
  },
];

export const mockGroups = [
  {
    id: '1',
    name: 'Weekend Trip',
    image: '',
    createdBy: '1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: '1',
      name: 'John Doe',
      profilePicture: '',
    },
    members: [
      { id: '1', userId: '1', joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), user: mockUsers[0] },
      { id: '2', userId: '2', joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), user: mockUsers[1] },
      { id: '3', userId: '3', joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), user: mockUsers[2] },
    ],
    _count: {
      expenses: 8,
    },
  },
  {
    id: '2',
    name: 'Office Lunch Group',
    image: '',
    createdBy: '1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: '1',
      name: 'John Doe',
      profilePicture: '',
    },
    members: [
      { id: '4', userId: '1', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), user: mockUsers[0] },
      { id: '5', userId: '2', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), user: mockUsers[1] },
    ],
    _count: {
      expenses: 12,
    },
  },
];

export const mockExpenses = [
  {
    id: '1',
    amount: 150.00,
    description: 'Dinner at Italian Restaurant',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Food & Dining',
    payerId: '1',
    payer: mockUsers[0],
    createdBy: '1',
    groupId: '1',
    splits: [
      { id: '1', userId: '1', amountOwed: 50, user: mockUsers[0] },
      { id: '2', userId: '2', amountOwed: 50, user: mockUsers[1] },
      { id: '3', userId: '3', amountOwed: 50, user: mockUsers[2] },
    ],
  },
  {
    id: '2',
    amount: 45.00,
    description: 'Uber to the airport',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Transportation',
    payerId: '2',
    payer: mockUsers[1],
    createdBy: '2',
    groupId: '1',
    splits: [
      { id: '4', userId: '1', amountOwed: 22.5, user: mockUsers[0] },
      { id: '5', userId: '2', amountOwed: 22.5, user: mockUsers[1] },
    ],
  },
  {
    id: '3',
    amount: 320.00,
    description: 'Hotel booking for 2 nights',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Rent',
    payerId: '1',
    payer: mockUsers[0],
    createdBy: '1',
    groupId: '1',
    splits: [
      { id: '6', userId: '1', amountOwed: 106.67, user: mockUsers[0] },
      { id: '7', userId: '2', amountOwed: 106.67, user: mockUsers[1] },
      { id: '8', userId: '3', amountOwed: 106.66, user: mockUsers[2] },
    ],
  },
];

export const mockFriends = [mockUsers[1], mockUsers[2]];

export const mockBalance = {
  balances: [
    {
      userId: '2',
      userName: 'Jane Smith',
      userProfilePicture: '',
      totalOwed: 22.5,
      totalReceiving: 0,
      netAmount: -22.5,
    },
    {
      userId: '3',
      userName: 'Mike Johnson',
      userProfilePicture: '',
      totalOwed: 156.66,
      totalReceiving: 0,
      netAmount: -156.66,
    },
  ],
  summary: {
    totalOwed: 179.16,
    totalReceiving: 0,
    netAmount: -179.16,
  },
};

export const mockStats = {
  categoryBreakdown: [
    { category: 'Food & Dining', total: 350.50, count: 8 },
    { category: 'Transportation', total: 120.00, count: 5 },
    { category: 'Rent', total: 640.00, count: 3 },
    { category: 'Entertainment', total: 85.50, count: 4 },
  ],
  monthlyBreakdown: [
    { month: '2024-01', total: 450.75, count: 12 },
    { month: '2024-02', total: 310.25, count: 8 },
  ],
  totals: {
    totalSpent: 761.00,
    totalPaid: 1196.50,
    difference: 435.50,
  },
};

