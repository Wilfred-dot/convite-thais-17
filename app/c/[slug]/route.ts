import { renderInvite, htmlResponse } from "../../../lib/render";
import { nameFromSlug } from "../../../lib/guest";
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return htmlResponse(renderInvite(nameFromSlug(slug), new URL(req.url).origin));
}
