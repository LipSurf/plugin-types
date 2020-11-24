/// <reference types="webdriverio"/>
/// <reference path="./options.d.ts"/>

declare type ExecutionContext<T> = import('ava').ExecutionContext<T>;
declare type IndicesPair = [number, number];

declare interface IDisableable {
    enabled: boolean;
}

type ItemWAssocText<T> = {item: T, text: string[]};
type ClickableElement = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement;
type TabWithIdAndURL = chrome.tabs.Tab & {id: number, url: string};
// the element XFRAME_UNIQUE_ID attribute value, and the client rect of the element
type FrameElWOffsets = [string, ClientRect];

// for talking to iframes
type SpecialProp = 'visible'|'pos'|'onTop';
type SpecialFn = 'clickOrFocus'|'blinkHighlight'|'highlight'|'unhighlightAll';

type StoreListener<T> = (newState: T) => (Promise<void>|void);


declare interface IPlan {
    plan: plan;
}

type Serialized<T> = T extends string | number | boolean | null ? T : 
  T extends RegExp | Function ? string :
  T extends Set<T> | Array<T> ? Iterable<T> :
  T extends object ? { [K in keyof T]: Serialized<T[K]> } : 
  never;

// for 3rd party plugins definitions
declare interface ISimpleHomophones {
    [s: string]: string;
}

declare type SyncDynamicMatchFnResp = [startMatchIndex: number, endMatchIndex: number, matchOutput?: any[]]|undefined|false;
declare type AsyncDynamicMatchFnResp = Promise<SyncDynamicMatchFnResp>
declare type DynamicMatchFnResp = SyncDynamicMatchFnResp|AsyncDynamicMatchFnResp;

declare type CmdArgExtras = any[]|undefined;
// the ...any[] should match CmdArgExtras but there's no way to do that along with allowing it to be undefined
declare type CmdArgs = [string]|[string, ...any[]];

declare interface IDynamicMatch {
    // `false` if partial match -- if there's a partial match we should delay other commands that 
    //                  have a full match; because the user might be in the process of saying this longer
    //                  command where the partial match is a subset but also a matching command "ie. Help Wanted" 
    //                  executing a different command from "Help"
    // can be a promise
    fn: (transcript: string) => DynamicMatchFnResp;
    description: string;
}

declare type INiceFn = ((transcript: string, ...matchOutput: any[]) => string);

declare interface INiceCommand {
    // matchOutput is the array returned from the match function (if there's a match fn) or 
    // the arguments from special match string (wildcard, numeral etc. type special params)
    nice?: string | INiceFn;
}

declare interface ILocalizedCommandBase extends INiceCommand {
    // the original name to match this command against
    name: string;
    description?: string;
}

declare interface IGlobalCommand {
    // let command match on any page (not restricted by plugin level match regex)
    global?: boolean;
}

declare interface IFnCommand {
    // matchOutput is the array returned from the match function (if there's a match fn) or 
    // the arguments from special match string (wildcard, numeral etc. type special params)
    fn?: (transcript: string, ...matchOutput: any[]) => Promise<void>;
}

declare interface ILocalizedCommand extends ILocalizedCommandBase {
    // strings should not have any punctuation in them as puncutation
    // is converted into it's spelled out form eg. "." -> "dot"
    match: string | string[] | IDynamicMatch;
    // returns the complete liveText that should be shown.
    // raw input would be eg. "go to are meal time video"
    delay?: number | number[];
}

interface IBaseSetting {
    name: string;
    type: any;
    default?: any;
}

interface IBooleanSetting extends IBaseSetting {
    type: 'boolean';
    default?: boolean;
}

interface IStringSetting extends IBaseSetting {
    type: 'url'|'text'|'string';
    default?: string;
}

interface INumberSetting extends IBaseSetting {
    type: 'number';
    default?: number;
}

interface IChoiceSetting extends IBaseSetting {
    type: 'choice';
    choices: string[];
    default?: string;
}

declare type ISetting = IStringSetting | IBooleanSetting | INumberSetting | IChoiceSetting;
declare type SingleTest = (t: ExecutionContext<ICommandTestContext>, say: (s?: string, resultIndex?: number) => Promise<void>, client: WebdriverIO.BrowserObject) => Promise<void>|void;

declare interface ICommand extends Partial<IPlan>, ILocalizedCommand, IGlobalCommand, IFnCommand {
    test?: SingleTest | {[testTitle: string]: SingleTest};
    // matchOutput is the array returned from the match function (if there's a match fn) or 
    // the arguments from special match string (wildcard, numeral etc. type special params)
    pageFn?: (transcript: string, ...matchOutput: any[]) => void|Promise<void>;
    // set to false to not include this command in Normal mode. For commands that only belong
    // in certain context(s)
    normal?: false;
    settings?: ISetting[];
    minConfidence?: number;
    // whether to execute this command in the iframe that has focus 
    // won't work if the focus is just document.body
    activeDocument?: true;
    // BETA
    // in case the automatic command sorting is insufficient this allows for 
    // regular match commands to take priority over dynamic ones
    priority?: number;
}

declare interface IButtons {
    [name: string]: (moduleCtx: any) => Promise<void>;
}

declare type ContextMutator = (origContext: string[]) => string[];

declare interface IPluginUtil {
    // meta
    shutdown: () => void; // shutdown LipSurf
    pause: () => void; // pause LipSurf - so it stops listening but doesn't close help or HUD
    start: () => void; // startup LipSurf programmatically (also resumes)
    getOptions(): IOptions; 
    getOptions<T extends keyof IOptions>(...key: T[]): Pick<IOptions, T>;
    getLanguage: () => LanguageCode;
    // automatically reverts to the last selected dialect
    // if given language code is 2 characters
    setLanguage: (lang: LanguageCode) => void;

    getContext: () => string[];
    addContext: (...context: string[]) => void;
    removeContext: (...context: string[]) => void;
    // explicitly enter the seq of contexts
    enterContext: (context: string[]) => void;

    // takes into account LipSurf dialogues that are in the shadow DOM (eg. custom homosyn adder)
    getActiveEl: () => Element|null;
    queryAllFrames: (query: string, attrs?: string | string[], props?: string | string[], specialProps?: SpecialProp[]) => Promise<[string, ...any[]]>;
    postToAllFrames: (ids?: string|string[], fnNames?: string | string[], selector?, specialFns?: SpecialFn | SpecialFn[]) =>  void;
    // TODO: deprecate in favor of generic postToAllFrames?
    // currently used for fullscreen?
    sendMsgToBeacon: (msg: object) => Promise<any>;
    scrollToAnimated: (el: HTMLElement, offset?: number) => void;
    getRGB: (colorHexOrRgbStr: string) => [red: number, green: number, blue: number];
    isInViewAndTakesSpace: (el: HTMLElement) => boolean;
    isOnTop: (el: HTMLElement) => boolean;
    getNoCollisionUniqueAttr: () => string;
    sleep: (t: number) => Promise<void>;
    getHUDEl: (obscureTags?: boolean) => [HTMLDivElement, boolean];
    
    ready: () => Promise<void>;
    waitForElToExist: (elQ: string) => Promise<HTMLElement>;

    pick: (obj: object, ...props: string[]) => object;
    deepSetArray: (obj: object, keys: string[], value: any) => object;
    memoize: (...args: any[]) => any;

    fuzzyHighScore: (query: string, sources: string[], minScore?: number, partial?: boolean, skipCanonicalizing?: boolean) => Promise<[idx: number, score: number]>;
    fuzzyHighScoreScrub: (query: string, sources: string[], minScore?: number) => Promise<[idx: number, score: number, matchStartI: number, matchEndI: number]>;
    topFuzzyItemMatches: <T>(query: string, itemWTextColl: ItemWAssocText<T>[], minScore?: number) => Promise<T[]>;

    unhighlightAll: () => void;
    highlight: (...els: HTMLElement[]) => void;
    clickOrFocus: (el: HTMLElement) => void;
    disambiguate(els: FrameElWOffsets[]): Promise<[number, Promise<void>]>;
    disambiguate(els: HTMLElement[]): Promise<[number, Promise<void>]>;
    disambiguate(els: HTMLElement[]|FrameElWOffsets[]): Promise<[number, Promise<void>]>;

    runCmd: (pluginName: string, cmdName: string, cmdArgs: CmdArgs, allPlugins?: any) => Promise<void>;
    runOtherCmd: (pluginName: string, cmdName: string, cmdArgs: CmdArgs) => Promise<void>;

    showNeedsUpgradeError: (data: {plan: plan, hold?: boolean, customMsg?: string, buttons?: IButtons}) => Promise<void>;
}

declare interface IHelp {
    autoOpen: (pluginId: string, setting: string, context?: string[]) => void;
    show: (autoOpen?: boolean) => void;
    hide: (immediate?: boolean) => void;
    toggle: (show?: boolean) => boolean;
    turnOffLastAutoOpened: () => Promise<void>;
    // return true if on left
    togglePosition: () => boolean;
}

declare interface IAnnotations {
    destroy: () => void;
    annotate: (getEls: () => Promise<FrameElWOffsets[]>) => void;
    isUsed: (s: string) => boolean;
    select: (annotationName: string) => void;
    setAnnoSelectCb: (cb: (annoEl: FrameElWOffsets, annoName: string) => any) => void;
}

declare namespace ExtensionUtil {
    function queryActiveTab(): Promise<chrome.tabs.Tab & TabWithIdAndURL>;
}

declare interface ILocalizedPlugin {
    niceName: string;
    authors?: string;
    description?: string;
    homophones?: ISimpleHomophones;
    commands: {[commandName: string]: ILocalizedCommand};
}

declare interface IContext {
    [name: string]: {
        // * list of commands to allow in this context. Use format [plugin id].[command name]
        // eg. (LipSurf.Open Help) for commands from external plugins
        // * the first format is for grouping commands (name of the group, followed by commands in the group)
        commands: [group: string, commands: string[]][] | string[],
        // false by default. If true, no trimming, lowercasing, hypen removal etc. is done on the
        // transcripts that come down to be checked by match commands
        raw?: true,
    }
}

declare interface IPluginBase {
    constants: Readonly<{
      contexts: Readonly<{
        Normal: "Normal",
        Tag: "Tag"
      }>;
    }>;
    // should not be overridden by plugins
    getPluginOption: (pluginId: string, name: string) => any;
    setPluginOption: (pluginId: string, name: string, val: any) => Promise<void>;

    watch: <K extends keyof IOptions>(handler: StoreListener<Pick<IOptions, K>>, firstProp: K, ...props: K[]) => Promise<number>;
    unwatch: (id: number|undefined) => void;

    util: IPluginUtil;
    annotations: IAnnotations;
    help: IHelp;
}

declare interface IPlugin extends Partial<IPlan> {
    niceName: string;
    description?: string;
    languages?: {[L in LanguageCode]?: ILocalizedPlugin};
    version?: string;
    apiVersion?: string;
    match: RegExp | RegExp[];
    authors?: string;
    // svg string of an uncolored icon with no height or width
    icon?: string;

    commands: ICommand[];
    homophones?: ISimpleHomophones;
    contexts?: IContext;
    settings?: ISetting[];
    // always run the following regexs in this context, unlike homophones these don't look for a valid
    // command with the homophone...  they simply always replace text in the transcript. Can be used to
    // filter words, add shortcuts etc.
    replacements?: {
        pattern: RegExp,
        replacement: string,
        context?: string,
    }[],
    // called anytime the page is re-shown. Must be safe to re-run
    // while lipsurf is activated. Or when lipsurf is first activated.
    init?: (() => void) | (() => Promise<void>);
    // called when plugin is deactivated (speech recg. paused)
    // in page context
    destroy?: (() => void) | (() => Promise<void>);
    // called when LipSurf is turned off (after destroy)
    deactivatedHook?: () => void | (() => Promise<void>);
}
