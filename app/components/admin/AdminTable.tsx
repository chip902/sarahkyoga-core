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

interface AdminTableProps<T extends object> {
	columns: AdminColumn<T>[];
	data: T[];
	pageSize?: number;
	searchPlaceholder?: string;
	emptyMessage?: string;
}

function getNestedValue(obj: object, path: string): unknown {
	return path.split(".").reduce<unknown>((acc, key) => {
		if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
			return (acc as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
}

export default function AdminTable<T extends object>({
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

	const filterableKeysStr = columns.filter((c) => c.filterable).map((c) => c.key).join(",");
	const filterableKeys = useMemo(() => filterableKeysStr.split(",").filter(Boolean), [filterableKeysStr]);

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

	const sortTypeMap = useMemo(() => {
		const map: Record<string, string> = {};
		for (const col of columns) {
			if (col.sortType) map[col.key] = col.sortType;
		}
		return map;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterableKeysStr]);

	const sortedData = useMemo(() => {
		if (!sortKey) return filteredData;
		const sortType = sortTypeMap[sortKey] ?? "string";

		return [...filteredData].sort((a, b) => {
			const aVal = getNestedValue(a, sortKey);
			const bVal = getNestedValue(b, sortKey);

			let comparison = 0;
			if (aVal == null && bVal == null) comparison = 0;
			else if (aVal == null) comparison = -1;
			else if (bVal == null) comparison = 1;
			else if (sortType === "number") comparison = Number(aVal) - Number(bVal);
			else if (sortType === "date") comparison = new Date(String(aVal)).getTime() - new Date(String(bVal)).getTime();
			else if (sortType === "boolean") comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
			else comparison = String(aVal).localeCompare(String(bVal));

			return sortDirection === "asc" ? comparison : -comparison;
		});
	}, [filteredData, sortKey, sortDirection, sortTypeMap]);

	const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
	const safeCurrentPage = Math.min(currentPage, totalPages);
	const paginatedData = sortedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

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
					<Input placeholder={searchPlaceholder} value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />
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
										userSelect="none">
										<HStack spacing={1}>
											<Text>{col.label}</Text>
											{col.sortable && sortKey === col.key && (sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />)}
										</HStack>
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{paginatedData.map((row, rowIndex) => (
								<Tr key={((row as Record<string, unknown>).id as string) ?? rowIndex}>
									{columns.map((col) => (
										<Td key={col.key}>
											{col.render ? col.render(getNestedValue(row, col.key), row) : String(getNestedValue(row, col.key) ?? "—")}
										</Td>
									))}
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}

			{totalPages > 1 && (
				<Flex justify="space-between" align="center" mt={4}>
					<Text fontSize="sm" color="gray.500">
						Showing {(safeCurrentPage - 1) * pageSize + 1}–{Math.min(safeCurrentPage * pageSize, sortedData.length)} of{" "}
						{sortedData.length}
					</Text>
					<HStack spacing={2}>
						<Button size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} isDisabled={safeCurrentPage === 1}>
							Previous
						</Button>
						<Select size="sm" w="auto" value={safeCurrentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
							{Array.from({ length: totalPages }, (_, i) => (
								<option key={i + 1} value={i + 1}>
									Page {i + 1}
								</option>
							))}
						</Select>
						<Button
							size="sm"
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							isDisabled={safeCurrentPage === totalPages}>
							Next
						</Button>
					</HStack>
				</Flex>
			)}
		</Box>
	);
}
