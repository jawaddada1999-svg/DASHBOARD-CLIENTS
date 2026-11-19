import React, { useMemo, useState } from 'react';
import {
  CalendarPlus,
  CheckCheck,
  ExternalLink,
  Info,
  MessageSquare,
  Search,
  Send,
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { formatMAD } from '../../i18n/translations';
import { ChannelType, LeadStatus } from '../../types/domain';
import { Avatar, EmptyState, StatusLabel } from '../ui/DataPrimitives';

const channelStyles: Record<ChannelType, string> = {
  whatsapp: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  instagram: 'text-orange-700 bg-orange-50 border-orange-200',
  facebook: 'text-sky-700 bg-sky-50 border-sky-200',
  website: 'text-slate-700 bg-slate-100 border-slate-200',
  other: 'text-slate-600 bg-slate-50 border-slate-200',
};

export const ConversationsSection: React.FC = () => {
  const {
    t,
    language,
    conversations,
    leads,
    properties,
    employees,
    selectedConversationId,
    setSelectedConversationId,
    sendConversationMessage,
    markConversationRead,
    updateLead,
    addLeadNote,
    openLeadProfile,
    openPropertyDetails,
    setPreselectedLeadForApt,
    setQuickModal,
  } = useAgency();

  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [quickNote, setQuickNote] = useState('');

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversations.filter((c) => {
      if (channelFilter !== 'all' && c.channel !== channelFilter) return false;
      if (employeeFilter !== 'all' && c.assigned_employee_id !== employeeFilter) return false;
      if (unreadOnly && c.unread_count === 0) return false;
      if (q && !`${c.customer_name} ${c.last_message}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [conversations, search, channelFilter, employeeFilter, unreadOnly]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) ?? filteredConversations[0] ?? null,
    [conversations, selectedConversationId, filteredConversations]
  );

  const relatedLead = useMemo(
    () => leads.find((l) => l.id === activeConversation?.lead_id) ?? null,
    [leads, activeConversation]
  );

  const relatedProperty = useMemo(
    () => properties.find((p) => p.id === relatedLead?.interested_property_id) ?? null,
    [properties, relatedLead]
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !replyText.trim()) return;
    sendConversationMessage(activeConversation.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-[19px] font-bold text-zinc-950">{t.conversations.title}</h2>
        <p className="text-xs text-zinc-600 font-medium mt-0.5">{t.conversations.subtitle}</p>
      </div>

      {/* Honest Integration Banner */}
      <div className="bg-white border border-zinc-200 card-surface rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs font-medium text-zinc-800">
        <Info className="h-4 w-4 text-[#0369A1] shrink-0" />
        <span>{t.conversations.integrationBanner}</span>
      </div>

      {/* 3-Pane Messaging Workspace */}
      <div className="bg-white border border-zinc-200 card-surface rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left / Start: Conversation List */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-e border-slate-200 flex flex-col">
          <div className="p-3 border-b border-slate-200 space-y-2.5">
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
            <div className="grid grid-cols-2 gap-2">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="h-8 px-2 text-[11px] border border-slate-200 rounded-lg bg-white"
              >
                <option value="all">{t.conversations.allChannels}</option>
                {(Object.keys(t.channels) as ChannelType[]).map((ch) => (
                  <option key={ch} value={ch}>{t.channels[ch]}</option>
                ))}
              </select>
              <select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="h-8 px-2 text-[11px] border border-slate-200 rounded-lg bg-white"
              >
                <option value="all">{t.leads.filters.allEmployees}</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="h-3.5 w-3.5 accent-[#0B3B4E]"
              />
              <span>{t.conversations.unreadOnly}</span>
            </label>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredConversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              const emp = employees.find((e) => e.id === conv.assigned_employee_id);
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setSelectedConversationId(conv.id);
                    if (conv.unread_count > 0) markConversationRead(conv.id);
                  }}
                  className={`w-full text-start p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-slate-100/90' : 'hover:bg-slate-50'
                  }`}
                >
                  <Avatar name={conv.customer_name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-950 truncate">
                        {conv.customer_name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-num shrink-0">
                        {conv.last_message_time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {conv.last_message || '—'}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                            channelStyles[conv.channel]
                          }`}
                        >
                          {t.channels[conv.channel]}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">{emp?.name}</span>
                      </div>
                      {conv.unread_count > 0 && (
                        <span
                          className="h-4 min-w-[16px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                          style={{ backgroundColor: 'var(--agency-accent)' }}
                        >
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Message Thread */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-e border-slate-200 flex flex-col bg-slate-50/40">
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title={t.conversations.noConversationSelected}
              />
            </div>
          ) : (
            <>
              <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={activeConversation.customer_name} size="sm" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-950 truncate">
                      {activeConversation.customer_name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {t.channels[activeConversation.channel]}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => markConversationRead(activeConversation.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>{t.conversations.markAsRead}</span>
                </button>
              </div>

              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[460px]">
                {activeConversation.messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          isAgent
                            ? 'text-white'
                            : 'bg-white border border-slate-200 text-slate-800'
                        }`}
                        style={isAgent ? { backgroundColor: 'var(--agency-primary)' } : undefined}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono-num">
                        {msg.sender_name} · {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t.conversations.replyPlaceholder}
                  className="flex-1 h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500"
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 btn-accent"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{t.conversations.send}</span>
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right / End: Customer Context Panel */}
        <div className="lg:col-span-3 p-4 space-y-4 bg-white">
          {relatedLead ? (
            <>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold text-zinc-950">{t.conversations.customerPanel}</h3>
                <button
                  type="button"
                  onClick={() => openLeadProfile(relatedLead.id)}
                  className="text-[11px] font-semibold inline-flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--agency-primary)' }}
                >
                  <span>{t.conversations.openFullProfile}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-zinc-950">{relatedLead.name}</div>
                <div className="font-mono-num text-zinc-600" dir="ltr">{relatedLead.phone}</div>
                <div className="text-zinc-500">{relatedLead.city} · {formatMAD(relatedLead.budget, language)}</div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {t.conversations.leadStatus}
                </label>
                <select
                  value={relatedLead.status}
                  onChange={(e) => updateLead(relatedLead.id, { status: e.target.value as LeadStatus })}
                  className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {(Object.keys(t.leadStatuses) as LeadStatus[]).map((st) => (
                    <option key={st} value={st}>{t.leadStatuses[st]}</option>
                  ))}
                </select>
                <div className="mt-2">
                  <StatusLabel label={t.leadStatuses[relatedLead.status]} leadStatus={relatedLead.status} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {t.conversations.assignedEmployee}
                </label>
                <select
                  value={relatedLead.assigned_employee_id}
                  onChange={(e) =>
                    updateLead(relatedLead.id, { assigned_employee_id: e.target.value })
                  }
                  className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              {relatedProperty && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-1">
                  <div className="text-[11px] text-slate-500">{t.conversations.interestedProperty}</div>
                  <button
                    type="button"
                    onClick={() => openPropertyDetails(relatedProperty.id)}
                    className="text-xs font-bold text-slate-900 hover:underline text-start block"
                  >
                    {relatedProperty.title}
                  </button>
                  <div className="text-xs font-mono-num text-slate-700">
                    {formatMAD(relatedProperty.price, language)}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setPreselectedLeadForApt(relatedLead.id);
                  setQuickModal('appointment');
                }}
                className="w-full h-9 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 btn-primary"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                <span>{t.conversations.bookVisit}</span>
              </button>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-800">{t.conversations.internalNotes}</div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    placeholder={t.leads.profile.addNotePlaceholder}
                    className="flex-1 h-8 px-2.5 text-xs border border-slate-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addLeadNote(relatedLead.id, quickNote);
                      setQuickNote('');
                    }}
                    className="h-8 px-2.5 text-xs font-semibold bg-slate-900 text-white rounded-lg"
                  >
                    {t.app.add}
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {relatedLead.notes.map((n) => (
                    <div key={n.id} className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2">
                      <div className="font-semibold text-slate-800">{n.author_name}</div>
                      <div className="text-slate-600">{n.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400 py-8 text-center">{t.app.noData}</div>
          )}
        </div>
      </div>
    </div>
  );
};
