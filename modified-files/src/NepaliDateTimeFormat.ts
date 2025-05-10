import {AnyCalendarDate} from './types';
import {gregorianToJulianDay} from './calendars/GregorianCalendar';
import {NepaliCalendar} from './calendars/NepaliCalendar';

export class NepaliDateTimeFormat implements Intl.DateTimeFormat {
  private locale: string;
  private options: Intl.DateTimeFormatOptions;
  private calendar: NepaliCalendar;
  private internalFormatter: Intl.DateTimeFormat;

  constructor(locale: string, options: Intl.DateTimeFormatOptions = {}) {
    this.locale = locale;
    this.options = {...options, calendar: 'gregory'}; // Use gregory for internal formatting

    // Create a similar formatter without the nepali calendar for fallback formatting
    this.internalFormatter = new Intl.DateTimeFormat(locale, this.options);

    // Initialize the nepali calendar
    this.calendar = new NepaliCalendar();
  }

  /**
   * Convert a JavaScript Date to a Nepali date object.
   */
  private toNepaliDate(date: Date): AnyCalendarDate {
    const julianDay = gregorianToJulianDay(
      'AD',
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    return this.calendar.fromJulianDay(julianDay);
  }

  /**
   * Format a date according to the locale and options.
   */
  format(date?: Date | number): string {
    if (date === undefined) {
      date = new Date();
    } else if (typeof date === 'number') {
      date = new Date(date);
    }

    // Get parts from internal formatter
    const parts = this.formatToParts(date);

    // Combine parts into a string
    return parts.map(part => part.value).join('');
  }

  /**
   * Format a date to parts according to the locale and options.
   */
  formatToParts(date?: Date | number): Intl.DateTimeFormatPart[] {
    if (date === undefined) {
      date = new Date();
    } else if (typeof date === 'number') {
      date = new Date(date);
    }

    const nepaliDate = this.toNepaliDate(date);

    // Get parts from internal formatter first
    const parts = this.internalFormatter.formatToParts(date);

    // Replace year, month, and day values with Nepali equivalents
    return parts.map(part => {
      const newPart = {...part};

      if (part.type === 'year') {
        newPart.value = this.formatNepaliValue(nepaliDate.year);
      } else if (part.type === 'month') {
        newPart.value = this.formatNepaliMonth(nepaliDate.month, part.value);
      } else if (part.type === 'day') {
        newPart.value = this.formatNepaliValue(nepaliDate.day);
      } else if (part.type === 'weekday') {
        // Keep original weekday as days of week align between calendars
      } else if (part.type === 'era') {
        newPart.value = this.formatNepaliEra();
      }


      return newPart;
    });
  }

  /**
   * Format a date range according to the locale and options.
   */
  formatRange(startDate: Date | number, endDate: Date | number): string {
    // Convert to Date objects if numbers
    if (typeof startDate === 'number') {
      startDate = new Date(startDate);
    }
    if (typeof endDate === 'number') {
      endDate = new Date(endDate);
    }

    // Get parts from formatRangeToParts
    const parts = this.formatRangeToParts(startDate, endDate);

    // Combine parts into a string
    return parts.map(part => part.value).join('');
  }

  /**
   * Format a date range to parts according to the locale and options.
   */
  formatRangeToParts(startDate: Date | number, endDate: Date | number): Intl.DateTimeRangeFormatPart[] {
    // Convert to Date objects if numbers
    if (typeof startDate === 'number') {
      startDate = new Date(startDate);
    }
    if (typeof endDate === 'number') {
      endDate = new Date(endDate);
    }

    // Get Nepali dates
    const nepaliStartDate = this.toNepaliDate(startDate);
    const nepaliEndDate = this.toNepaliDate(endDate);

    // Use internal formatter to get range parts
    const rangeParts = this.internalFormatter.formatRangeToParts(startDate, endDate);

    // Replace year, month, and day values with Nepali equivalents
    return rangeParts.map(part => {
      const newPart = {...part};

      if (part.type === 'year') {
        const nepaliYear = part.source === 'startRange' ? nepaliStartDate.year : nepaliEndDate.year;
        newPart.value = this.formatNepaliValue(nepaliYear);
      } else if (part.type === 'month') {
        const nepaliMonth = part.source === 'startRange' ? nepaliStartDate.month : nepaliEndDate.month;
        newPart.value = this.formatNepaliMonth(nepaliMonth, part.value);
      } else if (part.type === 'day') {
        const nepaliDay = part.source === 'startRange' ? nepaliStartDate.day : nepaliEndDate.day;
        newPart.value = this.formatNepaliValue(nepaliDay);
      } else if (part.type === 'era') {
        // Use appropriate era name based on locale
        newPart.value = this.locale.startsWith('ne') ? 'बि.सं.' : 'BS'; // Bikram Sambat
      }

      return newPart;
    });
  }

  /**
   * Format a numeric value using Nepali/Devanagari digits if the locale requires it.
   */
  private formatNepaliValue(value: number): string {
    // Check if we should use Devanagari digits based on locale and numberingSystem
    const useDevanagariDigits = this.locale.startsWith('ne') ||
                                this.options.numberingSystem === 'deva';

    if (useDevanagariDigits) {
      return value.toString().replace(/\d/g, digit =>
        String.fromCharCode(0x0966 + Number.parseInt(digit, 10)) // 0x0966 is the Unicode code point for Devanagari digit 0
      );
    }

    return value.toString();
  }

  /**
   * Format a month value according to the format type used in original part.
   */
  private formatNepaliMonth(month: number, originalFormat: string): string {
    // Define Nepali month names (for Nepali locale)
    const nepaliMonths = {
      long: [
        'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन',
        'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
      ],
      short: [
        'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन',
        'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
      ],
      narrow: [
        'बै', 'जे', 'अ', 'श्रा', 'भा', 'आ',
        'का', 'मं', 'पौ', 'मा', 'फा', 'चै'
      ]
    };

    // Define transliterated month names (for non-Nepali locales)
    const transliteratedMonths = {
      long: [
        'Baisakh', 'Jestha', 'Asadh', 'Shrawan', 'Bhadra', 'Ashwin',
        'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
      ],
      short: [
        'Bai', 'Jes', 'Asa', 'Shr', 'Bha', 'Ash',
        'Kar', 'Man', 'Pou', 'Mag', 'Fal', 'Cha'
      ],
      narrow: [
        'B', 'J', 'A', 'S', 'B', 'A',
        'K', 'M', 'P', 'M', 'F', 'C'
      ]
    };

    // Choose the appropriate month names based on locale
    const monthNames = this.locale.startsWith('ne') ? nepaliMonths : transliteratedMonths;

    if (/^\d+$/.test(originalFormat)) {
      let formattedMonth = this.formatNepaliValue(month);
      if (originalFormat.length === 2) {
        formattedMonth = formattedMonth.padStart(2, this.formatNepaliValue(0).charAt(0));
      }
      return formattedMonth;
    }

    // Determine the format type based on both month and dateStyle options
    let formatType: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';

    if (this.options.month) {
      formatType = this.options.month;
    } else if (this.options.dateStyle) {
      // Map dateStyle to appropriate month format
      switch (this.options.dateStyle) {
        case 'full':
        case 'long':
          formatType = 'long';
          break;
        case 'medium':
          formatType = 'short';
          break;
        case 'short':
          formatType = 'numeric';
          break;
        default:
          formatType = 'long';
      }
    } else {
      // Default to long format if no options specified
      formatType = 'long';
    }

    // Format the month according to the determined format type
    switch (formatType) {
      case 'numeric':
        return this.formatNepaliValue(month);
      case '2-digit':
        return this.formatNepaliValue(month).padStart(2, this.formatNepaliValue(0).charAt(0));
      case 'narrow':
        return monthNames.narrow[month - 1];
      case 'short':
        return monthNames.short[month - 1];
      case 'long':
        return monthNames.long[month - 1];
    }
  }

  private formatNepaliEra(): string {
    // Define Nepali era names
    const nepaliEra = {
      long: 'बिक्रम सम्बत',
      short: 'बि.सं.',
      narrow: 'बि.सं.'
    };

    // Define transliterated era names
    const transliteratedEra = {
      long: 'Bikram Sambat',
      short: 'BS',
      narrow: 'BS'
    };

    // Choose the appropriate era names based on locale
    const eraNames = this.locale.startsWith('ne') ? nepaliEra : transliteratedEra;

    // Determine the format type based on era option
    let formatType: 'long' | 'short' | 'narrow';

    if (this.options.era) {
      formatType = this.options.era;
    } else if (this.options.dateStyle) {
      // Map dateStyle to appropriate era format
      switch (this.options.dateStyle) {
        case 'full':
        case 'long':
          formatType = 'long';
          break;
        case 'medium':
          formatType = 'short';
          break;
        case 'short':
          formatType = 'narrow';
          break;
        default:
          formatType = 'short';
      }
    } else {
      // Default to short format if no options specified
      formatType = 'short';
    }

    return eraNames[formatType];
  }

  /**
   * Get the resolved options used for formatting.
   */
  resolvedOptions(): Intl.ResolvedDateTimeFormatOptions {
    const resolved = this.internalFormatter.resolvedOptions();

    // Override calendar and numberingSystem
    resolved.calendar = 'nepali';

    // Use Devanagari numbering system for Nepali locale
    if (this.locale.startsWith('ne')) {
      resolved.numberingSystem = 'deva';
    }

    return resolved;
  }

  /**
   * Static method to check which locales are supported.
   */
  static supportedLocalesOf(
    locales: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string[] {
    // For now, simply delegate to the internal formatter's supportedLocalesOf
    return Intl.DateTimeFormat.supportedLocalesOf(locales, options);
  }
}
