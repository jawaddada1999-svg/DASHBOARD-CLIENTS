import React, { useMemo, useState } from 'react';
import {
  Bell,
  Briefcase,
  Building2,
  CalendarPlus,
  ChevronDown,
  Globe,
  Menu,
  Plus,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { formatMAD } from '../../i18n/translations';
import { Language } from '../../types/domain';
import { Avatar } from '../ui/DataPrimitives';

export const TopHeader: React.FC<{
  onOpenMobileMenu: () => void;
}> = ({ onOpenMobileMenu }) => {
  const {
    t,
    language,
    setLanguage,
    activeSection,
    settings,
    leads,
    properties,
    owners,
    employees,
    notifications,
    markNotificationRead,
    setActiveSection,
    setSelectedOwnerId,
    openLeadProfile,
    openPropertyDetails,
    setQuickModal,
    currentUser,
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { leads: [], properties: [], owners: [], employees: [] };
    return {
      leads: leads
        .filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.phone.toLowerCase().includes(q) ||
            l.city.toLowerCase().includes(q)
        )
        .slice(0, 4),
      properties: properties
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.ref.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q)
        )
        .slice(0, 4),
      owners: owners
        .filter(
          (o) =>
            o.name.toLowerCase().includes(q) ||
            o.phone.toLowerCase().includes(q) ||
            o.city.toLowerCase().includes(q) ||
            o.national_id.toLowerCase().includes(q)
        )
        .slice(0, 4),
      employees: employees
        .filter(
          (e) =>
            e.name.toLowerCase().includes(q) || e.job_title.toLowerCase().includes(q)
        )
        .slice(0, 3),
    };
  }, [searchQuery, leads, properties, owners, employees]);

  const hasResults =
    searchResults.leads.length > 0 ||
    searchResults.properties.length > 0 ||
    searchResults.owners.length > 0 ||
    searchResults.employees.length > 0;

  const contextualAction = useMemo(() => {
    if (activeSection === 'properties') {
      return {
        label: t.properties.addProperty,
        icon: Plus,
        onClick: () => setQuickModal('property'),
      };
    }
    if (activeSection === 'owners') {
      return {
        label: t.owners.addOwner,
        icon: Briefcase,
        onClick: () => setQuickModal('owner'),
      };
    }
    if (activeSection === 'appointments') {
      return {
        label: t.appointments.newAppointment,
        icon: CalendarPlus,
        onClick: () => setQuickModal('appointment'),
      };
    }
    return {
      label: t.leads.addLead,
      icon: UserPlus,
      onClick: () => setQuickModal('lead'),
    };
  }, [activeSection, t, setQuickModal]);

  const ActionIcon = contextualAction.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-zinc-200 px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      {/* Left / Start: Mobile Toggle + Breadcrumb & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg border border-zinc-200 text-zinc-800 hover:bg-zinc-100"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 whitespace-nowrap">
            <span>{settings.name}</span>
            <span>/</span>
            <span className="text-zinc-950 font-bold">{t.nav[activeSection]}</span>
          </div>
          <h1 className="text-base lg:text-[17px] font-bold text-zinc-950 truncate">
            {t.nav[activeSection]}
          </h1>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:block relative flex-1 max-w-md">
        <div className="relative">
          <Search className="h-4 w-4 text-zinc-500 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
            placeholder={t.app.searchPlaceholder}
            className="w-full h-9 ps-9 pe-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors"
          />
        </div>

        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-11 inset-x-0 bg-white border border-zinc-200 rounded-xl shadow-xl p-2 z-40 max-h-96 overflow-y-auto">
            {!hasResults ? (
              <div className="py-6 text-center text-xs text-zinc-500">
                {t.app.noSearchResults}
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.leads.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-semibold text-zinc-500">
                      {t.nav.leads}
                    </div>
                    {searchResults.leads.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onMouseDown={() => {
                          openLeadProfile(l.id);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 text-start text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Users className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                          <span className="font-semibold text-zinc-950 truncate">{l.name}</span>
                        </div>
                        <span className="text-zinc-500 font-mono-num shrink-0">{l.phone}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.properties.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-semibold text-zinc-500">
                      {t.nav.properties}
                    </div>
                    {searchResults.properties.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={() => {
                          openPropertyDetails(p.id);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 text-start text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                          <span className="font-semibold text-zinc-950 truncate">{p.title}</span>
                        </div>
                        <span className="text-zinc-700 font-mono-num shrink-0">
                          {formatMAD(p.price, language)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.owners.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-semibold text-zinc-500">
                      {t.nav.owners}
                    </div>
                    {searchResults.owners.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onMouseDown={() => {
                          setSelectedOwnerId(o.id);
                          setActiveSection('owners');
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 text-start text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Briefcase className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                          <span className="font-semibold text-zinc-950 truncate">{o.name}</span>
                        </div>
                        <span className="text-zinc-500 font-mono-num shrink-0">{o.phone}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.employees.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-semibold text-zinc-500">
                      {t.nav.team}
                    </div>
                    {searchResults.employees.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onMouseDown={() => {
                          setActiveSection('team');
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-50 text-start text-xs"
                      >
                        <span className="font-semibold text-zinc-950">{e.name}</span>
                        <span className="text-zinc-500">{e.job_title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right / End: Language Selector, Notifications, Contextual Action, User Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setLangOpen(!langOpen);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
            className="h-9 px-3 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap btn-outline"
          >
            <Globe className="h-3.5 w-3.5 text-zinc-950" />
            <span className="hidden sm:inline">{t.languages[language]}</span>
            <ChevronDown className="h-3 w-3 text-zinc-700" />
          </button>

          {langOpen && (
            <div className="absolute end-0 mt-1.5 w-36 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-40">
              {(['ar', 'en', 'fr'] as Language[]).map((langCode) => (
                <button
                  key={langCode}
                  type="button"
                  onClick={() => {
                    setLanguage(langCode);
                    setLangOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 text-xs hover:bg-zinc-50 flex items-center justify-between ${
                    language === langCode ? 'font-bold text-zinc-950 bg-zinc-50' : 'text-zinc-700'
                  }`}
                >
                  <span>{t.languages[langCode]}</span>
                  <span className="text-[10px] text-zinc-400 uppercase">{langCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Shortcut */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setLangOpen(false);
              setProfileOpen(false);
            }}
            className="relative h-9 w-9 rounded-xl btn-outline inline-flex items-center justify-center"
            aria-label={t.app.notificationsShortcut}
          >
            <Bell className="h-4 w-4 text-zinc-950" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -end-1 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center tabular-nums"
                style={{ backgroundColor: 'var(--agency-accent)' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute end-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/60">
                <span className="text-xs font-bold text-slate-900">{t.nav.notifications}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('notifications');
                    setNotifOpen(false);
                  }}
                  className="text-[11px] font-medium hover:underline"
                  style={{ color: 'var(--agency-primary)' }}
                >
                  {t.app.viewAll}
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      markNotificationRead(n.id);
                      setActiveSection(n.related_section);
                      setNotifOpen(false);
                    }}
                    className={`w-full text-start px-3.5 py-2.5 hover:bg-slate-50 transition-colors ${
                      !n.is_read ? 'bg-orange-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contextual Primary Action */}
        <button
          type="button"
          onClick={contextualAction.onClick}
          className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 btn-accent"
        >
          <ActionIcon className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{contextualAction.label}</span>
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setLangOpen(false);
              setNotifOpen(false);
            }}
            className="h-9 ps-1.5 pe-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center gap-2"
            aria-label={t.app.profileMenu}
          >
            <Avatar name={currentUser.name} src={currentUser.avatar} size="sm" />
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute end-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-40">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveSection('team');
                  setProfileOpen(false);
                }}
                className="w-full text-start px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                {t.nav.team}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSection('settings');
                  setProfileOpen(false);
                }}
                className="w-full text-start px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                {t.nav.settings}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
