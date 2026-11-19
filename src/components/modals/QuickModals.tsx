import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { MOROCCAN_CITIES, PRESET_PROPERTY_IMAGES } from '../../data/demoData';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  ContactMethod,
  DeliveryStatus,
  Lead,
  LeadClassification,
  LeadSource,
  LeadStatus,
  OwnerType,
  PaymentMethod,
  Property,
  PropertyOwner,
  PropertyStatus,
  PropertyType,
  TransactionType,
} from '../../types/domain';
import { Modal } from '../ui/DataPrimitives';
import {
  generateDayWorkingHours,
  getDayKeyFromIsoDate,
  getSlotAvailability,
} from '../../utils/scheduleUtils';

export const LeadFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  editingLead?: Lead | null;
}> = ({ open, onClose, editingLead }) => {
  const { t, employees, properties, addLead, updateLead, pushToast } = useAgency();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<LeadSource>('facebook_ads');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('whatsapp');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [bedrooms, setBedrooms] = useState('3');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('ready');
  const [desiredArea, setDesiredArea] = useState('140');
  const [classification, setClassification] = useState<LeadClassification>('warm');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [budget, setBudget] = useState('2500000');
  const [city, setCity] = useState('الدار البيضاء');
  const [district, setDistrict] = useState('');
  const [interestedPropertyId, setInterestedPropertyId] = useState<string>('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<string>(employees[0]?.id ?? '');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [preferences, setPreferences] = useState('');

  useEffect(() => {
    if (editingLead) {
      setName(editingLead.name);
      setPhone(editingLead.phone);
      setEmail(editingLead.email);
      setSource(editingLead.source);
      setContactMethod(editingLead.contact_method);
      setPaymentMethod(editingLead.payment_method);
      setBedrooms(String(editingLead.bedrooms));
      setDeliveryStatus(editingLead.delivery_status);
      setDesiredArea(String(editingLead.desired_area));
      setClassification(editingLead.classification);
      setPropertyType(editingLead.property_type);
      setTransactionType(editingLead.transaction_type);
      setBudget(String(editingLead.budget));
      setCity(editingLead.city);
      setDistrict(editingLead.district);
      setInterestedPropertyId(editingLead.interested_property_id ?? '');
      setAssignedEmployeeId(editingLead.assigned_employee_id);
      setStatus(editingLead.status);
      setPreferences(editingLead.preferences);
    } else {
      setName('');
      setPhone('+212 6');
      setEmail('');
      setSource('facebook_ads');
      setContactMethod('whatsapp');
      setPaymentMethod('cash');
      setBedrooms('3');
      setDeliveryStatus('ready');
      setDesiredArea('140');
      setClassification('warm');
      setPropertyType('apartment');
      setTransactionType('sale');
      setBudget('2500000');
      setCity('الدار البيضاء');
      setDistrict('');
      setInterestedPropertyId('');
      setAssignedEmployeeId(employees[1]?.id ?? employees[0]?.id ?? '');
      setStatus('new');
      setPreferences('');
    }
  }, [editingLead, open, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      pushToast({ type: 'warning', title: t.app.requiredField });
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      source,
      contact_method: contactMethod,
      payment_method: paymentMethod,
      bedrooms: Number(bedrooms) || 0,
      delivery_status: deliveryStatus,
      desired_area: Number(desiredArea) || 0,
      classification,
      property_type: propertyType,
      transaction_type: transactionType,
      budget: Number(budget) || 0,
      city: city.trim() || 'الدار البيضاء',
      district: district.trim(),
      interested_property_id: interestedPropertyId || null,
      assigned_employee_id: assignedEmployeeId,
      next_followup: editingLead?.next_followup ?? null,
      status,
      preferences: preferences.trim(),
    };

    if (editingLead) {
      updateLead(editingLead.id, payload);
    } else {
      addLead(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingLead ? t.leads.editLead : t.leads.addLead}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.name} *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.phone} *</label>
            <input
              type="text"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.email}</label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.transactionType}</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as TransactionType)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option value="sale">{t.transactionTypes.sale}</option>
              <option value="rent">{t.transactionTypes.rent}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.contactMethod}</label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.contactMethods) as ContactMethod[]).map((cm) => (
                <option key={cm} value={cm}>{t.contactMethods[cm]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.classification}</label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value as LeadClassification)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.leadClassifications) as LeadClassification[]).map((cl) => (
                <option key={cl} value={cl}>{t.leadClassifications[cl]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.propertyType}</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.propertyTypes) as PropertyType[]).map((pt) => (
                <option key={pt} value={pt}>{t.propertyTypes[pt]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.paymentMethod}</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.paymentMethods) as PaymentMethod[]).map((pm) => (
                <option key={pm} value={pm}>{t.paymentMethods[pm]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.deliveryStatus}</label>
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.deliveryStatuses) as DeliveryStatus[]).map((ds) => (
                <option key={ds} value={ds}>{t.deliveryStatuses[ds]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.bedrooms}</label>
            <input
              type="number"
              min={0}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.desiredArea}</label>
            <input
              type="number"
              min={0}
              value={desiredArea}
              onChange={(e) => setDesiredArea(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.budget}</label>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.city}</label>
            <select
              value={MOROCCAN_CITIES.includes(city) ? city : MOROCCAN_CITIES[0]}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {MOROCCAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.district}</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.source}</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as LeadSource)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.leadSources) as LeadSource[]).map((s) => (
                <option key={s} value={s}>{t.leadSources[s]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.interestedProperty}</label>
            <select
              value={interestedPropertyId}
              onChange={(e) => setInterestedPropertyId(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option value="">{t.leads.form.selectProperty}</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.ref} · {p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.assignedEmployee}</label>
            <select
              value={assignedEmployeeId}
              onChange={(e) => setAssignedEmployeeId(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.status}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.leadStatuses) as LeadStatus[]).map((st) => (
                <option key={st} value={st}>{t.leadStatuses[st]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">{t.leads.form.preferences}</label>
          <textarea
            rows={2}
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DCE9EF]">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-4 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.cancel}
          </button>
          <button
            type="submit"
            className="btn-primary px-5 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const PropertyFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  editingProperty?: Property | null;
}> = ({ open, onClose, editingProperty }) => {
  const { t, employees, owners, addProperty, updateProperty, pushToast } = useAgency();

  const [title, setTitle] = useState('');
  const [ref, setRef] = useState('');
  const [type, setType] = useState<PropertyType>('apartment');
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [price, setPrice] = useState('2200000');
  const [city, setCity] = useState('الدار البيضاء');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('140');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [status, setStatus] = useState<PropertyStatus>('available');
  const [ownerId, setOwnerId] = useState<string>('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+212 6');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(employees[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([PRESET_PROPERTY_IMAGES[1]]);

  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setRef(editingProperty.ref);
      setType(editingProperty.type);
      setTransactionType(editingProperty.transaction_type);
      setPrice(String(editingProperty.price));
      setCity(editingProperty.city);
      setDistrict(editingProperty.district);
      setAddress(editingProperty.address);
      setArea(String(editingProperty.area));
      setBedrooms(String(editingProperty.bedrooms));
      setBathrooms(String(editingProperty.bathrooms));
      setStatus(editingProperty.status);
      setOwnerId(editingProperty.owner_id ?? '');
      setOwnerName(editingProperty.owner_name);
      setOwnerPhone(editingProperty.owner_phone);
      setAssignedEmployeeId(editingProperty.assigned_employee_id);
      setDescription(editingProperty.description);
      setImages(editingProperty.images.length ? editingProperty.images : [PRESET_PROPERTY_IMAGES[1]]);
    } else {
      setTitle('');
      setRef(`ATL-${Math.floor(100 + Math.random() * 899)}`);
      setType('apartment');
      setTransactionType('sale');
      setPrice('2200000');
      setCity('الدار البيضاء');
      setDistrict('');
      setAddress('');
      setArea('140');
      setBedrooms('3');
      setBathrooms('2');
      setStatus('available');
      const firstOwner = owners[0];
      setOwnerId(firstOwner?.id ?? '');
      setOwnerName(firstOwner?.name ?? '');
      setOwnerPhone(firstOwner?.phone ?? '+212 6');
      setAssignedEmployeeId(employees[1]?.id ?? employees[0]?.id ?? '');
      setDescription('');
      setImages([PRESET_PROPERTY_IMAGES[1]]);
    }
  }, [editingProperty, open, employees, owners]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImages((prev) => [reader.result as string, ...prev]);
      }
    };
    reader.readAsDataURL(file);
  };

  const togglePreset = (img: string) => {
    setImages((prev) =>
      prev.includes(img) ? (prev.length > 1 ? prev.filter((i) => i !== img) : prev) : [...prev, img]
    );
  };

  const handleOwnerSelect = (selectedId: string) => {
    setOwnerId(selectedId);
    const matched = owners.find((o) => o.id === selectedId);
    if (matched) {
      setOwnerName(matched.name);
      setOwnerPhone(matched.phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !ref.trim()) {
      pushToast({ type: 'warning', title: t.app.requiredField });
      return;
    }

    const payload = {
      title: title.trim(),
      ref: ref.trim(),
      type,
      transaction_type: transactionType,
      price: Number(price) || 0,
      city: city.trim(),
      district: district.trim(),
      address: address.trim(),
      area: Number(area) || 0,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      status,
      owner_id: ownerId || undefined,
      owner_name: ownerName.trim(),
      owner_phone: ownerPhone.trim(),
      assigned_employee_id: assignedEmployeeId,
      description: description.trim(),
      images,
    };

    if (editingProperty) {
      updateProperty(editingProperty.id, payload);
    } else {
      addProperty(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingProperty ? t.properties.editProperty : t.properties.addProperty}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.title} *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.ref} *</label>
            <input
              type="text"
              required
              dir="ltr"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.type}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.propertyTypes) as PropertyType[]).map((pt) => (
                <option key={pt} value={pt}>{t.propertyTypes[pt]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.transactionType}</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as TransactionType)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option value="sale">{t.transactionTypes.sale}</option>
              <option value="rent">{t.transactionTypes.rent}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.price}</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.city}</label>
            <select
              value={MOROCCAN_CITIES.includes(city) ? city : MOROCCAN_CITIES[0]}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {MOROCCAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.district}</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.status}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PropertyStatus)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.propertyStatuses) as PropertyStatus[]).map((ps) => (
                <option key={ps} value={ps}>{t.propertyStatuses[ps]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.area}</label>
            <input
              type="number"
              min={0}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.bedrooms}</label>
            <input
              type="number"
              min={0}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.bathrooms}</label>
            <input
              type="number"
              min={0}
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.ownerSelect}</label>
            <select
              value={ownerId}
              onChange={(e) => handleOwnerSelect(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option value="">—</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.ownerName}</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.ownerPhone}</label>
            <input
              type="text"
              dir="ltr"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.address}</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.assignedEmployee}</label>
            <select
              value={assignedEmployeeId}
              onChange={(e) => setAssignedEmployeeId(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">{t.properties.form.description}</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs border border-slate-200 rounded-lg"
          />
        </div>

        {/* Images Upload & Preset Selector */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-800">{t.properties.form.images}</span>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              <span>{t.properties.form.uploadImageLabel}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <div className="text-[11px] text-slate-500">{t.properties.form.selectPresetImages}</div>
          <div className="grid grid-cols-4 gap-2.5">
            {PRESET_PROPERTY_IMAGES.map((img, i) => {
              const selected = images.includes(img);
              return (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => togglePreset(img)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    selected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Property preset" className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DCE9EF]">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-4 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.cancel}
          </button>
          <button
            type="submit"
            className="btn-primary px-5 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const OwnerFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  editingOwner?: PropertyOwner | null;
}> = ({ open, onClose, editingOwner }) => {
  const { t, addOwner, updateOwner, pushToast } = useAgency();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+212 6');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('الدار البيضاء');
  const [ownerType, setOwnerType] = useState<OwnerType>('individual');
  const [preferredContact, setPreferredContact] = useState<ContactMethod>('whatsapp');
  const [commissionRate, setCommissionRate] = useState('2.5');
  const [nationalId, setNationalId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingOwner) {
      setName(editingOwner.name);
      setPhone(editingOwner.phone);
      setEmail(editingOwner.email);
      setCity(editingOwner.city);
      setOwnerType(editingOwner.owner_type);
      setPreferredContact(editingOwner.preferred_contact);
      setCommissionRate(String(editingOwner.commission_rate));
      setNationalId(editingOwner.national_id);
      setNotes(editingOwner.notes);
    } else {
      setName('');
      setPhone('+212 6');
      setEmail('');
      setCity('الدار البيضاء');
      setOwnerType('individual');
      setPreferredContact('whatsapp');
      setCommissionRate('2.5');
      setNationalId('');
      setNotes('');
    }
  }, [editingOwner, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      pushToast({ type: 'warning', title: t.app.requiredField });
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim() || 'الدار البيضاء',
      owner_type: ownerType,
      preferred_contact: preferredContact,
      commission_rate: Number(commissionRate) || 0,
      national_id: nationalId.trim(),
      notes: notes.trim(),
    };

    if (editingOwner) {
      updateOwner(editingOwner.id, payload);
    } else {
      addOwner(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingOwner ? t.owners.editOwner : t.owners.addOwner}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.name} *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.phone} *</label>
            <input
              type="text"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.email}</label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.city}</label>
            <select
              value={MOROCCAN_CITIES.includes(city) ? city : MOROCCAN_CITIES[0]}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {MOROCCAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.ownerType}</label>
            <select
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value as OwnerType)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.ownerTypes) as OwnerType[]).map((ot) => (
                <option key={ot} value={ot}>{t.ownerTypes[ot]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.preferredContact}</label>
            <select
              value={preferredContact}
              onChange={(e) => setPreferredContact(e.target.value as ContactMethod)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.contactMethods) as ContactMethod[]).map((cm) => (
                <option key={cm} value={cm}>{t.contactMethods[cm]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.commissionRate}</label>
            <input
              type="number"
              step="0.5"
              min={0}
              max={100}
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.nationalId}</label>
            <input
              type="text"
              dir="ltr"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">{t.owners.form.notes}</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 text-xs border border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DCE9EF]">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-4 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.cancel}
          </button>
          <button
            type="submit"
            className="btn-primary px-5 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const AppointmentFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  editingAppointment?: Appointment | null;
  defaultLeadId?: string | null;
  defaultDate?: string;
  defaultTime?: string;
}> = ({ open, onClose, editingAppointment, defaultLeadId, defaultDate, defaultTime }) => {
  const { t, leads, properties, employees, settings, appointments, addAppointment, updateAppointment } = useAgency();

  const [leadId, setLeadId] = useState(leads[0]?.id ?? '');
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? '');
  const [employeeId, setEmployeeId] = useState(employees[1]?.id ?? employees[0]?.id ?? '');
  const [date, setDate] = useState(defaultDate || '2026-11-20');
  const [time, setTime] = useState(defaultTime || '11:00');
  const [type, setType] = useState<AppointmentType>('in_person_visit');
  const [status, setStatus] = useState<AppointmentStatus>('scheduled');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingAppointment) {
      setLeadId(editingAppointment.lead_id);
      setPropertyId(editingAppointment.property_id);
      setEmployeeId(editingAppointment.employee_id);
      setDate(editingAppointment.date);
      setTime(editingAppointment.time);
      setType(editingAppointment.type);
      setStatus(editingAppointment.status);
      setNotes(editingAppointment.notes);
    } else {
      const targetLead = leads.find((l) => l.id === defaultLeadId) ?? leads[0];
      setLeadId(targetLead?.id ?? '');
      setPropertyId(targetLead?.interested_property_id ?? properties[0]?.id ?? '');
      setEmployeeId(targetLead?.assigned_employee_id ?? employees[0]?.id ?? '');
      setDate(defaultDate || '2026-11-20');
      setTime(defaultTime || '11:00');
      setType('in_person_visit');
      setStatus('scheduled');
      setNotes('');
    }
  }, [editingAppointment, defaultLeadId, defaultDate, defaultTime, open, leads, properties, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId || !propertyId || !date || !time) return;

    const payload = {
      lead_id: leadId,
      property_id: propertyId,
      employee_id: employeeId,
      date,
      time,
      type,
      status,
      notes: notes.trim(),
    };

    if (editingAppointment) {
      updateAppointment(editingAppointment.id, payload);
    } else {
      addAppointment(payload);
    }
    onClose();
  };

  const dayKey = getDayKeyFromIsoDate(date);
  const dayConfig = settings.working_days.find((d) => d.day_key === dayKey);
  const quickSlots = dayConfig?.enabled
    ? generateDayWorkingHours(dayConfig.open, dayConfig.close).filter(
        (slot) => getSlotAvailability(dayConfig, slot, settings, date).status === 'available'
      )
    : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingAppointment ? t.appointments.editAppointment : t.appointments.newAppointment}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.lead}</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>{l.name} ({l.phone})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.property}</label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.ref} · {p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.employee}</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.type}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AppointmentType)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.appointmentTypes) as AppointmentType[]).map((at) => (
                <option key={at} value={at}>{t.appointmentTypes[at]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.time}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg font-mono-num"
            />
          </div>
          {quickSlots.length > 0 && (
            <div className="sm:col-span-2">
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {quickSlots.map((slot) => {
                  const isBusy = appointments.some(
                    (a) => a.date === date && a.time.startsWith(slot.slice(0, 2)) && a.status !== 'cancelled' && a.id !== editingAppointment?.id
                  );
                  const selected = time.startsWith(slot.slice(0, 2));
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-num font-semibold border transition-colors ${
                        selected
                          ? 'bg-[#0B3B4E] text-white border-[#0B3B4E]'
                          : isBusy
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-zinc-50 text-zinc-900 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.status}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {(Object.keys(t.appointmentStatuses) as AppointmentStatus[]).map((as) => (
                <option key={as} value={as}>{t.appointmentStatuses[as]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">{t.appointments.form.notes}</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 text-xs border border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DCE9EF]">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-4 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.cancel}
          </button>
          <button
            type="submit"
            className="btn-primary px-5 py-2 text-xs font-bold rounded-xl"
          >
            {t.app.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};
