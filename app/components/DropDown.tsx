// https://nextui.org/docs/components/dropdown

import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import favicon from "../../public/favicon.ico";

export default function App() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set(["$ USD"]));
  const countryList = [
    {
        name: '$ USD',
        flag: favicon
    },{
        name: '₹ INR',
        flag: favicon
    },{
      name: '£ GBP',
      flag: favicon
    },{
      name: '$ CAD',
      flag: favicon
    },{
      name: '$ AUD',
      flag: favicon
    },{
      name: '$ NZD',
      flag: favicon
    },{
      name: '$ HKD',
      flag: favicon
    },{
      name: '$ SGD',
      flag: favicon
},
  ]

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys),
    [selectedKeys]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="flat" 
          className="capitalize font-bold"
          size="md"
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        className="flex"  
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {countryList.map((country) => (
            <DropdownItem key={country.name}>{country.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}