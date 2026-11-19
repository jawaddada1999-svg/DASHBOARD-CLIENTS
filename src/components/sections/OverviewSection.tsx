import React, { useMemo, useState } from 'react';
import {
  Building2,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  FileBarChart2,
  Handshake,
  Plus,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { formatMAD, formatNumber } from '../../i18n/translations';
import { LeadSource } from '../../types/domain';
import {
  AreaTrendChart,
  BarComparisonChart,
  ConversionFunnelChart,
  DonutDistributionChart,
} from '../ui/Charts';
import { Avatar, KpiCard, SafeImage, StatusLabel } from '../ui/DataPrimitives';

type DatePreset = 'today' | 'last7' | 'last30' | 'thisMonth' | 'custom';

export const OverviewSection: React.FC = () => {
  const {
    t,
    language,
    leads,
    properties,
    appointments,
    employees,
    notifications,
    setActiveSection,
    openLeadProfile,
    openPropertyDetails,
    setQuickModal,
    markNotificationRead,
  } = useAgency();

  const [datePreset, setDatePreset] = useState<DatePreset>('last30');
  const [customFrom, setCustomFrom] = useState('2026-11-01');
  const [customTo, setCustomTo] = useState('2026-11-19');

  // Multiplier adjusts executive historical series smoothly when date preset changes
  const scale = useMemo(() => {
    if (datePreset === 'today') return 0.14;
    if (datePreset === 'last7') return 0.42;
    if (datePreset === 'thisMonth') return 0.85;
    if (datePreset === 'custom') return 0.65;
    return 1;
  }, [datePreset]);

  const activePropertiesCount = properties.filter((p) => p.status === 'available' || p.status === 'reserved').length;
  const newLeadsCount = Math.max(leads.filter((l) => l.status === 'new').length, Math.round(leads.length * 0.3 * scale));
  const totalLeadsDisplay = Math.max(leads.length, Math.round(64 * scale));
  const scheduledVisitsCount = Math.max(
    appointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed').length,
    Math.round(18 * scale)
  );
  const attendedCount = Math.max(
    appointments.filter((a) => a.status === 'attended').length,
    Math.round(14 * scale)
  );
  const noShowCount = Math.max(
    appointments.filter((a) => a.status === 'no_show').length,
    Math.round(3 * scale)
  );
  const completedVisitsCount = attendedCount + noShowCount;
  const dealsWonCount = Math.max(
    leads.filter((l) => l.status === 'closed_won').length,
    Math.round(6 * scale)
  );

  const acquisitionSeries = useMemo(() => {
    const base =
      language === 'ar'
        ? [
            { label: '01 نو', value: 8 },
            { label: '04 نو', value: 12 },
            { label: '07 نو', value: 10 },
            { label: '10 نو', value: 17 },
            { label: '13 نو', value: 15 },
            { label: '16 نو', value: 22 },
            { label: '19 نو', value: 26 },
          ]
        : [
            { label: '01 Nov', value: 8 },
            { label: '04 Nov', value: 12 },
            { label: '07 Nov', value: 10 },
            { label: '10 Nov', value: 17 },
            { label: '13 Nov', value: 15 },
            { label: '16 Nov', value: 22 },
            { label: '19 Nov', value: 26 },
          ];
    return base.map((p) => ({ ...p, value: Math.max(1, Math.round(p.value * scale)) }));
  }, [language, scale]);

  const visitsWeeklySeries = useMemo(() => {
    const labels =
      language === 'ar'
        ? ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4']
        : language === 'fr'
          ? ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4']
          : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return [
      { label: labels[0], value: Math.max(2, Math.round(11 * scale)), secondaryValue: Math.max(1, Math.round(9 * scale)) },
      { label: labels[1], value: Math.max(2, Math.round(14 * scale)), secondaryValue: Math.max(1, Math.round(12 * scale)) },
      { label: labels[2], value: Math.max(2, Math.round(16 * scale)), secondaryValue: Math.max(1, Math.round(13 * scale)) },
      { label: labels[3], value: Math.max(3, Math.round(19 * scale)), secondaryValue: Math.max(2, Math.round(15 * scale)) },
    ];
  }, [language, scale]);

  const monthlySeries = useMemo(() => {
    const months =
      language === 'ar'
        ? ['يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نوفمبر']
        : language === 'fr'
          ? ['Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov']
          : ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const raw = [
      [34, 4],
      [41, 5],
      [38, 4],
      [52, 6],
      [59, 7],
      [64, 8],
    ];
    return months.map((label, i) => ({
      label,
      value: raw[i][0],
      secondaryValue: raw[i][1],
    }));
  }, [language]);

  const sourceCounts = useMemo(() => {
    const palette: Record<LeadSource, string> = {
      facebook_ads: '#0B3B4E',
      instagram_ads: '#EA580C',
      google_ads: '#0284C7',
      whatsapp: '#16A34A',
      website: '#64748B',
      referral: '#D97706',
      walk_in: '#475569',
    };
    const grouped: Partial<Record<LeadSource, number>> = {};
    leads.forEach((l) => {
      grouped[l.source] = (grouped[l.source] ?? 0) + 1;
    });
    return (Object.keys(grouped) as LeadSource[]).map((src) => ({
      label: t.leadSources[src],
      value: grouped[src] ?? 0,
      color: palette[src],
    }));
  }, [leads, t.leadSources]);

  const funnelStages = useMemo(
    () => [
      { label: t.leadStatuses.new, count: leads.length, color: '#0B3B4E' },
      {
        label: t.leadStatuses.visit_scheduled,
        count: leads.filter((l) => l.status !== 'new' && l.status !== 'not_interested').length,
        color: '#0E5A75',
      },
      {
        label: t.leadStatuses.visited,
        count: leads.filter((l) => ['visited', 'follow_up', 'closed_won'].includes(l.status)).length,
        color: '#EA580C',
      },
      {
        label: t.leadStatuses.follow_up,
        count: leads.filter((l) => ['follow_up', 'closed_won'].includes(l.status)).length,
        color: '#D97706',
      },
      {
        label: t.leadStatuses.closed_won,
        count: leads.filter((l) => l.status === 'closed_won').length,
        color: '#16A34A',
      },
    ],
    [leads, t.leadStatuses]
  );

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.status === 'scheduled' || a.status === 'confirmed')
        .slice(0, 4),
    [appointments]
  );

  const topProperties = useMemo(
    () => [...properties].sort((a, b) => b.views - a.views).slice(0, 4),
    [properties]
  );

  const recentActivities = useMemo(
    () =>
      employees
        .flatMap((e) =>
          e.recent_activities.map((act) => ({
            ...act,
            employeeName: e.name,
            employeeAvatar: e.avatar,
          }))
        )
        .slice(0, 5),
    [employees]
  );

  const attendancePct = Math.round((attendedCount / Math.max(attendedCount + noShowCount, 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header & Date Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.overview.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.overview.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-zinc-200 rounded-2xl card-surface">
            {(['today', 'last7', 'last30', 'thisMonth', 'custom'] as DatePreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDatePreset(preset)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  datePreset === preset
                    ? 'btn-primary'
                    : 'text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                {t.overview.dateFilters[preset]}
              </button>
            ))}
          </div>

          {datePreset === 'custom' && (
            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs card-surface">
              <span className="text-zinc-600">{t.overview.fromDate}</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="font-mono-num text-zinc-950 focus:outline-none"
              />
              <span className="text-zinc-400">–</span>
              <span className="text-zinc-600">{t.overview.toDate}</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="font-mono-num text-zinc-950 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* 8 Main Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title={t.overview.kpis.totalLeads}
          value={formatNumber(totalLeadsDisplay, language)}
          delta={14.2}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<Users className="h-4 w-4" />}
          tone="navy"
        />
        <KpiCard
          title={t.overview.kpis.newLeads}
          value={formatNumber(newLeadsCount, language)}
          delta={9.8}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<UserPlus className="h-4 w-4" />}
          tone="orange"
        />
        <KpiCard
          title={t.overview.kpis.scheduledVisits}
          value={formatNumber(scheduledVisitsCount, language)}
          delta={11.5}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<CalendarClock className="h-4 w-4" />}
          tone="sky"
        />
        <KpiCard
          title={t.overview.kpis.completedVisits}
          value={formatNumber(completedVisitsCount, language)}
          delta={6.4}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<CalendarCheck2 className="h-4 w-4" />}
          tone="teal"
        />
        <KpiCard
          title={t.overview.kpis.attendedClients}
          value={formatNumber(attendedCount, language)}
          delta={8.1}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<UserCheck className="h-4 w-4" />}
          tone="emerald"
        />
        <KpiCard
          title={t.overview.kpis.noShowClients}
          value={formatNumber(noShowCount, language)}
          delta={-4.5}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<UserX className="h-4 w-4" />}
          tone="rose"
        />
        <KpiCard
          title={t.overview.kpis.successfulDeals}
          value={formatNumber(dealsWonCount, language)}
          delta={18.0}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<Handshake className="h-4 w-4" />}
          tone="amber"
        />
        <KpiCard
          title={t.overview.kpis.activeProperties}
          value={formatNumber(activePropertiesCount, language)}
          delta={5.2}
          deltaLabel={t.overview.vsPrevPeriod}
          icon={<Building2 className="h-4 w-4" />}
          tone="indigo"
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="bg-gradient-to-r from-[#F3F8FB] via-white to-[#FFF8F3] border border-[#C6DCE6] card-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EA580C]" />
          <div className="font-display text-sm font-extrabold text-zinc-950">{t.overview.widgets.quickActions}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setQuickModal('lead')}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.overview.widgets.newLeadBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => setQuickModal('property')}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-accent"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{t.overview.widgets.newPropertyBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => setQuickModal('appointment')}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-secondary"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{t.overview.widgets.newAppointmentBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('reports')}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-outline"
          >
            <FileBarChart2 className="h-3.5 w-3.5 text-zinc-950" />
            <span>{t.overview.widgets.openReportsBtn}</span>
          </button>
        </div>
      </div>

      {/* 6 Charts & Analytics with Harmonious Card Accents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Customer Acquisition Over Time */}
        <div className="bg-white border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#0B3B4E]" />
          <div className="px-5 py-3.5 bg-[#F3F8FB] border-b border-[#D5E5ED] flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
                {t.overview.charts.acquisitionTitle}
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">{t.overview.charts.acquisitionSub}</p>
            </div>
          </div>
          <div className="p-5">
            <AreaTrendChart data={acquisitionSeries} primaryLabel={t.overview.charts.leadsLabel} />
          </div>
        </div>

        {/* 2. Appointments & Property Visits */}
        <div className="bg-white border border-[#F7CFB6] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#EA580C]" />
          <div className="px-5 py-3.5 bg-[#FFF8F3] border-b border-[#F8DEC9] flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
                {t.overview.charts.visitsTitle}
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">{t.overview.charts.visitsSub}</p>
            </div>
          </div>
          <div className="p-5">
            <BarComparisonChart
              data={visitsWeeklySeries}
              primaryLabel={t.overview.charts.scheduled}
              secondaryLabel={t.overview.charts.completed}
            />
          </div>
        </div>

        {/* 3. Attendance vs Absence */}
        <div className="bg-white border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#059669]" />
          <div className="px-5 py-3.5 bg-[#F3FCF7] border-b border-[#CBEAD9] flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#059669]" />
                {t.overview.charts.attendanceTitle}
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">{t.overview.charts.attendanceSub}</p>
            </div>
          </div>
          <div className="p-5">
            <DonutDistributionChart
              slices={[
                { label: t.overview.charts.attended, value: attendedCount, color: '#16A34A' },
                { label: t.overview.charts.absent, value: noShowCount, color: '#DC2626' },
              ]}
              centerValue={`${attendancePct}%`}
              centerLabel={t.overview.charts.attended}
            />
          </div>
        </div>

        {/* 4. Sales Conversion Funnel */}
        <div className="bg-white border border-[#BADAF6] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#0284C7]" />
          <div className="px-5 py-3.5 bg-[#F3F9FF] border-b border-[#CDE4F9] flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                {t.overview.charts.funnelTitle}
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">{t.overview.charts.funnelSub}</p>
            </div>
          </div>
          <div className="p-5">
            <ConversionFunnelChart stages={funnelStages} />
          </div>
        </div>

        {/* 5. Lead Sources Distribution */}
        <div className="bg-white border border-[#F3D88B] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#D97706]" />
          <div className="px-5 py-3.5 bg-[#FFFDF4] border-b border-[#F7E3A7] flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                {t.overview.charts.sourcesTitle}
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">{t.overview.charts.sourcesSub}</p>
            </div>
          </div>
          <div className="p-5">
            <DonutDistributionChart
              slices={sourceCounts}
              centerValue={leads.length}
              centerLabel={t.overview.charts.leadsLabel}
            />
          </div>
        </div>

        {/* 6. Monthly Performance Overview */}
        <div className="bg-white border border-[#C5CEF6] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#4338CA]" />
          <div className="px-5 py-3.5 bg-[#F5F7FF] border-b border-[#D8DEFA] flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4338CA]" />
                {t.overview.charts.monthlyTitle}
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">{t.overview.charts.monthlySub}</p>
            </div>
          </div>
          <div className="p-5">
            <BarComparisonChart
              data={monthlySeries}
              primaryLabel={t.overview.charts.leadsLabel}
              secondaryLabel={t.overview.charts.dealsLabel}
            />
          </div>
        </div>
      </div>

      {/* Operational Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming Appointments */}
        <div className="bg-white border border-[#BADAF6] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#0284C7]" />
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#F3F9FF] border-b border-[#CDE4F9]">
            <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
              {t.overview.widgets.upcomingAppointments}
            </h3>
            <button
              type="button"
              onClick={() => setActiveSection('appointments')}
              className="px-3 py-1 rounded-lg text-[11px] font-bold btn-outline"
            >
              {t.app.viewAll}
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {upcomingAppointments.map((apt) => {
              const lead = leads.find((l) => l.id === apt.lead_id);
              const prop = properties.find((p) => p.id === apt.property_id);
              return (
                <div
                  key={apt.id}
                  className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-[#F3F9FF]/50"
                >
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => lead && openLeadProfile(lead.id)}
                      className="text-xs font-bold text-zinc-950 hover:underline truncate block"
                    >
                      {lead?.name}
                    </button>
                    <div className="text-[11px] text-zinc-600 mt-0.5 truncate">
                      {prop?.title} · <span className="font-mono-num">{apt.date} {apt.time}</span>
                    </div>
                  </div>
                  <StatusLabel
                    label={t.appointmentStatuses[apt.status]}
                    appointmentStatus={apt.status}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Leads */}
        <div className="bg-white border border-[#F7CFB6] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#EA580C]" />
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#FFF8F3] border-b border-[#F8DEC9]">
            <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
              {t.overview.widgets.latestLeads}
            </h3>
            <button
              type="button"
              onClick={() => setActiveSection('leads')}
              className="px-3 py-1 rounded-lg text-[11px] font-bold btn-outline"
            >
              {t.app.viewAll}
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {leads.slice(0, 4).map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => openLeadProfile(lead.id)}
                className="w-full text-start px-5 py-3 flex items-center justify-between gap-3 hover:bg-[#FFF8F3]/60 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-950 truncate">{lead.name}</div>
                  <div className="text-[11px] text-zinc-600 mt-0.5">
                    {lead.city} · {t.propertyTypes[lead.property_type]} ·{' '}
                    <span className="font-mono-num font-bold text-zinc-950">{formatMAD(lead.budget, language)}</span>
                  </div>
                </div>
                <StatusLabel label={t.leadStatuses[lead.status]} leadStatus={lead.status} />
              </button>
            ))}
          </div>
        </div>

        {/* Best-Performing Properties */}
        <div className="bg-white border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#059669]" />
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#F3FCF7] border-b border-[#CBEAD9]">
            <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#059669]" />
              {t.overview.widgets.topProperties}
            </h3>
            <button
              type="button"
              onClick={() => setActiveSection('properties')}
              className="px-3 py-1 rounded-lg text-[11px] font-bold btn-outline"
            >
              {t.app.viewAll}
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {topProperties.map((prop) => {
              const inquiries = leads.filter((l) => l.interested_property_id === prop.id).length;
              return (
                <button
                  key={prop.id}
                  type="button"
                  onClick={() => openPropertyDetails(prop.id)}
                  className="w-full text-start px-5 py-3 flex items-center gap-3 hover:bg-[#F3FCF7]/60 transition-colors"
                >
                  <SafeImage
                    src={prop.images[0]}
                    alt={prop.title}
                    className="h-12 w-16 rounded-lg object-cover shrink-0 border border-zinc-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-zinc-950 truncate">{prop.title}</div>
                    <div className="text-[11px] text-zinc-600 mt-0.5 tabular-nums">
                      {prop.city} · {prop.views} {t.overview.widgets.viewsCount} · {inquiries}{' '}
                      {t.overview.widgets.inquiriesCount}
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-zinc-950 font-mono-num shrink-0">
                    {formatMAD(prop.price, language)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Team Activity & Important Notifications */}
        <div className="bg-white border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden flex flex-col">
          <div className="h-1 w-full bg-[#0B3B4E]" />
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#F3F8FB] border-b border-[#D5E5ED]">
            <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
              {t.overview.widgets.recentActivity}
            </h3>
            <button
              type="button"
              onClick={() => setActiveSection('team')}
              className="px-3 py-1 rounded-lg text-[11px] font-bold btn-outline"
            >
              {t.app.viewAll}
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {recentActivities.slice(0, 3).map((act) => (
              <div key={act.id} className="px-5 py-2.5 flex items-center gap-3">
                <Avatar name={act.employeeName} src={act.employeeAvatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-zinc-950 truncate">
                    <span className="font-bold">{act.employeeName}</span> — {act.action}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {act.target} · {act.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-5 py-2.5 border-y border-[#D5E5ED] bg-[#F3F8FB]">
            <span className="font-display text-xs font-extrabold text-zinc-950">{t.overview.widgets.importantNotifications}</span>
            <button
              type="button"
              onClick={() => setActiveSection('notifications')}
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold btn-outline"
            >
              {t.app.viewAll}
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {notifications.slice(0, 2).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  markNotificationRead(n.id);
                  setActiveSection(n.related_section);
                }}
                className="w-full text-start px-5 py-2.5 flex items-center justify-between gap-2 hover:bg-[#F3F8FB]/60"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#EA580C] shrink-0" />
                  <span className="text-xs font-medium text-zinc-900 truncate">{n.message}</span>
                </div>
                <span className="text-[10px] text-zinc-500 shrink-0">{n.timestamp}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
