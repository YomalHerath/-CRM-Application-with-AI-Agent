import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { useSearch } from "../context/SearchContext";
import { API_BASE_URL } from "../config/api";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    description: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { searchTerm } = useSearch();
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "High",
    Success: "Low",
    Primary: "Medium",
    Warning: "Urgent",
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch(`${API_BASE_URL}/events`)
      .then(res => res.json())
      .then(data => {
        const mappedEvents = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          start: e.start_date,
          end: e.end_date,
          extendedProps: {
            calendar: e.calendar || "Primary",
            description: e.description || ""
          }
        }));
        setEvents(mappedEvents);
      })
      .catch(err => console.error(err));
  };

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = event.title?.toString().toLowerCase().includes(term);
    const descMatch = event.extendedProps.description?.toLowerCase().includes(term);
    const dateMatch = event.start?.toString().toLowerCase().includes(term) || event.end?.toString().toLowerCase().includes(term);
    return titleMatch || descMatch || dateMatch;
  });

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    let start = selectInfo.startStr;
    let end = selectInfo.endStr || selectInfo.startStr;
    if (!start.includes("T")) start += "T09:00";
    if (!end.includes("T")) end += "T10:00";
    setEventStartDate(start.slice(0, 16));
    setEventEndDate(end.slice(0, 16));
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventDescription(event.extendedProps.description || "");

    const startObj = event.start;
    const endObj = event.end || event.start;

    if (startObj) {
      const startIso = new Date(startObj.getTime() - (startObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setEventStartDate(startIso);
    }
    if (endObj) {
      const endIso = new Date(endObj.getTime() - (endObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setEventEndDate(endIso);
    }

    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    const eventData: any = {
      title: eventTitle,
      start: eventStartDate,
      end: eventEndDate,
      description: eventDescription,
      calendar: eventLevel || "Primary"
    };

    if (selectedEvent) {
      eventData.id = selectedEvent.id;
    }

    fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          fetchEvents();
          closeModal();
          resetModalFields();
        } else {
          alert("Error saving event");
        }
      })
      .catch(err => console.error(err));
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventDescription("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("Primary");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta
        title="Admin Panel | Calendar"
        description="Manage your CRM events and tasks"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={filteredEvents}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: openModal,
              },
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan your next big moment
              </p>
            </div>
            <div className="mt-8">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                ></textarea>
              </div>

              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Priority
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, label]) => (
                    <div key={key} className="n-chk">
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-400 cursor-pointer">
                        <input
                          type="radio"
                          name="event-level"
                          value={key}
                          checked={eventLevel === key}
                          onChange={() => setEventLevel(key)}
                          className="mr-2"
                        />
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {selectedEvent ? "Update Changes" : "Add Event"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${(eventInfo.event.extendedProps.calendar || "Primary").toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm overflow-hidden`}>
      <div className="fc-event-time text-xs font-semibold mr-1 text-black">
        {eventInfo.timeText.replace('a', 'AM').replace('p', 'PM')}
      </div>
      <div className="fc-event-title text-xs truncate">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
