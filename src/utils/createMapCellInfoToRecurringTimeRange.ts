import addMinutes from 'date-fns/add_minutes';
import compareAsc from 'date-fns/compare_asc';
import endOfDay from 'date-fns/end_of_day';
import isBefore from 'date-fns/is_before';
import isEqual from 'date-fns/is_equal';
import startOfDay from 'date-fns/start_of_day';
import subDays from 'date-fns/sub_days';
import range from 'lodash/range';
import { DateRange, MapCellInfoToDateRange } from '../types';
import { cellToDate } from './cellToDate';

export type RecurringTimeRange = DateRange[];

export const createMapCellInfoToRecurringTimeRange: MapCellInfoToDateRange = ({
  fromY: toMin,
  fromX: toDay,
  originDate,
}) => ({ startX, startY, endX, spanY }) => {
  const result = range(startX, endX + 1)
    .map(i => {
      const startDate = cellToDate({
        startX: i,
        startY,
        toMin,
        toDay,
        originDate,
      });
      let endDate = addMinutes(startDate, toMin(spanY));

      if (isEqual(endDate, startOfDay(endDate))) {
        endDate = endOfDay(subDays(endDate, 1));
      }

      const range: DateRange = isBefore(startDate, endDate)
        ? [startDate, endDate]
        : [endDate, startDate];

      return range;
    })
    .sort((range1, range2) => compareAsc(range1[0], range2[0]));

  return result;
};
