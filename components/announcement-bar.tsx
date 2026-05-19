import { Icon } from "@/components/icons";
import { announcement } from "@/lib/data";

export function AnnouncementBar() {
  return (
    <div className="bg-flame-500 text-white">
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-semibold leading-tight sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <Icon name="truck" className="h-4 w-4" />
          <span>{announcement.message}</span>
        </p>
        <p className="hidden shrink-0 text-right sm:block">{announcement.impact}</p>
      </div>
    </div>
  );
}
