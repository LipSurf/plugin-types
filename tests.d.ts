declare interface ICommandTestContext {
    localPageDomain: string;
    sleep: (amount: number) => Promise<void>;
}