'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import type { Product, Variant } from '@/lib/catalog';
import type { Account, CartItem, Order } from './storefront';

type Shop = {path:string;go:(url:string)=>void;products:Product[];refresh:()=>Promise<void>;cart:CartItem[];setCart:React.Dispatch<React.SetStateAction<CartItem[]>>;add:(p:Product,v:Variant,buy?:boolean,origin?:HTMLElement)=>void;wish:string[];favorite:(id:string)=>void;compare:string[];toggleCompare:(id:string)=>void;user:Account|null;setUser:React.Dispatch<React.SetStateAction<Account|null>>;toast:(message:string)=>void;lastOrder:Order|null;setLastOrder:(o:Order)=>void;dataError:string};

export const ShopContext = createContext<Shop>(null!);
export const useShop = () => useContext(ShopContext);

export function Nav({to,children,className='',...rest}:{to:string;children:ReactNode;className?:string;[key:string]:unknown}) {
  const {go}=useShop();
  return <a href={to} className={className} {...rest} onClick={e=>{if(!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&e.button===0){e.preventDefault();go(to)}}}>{children}</a>;
}
