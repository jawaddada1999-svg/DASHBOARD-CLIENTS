import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  BedDouble,
  CalendarPlus,
  CreditCard,
  Download,
  Edit3,
  Eye,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { MOROCCAN_CITIES } from '../../data/demoData';
import { formatMAD, formatShortDate } from '../../i18n/translations';
import { Lead, LeadClassification, LeadSource, LeadStatus } from '../../types/domain';
import { buildTelHref, buildWhatsAppHref } from '../../utils/contactLinks';
import { downloadCsvWithBom } from '../../utils/exportUtils';
import { LeadFormModal } from '../modals/QuickModals';
import {
  Avatar,
  ClassificationBadge,
  ConfirmDialog,
  ContactMethodBadge,
  Drawer,
  EmptyState,
  PaginationBar,
  StatusLabel,
} from '../ui/DataPrimitives';

type SortField = 'name' | 'budget' | 'created_at' | 'last_interaction';
type TxTab = 'all' | 'sale' | 'rent';

export const LeadsSection: React.FC = () => {
  const {
    t,
    language,
    leads,
    properties,
    employees,
    appointments,
    conversations,
    updateLead,
    deleteLead,
    addLeadNote,
    selectedLeadId,
    setSelectedLeadId,
    openPropertyDetails,
    openLeadConversation,
    setQuickModal,
    setPreselectedLeadForApt,
    pushToast,
  } = useAgency();

  const [txTab, setTxTab] = useState<TxTab>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [followupInput, setFollowupInput] = useState('');

  const buyersCount = useMemo(() => leads.filter((l) => l.transaction_type === 'sale').length, [leads]);
  const rentersCount = useMemo(() => leads.filter((l) => l.transaction_type === 'rent').length, [leads]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads
      .filter((l) => {
        if (txTab !== 'all' && l.transaction_type !== txTab) return false;
        if (statusFilter !== 'all' && l.status !== statusFilter) return false;
        if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
        if (employeeFilter !== 'all' && l.assigned_employee_id !== employeeFilter) return false;
        if (cityFilter !== 'all' && l.city !== cityFilter) return false;
        if (classFilter !== 'all' && l.classification !== classFilter) return false;
        if (q) {
          const prop = properties.find((p) => p.id === l.interested_property_id);
          const haystack = `${l.name} ${l.phone} ${l.email} ${l.city} ${l.district} ${prop?.title ?? ''}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'budget') cmp = a.budget - b.budget;
        else cmp = String(a[sortField]).localeCompare(String(b[sortField]));
        return sortAsc ? cmp : -cmp;
      });
  }, [
    leads,
    properties,
    txTab,
    search,
    statusFilter,
    sourceFilter,
    employeeFilter,
    cityFilter,
    classFilter,
    sortField,
    sortAsc,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const pagedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

  const activeLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) ?? null,
    [leads, selectedLeadId]
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pagedLeads.length) setSelectedIds([]);
    else setSelectedIds(pagedLeads.map((l) => l.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExport = (targetLeads: Lead[]) => {
    downloadCsvWithBom(
      'ibonda-leads-export.csv',
      [
        t.leads.columns.name,
        t.leads.columns.phone,
        t.leads.columns.contactMethod,
        t.leads.columns.classification,
        t.leads.form.transactionType,
        t.leads.columns.propertyType,
        t.leads.columns.bedrooms,
        t.leads.columns.deliveryStatus,
        t.leads.columns.desiredArea,
        t.leads.columns.paymentMethod,
        t.leads.columns.budget,
        t.leads.columns.city,
        t.leads.columns.source,
        t.leads.columns.employee,
        t.leads.columns.status,
      ],
      targetLeads.map((l) => [
        l.name,
        l.phone,
        t.contactMethods[l.contact_method],
        t.leadClassifications[l.classification],
        t.transactionTypes[l.transaction_type],
        t.propertyTypes[l.property_type],
        l.bedrooms,
        t.deliveryStatuses[l.delivery_status],
        `${l.desired_area} ${t.app.sqm}`,
        t.paymentMethods[l.payment_method],
        formatMAD(l.budget, language),
        l.city,
        t.leadSources[l.source],
        employees.find((e) => e.id === l.assigned_employee_id)?.name ?? '-',
        t.leadStatuses[l.status],
      ])
    );
    pushToast({ type: 'success', title: t.toasts.exported });
  };

  const handleBulkAssign = (empId: string) => {
    if (!empId) return;
    selectedIds.forEach((id) => updateLead(id, { assigned_employee_id: empId }));
    setSelectedIds([]);
  };

  const handleBulkStatus = (status: LeadStatus) => {
    selectedIds.forEach((id) => updateLead(id, { status }));
    setSelectedIds([]);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.leads.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.leads.subtitle}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleExport(filteredLeads)}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-secondary"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t.app.exportCsv}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingLead(null);
              setLeadModalOpen(true);
            }}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.leads.addLead}</span>
          </button>
        </div>
      </div>

      {/* Buyers vs Renters Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {(
          [
            { id: 'all', label: t.leads.tabs.all, count: leads.length, activeClass: 'btn-primary' },
            { id: 'sale', label: t.leads.tabs.buyers, count: buyersCount, activeClass: 'bg-[#0369A1] text-white border-[#0369A1] shadow-sm shadow-[#0369A1]/25' },
            { id: 'rent', label: t.leads.tabs.renters, count: rentersCount, activeClass: 'btn-accent' },
          ] as const
        ).map((tab) => {
          const isActive = txTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setTxTab(tab.id);
                setPage(1);
                setSelectedIds([]);
              }}
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

      {/* Filters Toolbar */}
      <div className="bg-white border border-zinc-200 card-surface rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t.app.search}
            className="w-full h-9 ps-8 pe-3 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">{t.leads.filters.allClassifications}</option>
          {(Object.keys(t.leadClassifications) as LeadClassification[]).map((cl) => (
            <option key={cl} value={cl}>{t.leadClassifications[cl]}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">{t.leads.filters.allStatuses}</option>
          {(Object.keys(t.leadStatuses) as LeadStatus[]).map((st) => (
            <option key={st} value={st}>{t.leadStatuses[st]}</option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">{t.leads.filters.allCities}</option>
          {MOROCCAN_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">{t.leads.filters.allSources}</option>
          {(Object.keys(t.leadSources) as LeadSource[]).map((src) => (
            <option key={src} value={src}>{t.leadSources[src]}</option>
          ))}
        </select>

        <select
          value={employeeFilter}
          onChange={(e) => {
            setEmployeeFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">{t.leads.filters.allEmployees}</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0B3B4E] text-white rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium">
            {t.app.selectedCount}: <span className="font-bold tabular-nums">{selectedIds.length}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) handleBulkAssign(e.target.value);
                e.target.value = '';
              }}
              className="h-8 px-2.5 text-xs bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="" className="text-slate-900">{t.leads.bulk.assignEmployee}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="text-slate-900">{emp.name}</option>
              ))}
            </select>

            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) handleBulkStatus(e.target.value as LeadStatus);
                e.target.value = '';
              }}
              className="h-8 px-2.5 text-xs bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="" className="text-slate-900">{t.leads.bulk.changeStatus}</option>
              {(Object.keys(t.leadStatuses) as LeadStatus[]).map((st) => (
                <option key={st} value={st} className="text-slate-900">{t.leadStatuses[st]}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => handleExport(leads.filter((l) => selectedIds.includes(l.id)))}
              className="h-8 px-3 text-xs bg-white/15 hover:bg-white/25 rounded-lg"
            >
              {t.leads.bulk.exportSelected}
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="h-8 px-2.5 text-xs text-slate-200 hover:text-white"
            >
              {t.app.clearSelection}
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title={t.leads.emptyTitle}
          description={t.leads.emptyDesc}
          action={
            <button
              type="button"
              onClick={() => {
                setEditingLead(null);
                setLeadModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg"
              style={{ backgroundColor: 'var(--agency-primary)' }}
            >
              {t.leads.addLead}
            </button>
          }
        />
      ) : (
        <div className="bg-white border border-zinc-200 card-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-950 font-extrabold whitespace-nowrap">
                  <th className="py-3 px-3 w-9">
                    <input
                      type="checkbox"
                      checked={pagedLeads.length > 0 && selectedIds.length === pagedLeads.length}
                      onChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="py-3 px-3 text-start">
                    <button
                      type="button"
                      onClick={() => toggleSort('name')}
                      className="inline-flex items-center gap-1 hover:text-zinc-700"
                    >
                      <span>{t.leads.columns.name}</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.classification}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.contactMethod}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.propertyType}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.bedrooms}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.deliveryStatus}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.desiredArea}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.paymentMethod}</th>
                  <th className="py-3 px-3 text-start">
                    <button
                      type="button"
                      onClick={() => toggleSort('budget')}
                      className="inline-flex items-center gap-1 hover:text-zinc-700"
                    >
                      <span>{t.leads.columns.budget}</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.city}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.employee}</th>
                  <th className="py-3 px-3 text-start">{t.leads.columns.status}</th>
                  <th className="py-3 px-3 text-end">{t.app.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {pagedLeads.map((lead) => {
                  const emp = employees.find((e) => e.id === lead.assigned_employee_id);
                  const isSale = lead.transaction_type === 'sale';
                  return (
                    <tr
                      key={lead.id}
                      className="transition-colors hover:bg-zinc-50/90"
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleSelectOne(lead.id)}
                          aria-label={lead.name}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="font-bold text-zinc-950 hover:underline text-start block whitespace-nowrap"
                        >
                          {lead.name}
                        </button>
                        <a
                          href={buildTelHref(lead.phone)}
                          onClick={(e) => e.stopPropagation()}
                          title={t.appointments.agenda.directCall}
                          className="text-[11px] text-slate-500 hover:text-sky-700 hover:underline font-mono-num inline-block mt-0.5"
                          dir="ltr"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <ClassificationBadge
                          classification={lead.classification}
                          label={t.leadClassifications[lead.classification]}
                        />
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
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
                              className="h-6 w-6 rounded-md bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-400 inline-flex items-center justify-center transition-colors"
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
                              className="h-6 w-6 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 inline-flex items-center justify-center transition-colors"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                              isSale
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : 'bg-orange-50 text-orange-800 border-orange-200'
                            }`}
                          >
                            {t.transactionTypes[lead.transaction_type]}
                          </span>
                          <span className="font-medium text-slate-800">
                            {t.propertyTypes[lead.property_type]}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono-num">
                        {lead.bedrooms > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold">
                            <BedDouble className="h-3 w-3 text-slate-500" />
                            {lead.bedrooms}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                            lead.delivery_status === 'ready'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {t.deliveryStatuses[lead.delivery_status]}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono-num font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-1">
                          <Maximize2 className="h-3 w-3 text-slate-400" />
                          {lead.desired_area} {t.app.sqm}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                            lead.payment_method === 'cash'
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          }`}
                        >
                          {lead.payment_method === 'cash' ? (
                            <Wallet className="h-3 w-3" />
                          ) : (
                            <CreditCard className="h-3 w-3" />
                          )}
                          {t.paymentMethods[lead.payment_method]}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono-num font-bold text-zinc-950 whitespace-nowrap">
                        {formatMAD(lead.budget, language)}
                        {lead.transaction_type === 'rent' ? ` ${t.app.perMonth}` : ''}
                      </td>
                      <td className="py-3 px-3 text-zinc-700 whitespace-nowrap">
                        <div className="font-medium text-zinc-900">{lead.city}</div>
                        {lead.district && (
                          <div className="text-[11px] text-zinc-500">{lead.district}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-zinc-700">
                        {emp?.name ?? '—'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusLabel label={t.leadStatuses[lead.status]} leadStatus={lead.status} />
                      </td>
                      <td className="py-3 px-3 text-end whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLeadId(lead.id)}
                            className="h-7 w-7 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 inline-flex items-center justify-center transition-colors"
                            title={t.leads.profile.title}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLead(lead);
                              setLeadModalOpen(true);
                            }}
                            className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center transition-colors"
                            title={t.app.edit}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(lead.id)}
                            className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 inline-flex items-center justify-center transition-colors"
                            title={t.app.delete}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={filteredLeads.length}
            pageSize={pageSize}
            showingLabel={t.app.showing}
            ofLabel={t.app.of}
            itemsLabel={t.app.items}
            prevLabel={t.app.previous}
            nextLabel={t.app.next}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Detailed Lead Profile Drawer */}
      <Drawer
        open={Boolean(activeLead)}
        onClose={() => setSelectedLeadId(null)}
        title={activeLead?.name ?? ''}
        subtitle={t.leads.profile.title}
        dir={t.app.dir}
      >
        {activeLead && (
          <div className="space-y-6">
            {/* Top Status & Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar name={activeLead.name} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{activeLead.name}</span>
                    <ClassificationBadge
                      classification={activeLead.classification}
                      label={t.leadClassifications[activeLead.classification]}
                    />
                  </div>
                  <div className="text-xs text-slate-500 font-mono-num mt-0.5" dir="ltr">
                    {activeLead.phone} · {activeLead.email}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreselectedLeadForApt(activeLead.id);
                    setQuickModal('appointment');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--agency-accent)' }}
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  <span>{t.leads.profile.bookVisitBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openLeadConversation(activeLead.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{t.leads.profile.openChatBtn}</span>
                </button>
              </div>
            </div>

            {/* Status & Advisor Assignment Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {t.leads.columns.status}
                </label>
                <select
                  value={activeLead.status}
                  onChange={(e) =>
                    updateLead(activeLead.id, { status: e.target.value as LeadStatus })
                  }
                  className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {(Object.keys(t.leadStatuses) as LeadStatus[]).map((st) => (
                    <option key={st} value={st}>{t.leadStatuses[st]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {t.leads.profile.assignedEmployee}
                </label>
                <select
                  value={activeLead.assigned_employee_id}
                  onChange={(e) =>
                    updateLead(activeLead.id, { assigned_employee_id: e.target.value })
                  }
                  className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferences & Budget Summary */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.budget}</span>
                  <span className="font-bold text-zinc-950 font-mono-num">
                    {formatMAD(activeLead.budget, language)}
                    {activeLead.transaction_type === 'rent' ? ` ${t.app.perMonth}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.contactMethod}</span>
                  <div className="mt-0.5">
                    <ContactMethodBadge
                      method={activeLead.contact_method}
                      label={t.contactMethods[activeLead.contact_method]}
                      phone={activeLead.phone}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.paymentMethod}</span>
                  <span className="font-semibold text-zinc-950">
                    {t.paymentMethods[activeLead.payment_method]}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.propertyType}</span>
                  <span className="font-semibold text-zinc-950">
                    {t.propertyTypes[activeLead.property_type]} ({t.transactionTypes[activeLead.transaction_type]})
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.bedrooms} / {t.leads.columns.desiredArea}</span>
                  <span className="font-semibold text-zinc-950 font-mono-num">
                    {activeLead.bedrooms > 0 ? `${activeLead.bedrooms} · ` : ''}
                    {activeLead.desired_area} {t.app.sqm}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.deliveryStatus}</span>
                  <span className="font-semibold text-zinc-950">
                    {t.deliveryStatuses[activeLead.delivery_status]}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.city}</span>
                  <span className="font-semibold text-zinc-950">
                    {activeLead.city}{activeLead.district ? ` — ${activeLead.district}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.source}</span>
                  <span className="font-medium text-zinc-900">{t.leadSources[activeLead.source]}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">{t.leads.columns.createdAt}</span>
                  <span className="font-mono-num text-zinc-800">{formatShortDate(activeLead.created_at, language)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-200">
                <span className="text-zinc-500 block mb-1">{t.leads.profile.preferences}</span>
                <p className="text-zinc-900 leading-relaxed">{activeLead.preferences || '—'}</p>
              </div>
              {activeLead.interested_property_id && (
                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                  <span className="text-slate-500">{t.leads.profile.interestedProperty}:</span>
                  <button
                    type="button"
                    onClick={() => openPropertyDetails(activeLead.interested_property_id!)}
                    className="font-semibold hover:underline"
                    style={{ color: 'var(--agency-primary)' }}
                  >
                    {properties.find((p) => p.id === activeLead.interested_property_id)?.title}
                  </button>
                </div>
              )}
            </div>

            {/* Schedule Follow-up */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-900">{t.leads.profile.scheduleFollowup}</div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={followupInput || activeLead.next_followup || '2026-11-22'}
                  onChange={(e) => setFollowupInput(e.target.value)}
                  className="h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateLead(activeLead.id, {
                      next_followup: followupInput || activeLead.next_followup || '2026-11-22',
                    });
                  }}
                  className="h-9 px-3.5 text-xs font-semibold text-white rounded-lg"
                  style={{ backgroundColor: 'var(--agency-primary)' }}
                >
                  {t.leads.profile.saveFollowup}
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900">{t.leads.profile.internalNotes}</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder={t.leads.profile.addNotePlaceholder}
                  className="flex-1 h-9 px-3 text-xs border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    addLeadNote(activeLead.id, noteInput);
                    setNoteInput('');
                  }}
                  className="h-9 px-3.5 text-xs font-semibold text-white rounded-lg shrink-0"
                  style={{ backgroundColor: 'var(--agency-primary)' }}
                >
                  {t.leads.profile.addNoteBtn}
                </button>
              </div>
              <div className="space-y-2">
                {activeLead.notes.map((n) => (
                  <div key={n.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">{n.author_name}</span>
                      <span className="font-mono-num">{n.created_at}</span>
                    </div>
                    <p className="text-slate-700">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment History & Conversation History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">{t.leads.profile.appointmentHistory}</h4>
                {appointments.filter((a) => a.lead_id === activeLead.id).length === 0 ? (
                  <p className="text-xs text-slate-400">{t.app.noData}</p>
                ) : (
                  appointments
                    .filter((a) => a.lead_id === activeLead.id)
                    .map((a) => (
                      <div key={a.id} className="text-xs border-t border-slate-100 pt-2">
                        <div className="font-medium text-slate-800 font-mono-num">
                          {a.date} · {a.time}
                        </div>
                        <div className="text-[11px] text-slate-500">{t.appointmentStatuses[a.status]}</div>
                      </div>
                    ))
                )}
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">{t.leads.profile.conversationHistory}</h4>
                {conversations
                  .filter((c) => c.lead_id === activeLead.id)
                  .flatMap((c) => c.messages)
                  .slice(-3)
                  .map((m) => (
                    <div key={m.id} className="text-xs border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-800">{m.sender_name}: </span>
                      <span className="text-slate-600">{m.text}</span>
                    </div>
                  ))}
                {conversations.filter((c) => c.lead_id === activeLead.id).length === 0 && (
                  <p className="text-xs text-slate-400">{t.app.noData}</p>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">{t.leads.profile.activityTimeline}</h4>
              <div className="space-y-2">
                {activeLead.timeline.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-xs border-b border-slate-100 pb-2">
                    <div>
                      <div className="font-semibold text-slate-800">{item.title}</div>
                      <div className="text-slate-600">{item.description}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.actor}</div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono-num shrink-0">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <LeadFormModal
        open={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        editingLead={editingLead}
      />

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title={t.leads.deleteLead}
        description={t.leads.deleteConfirm}
        confirmLabel={t.app.delete}
        cancelLabel={t.app.cancel}
        onConfirm={() => {
          if (deleteTargetId) deleteLead(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
