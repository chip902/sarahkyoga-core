# AdminTable Shared Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a shared `AdminTable` component with pagination, sorting, and search filtering, then migrate all 4 admin pages to use it.

**Architecture:** A single client component `AdminTable` accepts a typed column config and data array. All sorting, filtering, and pagination is client-side using `useMemo`. Each admin page defines its columns (with optional custom `render` functions) and passes its data — the component handles the rest.

**Tech Stack:** React, Chakra UI, TypeScript (no new dependencies)

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `app/components/admin/AdminTable.tsx` | Shared table with sort, search, pagination |
| Modify | `app/admin/subscribers/page.tsx` | Replace inline table with AdminTable |
| Modify | `app/admin/dashboard/page.tsx` | Replace inline table + sort logic with AdminTable |
| Modify | `app/admin/promo-codes/page.tsx` | Replace inline table with AdminTable |
| Modify | `app/admin/users/page.tsx` | Replace inline table with AdminTable |

---

## Chunk 1: Build AdminTable Component

### Task 1: Create AdminTable component

**Files:**
- Create: `app/components/admin/AdminTable.tsx`

- [ ] **Step 1: Create the AdminTable component file**

Create `app/components/admin/AdminTable.tsx` with the following implementation:

```tsx
"use client";

import { useMemo, useState, ReactNode } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Button,
  Select,
  Flex,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";

export interface AdminColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  sortType?: "string" | "number" | "date" | "boolean";
  render?: (value: unknown, row: T) => ReactNode;
}

interface AdminTableProps<T extends Record<string, unknown>> {
  columns: AdminColumn<T>[];
  data: T[];
  pageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export default function AdminTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 15,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
}: AdminTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filterableKeys = columns.filter((c) => c.filterable).map((c) => c.key);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || filterableKeys.length === 0) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      filterableKeys.some((key) => {
        const val = getNestedValue(row, key);
        return val != null && String(val).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, filterableKeys]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    const sortType = col?.sortType ?? "string";

    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey);
      const bVal = getNestedValue(b, sortKey);

      let comparison = 0;
      if (aVal == null && bVal == null) comparison = 0;
      else if (aVal == null) comparison = -1;
      else if (bVal == null) comparison = 1;
      else if (sortType === "number") comparison = Number(aVal) - Number(bVal);
      else if (sortType === "date") comparison = new Date(String(aVal)).getTime() - new Date(String(bVal)).getTime();
      else if (sortType === "boolean") comparison = (aVal === bVal ? 0 : aVal ? 1 : -1);
      else comparison = String(aVal).localeCompare(String(bVal));

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection, columns]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = sortedData.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const hasFilterable = filterableKeys.length > 0;

  return (
    <Box>
      {hasFilterable && (
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </InputGroup>
      )}

      {paginatedData.length === 0 ? (
        <Text>{searchQuery ? "No results match your search." : emptyMessage}</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                {columns.map((col) => (
                  <Th
                    key={col.key}
                    cursor={col.sortable ? "pointer" : "default"}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    userSelect="none"
                  >
                    <HStack spacing={1}>
                      <Text>{col.label}</Text>
                      {col.sortable && sortKey === col.key && (
                        sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />
                      )}
                    </HStack>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((row, rowIndex) => (
                <Tr key={(row as Record<string, unknown>).id as string ?? rowIndex}>
                  {columns.map((col) => (
                    <Td key={col.key}>
                      {col.render
                        ? col.render(getNestedValue(row, col.key), row)
                        : String(getNestedValue(row, col.key) ?? "—")}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontSize="sm" color="gray.500">
            Showing {(safeCurrentPage - 1) * pageSize + 1}–{Math.min(safeCurrentPage * pageSize, sortedData.length)} of {sortedData.length}
          </Text>
          <HStack spacing={2}>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              isDisabled={safeCurrentPage === 1}
            >
              Previous
            </Button>
            <Select
              size="sm"
              w="auto"
              value={safeCurrentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </Select>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              isDisabled={safeCurrentPage === totalPages}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx next build --webpack 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/components/admin/AdminTable.tsx
git commit -m "feat: add shared AdminTable component with sort, search, and pagination"
```

---

## Chunk 2: Migrate Admin Pages

### Task 2: Migrate Subscribers page

**Files:**
- Modify: `app/admin/subscribers/page.tsx`

- [ ] **Step 1: Replace inline table with AdminTable**

Keep all existing business logic (fetch, modals, handlers). Remove:
- `searchQuery` state and `filteredSubscribers` useMemo (AdminTable handles this)
- `activeCount` useMemo (keep as stats line above AdminTable)
- Inline `<Table>` block

Replace the table section with:

```tsx
import AdminTable, { AdminColumn } from "@/app/components/admin/AdminTable";

// Define columns (inside or outside the component)
const columns: AdminColumn<Subscriber>[] = [
  { key: "email", label: "Email", sortable: true, filterable: true },
  { key: "name", label: "Name", sortable: true, filterable: true,
    render: (val) => (val as string) || "—" },
  { key: "active", label: "Status", sortable: true, sortType: "boolean",
    render: (val) => (
      <Badge colorScheme={val ? "green" : "red"}>
        {val ? "Active" : "Inactive"}
      </Badge>
    )},
  { key: "createdAt", label: "Subscribed", sortable: true, sortType: "date",
    render: (val) => new Date(val as string).toLocaleDateString() },
  { key: "actions", label: "Actions",
    render: (_, row) => (
      <HStack spacing={2}>
        <Button size="sm" colorScheme={row.active ? "orange" : "green"}
          onClick={() => handleToggleActive(row)}>
          {row.active ? "Unsubscribe" : "Resubscribe"}
        </Button>
        <IconButton aria-label="Delete" icon={<DeleteIcon />}
          size="sm" colorScheme="red"
          onClick={() => handleDelete(row.id)} />
      </HStack>
    )},
];

// In JSX, replace the InputGroup + Table block with:
<AdminTable
  columns={columns}
  data={subscribers}
  pageSize={15}
  searchPlaceholder="Search by email or name..."
  emptyMessage="No subscribers found. Add one to get started!"
/>
```

Remove unused imports: `Table, Thead, Tbody, Tr, Th, Td, InputGroup, InputLeftElement, SearchIcon`.

- [ ] **Step 2: Verify build**

Run: `npx next build --webpack 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/admin/subscribers/page.tsx
git commit -m "refactor: migrate subscribers page to AdminTable component"
```

### Task 3: Migrate Dashboard (Orders) page

**Files:**
- Modify: `app/admin/dashboard/page.tsx`

- [ ] **Step 1: Replace inline sort logic and table with AdminTable**

Remove:
- `sortConfig` state and `setSortConfig`
- `sortedOrders` useMemo
- `requestSort` function
- Inline `<Table>` block

Replace with AdminTable using these columns:

```tsx
import AdminTable, { AdminColumn } from "@/app/components/admin/AdminTable";

const columns: AdminColumn<Order>[] = [
  { key: "orderNumber", label: "Order ID", sortable: true, filterable: true },
  { key: "user.firstName", label: "Name", sortable: true, filterable: true,
    render: (_, row) => {
      const user = row.user as { firstName?: string; lastName?: string } | undefined;
      return `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "—";
    }},
  { key: "user.email", label: "Email", sortable: true, filterable: true,
    render: (val) => (val as string) || "—" },
  { key: "total", label: "Amount ($)", sortable: true, sortType: "number",
    render: (val) => Number(val).toFixed(2) },
  { key: "status", label: "Status", sortable: true, filterable: true },
  { key: "createdAt", label: "Date Created", sortable: true, sortType: "date",
    render: (val) => new Date(val as string).toLocaleDateString() },
];

// In JSX:
<AdminTable
  columns={columns}
  data={orders || []}
  pageSize={15}
  searchPlaceholder="Search orders..."
  emptyMessage="No open orders found."
/>
```

Remove the `SortConfig` import from types. Remove unused Chakra imports.

- [ ] **Step 2: Verify build**

Run: `npx next build --webpack 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/admin/dashboard/page.tsx
git commit -m "refactor: migrate orders dashboard to AdminTable component"
```

### Task 4: Migrate Promo Codes page

**Files:**
- Modify: `app/admin/promo-codes/page.tsx`

- [ ] **Step 1: Replace inline table with AdminTable**

Keep all business logic (fetch, modals, handlers). Replace only the `<Table>` block.

```tsx
import AdminTable, { AdminColumn } from "@/app/components/admin/AdminTable";

// Define columns — actions column uses closures over handler functions
const columns: AdminColumn<PromoCode>[] = [
  { key: "code", label: "Code", sortable: true, filterable: true,
    render: (val) => <Text fontWeight="bold">{val as string}</Text> },
  { key: "type", label: "Type", sortable: true,
    render: (val) => (
      <Badge colorScheme={val === "FREE_CLASS" ? "green" : "blue"}>
        {val as string}
      </Badge>
    )},
  { key: "value", label: "Value", sortable: true, sortType: "number",
    render: (_, row) =>
      row.type === "PERCENTAGE" ? `${row.value}%`
      : row.type === "FIXED_AMOUNT" ? `$${row.value}`
      : "Free" },
  { key: "usedCount", label: "Usage", sortable: true, sortType: "number",
    render: (_, row) => `${row.usedCount}${row.maxUses ? ` / ${row.maxUses}` : ""}` },
  { key: "isActive", label: "Status", sortable: true, sortType: "boolean",
    render: (val) => (
      <Badge colorScheme={val ? "green" : "red"}>
        {val ? "Active" : "Inactive"}
      </Badge>
    )},
  { key: "expiresAt", label: "Expires", sortable: true, sortType: "date",
    render: (val) => val ? new Date(val as string).toLocaleDateString() : "Never" },
  { key: "actions", label: "Actions",
    render: (_, row) => (
      <HStack spacing={2}>
        <IconButton aria-label="Edit" icon={<EditIcon />} size="sm"
          onClick={() => handleOpenModal(row)} />
        <Button size="sm" colorScheme={row.isActive ? "orange" : "green"}
          onClick={() => handleToggleActive(row)}>
          {row.isActive ? "Deactivate" : "Activate"}
        </Button>
        {row.orders.length === 0 && (
          <IconButton aria-label="Delete" icon={<DeleteIcon />}
            size="sm" colorScheme="red"
            onClick={() => handleDelete(row.id)} />
        )}
      </HStack>
    )},
];

// In JSX:
<AdminTable
  columns={columns}
  data={promoCodes}
  pageSize={15}
  searchPlaceholder="Search promo codes..."
  emptyMessage="No promo codes found. Create one to get started!"
/>
```

Note: `columns` must be defined inside the component so `handleOpenModal`, `handleToggleActive`, `handleDelete` are in scope.

Remove unused imports: `Table, Thead, Tbody, Tr, Th, Td`.

- [ ] **Step 2: Verify build**

Run: `npx next build --webpack 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/admin/promo-codes/page.tsx
git commit -m "refactor: migrate promo codes page to AdminTable component"
```

### Task 5: Migrate Users page

**Files:**
- Modify: `app/admin/users/page.tsx`

- [ ] **Step 1: Replace inline table with AdminTable**

Keep all business logic. Replace the `<Table>` block.

```tsx
import AdminTable, { AdminColumn } from "@/app/components/admin/AdminTable";

const columns: AdminColumn<User>[] = [
  { key: "firstName", label: "Name", sortable: true, filterable: true,
    render: (_, row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() || "—" },
  { key: "email", label: "Email", sortable: true, filterable: true },
  { key: "role", label: "Role", sortable: true,
    render: (val) => (
      <Badge colorScheme={val === "admin" ? "purple" : "blue"}>
        {(val as string) || "user"}
      </Badge>
    )},
  { key: "type", label: "Type", sortable: true,
    render: (val) => (
      <Badge colorScheme={val === "guest" ? "gray" : "green"}>
        {(val as string) || "registered"}
      </Badge>
    )},
  { key: "_count.orders", label: "Orders", sortable: true, sortType: "number",
    render: (_, row) => String((row._count as { orders: number }).orders) },
  { key: "actions", label: "Actions",
    render: (_, row) => (
      <HStack spacing={2}>
        <IconButton aria-label="Edit" icon={<EditIcon />} size="sm"
          onClick={() => handleOpenModal(row)} />
        <Button size="sm" colorScheme="orange"
          onClick={() => handleResetPassword(row.id, row.email)}>
          Reset Password
        </Button>
        <IconButton aria-label="Delete" icon={<DeleteIcon />}
          size="sm" colorScheme="red"
          onClick={() => handleDelete(row.id, row.email)} />
      </HStack>
    )},
];

// In JSX:
<AdminTable
  columns={columns}
  data={users || []}
  pageSize={15}
  searchPlaceholder="Search users..."
  emptyMessage="No users found. Create one to get started!"
/>
```

Remove unused imports: `Table, Thead, Tbody, Tr, Th, Td`.

- [ ] **Step 2: Verify build**

Run: `npx next build --webpack 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/admin/users/page.tsx
git commit -m "refactor: migrate users page to AdminTable component"
```

---

## Verification

After all migrations:

- [ ] Run `npx next build --webpack` — should compile with no errors
- [ ] Visit each admin page in the browser and verify:
  - `/admin/subscribers` — search, sort all columns, pagination works, unsubscribe/delete still work
  - `/admin/dashboard` — search orders, sort all columns, pagination
  - `/admin/promo-codes` — search codes, sort all columns, edit/deactivate/delete still work
  - `/admin/users` — search users, sort all columns, edit/reset/delete still work
- [ ] Verify all modals and action buttons still function correctly
- [ ] Verify pagination shows correct counts and page navigation works
