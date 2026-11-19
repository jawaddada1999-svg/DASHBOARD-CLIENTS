import React, { useMemo, useState } from 'react';
import {
  Ban,
  Calendar,
  CalendarCheck2,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Edit3,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Settings,
  Table2,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { formatMAD, formatShortDate } from '../../i18n/translations';
import { Appointment, AppointmentStatus } from '../../types/domain';
import { buildTelHref, buildWhatsAppHref } from '../../utils/contactLinks';
import {
  generateHourlyRange,
  getDayKeyFromIsoDate,
  getSlotAvailability,
  shiftIsoDate,
} from '../../utils/scheduleUtils';
import { AppointmentFormModal } from '../modals/QuickModals';
import {
  ClassificationBadge,
  ConfirmDialog,
  ContactMethodBadge,
  EmptyState,
  KpiCard,
  Modal,
  StatusLabel,
} from '../ui/DataPrimitives';

type ViewTab = 'table' | 'daily' | 'weekly' | 'monthly';

const aptCardTone: Record<AppointmentStatus, string> = {
  scheduled: 'bg-[#F3F9FF] border-[#BADAF6] border-s-4 border-s-[#0284C7]',
  confirmed: 'bg-[#FFF8F3] border-[#F7CFB6] border-s-4 border-s-[#EA580C]',
  attended: 'bg-[#F3FCF7] border-[#B6E3CD] border-s-4 border-s-[#059669]',
  no_show: 'bg-[#FFF6F8] border-[#F5C5D0] border-s-4 border-s-[#E11D48]',
  cancelled: 'bg-[#F6F7F9] border-[#D1D5DB] border-s-4 border-s-zinc-500',
  rescheduled: 'bg-[#FFFDF4] border-[#F3D88B] border-s-4 border-s-[#D97706]',
};

export const AppointmentsSection: React.FC = () => {
  const {
    t,
    language,
    appointments,
    leads,
    properties,
    employees,
    settings,
    updateSettings,
    updateAppointment,
    openLeadProfile,
    setActiveSection,
    pushToast,
  } = useAgency();

  const [viewTab, setViewTab] = useState<ViewTab>('daily');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedDay, setSelectedDay] = useState('2026-11-19');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [aptModalOpen, setAptModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string>('2026-11-19');
  const [modalDefaultTime, setModalDefaultTime] = useState<string>('11:00');
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('2026-11-22');
  const [newTime, setNewTime] = useState('11:00');

  const isRtl = t.app.dir === 'rtl';

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        if (dateFilter && a.date !== dateFilter) return false;
        if (employeeFilter !== 'all' && a.employee_id !== employeeFilter) return false;
        if (statusFilter !== 'all' && a.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [appointments, dateFilter, employeeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed').length;
    const attended = appointments.filter((a) => a.status === 'attended').length;
    const noShow = appointments.filter((a) => a.status === 'no_show').length;
    return { total, upcoming, completed: attended + noShow, attended, noShow };
  }, [appointments]);

  const weekDays = [
    '2026-11-16',
    '2026-11-17',
    '2026-11-18',
    '2026-11-19',
    '2026-11-20',
    '2026-11-21',
    '2026-11-22',
  ];

  const monthDays = Array.from({ length: 30 }, (_, i) => {
    const d = String(i + 1).padStart(2, '0');
    return `2026-11-${d}`;
  });

  // Daily agenda strip centered around selectedDay (-3 to +3)
  const agendaStripDays = useMemo(
    () => [-3, -2, -1, 0, 1, 2, 3].map((delta) => shiftIsoDate(selectedDay, delta)),
    [selectedDay]
  );

  const hourlyRange = useMemo(() => generateHourlyRange(8, 20), []);
  const selectedDayKey = getDayKeyFromIsoDate(selectedDay);
  const selectedDayConfig = settings.working_days.find((d) => d.day_key === selectedDayKey);

  const selectedDayAppointments = useMemo(
    () => filteredAppointments.filter((a) => a.date === selectedDay),
    [filteredAppointments, selectedDay]
  );

  const dailySummary = useMemo(() => {
    let openSlots = 0;
    let blockedSlots = 0;
    let bookedSlots = 0;

    hourlyRange.forEach((hour) => {
      const hourPrefix = hour.slice(0, 2);
      const hasApt = selectedDayAppointments.some(
        (a) => a.time.slice(0, 2) === hourPrefix && a.status !== 'cancelled'
      );
      if (hasApt) {
        bookedSlots += 1;
        return;
      }
      const avail = getSlotAvailability(selectedDayConfig, hour, settings, selectedDay);
      if (avail.status === 'available') {
        openSlots += 1;
      } else if (avail.status === 'blocked_date' || avail.status === 'blocked_recurring') {
        blockedSlots += 1;
      }
    });

    return {
      openSlots,
      blockedSlots,
      bookedSlots,
    };
  }, [hourlyRange, selectedDayAppointments, selectedDayConfig, settings, selectedDay]);

  const openBookingModal = (dateStr?: string, timeStr?: string) => {
    setEditingApt(null);
    setModalDefaultDate(dateStr || selectedDay);
    setModalDefaultTime(timeStr || '11:00');
    setAptModalOpen(true);
  };

  const handleDisableHour = (dateStr: string, hourSlot: string) => {
    const current = settings.blocked_date_slots?.[dateStr] ?? [];
    if (current.includes(hourSlot)) return;
    updateSettings({
      blocked_date_slots: {
        ...(settings.blocked_date_slots ?? {}),
        [dateStr]: [...current, hourSlot],
      },
    });
    pushToast({ type: 'info', title: `${hourSlot} — ${t.appointments.agenda.blockedSlot}` });
  };

  const handleEnableHour = (
    dateStr: string,
    hourSlot: string,
    status: 'blocked_date' | 'blocked_recurring'
  ) => {
    if (status === 'blocked_date') {
      const current = settings.blocked_date_slots?.[dateStr] ?? [];
      updateSettings({
        blocked_date_slots: {
          ...(settings.blocked_date_slots ?? {}),
          [dateStr]: current.filter((s) => s !== hourSlot),
        },
      });
    } else {
      const dayKey = getDayKeyFromIsoDate(dateStr);
      updateSettings({
        working_days: settings.working_days.map((d) =>
          d.day_key === dayKey
            ? { ...d, blocked_slots: (d.blocked_slots ?? []).filter((s) => s !== hourSlot) }
            : d
        ),
      });
    }
    pushToast({ type: 'success', title: `${hourSlot} — ${t.appointments.agenda.availableSlot}` });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.appointments.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.appointments.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => openBookingModal(selectedDay, '11:00')}
          className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto btn-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t.appointments.newAppointment}</span>
        </button>
      </div>

      {/* Harmonious Attendance Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <KpiCard
          title={t.appointments.stats.total}
          value={stats.total}
          icon={<Calendar className="h-4 w-4" />}
          tone="navy"
        />
        <KpiCard
          title={t.appointments.stats.upcoming}
          value={stats.upcoming}
          icon={<CalendarClock className="h-4 w-4" />}
          tone="orange"
        />
        <KpiCard
          title={t.appointments.stats.completed}
          value={stats.completed}
          icon={<CalendarCheck2 className="h-4 w-4" />}
          tone="sky"
        />
        <KpiCard
          title={t.appointments.stats.attended}
          value={stats.attended}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="emerald"
        />
        <KpiCard
          title={t.appointments.stats.noShow}
          value={stats.noShow}
          icon={<UserX className="h-4 w-4" />}
          tone="rose"
        />
      </div>

      {/* View Switcher & Filters */}
      <div className="bg-white border border-zinc-200 card-surface rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap p-1 bg-zinc-100 border border-zinc-200 rounded-xl gap-1">
          {(
            [
              { id: 'daily', icon: Clock, label: t.appointments.views.daily },
              { id: 'weekly', icon: CalendarClock, label: t.appointments.views.weekly },
              { id: 'monthly', icon: Calendar, label: t.appointments.views.monthly },
              { id: 'table', icon: Table2, label: t.appointments.views.table },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setViewTab(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all whitespace-nowrap ${
                viewTab === id ? 'btn-primary' : 'text-zinc-900 hover:bg-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewTab === 'table' && (
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          )}
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
          >
            <option value="all">{t.leads.filters.allEmployees}</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
          >
            <option value="all">{t.leads.filters.allStatuses}</option>
            {(Object.keys(t.appointmentStatuses) as AppointmentStatus[]).map((st) => (
              <option key={st} value={st}>{t.appointmentStatuses[st]}</option>
            ))}
          </select>
          {(dateFilter || employeeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setDateFilter('');
                setEmployeeFilter('all');
                setStatusFilter('all');
              }}
              className="text-xs text-slate-500 hover:text-slate-900 px-2"
            >
              {t.app.reset}
            </button>
          )}
        </div>
      </div>

      {/* Table View */}
      {viewTab === 'table' && (
        filteredAppointments.length === 0 ? (
          <EmptyState icon={<CalendarClock className="h-6 w-6" />} title={t.app.noData} />
        ) : (
          <div className="bg-white border border-zinc-200 card-surface rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-950 font-bold whitespace-nowrap">
                    <th className="py-3 px-4 text-start">{t.appointments.columns.client}</th>
                    <th className="py-3 px-4 text-start">{t.appointments.columns.clientInfo}</th>
                    <th className="py-3 px-4 text-start">{t.appointments.columns.property}</th>
                    <th className="py-3 px-4 text-start">{t.appointments.columns.date}</th>
                    <th className="py-3 px-4 text-start">{t.appointments.columns.time}</th>
                    <th className="py-3 px-4 text-start">{t.appointments.columns.employee}</th>
                    <th className="py-3 px-4 text-start">{t.appointments.columns.type}</th>
                    <th className="py-3 px-4 text-start">{t.appointments.columns.status}</th>
                    <th className="py-3 px-4 text-end">{t.app.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredAppointments.map((apt) => {
                    const lead = leads.find((l) => l.id === apt.lead_id);
                    const prop = properties.find((p) => p.id === apt.property_id);
                    const emp = employees.find((e) => e.id === apt.employee_id);
                    return (
                      <tr key={apt.id} className="hover:bg-zinc-50/90">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => lead && openLeadProfile(lead.id)}
                            className="font-bold text-zinc-950 hover:underline text-start block"
                          >
                            {lead?.name ?? '—'}
                          </button>
                          {lead?.phone ? (
                            <a
                              href={buildTelHref(lead.phone)}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] font-mono-num text-sky-700 hover:underline mt-0.5 inline-block"
                              dir="ltr"
                            >
                              {lead.phone}
                            </a>
                          ) : (
                            <div className="text-[11px] font-mono-num text-zinc-500 mt-0.5">—</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {lead ? (
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1">
                                <ClassificationBadge
                                  classification={lead.classification}
                                  label={t.leadClassifications[lead.classification]}
                                />
                                <ContactMethodBadge
                                  method={lead.contact_method}
                                  label={t.contactMethods[lead.contact_method]}
                                  phone={lead.phone}
                                  title={
                                    lead.contact_method === 'whatsapp'
                                      ? t.appointments.agenda.directWhatsapp
                                      : t.appointments.agenda.directCall
                                  }
                                />
                                {lead.contact_method === 'whatsapp' ? (
                                  <a
                                    href={buildTelHref(lead.phone)}
                                    onClick={(e) => e.stopPropagation()}
                                    title={t.appointments.agenda.directCall}
                                    className="h-6 w-6 rounded-md bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 inline-flex items-center justify-center transition-colors"
                                  >
                                    <Phone className="h-3 w-3" />
                                  </a>
                                ) : (
                                  <a
                                    href={buildWhatsAppHref(lead.phone)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    title={t.appointments.agenda.directWhatsapp}
                                    className="h-6 w-6 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 inline-flex items-center justify-center transition-colors"
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-600 font-mono-num">
                                {formatMAD(lead.budget, language)} · {t.paymentMethods[lead.payment_method]}
                              </div>
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-[200px]">
                          <div className="font-medium text-slate-800 truncate">{prop?.title ?? '—'}</div>
                          {prop && (
                            <div className="text-[11px] text-slate-400">
                              {prop.city} · {prop.ref}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono-num whitespace-nowrap">
                          {formatShortDate(apt.date, language)}
                        </td>
                        <td className="py-3 px-4 font-mono-num font-bold text-zinc-950 whitespace-nowrap">
                          {apt.time}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{emp?.name ?? '—'}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {t.appointmentTypes[apt.type]}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusLabel
                            label={t.appointmentStatuses[apt.status]}
                            appointmentStatus={apt.status}
                          />
                        </td>
                        <td className="py-3 px-4 text-end whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            {apt.status === 'scheduled' && (
                              <button
                                type="button"
                                onClick={() => updateAppointment(apt.id, { status: 'confirmed' })}
                                title={t.appointments.quickActions.confirm}
                                className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {(apt.status === 'scheduled' || apt.status === 'confirmed') && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => updateAppointment(apt.id, { status: 'attended' })}
                                  title={t.appointments.quickActions.markAttended}
                                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                                >
                                  <UserCheck className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateAppointment(apt.id, { status: 'no_show' })}
                                  title={t.appointments.quickActions.markNoShow}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                >
                                  <UserX className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setRescheduleTarget(apt);
                                setNewDate(apt.date);
                                setNewTime(apt.time);
                              }}
                              title={t.appointments.quickActions.reschedule}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <CalendarClock className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingApt(apt);
                                setAptModalOpen(true);
                              }}
                              title={t.app.edit}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            {apt.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => setCancelTargetId(apt.id)}
                                title={t.appointments.quickActions.cancel}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Daily Hourly Agenda View */}
      {viewTab === 'daily' && (
        <div className="bg-white border border-zinc-200 card-surface rounded-2xl overflow-hidden">
          {/* Top Agenda Controls */}
          <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-zinc-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedDay((d) => shiftIsoDate(d, -1))}
                  className="h-8 w-8 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 inline-flex items-center justify-center text-zinc-800"
                >
                  {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDay('2026-11-19')}
                  className={`h-8 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    selectedDay === '2026-11-19'
                      ? 'btn-primary border-transparent'
                      : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {t.appointments.agenda.today}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDay((d) => shiftIsoDate(d, 1))}
                  className="h-8 w-8 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 inline-flex items-center justify-center text-zinc-800"
                >
                  {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  {t.days[selectedDayKey]} — {formatShortDate(selectedDay, language)}
                </h3>
                <div className="text-[11px] text-zinc-600 flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="font-semibold text-zinc-800">{t.appointments.agenda.workingHoursLabel}:</span>
                  {selectedDayConfig?.enabled ? (
                    <span className="font-mono-num text-zinc-900 font-semibold">
                      {selectedDayConfig.open} – {selectedDayConfig.close}
                      {selectedDayConfig.break_start && selectedDayConfig.break_end
                        ? ` (${t.settings.hoursForm.breakTime}: ${selectedDayConfig.break_start}–${selectedDayConfig.break_end})`
                        : ''}
                    </span>
                  ) : (
                    <span className="text-rose-700 font-semibold">{t.appointments.agenda.closedDayBanner}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold tabular-nums">
                  {dailySummary.openSlots} {t.appointments.agenda.openSlotsCount}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-semibold tabular-nums">
                  {dailySummary.bookedSlots} {t.appointments.agenda.bookedCount}
                </span>
                {dailySummary.blockedSlots > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold tabular-nums">
                    {dailySummary.blockedSlots} {t.appointments.agenda.blockedCount}
                  </span>
                )}
              </div>

              <input
                type="date"
                value={selectedDay}
                onChange={(e) => e.target.value && setSelectedDay(e.target.value)}
                className="h-8 px-2.5 text-xs font-semibold border border-zinc-200 rounded-lg bg-white font-mono-num text-zinc-950"
              />
            </div>
          </div>

          {/* 7-Day Horizontal Quick Date Strip */}
          <div className="px-4 py-2.5 bg-white border-b border-zinc-200 grid grid-cols-7 gap-1.5 overflow-x-auto">
            {agendaStripDays.map((dayStr) => {
              const dKey = getDayKeyFromIsoDate(dayStr);
              const dCfg = settings.working_days.find((d) => d.day_key === dKey);
              const count = filteredAppointments.filter((a) => a.date === dayStr).length;
              const isSelected = dayStr === selectedDay;
              return (
                <button
                  key={dayStr}
                  type="button"
                  onClick={() => setSelectedDay(dayStr)}
                  className={`px-2 py-2 rounded-xl border text-center transition-all min-w-[78px] ${
                    isSelected
                      ? 'bg-[#0B3B4E] text-white border-[#0B3B4E] shadow-sm'
                      : !dCfg?.enabled
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                        : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <div className={`text-[11px] font-bold ${isSelected ? 'text-white/90' : 'text-zinc-600'}`}>
                    {t.days[dKey]}
                  </div>
                  <div className="text-xs font-mono-num font-bold mt-0.5">{dayStr.slice(5)}</div>
                  <div className="mt-1 flex items-center justify-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono-num font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : count > 0
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Closed Day Banner */}
          {!selectedDayConfig?.enabled && (
            <div className="mx-5 mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-rose-900">{t.appointments.agenda.closedDayBanner}</div>
                <div className="text-[11px] text-rose-700 mt-0.5">{t.appointments.agenda.closedDayHint}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('settings')}
                className="h-8 px-3 rounded-lg bg-white border border-rose-200 text-rose-800 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-rose-100"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>{t.appointments.agenda.configureHoursBtn}</span>
              </button>
            </div>
          )}

          {/* Hourly Day Timeline (08:00 - 20:00) */}
          <div className="p-4 sm:p-5 divide-y divide-zinc-100">
            {hourlyRange.map((hour) => {
              const hourPrefix = hour.slice(0, 2);
              const hourApts = selectedDayAppointments.filter(
                (a) => a.time.slice(0, 2) === hourPrefix
              );
              const avail = getSlotAvailability(selectedDayConfig, hour, settings, selectedDay);

              return (
                <div key={hour} className="py-2.5 first:pt-0 last:pb-0 flex items-stretch gap-3 sm:gap-4">
                  {/* Hour Label */}
                  <div className="w-16 shrink-0 pt-2 text-start">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-mono-num font-bold text-zinc-950">
                      {hour}
                    </span>
                  </div>

                  {/* Hour Slot Content */}
                  <div className="flex-1 min-w-0">
                    {hourApts.length > 0 ? (
                      <div className="space-y-2">
                        {hourApts.map((apt) => {
                          const lead = leads.find((l) => l.id === apt.lead_id);
                          const prop = properties.find((p) => p.id === apt.property_id);
                          const emp = employees.find((e) => e.id === apt.employee_id);
                          return (
                            <div
                              key={apt.id}
                              className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 border rounded-xl ${aptCardTone[apt.status]}`}
                            >
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-xs font-mono-num font-bold text-zinc-950">
                                    {apt.time}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => lead && openLeadProfile(lead.id)}
                                    className="text-xs font-bold text-zinc-950 hover:underline"
                                  >
                                    {lead?.name ?? '—'}
                                  </button>
                                  {lead && (
                                    <>
                                      <ClassificationBadge
                                        classification={lead.classification}
                                        label={t.leadClassifications[lead.classification]}
                                      />
                                      <ContactMethodBadge
                                        method={lead.contact_method}
                                        label={t.contactMethods[lead.contact_method]}
                                        phone={lead.phone}
                                        title={
                                          lead.contact_method === 'whatsapp'
                                            ? t.appointments.agenda.directWhatsapp
                                            : t.appointments.agenda.directCall
                                        }
                                      />
                                      {lead.contact_method === 'whatsapp' ? (
                                        <a
                                          href={buildTelHref(lead.phone)}
                                          onClick={(e) => e.stopPropagation()}
                                          title={t.appointments.agenda.directCall}
                                          className="h-6 w-6 rounded-md bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 inline-flex items-center justify-center"
                                        >
                                          <Phone className="h-3 w-3" />
                                        </a>
                                      ) : (
                                        <a
                                          href={buildWhatsAppHref(lead.phone)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          title={t.appointments.agenda.directWhatsapp}
                                          className="h-6 w-6 rounded-md bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 inline-flex items-center justify-center"
                                        >
                                          <MessageCircle className="h-3 w-3" />
                                        </a>
                                      )}
                                    </>
                                  )}
                                </div>

                                <div className="text-xs text-zinc-900 font-semibold truncate">
                                  {prop?.title ?? '—'} {prop ? `(${prop.city})` : ''}
                                </div>

                                <div className="text-[11px] text-zinc-600 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  {lead?.phone && (
                                    <a
                                      href={buildTelHref(lead.phone)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="font-mono-num text-sky-700 hover:underline"
                                      dir="ltr"
                                    >
                                      {lead.phone}
                                    </a>
                                  )}
                                  <span>·</span>
                                  <span>{emp?.name ?? '—'}</span>
                                  <span>·</span>
                                  <span>{t.appointmentTypes[apt.type]}</span>
                                  {lead && (
                                    <>
                                      <span>·</span>
                                      <span className="font-mono-num font-semibold text-zinc-800">
                                        {formatMAD(lead.budget, language)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <StatusLabel
                                  label={t.appointmentStatuses[apt.status]}
                                  appointmentStatus={apt.status}
                                />
                                <div className="inline-flex items-center gap-1 bg-white/80 border border-zinc-200 rounded-lg p-0.5">
                                  {apt.status === 'scheduled' && (
                                    <button
                                      type="button"
                                      onClick={() => updateAppointment(apt.id, { status: 'confirmed' })}
                                      title={t.appointments.quickActions.confirm}
                                      className="p-1.5 rounded-md text-sky-600 hover:bg-sky-50"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  {(apt.status === 'scheduled' || apt.status === 'confirmed') && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => updateAppointment(apt.id, { status: 'attended' })}
                                        title={t.appointments.quickActions.markAttended}
                                        className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50"
                                      >
                                        <UserCheck className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => updateAppointment(apt.id, { status: 'no_show' })}
                                        title={t.appointments.quickActions.markNoShow}
                                        className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50"
                                      >
                                        <UserX className="h-3.5 w-3.5" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRescheduleTarget(apt);
                                      setNewDate(apt.date);
                                      setNewTime(apt.time);
                                    }}
                                    title={t.appointments.quickActions.reschedule}
                                    className="p-1.5 rounded-md text-zinc-600 hover:bg-zinc-100"
                                  >
                                    <CalendarClock className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingApt(apt);
                                      setAptModalOpen(true);
                                    }}
                                    title={t.app.edit}
                                    className="p-1.5 rounded-md text-zinc-600 hover:bg-zinc-100"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {avail.status === 'available' && (
                          <button
                            type="button"
                            onClick={() => openBookingModal(selectedDay, hour)}
                            className="text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-zinc-100"
                          >
                            <Plus className="h-3 w-3" />
                            <span>{t.appointments.agenda.bookAtTime}</span>
                          </button>
                        )}
                      </div>
                    ) : avail.status === 'available' ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors">
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-900">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>{t.appointments.agenda.availableSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openBookingModal(selectedDay, hour)}
                            className="h-7 px-3 rounded-lg bg-[#0B3B4E] text-white text-[11px] font-bold inline-flex items-center gap-1 hover:opacity-95"
                          >
                            <Plus className="h-3 w-3" />
                            <span>{t.appointments.agenda.bookAtTime}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisableHour(selectedDay, hour)}
                            className="h-7 px-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-rose-700 hover:border-rose-200 text-[11px] font-semibold inline-flex items-center gap-1"
                          >
                            <Ban className="h-3 w-3" />
                            <span>{t.appointments.agenda.disableHour}</span>
                          </button>
                        </div>
                      </div>
                    ) : avail.status === 'blocked_date' || avail.status === 'blocked_recurring' ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl border border-dashed border-rose-200 bg-rose-50/50">
                        <div className="flex items-center gap-2 text-xs font-medium text-rose-800">
                          <Ban className="h-3.5 w-3.5 text-rose-600" />
                          <span>{t.appointments.agenda.blockedSlot}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEnableHour(selectedDay, hour, avail.status)}
                          className="h-7 px-2.5 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>{t.appointments.agenda.enableHour}</span>
                        </button>
                      </div>
                    ) : avail.status === 'break' ? (
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50/70 text-xs font-medium text-amber-900">
                        <Coffee className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>
                          {t.appointments.agenda.breakPeriod}
                          {avail.label ? ` — ${avail.label}` : ''}
                        </span>
                      </div>
                    ) : (
                      <div className="px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-400">
                        {avail.status === 'closed_day'
                          ? t.appointments.agenda.closedDayBanner
                          : t.appointments.agenda.outsideHours}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Calendar View */}
      {viewTab === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayApts = filteredAppointments.filter((a) => a.date === day);
            const dKey = getDayKeyFromIsoDate(day);
            const dCfg = settings.working_days.find((d) => d.day_key === dKey);
            const isSelected = day === selectedDay;
            return (
              <div
                key={day}
                className={`bg-white border card-surface rounded-2xl overflow-hidden flex flex-col min-h-[260px] ${
                  isSelected ? 'border-[#0B3B4E] ring-1 ring-[#0B3B4E]/20' : 'border-zinc-200'
                }`}
              >
                <div className="px-3 py-2.5 bg-zinc-50 border-b border-zinc-200 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDay(day);
                        setViewTab('daily');
                      }}
                      className="text-start hover:underline"
                    >
                      <div className="text-[11px] font-bold text-zinc-950">{t.days[dKey]}</div>
                      <div className="text-[11px] font-mono-num text-zinc-500">
                        {formatShortDate(day, language)}
                      </div>
                    </button>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-950 text-[11px] font-bold text-white tabular-nums">
                      {dayApts.length}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono-num text-zinc-500">
                    {dCfg?.enabled ? `${dCfg.open}–${dCfg.close}` : t.appointments.agenda.closedDayBanner}
                  </div>
                </div>

                <div className="p-2.5 space-y-2 flex-1">
                  {dayApts.map((apt) => {
                    const lead = leads.find((l) => l.id === apt.lead_id);
                    return (
                      <div
                        key={apt.id}
                        className={`w-full text-start p-2.5 rounded-lg border transition-colors ${aptCardTone[apt.status]}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setEditingApt(apt);
                            setAptModalOpen(true);
                          }}
                          className="w-full text-start"
                        >
                          <div className="text-[11px] font-bold font-mono-num text-zinc-950">{apt.time}</div>
                          <div className="text-xs font-bold text-zinc-950 truncate">{lead?.name}</div>
                        </button>
                        {lead && (
                          <div className="flex items-center justify-between gap-1 mt-1">
                            <a
                              href={buildTelHref(lead.phone)}
                              className="text-[10px] font-mono-num text-sky-700 hover:underline truncate"
                              dir="ltr"
                            >
                              {lead.phone}
                            </a>
                            <a
                              href={buildWhatsAppHref(lead.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={t.appointments.agenda.directWhatsapp}
                              className="text-emerald-700 hover:text-emerald-900 shrink-0"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        <div className="text-[10px] font-semibold text-zinc-600 mt-1">
                          {t.appointmentStatuses[apt.status]}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {dCfg?.enabled && (
                  <div className="p-2 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => openBookingModal(day, '10:00')}
                      className="w-full h-7 rounded-lg text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 inline-flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{t.appointments.agenda.addForDay}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly Calendar View */}
      {viewTab === 'monthly' && (
        <div className="bg-white border border-zinc-200 card-surface rounded-2xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const dayApts = filteredAppointments.filter((a) => a.date === day);
              const dayNum = day.slice(-2);
              const dKey = getDayKeyFromIsoDate(day);
              const dCfg = settings.working_days.find((d) => d.day_key === dKey);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setViewTab('daily');
                  }}
                  className={`min-h-[84px] p-2 rounded-lg border text-start flex flex-col justify-between transition-colors ${
                    !dCfg?.enabled
                      ? 'border-zinc-100 bg-zinc-50/70 text-zinc-400 hover:bg-zinc-100'
                      : dayApts.length > 0
                        ? 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'
                        : 'border-zinc-100 bg-white hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold font-mono-num text-zinc-950">{dayNum}</span>
                    <span className="text-[10px] text-zinc-400">{t.days[dKey]}</span>
                  </div>
                  <div className="space-y-1 w-full">
                    {dayApts.slice(0, 2).map((a) => (
                      <div
                        key={a.id}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-white truncate font-mono-num"
                      >
                        {a.time} · {leads.find((l) => l.id === a.lead_id)?.name.split(' ')[0]}
                      </div>
                    ))}
                    {dayApts.length > 2 && (
                      <div className="text-[10px] text-zinc-950 font-bold">+{dayApts.length - 2}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AppointmentFormModal
        open={aptModalOpen}
        onClose={() => setAptModalOpen(false)}
        editingAppointment={editingApt}
        defaultDate={modalDefaultDate}
        defaultTime={modalDefaultTime}
      />

      {/* Reschedule Modal */}
      <Modal
        open={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        title={t.appointments.rescheduleAppointment}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.date}</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.time}</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRescheduleTarget(null)}
              className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-lg"
            >
              {t.app.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (rescheduleTarget) {
                  updateAppointment(rescheduleTarget.id, {
                    date: newDate,
                    time: newTime,
                    status: 'rescheduled',
                  });
                }
                setRescheduleTarget(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg"
              style={{ backgroundColor: 'var(--agency-primary)' }}
            >
              {t.app.save}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(cancelTargetId)}
        title={t.appointments.cancelAppointment}
        description={t.appointments.cancelConfirm}
        confirmLabel={t.app.confirm}
        cancelLabel={t.app.cancel}
        onConfirm={() => {
          if (cancelTargetId) updateAppointment(cancelTargetId, { status: 'cancelled' });
          setCancelTargetId(null);
        }}
        onCancel={() => setCancelTargetId(null)}
      />
    </div>
  );
};
