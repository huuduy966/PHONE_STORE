import Storefront from './storefront';
import { getStoreProducts } from '@/lib/server';
export const dynamic='force-dynamic';
export default async function Page() { return <Storefront initialPath="/" initialProducts={await getStoreProducts()} />; }
