// Interface para representar um evento
export interface IEvent {
  _id?: any;
  id?: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  eventColor: string;
  owner?: string;
  members?: Array<string>;
}
