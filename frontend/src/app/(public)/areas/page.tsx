import type { Metadata } from 'next';
import { AreasDirectory } from '@/components/areas/AreasDirectory';

export const metadata: Metadata = {
  title: 'Popular Areas & Student Hubs in Bhopal | StudentPG',
  description:
    'Explore 21 verified student localities and college accommodation hubs across Bhopal including MP Nagar, Indrapuri, Kolar Road, and near MANIT, LNCT, TIT, SAGE. Zero brokerage and direct owner contact.',
  openGraph: {
    title: 'Popular Areas & Student Hubs in Bhopal | StudentPG',
    description:
      'Browse 21 verified student accommodation hubs and college localities across Bhopal with zero brokerage.',
  },
};

export default function AreasPage() {
  return <AreasDirectory />;
}
