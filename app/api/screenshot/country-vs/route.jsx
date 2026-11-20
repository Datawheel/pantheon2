import {renderVsCard} from "../helpers/vsCard";

export const runtime = "nodejs";

export function GET(request) {
  return renderVsCard(request, true);
}
