import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { useEffect, useState } from "react";
import VapiAgent from "../Vapi/VapiAgent";
import { API_BASE_URL } from "../../config/api";

export default function EcommerceMetrics() {
  const [stats, setStats] = useState({
    leads: 0,
    events: 0,
    users: 0,
    voice_agent: { books_submitted: 0, tasks_completed: 0 }
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/activities`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10">
          <GroupIcon className="size-6 text-brand-500 dark:text-brand-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Leads
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.leads}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-light-50 dark:bg-blue-light-500/10">
          <BoxIconLine className="size-6 text-blue-light-500 dark:text-blue-light-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Upcoming Events
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.events}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success-50 dark:bg-success-500/10">
          <GroupIcon className="size-6 text-success-500 dark:text-success-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Voice Agent - Books Submitted
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.voice_agent?.books_submitted || 0}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10">
          <GroupIcon className="size-6 text-orange-500 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Voice Agent - Tasks Completed
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.voice_agent?.tasks_completed || 0}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      <div className="col-span-1">
        <VapiAgent />
      </div>
    </div>
  );
}
