'use client';

import {ComboBox} from '@heroui/react/combo-box';
import {Input} from '@heroui/react/input';
import {Label} from '@heroui/react/label';
import {ListBox} from '@heroui/react/list-box';
import {normalize} from '@/lib/catalog';

type LocationOption={code:string;name:string};

export default function LocationComboBox({label,name,placeholder,options,value,onChange,disabled=false}:{label:string;name:string;placeholder:string;options:LocationOption[];value:string;onChange:(name:string)=>void;disabled?:boolean}){
  const selectedKey=options.find(option=>option.name===value)?.code??null;
  return <ComboBox
    className="checkout-location"
    fullWidth
    isRequired
    isDisabled={disabled}
    name={name}
    selectedKey={selectedKey}
    onSelectionChange={key=>onChange(options.find(option=>option.code===key)?.name??'')}
    defaultFilter={(text,query)=>normalize(text).includes(normalize(query))}
  >
    <Label>{label}</Label>
    <ComboBox.InputGroup>
      <Input placeholder={placeholder}/>
      <ComboBox.Trigger/>
    </ComboBox.InputGroup>
    <ComboBox.Popover className="checkout-location-popover">
      <ListBox renderEmptyState={()=><div className="checkout-location-empty">Không tìm thấy địa danh</div>}>
        {options.map(option=><ListBox.Item key={option.code} id={option.code} textValue={option.name}>{option.name}<ListBox.ItemIndicator/></ListBox.Item>)}
      </ListBox>
    </ComboBox.Popover>
  </ComboBox>;
}
