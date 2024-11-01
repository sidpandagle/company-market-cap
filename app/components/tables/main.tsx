/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor
  , Autocomplete, AutocompleteItem,
  AutocompleteSection
} from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";
import { columns, market_caps, countries, domains, industries, companies } from "./data";
// import { Input } from "postcss";


const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};


type MarketCap = typeof market_caps[0];

export default function App() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  // const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = columns;

  const filteredItems = React.useMemo(() => {
    let filteredMarketCap = [...market_caps];
    console.log(filteredMarketCap)

    if (hasSearchFilter) {
      filteredMarketCap = filteredMarketCap.filter((market_cap) =>
        market_cap.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredMarketCap;
    // [market_caps, filterValue, statusFilter]
  }, [hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: MarketCap, b: MarketCap) => {
      const first = a[sortDescriptor.column as keyof MarketCap] as number;
      const second = b[sortDescriptor.column as keyof MarketCap] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((market_cap: MarketCap, columnKey: React.Key) => {
    const cellValue = market_cap[columnKey as keyof MarketCap];

    switch (columnKey) {
      case "name":
        return (
          <User
            // avatarProps={{ radius: "lg", src: market_cap.avatar }}
            description={market_cap.name}
            name={cellValue}
          >
            {market_cap.name}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{market_cap.price}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[market_cap.today]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "country":
        return (
          <div className="flex items-center gap-2">
            <img src={"https://flagcdn.com/au.svg"} className="h-4 w-4" alt="" />
            {cellValue}
          </div>

        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const topContent = React.useMemo(() => {
    type Country = {
      label: string;
      value: string;
    };

    const regions = countries.reduce((acc: Record<string, Country[]>, country) => {
      if (!acc[country.region]) acc[country.region] = [];
      acc[country.region].push(country);
      return acc;
    }, {});

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {/* <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            placeholder="Company Name, Ticker"
            onValueChange={onSearchChange}
            /> */}
          {/* <Input
            startContent={<SearchIcon />}
            placeholder="Company Name, Ticker"
            className="w-full sm:max-w-[44%]"
          >
            {(data) => <AutocompleteItem key={data.value}>{data.label}</AutocompleteItem>}
          </Input> */}

          <Autocomplete
            startContent={<SearchIcon />}
            placeholder="Company Name, Ticker"
            className="w-full sm:max-w-[44%]"
            defaultItems={companies}
          >
            {(data) => <AutocompleteItem key={data.value}>{data.label}</AutocompleteItem>}
          </Autocomplete>

          <Autocomplete
            defaultItems={domains}
            placeholder="Rank by Domains"
            className="max-w-xs"
          >
            {(data) => <AutocompleteItem key={data.value}>{data.label}</AutocompleteItem>}
          </Autocomplete>

          <Autocomplete
            defaultItems={industries}
            placeholder="Rank by Industries"
            className="max-w-xs"
          >
            {(data) => <AutocompleteItem key={data.value}>{data.label}</AutocompleteItem>}
          </Autocomplete>

          <Autocomplete
            // label="Rank by Countries"
            placeholder="Search countries"
            className="max-w-xs"
          // size='md'
          >
            {/* Map through each region */}
            {Object.keys(regions).map((region) => (
              <AutocompleteSection key={region} title={region}>
                {regions[region].map((country) => (
                  <AutocompleteItem key={country.value}>
                    {country.label}
                  </AutocompleteItem>
                ))}
              </AutocompleteSection>
            ))}
          </Autocomplete>
        </div>
        <div className="text-center p-6">
          <div className="text-3xl pb-2 font-semibold">
            Largest Companies by Marketcap
          </div>
          <div className="flex gap-2 justify-center">
            <div>
              Companies: <span className="font-semibold">20</span>
            </div>
            <div>
              total market cap: <span className="font-semibold">$113.663 T</span>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-2 flex-wrap">
          <div>Rank by: </div>
          {categories.map((data) => {
            return <Chip className="p-4 border-1 cursor-pointer" variant={data.selected ? "solid" : "bordered"} key={data.label}>{data.label}</Chip>
          })}
        </div> */}
      </div>
    );
  }, [filterValue, onSearchChange, onRowsPerPageChange, onClear]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
    // [selectedKeys, items.length, page, pages, hasSearchFilter]
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        // wrapper: "max-h-[382px]",
      }}
      // selectedKeys={selectedKeys}
      // selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No market_caps found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}


