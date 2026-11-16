import data from './vietnam-locations.json' with {type:'json'};

type Ward={code:string;name:string};
type Province={code:string;name:string;wards:Ward[]};

export const provinces:Province[]=data;

export function wardsForProvince(provinceName:string):Ward[]{
  return provinces.find(province=>province.name===provinceName)?.wards??[];
}

export function isValidLocation(provinceName:string,wardName:string):boolean{
  return wardsForProvince(provinceName).some(ward=>ward.name===wardName);
}
