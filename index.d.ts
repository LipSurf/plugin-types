declare type plan = 0|10|20;

declare type Term = 'yearly'|'monthly';

// one's we've added ourselves
declare type GeneralizedLanguageCodes = 'fr'|'de'|'es'|'pt';
// BCP-47
declare type LanguageCode = GeneralizedLanguageCodes|'af'|'sq'|'am'|'ar'|'ar-DZ'|'ar-BH'|'ar-EG'|'ar-IQ'|'ar-JO'|'ar-KW'|'ar-LB'|'ar-LY'|'ar-MA'|'ar-OM'|'ar-QA'|'ar-SA'|'ar-SY'|'ar-TN'|'ar-AE'|'ar-YE'|'hy'|'as'|'az'|'eu'|'be'|'bn'|'bs'|'bg'|'my'|'ca'|'zh-CN'|'zh-HK'|'zh-MO'|'zh-SG'|'zh-TW'|'hr'|'cs'|'da'|'nl-BE'|'nl-NL'|'en'|'en-AU'|'en-BZ'|'en-CA'|'en-CB'|'en-GB'|'en-IN'|'en-IE'|'en-JM'|'en-NZ'|'en-PH'|'en-ZA'|'en-TT'|'en-US'|'et'|'mk'|'fo'|'fa'|'fi'|'fr-BE'|'fr-CA'|'fr-FR'|'fr-LU'|'fr-CH'|'gd-IE'|'gd'|'de-AT'|'de-DE'|'de-LI'|'de-LU'|'de-CH'|'el'|'gn'|'gu'|'he'|'hi'|'hu'|'is'|'id'|'it-IT'|'it-CH'|'ja'|'kn'|'ks'|'kk'|'km'|'ko'|'lo'|'la'|'lv'|'lt'|'ms-BN'|'ms-MY'|'ml'|'mt'|'mi'|'mr'|'mn'|'ne'|'no-NO'|'or'|'pl'|'pt-BR'|'pt-PT'|'pa'|'rm'|'ro-MO'|'ro'|'ru'|'ru-RU'|'ru-MO'|'sa'|'sr-SP'|'tn'|'sd'|'si'|'sk'|'sl'|'so'|'sb'|'es-AR'|'es-BO'|'es-CL'|'es-CO'|'es-CR'|'es-DO'|'es-EC'|'es-SV'|'es-GT'|'es-HN'|'es-MX'|'es-NI'|'es-PA'|'es-PY'|'es-PE'|'es-PR'|'es-ES'|'es-UY'|'es-VE'|'sw'|'sv-FI'|'sv-SE'|'tg'|'ta'|'tt'|'te'|'th'|'bo'|'ts'|'tr'|'tk'|'uk'|'ur'|'uz-UZ'|'vi'|'cy'|'xh'|'yi'|'zu';

declare interface CardSummarized {
    lastFour: string;
    type: string;
}

declare namespace API {
    type CreateCheckoutSessionResp = FailResp | CreateCheckoutSessionSuccess;

    interface FailResp {
        success: false;
        error: string;
    }

    interface CreateCheckoutSessionSuccess {
        success: true;
        sessionId: string;
    }

    type GetPlanSettings = FailResp | GetPlanSettingsSuccess;

    interface GetPlanSettingsSuccess {
        success: true;
        // the date in the future when the next payment will take place (null if being cancelled)
        renewAt: number|null;
        // the date in the future the sub will be automatically cancelled
        cancelAt: number|null;
        term: Term;
        plan: plan;
        costInCents: number;
        card: CardSummarized;
    }
}