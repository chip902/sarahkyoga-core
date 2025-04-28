"use client";

import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
	// State to store our value
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	// Flag to determine if we're in a browser environment
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);

		// Get from local storage then
		// parse stored json or return initialValue
		try {
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			setStoredValue(item ? JSON.parse(item) : initialValue);
		} catch (error) {
			console.log(error);
			setStoredValue(initialValue);
		}
	}, [initialValue, key]);

	// Return a wrapped version of useState's setter function that
	// persists the new value to localStorage.
	const setValue = (value: T | ((val: T) => T)) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value;

			// Save state
			setStoredValue(valueToStore);

			// Save to local storage, but only if we're in a browser environment
			if (isClient) {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return [storedValue, setValue];
}

export default useLocalStorage;

// Simple check function to determine if localStorage is available
export function isLocalStorageAvailable() {
	if (typeof window === "undefined") return false;

	try {
		window.localStorage.setItem("test", "test");
		window.localStorage.removeItem("test");
		return true;
	} catch (e) {
		return false;
	}
}
