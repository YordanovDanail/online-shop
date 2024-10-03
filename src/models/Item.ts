export interface Item {
    id?: string;
    title: string;
    description: string;
    price: number;
    category: string;
    condition: 'new' | 'used';
    createdAt: string;
    imageUrl: string;
    userId: string;
  }
  