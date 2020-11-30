declare interface ICommandTestContext {
  localPageDomain: string;
  sleep: (amount: number) => Promise<void>;
  activate: () => Promise<void>;
  waitForTagCondition(
    client: WebdriverIO.BrowserObject,
    condition: (numTags) => boolean,
    errorStr?: string
  ): Promise<number>;
}
