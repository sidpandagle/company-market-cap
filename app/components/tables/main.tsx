import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor
} from "@nextui-org/react";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { columns, users, statusOptions } from "./data";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

// const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "age",
  "role",
  "team",
  "email",
  "status",
  "actions"
];

type User = typeof users[0];

export default function App() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  // const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
    // [users, filterValue, statusFilter]
  }, [hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{user.team}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
          <Autocomplete
            startContent={<SearchIcon />}
            defaultItems={industires}
            placeholder="Company Name, Ticker"
            className="w-full sm:max-w-[44%]"
          >
            {(data) => <AutocompleteItem key={data.value}>{data.label}</AutocompleteItem>}
          </Autocomplete>
          <Autocomplete
            defaultItems={industires}
            placeholder="Rank by industires"
            className="max-w-xs"
          >
            {(data) => <AutocompleteItem key={data.value}>{data.label}</AutocompleteItem>}
          </Autocomplete>
          <Autocomplete
            defaultItems={countries}
            placeholder="Rank by Countries"
            className="max-w-xs"
          >
            {(data) => <AutocompleteItem key={data.value}>{data.label}</AutocompleteItem>}
          </Autocomplete>
        </div>
        <div className="text-center p-6">
          <div className="text-3xl pb-2 font-semibold">
            Top publicly traded courier companies by earnings
          </div>
          <div className="flex gap-2 justify-center">
            <div>
              companies: <span className="font-semibold">20</span>
            </div>
            <div>
              total earnings (TTM): <span className="font-semibold">$30.16 B</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div>Rank by: </div>
          {categories.map((data) => {
            return <Chip className="p-4 border-1 cursor-pointer" variant={data.selected ? "solid" : "bordered"} key={data.label}>{data.label}</Chip>
          })}
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, statusFilter, visibleColumns, onRowsPerPageChange, onClear]);

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
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}


export const countries = [
  { label: "USA", value: "usa", description: "usa" },
  { label: "India", value: "india", description: "india" },
];
export const industires = [
  { label: "IT", value: "it", description: "IT" },
  { label: "Agriculture", value: "agriculture", description: "Agriculture" },
];
export const categories = [
  { label: "Market Cap", value: "Market Cap", description: "Market Cap", selected: true },
  { label: "Earnings", value: "Earnings", description: "Earnings" },
  { label: "Revenue", value: "Revenue", description: "Revenue" },
  { label: "Employees", value: "Employees", description: "Employees" },
  { label: "P/E ratio", value: "P/E ratio", description: "P/E ratio" },
  { label: "Dividend %", value: "Dividend %", description: "Dividend %" },
  { label: "Market Cap gain", value: "Market Cap gain", description: "Market Cap gain" },
  { label: "Market Cap loss", value: "Market Cap loss", description: "Market Cap loss" },
  { label: "Operating Margin", value: "Operating Margin", description: "Operating Margin" },
  { label: "Cost to borrow", value: "Cost to borrow", description: "Cost to borrow" },
  { label: "Total assets", value: "Total assets", description: "Total assets" },
  { label: "Net assets", value: "Net assets", description: "Net assets" },
  { label: "Total liabilities", value: "Total liabilities", description: "Total liabilities" },
  { label: "Total debt", value: "Total debt", description: "Total debt" },
  { label: "Cash on hand", value: "Cash on hand", description: "Cash on hand" },
  { label: "P/B ratio", value: "P/B ratio", description: "P/B ratio" },
];

