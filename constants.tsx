
import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Iced Gula Aren Latte',
    price: 28000,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=400&fit=crop',
    description: 'Signature espresso with fresh milk and traditional palm sugar.'
  },
  {
    id: '2',
    name: 'Caramel Macchiato',
    price: 35000,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso.'
  },
  {
    id: '3',
    name: 'Matcha Latte',
    price: 32000,
    category: 'Non-Coffee',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop',
    description: 'Premium Uji Matcha whisked with creamy steamed milk.'
  },
  {
    id: '4',
    name: 'Red Velvet Latte',
    price: 30000,
    category: 'Non-Coffee',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop',
    description: 'Creamy and sweet beverage with the iconic flavor of red velvet cake.'
  },
  {
    id: '5',
    name: 'Manual Brew V60',
    price: 30000,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1752027865387-13cb24356599?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Seasonal single-origin beans brewed with precision for clarity.'
  },
  {
    id: '6',
    name: 'Americano',
    price: 25000,
    category: 'Coffee',
    image: 'https://images.https.unsplash.com/premium_photo-1670469009826-db07ab733925?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A classic rich espresso diluted with hot water for a smooth finish.'
  },
  {
    id: '7',
    name: 'Spanish Latte',
    price: 34000,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    description: 'A creamy coffee beverage sweetened with condensed milk.'
  },
  {
    id: '8',
    name: 'Lychee Tea',
    price: 26000,
    category: 'Non-Coffee',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Refreshing brewed tea infused with sweet lychee fruit.'
  }
];

export const CATEGORIES: { label: string; value: MenuItem['category'] | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Coffee', value: 'Coffee' },
  { label: 'Non-Coffee', value: 'Non-Coffee' }
];
