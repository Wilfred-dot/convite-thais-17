import { renderInvite, htmlResponse } from "../lib/render";
export const GET = (req: Request) => htmlResponse(renderInvite("", new URL(req.url).origin));
