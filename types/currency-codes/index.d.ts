declare module "currency-codes" {
	export interface CurrencyData {
		code: string;
    number: number;
    digits: number;
    currency: string;
    countries: string[];
	}
	export function code(code: string): CurrencyData | undefined;
	export function number(code_number: number): CurrencyData | undefined;
	export function country(country: string): CurrencyData[];
	export function codes(): string[];
	export function number(): string[];
	export function countries(): string[];
}

declare module "currency-codes/data" {
	import { CurrencyData } from "currency-codes";

	const data: CurrencyData[];
	export = data;
}
