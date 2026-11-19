import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  Info,
  MessageCircle,
  Phone,
  Snowflake,
  Sun,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import {
  AppointmentStatus,
  ContactMethod,
  LeadClassification,
  LeadStatus,
  PropertyStatus,
  ToastMessage,
} from '../../types/domain';
import { buildTelHref, buildWhatsAppHref } from '../../utils/contactLinks';

export const SafeImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 ${className}`}
        aria-label={alt}
      >
        <Building2 className="h-7 w-7 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export const Avatar: React.FC<{
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ name, src, size = 'md' }) => {
  const [failed, setFailed] = useState(false);
  const sizeClass =
    size === 'sm'
      ? 'h-8 w-8 text-xs'
      : size === 'lg'
        ? 'h-14 w-14 text-lg'
        : 'h-10 w-10 text-sm';

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${sizeClass} rounded-full object-cover border border-slate-200 shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
      style={{ backgroundColor: 'var(--agency-primary)' }}
    >
      {initials || 'IB'}
    </div>
  );
};

type SemanticTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';

const toneClasses: Record<SemanticTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-800 border-rose-200',
  accent: 'bg-orange-50 text-orange-800 border-orange-200',
};

const leadStatusTone: Record<LeadStatus, SemanticTone> = {
  new: 'info',
  visit_scheduled: 'accent',
  visited: 'success',
  no_show: 'danger',
  follow_up: 'warning',
  closed_won: 'success',
  not_interested: 'neutral',
  closed_lost: 'danger',
};

const propertyStatusTone: Record<PropertyStatus, SemanticTone> = {
  available: 'success',
  reserved: 'warning',
  sold: 'info',
  rented: 'accent',
  unavailable: 'neutral',
};

const appointmentStatusTone: Record<AppointmentStatus, SemanticTone> = {
  scheduled: 'info',
  confirmed: 'accent',
  attended: 'success',
  no_show: 'danger',
  cancelled: 'neutral',
  rescheduled: 'warning',
};

export const StatusLabel: React.FC<{
  label: string;
  tone?: SemanticTone;
  leadStatus?: LeadStatus;
  propertyStatus?: PropertyStatus;
  appointmentStatus?: AppointmentStatus;
}> = ({ label, tone, leadStatus, propertyStatus, appointmentStatus }) => {
  const resolvedTone: SemanticTone =
    tone ??
    (leadStatus
      ? leadStatusTone[leadStatus]
      : propertyStatus
        ? propertyStatusTone[propertyStatus]
        : appointmentStatus
          ? appointmentStatusTone[appointmentStatus]
          : 'neutral');

  const Icon =
    resolvedTone === 'success'
      ? CheckCircle2
      : resolvedTone === 'danger'
        ? XCircle
        : resolvedTone === 'warning' || resolvedTone === 'accent'
          ? Clock
          : Info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap ${toneClasses[resolvedTone]}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export const ClassificationBadge: React.FC<{
  classification: LeadClassification;
  label: string;
}> = ({ classification, label }) => {
  const styles: Record<LeadClassification, string> = {
    vip: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    hot: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
    warm: 'bg-orange-50 text-orange-800 border-orange-200 font-medium',
    cold: 'bg-sky-50 text-sky-800 border-sky-200 font-medium',
  };
  const Icon =
    classification === 'vip'
      ? Crown
      : classification === 'hot'
        ? Flame
        : classification === 'warm'
          ? Sun
          : Snowflake;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border whitespace-nowrap ${styles[classification]}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export const ContactMethodBadge: React.FC<{
  method: ContactMethod;
  label: string;
  phone?: string;
  message?: string;
  title?: string;
}> = ({ method, label, phone, message, title }) => {
  const isWtsp = method === 'whatsapp';
  const baseClass = `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border whitespace-nowrap transition-colors ${
    isWtsp
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : 'bg-sky-50 text-sky-800 border-sky-200'
  }`;

  if (phone && phone.trim()) {
    const href = isWtsp ? buildWhatsAppHref(phone, message) : buildTelHref(phone);
    return (
      <a
        href={href}
        target={isWtsp ? '_blank' : undefined}
        rel={isWtsp ? 'noopener noreferrer' : undefined}
        onClick={(e) => e.stopPropagation()}
        title={title ?? label}
        className={`${baseClass} cursor-pointer ${
          isWtsp
            ? 'hover:bg-emerald-100 hover:border-emerald-400'
            : 'hover:bg-sky-100 hover:border-sky-400'
        }`}
      >
        {isWtsp ? <MessageCircle className="h-3 w-3 shrink-0" /> : <Phone className="h-3 w-3 shrink-0" />}
        <span>{label}</span>
      </a>
    );
  }

  return (
    <span className={baseClass}>
      {isWtsp ? <MessageCircle className="h-3 w-3 shrink-0" /> : <Phone className="h-3 w-3 shrink-0" />}
      <span>{label}</span>
    </span>
  );
};

export type CardTone =
  | 'navy'
  | 'orange'
  | 'emerald'
  | 'sky'
  | 'amber'
  | 'rose'
  | 'teal'
  | 'indigo'
  | 'slate';

const kpiToneStyles: Record<
  CardTone,
  { cardBg: string; cardBorder: string; accentBar: string; iconBg: string; iconText: string }
> = {
  navy: {
    cardBg: 'bg-gradient-to-br from-[#F3F8FB] via-[#F7FAFC] to-[#E6F1F6]',
    cardBorder: 'border-[#BDD6E2] hover:border-[#8BB6CA]',
    accentBar: 'bg-[#0B3B4E]',
    iconBg: 'bg-[#0B3B4E] shadow-xs',
    iconText: 'text-white',
  },
  orange: {
    cardBg: 'bg-gradient-to-br from-[#FFF9F5] via-[#FFFCF9] to-[#FFEDE2]',
    cardBorder: 'border-[#F7CFB6] hover:border-[#EEAE86]',
    accentBar: 'bg-[#EA580C]',
    iconBg: 'bg-[#EA580C] shadow-xs',
    iconText: 'text-white',
  },
  emerald: {
    cardBg: 'bg-gradient-to-br from-[#F3FCF7] via-[#F8FEFB] to-[#E2F7EC]',
    cardBorder: 'border-[#B6E3CD] hover:border-[#7ECBA5]',
    accentBar: 'bg-[#059669]',
    iconBg: 'bg-[#059669] shadow-xs',
    iconText: 'text-white',
  },
  sky: {
    cardBg: 'bg-gradient-to-br from-[#F3F9FF] via-[#F8FCFF] to-[#E3F1FD]',
    cardBorder: 'border-[#BADAF6] hover:border-[#85C0F0]',
    accentBar: 'bg-[#0284C7]',
    iconBg: 'bg-[#0284C7] shadow-xs',
    iconText: 'text-white',
  },
  teal: {
    cardBg: 'bg-gradient-to-br from-[#F2FBFB] via-[#F7FDFD] to-[#E0F5F4]',
    cardBorder: 'border-[#B4E0DE] hover:border-[#7CC7C4]',
    accentBar: 'bg-[#0F766E]',
    iconBg: 'bg-[#0F766E] shadow-xs',
    iconText: 'text-white',
  },
  amber: {
    cardBg: 'bg-gradient-to-br from-[#FFFDF4] via-[#FFFEFA] to-[#FEF2C7]',
    cardBorder: 'border-[#F3D88B] hover:border-[#E7BE4C]',
    accentBar: 'bg-[#D97706]',
    iconBg: 'bg-[#D97706] shadow-xs',
    iconText: 'text-white',
  },
  rose: {
    cardBg: 'bg-gradient-to-br from-[#FFF6F8] via-[#FFF9FA] to-[#FFE7ED]',
    cardBorder: 'border-[#F5C5D0] hover:border-[#EB95A9]',
    accentBar: 'bg-[#E11D48]',
    iconBg: 'bg-[#E11D48] shadow-xs',
    iconText: 'text-white',
  },
  indigo: {
    cardBg: 'bg-gradient-to-br from-[#F5F7FF] via-[#F9FAFF] to-[#E8ECFD]',
    cardBorder: 'border-[#C5CEF6] hover:border-[#96A7ED]',
    accentBar: 'bg-[#4338CA]',
    iconBg: 'bg-[#4338CA] shadow-xs',
    iconText: 'text-white',
  },
  slate: {
    cardBg: 'bg-gradient-to-br from-[#F7F8FA] via-[#FAFAFB] to-[#ECEEF2]',
    cardBorder: 'border-[#D1D5DB] hover:border-[#9CA3AF]',
    accentBar: 'bg-zinc-900',
    iconBg: 'bg-zinc-900 shadow-xs',
    iconText: 'text-white',
  },
};

export const KpiCard: React.FC<{
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  tone?: CardTone;
}> = ({ title, value, delta, deltaLabel, icon, tone = 'navy' }) => {
  const isPositive = (delta ?? 0) >= 0;
  const styles = kpiToneStyles[tone];

  return (
    <div
      className={`${styles.cardBg} rounded-2xl border ${styles.cardBorder} overflow-hidden card-surface flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className={`h-1 w-full ${styles.accentBar}`} />
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2.5">
          <span className="font-display text-[12px] font-semibold text-zinc-950 leading-snug pt-0.5">
            {title}
          </span>
          <div
            className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconText}`}
          >
            {icon}
          </div>
        </div>

        <div>
          <div className="font-display text-xl sm:text-[22px] font-bold tabular-nums tracking-tight text-zinc-950">
            {value}
          </div>
          {typeof delta === 'number' && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-bold tabular-nums px-1.5 py-0.5 rounded-md border ${
                  isPositive
                    ? 'bg-white/85 text-emerald-700 border-emerald-200'
                    : 'bg-white/85 text-rose-700 border-rose-200'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? '+' : ''}
                {delta}%
              </span>
              {deltaLabel && <span className="text-zinc-700 font-medium truncate">{deltaLabel}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}> = ({ open, onClose, title, subtitle, size = 'lg', children }) => {
  if (!open) return null;
  const maxWidth =
    size === 'md' ? 'max-w-lg' : size === 'xl' ? 'max-w-4xl' : 'max-w-2xl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-zinc-200 bg-zinc-50/70">
          <div>
            <h3 className="text-[15px] font-bold text-zinc-950">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-600 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export const Drawer: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  dir?: 'rtl' | 'ltr';
  children: React.ReactNode;
}> = ({ open, onClose, title, subtitle, dir = 'rtl', children }) => {
  if (!open) return null;
  const sideClass = dir === 'rtl' ? 'left-0 border-r' : 'right-0 border-l';

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={`fixed top-0 bottom-0 ${sideClass} border-zinc-200 bg-white w-full max-w-2xl shadow-2xl flex flex-col z-10`}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-zinc-200 bg-zinc-50/70">
          <div>
            <h3 className="text-[15px] font-bold text-zinc-950">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-600 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, description, confirmLabel, cancelLabel, danger = true, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onCancel} title={title} size="md">
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 rounded-xl shrink-0 border ${
            danger ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-zinc-800 leading-relaxed pt-1">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold rounded-xl btn-outline"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all ${
            danger ? 'bg-rose-600 hover:bg-rose-700' : 'btn-primary'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="bg-white border border-zinc-200 card-surface rounded-2xl py-12 px-6 text-center flex flex-col items-center justify-center">
    <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-950 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h4 className="text-sm font-extrabold text-zinc-950">{title}</h4>
    {description && <p className="text-xs text-zinc-600 mt-1 max-w-md">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const PaginationBar: React.FC<{
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  showingLabel: string;
  ofLabel: string;
  itemsLabel: string;
  prevLabel: string;
  nextLabel: string;
  onPageChange: (page: number) => void;
}> = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  showingLabel,
  ofLabel,
  itemsLabel,
  prevLabel,
  nextLabel,
  onPageChange,
}) => {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-zinc-200 bg-zinc-50/70 text-xs text-zinc-800">
      <div className="tabular-nums font-medium">
        {showingLabel} <span className="font-bold text-zinc-950">{start}–{end}</span> {ofLabel}{' '}
        <span className="font-bold text-zinc-950">{totalItems}</span> {itemsLabel}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg btn-outline text-xs font-bold disabled:opacity-45 disabled:pointer-events-none"
        >
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
          <span>{prevLabel}</span>
        </button>
        <span className="px-3 py-1 rounded-lg bg-white border border-zinc-200 font-bold text-zinc-950 tabular-nums">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg btn-outline text-xs font-bold disabled:opacity-45 disabled:pointer-events-none"
        >
          <span>{nextLabel}</span>
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 end-5 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold">{toast.title}</div>
              {toast.description && (
                <div className="text-xs text-slate-300 mt-0.5">{toast.description}</div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
