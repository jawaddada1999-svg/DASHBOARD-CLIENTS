import React, { useMemo, useState } from 'react';
import { Edit3, Mail, Phone, Plus, Shield, UserCheck, UserX } from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { Employee, EmployeePermissions, EmployeeRole } from '../../types/domain';
import { Avatar, Drawer, Modal, StatusLabel } from '../ui/DataPrimitives';

const roleCardAccent: Record<
  EmployeeRole,
  { card: string; topBar: string; headerBg: string; rolePill: string }
> = {
  agency_manager: {
    card: 'border-[#BDD6E2] hover:border-[#8BB6CA]',
    topBar: 'bg-[#0B3B4E]',
    headerBg: 'bg-[#F3F8FB] border-[#D5E5ED]',
    rolePill: 'bg-[#0B3B4E] text-white',
  },
  sales_manager: {
    card: 'border-[#F7CFB6] hover:border-[#EEAE86]',
    topBar: 'bg-[#EA580C]',
    headerBg: 'bg-[#FFF8F3] border-[#F8DEC9]',
    rolePill: 'bg-[#EA580C] text-white',
  },
  real_estate_advisor: {
    card: 'border-[#BADAF6] hover:border-[#85C0F0]',
    topBar: 'bg-[#0284C7]',
    headerBg: 'bg-[#F3F9FF] border-[#CDE4F9]',
    rolePill: 'bg-[#0284C7] text-white',
  },
  receptionist: {
    card: 'border-[#B4E0DE] hover:border-[#7CC7C4]',
    topBar: 'bg-[#0F766E]',
    headerBg: 'bg-[#F2FBFB] border-[#CBECEB]',
    rolePill: 'bg-[#0F766E] text-white',
  },
  custom: {
    card: 'border-zinc-300 hover:border-zinc-400',
    topBar: 'bg-zinc-700',
    headerBg: 'bg-zinc-50 border-zinc-200',
    rolePill: 'bg-zinc-700 text-white',
  },
};

export const TeamSection: React.FC = () => {
  const {
    t,
    employees,
    leads,
    appointments,
    addEmployee,
    updateEmployee,
    openLeadProfile,
    pushToast,
  } = useAgency();

  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+212 6');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState<EmployeeRole>('real_estate_advisor');
  const [active, setActive] = useState(true);

  const filteredEmployees = useMemo(
    () => employees.filter((e) => roleFilter === 'all' || e.role === roleFilter),
    [employees, roleFilter]
  );

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmpId) ?? null,
    [employees, selectedEmpId]
  );

  const getEmployeeMetrics = (empId: string) => {
    const empLeads = leads.filter((l) => l.assigned_employee_id === empId);
    const empApts = appointments.filter((a) => a.employee_id === empId);
    const scheduled = empApts.filter((a) => a.status === 'scheduled' || a.status === 'confirmed').length;
    const attended = empApts.filter((a) => a.status === 'attended').length;
    const noShow = empApts.filter((a) => a.status === 'no_show').length;
    const completed = attended + noShow;
    const attendanceRate = completed ? Math.round((attended / completed) * 100) : 100;
    return {
      assignedLeads: empLeads.length,
      scheduled,
      completed,
      attendanceRate,
    };
  };

  const openModalFor = (emp?: Employee) => {
    if (emp) {
      setEditingEmp(emp);
      setName(emp.name);
      setPhone(emp.phone);
      setEmail(emp.email);
      setJobTitle(emp.job_title);
      setRole(emp.role);
      setActive(emp.active);
    } else {
      setEditingEmp(null);
      setName('');
      setPhone('+212 6');
      setEmail('');
      setJobTitle('');
      setRole('real_estate_advisor');
      setActive(true);
    }
    setEmpModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      pushToast({ type: 'warning', title: t.app.requiredField });
      return;
    }

    if (editingEmp) {
      updateEmployee(editingEmp.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        job_title: jobTitle.trim(),
        role,
        active,
      });
    } else {
      addEmployee({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        job_title: jobTitle.trim() || t.employeeRoles[role],
        role,
        active,
        avatar: '',
        permissions: {
          manage_leads: true,
          manage_properties: role !== 'receptionist',
          manage_appointments: true,
          view_reports: role === 'agency_manager' || role === 'sales_manager',
          manage_team: role === 'agency_manager',
          manage_settings: role === 'agency_manager',
          export_data: role === 'agency_manager' || role === 'sales_manager',
        },
      });
    }
    setEmpModalOpen(false);
  };

  const togglePermission = (emp: Employee, key: keyof EmployeePermissions) => {
    updateEmployee(emp.id, {
      permissions: {
        ...emp.permissions,
        [key]: !emp.permissions[key],
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.team.title}</h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.team.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 text-xs font-semibold border border-zinc-200 rounded-xl bg-white text-zinc-950"
          >
            <option value="all">{t.app.all}</option>
            {(Object.keys(t.employeeRoles) as EmployeeRole[]).map((r) => (
              <option key={r} value={r}>{t.employeeRoles[r]}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => openModalFor()}
            className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.team.addEmployee}</span>
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => {
          const metrics = getEmployeeMetrics(emp.id);
          const accent = roleCardAccent[emp.role];
          return (
            <div
              key={emp.id}
              className={`bg-white border card-surface rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md ${accent.card}`}
            >
              <div className={`h-1 w-full ${accent.topBar}`} />
              {/* Card Header */}
              <div className={`p-4 border-b flex items-start justify-between gap-3 ${accent.headerBg}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={emp.name} src={emp.avatar} size="lg" />
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedEmpId(emp.id)}
                      className="text-sm font-bold text-zinc-950 hover:underline truncate block"
                    >
                      {emp.name}
                    </button>
                    <div className="text-xs text-zinc-600 truncate">{emp.job_title}</div>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${accent.rolePill}`}>
                      {t.employeeRoles[emp.role]}
                    </span>
                  </div>
                </div>
                <StatusLabel
                  label={emp.active ? t.team.activeAccount : t.team.inactiveAccount}
                  tone={emp.active ? 'success' : 'neutral'}
                />
              </div>

              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex items-center gap-2 font-mono-num" dir="ltr">
                    <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>

                {/* Harmonious Metric Tiles */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-[#F3F8FB] border border-[#CBE0EA] rounded-xl p-2.5">
                    <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0B3B4E]" />
                      {t.team.assignedLeadsCount}
                    </span>
                    <span className="text-base font-extrabold text-zinc-950 font-mono-num mt-0.5 block">{metrics.assignedLeads}</span>
                  </div>
                  <div className="bg-[#FFF8F3] border border-[#F7D7C2] rounded-xl p-2.5">
                    <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
                      {t.team.scheduledVisitsCount}
                    </span>
                    <span className="text-base font-extrabold text-zinc-950 font-mono-num mt-0.5 block">{metrics.scheduled}</span>
                  </div>
                  <div className="bg-[#F3F9FF] border border-[#C6E1F8] rounded-xl p-2.5">
                    <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                      {t.team.completedVisitsCount}
                    </span>
                    <span className="text-base font-extrabold text-zinc-950 font-mono-num mt-0.5 block">{metrics.completed}</span>
                  </div>
                  <div className="bg-[#F3FCF7] border border-[#BFE6D2] rounded-xl p-2.5">
                    <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                      {t.team.attendanceRate}
                    </span>
                    <span className="text-base font-extrabold text-zinc-950 font-mono-num mt-0.5 block">{metrics.attendanceRate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setSelectedEmpId(emp.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold btn-secondary"
                  >
                    {t.team.profile.title}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openModalFor(emp)}
                      className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center transition-colors"
                      title={t.app.edit}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateEmployee(emp.id, { active: !emp.active })}
                      className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 inline-flex items-center justify-center transition-colors"
                      title={emp.active ? t.team.deactivate : t.team.activate}
                    >
                      {emp.active ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee Profile Drawer */}
      <Drawer
        open={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmpId(null)}
        title={selectedEmployee?.name ?? ''}
        subtitle={selectedEmployee?.job_title ?? ''}
        dir={t.app.dir}
      >
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar name={selectedEmployee.name} src={selectedEmployee.avatar} size="lg" />
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedEmployee.name}</div>
                  <div className="text-xs text-slate-500">{t.employeeRoles[selectedEmployee.role]}</div>
                  <div className="text-xs text-slate-500 font-mono-num mt-0.5" dir="ltr">
                    {selectedEmployee.phone} · {selectedEmployee.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateEmployee(selectedEmployee.id, { active: !selectedEmployee.active })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:bg-slate-50"
              >
                {selectedEmployee.active ? t.team.deactivate : t.team.activate}
              </button>
            </div>

            {/* Permissions Management */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Shield className="h-4 w-4 text-slate-500" />
                <span>{t.team.profile.permissions}</span>
              </div>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                {(Object.keys(selectedEmployee.permissions) as (keyof EmployeePermissions)[]).map((permKey) => (
                  <label
                    key={permKey}
                    className="flex items-center justify-between px-4 py-2.5 text-xs cursor-pointer hover:bg-slate-50"
                  >
                    <span className="text-slate-700">{t.team.permissionsLabels[permKey]}</span>
                    <input
                      type="checkbox"
                      checked={selectedEmployee.permissions[permKey]}
                      onChange={() => togglePermission(selectedEmployee, permKey)}
                      className="h-4 w-4 accent-[#0B3B4E]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Assigned Leads */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">{t.team.profile.assignedLeadsList}</h4>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                {leads.filter((l) => l.assigned_employee_id === selectedEmployee.id).length === 0 ? (
                  <div className="p-4 text-xs text-slate-400">{t.app.noData}</div>
                ) : (
                  leads
                    .filter((l) => l.assigned_employee_id === selectedEmployee.id)
                    .map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => openLeadProfile(l.id)}
                        className="w-full text-start px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50"
                      >
                        <span className="font-semibold text-slate-900">{l.name}</span>
                        <StatusLabel label={t.leadStatuses[l.status]} leadStatus={l.status} />
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">{t.team.profile.recentActivities}</h4>
              <div className="space-y-2">
                {selectedEmployee.recent_activities.length === 0 ? (
                  <p className="text-xs text-slate-400">{t.app.noData}</p>
                ) : (
                  selectedEmployee.recent_activities.map((act) => (
                    <div key={act.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-900">{act.action}</span>
                        <span className="text-[11px] text-slate-400">{act.timestamp}</span>
                      </div>
                      <div className="text-slate-600 mt-0.5">{act.target}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add / Edit Employee Modal */}
      <Modal
        open={empModalOpen}
        onClose={() => setEmpModalOpen(false)}
        title={editingEmp ? t.team.editEmployee : t.team.addEmployee}
        size="md"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.team.form.name} *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t.team.form.phone}</label>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t.team.form.email} *</label>
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t.team.form.jobTitle}</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">{t.team.form.role}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as EmployeeRole)}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
              >
                {(Object.keys(t.employeeRoles) as EmployeeRole[]).map((r) => (
                  <option key={r} value={r}>{t.employeeRoles[r]}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-[#0B3B4E]"
            />
            <span>{t.team.form.active}</span>
          </label>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEmpModalOpen(false)}
              className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-lg"
            >
              {t.app.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg"
              style={{ backgroundColor: 'var(--agency-primary)' }}
            >
              {t.app.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
