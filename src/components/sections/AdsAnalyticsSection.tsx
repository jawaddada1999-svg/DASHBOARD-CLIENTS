import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarCheck,
  DollarSign,
  Handshake,
  Megaphone,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { formatMAD, formatNumber } from '../../i18n/translations';
import { AdPlatform } from '../../types/domain';
import { AreaTrendChart, BarComparisonChart, DonutDistributionChart } from '../ui/Charts';
import { KpiCard, StatusLabel } from '../ui/DataPrimitives';

export const AdsAnalyticsSection: React.FC = () => {
  const { t, language, adCampaigns } = useAgency();

  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'last30' | 'thisMonth' | 'last7'>('last30');

  const filteredCampaigns = useMemo(() => {
    return adCampaigns.filter((c) => {
      if (platformFilter !== 'all' && c.platform !== platformFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [adCampaigns, platformFilter, statusFilter]);

  const multiplier = dateRange === 'last7' ? 0.35 : dateRange === 'thisMonth' ? 0.85 : 1;

  const totals = useMemo(() => {
    const spend = Math.round(filteredCampaigns.reduce((s, c) => s + c.spend, 0) * multiplier);
    const leads = Math.max(1, Math.round(filteredCampaigns.reduce((s, c) => s + c.leads, 0) * multiplier));
    const qualified = Math.round(filteredCampaigns.reduce((s, c) => s + c.qualified_leads, 0) * multiplier);
    const appointments = Math.max(1, Math.round(filteredCampaigns.reduce((s, c) => s + c.appointments, 0) * multiplier));
    const visits = Math.round(filteredCampaigns.reduce((s, c) => s + c.visits, 0) * multiplier);
    const sales = Math.round(filteredCampaigns.reduce((s, c) => s + c.sales, 0) * multiplier);
    const cpl = Math.round(spend / leads);
    const cpa = Math.round(spend / appointments);
    const convRate = ((sales / leads) * 100).toFixed(1);
    return { spend, leads, qualified, appointments, visits, sales, cpl, cpa, convRate };
  }, [filteredCampaigns, multiplier]);

  const leadsByCampaignSeries = useMemo(
    () =>
      filteredCampaigns.map((c) => ({
        label: c.name.split('—')[0].trim().slice(0, 14),
        value: Math.round(c.leads * multiplier),
        secondaryValue: Math.round(c.appointments * multiplier),
      })),
    [filteredCampaigns, multiplier]
  );

  const platformSlices = useMemo(() => {
    const colors: Record<AdPlatform, string> = {
      facebook_ads: '#0B3B4E',
      instagram_ads: '#EA580C',
      google_ads: '#0284C7',
      other: '#64748B',
    };
    const grouped: Partial<Record<AdPlatform, number>> = {};
    filteredCampaigns.forEach((c) => {
      grouped[c.platform] = (grouped[c.platform] ?? 0) + Math.round(c.leads * multiplier);
    });
    return (Object.keys(grouped) as AdPlatform[]).map((p) => ({
      label: t.adPlatforms[p],
      value: grouped[p] ?? 0,
      color: colors[p],
    }));
  }, [filteredCampaigns, multiplier, t.adPlatforms]);

  const dailyLeadTrend = useMemo(() => {
    const labels = ['01', '04', '07', '10', '13', '16', '19'];
    const vals = [18, 25, 22, 31, 29, 38, 44];
    return labels.map((l, i) => ({
      label: l,
      value: Math.max(1, Math.round(vals[i] * multiplier)),
    }));
  }, [multiplier]);

  const spendAndCplSeries = useMemo(() => {
    const labels =
      language === 'ar'
        ? ['أسبوع 1', 'أسبوع 2', 'أسبوع 3', 'أسبوع 4']
        : ['W1', 'W2', 'W3', 'W4'];
    return [
      { label: labels[0], value: Math.round(11500 * multiplier), secondaryValue: 245 },
      { label: labels[1], value: Math.round(13200 * multiplier), secondaryValue: 230 },
      { label: labels[2], value: Math.round(12800 * multiplier), secondaryValue: 218 },
      { label: labels[3], value: Math.round(14550 * multiplier), secondaryValue: 205 },
    ];
  }, [language, multiplier]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.ads.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.ads.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'last30' | 'thisMonth' | 'last7')}
            className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
          >
            <option value="last7">{t.overview.dateFilters.last7}</option>
            <option value="last30">{t.overview.dateFilters.last30}</option>
            <option value="thisMonth">{t.overview.dateFilters.thisMonth}</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
          >
            <option value="all">{t.app.all}</option>
            {(Object.keys(t.adPlatforms) as AdPlatform[]).map((p) => (
              <option key={p} value={p}>{t.adPlatforms[p]}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
          >
            <option value="all">{t.leads.filters.allStatuses}</option>
            <option value="active">{t.ads.campaignStatuses.active}</option>
            <option value="paused">{t.ads.campaignStatuses.paused}</option>
            <option value="completed">{t.ads.campaignStatuses.completed}</option>
          </select>
        </div>
      </div>

      {/* Mandatory Demo Data Identification Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs text-amber-900">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
        <span>{t.ads.demoWarning}</span>
      </div>

      {/* 9 Marketing KPIs with Harmonious Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title={t.ads.kpis.totalSpend}
          value={formatMAD(totals.spend, language)}
          delta={7.4}
          icon={<DollarSign className="h-4 w-4" />}
          tone="navy"
        />
        <KpiCard
          title={t.ads.kpis.totalLeads}
          value={formatNumber(totals.leads, language)}
          delta={15.2}
          icon={<Users className="h-4 w-4" />}
          tone="orange"
        />
        <KpiCard
          title={t.ads.kpis.cpl}
          value={formatMAD(totals.cpl, language)}
          delta={-6.8}
          icon={<Target className="h-4 w-4" />}
          tone="sky"
        />
        <KpiCard
          title={t.ads.kpis.qualifiedLeads}
          value={formatNumber(totals.qualified, language)}
          delta={11.0}
          icon={<UserCheck className="h-4 w-4" />}
          tone="emerald"
        />
        <KpiCard
          title={t.ads.kpis.appointments}
          value={formatNumber(totals.appointments, language)}
          delta={13.5}
          icon={<CalendarCheck className="h-4 w-4" />}
          tone="teal"
        />
        <KpiCard
          title={t.ads.kpis.costPerAppointment}
          value={formatMAD(totals.cpa, language)}
          delta={-4.1}
          icon={<Megaphone className="h-4 w-4" />}
          tone="amber"
        />
        <KpiCard
          title={t.ads.kpis.visits}
          value={formatNumber(totals.visits, language)}
          delta={9.2}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="indigo"
        />
        <KpiCard
          title={t.ads.kpis.attributedSales}
          value={formatNumber(totals.sales, language)}
          delta={20.0}
          icon={<Handshake className="h-4 w-4" />}
          tone="emerald"
        />
        <KpiCard
          title={t.ads.kpis.conversionRate}
          value={`${totals.convRate}%`}
          delta={1.8}
          icon={<Target className="h-4 w-4" />}
          tone="orange"
        />
      </div>

      {/* 4 Charts with Harmonious Accents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#0B3B4E]" />
          <div className="px-5 py-3.5 bg-[#F3F8FB] border-b border-[#D5E5ED] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
            <h3 className="text-sm font-extrabold text-zinc-950">{t.ads.charts.leadsByCampaign}</h3>
          </div>
          <div className="p-5">
            <BarComparisonChart
              data={leadsByCampaignSeries}
              primaryLabel={t.ads.table.leads}
              secondaryLabel={t.ads.table.appointments}
            />
          </div>
        </div>

        <div className="bg-white border border-[#F7CFB6] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#EA580C]" />
          <div className="px-5 py-3.5 bg-[#FFF8F3] border-b border-[#F8DEC9] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
            <h3 className="text-sm font-extrabold text-zinc-950">{t.ads.charts.leadsByPlatform}</h3>
          </div>
          <div className="p-5">
            <DonutDistributionChart
              slices={platformSlices}
              centerValue={totals.leads}
              centerLabel={t.ads.table.leads}
            />
          </div>
        </div>

        <div className="bg-white border border-[#BADAF6] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#0284C7]" />
          <div className="px-5 py-3.5 bg-[#F3F9FF] border-b border-[#CDE4F9] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-zinc-950">{t.ads.charts.dailyTrends}</h3>
          </div>
          <div className="p-5">
            <AreaTrendChart data={dailyLeadTrend} primaryLabel={t.ads.table.leads} />
          </div>
        </div>

        <div className="bg-white border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-[#059669]" />
          <div className="px-5 py-3.5 bg-[#F3FCF7] border-b border-[#CBEAD9] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#059669]" />
            <h3 className="text-sm font-extrabold text-zinc-950">{t.ads.charts.spendAndCpl}</h3>
          </div>
          <div className="p-5">
            <BarComparisonChart
              data={spendAndCplSeries}
              primaryLabel={t.ads.table.spend}
              secondaryLabel={t.ads.table.cpl}
            />
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-zinc-200 card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-950 font-extrabold whitespace-nowrap">
                <th className="py-3 px-4 text-start">{t.ads.table.campaignName}</th>
                <th className="py-3 px-4 text-start">{t.ads.table.platform}</th>
                <th className="py-3 px-4 text-start">{t.ads.table.budget}</th>
                <th className="py-3 px-4 text-start">{t.ads.table.spend}</th>
                <th className="py-3 px-4 text-start">{t.ads.table.leads}</th>
                <th className="py-3 px-4 text-start">{t.ads.table.appointments}</th>
                <th className="py-3 px-4 text-start">{t.ads.table.cpl}</th>
                <th className="py-3 px-4 text-start">{t.ads.table.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCampaigns.map((camp) => {
                const cpl = Math.round(camp.spend / Math.max(camp.leads, 1));
                return (
                  <tr key={camp.id} className="hover:bg-zinc-50/90">
                    <td className="py-3 px-4 font-bold text-zinc-950">{camp.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-zinc-700">{t.adPlatforms[camp.platform]}</td>
                    <td className="py-3 px-4 font-mono-num whitespace-nowrap text-zinc-700">
                      {formatMAD(camp.budget, language)}
                    </td>
                    <td className="py-3 px-4 font-mono-num font-semibold text-zinc-950 whitespace-nowrap">
                      {formatMAD(camp.spend, language)}
                    </td>
                    <td className="py-3 px-4 font-mono-num font-bold text-zinc-950">{camp.leads}</td>
                    <td className="py-3 px-4 font-mono-num text-zinc-700">{camp.appointments}</td>
                    <td className="py-3 px-4 font-mono-num whitespace-nowrap text-zinc-700">
                      {formatMAD(cpl, language)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusLabel
                        label={t.ads.campaignStatuses[camp.status]}
                        tone={
                          camp.status === 'active'
                            ? 'success'
                            : camp.status === 'paused'
                              ? 'warning'
                              : 'neutral'
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
