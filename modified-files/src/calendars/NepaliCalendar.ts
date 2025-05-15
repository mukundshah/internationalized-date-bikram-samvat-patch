/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Portions of the code in this file are based on code from ICU.
// Original licensing can be found in the NOTICE file in the root directory of this source tree.

import {AnyCalendarDate, CalendarIdentifier} from '../types';
import {CalendarDate} from '../CalendarDate';
import {GregorianCalendar} from './GregorianCalendar';

const NEPALI_EPOCH = 2419871; // Julian day for 1970 Baisakh 1 (first month, first day of first year in our data)
const VIKRAM_YEAR_ZERO = 1970;

const VIKRAM_MONTH_DATA = 'uhpRALoXUQDuVpAA7VaEALoaUQD6GVEA7laQAO1WhAC6GlEA+hZRAO5WkADqSlEAuhpRAPoWUQDuVpAA6kpRALoaUQDuFlEA7laQAOoaUQC6GlEA7hZRAO5WhADqGlEAuhpRAO5WUADuVoQAuhpRALoaUQDuVpAA7VaEALoaUQD6FlEA7laQAO1WhAC6GlEA+hZRAO5WkADqSoEAuhpRAPoWUQDuVpAA6kpRALoaUQD6FlEA7laQAOpKUQC6GlEA7hZRAO5WhADqGlEAuhpRAO5WUADuVoQA6hpRALoaUQDuVpAA7VaEALoaUQC6F1EA7laQAO1WhAC6GlEA+hZRAO5WkADtSoEAuhpRAPoWUQDuVpAA6kpRALoaUQD6FlEA7laQAOpKUQC6GlEA7hZRAO5WkADqGlEAuhpRAO5WUADuVoQA6hpRALoaUQDuVlAA7laEALoaUQC6F1EA7laQAO1WhAC6GlEA+hZRAO5WkADtSoQAuhpRAPoWUQDuVpAA6kqBALoaUQD6FlEA7laQAOpKUQC6GlEA7hZRAO5WkADqGlEAuhpRAO5WUADuVoQA6hpRALoaUQDuVlAA7laEALoaUQC6GlEA7laQAO1WhAC6GlEA+hZRAO5WkADtVoQAuhpRAPoWUQDuVpAA6kqBALoaUQD6FlEA7laQAOpKUQC6GlEA+hZRAA==';

let VIKRAM_YEAR_START_TABLE: Uint32Array;
let VIKRAM_MONTHLENGTH: Uint32Array;

function vikramMonthLength(year: number, month: number) {
  if (month < 1 || month > 12) {throw new Error('Invalid month value: ' + month);}

  const delta = VIKRAM_MONTHLENGTH[year - VIKRAM_YEAR_ZERO];
  if (typeof delta === 'undefined') {throw new Error('No data for year: ' + year + ' BS');}

  return 29 + ((delta >>> (((month - 1) << 1))) & 3);
}

/**
 * The Vikram Samvat Calendar is a historical Hindu calendar used in the Indian subcontinent and Nepal.
 * Years are counted from 57 BCE. The calendar is primarily used in Nepal and among Hindus
 * in North India. Only one era identifier is supported: 'vikram'.
 */
export class NepaliCalendar extends GregorianCalendar {
  identifier = 'nepali' as CalendarIdentifier;

  constructor() {
    super();
    if (!VIKRAM_MONTHLENGTH) {
      VIKRAM_MONTHLENGTH = new Uint32Array(Uint8Array.from(atob(VIKRAM_MONTH_DATA), c => c.charCodeAt(0)).buffer);
    }

    console.log(VIKRAM_MONTHLENGTH.length);

    if (!VIKRAM_YEAR_START_TABLE) {
      VIKRAM_YEAR_START_TABLE = new Uint32Array(VIKRAM_MONTHLENGTH.length);

      let yearStart = 0;
      for (let year = VIKRAM_YEAR_ZERO; year <= VIKRAM_YEAR_ZERO + VIKRAM_MONTHLENGTH.length - 1; year++) {
        VIKRAM_YEAR_START_TABLE[year - VIKRAM_YEAR_ZERO] = yearStart;
        for (let i = 1; i <= 12; i++) {
          yearStart += vikramMonthLength(year, i);
        }
      }
    }
  }

  fromJulianDay(jd: number): CalendarDate {
    const days = jd - NEPALI_EPOCH;

    let yearIndex = 0;
    let yearCount = VIKRAM_MONTHLENGTH.length;

    if (days < 0 || days >= VIKRAM_YEAR_START_TABLE![yearCount]) {
      throw new Error('Date outside supported range: ' + jd);
    }

    let low = 0;
    let high = yearCount;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (VIKRAM_YEAR_START_TABLE![mid] <= days) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    yearIndex = low - 1;
    const year = VIKRAM_YEAR_ZERO + yearIndex;

    let dayOfYear = days - VIKRAM_YEAR_START_TABLE![yearIndex];
    let month = 1;
    let dayInMonth = dayOfYear + 1;

    while (month <= 12) {
      const daysInMonth = vikramMonthLength(year, month);
      if (dayInMonth <= daysInMonth) {
        break;
      }
      dayInMonth -= daysInMonth;
      month++;
    }

    return new CalendarDate(this, year, month, dayInMonth);
  }

  toJulianDay(date: AnyCalendarDate): number {
    const {year, month, day} = date;

    if (year < VIKRAM_YEAR_ZERO || year >= VIKRAM_YEAR_ZERO + VIKRAM_MONTHLENGTH.length) {
      throw new Error('Year outside supported range: ' + year);
    }

    if (month < 1 || month > 12) {
      throw new Error('Invalid month: ' + month);
    }

    if (day < 1 || day > vikramMonthLength(year, month)) {
      throw new Error('Invalid day: ' + day);
    }

    let jd = NEPALI_EPOCH + VIKRAM_YEAR_START_TABLE![year - VIKRAM_YEAR_ZERO];

    for (let m = 1; m < month; m++) {
      jd += vikramMonthLength(year, m);
    }

    jd += day - 1;

    return jd;
  }

  getDaysInMonth(date: AnyCalendarDate): number {
    return vikramMonthLength(date.year, date.month);
  }

  getDaysInYear(date: AnyCalendarDate): number {
    if (date.year < VIKRAM_YEAR_ZERO || date.year >= VIKRAM_YEAR_ZERO + VIKRAM_MONTHLENGTH.length) {
      throw new Error('Year outside supported range: ' + date.year);
    }

    if (date.year === VIKRAM_YEAR_ZERO + VIKRAM_MONTHLENGTH.length - 1) {
      let days = 0;
      for (let m = 1; m <= 12; m++) {
        days += vikramMonthLength(date.year, m);
      }
      return days;
    }

    return VIKRAM_YEAR_START_TABLE![date.year + 1 - VIKRAM_YEAR_ZERO] - VIKRAM_YEAR_START_TABLE![date.year - VIKRAM_YEAR_ZERO];
  }

  getYearsInEra(): number {
    return VIKRAM_YEAR_ZERO + VIKRAM_MONTHLENGTH.length - 1;
  }

  getEras(): string[] {
    return ['BS'];
  }

  balanceDate(): void {}
}
