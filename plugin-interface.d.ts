/// <reference types="webdriverio"/>
declare type ExecutionContext<T> = import('ava').ExecutionContext<T>;
declare type IndicesPair = [number, number];

declare interface IDisableable {
    enabled: boolean;
}

type plan = 0|10|20;

type ItemWAssocText<T> = {item: T, text: string[]};
type ClickableElement = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement;
type TabWithIdAndURL = chrome.tabs.Tab & {id: number, url: string};
type FrameEleWithOffsets = [string, ClientRect];
// the HTMLElement if it's in the current frame, or the element id string if it's another frame
type FrameEleWOffsets = FrameEleWithOffsets;

// for talking to iframes
type SpecialProp = 'visible'|'pos'|'onTop';
type SpecialFn = 'clickOrFocus'|'blinkHighlight'|'highlight'|'unhighlightAll';

type StoreListener<T> = (newState: T) => (Promise<void>|void);


declare interface IPlan {
    plan: plan;
}

// BCP-47
declare type LanguageCode = 'af'|'sq'|'am'|'ar'|'ar-DZ'|'ar-BH'|'ar-EG'|'ar-IQ'|'ar-JO'|'ar-KW'|'ar-LB'|'ar-LY'|'ar-MA'|'ar-OM'|'ar-QA'|'ar-SA'|'ar-SY'|'ar-TN'|'ar-AE'|'ar-YE'|'hy'|'as'|'az'|'eu'|'be'|'bn'|'bs'|'bg'|'my'|'ca'|'zh-CN'|'zh-HK'|'zh-MO'|'zh-SG'|'zh-TW'|'hr'|'cs'|'da'|'nl-BE'|'nl-NL'|'en'|'en-AU'|'en-BZ'|'en-CA'|'en-CB'|'en-GB'|'en-IN'|'en-IE'|'en-JM'|'en-NZ'|'en-PH'|'en-ZA'|'en-TT'|'en-US'|'et'|'mk'|'fo'|'fa'|'fi'|'fr-BE'|'fr-CA'|'fr-FR'|'fr-LU'|'fr-CH'|'gd-IE'|'gd'|'de-AT'|'de-DE'|'de-LI'|'de-LU'|'de-CH'|'el'|'gn'|'gu'|'he'|'hi'|'hu'|'is'|'id'|'it-IT'|'it-CH'|'ja'|'kn'|'ks'|'kk'|'km'|'ko'|'lo'|'la'|'lv'|'lt'|'ms-BN'|'ms-MY'|'ml'|'mt'|'mi'|'mr'|'mn'|'ne'|'no-NO'|'or'|'pl'|'pt-BR'|'pt-PT'|'pa'|'rm'|'ro-MO'|'ro'|'ru'|'ru-RU'|'ru-MO'|'sa'|'sr-SP'|'tn'|'sd'|'si'|'sk'|'sl'|'so'|'sb'|'es'|'es-AR'|'es-BO'|'es-CL'|'es-CO'|'es-CR'|'es-DO'|'es-EC'|'es-SV'|'es-GT'|'es-HN'|'es-MX'|'es-NI'|'es-PA'|'es-PY'|'es-PE'|'es-PR'|'es-ES'|'es-UY'|'es-VE'|'sw'|'sv-FI'|'sv-SE'|'tg'|'ta'|'tt'|'te'|'th'|'bo'|'ts'|'tr'|'tk'|'uk'|'ur'|'uz-UZ'|'vi'|'cy'|'xh'|'yi'|'zu';

type Serialized<T> = {
    [K in keyof T]: T[K] extends RegExp ? string :
                    T[K] extends RegExp[] ? string[] :
                    T[K] extends Function ? string :
                    T[K] extends Array<object> ? Serialized<T[K]> :
                    T[K] extends Object ? Serialized<T[K]> :
                    T[K];
}

// for 3rd party plugins definitions
declare interface ISimpleHomophones {
    [s: string]: string;
}

declare type SyncDynamicMatchFnResp = [number, number, any[]?]|undefined|false;
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

declare type ISetting = IStringSetting | IBooleanSetting | INumberSetting;
declare type SingleTest = (t: ExecutionContext<ICommandTestContext>, say: (s?: string) => Promise<void>, client: WebdriverIOAsync.BrowserObject) => Promise<void>|void;

declare interface ICommand extends Partial<IPlan>, ILocalizedCommand, IGlobalCommand, IFnCommand {
    test?: SingleTest | {[testTitle: string]: SingleTest};
    // matchOutput is the array returned from the match function (if there's a match fn) or 
    // the arguments from special match string (wildcard, numeral etc. type special params)
    pageFn?: (transcript: string, ...matchOutput: any[]) => void|Promise<void>;
    context?: string|string[];
    // set to false to not include this command in Normal mode. For commands that only belong
    // in certain context(s)
    normal?: false;
    settings?: ISetting[];
    minConfidence?: number;
    // whether to execute this command in the iframe that has focus 
    // won't work if the focus is just document.body
    activeDocument?: true;
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
    setLanguage: (lang: LanguageCode) => void;

    getContext: () => string[];
    mutateContext: (mutator: ContextMutator) => Promise<void>;
    addContext: (context: string) => Promise<void>;
    removeContext: (context: string) => Promise<void>;
    // explicitly enter the seq of contexts
    enterContext: (context: string[]) => Promise<void>;
    
    ready: () => Promise<void>;
    waitForElToExist: (elQ: string) => Promise<HTMLElement>;
    queryAllFrames: (query: string, attrs?: string | string[], props?: string | string[], specialProps?: SpecialProp | SpecialProp[]) => Promise<[string, ...any[]]>;
    postToAllFrames: (ids?: string|string[], fnNames?: string | string[], selector?, specialFns?: SpecialFn | SpecialFn[]) =>  void;
    // TODO: deprecate in favor of generic postToAllFrames?
    // currently used for fullscreen?
    sendMsgToBeacon: (msg: object) => Promise<any>;
    scrollToAnimated: (el: HTMLElement, offset?: number) => void;
    isInViewAndTakesSpace: (el: HTMLElement) => boolean;
    getNoCollisionUniqueAttr: () => string;
    sleep: (t: number) => Promise<void>;
    getHUDEl: (obscureTags?: boolean) => [HTMLDivElement, boolean];
    pick: (obj: object, ...props: string[]) => object;

    fuzzyScore: (query: string, source: string, partial?: boolean) => Promise<number>;
    topFuzzyElemMatches: <T>(query: string, itemWTextColl: ItemWAssocText<T>[]) => Promise<T[]>;

    unhighlightAll: () => void;
    highlight: (...els: HTMLElement[]) => void;
    disambiguate: (els: HTMLElement[]|FrameEleWOffsets[]) => Promise<HTMLElement|FrameEleWOffsets>;
    clickOrFocus: (el: HTMLElement) => void;

    runCmd: (pluginName: string, cmdName: string, cmdArgs: CmdArgs, allPlugins?: any) => Promise<void>;
    runOtherCmd: (pluginName: string, cmdName: string, cmdArgs: CmdArgs) => Promise<void>;

    showNeedsUpgradeError: (data: {plan: plan, hold?: boolean, customMsg?: string, buttons?: IButtons}) => Promise<void>;
}

declare interface IAnnotations {
    destroy: () => void;
    annotate: (getEls: () => Promise<FrameEleWOffsets[]>) => void;
    annos: {
        used: Set<string>,
    };
    select: (annotationName: string) => void;
    setAnnoSelectCb: (cb: (annoEl: FrameEleWOffsets, annoName: string) => any) => void;
}

declare namespace ExtensionUtil {
    function queryActiveTab(): Promise<chrome.tabs.Tab & TabWithIdAndURL>;
    function toggleActivated(_activated:boolean): Promise<void>;
}

declare interface IPluginTranslation {
    niceName: string;
    authors?: string;
    description?: string;
    homophones?: ISimpleHomophones;
    commands: {[commandName: string]: ILocalizedCommand};
}

declare interface IContext {
    [name: string]: {
        // list of commands to allow in this context. Use format [plugin id].[command name]
        // eg. (LipSurf.Open Help) for commands from external plugins
        commands: {
            [category: string]: string[],
        } | string[],
        // false by default. If true, no trimming, lowercasing, hypen removal etc. is done on the
        // transcripts that come down to be checked by match commands
        raw?: true,
    }
}

declare interface IPluginBase {
    // should not be overridden by plugins
    getPluginOption: (pluginId: string, name: string) => any;
    setPluginOption: (pluginId: string, name: string, val: any) => Promise<void>;
    watch: <K extends keyof IOptions>(handler: StoreListener<Pick<IOptions, K>>, firstProp: K, ...props: K[]) => Promise<number>;

    util: IPluginUtil;
    annotations: IAnnotations;
}

declare interface IPlugin extends Partial<IPlan> {
    niceName: string;
    description?: string;
    languages?: {[L in LanguageCode]?: IPluginTranslation};
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
