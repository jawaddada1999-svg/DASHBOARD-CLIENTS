import React, { useMemo, useState } from 'react';
import {
  Building2,
  CalendarPlus,
  Coins,
  CreditCard,
  Eye,
  Handshake,
  MapPin,
  MessageSquarePlus,
  Phone,
  Search,
  TrendingUp,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { formatMAD, formatShortDate } from '../../i18n/translations';
import { Lead, LeadStatus } from '../../types/domain';
import {
  ClassificationBadge,
  ContactMethodBadge,
  KpiCard,
  Modal,
} from '../ui/DataPrimitives';

type PipelineTab = 'all' | 'sale' | 'rent';

const PIPELINE_STAGES: {
  status: LeadStatus;
  key: keyof typeof stageStyles;
}[] = [
  { status: 'new', key: 'new' },
  { status: 'visit_scheduled', key: 'visit_scheduled' },
  { status: 'visited', key: 'visited' },
  { status: 'no_show', key: 'no_show' },
  { status: 'follow_up', key: 'follow_up' },
  { status: 'closed_won', key: 'closed_won' },
  { status: 'closed_lost', key: 'closed_lost' },
];

const stageStyles = {
  new: {
    column: 'bg-[#F3F9FF] border-[#BADAF6]',
    headerBg: 'bg-[#E9F3FE] border-[#BADAF6]',
    topBar: 'bg-[#0284C7]',
    dot: 'bg-[#0284C7]',
    badge: 'bg-[#0284C7] text-white',
    cardHover: 'hover:border-[#0284C7]/60',
  },
  visit_scheduled: {
    column: 'bg-[#FFF8F3] border-[#F7CFB6]',
    headerBg: 'bg-[#FFEDE2] border-[#F7CFB6]',
    topBar: 'bg-[#EA580C]',
    dot: 'bg-[#EA580C]',
    badge: 'bg-[#EA580C] text-white',
    cardHover: 'hover:border-[#EA580C]/60',
  },
  visited: {
    column: 'bg-[#F2FBFB] border-[#B4E0DE]',
    headerBg: 'bg-[#E1F5F4] border-[#B4E0DE]',
    topBar: 'bg-[#0F766E]',
    dot: 'bg-[#0F766E]',
    badge: 'bg-[#0F766E] text-white',
    cardHover: 'hover:border-[#0F766E]/60',
  },
  no_show: {
    column: 'bg-[#FFF6F8] border-[#F5C5D0]',
    headerBg: 'bg-[#FFE7ED] border-[#F5C5D0]',
    topBar: 'bg-[#E11D48]',
    dot: 'bg-[#E11D48]',
    badge: 'bg-[#E11D48] text-white',
    cardHover: 'hover:border-[#E11D48]/60',
  },
  follow_up: {
    column: 'bg-[#FFFDF4] border-[#F3D88B]',
    headerBg: 'bg-[#FEF3C7]/80 border-[#F3D88B]',
    topBar: 'bg-[#D97706]',
    dot: 'bg-[#D97706]',
    badge: 'bg-[#D97706] text-white',
    cardHover: 'hover:border-[#D97706]/60',
  },
  closed_won: {
    column: 'bg-[#F3FCF7] border-[#B6E3CD]',
    headerBg: 'bg-[#E2F7EC] border-[#B6E3CD]',
    topBar: 'bg-[#059669]',
    dot: 'bg-[#059669]',
    badge: 'bg-[#059669] text-white',
    cardHover: 'hover:border-[#059669]/60',
  },
  closed_lost: {
    column: 'bg-[#F6F7F9] border-[#D1D5DB]',
    headerBg: 'bg-[#ECEEF2] border-[#D1D5DB]',
    topBar: 'bg-zinc-700',
    dot: 'bg-zinc-700',
    badge: 'bg-zinc-800 text-white',
    cardHover: 'hover:border-zinc-400',
  },
};

export const PipelineSection: React.FC = () => {
  const {
    t,
    language,
    leads,
    properties,
    employees,
    updateLead,
    addLeadNote,
    openLeadProfile,
    setPreselectedLeadForApt,
    setQuickModal,
  } = useAgency();

  const [pipelineTab, setPipelineTab] = useState<PipelineTab>('all');
  const [search, setSearch] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);
  const [noteTargetLead, setNoteTargetLead] = useState<Lead | null>(null);
  const [quickNoteText, setQuickNoteText] = useState('');

  const saleCount = useMemo(() => leads.filter((l) => l.transaction_type === 'sale').length, [leads]);
  const rentCount = useMemo(() => leads.filter((l) => l.transaction_type === 'rent').length, [leads]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (pipelineTab !== 'all' && l.transaction_type !== pipelineTab) return false;
      if (employeeFilter !== 'all' && l.assigned_employee_id !== employeeFilter) return false;
      if (dateFilter && l.created_at < dateFilter) return false;
      if (q) {
        const prop = properties.find((p) => p.id === l.interested_property_id);
        const text = `${l.name} ${l.phone} ${l.city} ${prop?.title ?? ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [leads, properties, pipelineTab, search, employeeFilter, dateFilter]);

  const activePipelineValue = useMemo(
    () =>
      filteredLeads
        .filter((l) => !['closed_lost', 'not_interested'].includes(l.status))
        .reduce((sum, l) => sum + l.budget, 0),
    [filteredLeads]
  );

  const conversionRate = useMemo(() => {
    if (!filteredLeads.length) return 0;
    const won = filteredLeads.filter((l) => l.status === 'closed_won').length;
    return Math.round((won / filteredLeads.length) * 100);
  }, [filteredLeads]);

  const attendanceRate = useMemo(() => {
    const visited = filteredLeads.filter((l) => ['visited', 'follow_up', 'closed_won'].includes(l.status)).length;
    const noShow = filteredLeads.filter((l) => l.status === 'no_show').length;
    if (visited + noShow === 0) return 100;
    return Math.round((visited / (visited + noShow)) * 100);
  }, [filteredLeads]);

  const avgBudget = useMemo(() => {
    if (!filteredLeads.length) return 0;
    return Math.round(filteredLeads.reduce((s, l) => s + l.budget, 0) / filteredLeads.length);
  }, [filteredLeads]);

  const handleDrop = (stageStatus: LeadStatus) => {
    if (draggedLeadId) {
      const target = leads.find((l) => l.id === draggedLeadId);
      if (target && target.status !== stageStatus) {
        updateLead(draggedLeadId, { status: stageStatus });
      }
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.pipeline.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.pipeline.subtitle}</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-[11px] font-bold text-zinc-900 card-surface self-start sm:self-auto">
          {t.pipeline.dragHint}
        </span>
      </div>

      {/* Sale vs Rent Pipeline Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {(
          [
            { id: 'all', label: t.pipeline.tabs.all, count: leads.length, activeClass: 'btn-primary' },
            { id: 'sale', label: t.pipeline.tabs.sale, count: saleCount, activeClass: 'btn-primary' },
            { id: 'rent', label: t.pipeline.tabs.rent, count: rentCount, activeClass: 'btn-accent' },
          ] as const
        ).map((tab) => {
          const isActive = pipelineTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPipelineTab(tab.id)}
              className={`h-10 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-2.5 border transition-all ${
                isActive ? tab.activeClass : 'btn-outline'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono-num font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-zinc-100 text-zinc-950 border border-zinc-200'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pipeline Performance Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t.pipeline.indicators.totalPipelineValue}
          value={formatMAD(activePipelineValue, language)}
          icon={<Coins className="h-4 w-4" />}
          tone="navy"
        />
        <KpiCard
          title={t.pipeline.indicators.conversionRate}
          value={`${conversionRate}%`}
          icon={<Handshake className="h-4 w-4" />}
          tone="emerald"
        />
        <KpiCard
          title={t.pipeline.indicators.visitAttendanceRate}
          value={`${attendanceRate}%`}
          icon={<UserCheck className="h-4 w-4" />}
          tone="sky"
        />
        <KpiCard
          title={t.pipeline.indicators.avgDealBudget}
          value={formatMAD(avgBudget, language)}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="orange"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-zinc-200 card-surface rounded-2xl p-3.5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-zinc-500 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.app.search}
            className="w-full h-9 ps-8 pe-3 text-xs border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-950 focus:bg-white focus:border-zinc-900 focus:outline-none"
          />
        </div>
        <select
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="h-9 px-3 text-xs font-semibold border border-zinc-200 rounded-xl bg-white text-zinc-950"
        >
          <option value="all">{t.leads.filters.allEmployees}</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-9 px-3 text-xs font-semibold border border-zinc-200 rounded-xl bg-white text-zinc-950 font-mono-num"
        />
        {(search || employeeFilter !== 'all' || dateFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setEmployeeFilter('all');
              setDateFilter('');
            }}
            className="h-9 px-3.5 rounded-xl text-xs font-bold btn-secondary"
          >
            {t.app.reset}
          </button>
        )}
      </div>

      {/* All Stages Visible Grid with Clients Listed Directly Underneath Each Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {PIPELINE_STAGES.map(({ status, key }) => {
          const stageLeads = filteredLeads.filter((l) =>
            status === 'closed_lost'
              ? l.status === 'closed_lost' || l.status === 'not_interested'
              : l.status === status
          );
          const stageTotal = stageLeads.reduce((s, l) => s + l.budget, 0);
          const isOver = dragOverStage === status;
          const stStyle = stageStyles[key];

          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(status);
              }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={() => handleDrop(status)}
              className={`rounded-2xl border overflow-hidden card-surface transition-all flex flex-col ${
                isOver
                  ? 'bg-orange-50/80 border-[#EA580C] ring-2 ring-[#EA580C]/25'
                  : stStyle.column
              }`}
            >
              {/* Sleek Top Status Indicator */}
              <div className={`h-1 w-full ${stStyle.topBar}`} />

              {/* Harmonious Stage Header with Crisp Black Title */}
              <div className={`px-4 py-3 border-b ${stStyle.headerBg}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${stStyle.dot}`} />
                    <h3 className="text-sm font-extrabold truncate text-zinc-950">
                      {t.pipeline.stages[key]}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-extrabold rounded-md tabular-nums shrink-0 ${stStyle.badge}`}>
                    {stageLeads.length}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-zinc-600">{t.leads.columns.budget}</span>
                  <span className="font-extrabold font-mono-num text-zinc-950">
                    {formatMAD(stageTotal, language)}
                  </span>
                </div>
              </div>

              {/* Stage Clients List */}
              <div className="p-3 space-y-3 max-h-[540px] overflow-y-auto">
                {stageLeads.length === 0 ? (
                  <div className="py-8 px-3 rounded-xl border border-dashed border-zinc-300 bg-white text-center text-xs font-medium text-zinc-500">
                    {t.pipeline.emptyStage}
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const prop = properties.find((p) => p.id === lead.interested_property_id);
                    const emp = employees.find((e) => e.id === lead.assigned_employee_id);
                    const isSale = lead.transaction_type === 'sale';
                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => setDraggedLeadId(lead.id)}
                        onDragEnd={() => {
                          setDraggedLeadId(null);
                          setDragOverStage(null);
                        }}
                        className={`bg-white border border-zinc-200 rounded-xl p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing shadow-2xs transition-all hover:shadow-md ${stStyle.cardHover}`}
                      >
                        {/* Client Name, Phone & Budget */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => openLeadProfile(lead.id)}
                              className="font-display text-[13px] font-extrabold text-zinc-950 hover:text-[#EA580C] hover:underline text-start block truncate"
                            >
                              {lead.name}
                            </button>
                            <div className="flex items-center gap-1 text-[11px] font-mono-num text-zinc-600 mt-0.5" dir="ltr">
                              <Phone className="h-3 w-3 text-zinc-400 shrink-0" />
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-[11px] font-extrabold font-mono-num text-zinc-950 shrink-0">
                            {formatMAD(lead.budget, language)}
                          </span>
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <ClassificationBadge
                            classification={lead.classification}
                            label={t.leadClassifications[lead.classification]}
                          />
                          <ContactMethodBadge
                            method={lead.contact_method}
                            label={t.contactMethods[lead.contact_method]}
                            phone={lead.phone}
                          />
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isSale
                                ? 'bg-sky-50 text-sky-900 border-sky-200'
                                : 'bg-orange-50 text-orange-900 border-orange-200'
                            }`}
                          >
                            {t.transactionTypes[lead.transaction_type]}
                          </span>
                        </div>

                        {/* Property & Location / Payment Summary */}
                        <div className="bg-zinc-50 border border-zinc-200/80 rounded-lg px-2.5 py-2 space-y-1 text-[11px]">
                          {prop && (
                            <div className="flex items-center gap-1.5 font-bold text-zinc-950 truncate">
                              <Building2 className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                              <span className="truncate">{prop.title}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-2 text-zinc-700">
                            <span className="inline-flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
                              {lead.city}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-zinc-900 shrink-0">
                              {lead.payment_method === 'cash' ? (
                                <Wallet className="h-3 w-3 text-emerald-700" />
                              ) : (
                                <CreditCard className="h-3 w-3 text-indigo-700" />
                              )}
                              {t.paymentMethods[lead.payment_method]}
                            </span>
                          </div>
                        </div>

                        {/* Advisor & Follow-up Date */}
                        <div className="flex items-center justify-between text-[11px] text-zinc-600">
                          <span className="font-bold text-zinc-950 truncate">{emp?.name}</span>
                          <span className="font-mono-num text-zinc-600">
                            {lead.next_followup
                              ? formatShortDate(lead.next_followup, language)
                              : formatShortDate(lead.last_interaction, language)}
                          </span>
                        </div>

                        {/* Stage Move & Decorated Action Buttons */}
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              updateLead(lead.id, { status: e.target.value as LeadStatus })
                            }
                            aria-label={t.pipeline.moveToStage}
                            className="h-8 px-2 text-[11px] font-bold border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-950 max-w-[135px] focus:outline-none focus:border-zinc-900"
                          >
                            {(Object.keys(t.leadStatuses) as LeadStatus[]).map((st) => (
                              <option key={st} value={st}>{t.leadStatuses[st]}</option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setNoteTargetLead(lead);
                                setQuickNoteText('');
                              }}
                              title={t.pipeline.quickNote}
                              className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center transition-colors"
                            >
                              <MessageSquarePlus className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPreselectedLeadForApt(lead.id);
                                setQuickModal('appointment');
                              }}
                              title={t.pipeline.bookVisit}
                              className="h-8 w-8 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] hover:bg-orange-100 inline-flex items-center justify-center transition-colors"
                            >
                              <CalendarPlus className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openLeadProfile(lead.id)}
                              title={t.pipeline.openProfile}
                              className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-950 hover:bg-zinc-200 inline-flex items-center justify-center transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Note Modal */}
      <Modal
        open={Boolean(noteTargetLead)}
        onClose={() => setNoteTargetLead(null)}
        title={`${t.pipeline.quickNote} — ${noteTargetLead?.name ?? ''}`}
        size="md"
      >
        <div className="space-y-3">
          <textarea
            rows={4}
            value={quickNoteText}
            onChange={(e) => setQuickNoteText(e.target.value)}
            placeholder={t.leads.profile.addNotePlaceholder}
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-[#0B3B4E] focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNoteTargetLead(null)}
              className="px-4 py-2 text-xs rounded-xl btn-outline"
            >
              {t.app.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (noteTargetLead && quickNoteText.trim()) {
                  addLeadNote(noteTargetLead.id, quickNoteText);
                }
                setNoteTargetLead(null);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl btn-primary"
            >
              {t.app.save}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
