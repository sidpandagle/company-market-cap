// https://nextui.org/docs/components/dropdown

import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";

export default function App() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set(["$ USD"]));
  const countryList = [
    {
        name: '$ USD'
    },
    {
        name: '₹ INR'
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
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {countryList.map((country) => (
            <DropdownItem key={country.name}>{country.name}</DropdownItem>
        ))}
        {/* <DropdownItem key="usa">$ INR</DropdownItem> */}
        {/* <DropdownItem key="number">Number</DropdownItem>
        <DropdownItem key="date">Date</DropdownItem>
        <DropdownItem key="single_date">Single Date</DropdownItem>
        <DropdownItem key="iteration">Iteration</DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
}