import {
  AdPlatform,
  AppointmentStatus,
  AppointmentType,
  ChannelType,
  ContactMethod,
  DeliveryStatus,
  EmployeeRole,
  Language,
  LeadClassification,
  LeadSource,
  LeadStatus,
  NotificationCategory,
  OwnerType,
  PaymentMethod,
  PropertyStatus,
  PropertyType,
  SectionId,
  TransactionType,
} from '../types/domain';

export interface TranslationDict {
  app: {
    dir: 'rtl' | 'ltr';
    demoBadge: string;
    platformAttribution: string;
    searchPlaceholder: string;
    noSearchResults: string;
    logout: string;
    logoutConfirmTitle: string;
    logoutConfirmDesc: string;
    logoutSuccess: string;
    collapseSidebar: string;
    expandSidebar: string;
    notificationsShortcut: string;
    profileMenu: string;
    viewAll: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    confirm: string;
    reset: string;
    apply: string;
    exportCsv: string;
    exportExcel: string;
    exportPdf: string;
    loading: string;
    noData: string;
    actions: string;
    all: string;
    search: string;
    filter: string;
    sortBy: string;
    previous: string;
    next: string;
    showing: string;
    of: string;
    items: string;
    currencyCode: string;
    sqm: string;
    perMonth: string;
    requiredField: string;
    selectedCount: string;
    clearSelection: string;
    demoDataNotice: string;
  };
  nav: Record<SectionId, string>;
  navShortDesc: Record<SectionId, string>;
  languages: Record<Language, string>;
  leadStatuses: Record<LeadStatus, string>;
  leadSources: Record<LeadSource, string>;
  contactMethods: Record<ContactMethod, string>;
  paymentMethods: Record<PaymentMethod, string>;
  deliveryStatuses: Record<DeliveryStatus, string>;
  leadClassifications: Record<LeadClassification, string>;
  ownerTypes: Record<OwnerType, string>;
  propertyTypes: Record<PropertyType, string>;
  transactionTypes: Record<TransactionType, string>;
  propertyStatuses: Record<PropertyStatus, string>;
  appointmentStatuses: Record<AppointmentStatus, string>;
  appointmentTypes: Record<AppointmentType, string>;
  employeeRoles: Record<EmployeeRole, string>;
  channels: Record<ChannelType, string>;
  notificationCategories: Record<NotificationCategory, string>;
  adPlatforms: Record<AdPlatform, string>;
  days: Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', string>;
  overview: {
    title: string;
    subtitle: string;
    dateFilters: {
      today: string;
      last7: string;
      last30: string;
      thisMonth: string;
      custom: string;
    };
    fromDate: string;
    toDate: string;
    vsPrevPeriod: string;
    kpis: {
      totalLeads: string;
      newLeads: string;
      scheduledVisits: string;
      completedVisits: string;
      attendedClients: string;
      noShowClients: string;
      successfulDeals: string;
      activeProperties: string;
    };
    charts: {
      acquisitionTitle: string;
      acquisitionSub: string;
      visitsTitle: string;
      visitsSub: string;
      attendanceTitle: string;
      attendanceSub: string;
      funnelTitle: string;
      funnelSub: string;
      sourcesTitle: string;
      sourcesSub: string;
      monthlyTitle: string;
      monthlySub: string;
      attended: string;
      absent: string;
      scheduled: string;
      completed: string;
      leadsLabel: string;
      dealsLabel: string;
    };
    widgets: {
      upcomingAppointments: string;
      latestLeads: string;
      recentActivity: string;
      topProperties: string;
      quickActions: string;
      importantNotifications: string;
      newLeadBtn: string;
      newPropertyBtn: string;
      newAppointmentBtn: string;
      openReportsBtn: string;
      viewsCount: string;
      inquiriesCount: string;
    };
  };
  leads: {
    title: string;
    subtitle: string;
    addLead: string;
    editLead: string;
    deleteLead: string;
    deleteConfirm: string;
    emptyTitle: string;
    emptyDesc: string;
    tabs: {
      all: string;
      buyers: string;
      renters: string;
    };
    columns: {
      name: string;
      phone: string;
      email: string;
      source: string;
      contactMethod: string;
      paymentMethod: string;
      bedrooms: string;
      deliveryStatus: string;
      desiredArea: string;
      classification: string;
      property: string;
      budget: string;
      propertyType: string;
      city: string;
      employee: string;
      createdAt: string;
      lastInteraction: string;
      status: string;
    };
    filters: {
      allStatuses: string;
      allSources: string;
      allEmployees: string;
      allCities: string;
      allClassifications: string;
    };
    bulk: {
      assignEmployee: string;
      changeStatus: string;
      exportSelected: string;
      deleteSelected: string;
    };
    profile: {
      title: string;
      personalInfo: string;
      contactDetails: string;
      preferences: string;
      interestedProperty: string;
      assignedEmployee: string;
      internalNotes: string;
      addNotePlaceholder: string;
      addNoteBtn: string;
      scheduleFollowup: string;
      followupDate: string;
      saveFollowup: string;
      appointmentHistory: string;
      conversationHistory: string;
      activityTimeline: string;
      bookVisitBtn: string;
      openChatBtn: string;
    };
    form: {
      name: string;
      phone: string;
      email: string;
      source: string;
      contactMethod: string;
      paymentMethod: string;
      bedrooms: string;
      deliveryStatus: string;
      desiredArea: string;
      classification: string;
      propertyType: string;
      transactionType: string;
      budget: string;
      city: string;
      district: string;
      interestedProperty: string;
      assignedEmployee: string;
      status: string;
      preferences: string;
      selectProperty: string;
    };
  };
  pipeline: {
    title: string;
    subtitle: string;
    tabs: {
      all: string;
      sale: string;
      rent: string;
    };
    stages: {
      new: string;
      visit_scheduled: string;
      visited: string;
      no_show: string;
      follow_up: string;
      closed_won: string;
      closed_lost: string;
    };
    indicators: {
      totalPipelineValue: string;
      conversionRate: string;
      visitAttendanceRate: string;
      avgDealBudget: string;
    };
    moveToStage: string;
    quickNote: string;
    bookVisit: string;
    openProfile: string;
    dragHint: string;
    emptyStage: string;
  };
  properties: {
    title: string;
    subtitle: string;
    addProperty: string;
    editProperty: string;
    deleteProperty: string;
    deleteConfirm: string;
    gridView: string;
    tableView: string;
    refPrefix: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    views: string;
    tabs: {
      all: string;
      sale: string;
      rent: string;
    };
    stats: {
      total: string;
      available: string;
      forSale: string;
      forRent: string;
      reserved: string;
      closed: string;
    };
    filters: {
      allTypes: string;
      allTransactions: string;
      allStatuses: string;
      allCities: string;
      maxPrice: string;
    };
    details: {
      title: string;
      gallery: string;
      description: string;
      location: string;
      specifications: string;
      ownerInfo: string;
      assignedEmployee: string;
      interestedLeads: string;
      relatedAppointments: string;
      internalNotes: string;
      addNotePlaceholder: string;
      changeStatus: string;
      noInterestedLeads: string;
      noAppointments: string;
    };
    form: {
      title: string;
      ref: string;
      type: string;
      transactionType: string;
      price: string;
      city: string;
      district: string;
      address: string;
      area: string;
      bedrooms: string;
      bathrooms: string;
      status: string;
      ownerSelect: string;
      ownerName: string;
      ownerPhone: string;
      assignedEmployee: string;
      description: string;
      images: string;
      uploadImageLabel: string;
      selectPresetImages: string;
    };
  };
  owners: {
    title: string;
    subtitle: string;
    addOwner: string;
    editOwner: string;
    deleteOwner: string;
    deleteConfirm: string;
    stats: {
      totalOwners: string;
      totalPropertiesLinked: string;
      portfolioValue: string;
      investorsCount: string;
    };
    columns: {
      name: string;
      phone: string;
      email: string;
      city: string;
      ownerType: string;
      preferredContact: string;
      propertiesCount: string;
      commissionRate: string;
      nationalId: string;
    };
    filters: {
      allTypes: string;
      allCities: string;
    };
    profile: {
      title: string;
      contactAndDetails: string;
      ownedProperties: string;
      noProperties: string;
      notes: string;
    };
    form: {
      name: string;
      phone: string;
      email: string;
      city: string;
      ownerType: string;
      preferredContact: string;
      commissionRate: string;
      nationalId: string;
      notes: string;
    };
  };
  appointments: {
    title: string;
    subtitle: string;
    newAppointment: string;
    editAppointment: string;
    rescheduleAppointment: string;
    cancelAppointment: string;
    cancelConfirm: string;
    views: {
      table: string;
      daily: string;
      weekly: string;
      monthly: string;
    };
    stats: {
      total: string;
      upcoming: string;
      completed: string;
      attended: string;
      noShow: string;
    };
    columns: {
      client: string;
      clientInfo: string;
      phone: string;
      property: string;
      date: string;
      time: string;
      employee: string;
      type: string;
      status: string;
      notes: string;
    };
    form: {
      lead: string;
      property: string;
      employee: string;
      date: string;
      time: string;
      type: string;
      status: string;
      notes: string;
    };
    quickActions: {
      confirm: string;
      markAttended: string;
      markNoShow: string;
      reschedule: string;
      cancel: string;
    };
    agenda: {
      today: string;
      workingHoursLabel: string;
      closedDayBanner: string;
      closedDayHint: string;
      configureHoursBtn: string;
      outsideHours: string;
      breakPeriod: string;
      blockedSlot: string;
      availableSlot: string;
      bookAtTime: string;
      disableHour: string;
      enableHour: string;
      openSlotsCount: string;
      bookedCount: string;
      blockedCount: string;
      addForDay: string;
      directWhatsapp: string;
      directCall: string;
    };
  };
  team: {
    title: string;
    subtitle: string;
    addEmployee: string;
    editEmployee: string;
    activeAccount: string;
    inactiveAccount: string;
    activate: string;
    deactivate: string;
    assignedLeadsCount: string;
    scheduledVisitsCount: string;
    completedVisitsCount: string;
    attendanceRate: string;
    profile: {
      title: string;
      contactInfo: string;
      performance: string;
      permissions: string;
      recentActivities: string;
      assignedLeadsList: string;
    };
    permissionsLabels: {
      manage_leads: string;
      manage_properties: string;
      manage_appointments: string;
      view_reports: string;
      manage_team: string;
      manage_settings: string;
      export_data: string;
    };
    form: {
      name: string;
      phone: string;
      email: string;
      jobTitle: string;
      role: string;
      active: string;
    };
  };
  conversations: {
    title: string;
    subtitle: string;
    integrationBanner: string;
    unreadOnly: string;
    allChannels: string;
    markAsRead: string;
    replyPlaceholder: string;
    send: string;
    customerPanel: string;
    interestedProperty: string;
    leadStatus: string;
    assignedEmployee: string;
    internalNotes: string;
    openFullProfile: string;
    bookVisit: string;
    noConversationSelected: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    unreadCount: string;
    markAllRead: string;
    markRead: string;
    unreadOnly: string;
    openRelated: string;
    emptyTitle: string;
  };
  ads: {
    title: string;
    subtitle: string;
    demoWarning: string;
    kpis: {
      totalSpend: string;
      totalLeads: string;
      cpl: string;
      qualifiedLeads: string;
      appointments: string;
      costPerAppointment: string;
      visits: string;
      attributedSales: string;
      conversionRate: string;
    };
    charts: {
      leadsByCampaign: string;
      leadsByPlatform: string;
      dailyTrends: string;
      spendAndCpl: string;
    };
    table: {
      campaignName: string;
      platform: string;
      budget: string;
      spend: string;
      leads: string;
      appointments: string;
      cpl: string;
      status: string;
    };
    campaignStatuses: {
      active: string;
      paused: string;
      completed: string;
    };
  };
  reports: {
    title: string;
    subtitle: string;
    tabs: {
      leads: string;
      appointments: string;
      properties: string;
      team: string;
      sales: string;
    };
    leadsSection: {
      totalLeads: string;
      newLeads: string;
      conversionRate: string;
      bySource: string;
      byEmployee: string;
    };
    appointmentsSection: {
      total: string;
      completed: string;
      attendanceRate: string;
      absenceRate: string;
      byEmployee: string;
    };
    propertiesSection: {
      available: string;
      reserved: string;
      sold: string;
      rented: string;
      mostViewed: string;
      mostRequestedTypes: string;
    };
    teamSection: {
      employee: string;
      leadsHandled: string;
      visitsCompleted: string;
      attendanceRate: string;
      successfulDeals: string;
    };
    salesSection: {
      successfulTransactions: string;
      totalRevenue: string;
      monthlyPerformance: string;
      conversionRate: string;
    };
  };
  settings: {
    title: string;
    subtitle: string;
    tabs: {
      agency: string;
      identity: string;
      hours: string;
      appointments: string;
      notifications: string;
      localization: string;
      permissions: string;
      security: string;
    };
    agencyForm: {
      name: string;
      tagline: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      website: string;
      description: string;
      saveSuccess: string;
    };
    identityForm: {
      adminControlNotice: string;
      colorPresets: string;
      primaryColor: string;
      secondaryColor: string;
      logoUrl: string;
      uploadLogo: string;
      livePreview: string;
      previewCardTitle: string;
      previewButton: string;
    };
    hoursForm: {
      day: string;
      status: string;
      open: string;
      close: string;
      breakTime: string;
      hasBreak: string;
      noBreak: string;
      weeklySummary: string;
      activeDaysCount: string;
      weeklyHoursTotal: string;
      hoursUnit: string;
      copyMonToAll: string;
      copiedToast: string;
      hourlySlotsTitle: string;
      hourlySlotsHint: string;
      slotOpen: string;
      slotBreak: string;
      slotRemoved: string;
      excludedPeriodsTitle: string;
      addExcludedPeriod: string;
      periodStart: string;
      periodEnd: string;
      periodReason: string;
      periodReasonPlaceholder: string;
      removePeriod: string;
      holidays: string;
    };
    appointmentsForm: {
      duration: string;
      minutes: string;
      bookingWindowStart: string;
      bookingWindowEnd: string;
      autoConfirm: string;
      rescheduleLimit: string;
      hoursBefore: string;
      visitReminders: string;
    };
    notificationsForm: {
      newLead: string;
      appointments: string;
      attendance: string;
      teamActivity: string;
      emailDigest: string;
    };
    localizationForm: {
      language: string;
      timezone: string;
      dateFormat: string;
      currency: string;
      currencyNote: string;
    };
    securityForm: {
      accountInfo: string;
      changePassword: string;
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
      updatePassword: string;
      passwordMismatch: string;
      passwordUpdated: string;
      twoFactor: string;
      activeSessions: string;
      terminateSession: string;
      currentSessionBadge: string;
    };
  };
  toasts: {
    saved: string;
    leadAdded: string;
    leadUpdated: string;
    leadDeleted: string;
    propertyAdded: string;
    propertyUpdated: string;
    propertyDeleted: string;
    ownerAdded: string;
    ownerUpdated: string;
    ownerDeleted: string;
    appointmentCreated: string;
    appointmentUpdated: string;
    employeeAdded: string;
    employeeUpdated: string;
    messageSent: string;
    exported: string;
    noteAdded: string;
    statusUpdated: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  ar: {
    app: {
      dir: 'rtl',
      demoBadge: 'بيانات تجريبية للعرض',
      platformAttribution: 'مدعوم ببنية IBONDA العقارية',
      searchPlaceholder: 'ابحث عن عميل، عقار، مالك، رقم مرجعي، أو مستشار...',
      noSearchResults: 'لا توجد نتائج مطابقة للبحث.',
      logout: 'تسجيل الخروج',
      logoutConfirmTitle: 'تأكيد تسجيل الخروج',
      logoutConfirmDesc: 'هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة تحكم الوكالة؟ (في وضع العرض التوضيحي سيتم إعادة تحميل الجلسة).',
      logoutSuccess: 'تم تسجيل الخروج بنجاح',
      collapseSidebar: 'طي القائمة الجانبية',
      expandSidebar: 'توسيع القائمة الجانبية',
      notificationsShortcut: 'الإشعارات',
      profileMenu: 'حساب المستخدم',
      viewAll: 'عرض الكل',
      save: 'حفظ التغييرات',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      close: 'إغلاق',
      confirm: 'تأكيد',
      reset: 'إعادة تعيين',
      apply: 'تطبيق',
      exportCsv: 'تصدير CSV',
      exportExcel: 'تصدير Excel',
      exportPdf: 'تصدير PDF',
      loading: 'جارٍ التحميل...',
      noData: 'لا توجد بيانات متاحة حالياً',
      actions: 'الإجراءات',
      all: 'الكل',
      search: 'بحث',
      filter: 'تصفية',
      sortBy: 'ترتيب حسب',
      previous: 'السابق',
      next: 'التالي',
      showing: 'عرض',
      of: 'من أصل',
      items: 'عنصر',
      currencyCode: 'د.م',
      sqm: 'م²',
      perMonth: '/ شهر',
      requiredField: 'يرجى تعبئة جميع الحقول الإلزامية',
      selectedCount: 'تم تحديد',
      clearSelection: 'إلغاء التحديد',
      demoDataNotice: 'تنبيه: الأرقام المعروضة هي بيانات تجريبية لأغراض العرض والتجربة قبل الربط الفعلي بقاعدة البيانات.',
    },
    nav: {
      overview: 'نظرة عامة',
      leads: 'العملاء المحتملون',
      pipeline: 'مسار المبيعات',
      properties: 'العقارات والمخزون العقاري',
      owners: 'ملاك العقارات',
      appointments: 'المواعيد والمعاينات',
      team: 'فريق العمل',
      conversations: 'المحادثات والتواصل',
      notifications: 'الإشعارات',
      ads: 'تحليل الإعلانات',
      reports: 'التقارير والتحليلات',
      settings: 'إعدادات الوكالة',
    },
    navShortDesc: {
      overview: 'الملخص التنفيذي ومؤشرات الأداء اليومية للوكالة',
      leads: 'إدارة قاعدة بيانات المشترين والمستأجرين وتصنيفهم بدقة',
      pipeline: 'تتبع مراحل صفقات البيع والكراء بنظام كانبان التفاعلي',
      properties: 'إدارة المحفظة العقارية والوحدات المتاحة للبيع والكراء',
      owners: 'إدارة ملفات ملاك العقارات، العمولات، والعقارات المرتبطة بهم',
      appointments: 'جدولة المعاينات الميدانية ومتابعة نسبة الحضور',
      team: 'إدارة المستشارين العقاريين والصلاحيات ومؤشرات الإنجاز',
      conversations: 'صندوق الوارد الموحد لاستفسارات العملاء عبر القنوات',
      notifications: 'سجل التنبيهات الفورية للمواعيد والعملاء والعقارات',
      ads: 'قياس عائد الحملات الإعلانية وتكلفة العميل والمعاينة',
      reports: 'تقارير إدارية مفصلة قابلة للتصدير بصيغة PDF و Excel',
      settings: 'إعدادات الوكالة والتحكم الإداري في الهوية البصرية والأمان',
    },
    languages: {
      ar: 'العربية',
      en: 'English',
      fr: 'Français',
    },
    leadStatuses: {
      new: 'جديد',
      visit_scheduled: 'تمت جدولة المعاينة',
      visited: 'حضر المعاينة',
      no_show: 'لم يحضر المعاينة',
      follow_up: 'قيد المتابعة',
      closed_won: 'صفقة ناجحة',
      not_interested: 'غير مهتم',
      closed_lost: 'صفقة غير مكتملة',
    },
    leadSources: {
      facebook_ads: 'إعلانات فيسبوك',
      instagram_ads: 'إعلانات إنستغرام',
      google_ads: 'إعلانات جوجل',
      whatsapp: 'واتساب المباشر',
      website: 'الموقع الإلكتروني',
      referral: 'توصية عميل',
      walk_in: 'زيارة الوكالة',
    },
    contactMethods: {
      whatsapp: 'واتساب',
      phone_call: 'مكالمة هاتفية',
    },
    paymentMethods: {
      cash: 'نقداً (Cash)',
      credit: 'تمويل بنكي / قرض',
    },
    deliveryStatuses: {
      off_plan: 'قيد الإنشاء (على المخطط)',
      ready: 'جاهز للسكن',
    },
    leadClassifications: {
      vip: 'VIP (أولوية قصوى)',
      hot: 'ساخن (Hot)',
      warm: 'دافئ (Warm)',
      cold: 'بارد (Cold)',
    },
    ownerTypes: {
      individual: 'مالك فردي',
      investor: 'مستثمر عقاري',
      developer: 'منعش / مطور عقاري',
      company: 'شركة / مؤسسة',
    },
    propertyTypes: {
      apartment: 'شقة',
      villa: 'فيلا',
      house: 'منزل',
      land: 'أرض',
      commercial: 'محل تجاري',
      office: 'مكتب',
      other: 'عقار آخر',
    },
    transactionTypes: {
      sale: 'بيع',
      rent: 'كراء',
    },
    propertyStatuses: {
      available: 'متاح',
      reserved: 'محجوز',
      sold: 'تم البيع',
      rented: 'تم الكراء',
      unavailable: 'غير متاح',
    },
    appointmentStatuses: {
      scheduled: 'مجدولة',
      confirmed: 'مؤكدة',
      attended: 'حضر العميل',
      no_show: 'لم يحضر العميل',
      cancelled: 'أُلغيت',
      rescheduled: 'أُعيدت جدولتها',
    },
    appointmentTypes: {
      in_person_visit: 'معاينة ميدانية',
      office_meeting: 'اجتماع في الوكالة',
      virtual_tour: 'جولة افتراضية',
      contract_signing: 'توقيع العقد',
    },
    employeeRoles: {
      agency_manager: 'مدير الوكالة',
      sales_manager: 'مسؤول المبيعات',
      real_estate_advisor: 'مستشار عقاري',
      receptionist: 'موظف استقبال',
      custom: 'دور مخصص',
    },
    channels: {
      whatsapp: 'واتساب',
      instagram: 'إنستغرام',
      facebook: 'فيسبوك',
      website: 'الموقع الإلكتروني',
      other: 'مصادر أخرى',
    },
    notificationCategories: {
      new_lead: 'عميل جديد',
      new_appointment: 'موعد جديد',
      upcoming_visit: 'اقتراب موعد معاينة',
      appointment_confirmed: 'تأكيد موعد',
      appointment_cancelled: 'إلغاء موعد',
      client_no_show: 'عدم حضور العميل',
      property_updated: 'تحديث حالة عقار',
      team_activity: 'نشاط أحد الموظفين',
      admin_alert: 'تنبيه إداري',
    },
    adPlatforms: {
      facebook_ads: 'Facebook Ads',
      instagram_ads: 'Instagram Ads',
      google_ads: 'Google Ads',
      other: 'مصادر أخرى',
    },
    days: {
      mon: 'الإثنين',
      tue: 'الثلاثاء',
      wed: 'الأربعاء',
      thu: 'الخميس',
      fri: 'الجمعة',
      sat: 'السبت',
      sun: 'الأحد',
    },
    overview: {
      title: 'نظرة عامة على أداء الوكالة',
      subtitle: 'متابعة فورية لمؤشرات العملاء المحتملين، المعاينات الميدانية، وحركة الصفقات العقارية',
      dateFilters: {
        today: 'اليوم',
        last7: 'آخر 7 أيام',
        last30: 'آخر 30 يوماً',
        thisMonth: 'هذا الشهر',
        custom: 'فترة مخصصة',
      },
      fromDate: 'من تاريخ',
      toDate: 'إلى تاريخ',
      vsPrevPeriod: 'مقارنة بالفترة السابقة',
      kpis: {
        totalLeads: 'إجمالي العملاء المحتملين',
        newLeads: 'العملاء الجدد',
        scheduledVisits: 'المعاينات المجدولة',
        completedVisits: 'المعاينات المكتملة',
        attendedClients: 'العملاء الذين حضروا المعاينة',
        noShowClients: 'العملاء الذين لم يحضروا',
        successfulDeals: 'الصفقات الناجحة',
        activeProperties: 'إجمالي العقارات النشطة',
      },
      charts: {
        acquisitionTitle: 'استقطاب العملاء المحتملين عبر الزمن',
        acquisitionSub: 'تطور عدد الاستفسارات اليومية خلال الفترة المختارة',
        visitsTitle: 'المواعيد والمعاينات العقارية',
        visitsSub: 'المعاينات المجدولة مقابل المنجزة أسبوعياً',
        attendanceTitle: 'نسبة الحضور مقابل الغياب',
        attendanceSub: 'تحليل التزام العملاء بمواعيد المعاينة',
        funnelTitle: 'مسار التحويل والمبيعات',
        funnelSub: 'معدل انتقال العملاء من الاستفسار إلى إتمام الصفقة',
        sourcesTitle: 'توزيع مصادر العملاء المحتملين',
        sourcesSub: 'نسبة مساهمة كل قناة في جلب العملاء',
        monthlyTitle: 'الأداء الشهري للوكالة',
        monthlySub: 'مقارنة بين العملاء الجدد والصفقات المغلقة شهرياً',
        attended: 'حضر المعاينة',
        absent: 'لم يحضر',
        scheduled: 'مجدولة',
        completed: 'مكتملة',
        leadsLabel: 'العملاء المحتملون',
        dealsLabel: 'الصفقات الناجحة',
      },
      widgets: {
        upcomingAppointments: 'المواعيد القادمة',
        latestLeads: 'أحدث العملاء المحتملين',
        recentActivity: 'نشاط فريق العمل الأخير',
        topProperties: 'أفضل العقارات أداءً',
        quickActions: 'إجراءات سريعة',
        importantNotifications: 'تنبيهات مهمة',
        newLeadBtn: 'إضافة عميل محتمل',
        newPropertyBtn: 'إضافة عقار جديد',
        newAppointmentBtn: 'جدولة معاينة',
        openReportsBtn: 'استعراض التقارير',
        viewsCount: 'مشاهدة',
        inquiriesCount: 'استفسار',
      },
    },
    leads: {
      title: 'إدارة العملاء المحتملين',
      subtitle: 'سجل منفصل ومنظم لراغبي الشراء وراغبي الكراء مع تصنيف الأولوية وتفاصيل الدفع والمساحة',
      addLead: 'إضافة عميل محتمل',
      editLead: 'تعديل بيانات العميل',
      deleteLead: 'حذف العميل',
      deleteConfirm: 'هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.',
      emptyTitle: 'لا يوجد عملاء مطابقون لمعايير البحث',
      emptyDesc: 'جرب تغيير الفلاتر المختارة أو أضف عميلاً محتملاً جديداً للبدء.',
      tabs: {
        all: 'جميع العملاء',
        buyers: 'راغبون في الشراء',
        renters: 'راغبون في الكراء',
      },
      columns: {
        name: 'اسم العميل',
        phone: 'رقم الهاتف',
        email: 'البريد الإلكتروني',
        source: 'مصدر العميل',
        contactMethod: 'التواصل المفضل',
        paymentMethod: 'طريقة الدفع',
        bedrooms: 'الغرف',
        deliveryStatus: 'حالة التسليم',
        desiredArea: 'المساحة المطلوبة',
        classification: 'التصنيف',
        property: 'العقار المهتم به',
        budget: 'الميزانية',
        propertyType: 'نوع العقار المطلوب',
        city: 'المدينة / المنطقة',
        employee: 'الموظف المسؤول',
        createdAt: 'تاريخ التسجيل',
        lastInteraction: 'آخر تفاعل',
        status: 'حالة العميل',
      },
      filters: {
        allStatuses: 'جميع الحالات',
        allSources: 'جميع المصادر',
        allEmployees: 'جميع الموظفين',
        allCities: 'جميع المدن المغربية',
        allClassifications: 'جميع التصنيفات',
      },
      bulk: {
        assignEmployee: 'تعيين لموظف',
        changeStatus: 'تغيير الحالة',
        exportSelected: 'تصدير المحدد',
        deleteSelected: 'حذف المحدد',
      },
      profile: {
        title: 'ملف العميل التفصيلي',
        personalInfo: 'المعلومات الشخصية',
        contactDetails: 'بيانات التواصل',
        preferences: 'تفضيلات العميل وملاحظات البحث',
        interestedProperty: 'العقار المهتم به',
        assignedEmployee: 'المستشار المسؤول',
        internalNotes: 'الملاحظات الداخلية',
        addNotePlaceholder: 'أضف ملاحظة داخلية حول مكالمة أو متطلبات العميل...',
        addNoteBtn: 'إضافة ملاحظة',
        scheduleFollowup: 'جدولة متابعة قادمة',
        followupDate: 'تاريخ المتابعة',
        saveFollowup: 'حفظ موعد المتابعة',
        appointmentHistory: 'سجل المواعيد والمعاينات',
        conversationHistory: 'سجل المحادثات',
        activityTimeline: 'الجدول الزمني لنشاط العميل',
        bookVisitBtn: 'جدولة معاينة',
        openChatBtn: 'فتح المحادثة',
      },
      form: {
        name: 'الاسم الكامل',
        phone: 'رقم الهاتف',
        email: 'البريد الإلكتروني',
        source: 'مصدر العميل',
        contactMethod: 'طريقة التواصل (واتساب / مكالمة)',
        paymentMethod: 'طريقة الدفع',
        bedrooms: 'عدد الغرف المطلوبة',
        deliveryStatus: 'جاهزية العقار',
        desiredArea: 'المساحة المطلوبة (م²)',
        classification: 'تصنيف العميل',
        propertyType: 'نوع العقار المطلوب',
        transactionType: 'نوع الطلب (شراء / كراء)',
        budget: 'الميزانية التقديرية (د.م)',
        city: 'المدينة',
        district: 'الحي / المنطقة',
        interestedProperty: 'العقار المهتم به',
        assignedEmployee: 'الموظف المسؤول',
        status: 'الحالة',
        preferences: 'متطلبات وتفضيلات العميل',
        selectProperty: 'اختر عقاراً (اختياري)',
      },
    },
    pipeline: {
      title: 'مسار المبيعات والكراء',
      subtitle: 'فصل كامل بين مسار صفقات الشراء ومسار صفقات الكراء مع أرقام واضحة وسحب وإفلات فوري',
      tabs: {
        all: 'المسار الشامل',
        sale: 'مسار الشراء (البيع)',
        rent: 'مسار الكراء',
      },
      stages: {
        new: 'عميل جديد',
        visit_scheduled: 'تمت جدولة المعاينة',
        visited: 'حضر المعاينة',
        no_show: 'لم يحضر المعاينة',
        follow_up: 'قيد التفاوض والمتابعة',
        closed_won: 'صفقة ناجحة',
        closed_lost: 'صفقة غير مكتملة',
      },
      indicators: {
        totalPipelineValue: 'إجمالي قيمة المسار النشط',
        conversionRate: 'معدل إغلاق الصفقات',
        visitAttendanceRate: 'نسبة حضور المعاينات',
        avgDealBudget: 'متوسط قيمة الطلب',
      },
      moveToStage: 'نقل إلى مرحلة',
      quickNote: 'ملاحظة سريعة',
      bookVisit: 'حجز معاينة',
      openProfile: 'فتح الملف',
      dragHint: 'اسحب البطاقة وأفلتها في المرحلة التالية أو اختر المرحلة من القائمة',
      emptyStage: 'لا يوجد عملاء في هذه المرحلة',
    },
    properties: {
      title: 'العقارات والمخزون العقاري',
      subtitle: 'إحصائيات واضحة لعدد العقارات مع فصل كامل بين عقارات البيع وعقارات الكراء',
      addProperty: 'إضافة عقار جديد',
      editProperty: 'تعديل بيانات العقار',
      deleteProperty: 'حذف العقار',
      deleteConfirm: 'هل أنت متأكد من حذف هذا العقار من المخزون؟',
      gridView: 'عرض شبكي',
      tableView: 'عرض جدولي',
      refPrefix: 'مرجع',
      bedrooms: 'غرف',
      bathrooms: 'حمامات',
      area: 'المساحة',
      views: 'المشاهدات',
      tabs: {
        all: 'جميع العقارات',
        sale: 'عقارات للبيع',
        rent: 'عقارات للكراء',
      },
      stats: {
        total: 'إجمالي العقارات',
        available: 'العقارات المتاحة',
        forSale: 'معروضة للبيع',
        forRent: 'معروضة للكراء',
        reserved: 'عقارات محجوزة',
        closed: 'مباعة / مؤجرة',
      },
      filters: {
        allTypes: 'جميع الأنواع',
        allTransactions: 'بيع وكراء',
        allStatuses: 'جميع الحالات',
        allCities: 'جميع المدن المغربية',
        maxPrice: 'الحد الأقصى للسعر',
      },
      details: {
        title: 'تفاصيل العقار',
        gallery: 'معرض الصور',
        description: 'الوصف التفصيلي',
        location: 'الموقع والعنوان',
        specifications: 'المواصفات والمساحة',
        ownerInfo: 'بيانات المالك',
        assignedEmployee: 'المستشار المسؤول',
        interestedLeads: 'العملاء المهتمون',
        relatedAppointments: 'المعاينات المرتبطة',
        internalNotes: 'ملاحظات الفريق',
        addNotePlaceholder: 'أضف ملاحظة حول المفاتيح، المعاينة، أو التفاوض مع المالك...',
        changeStatus: 'تغيير حالة التوفر',
        noInterestedLeads: 'لا يوجد عملاء مرتبطون بهذا العقار حالياً.',
        noAppointments: 'لا توجد مواعيد معاينة مجدولة لهذا العقار.',
      },
      form: {
        title: 'عنوان العقار',
        ref: 'الرقم المرجعي',
        type: 'نوع العقار',
        transactionType: 'نوع المعاملة',
        price: 'السعر (د.م)',
        city: 'المدينة',
        district: 'الحي / المنطقة',
        address: 'العنوان التفصيلي',
        area: 'المساحة (م²)',
        bedrooms: 'عدد الغرف',
        bathrooms: 'عدد الحمامات',
        status: 'حالة العقار',
        ownerSelect: 'اختيار من قائمة ملاك العقار',
        ownerName: 'اسم المالك',
        ownerPhone: 'هاتف المالك',
        assignedEmployee: 'المستشار المسؤول',
        description: 'وصف العقار والمميزات',
        images: 'صور العقار',
        uploadImageLabel: 'رفع صورة من الجهاز',
        selectPresetImages: 'أو اختيار صورة جاهزة من الأرشيف',
      },
    },
    owners: {
      title: 'ملاك العقارات وخصائصهم',
      subtitle: 'قاعدة بيانات ملاك العقارات والمستثمرين والمنعشين، نسب العمولة، وطرق التواصل والعقارات المسجلة باسمهم',
      addOwner: 'إضافة مالك عقار',
      editOwner: 'تعديل بيانات المالك',
      deleteOwner: 'حذف المالك',
      deleteConfirm: 'هل أنت متأكد من حذف ملف هذا المالك؟',
      stats: {
        totalOwners: 'إجمالي ملاك العقارات',
        totalPropertiesLinked: 'العقارات المرتبطة',
        portfolioValue: 'إجمالي قيمة المحافظ',
        investorsCount: 'المستثمرون والمنعشون',
      },
      columns: {
        name: 'اسم المالك / الشركة',
        phone: 'رقم الهاتف',
        email: 'البريد الإلكتروني',
        city: 'المدينة',
        ownerType: 'صفة المالك',
        preferredContact: 'التواصل المفضل',
        propertiesCount: 'عدد العقارات',
        commissionRate: 'نسبة العمولة',
        nationalId: 'المرجع / البطاقة',
      },
      filters: {
        allTypes: 'جميع الصفات',
        allCities: 'جميع المدن المغربية',
      },
      profile: {
        title: 'ملف المالك وعقاراته',
        contactAndDetails: 'البيانات والخصائص',
        ownedProperties: 'العقارات المسجلة لهذا المالك',
        noProperties: 'لا توجد عقارات مرتبطة بهذا المالك حالياً.',
        notes: 'ملاحظات وشروط المالك',
      },
      form: {
        name: 'الاسم الكامل / اسم الشركة',
        phone: 'رقم الهاتف',
        email: 'البريد الإلكتروني',
        city: 'المدينة',
        ownerType: 'صفة المالك',
        preferredContact: 'طريقة التواصل المفضلة',
        commissionRate: 'نسبة العمولة المتفق عليها (%)',
        nationalId: 'رقم البطاقة الوطنية / السجل التجاري',
        notes: 'شروط المالك وملاحظات المفاتيح والتفاوض',
      },
    },
    appointments: {
      title: 'المواعيد والمعاينات',
      subtitle: 'تنظيم جدول المعاينات بالألوان التوضيحية مع عرض كامل لبيانات العميل وتصنيفه وطريقة تواصله',
      newAppointment: 'إنشاء موعد جديد',
      editAppointment: 'تعديل الموعد',
      rescheduleAppointment: 'إعادة جدولة الموعد',
      cancelAppointment: 'إلغاء الموعد',
      cancelConfirm: 'هل تريد تأكيد إلغاء هذا الموعد؟',
      views: {
        table: 'جدول المواعيد',
        daily: 'الجدول اليومي',
        weekly: 'التقويم الأسبوعي',
        monthly: 'التقويم الشهري',
      },
      stats: {
        total: 'إجمالي المعاينات',
        upcoming: 'المعاينات القادمة',
        completed: 'المعاينات المكتملة',
        attended: 'العملاء الذين حضروا',
        noShow: 'العملاء الذين لم يحضروا',
      },
      columns: {
        client: 'العميل',
        clientInfo: 'تفاصيل العميل والميزانية',
        phone: 'الهاتف',
        property: 'العقار',
        date: 'التاريخ',
        time: 'التوقيت',
        employee: 'المستشار',
        type: 'نوع الموعد',
        status: 'الحالة',
        notes: 'ملاحظات',
      },
      form: {
        lead: 'اختر العميل',
        property: 'اختر العقار',
        employee: 'الموظف المكلف',
        date: 'التاريخ',
        time: 'الساعة',
        type: 'نوع الموعد',
        status: 'حالة الموعد',
        notes: 'ملاحظات إضافية',
      },
      quickActions: {
        confirm: 'تأكيد',
        markAttended: 'حضر',
        markNoShow: 'لم يحضر',
        reschedule: 'إعادة جدولة',
        cancel: 'إلغاء',
      },
      agenda: {
        today: 'اليوم',
        workingHoursLabel: 'أوقات العمل',
        closedDayBanner: 'يوم عطلة — الوكالة مغلقة في هذا اليوم',
        closedDayHint: 'يمكنك تعديل أيام العمل أو تفعيل هذا اليوم من إعدادات ساعات العمل.',
        configureHoursBtn: 'تعديل ساعات العمل',
        outsideHours: 'خارج أوقات الدوام',
        breakPeriod: 'فترة استراحة / توقف',
        blockedSlot: 'ساعة مستبعدة (غير متاحة للحجز)',
        availableSlot: 'وقت متاح للمعاينة',
        bookAtTime: 'حجز موعد في هذا التوقيت',
        disableHour: 'استبعاد هذا الوقت',
        enableHour: 'إعادة فتح الوقت',
        openSlotsCount: 'ساعات متاحة',
        bookedCount: 'مواعيد محجوزة',
        blockedCount: 'أوقات مستبعدة',
        addForDay: 'موعد جديد',
        directWhatsapp: 'مراسلة فورية عبر واتساب',
        directCall: 'اتصال هاتفي مباشر',
      },
    },
    team: {
      title: 'إدارة فريق العمل',
      subtitle: 'متابعة أداء المستشارين العقاريين، إدارة الصلاحيات، وتوزيع العملاء والعقارات',
      addEmployee: 'إضافة موظف جديد',
      editEmployee: 'تعديل بيانات الموظف',
      activeAccount: 'حساب نشط',
      inactiveAccount: 'حساب موقوف',
      activate: 'تفعيل الحساب',
      deactivate: 'إيقاف الحساب',
      assignedLeadsCount: 'العملاء المعينون',
      scheduledVisitsCount: 'المعاينات المجدولة',
      completedVisitsCount: 'المعاينات المنجزة',
      attendanceRate: 'نسبة حضور العملاء',
      profile: {
        title: 'ملف الموظف ومؤشرات الأداء',
        contactInfo: 'معلومات الاتصال والمنصب',
        performance: 'مؤشرات الأداء الميداني',
        permissions: 'صلاحيات الوصول',
        recentActivities: 'سجل النشاط الأخير',
        assignedLeadsList: 'العملاء المعينون لهذا الموظف',
      },
      permissionsLabels: {
        manage_leads: 'إدارة العملاء المحتملين',
        manage_properties: 'إدارة العقارات والمخزون',
        manage_appointments: 'إدارة المواعيد والمعاينات',
        view_reports: 'الاطلاع على التقارير والتحليلات',
        manage_team: 'إدارة فريق العمل',
        manage_settings: 'تعديل إعدادات الوكالة',
        export_data: 'تصدير البيانات والتقارير',
      },
      form: {
        name: 'الاسم الكامل',
        phone: 'رقم الهاتف',
        email: 'البريد الإلكتروني المهني',
        jobTitle: 'المسمى الوظيفي',
        role: 'الدور والصلاحية',
        active: 'تفعيل الحساب مباشرة',
      },
    },
    conversations: {
      title: 'المحادثات والتواصل',
      subtitle: 'صندوق الوارد الموحد لرسائل العملاء عبر قنوات التواصل المختلفة',
      integrationBanner: 'واجهة جاهزة للربط مع واجهات برمجة التطبيقات (WhatsApp Business / Meta). الرسائل الحالية للعرض التوضيحي فقط.',
      unreadOnly: 'غير المقروءة فقط',
      allChannels: 'جميع القنوات',
      markAsRead: 'تحديد كمقروء',
      replyPlaceholder: 'اكتب ردك للعميل هنا...',
      send: 'إرسال',
      customerPanel: 'معلومات العميل والسياق',
      interestedProperty: 'العقار المهتم به',
      leadStatus: 'حالة العميل',
      assignedEmployee: 'المستشار المسؤول',
      internalNotes: 'ملاحظات سريعة',
      openFullProfile: 'فتح الملف الكامل للعميل',
      bookVisit: 'جدولة معاينة',
      noConversationSelected: 'اختر محادثة من القائمة لعرض التفاصيل',
    },
    notifications: {
      title: 'مركز الإشعارات',
      subtitle: 'تنبيهات فورية حول العملاء الجدد، المواعيد القادمة، تحديثات العقارات ونشاط الفريق',
      unreadCount: 'إشعارات غير مقروءة',
      markAllRead: 'تحديد الكل كمقروء',
      markRead: 'تحديد كمقروء',
      unreadOnly: 'غير المقروءة فقط',
      openRelated: 'الانتقال إلى التفاصيل',
      emptyTitle: 'لا توجد إشعارات مطابقة للتصفية الحالية',
    },
    ads: {
      title: 'تحليل الإعلانات والحملات التسويقية',
      subtitle: 'قياس فعالية الإنفاق الإعلاني، تكلفة العميل المحتمل، ومعدل التحويل إلى معاينات وصفقات',
      demoWarning: 'تنبيه مهم: جميع الأرقام والتكاليف الإعلانية المعروضة هنا هي بيانات تجريبية توضيحية إلى حين ربط حسابات Meta Ads و Google Ads الرسمية.',
      kpis: {
        totalSpend: 'إجمالي الإنفاق الإعلاني',
        totalLeads: 'العملاء الناتجون عن الإعلانات',
        cpl: 'تكلفة العميل الواحد (CPL)',
        qualifiedLeads: 'العملاء المؤهلون',
        appointments: 'المواعيد المحجوزة',
        costPerAppointment: 'تكلفة الموعد الواحد',
        visits: 'المعاينات المنفذة',
        attributedSales: 'الصفقات المنسوبة للحملات',
        conversionRate: 'معدل تحويل الحملات',
      },
      charts: {
        leadsByCampaign: 'العملاء حسب الحملة الإعلانية',
        leadsByPlatform: 'توزيع العملاء حسب المنصة',
        dailyTrends: 'التطور اليومي لاستقطاب العملاء',
        spendAndCpl: 'الإنفاق الإعلاني وتكلفة العميل',
      },
      table: {
        campaignName: 'اسم الحملة',
        platform: 'المنصة',
        budget: 'الميزانية المخصصة',
        spend: 'المبلغ المنفق',
        leads: 'العملاء',
        appointments: 'المواعيد',
        cpl: 'تكلفة العميل',
        status: 'حالة الحملة',
      },
      campaignStatuses: {
        active: 'نشطة',
        paused: 'متوقفة مؤقتاً',
        completed: 'مكتملة',
      },
    },
    reports: {
      title: 'التقارير والتحليلات المتقدمة',
      subtitle: 'تقارير تنفيذية شاملة جاهزة للاجتماعات الإدارية مع إمكانية التصدير إلى PDF و Excel',
      tabs: {
        leads: 'تقارير العملاء',
        appointments: 'تقارير المواعيد',
        properties: 'تقارير العقارات',
        team: 'أداء الفريق',
        sales: 'تقارير المبيعات',
      },
      leadsSection: {
        totalLeads: 'إجمالي العملاء المسجلين',
        newLeads: 'العملاء الجدد خلال الفترة',
        conversionRate: 'معدل التحويل الإجمالي',
        bySource: 'توزيع العملاء حسب المصدر',
        byEmployee: 'توزيع العملاء حسب الموظف',
      },
      appointmentsSection: {
        total: 'إجمالي المواعيد',
        completed: 'المعاينات المكتملة',
        attendanceRate: 'نسبة الحضور',
        absenceRate: 'نسبة الغياب',
        byEmployee: 'المواعيد ونسب الحضور حسب الموظف',
      },
      propertiesSection: {
        available: 'عقارات متاحة',
        reserved: 'عقارات محجوزة',
        sold: 'عقارات مباعة',
        rented: 'عقارات مؤجرة',
        mostViewed: 'العقارات الأكثر مشاهدة وطلباً',
        mostRequestedTypes: 'أنواع العقارات الأكثر طلباً',
      },
      teamSection: {
        employee: 'الموظف',
        leadsHandled: 'العملاء المتابعون',
        visitsCompleted: 'المعاينات المنجزة',
        attendanceRate: 'معدل الحضور',
        successfulDeals: 'الصفقات الناجحة',
      },
      salesSection: {
        successfulTransactions: 'الصفقات المكتملة',
        totalRevenue: 'حجم المعاملات التقديري',
        monthlyPerformance: 'الأداء المالي الشهري',
        conversionRate: 'نسبة إغلاق المبيعات',
      },
    },
    settings: {
      title: 'إعدادات الوكالة',
      subtitle: 'إدارة بيانات الوكالة، تحكم مدير المنصة في الهوية البصرية، ساعات العمل، قواعد المواعيد، الصلاحيات والأمان',
      tabs: {
        agency: 'معلومات الوكالة',
        identity: 'الهوية البصرية (تحكم الإدارة)',
        hours: 'ساعات العمل',
        appointments: 'إعدادات المواعيد',
        notifications: 'إعدادات الإشعارات',
        localization: 'اللغة والمنطقة',
        permissions: 'صلاحيات الفريق',
        security: 'الحساب والأمان',
      },
      agencyForm: {
        name: 'اسم الوكالة العقارية',
        tagline: 'الشعار الوصفي للوكالة',
        phone: 'رقم الهاتف الرسمي',
        email: 'البريد الإلكتروني للوكالة',
        address: 'العنوان الكامل',
        city: 'المدينة',
        website: 'الموقع الإلكتروني',
        description: 'نبذة عن نشاط الوكالة',
        saveSuccess: 'تم حفظ إعدادات الوكالة بنجاح',
      },
      identityForm: {
        adminControlNotice: 'إدارة الهوية البصرية تخضع لتحكم مدير المنصة / مالك النظام: يمكنك تحديد الألوان والشعار لكل وكالة بشكل مستقل من هنا.',
        colorPresets: 'قوالب ألوان متناسقة جاهزة',
        primaryColor: 'اللون الأساسي للوكالة',
        secondaryColor: 'اللون الثانوي (لون التمييز)',
        logoUrl: 'شعار الوكالة',
        uploadLogo: 'تغيير الشعار',
        livePreview: 'معاينة فورية لهوية الوكالة',
        previewCardTitle: 'بطاقة معاينة بهوية الوكالة المخصصة',
        previewButton: 'زر إجراء رئيسي',
      },
      hoursForm: {
        day: 'اليوم',
        status: 'الحالة',
        open: 'وقت الفتح',
        close: 'وقت الإغلاق',
        breakTime: 'فترة الاستراحة',
        hasBreak: 'فترة استراحة منتصف اليوم',
        noBreak: 'دوام مستمر بدون استراحة',
        weeklySummary: 'ملخص الدوام الأسبوعي',
        activeDaysCount: 'أيام العمل النشطة',
        weeklyHoursTotal: 'إجمالي ساعات الاستقبال المتاحة',
        hoursUnit: 'ساعة',
        copyMonToAll: 'تطبيق توقيت الإثنين على كل الأيام المفتوحة',
        copiedToast: 'تم تعميم جدول الإثنين على جميع أيام العمل النشطة',
        hourlySlotsTitle: 'التحكم في ساعات اليوم (اضغط لإلغاء أو استرجاع أي ساعة)',
        hourlySlotsHint: 'يمكنك إزالة أي ساعة وسط اليوم (مثل وقت الغداء أو الاجتماعات) لتصبح غير متاحة في الأجندة.',
        slotOpen: 'متاح',
        slotBreak: 'استراحة',
        slotRemoved: 'محذوف',
        excludedPeriodsTitle: 'فترات متقطعة مستبعدة وسط اليوم',
        addExcludedPeriod: 'استبعاد فترة',
        periodStart: 'من',
        periodEnd: 'إلى',
        periodReason: 'السبب (اختياري)',
        periodReasonPlaceholder: 'مثال: صلاة الجمعة، اجتماع الفريق...',
        removePeriod: 'حذف الفترة',
        holidays: 'العطل الرسمية والأيام المغلقة',
      },
      appointmentsForm: {
        duration: 'مدة المعاينة الافتراضية',
        minutes: 'دقيقة',
        bookingWindowStart: 'بداية ساعات الحجز المتاحة',
        bookingWindowEnd: 'نهاية ساعات الحجز المتاحة',
        autoConfirm: 'تأكيد المواعيد تلقائياً عند الحجز',
        rescheduleLimit: 'الحد الأدنى لإعادة الجدولة قبل الموعد',
        hoursBefore: 'ساعات قبل الموعد',
        visitReminders: 'إرسال تذكيرات آلية قبل موعد المعاينة',
      },
      notificationsForm: {
        newLead: 'تنبيهات العملاء المحتملين الجدد',
        appointments: 'تنبيهات إنشاء وتعديل المواعيد',
        attendance: 'تنبيهات الحضور وعدم الحضور للمعاينة',
        teamActivity: 'تنبيهات نشاط المستشارين والفريق',
        emailDigest: 'ملخص يومي عبر البريد الإلكتروني',
      },
      localizationForm: {
        language: 'لغة الواجهة الافتراضية',
        timezone: 'المنطقة الزمنية',
        dateFormat: 'صيغة التاريخ',
        currency: 'العملة المعتمدة',
        currencyNote: 'الدرهم المغربي (MAD) هو العملة المعتمدة في كافة التقارير والأسعار.',
      },
      securityForm: {
        accountInfo: 'بيانات الحساب النشط',
        changePassword: 'تغيير كلمة المرور',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        confirmPassword: 'تأكيد كلمة المرور الجديدة',
        updatePassword: 'تحديث كلمة المرور',
        passwordMismatch: 'كلمتا المرور غير متطابقتين',
        passwordUpdated: 'تم تحديث كلمة المرور بنجاح (عرض توضيحي)',
        twoFactor: 'تفعيل المصادقة الثنائية (2FA)',
        activeSessions: 'الجلسات النشطة',
        terminateSession: 'إنهاء الجلسة',
        currentSessionBadge: 'الجلسة الحالية',
      },
    },
    toasts: {
      saved: 'تم الحفظ بنجاح',
      leadAdded: 'تمت إضافة العميل المحتمل بنجاح',
      leadUpdated: 'تم تحديث بيانات العميل',
      leadDeleted: 'تم حذف العميل من السجل',
      propertyAdded: 'تمت إضافة العقار إلى المخزون',
      propertyUpdated: 'تم تحديث بيانات العقار',
      propertyDeleted: 'تم حذف العقار',
      ownerAdded: 'تمت إضافة مالك العقار بنجاح',
      ownerUpdated: 'تم تحديث بيانات مالك العقار',
      ownerDeleted: 'تم حذف ملف المالك',
      appointmentCreated: 'تم إنشاء الموعد بنجاح',
      appointmentUpdated: 'تم تحديث حالة الموعد',
      employeeAdded: 'تمت إضافة عضو الفريق بنجاح',
      employeeUpdated: 'تم تحديث ملف الموظف',
      messageSent: 'تم إرسال الرسالة',
      exported: 'تم تصدير الملف بنجاح',
      noteAdded: 'تمت إضافة الملاحظة الداخلية',
      statusUpdated: 'تم تحديث الحالة بنجاح',
    },
  },

  en: {
    app: {
      dir: 'ltr',
      demoBadge: 'Demo Workspace Data',
      platformAttribution: 'Powered by IBONDA Real Estate Architecture',
      searchPlaceholder: 'Search leads, properties, owners, ref #, or advisors...',
      noSearchResults: 'No matching results found.',
      logout: 'Log Out',
      logoutConfirmTitle: 'Confirm Log Out',
      logoutConfirmDesc: 'Are you sure you want to log out of the agency workspace? (In demo mode, the session will reset.)',
      logoutSuccess: 'Logged out successfully',
      collapseSidebar: 'Collapse sidebar',
      expandSidebar: 'Expand sidebar',
      notificationsShortcut: 'Notifications',
      profileMenu: 'Account menu',
      viewAll: 'View all',
      save: 'Save changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      confirm: 'Confirm',
      reset: 'Reset',
      apply: 'Apply',
      exportCsv: 'Export CSV',
      exportExcel: 'Export Excel',
      exportPdf: 'Export PDF',
      loading: 'Loading...',
      noData: 'No records available',
      actions: 'Actions',
      all: 'All',
      search: 'Search',
      filter: 'Filter',
      sortBy: 'Sort by',
      previous: 'Previous',
      next: 'Next',
      showing: 'Showing',
      of: 'of',
      items: 'items',
      currencyCode: 'MAD',
      sqm: 'm²',
      perMonth: '/ month',
      requiredField: 'Please fill in all required fields',
      selectedCount: 'Selected',
      clearSelection: 'Clear selection',
      demoDataNotice: 'Note: Figures shown are realistic demonstration data until connected to a live backend database.',
    },
    nav: {
      overview: 'Overview',
      leads: 'Leads',
      pipeline: 'Sales Pipeline',
      properties: 'Properties & Inventory',
      owners: 'Property Owners',
      appointments: 'Appointments & Visits',
      team: 'Team',
      conversations: 'Conversations',
      notifications: 'Notifications',
      ads: 'Advertising Analytics',
      reports: 'Reports & Analytics',
      settings: 'Agency Settings',
    },
    navShortDesc: {
      overview: 'Executive daily snapshot of agency performance and KPIs',
      leads: 'Separate views for buyers and renters with full qualification details',
      pipeline: 'Visual Kanban stages separated by Sale and Rent pipelines',
      properties: 'Manage property portfolio, sale/rent listings, and counts',
      owners: 'Manage property owners, commissions, contact details, and portfolios',
      appointments: 'Schedule visits and monitor client attendance with full client info',
      team: 'Manage advisors, permissions, and individual performance',
      conversations: 'Unified messaging inbox across communication channels',
      notifications: 'Real-time alerts for leads, visits, and inventory updates',
      ads: 'Measure ad spend, cost per lead, and campaign attribution',
      reports: 'Management-ready reports exportable to PDF and Excel',
      settings: 'Agency configuration and platform-admin visual identity control',
    },
    languages: {
      ar: 'العربية',
      en: 'English',
      fr: 'Français',
    },
    leadStatuses: {
      new: 'New',
      visit_scheduled: 'Visit Scheduled',
      visited: 'Attended Visit',
      no_show: 'No Show',
      follow_up: 'In Follow-up',
      closed_won: 'Successful Deal',
      not_interested: 'Not Interested',
      closed_lost: 'Incomplete Deal',
    },
    leadSources: {
      facebook_ads: 'Facebook Ads',
      instagram_ads: 'Instagram Ads',
      google_ads: 'Google Ads',
      whatsapp: 'Direct WhatsApp',
      website: 'Website',
      referral: 'Client Referral',
      walk_in: 'Walk-in',
    },
    contactMethods: {
      whatsapp: 'WhatsApp',
      phone_call: 'Phone Call',
    },
    paymentMethods: {
      cash: 'Cash',
      credit: 'Bank Credit / Mortgage',
    },
    deliveryStatuses: {
      off_plan: 'Off-Plan (Under Construction)',
      ready: 'Ready to Move In',
    },
    leadClassifications: {
      vip: 'VIP',
      hot: 'Hot',
      warm: 'Warm',
      cold: 'Cold',
    },
    ownerTypes: {
      individual: 'Individual Owner',
      investor: 'Real Estate Investor',
      developer: 'Property Developer',
      company: 'Company',
    },
    propertyTypes: {
      apartment: 'Apartment',
      villa: 'Villa',
      house: 'House',
      land: 'Land',
      commercial: 'Commercial Space',
      office: 'Office',
      other: 'Other Property',
    },
    transactionTypes: {
      sale: 'Sale',
      rent: 'Rent',
    },
    propertyStatuses: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
      rented: 'Rented',
      unavailable: 'Unavailable',
    },
    appointmentStatuses: {
      scheduled: 'Scheduled',
      confirmed: 'Confirmed',
      attended: 'Client Attended',
      no_show: 'No Show',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled',
    },
    appointmentTypes: {
      in_person_visit: 'On-Site Visit',
      office_meeting: 'Office Meeting',
      virtual_tour: 'Virtual Tour',
      contract_signing: 'Contract Signing',
    },
    employeeRoles: {
      agency_manager: 'Agency Manager',
      sales_manager: 'Sales Manager',
      real_estate_advisor: 'Real Estate Advisor',
      receptionist: 'Receptionist',
      custom: 'Custom Role',
    },
    channels: {
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      facebook: 'Facebook',
      website: 'Website',
      other: 'Other Sources',
    },
    notificationCategories: {
      new_lead: 'New Lead',
      new_appointment: 'New Appointment',
      upcoming_visit: 'Upcoming Visit',
      appointment_confirmed: 'Appointment Confirmed',
      appointment_cancelled: 'Appointment Cancelled',
      client_no_show: 'Client No Show',
      property_updated: 'Property Updated',
      team_activity: 'Team Activity',
      admin_alert: 'Admin Alert',
    },
    adPlatforms: {
      facebook_ads: 'Facebook Ads',
      instagram_ads: 'Instagram Ads',
      google_ads: 'Google Ads',
      other: 'Other Sources',
    },
    days: {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    },
    overview: {
      title: 'Agency Performance Overview',
      subtitle: 'Executive summary of lead generation, scheduled property visits, and closed transactions',
      dateFilters: {
        today: 'Today',
        last7: 'Last 7 Days',
        last30: 'Last 30 Days',
        thisMonth: 'This Month',
        custom: 'Custom Range',
      },
      fromDate: 'From',
      toDate: 'To',
      vsPrevPeriod: 'vs previous period',
      kpis: {
        totalLeads: 'Total Leads',
        newLeads: 'New Leads',
        scheduledVisits: 'Scheduled Visits',
        completedVisits: 'Completed Visits',
        attendedClients: 'Clients Attended',
        noShowClients: 'Clients No-Show',
        successfulDeals: 'Successful Deals',
        activeProperties: 'Active Properties',
      },
      charts: {
        acquisitionTitle: 'Customer Acquisition Over Time',
        acquisitionSub: 'Daily lead volume trend for the selected period',
        visitsTitle: 'Appointments & Property Visits',
        visitsSub: 'Scheduled vs completed visits by week',
        attendanceTitle: 'Attendance vs Absence',
        attendanceSub: 'Client punctuality across scheduled visits',
        funnelTitle: 'Sales Conversion Funnel',
        funnelSub: 'Stage-by-stage progression from inquiry to deal',
        sourcesTitle: 'Lead Sources Distribution',
        sourcesSub: 'Share of incoming leads by acquisition channel',
        monthlyTitle: 'Monthly Performance Overview',
        monthlySub: 'Monthly comparison of new leads vs closed deals',
        attended: 'Attended',
        absent: 'No Show',
        scheduled: 'Scheduled',
        completed: 'Completed',
        leadsLabel: 'Leads',
        dealsLabel: 'Successful Deals',
      },
      widgets: {
        upcomingAppointments: 'Upcoming Appointments',
        latestLeads: 'Latest Leads',
        recentActivity: 'Recent Team Activity',
        topProperties: 'Best-Performing Properties',
        quickActions: 'Quick Actions',
        importantNotifications: 'Important Notifications',
        newLeadBtn: 'Add New Lead',
        newPropertyBtn: 'Add Property',
        newAppointmentBtn: 'Schedule Visit',
        openReportsBtn: 'View Reports',
        viewsCount: 'views',
        inquiriesCount: 'inquiries',
      },
    },
    leads: {
      title: 'Leads Management',
      subtitle: 'Dedicated views for buyers and renters with contact preference, payment method, area, and classification',
      addLead: 'Add New Lead',
      editLead: 'Edit Lead',
      deleteLead: 'Delete Lead',
      deleteConfirm: 'Are you sure you want to delete this lead? This action cannot be undone.',
      emptyTitle: 'No leads match your filters',
      emptyDesc: 'Adjust your search criteria or add a new lead to get started.',
      tabs: {
        all: 'All Leads',
        buyers: 'Buyers (Purchase)',
        renters: 'Renters (Lease)',
      },
      columns: {
        name: 'Client Name',
        phone: 'Phone',
        email: 'Email',
        source: 'Source',
        contactMethod: 'Contact Channel',
        paymentMethod: 'Payment',
        bedrooms: 'Rooms',
        deliveryStatus: 'Readiness',
        desiredArea: 'Desired Area',
        classification: 'Classification',
        property: 'Interested Property',
        budget: 'Budget',
        propertyType: 'Property Type',
        city: 'City / Area',
        employee: 'Assigned Advisor',
        createdAt: 'Registered',
        lastInteraction: 'Last Interaction',
        status: 'Status',
      },
      filters: {
        allStatuses: 'All Statuses',
        allSources: 'All Sources',
        allEmployees: 'All Advisors',
        allCities: 'All Moroccan Cities',
        allClassifications: 'All Classifications',
      },
      bulk: {
        assignEmployee: 'Assign Advisor',
        changeStatus: 'Change Status',
        exportSelected: 'Export Selected',
        deleteSelected: 'Delete Selected',
      },
      profile: {
        title: 'Lead Profile',
        personalInfo: 'Personal Information',
        contactDetails: 'Contact Details',
        preferences: 'Customer Preferences',
        interestedProperty: 'Interested Property',
        assignedEmployee: 'Assigned Advisor',
        internalNotes: 'Internal Notes',
        addNotePlaceholder: 'Add an internal note regarding calls or requirements...',
        addNoteBtn: 'Add Note',
        scheduleFollowup: 'Schedule Follow-up',
        followupDate: 'Follow-up Date',
        saveFollowup: 'Save Follow-up',
        appointmentHistory: 'Appointment History',
        conversationHistory: 'Conversation History',
        activityTimeline: 'Activity Timeline',
        bookVisitBtn: 'Schedule Visit',
        openChatBtn: 'Open Conversation',
      },
      form: {
        name: 'Full Name',
        phone: 'Phone Number',
        email: 'Email Address',
        source: 'Lead Source',
        contactMethod: 'Preferred Contact (WhatsApp / Call)',
        paymentMethod: 'Payment Method',
        bedrooms: 'Bedrooms Requested',
        deliveryStatus: 'Property Readiness',
        desiredArea: 'Desired Area (m²)',
        classification: 'Lead Classification',
        propertyType: 'Requested Property Type',
        transactionType: 'Transaction Type',
        budget: 'Estimated Budget (MAD)',
        city: 'City',
        district: 'District / Area',
        interestedProperty: 'Interested Property',
        assignedEmployee: 'Assigned Advisor',
        status: 'Status',
        preferences: 'Client Requirements & Notes',
        selectProperty: 'Select a property (optional)',
      },
    },
    pipeline: {
      title: 'Sales & Rental Pipeline',
      subtitle: 'Separated Kanban workflows for Buyers and Renters with clear stage metrics',
      tabs: {
        all: 'All Pipelines',
        sale: 'Buyers Pipeline',
        rent: 'Renters Pipeline',
      },
      stages: {
        new: 'New Lead',
        visit_scheduled: 'Visit Scheduled',
        visited: 'Attended Visit',
        no_show: 'No Show',
        follow_up: 'Negotiation & Follow-up',
        closed_won: 'Successful Deal',
        closed_lost: 'Incomplete Deal',
      },
      indicators: {
        totalPipelineValue: 'Active Pipeline Value',
        conversionRate: 'Deal Conversion Rate',
        visitAttendanceRate: 'Visit Attendance Rate',
        avgDealBudget: 'Average Budget',
      },
      moveToStage: 'Move to stage',
      quickNote: 'Quick Note',
      bookVisit: 'Book Visit',
      openProfile: 'Open Profile',
      dragHint: 'Drag cards between columns or use the stage menu on each card',
      emptyStage: 'No leads in this stage',
    },
    properties: {
      title: 'Properties & Inventory',
      subtitle: 'Clear inventory counts with dedicated tabs for For Sale and For Rent listings',
      addProperty: 'Add Property',
      editProperty: 'Edit Property',
      deleteProperty: 'Delete Property',
      deleteConfirm: 'Are you sure you want to remove this property from inventory?',
      gridView: 'Grid View',
      tableView: 'Table View',
      refPrefix: 'REF',
      bedrooms: 'Beds',
      bathrooms: 'Baths',
      area: 'Area',
      views: 'Views',
      tabs: {
        all: 'All Properties',
        sale: 'For Sale',
        rent: 'For Rent',
      },
      stats: {
        total: 'Total Properties',
        available: 'Available Now',
        forSale: 'For Sale',
        forRent: 'For Rent',
        reserved: 'Reserved',
        closed: 'Sold / Rented',
      },
      filters: {
        allTypes: 'All Types',
        allTransactions: 'Sale & Rent',
        allStatuses: 'All Statuses',
        allCities: 'All Moroccan Cities',
        maxPrice: 'Max Price',
      },
      details: {
        title: 'Property Details',
        gallery: 'Image Gallery',
        description: 'Full Description',
        location: 'Location & Address',
        specifications: 'Specifications',
        ownerInfo: 'Owner Information',
        assignedEmployee: 'Assigned Advisor',
        interestedLeads: 'Interested Customers',
        relatedAppointments: 'Related Appointments',
        internalNotes: 'Internal Notes',
        addNotePlaceholder: 'Add note about keys, owner feedback, or negotiation...',
        changeStatus: 'Availability Status',
        noInterestedLeads: 'No leads linked to this property yet.',
        noAppointments: 'No visits scheduled for this property yet.',
      },
      form: {
        title: 'Property Title',
        ref: 'Reference Number',
        type: 'Property Type',
        transactionType: 'Transaction Type',
        price: 'Price (MAD)',
        city: 'City',
        district: 'District / Area',
        address: 'Full Address',
        area: 'Area (m²)',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        status: 'Availability Status',
        ownerSelect: 'Select Existing Owner',
        ownerName: 'Owner Name',
        ownerPhone: 'Owner Phone',
        assignedEmployee: 'Assigned Advisor',
        description: 'Property Description',
        images: 'Property Images',
        uploadImageLabel: 'Upload from device',
        selectPresetImages: 'Or choose from agency gallery',
      },
    },
    owners: {
      title: 'Property Owners & Portfolios',
      subtitle: 'Manage property owners, investors, developers, agreed commission rates, and linked listings',
      addOwner: 'Add Owner',
      editOwner: 'Edit Owner',
      deleteOwner: 'Delete Owner',
      deleteConfirm: 'Are you sure you want to delete this owner record?',
      stats: {
        totalOwners: 'Total Owners',
        totalPropertiesLinked: 'Linked Properties',
        portfolioValue: 'Total Portfolio Value',
        investorsCount: 'Investors & Developers',
      },
      columns: {
        name: 'Owner Name / Company',
        phone: 'Phone',
        email: 'Email',
        city: 'City',
        ownerType: 'Owner Type',
        preferredContact: 'Preferred Contact',
        propertiesCount: 'Properties',
        commissionRate: 'Commission',
        nationalId: 'ID / RC',
      },
      filters: {
        allTypes: 'All Owner Types',
        allCities: 'All Moroccan Cities',
      },
      profile: {
        title: 'Owner Profile & Properties',
        contactAndDetails: 'Details & Terms',
        ownedProperties: 'Properties Owned',
        noProperties: 'No properties currently linked to this owner.',
        notes: 'Owner Notes & Terms',
      },
      form: {
        name: 'Full Name / Company',
        phone: 'Phone Number',
        email: 'Email Address',
        city: 'City',
        ownerType: 'Owner Type',
        preferredContact: 'Preferred Contact Method',
        commissionRate: 'Commission Rate (%)',
        nationalId: 'National ID / Business Reg',
        notes: 'Notes, Key Access & Negotiation Terms',
      },
    },
    appointments: {
      title: 'Appointments & Property Visits',
      subtitle: 'Color-coded visit schedule with clear client details, classification, and contact channel',
      newAppointment: 'Create Appointment',
      editAppointment: 'Edit Appointment',
      rescheduleAppointment: 'Reschedule Appointment',
      cancelAppointment: 'Cancel Appointment',
      cancelConfirm: 'Are you sure you want to cancel this appointment?',
      views: {
        table: 'Appointments Table',
        daily: 'Daily Schedule',
        weekly: 'Weekly Calendar',
        monthly: 'Monthly Calendar',
      },
      stats: {
        total: 'Total Visits',
        upcoming: 'Upcoming Visits',
        completed: 'Completed Visits',
        attended: 'Clients Attended',
        noShow: 'Clients No-Show',
      },
      columns: {
        client: 'Client',
        clientInfo: 'Client Info & Budget',
        phone: 'Phone',
        property: 'Property',
        date: 'Date',
        time: 'Time',
        employee: 'Advisor',
        type: 'Type',
        status: 'Status',
        notes: 'Notes',
      },
      form: {
        lead: 'Select Client',
        property: 'Select Property',
        employee: 'Assigned Advisor',
        date: 'Date',
        time: 'Time',
        type: 'Appointment Type',
        status: 'Status',
        notes: 'Additional Notes',
      },
      quickActions: {
        confirm: 'Confirm',
        markAttended: 'Attended',
        markNoShow: 'No Show',
        reschedule: 'Reschedule',
        cancel: 'Cancel',
      },
      agenda: {
        today: 'Today',
        workingHoursLabel: 'Working Hours',
        closedDayBanner: 'Closed Day — Agency is off on this day',
        closedDayHint: 'You can enable this day or customize hours from Working Hours settings.',
        configureHoursBtn: 'Edit Working Hours',
        outsideHours: 'Outside working hours',
        breakPeriod: 'Midday Break / Unavailable',
        blockedSlot: 'Blocked slot (removed from booking)',
        availableSlot: 'Available slot for visit',
        bookAtTime: 'Schedule at this time',
        disableHour: 'Remove slot',
        enableHour: 'Reopen slot',
        openSlotsCount: 'Open slots',
        bookedCount: 'Booked',
        blockedCount: 'Blocked / Break',
        addForDay: 'Add',
        directWhatsapp: 'Open WhatsApp chat directly',
        directCall: 'Call directly',
      },
    },
    team: {
      title: 'Team Management',
      subtitle: 'Manage real estate advisors, account status, permissions, and individual performance',
      addEmployee: 'Add Employee',
      editEmployee: 'Edit Employee',
      activeAccount: 'Active',
      inactiveAccount: 'Inactive',
      activate: 'Activate Account',
      deactivate: 'Deactivate Account',
      assignedLeadsCount: 'Assigned Leads',
      scheduledVisitsCount: 'Scheduled Visits',
      completedVisitsCount: 'Completed Visits',
      attendanceRate: 'Attendance Rate',
      profile: {
        title: 'Employee Profile & Performance',
        contactInfo: 'Contact & Role Info',
        performance: 'Performance Metrics',
        permissions: 'Access Permissions',
        recentActivities: 'Recent Activity History',
        assignedLeadsList: 'Assigned Leads',
      },
      permissionsLabels: {
        manage_leads: 'Manage Leads',
        manage_properties: 'Manage Properties & Inventory',
        manage_appointments: 'Manage Appointments',
        view_reports: 'View Reports & Analytics',
        manage_team: 'Manage Team Members',
        manage_settings: 'Modify Agency Settings',
        export_data: 'Export Data & Reports',
      },
      form: {
        name: 'Full Name',
        phone: 'Phone Number',
        email: 'Work Email',
        jobTitle: 'Job Title',
        role: 'Role',
        active: 'Account Active Immediately',
      },
    },
    conversations: {
      title: 'Conversations & Communication',
      subtitle: 'Unified agency inbox for inquiries across messaging channels',
      integrationBanner: 'Interface ready for official WhatsApp / Meta API integration. Messages shown are demonstration conversations until channels are connected.',
      unreadOnly: 'Unread Only',
      allChannels: 'All Channels',
      markAsRead: 'Mark as Read',
      replyPlaceholder: 'Type a reply to the client...',
      send: 'Send',
      customerPanel: 'Customer Information',
      interestedProperty: 'Interested Property',
      leadStatus: 'Lead Status',
      assignedEmployee: 'Assigned Advisor',
      internalNotes: 'Quick Internal Notes',
      openFullProfile: 'Open Full Customer Profile',
      bookVisit: 'Schedule Visit',
      noConversationSelected: 'Select a conversation from the list to view messages',
    },
    notifications: {
      title: 'Notification Center',
      subtitle: 'Real-time updates on new leads, upcoming visits, property changes, and team activity',
      unreadCount: 'Unread Notifications',
      markAllRead: 'Mark All as Read',
      markRead: 'Mark as Read',
      unreadOnly: 'Unread Only',
      openRelated: 'Open Related Item',
      emptyTitle: 'No notifications match your filter',
    },
    ads: {
      title: 'Advertising Analytics',
      subtitle: 'Track campaign spend, cost per lead, qualified appointments, and attributed sales',
      demoWarning: 'Important Notice: All advertising spend and campaign metrics shown are demonstration figures until live Meta Ads and Google Ads accounts are connected.',
      kpis: {
        totalSpend: 'Total Ad Spend',
        totalLeads: 'Leads Generated',
        cpl: 'Cost Per Lead (CPL)',
        qualifiedLeads: 'Qualified Leads',
        appointments: 'Appointments Generated',
        costPerAppointment: 'Cost Per Appointment',
        visits: 'Property Visits',
        attributedSales: 'Attributed Sales',
        conversionRate: 'Campaign Conversion Rate',
      },
      charts: {
        leadsByCampaign: 'Leads by Campaign',
        leadsByPlatform: 'Leads by Platform',
        dailyTrends: 'Daily Lead Generation Trend',
        spendAndCpl: 'Spend & CPL Trend',
      },
      table: {
        campaignName: 'Campaign Name',
        platform: 'Platform',
        budget: 'Budget',
        spend: 'Spend',
        leads: 'Leads',
        appointments: 'Appointments',
        cpl: 'Cost / Lead',
        status: 'Status',
      },
      campaignStatuses: {
        active: 'Active',
        paused: 'Paused',
        completed: 'Completed',
      },
    },
    reports: {
      title: 'Reports & Analytics',
      subtitle: 'Executive agency reports prepared for management reviews with PDF and Excel export',
      tabs: {
        leads: 'Lead Reports',
        appointments: 'Appointments Reports',
        properties: 'Property Reports',
        team: 'Team Performance',
        sales: 'Sales Reports',
      },
      leadsSection: {
        totalLeads: 'Total Leads',
        newLeads: 'New Leads',
        conversionRate: 'Conversion Rate',
        bySource: 'Lead Sources Breakdown',
        byEmployee: 'Lead Distribution by Advisor',
      },
      appointmentsSection: {
        total: 'Total Appointments',
        completed: 'Completed Visits',
        attendanceRate: 'Attendance Rate',
        absenceRate: 'Absence Rate',
        byEmployee: 'Appointments by Advisor',
      },
      propertiesSection: {
        available: 'Available',
        reserved: 'Reserved',
        sold: 'Sold',
        rented: 'Rented',
        mostViewed: 'Most Viewed Properties',
        mostRequestedTypes: 'Most Requested Property Types',
      },
      teamSection: {
        employee: 'Advisor',
        leadsHandled: 'Leads Handled',
        visitsCompleted: 'Visits Completed',
        attendanceRate: 'Attendance Rate',
        successfulDeals: 'Successful Deals',
      },
      salesSection: {
        successfulTransactions: 'Successful Transactions',
        totalRevenue: 'Estimated Volume',
        monthlyPerformance: 'Monthly Performance',
        conversionRate: 'Conversion Rate',
      },
    },
    settings: {
      title: 'Agency Settings',
      subtitle: 'Manage agency profile, platform-admin visual branding, working hours, appointment rules, permissions, and security',
      tabs: {
        agency: 'Agency Info',
        identity: 'Visual Identity (Admin Control)',
        hours: 'Working Hours',
        appointments: 'Appointment Settings',
        notifications: 'Notification Rules',
        localization: 'Language & Region',
        permissions: 'Team Permissions',
        security: 'Account & Security',
      },
      agencyForm: {
        name: 'Agency Name',
        tagline: 'Agency Tagline',
        phone: 'Phone Number',
        email: 'Official Email',
        address: 'Office Address',
        city: 'City',
        website: 'Website',
        description: 'Business Description',
        saveSuccess: 'Agency settings saved successfully',
      },
      identityForm: {
        adminControlNotice: 'Platform Admin Visual Control: Only the platform owner/administrator controls and customizes each agency’s visual identity, colors, and logo here.',
        colorPresets: 'Curated Harmonious Color Themes',
        primaryColor: 'Primary Brand Color',
        secondaryColor: 'Secondary Accent Color',
        logoUrl: 'Agency Logo',
        uploadLogo: 'Upload Logo',
        livePreview: 'Live Agency Identity Preview',
        previewCardTitle: 'Custom Branded Card Preview',
        previewButton: 'Primary Action',
      },
      hoursForm: {
        day: 'Day',
        status: 'Status',
        open: 'Opening Time',
        close: 'Closing Time',
        breakTime: 'Break Period',
        hasBreak: 'Midday Break',
        noBreak: 'Continuous Shift',
        weeklySummary: 'Weekly Schedule Summary',
        activeDaysCount: 'Active Working Days',
        weeklyHoursTotal: 'Available Weekly Hours',
        hoursUnit: 'hrs',
        copyMonToAll: 'Apply Monday schedule to all open days',
        copiedToast: 'Monday schedule applied to all active days',
        hourlySlotsTitle: 'Day Hours Control (Click any hour to remove or restore)',
        hourlySlotsHint: 'Remove specific midday hours (lunch, meetings, errands) so they cannot be booked in the agenda.',
        slotOpen: 'Open',
        slotBreak: 'Break',
        slotRemoved: 'Removed',
        excludedPeriodsTitle: 'Custom Excluded Periods During the Day',
        addExcludedPeriod: 'Exclude Period',
        periodStart: 'From',
        periodEnd: 'To',
        periodReason: 'Reason (optional)',
        periodReasonPlaceholder: 'e.g. Lunch, Team sync...',
        removePeriod: 'Remove period',
        holidays: 'Holidays & Closed Dates',
      },
      appointmentsForm: {
        duration: 'Default Visit Duration',
        minutes: 'minutes',
        bookingWindowStart: 'Booking Hours Start',
        bookingWindowEnd: 'Booking Hours End',
        autoConfirm: 'Automatically confirm new appointments',
        rescheduleLimit: 'Minimum notice for rescheduling',
        hoursBefore: 'hours before visit',
        visitReminders: 'Send automated visit reminders',
      },
      notificationsForm: {
        newLead: 'New Lead Alerts',
        appointments: 'Appointment Creation & Updates',
        attendance: 'Visit Attendance & No-Show Alerts',
        teamActivity: 'Team Activity Alerts',
        emailDigest: 'Daily Summary Email Digest',
      },
      localizationForm: {
        language: 'Interface Language',
        timezone: 'Time Zone',
        dateFormat: 'Date Format',
        currency: 'Currency',
        currencyNote: 'Moroccan Dirham (MAD) is configured across all prices and financial reports.',
      },
      securityForm: {
        accountInfo: 'Account Information',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        updatePassword: 'Update Password',
        passwordMismatch: 'Passwords do not match',
        passwordUpdated: 'Password updated successfully (demo mode)',
        twoFactor: 'Enable Two-Factor Authentication (2FA)',
        activeSessions: 'Active Sessions',
        terminateSession: 'Terminate',
        currentSessionBadge: 'Current Session',
      },
    },
    toasts: {
      saved: 'Changes saved successfully',
      leadAdded: 'New lead added successfully',
      leadUpdated: 'Lead details updated',
      leadDeleted: 'Lead removed',
      propertyAdded: 'Property added to inventory',
      propertyUpdated: 'Property details updated',
      propertyDeleted: 'Property removed',
      ownerAdded: 'Property owner added',
      ownerUpdated: 'Owner profile updated',
      ownerDeleted: 'Owner record deleted',
      appointmentCreated: 'Appointment scheduled successfully',
      appointmentUpdated: 'Appointment updated',
      employeeAdded: 'Team member added',
      employeeUpdated: 'Employee profile updated',
      messageSent: 'Message sent',
      exported: 'Export completed successfully',
      noteAdded: 'Internal note added',
      statusUpdated: 'Status updated successfully',
    },
  },

  fr: {
    app: {
      dir: 'ltr',
      demoBadge: 'Données de démonstration',
      platformAttribution: 'Propulsé par l’architecture IBONDA Immobilier',
      searchPlaceholder: 'Rechercher un prospect, bien, propriétaire, référence...',
      noSearchResults: 'Aucun résultat correspondant.',
      logout: 'Déconnexion',
      logoutConfirmTitle: 'Confirmer la déconnexion',
      logoutConfirmDesc: 'Voulez-vous vraiment vous déconnecter de l’espace de votre agence ? (En mode démo, la session sera réinitialisée.)',
      logoutSuccess: 'Déconnexion effectuée',
      collapseSidebar: 'Réduire le menu',
      expandSidebar: 'Développer le menu',
      notificationsShortcut: 'Notifications',
      profileMenu: 'Menu utilisateur',
      viewAll: 'Tout voir',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      close: 'Fermer',
      confirm: 'Confirmer',
      reset: 'Réinitialiser',
      apply: 'Appliquer',
      exportCsv: 'Exporter CSV',
      exportExcel: 'Exporter Excel',
      exportPdf: 'Exporter PDF',
      loading: 'Chargement...',
      noData: 'Aucune donnée disponible',
      actions: 'Actions',
      all: 'Tout',
      search: 'Rechercher',
      filter: 'Filtrer',
      sortBy: 'Trier par',
      previous: 'Précédent',
      next: 'Suivant',
      showing: 'Affichage de',
      of: 'sur',
      items: 'éléments',
      currencyCode: 'MAD',
      sqm: 'm²',
      perMonth: '/ mois',
      requiredField: 'Veuillez remplir tous les champs obligatoires',
      selectedCount: 'Sélectionné(s)',
      clearSelection: 'Effacer la sélection',
      demoDataNotice: 'Remarque : Les chiffres affichés sont des données de démonstration en attente de connexion à une base réelle.',
    },
    nav: {
      overview: 'Vue d’ensemble',
      leads: 'Prospects',
      pipeline: 'Pipeline des ventes',
      properties: 'Biens & Inventaire',
      owners: 'Propriétaires',
      appointments: 'Rendez-vous & Visites',
      team: 'Équipe',
      conversations: 'Conversations',
      notifications: 'Notifications',
      ads: 'Analyse publicitaire',
      reports: 'Rapports & Analyses',
      settings: 'Paramètres de l’agence',
    },
    navShortDesc: {
      overview: 'Tableau de bord exécutif des performances quotidiennes',
      leads: 'Vues dédiées acheteurs et locataires avec qualification complète',
      pipeline: 'Suivi visuel Kanban séparé pour la Vente et la Location',
      properties: 'Gestion du portefeuille, compteurs détaillés et vente/location',
      owners: 'Gestion des propriétaires, commissions et biens associés',
      appointments: 'Planification des visites avec informations complètes du client',
      team: 'Gestion des conseillers, permissions et objectifs',
      conversations: 'Messagerie centralisée multicanal',
      notifications: 'Alertes en temps réel sur les prospects et visites',
      ads: 'Suivi du budget publicitaire et coût par prospect',
      reports: 'Rapports détaillés exportables en PDF et Excel',
      settings: 'Paramètres de l’agence et contrôle administrateur de l’identité',
    },
    languages: {
      ar: 'العربية',
      en: 'English',
      fr: 'Français',
    },
    leadStatuses: {
      new: 'Nouveau',
      visit_scheduled: 'Visite planifiée',
      visited: 'Visite effectuée',
      no_show: 'Absent à la visite',
      follow_up: 'En suivi',
      closed_won: 'Affaire conclue',
      not_interested: 'Non intéressé',
      closed_lost: 'Affaire non aboutie',
    },
    leadSources: {
      facebook_ads: 'Facebook Ads',
      instagram_ads: 'Instagram Ads',
      google_ads: 'Google Ads',
      whatsapp: 'WhatsApp Direct',
      website: 'Site web',
      referral: 'Recommandation',
      walk_in: 'Visite en agence',
    },
    contactMethods: {
      whatsapp: 'WhatsApp',
      phone_call: 'Appel téléphonique',
    },
    paymentMethods: {
      cash: 'Comptant (Cash)',
      credit: 'Crédit bancaire',
    },
    deliveryStatuses: {
      off_plan: 'Sur plan (En construction)',
      ready: 'Prêt / Livré',
    },
    leadClassifications: {
      vip: 'VIP',
      hot: 'Chaud (Hot)',
      warm: 'Tiède (Warm)',
      cold: 'Froid (Cold)',
    },
    ownerTypes: {
      individual: 'Particulier',
      investor: 'Investisseur',
      developer: 'Promoteur immobilier',
      company: 'Entreprise',
    },
    propertyTypes: {
      apartment: 'Appartement',
      villa: 'Villa',
      house: 'Maison',
      land: 'Terrain',
      commercial: 'Local commercial',
      office: 'Bureau',
      other: 'Autre bien',
    },
    transactionTypes: {
      sale: 'Vente',
      rent: 'Location',
    },
    propertyStatuses: {
      available: 'Disponible',
      reserved: 'Réservé',
      sold: 'Vendu',
      rented: 'Loué',
      unavailable: 'Indisponible',
    },
    appointmentStatuses: {
      scheduled: 'Planifié',
      confirmed: 'Confirmé',
      attended: 'Client présent',
      no_show: 'Client absent',
      cancelled: 'Annulé',
      rescheduled: 'Replanifié',
    },
    appointmentTypes: {
      in_person_visit: 'Visite sur place',
      office_meeting: 'Rendez-vous en agence',
      virtual_tour: 'Visite virtuelle',
      contract_signing: 'Signature de contrat',
    },
    employeeRoles: {
      agency_manager: 'Directeur d’agence',
      sales_manager: 'Responsable des ventes',
      real_estate_advisor: 'Conseiller immobilier',
      receptionist: 'Chargé d’accueil',
      custom: 'Rôle personnalisé',
    },
    channels: {
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      facebook: 'Facebook',
      website: 'Site web',
      other: 'Autres sources',
    },
    notificationCategories: {
      new_lead: 'Nouveau prospect',
      new_appointment: 'Nouveau rendez-vous',
      upcoming_visit: 'Visite imminente',
      appointment_confirmed: 'Rendez-vous confirmé',
      appointment_cancelled: 'Rendez-vous annulé',
      client_no_show: 'Absence du client',
      property_updated: 'Bien mis à jour',
      team_activity: 'Activité de l’équipe',
      admin_alert: 'Alerte administrative',
    },
    adPlatforms: {
      facebook_ads: 'Facebook Ads',
      instagram_ads: 'Instagram Ads',
      google_ads: 'Google Ads',
      other: 'Autres sources',
    },
    days: {
      mon: 'Lundi',
      tue: 'Mardi',
      wed: 'Mercredi',
      thu: 'Jeudi',
      fri: 'Vendredi',
      sat: 'Samedi',
      sun: 'Dimanche',
    },
    overview: {
      title: 'Vue d’ensemble de l’agence',
      subtitle: 'Suivi instantané de l’acquisition, des visites immobilières et des ventes conclues',
      dateFilters: {
        today: 'Aujourd’hui',
        last7: '7 derniers jours',
        last30: '30 derniers jours',
        thisMonth: 'Ce mois-ci',
        custom: 'Période personnalisée',
      },
      fromDate: 'Du',
      toDate: 'Au',
      vsPrevPeriod: 'vs période précédente',
      kpis: {
        totalLeads: 'Total des prospects',
        newLeads: 'Nouveaux prospects',
        scheduledVisits: 'Visites planifiées',
        completedVisits: 'Visites effectuées',
        attendedClients: 'Clients présents',
        noShowClients: 'Clients absents',
        successfulDeals: 'Affaires conclues',
        activeProperties: 'Biens actifs',
      },
      charts: {
        acquisitionTitle: 'Acquisition de prospects dans le temps',
        acquisitionSub: 'Évolution quotidienne des demandes sur la période',
        visitsTitle: 'Rendez-vous et visites immobilières',
        visitsSub: 'Visites planifiées vs réalisées par semaine',
        attendanceTitle: 'Présence vs Absence',
        attendanceSub: 'Taux d’assiduité aux rendez-vous de visite',
        funnelTitle: 'Entonnoir de conversion',
        funnelSub: 'Passage des prospects de la demande à la signature',
        sourcesTitle: 'Répartition des sources de prospects',
        sourcesSub: 'Contribution de chaque canal d’acquisition',
        monthlyTitle: 'Performance mensuelle',
        monthlySub: 'Comparaison mensuelle entre prospects et ventes',
        attended: 'Présent',
        absent: 'Absent',
        scheduled: 'Planifiées',
        completed: 'Effectuées',
        leadsLabel: 'Prospects',
        dealsLabel: 'Affaires conclues',
      },
      widgets: {
        upcomingAppointments: 'Prochains rendez-vous',
        latestLeads: 'Derniers prospects',
        recentActivity: 'Activité récente de l’équipe',
        topProperties: 'Biens les plus performants',
        quickActions: 'Actions rapides',
        importantNotifications: 'Notifications importantes',
        newLeadBtn: 'Ajouter un prospect',
        newPropertyBtn: 'Ajouter un bien',
        newAppointmentBtn: 'Planifier une visite',
        openReportsBtn: 'Consulter les rapports',
        viewsCount: 'vues',
        inquiriesCount: 'demandes',
      },
    },
    leads: {
      title: 'Gestion des prospects',
      subtitle: 'Tableaux séparés pour acheteurs et locataires avec canal de contact, paiement, surface et qualification',
      addLead: 'Ajouter un prospect',
      editLead: 'Modifier le prospect',
      deleteLead: 'Supprimer le prospect',
      deleteConfirm: 'Voulez-vous vraiment supprimer ce prospect ? Cette action est irréversible.',
      emptyTitle: 'Aucun prospect ne correspond à vos critères',
      emptyDesc: 'Modifiez vos filtres ou ajoutez un nouveau prospect.',
      tabs: {
        all: 'Tous les prospects',
        buyers: 'Acheteurs (Achat)',
        renters: 'Locataires (Location)',
      },
      columns: {
        name: 'Nom du client',
        phone: 'Téléphone',
        email: 'E-mail',
        source: 'Source',
        contactMethod: 'Contact',
        paymentMethod: 'Paiement',
        bedrooms: 'Chambres',
        deliveryStatus: 'Livraison',
        desiredArea: 'Surface',
        classification: 'Qualification',
        property: 'Bien souhaité',
        budget: 'Budget',
        propertyType: 'Type de bien',
        city: 'Ville / Quartier',
        employee: 'Conseiller',
        createdAt: 'Inscrit le',
        lastInteraction: 'Dernier contact',
        status: 'Statut',
      },
      filters: {
        allStatuses: 'Tous les statuts',
        allSources: 'Toutes les sources',
        allEmployees: 'Tous les conseillers',
        allCities: 'Toutes les villes du Maroc',
        allClassifications: 'Toutes qualifications',
      },
      bulk: {
        assignEmployee: 'Attribuer un conseiller',
        changeStatus: 'Changer le statut',
        exportSelected: 'Exporter la sélection',
        deleteSelected: 'Supprimer la sélection',
      },
      profile: {
        title: 'Fiche détaillée du prospect',
        personalInfo: 'Informations personnelles',
        contactDetails: 'Coordonnées',
        preferences: 'Préférences du client',
        interestedProperty: 'Bien d’intérêt',
        assignedEmployee: 'Conseiller assigné',
        internalNotes: 'Notes internes',
        addNotePlaceholder: 'Ajouter une note interne sur l’appel ou le besoin...',
        addNoteBtn: 'Ajouter une note',
        scheduleFollowup: 'Planifier un suivi',
        followupDate: 'Date de suivi',
        saveFollowup: 'Enregistrer le suivi',
        appointmentHistory: 'Historique des rendez-vous',
        conversationHistory: 'Historique des conversations',
        activityTimeline: 'Chronologie d’activité',
        bookVisitBtn: 'Planifier une visite',
        openChatBtn: 'Ouvrir la conversation',
      },
      form: {
        name: 'Nom complet',
        phone: 'Numéro de téléphone',
        email: 'Adresse e-mail',
        source: 'Source',
        contactMethod: 'Canal de contact (WhatsApp / Appel)',
        paymentMethod: 'Mode de paiement',
        bedrooms: 'Nombre de chambres',
        deliveryStatus: 'État du bien',
        desiredArea: 'Surface souhaitée (m²)',
        classification: 'Classification',
        propertyType: 'Type de bien recherché',
        transactionType: 'Type de transaction',
        budget: 'Budget estimé (MAD)',
        city: 'Ville',
        district: 'Quartier',
        interestedProperty: 'Bien concerné',
        assignedEmployee: 'Conseiller responsable',
        status: 'Statut',
        preferences: 'Critères et notes du client',
        selectProperty: 'Sélectionner un bien (optionnel)',
      },
    },
    pipeline: {
      title: 'Pipeline des ventes & locations',
      subtitle: 'Workflows Kanban distincts pour l’Achat et la Location avec indicateurs chiffrés',
      tabs: {
        all: 'Tout le pipeline',
        sale: 'Pipeline Achat / Vente',
        rent: 'Pipeline Location',
      },
      stages: {
        new: 'Nouveau prospect',
        visit_scheduled: 'Visite planifiée',
        visited: 'Visite effectuée',
        no_show: 'Absent',
        follow_up: 'Négociation & Suivi',
        closed_won: 'Affaire conclue',
        closed_lost: 'Affaire non aboutie',
      },
      indicators: {
        totalPipelineValue: 'Valeur du pipeline actif',
        conversionRate: 'Taux de conversion',
        visitAttendanceRate: 'Taux de présence',
        avgDealBudget: 'Budget moyen',
      },
      moveToStage: 'Déplacer vers',
      quickNote: 'Note rapide',
      bookVisit: 'Planifier visite',
      openProfile: 'Ouvrir fiche',
      dragHint: 'Glissez-déposez les cartes entre les étapes ou utilisez le sélecteur d’étape',
      emptyStage: 'Aucun prospect à cette étape',
    },
    properties: {
      title: 'Biens & Inventaire immobilier',
      subtitle: 'Compteurs détaillés du stock et onglets dédiés pour la Vente et la Location',
      addProperty: 'Ajouter un bien',
      editProperty: 'Modifier le bien',
      deleteProperty: 'Supprimer le bien',
      deleteConfirm: 'Voulez-vous vraiment supprimer ce bien de l’inventaire ?',
      gridView: 'Vue grille',
      tableView: 'Vue tableau',
      refPrefix: 'RÉF',
      bedrooms: 'Chambres',
      bathrooms: 'Salles de bain',
      area: 'Surface',
      views: 'Vues',
      tabs: {
        all: 'Tous les biens',
        sale: 'À vendre',
        rent: 'À louer',
      },
      stats: {
        total: 'Total des biens',
        available: 'Disponibles',
        forSale: 'En vente',
        forRent: 'En location',
        reserved: 'Réservés',
        closed: 'Vendus / Loués',
      },
      filters: {
        allTypes: 'Tous types',
        allTransactions: 'Vente & Location',
        allStatuses: 'Tous statuts',
        allCities: 'Toutes les villes du Maroc',
        maxPrice: 'Prix max',
      },
      details: {
        title: 'Détails du bien',
        gallery: 'Galerie photos',
        description: 'Description complète',
        location: 'Localisation et adresse',
        specifications: 'Caractéristiques',
        ownerInfo: 'Informations du propriétaire',
        assignedEmployee: 'Conseiller responsable',
        interestedLeads: 'Clients intéressés',
        relatedAppointments: 'Visites associées',
        internalNotes: 'Notes internes',
        addNotePlaceholder: 'Ajouter une note sur les clés, le propriétaire ou les visites...',
        changeStatus: 'Statut de disponibilité',
        noInterestedLeads: 'Aucun prospect lié à ce bien pour le moment.',
        noAppointments: 'Aucune visite planifiée pour ce bien.',
      },
      form: {
        title: 'Titre du bien',
        ref: 'Référence',
        type: 'Type de bien',
        transactionType: 'Transaction',
        price: 'Prix (MAD)',
        city: 'Ville',
        district: 'Quartier',
        address: 'Adresse complète',
        area: 'Surface (m²)',
        bedrooms: 'Chambres',
        bathrooms: 'Salles de bain',
        status: 'Disponibilité',
        ownerSelect: 'Choisir un propriétaire enregistré',
        ownerName: 'Nom du propriétaire',
        ownerPhone: 'Téléphone du propriétaire',
        assignedEmployee: 'Conseiller assigné',
        description: 'Description détaillée',
        images: 'Photos du bien',
        uploadImageLabel: 'Importer une image',
        selectPresetImages: 'Ou choisir depuis la galerie de démonstration',
      },
    },
    owners: {
      title: 'Propriétaires & Portefeuilles',
      subtitle: 'Gestion des propriétaires, investisseurs, promoteurs, taux de commission et biens rattachés',
      addOwner: 'Ajouter un propriétaire',
      editOwner: 'Modifier le propriétaire',
      deleteOwner: 'Supprimer le propriétaire',
      deleteConfirm: 'Voulez-vous vraiment supprimer ce propriétaire ?',
      stats: {
        totalOwners: 'Total propriétaires',
        totalPropertiesLinked: 'Biens rattachés',
        portfolioValue: 'Valeur totale',
        investorsCount: 'Investisseurs & Promoteurs',
      },
      columns: {
        name: 'Nom / Société',
        phone: 'Téléphone',
        email: 'E-mail',
        city: 'Ville',
        ownerType: 'Profil',
        preferredContact: 'Contact préféré',
        propertiesCount: 'Biens',
        commissionRate: 'Commission',
        nationalId: 'CIN / RC',
      },
      filters: {
        allTypes: 'Tous les profils',
        allCities: 'Toutes les villes du Maroc',
      },
      profile: {
        title: 'Fiche du propriétaire et ses biens',
        contactAndDetails: 'Coordonnées et conditions',
        ownedProperties: 'Biens enregistrés',
        noProperties: 'Aucun bien rattaché à ce propriétaire.',
        notes: 'Notes et conditions',
      },
      form: {
        name: 'Nom complet / Raison sociale',
        phone: 'Téléphone',
        email: 'E-mail',
        city: 'Ville',
        ownerType: 'Profil du propriétaire',
        preferredContact: 'Canal de contact préféré',
        commissionRate: 'Taux de commission (%)',
        nationalId: 'CIN / Registre de commerce',
        notes: 'Notes, accès clés et conditions',
      },
    },
    appointments: {
      title: 'Rendez-vous & Visites',
      subtitle: 'Planning codé par couleur avec informations complètes du client, qualification et canal',
      newAppointment: 'Nouveau rendez-vous',
      editAppointment: 'Modifier le rendez-vous',
      rescheduleAppointment: 'Replanifier',
      cancelAppointment: 'Annuler le rendez-vous',
      cancelConfirm: 'Confirmez-vous l’annulation de ce rendez-vous ?',
      views: {
        table: 'Tableau',
        daily: 'Planning du jour',
        weekly: 'Calendrier hebdomadaire',
        monthly: 'Calendrier mensuel',
      },
      stats: {
        total: 'Total visites',
        upcoming: 'Visites à venir',
        completed: 'Visites effectuées',
        attended: 'Clients présents',
        noShow: 'Clients absents',
      },
      columns: {
        client: 'Client',
        clientInfo: 'Profil & Budget',
        phone: 'Téléphone',
        property: 'Bien',
        date: 'Date',
        time: 'Heure',
        employee: 'Conseiller',
        type: 'Type',
        status: 'Statut',
        notes: 'Notes',
      },
      form: {
        lead: 'Client',
        property: 'Bien immobilier',
        employee: 'Conseiller',
        date: 'Date',
        time: 'Heure',
        type: 'Type de rendez-vous',
        status: 'Statut',
        notes: 'Notes complémentaires',
      },
      quickActions: {
        confirm: 'Confirmer',
        markAttended: 'Présent',
        markNoShow: 'Absent',
        reschedule: 'Replanifier',
        cancel: 'Annuler',
      },
      agenda: {
        today: 'Aujourd’hui',
        workingHoursLabel: 'Horaires',
        closedDayBanner: 'Jour fermé — Agence fermée ce jour',
        closedDayHint: 'Vous pouvez activer ce jour ou ajuster les horaires dans les paramètres.',
        configureHoursBtn: 'Modifier les horaires',
        outsideHours: 'Hors horaires d’ouverture',
        breakPeriod: 'Pause / Indisponible',
        blockedSlot: 'Créneau supprimé (fermé)',
        availableSlot: 'Créneau disponible',
        bookAtTime: 'Planifier à cette heure',
        disableHour: 'Retirer ce créneau',
        enableHour: 'Rouvrir',
        openSlotsCount: 'Créneaux libres',
        bookedCount: 'Réservés',
        blockedCount: 'Fermés / Pause',
        addForDay: 'Ajouter',
        directWhatsapp: 'Ouvrir WhatsApp directement',
        directCall: 'Appeler directement',
      },
    },
    team: {
      title: 'Gestion de l’équipe',
      subtitle: 'Suivez les performances des conseillers, gérez les comptes et les permissions',
      addEmployee: 'Ajouter un collaborateur',
      editEmployee: 'Modifier le profil',
      activeAccount: 'Actif',
      inactiveAccount: 'Inactif',
      activate: 'Activer le compte',
      deactivate: 'Désactiver le compte',
      assignedLeadsCount: 'Prospects assignés',
      scheduledVisitsCount: 'Visites planifiées',
      completedVisitsCount: 'Visites réalisées',
      attendanceRate: 'Taux de présence',
      profile: {
        title: 'Profil et performance du collaborateur',
        contactInfo: 'Coordonnées et poste',
        performance: 'Indicateurs de performance',
        permissions: 'Autorisations d’accès',
        recentActivities: 'Historique d’activité récente',
        assignedLeadsList: 'Prospects suivis',
      },
      permissionsLabels: {
        manage_leads: 'Gérer les prospects',
        manage_properties: 'Gérer les biens',
        manage_appointments: 'Gérer les rendez-vous',
        view_reports: 'Consulter les rapports',
        manage_team: 'Gérer l’équipe',
        manage_settings: 'Modifier les paramètres',
        export_data: 'Exporter les données',
      },
      form: {
        name: 'Nom complet',
        phone: 'Téléphone',
        email: 'E-mail professionnel',
        jobTitle: 'Intitulé du poste',
        role: 'Rôle',
        active: 'Compte actif immédiatement',
      },
    },
    conversations: {
      title: 'Conversations & Messagerie',
      subtitle: 'Boîte de réception unifiée pour les échanges clients multi-canaux',
      integrationBanner: 'Interface prête pour l’intégration officielle WhatsApp / Meta API. Les messages affichés sont des démonstrations en attente de connexion.',
      unreadOnly: 'Non lus uniquement',
      allChannels: 'Tous les canaux',
      markAsRead: 'Marquer comme lu',
      replyPlaceholder: 'Rédiger une réponse au client...',
      send: 'Envoyer',
      customerPanel: 'Informations client',
      interestedProperty: 'Bien souhaité',
      leadStatus: 'Statut du prospect',
      assignedEmployee: 'Conseiller assigné',
      internalNotes: 'Notes internes',
      openFullProfile: 'Ouvrir le profil complet',
      bookVisit: 'Planifier une visite',
      noConversationSelected: 'Sélectionnez une conversation pour afficher les messages',
    },
    notifications: {
      title: 'Centre de notifications',
      subtitle: 'Alertes sur les nouveaux prospects, rendez-vous, biens et activités de l’équipe',
      unreadCount: 'Notifications non lues',
      markAllRead: 'Tout marquer comme lu',
      markRead: 'Marquer comme lu',
      unreadOnly: 'Non lues uniquement',
      openRelated: 'Ouvrir l’élément lié',
      emptyTitle: 'Aucune notification correspondante',
    },
    ads: {
      title: 'Analyse des campagnes publicitaires',
      subtitle: 'Suivi des dépenses, coût par prospect, rendez-vous générés et ventes attribuées',
      demoWarning: 'Note importante : Les chiffres publicitaires affichés sont des données de démonstration tant que les comptes Meta Ads et Google Ads ne sont pas connectés.',
      kpis: {
        totalSpend: 'Dépenses totales',
        totalLeads: 'Prospects générés',
        cpl: 'Coût par prospect (CPL)',
        qualifiedLeads: 'Prospects qualifiés',
        appointments: 'Rendez-vous générés',
        costPerAppointment: 'Coût par rendez-vous',
        visits: 'Visites effectuées',
        attributedSales: 'Ventes attribuées',
        conversionRate: 'Taux de conversion',
      },
      charts: {
        leadsByCampaign: 'Prospects par campagne',
        leadsByPlatform: 'Prospects par plateforme',
        dailyTrends: 'Tendance quotidienne des prospects',
        spendAndCpl: 'Dépenses et évolution du CPL',
      },
      table: {
        campaignName: 'Campagne',
        platform: 'Plateforme',
        budget: 'Budget',
        spend: 'Dépensé',
        leads: 'Prospects',
        appointments: 'Rendez-vous',
        cpl: 'Coût / Prospect',
        status: 'Statut',
      },
      campaignStatuses: {
        active: 'Active',
        paused: 'En pause',
        completed: 'Terminée',
      },
    },
    reports: {
      title: 'Rapports & Analyses avancées',
      subtitle: 'Rapports exécutifs complets exportables en PDF et Excel pour vos réunions d’agence',
      tabs: {
        leads: 'Rapports prospects',
        appointments: 'Rapports rendez-vous',
        properties: 'Rapports biens',
        team: 'Performance équipe',
        sales: 'Rapports ventes',
      },
      leadsSection: {
        totalLeads: 'Total prospects',
        newLeads: 'Nouveaux prospects',
        conversionRate: 'Taux de conversion',
        bySource: 'Sources des prospects',
        byEmployee: 'Répartition par conseiller',
      },
      appointmentsSection: {
        total: 'Total rendez-vous',
        completed: 'Visites réalisées',
        attendanceRate: 'Taux de présence',
        absenceRate: 'Taux d’absence',
        byEmployee: 'Rendez-vous par conseiller',
      },
      propertiesSection: {
        available: 'Disponibles',
        reserved: 'Réservés',
        sold: 'Vendus',
        rented: 'Loués',
        mostViewed: 'Biens les plus consultés',
        mostRequestedTypes: 'Types de biens les plus demandés',
      },
      teamSection: {
        employee: 'Conseiller',
        leadsHandled: 'Prospects traités',
        visitsCompleted: 'Visites réalisées',
        attendanceRate: 'Taux de présence',
        successfulDeals: 'Ventes conclues',
      },
      salesSection: {
        successfulTransactions: 'Transactions réussies',
        totalRevenue: 'Volume estimé',
        monthlyPerformance: 'Performance mensuelle',
        conversionRate: 'Taux de conclusion',
      },
    },
    settings: {
      title: 'Paramètres de l’agence',
      subtitle: 'Informations de l’agence, contrôle administrateur de l’identité visuelle, horaires et sécurité',
      tabs: {
        agency: 'Informations agence',
        identity: 'Identité visuelle (Admin)',
        hours: 'Horaires de travail',
        appointments: 'Paramètres visites',
        notifications: 'Notifications',
        localization: 'Langue & Région',
        permissions: 'Permissions équipe',
        security: 'Compte & Sécurité',
      },
      agencyForm: {
        name: 'Nom de l’agence',
        tagline: 'Slogan de l’agence',
        phone: 'Téléphone',
        email: 'E-mail officiel',
        address: 'Adresse',
        city: 'Ville',
        website: 'Site web',
        description: 'Description de l’activité',
        saveSuccess: 'Paramètres de l’agence enregistrés',
      },
      identityForm: {
        adminControlNotice: 'Contrôle administrateur de la plateforme : seul l’administrateur système gère et personnalise l’identité visuelle, les couleurs et le logo de chaque agence.',
        colorPresets: 'Palettes harmonieuses prédéfinies',
        primaryColor: 'Couleur principale',
        secondaryColor: 'Couleur secondaire',
        logoUrl: 'Logo de l’agence',
        uploadLogo: 'Changer le logo',
        livePreview: 'Aperçu en direct de l’identité',
        previewCardTitle: 'Carte d’aperçu personnalisée',
        previewButton: 'Action principale',
      },
      hoursForm: {
        day: 'Jour',
        status: 'Statut',
        open: 'Ouverture',
        close: 'Fermeture',
        breakTime: 'Pause',
        hasBreak: 'Pause déjeuner',
        noBreak: 'Journée continue',
        weeklySummary: 'Résumé hebdomadaire',
        activeDaysCount: 'Jours actifs',
        weeklyHoursTotal: 'Heures disponibles / sem.',
        hoursUnit: 'h',
        copyMonToAll: 'Appliquer l’horaire du lundi aux jours ouverts',
        copiedToast: 'Horaire du lundi appliqué aux jours actifs',
        hourlySlotsTitle: 'Heures de la journée (cliquez pour retirer ou rétablir)',
        hourlySlotsHint: 'Désactivez certaines heures en milieu de journée (pause, réunion) pour les bloquer dans l’agenda.',
        slotOpen: 'Libre',
        slotBreak: 'Pause',
        slotRemoved: 'Retiré',
        excludedPeriodsTitle: 'Plages horaires exclues en journée',
        addExcludedPeriod: 'Exclure une plage',
        periodStart: 'De',
        periodEnd: 'À',
        periodReason: 'Motif (optionnel)',
        periodReasonPlaceholder: 'Ex: Réunion d’équipe...',
        removePeriod: 'Supprimer',
        holidays: 'Jours fériés et fermetures',
      },
      appointmentsForm: {
        duration: 'Durée standard d’une visite',
        minutes: 'minutes',
        bookingWindowStart: 'Début des créneaux',
        bookingWindowEnd: 'Fin des créneaux',
        autoConfirm: 'Confirmation automatique des rendez-vous',
        rescheduleLimit: 'Délai minimum de replanification',
        hoursBefore: 'heures avant',
        visitReminders: 'Envoyer des rappels de visite',
      },
      notificationsForm: {
        newLead: 'Alertes nouveaux prospects',
        appointments: 'Alertes rendez-vous',
        attendance: 'Alertes présence / absence',
        teamActivity: 'Activité de l’équipe',
        emailDigest: 'Résumé quotidien par e-mail',
      },
      localizationForm: {
        language: 'Langue par défaut',
        timezone: 'Fuseau horaire',
        dateFormat: 'Format de date',
        currency: 'Devise',
        currencyNote: 'Le Dirham marocain (MAD) est la devise appliquée aux prix et rapports.',
      },
      securityForm: {
        accountInfo: 'Informations du compte',
        changePassword: 'Changer le mot de passe',
        currentPassword: 'Mot de passe actuel',
        newPassword: 'Nouveau mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        updatePassword: 'Mettre à jour',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        passwordUpdated: 'Mot de passe mis à jour (mode démo)',
        twoFactor: 'Authentification à deux facteurs (2FA)',
        activeSessions: 'Sessions actives',
        terminateSession: 'Déconnecter',
        currentSessionBadge: 'Session actuelle',
      },
    },
    toasts: {
      saved: 'Enregistré avec succès',
      leadAdded: 'Prospect ajouté avec succès',
      leadUpdated: 'Prospect mis à jour',
      leadDeleted: 'Prospect supprimé',
      propertyAdded: 'Bien ajouté à l’inventaire',
      propertyUpdated: 'Bien mis à jour',
      propertyDeleted: 'Bien supprimé',
      ownerAdded: 'Propriétaire ajouté',
      ownerUpdated: 'Propriétaire mis à jour',
      ownerDeleted: 'Propriétaire supprimé',
      appointmentCreated: 'Rendez-vous planifié',
      appointmentUpdated: 'Rendez-vous mis à jour',
      employeeAdded: 'Collaborateur ajouté',
      employeeUpdated: 'Profil mis à jour',
      messageSent: 'Message envoyé',
      exported: 'Exportation réussie',
      noteAdded: 'Note interne ajoutée',
      statusUpdated: 'Statut mis à jour',
    },
  },
};

export function formatMAD(amount: number, lang: Language): string {
  const formatted = new Intl.NumberFormat(lang === 'fr' ? 'fr-MA' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${translations[lang].app.currencyCode}`;
}

export function formatNumber(num: number, lang: Language): string {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-MA' : 'en-US').format(num);
}

export function formatShortDate(isoOrDate: string, lang: Language): string {
  if (!isoOrDate) return '—';
  const date = new Date(isoOrDate);
  if (Number.isNaN(date.getTime())) return isoOrDate;
  const locale = lang === 'ar' ? 'ar-MA-u-nu-latn' : lang === 'fr' ? 'fr-MA' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
