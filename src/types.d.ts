declare type CoverDateToString<T> = Omit<T, "date"> & { date: string };

// declare type DBType<T extends Object, Keys extends keyof T> = Omit<T, Keys> & {
// 	uuid: string;
// 	date: Dayjs;
// 	[K in Keys]: T[K];
// };

declare type DBType<T extends Object, Keys extends keyof T = ""> = {
	uuid: string;
	date: Dayjs;
} & {
	[E in keyof T as E extends "date" ? never : E]: E extends Keys
		? T[E]
		: string;
};
