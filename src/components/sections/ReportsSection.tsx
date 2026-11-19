import React, { useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { formatMAD } from '../../i18n/translations';
import { LeadSource, PropertyType } from '../../types/domain';
import { downloadCsvWithBom, triggerPrintPdfReport } from '../../utils/exportUtils';
import { BarComparisonChart, DonutDistributionChart } from '../ui/Charts';

type ReportTab = 'leads' | 'appointments' | 'properties' | 'team' | 'sales';

export const ReportsSection: React.FC = () => {
  const { t, language, leads, properties, appointments, employees, pushToast } = useAgency();

  const [activeTab, setActiveTab] = useState<ReportTab>('leads');
  const [fromDate, setFromDate] = useState('2026-10-01');
  const [toDate, setToDate] = useState('2026-11-30');

  const leadStats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((l) => l.status === 'new').length;
    const won = leads.filter((l) => l.status === 'closed_won').length;
    const convRate = total ? Math.round((won / total) * 100) : 0;

    const bySource = (Object.keys(t.leadSources) as LeadSource[]).map((src) => ({
      source: src,
      label: t.leadSources[src],
      count: leads.filter((l) => l.source === src).length,
    }));

    const byEmployee = employees.map((e) => ({
      name: e.name,
      count: leads.filter((l) => l.assigned_employee_id === e.id).length,
    }));

    return { total, newLeads, convRate, bySource, byEmployee };
  }, [leads, employees, t.leadSources]);

  const aptStats = useMemo(() => {
    const total = appointments.length;
    const attended = appointments.filter((a) => a.status === 'attended').length;
    const noShow = appointments.filter((a) => a.status === 'no_show').length;
    const completed = attended + noShow;
    const attendanceRate = completed ? Math.round((attended / completed) * 100) : 100;
    const absenceRate = completed ? 100 - attendanceRate : 0;

    const byEmployee = employees.map((e) => {
      const empApts = appointments.filter((a) => a.employee_id === e.id);
      const empAtt = empApts.filter((a) => a.status === 'attended').length;
      const empNo = empApts.filter((a) => a.status === 'no_show').length;
      return {
        label: e.name.split(' ')[0],
        value: empApts.length,
        secondaryValue: empAtt,
        total: empApts.length,
        attended: empAtt,
        noShow: empNo,
        name: e.name,
      };
    });

    return { total, completed, attendanceRate, absenceRate, byEmployee };
  }, [appointments, employees]);

  const propStats = useMemo(() => {
    const available = properties.filter((p) => p.status === 'available').length;
    const reserved = properties.filter((p) => p.status === 'reserved').length;
    const sold = properties.filter((p) => p.status === 'sold').length;
    const rented = properties.filter((p) => p.status === 'rented').length;
    const mostViewed = [...properties].sort((a, b) => b.views - a.views).slice(0, 5);
    const byType = (Object.keys(t.propertyTypes) as PropertyType[])
      .map((pt) => ({
        label: t.propertyTypes[pt],
        value: leads.filter((l) => l.property_type === pt).length,
      }))
      .filter((x) => x.value > 0);
    return { available, reserved, sold, rented, mostViewed, byType };
  }, [properties, leads, t.propertyTypes]);

  const teamRows = useMemo(() => {
    return employees.map((e) => {
      const empLeads = leads.filter((l) => l.assigned_employee_id === e.id);
      const empApts = appointments.filter((a) => a.employee_id === e.id);
      const attended = empApts.filter((a) => a.status === 'attended').length;
      const noShow = empApts.filter((a) => a.status === 'no_show').length;
      const completed = attended + noShow;
      const rate = completed ? Math.round((attended / completed) * 100) : 100;
      const deals = empLeads.filter((l) => l.status === 'closed_won').length;
      return {
        id: e.id,
        name: e.name,
        role: t.employeeRoles[e.role],
        leadsHandled: empLeads.length,
        visitsCompleted: completed,
        attendanceRate: rate,
        deals,
      };
    });
  }, [employees, leads, appointments, t.employeeRoles]);

  const salesStats = useMemo(() => {
    const wonLeads = leads.filter((l) => l.status === 'closed_won');
    const revenue = wonLeads.reduce((s, l) => s + l.budget, 0);
    const convRate = leads.length ? Math.round((wonLeads.length / leads.length) * 100) : 0;
    const monthly =
      language === 'ar'
        ? [
            { label: 'شتنبر', value: 4200000 },
            { label: 'أكتوبر', value: 6900000 },
            { label: 'نوفمبر', value: revenue || 8800000 },
          ]
        : [
            { label: 'Sep', value: 4200000 },
            { label: 'Oct', value: 6900000 },
            { label: 'Nov', value: revenue || 8800000 },
          ];
    return { count: wonLeads.length, revenue, convRate, monthly };
  }, [leads, language]);

  const handleExportExcelCsv = () => {
    if (activeTab === 'team') {
      downloadCsvWithBom(
        'ibonda-team-report.csv',
        [
          t.reports.teamSection.employee,
          t.reports.teamSection.leadsHandled,
          t.reports.teamSection.visitsCompleted,
          t.reports.teamSection.attendanceRate,
          t.reports.teamSection.successfulDeals,
        ],
        teamRows.map((r) => [
          r.name,
          r.leadsHandled,
          r.visitsCompleted,
          `${r.attendanceRate}%`,
          r.deals,
        ])
      );
    } else if (activeTab === 'properties') {
      downloadCsvWithBom(
        'ibonda-properties-report.csv',
        [t.properties.form.ref, t.properties.form.title, t.properties.form.price, t.properties.views, t.properties.form.status],
        properties.map((p) => [
          p.ref,
          p.title,
          formatMAD(p.price, language),
          p.views,
          t.propertyStatuses[p.status],
        ])
      );
    } else {
      downloadCsvWithBom(
        `ibonda-${activeTab}-report.csv`,
        [t.leads.columns.name, t.leads.columns.city, t.leads.columns.budget, t.leads.columns.source, t.leads.columns.status],
        leads.map((l) => [
          l.name,
          l.city,
          formatMAD(l.budget, language),
          t.leadSources[l.source],
          t.leadStatuses[l.status],
        ])
      );
    }
    pushToast({ type: 'success', title: t.toasts.exported });
  };

  return (
    <div className="space-y-5">
      {/* Header & Exports */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.reports.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.reports.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 h-9 text-xs card-surface">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="font-mono-num focus:outline-none text-zinc-950"
            />
            <span className="text-zinc-400">–</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="font-mono-num focus:outline-none text-zinc-950"
            />
          </div>

          <button
            type="button"
            onClick={handleExportExcelCsv}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-secondary"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t.app.exportExcel}</span>
          </button>

          <button
            type="button"
            onClick={triggerPrintPdfReport}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-primary"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{t.app.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-zinc-200 card-surface rounded-2xl no-print">
        {(['leads', 'appointments', 'properties', 'team', 'sales'] as ReportTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? 'btn-primary'
                : 'text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            {t.reports.tabs[tab]}
          </button>
        ))}
      </div>

      {/* Leads Report */}
      {activeTab === 'leads' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#F3F8FB] to-[#E6F1F6] border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#0B3B4E]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
                  {t.reports.leadsSection.totalLeads}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{leadStats.total}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF9F5] to-[#FFEDE2] border border-[#F7CFB6] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#EA580C]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
                  {t.reports.leadsSection.newLeads}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{leadStats.newLeads}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#F3FCF7] to-[#E2F7EC] border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#059669]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                  {t.reports.leadsSection.conversionRate}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{leadStats.convRate}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#0B3B4E]" />
              <div className="px-5 py-3.5 bg-[#F3F8FB] border-b border-[#D5E5ED] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
                <h3 className="text-sm font-extrabold text-zinc-950">{t.reports.leadsSection.bySource}</h3>
              </div>
              <div className="p-5">
                <DonutDistributionChart
                  slices={leadStats.bySource
                    .filter((s) => s.count > 0)
                    .map((s, idx) => ({
                      label: s.label,
                      value: s.count,
                      color: ['#0B3B4E', '#EA580C', '#0284C7', '#16A34A', '#D97706', '#64748B'][idx % 6],
                    }))}
                  centerValue={leadStats.total}
                  centerLabel={t.reports.leadsSection.totalLeads}
                />
              </div>
            </div>

            <div className="bg-white border border-[#F7CFB6] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#EA580C]" />
              <div className="px-5 py-3.5 bg-[#FFF8F3] border-b border-[#F8DEC9] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
                <h3 className="text-sm font-extrabold text-zinc-950">{t.reports.leadsSection.byEmployee}</h3>
              </div>
              <div className="p-5">
                <BarComparisonChart
                  data={leadStats.byEmployee.map((e) => ({
                    label: e.name.split(' ')[0],
                    value: e.count,
                  }))}
                  primaryLabel={t.reports.leadsSection.totalLeads}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments Report */}
      {activeTab === 'appointments' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#F3F8FB] to-[#E6F1F6] border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#0B3B4E]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
                  {t.reports.appointmentsSection.total}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{aptStats.total}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#F3F9FF] to-[#E3F1FD] border border-[#BADAF6] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#0284C7]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                  {t.reports.appointmentsSection.completed}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{aptStats.completed}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#F3FCF7] to-[#E2F7EC] border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#059669]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                  {t.reports.appointmentsSection.attendanceRate}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{aptStats.attendanceRate}%</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF6F8] to-[#FFE7ED] border border-[#F5C5D0] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#E11D48]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#E11D48]" />
                  {t.reports.appointmentsSection.absenceRate}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{aptStats.absenceRate}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#BADAF6] card-surface rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-[#0284C7]" />
            <div className="px-5 py-3.5 bg-[#F3F9FF] border-b border-[#CDE4F9] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
              <h3 className="text-sm font-extrabold text-zinc-950">{t.reports.appointmentsSection.byEmployee}</h3>
            </div>
            <div className="p-5">
              <BarComparisonChart
                data={aptStats.byEmployee}
                primaryLabel={t.reports.appointmentsSection.total}
                secondaryLabel={t.appointments.stats.attended}
              />
            </div>
          </div>
        </div>
      )}

      {/* Properties Report */}
      {activeTab === 'properties' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#F3FCF7] to-[#E2F7EC] border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#059669]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                  {t.reports.propertiesSection.available}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{propStats.available}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFFDF4] to-[#FEF2C7] border border-[#F3D88B] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#D97706]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                  {t.reports.propertiesSection.reserved}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{propStats.reserved}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#F3F9FF] to-[#E3F1FD] border border-[#BADAF6] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#0284C7]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                  {t.reports.propertiesSection.sold}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{propStats.sold}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF9F5] to-[#FFEDE2] border border-[#F7CFB6] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#EA580C]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
                  {t.reports.propertiesSection.rented}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{propStats.rented}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#0B3B4E]" />
              <div className="px-5 py-3.5 border-b border-[#D5E5ED] bg-[#F3F8FB] flex items-center gap-2 text-sm font-extrabold text-zinc-950">
                <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
                <span>{t.reports.propertiesSection.mostViewed}</span>
              </div>
              <table className="w-full text-xs text-start">
                <tbody className="divide-y divide-zinc-100">
                  {propStats.mostViewed.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50">
                      <td className="py-3 px-4 font-bold text-zinc-950">{p.title}</td>
                      <td className="py-3 px-4 font-mono-num text-zinc-500">{p.city}</td>
                      <td className="py-3 px-4 font-mono-num font-bold text-zinc-950 text-end">{p.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#059669]" />
              <div className="px-5 py-3.5 bg-[#F3FCF7] border-b border-[#CBEAD9] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#059669]" />
                <h3 className="text-sm font-extrabold text-zinc-950">{t.reports.propertiesSection.mostRequestedTypes}</h3>
              </div>
              <div className="p-5">
                <BarComparisonChart
                  data={propStats.byType}
                  primaryLabel={t.reports.leadsSection.totalLeads}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Performance Report */}
      {activeTab === 'team' && (
        <div className="bg-white border border-zinc-200 card-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-950 font-extrabold">
                  <th className="py-3 px-4 text-start">{t.reports.teamSection.employee}</th>
                  <th className="py-3 px-4 text-start">{t.team.form.role}</th>
                  <th className="py-3 px-4 text-start">{t.reports.teamSection.leadsHandled}</th>
                  <th className="py-3 px-4 text-start">{t.reports.teamSection.visitsCompleted}</th>
                  <th className="py-3 px-4 text-start">{t.reports.teamSection.attendanceRate}</th>
                  <th className="py-3 px-4 text-start">{t.reports.teamSection.successfulDeals}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {teamRows.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50/90">
                    <td className="py-3 px-4 font-bold text-zinc-950">{row.name}</td>
                    <td className="py-3 px-4 text-zinc-600">{row.role}</td>
                    <td className="py-3 px-4 font-mono-num font-semibold text-zinc-900">{row.leadsHandled}</td>
                    <td className="py-3 px-4 font-mono-num font-semibold text-zinc-900">{row.visitsCompleted}</td>
                    <td className="py-3 px-4 font-mono-num font-bold text-emerald-700">
                      {row.attendanceRate}%
                    </td>
                    <td className="py-3 px-4 font-mono-num font-extrabold text-zinc-950">{row.deals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Report */}
      {activeTab === 'sales' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#F3F8FB] to-[#E6F1F6] border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#0B3B4E]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
                  {t.reports.salesSection.successfulTransactions}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{salesStats.count}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF9F5] to-[#FFEDE2] border border-[#F7CFB6] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#EA580C]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
                  {t.reports.salesSection.totalRevenue}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">
                  {formatMAD(salesStats.revenue, language)}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#F3FCF7] to-[#E2F7EC] border border-[#B6E3CD] card-surface rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-[#059669]" />
              <div className="p-4.5">
                <div className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                  {t.reports.salesSection.conversionRate}
                </div>
                <div className="text-xl font-bold font-mono-num text-zinc-950 mt-1.5">{salesStats.convRate}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#BDD6E2] card-surface rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-[#0B3B4E]" />
            <div className="px-5 py-3.5 bg-[#F3F8FB] border-b border-[#D5E5ED] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0B3B4E]" />
              <h3 className="text-sm font-extrabold text-zinc-950">{t.reports.salesSection.monthlyPerformance}</h3>
            </div>
            <div className="p-5">
              <BarComparisonChart
                data={salesStats.monthly}
                primaryLabel={t.reports.salesSection.totalRevenue}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
