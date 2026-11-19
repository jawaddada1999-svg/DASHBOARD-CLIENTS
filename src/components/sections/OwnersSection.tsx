import React, { useMemo, useState } from 'react';
import {
  Briefcase,
  Building2,
  Coins,
  Edit3,
  Eye,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { MOROCCAN_CITIES } from '../../data/demoData';
import { formatMAD, formatNumber } from '../../i18n/translations';
import { OwnerType, PropertyOwner } from '../../types/domain';
import { OwnerFormModal } from '../modals/QuickModals';
import {
  Avatar,
  ConfirmDialog,
  ContactMethodBadge,
  Drawer,
  EmptyState,
  KpiCard,
  SafeImage,
  StatusLabel,
} from '../ui/DataPrimitives';

const ownerTypeBadgeStyle: Record<OwnerType, string> = {
  individual: 'bg-sky-50 text-sky-800 border-sky-200',
  investor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  developer: 'bg-amber-50 text-amber-900 border-amber-200',
  company: 'bg-slate-100 text-slate-800 border-slate-200',
};

export const OwnersSection: React.FC = () => {
  const {
    t,
    language,
    owners,
    properties,
    deleteOwner,
    selectedOwnerId,
    setSelectedOwnerId,
    openPropertyDetails,
  } = useAgency();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<PropertyOwner | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const getOwnerProperties = (owner: PropertyOwner) =>
    properties.filter((p) => p.owner_id === owner.id || p.owner_name === owner.name);

  const filteredOwners = useMemo(() => {
    const q = search.trim().toLowerCase();
    return owners.filter((o) => {
      if (typeFilter !== 'all' && o.owner_type !== typeFilter) return false;
      if (cityFilter !== 'all' && o.city !== cityFilter) return false;
      if (q) {
        const hay = `${o.name} ${o.phone} ${o.email} ${o.city} ${o.national_id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [owners, search, typeFilter, cityFilter]);

  const stats = useMemo(() => {
    const linkedProps = properties.filter((p) =>
      owners.some((o) => o.id === p.owner_id || o.name === p.owner_name)
    );
    const portfolioValue = linkedProps
      .filter((p) => p.transaction_type === 'sale')
      .reduce((sum, p) => sum + p.price, 0);
    const investorsCount = owners.filter(
      (o) => o.owner_type === 'investor' || o.owner_type === 'developer'
    ).length;

    return {
      totalOwners: owners.length,
      linkedProperties: linkedProps.length,
      portfolioValue,
      investorsCount,
    };
  }, [owners, properties]);

  const activeOwner = useMemo(
    () => owners.find((o) => o.id === selectedOwnerId) ?? null,
    [owners, selectedOwnerId]
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.owners.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.owners.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingOwner(null);
            setOwnerModalOpen(true);
          }}
          className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto btn-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t.owners.addOwner}</span>
        </button>
      </div>

      {/* 4 Harmonious KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t.owners.stats.totalOwners}
          value={formatNumber(stats.totalOwners, language)}
          icon={<Briefcase className="h-4 w-4" />}
          tone="navy"
        />
        <KpiCard
          title={t.owners.stats.totalPropertiesLinked}
          value={formatNumber(stats.linkedProperties, language)}
          icon={<Building2 className="h-4 w-4" />}
          tone="sky"
        />
        <KpiCard
          title={t.owners.stats.portfolioValue}
          value={formatMAD(stats.portfolioValue, language)}
          icon={<Coins className="h-4 w-4" />}
          tone="emerald"
        />
        <KpiCard
          title={t.owners.stats.investorsCount}
          value={formatNumber(stats.investorsCount, language)}
          icon={<UserCheck className="h-4 w-4" />}
          tone="orange"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-zinc-200 card-surface rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.app.search}
            className="w-full h-9 ps-8 pe-3 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">{t.owners.filters.allTypes}</option>
          {(Object.keys(t.ownerTypes) as OwnerType[]).map((ot) => (
            <option key={ot} value={ot}>{t.ownerTypes[ot]}</option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">{t.owners.filters.allCities}</option>
          {MOROCCAN_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Owners Table */}
      {filteredOwners.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title={t.app.noData}
          action={
            <button
              type="button"
              onClick={() => {
                setEditingOwner(null);
                setOwnerModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg"
              style={{ backgroundColor: 'var(--agency-primary)' }}
            >
              {t.owners.addOwner}
            </button>
          }
        />
      ) : (
        <div className="bg-white border border-zinc-200 card-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-950 font-extrabold whitespace-nowrap">
                  <th className="py-3 px-4 text-start">{t.owners.columns.name}</th>
                  <th className="py-3 px-4 text-start">{t.owners.columns.phone}</th>
                  <th className="py-3 px-4 text-start">{t.owners.columns.city}</th>
                  <th className="py-3 px-4 text-start">{t.owners.columns.ownerType}</th>
                  <th className="py-3 px-4 text-start">{t.owners.columns.preferredContact}</th>
                  <th className="py-3 px-4 text-start">{t.owners.columns.propertiesCount}</th>
                  <th className="py-3 px-4 text-start">{t.owners.columns.commissionRate}</th>
                  <th className="py-3 px-4 text-start">{t.owners.columns.nationalId}</th>
                  <th className="py-3 px-4 text-end">{t.app.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOwners.map((owner) => {
                  const ownedProps = getOwnerProperties(owner);
                  return (
                    <tr key={owner.id} className="hover:bg-zinc-50/90 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={owner.name} size="sm" />
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedOwnerId(owner.id)}
                              className="font-bold text-zinc-950 hover:underline text-start whitespace-nowrap"
                            >
                              {owner.name}
                            </button>
                            {owner.email && (
                              <div className="text-[11px] text-zinc-500 truncate max-w-[180px]" dir="ltr">
                                {owner.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono-num text-zinc-700 whitespace-nowrap" dir="ltr">
                        {owner.phone}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-zinc-700">{owner.city}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${ownerTypeBadgeStyle[owner.owner_type]}`}
                        >
                          {t.ownerTypes[owner.owner_type]}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <ContactMethodBadge
                          method={owner.preferred_contact}
                          label={t.contactMethods[owner.preferred_contact]}
                          phone={owner.phone}
                        />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-950 font-bold font-mono-num border border-zinc-200">
                          <Building2 className="h-3 w-3 text-zinc-500" />
                          {ownedProps.length}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono-num font-bold text-zinc-950 whitespace-nowrap">
                        {owner.commission_rate}%
                      </td>
                      <td className="py-3 px-4 font-mono-num text-zinc-600 whitespace-nowrap" dir="ltr">
                        {owner.national_id || '—'}
                      </td>
                      <td className="py-3 px-4 text-end whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOwnerId(owner.id)}
                            className="h-7 w-7 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 inline-flex items-center justify-center transition-colors"
                            title={t.owners.profile.title}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOwner(owner);
                              setOwnerModalOpen(true);
                            }}
                            className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center transition-colors"
                            title={t.app.edit}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(owner.id)}
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
        </div>
      )}

      {/* Owner Profile Drawer */}
      <Drawer
        open={Boolean(activeOwner)}
        onClose={() => setSelectedOwnerId(null)}
        title={activeOwner?.name ?? ''}
        subtitle={t.owners.profile.title}
        dir={t.app.dir}
      >
        {activeOwner && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar name={activeOwner.name} size="lg" />
                <div>
                  <div className="text-sm font-bold text-slate-900">{activeOwner.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${ownerTypeBadgeStyle[activeOwner.owner_type]}`}
                    >
                      {t.ownerTypes[activeOwner.owner_type]}
                    </span>
                    <ContactMethodBadge
                      method={activeOwner.preferred_contact}
                      label={t.contactMethods[activeOwner.preferred_contact]}
                      phone={activeOwner.phone}
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingOwner(activeOwner);
                  setOwnerModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:bg-slate-50"
              >
                {t.app.edit}
              </button>
            </div>

            {/* Owner Characteristics */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3 text-xs">
              <div className="font-bold text-zinc-950">{t.owners.profile.contactAndDetails}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-zinc-800 font-mono-num" dir="ltr">
                  <Phone className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                  <span>{activeOwner.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-800">
                  <Mail className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                  <span dir="ltr">{activeOwner.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-800">
                  <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                  <span>{activeOwner.city}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-800 font-mono-num">
                  <Percent className="h-3.5 w-3.5 text-[#EA580C] shrink-0" />
                  <span>
                    {t.owners.columns.commissionRate}: <strong className="text-zinc-950">{activeOwner.commission_rate}%</strong>
                  </span>
                </div>
              </div>
              {activeOwner.national_id && (
                <div className="pt-2 border-t border-zinc-200 text-zinc-600 font-mono-num">
                  {t.owners.columns.nationalId}: <strong className="text-zinc-950">{activeOwner.national_id}</strong>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-200">
                <div className="text-zinc-500 mb-1">{t.owners.profile.notes}</div>
                <p className="text-zinc-900 leading-relaxed">{activeOwner.notes || '—'}</p>
              </div>
            </div>

            {/* Linked Properties */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-950">{t.owners.profile.ownedProperties}</h4>
              {getOwnerProperties(activeOwner).length === 0 ? (
                <div className="border border-zinc-200 rounded-xl p-6 text-center text-xs text-zinc-400">
                  {t.owners.profile.noProperties}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {getOwnerProperties(activeOwner).map((prop) => (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => openPropertyDetails(prop.id)}
                      className="w-full text-start border border-zinc-200 rounded-xl p-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors"
                    >
                      <SafeImage
                        src={prop.images[0]}
                        alt={prop.title}
                        className="h-14 w-20 rounded-lg object-cover shrink-0 border border-zinc-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono-num text-zinc-400">{prop.ref}</span>
                          <StatusLabel label={t.propertyStatuses[prop.status]} propertyStatus={prop.status} />
                        </div>
                        <div className="text-xs font-bold text-zinc-950 truncate mt-1">{prop.title}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {prop.city} · {t.propertyTypes[prop.type]} · {t.transactionTypes[prop.transaction_type]}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-zinc-950 font-mono-num shrink-0">
                        {formatMAD(prop.price, language)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <OwnerFormModal
        open={ownerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
        editingOwner={editingOwner}
      />

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title={t.owners.deleteOwner}
        description={t.owners.deleteConfirm}
        confirmLabel={t.app.delete}
        cancelLabel={t.app.cancel}
        onConfirm={() => {
          if (deleteTargetId) deleteOwner(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
