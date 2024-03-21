export interface IDay {
  date: Date;
  dayOfWeek: number;
  isToday: boolean;
  hasEvent: boolean;
  eventId?: string | null;
  eventColor: string;
}
