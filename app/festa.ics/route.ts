import { ICS } from "../../lib/ics";
export const GET = () =>
  new Response(ICS, { headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": 'inline; filename="thais-17-anos.ics"' } });
