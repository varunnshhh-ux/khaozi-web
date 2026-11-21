import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin, Navigation, Star, ShieldCheck, Tag, Plus,
  Search, AlertTriangle, Store, Radio, Sparkles, Utensils,
  X, Map, List, Crosshair, Smartphone, Monitor, Heart,
  Share2, Compass, Users, Trash2
} from 'lucide-react';

// ============================================================================
// CONSTANTS & LOCALIZATION
// ============================================================================
const STORAGE_KEY = 'khaozi_vendors_v1';
const CHANNEL_NAME = 'khaozi_live_sync_channel';

const FOOD_CATEGORIES = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Golgappe / Pani Puri', emoji: '🫧' },
  { name: 'Chaat', emoji: '🥙' },
  { name: 'Momos', emoji: '🥟' },
  { name: 'Chowmein / Chinese', emoji: '🍜' },
  { name: 'Chai & Coffee', emoji: '☕' },
  { name: 'Rolls', emoji: '🌯' },
  { name: 'Paratha', emoji: '🫓' },
  { name: 'Dosa / Idli', emoji: '🥞' },
  { name: 'Juice & Shakes', emoji: '🥤' },
  { name: 'Kulfi / Ice Cream', emoji: '🍨' }
];

const INITIAL_VENDORS = [
  {
    id: 'v_1',
    name: 'Sharma Ji Special Chaat & Golgappe',
    ownerName: 'Rajesh Sharma',
    phone: '9876543210',
    category: 'Golgappe / Pani Puri',
    landmark: 'Metro Gate No. 2, Raja Park Chowk',
    lat: 26.8982,
    lng: 75.8295,
    isVeg: true,
    rating: 4.9,
    followersCount: 142,
    crowdStatus: 'Thodi Bheed',
    planType: 'FOUNDER_10',
    subscriptionStatus: 'trial_active',
    lastLocationUpdatedAt: Date.now() - 3 * 60 * 1000,
    profileViews: 320,
    directionRequests: 98,
    menu: [
      { name: 'Suji Golgappe (6 pcs)', price: 30 },
      { name: 'Dahi Bhalla Papdi Chaat', price: 60 },
      { name: 'Aloo Tikki Chole', price: 50 }
    ],
    offers: [
      {
        id: 'off_1',
        title: '2 Extra Golgappe Free!',
        discount: 'FREE EXTRA',
        code: 'CHATORE',
        description: 'Order 2 plates of Dahi Puri and get 2 extra golgappe free!'
      }
    ]
  },
  {
    id: 'v_2',
    name: 'Pahadi Tandoori Momos Express',
    ownerName: 'Tenzin Norbu',
    phone: '9811223344',
    category: 'Momos',
    landmark: 'GT Bazaar Main Gate, Malviya Nagar',
    lat: 26.8549,
    lng: 75.8053,
    isVeg: false,
    rating: 4.8,
    followersCount: 215,
    crowdStatus: 'Full Rush',
    planType: 'FOUNDER_10',
    subscriptionStatus: 'trial_active',
    lastLocationUpdatedAt: Date.now() - 8 * 60 * 1000,
    profileViews: 510,
    directionRequests: 174,
    menu: [
      { name: 'Veg Steam Momos (8 pcs)', price: 60 },
      { name: 'Paneer Tandoori Momos', price: 110 },
      { name: 'Kurkure Momos Platter', price: 120 }
    ],
    offers: [
      {
        id: 'off_2',
        title: '₹20 OFF on Tandoori Platter',
        discount: '₹20 OFF',
        code: 'MOMO20',
        description: 'Valid on evening orders between 5 PM and 9 PM.'
      }
    ]
  },
  {
    id: 'v_3',
    name: 'Kullad Chai & Bun Maska Junction',
    ownerName: 'Rameshwar Yadav',
    phone: '9988776655',
    category: 'Chai & Coffee',
    landmark: 'College Gate No. 1, Bapu Nagar',
    lat: 26.8891,
    lng: 75.8021,
    isVeg: true,
    rating: 4.9,
    followersCount: 310,
    crowdStatus: 'No Wait',
    planType: 'FOUNDER_10',
    subscriptionStatus: 'trial_active',
    lastLocationUpdatedAt: Date.now() - 1 * 60 * 1000,
    profileViews: 440,
    directionRequests: 132,
    menu: [
      { name: 'Adrak Elaichi Kullad Chai', price: 20 },
      { name: 'Amul Butter Bun Maska', price: 35 },
      { name: 'Cold Coffee with Crush', price: 60 }
    ],
    offers: []
  }
];

const TRANSLATIONS = {
  EN: {
    discover: 'Discover',
    offers: 'Offers',
    vendorHub: 'Vendor Hub',
    admin: 'Admin',
    heroTitle: 'Aaj kya khana hai?',
    heroSubtitle: 'Find live moving street-food carts near your metro gate, college & chowk.',
    useMyLocation: 'Use My Location',
    searchPlaceholder: 'Search golgappe, momos, chai or chowk...',
    pureVeg: 'Pure Veg',
    raastaDekho: 'Raasta Dekho',
    reportStall: 'Report Issue'
  },
  HI: {
    discover: 'खोजें',
    offers: 'ऑफ़र्स',
    vendorHub: 'ठेला पोर्टल',
    admin: 'एडमिन',
    heroTitle: 'आज क्या खाना है?',
    heroSubtitle: 'अपने पास के मेट्रो गेट, कॉलेज और चौक पर लगे लाइव ठेले तुरंत खोजें।',
    useMyLocation: 'मेरी लोकेशन देखें',
    searchPlaceholder: 'गोलगप्पे, मोमोज, चाय या चौक खोजें...',
    pureVeg: 'शुद्ध शाकाहारी',
    raastaDekho: 'रास्ता देखो',
    reportStall: 'शिकायत करें'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatFreshness(timestamp, nowMs) {
  if (!timestamp) return { text: 'Location pending', level: 'stale' };
  const diffMins = Math.max(0, Math.floor((nowMs - timestamp) / 60000));
  if (diffMins === 0) return { text: 'Updated just now', level: 'fresh' };
  if (diffMins <= 30) return { text: `Updated ${diffMins}m ago`, level: 'fresh' };
  if (diffMins <= 120) return { text: `Updated ${diffMins}m ago`, level: 'warning' };
  return { text: `Updated ${Math.floor(diffMins / 60)}h ago`, level: 'stale' };
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Language & Viewport States
  const [lang, setLang] = useState('EN');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [toastMessage, setToastMessage] = useState(null);

  // Vendors State with LocalStorage + Multi-Tab Live Sync
  const [vendors, setVendors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VENDORS));
    return INITIAL_VENDORS;
  });

  // Customer Auth & Geolocation States
  const [customerAuth, setCustomerAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('khaozi_customer_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [userLocation, setUserLocation] = useState(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [followedVendorIds, setFollowedVendorIds] = useState(() => {
    try {
      const saved = localStorage.getItem('khaozi_follows');
      return saved ? JSON.parse(saved) : ['v_1'];
    } catch {
      return ['v_1'];
    }
  });

  // Filtering & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [favoritesOnlyFilter, setFavoritesOnlyFilter] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [viewMode, setViewMode] = useState('list');

  // Modals & Active Selections
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [pendingDirectionVendor, setPendingDirectionVendor] = useState(null);
  const [reportModalVendor, setReportModalVendor] = useState(null);
  const [reportReason, setReportReason] = useState('Wrong / Old Location');
  const [reportDetails, setReportDetails] = useState('');

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    ownerName: '',
    phone: '',
    category: 'Golgappe / Pani Puri',
    landmark: '',
    isVeg: true
  });

  // Vendor Portal States
  const [managingVendorId, setManagingVendorId] = useState('v_1');
  const [vendorLandmarkInput, setVendorLandmarkInput] = useState('');
  const [isBroadcastingGps, setIsBroadcastingGps] = useState(false);
  const [newMenuItemName, setNewMenuItemName] = useState('');
  const [newMenuItemPrice, setNewMenuItemPrice] = useState('');
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferDesc, setNewOfferDesc] = useState('');

  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.EN[key] || key;

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Live Clock Tick every 15s for Freshness Timestamps
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  // Multi-tab real-time sync listener
  useEffect(() => {
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data?.type === 'SYNC_VENDORS' && Array.isArray(event.data.payload)) {
          setVendors(event.data.payload);
        }
      };
    }
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setVendors(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Persist & broadcast vendor updates
  const persistVendors = (nextVendors) => {
    setVendors(nextVendors);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextVendors));
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bc.postMessage({ type: 'SYNC_VENDORS', payload: nextVendors });
      bc.close();
    }
  };

  const updateVendorInDB = async (vendorId, patch) => {
    const updated = vendors.map((v) => (v.id === vendorId ? { ...v, ...patch } : v));
    persistVendors(updated);
  };

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId) || null,
    [vendors, selectedVendorId]
  );

  const managingVendor = useMemo(
    () => vendors.find((v) => v.id === managingVendorId) || vendors[0] || null,
    [vendors, managingVendorId]
  );

  const foundingStallsCount = useMemo(
    () => vendors.filter((v) => v.planType === 'FOUNDER_10').length,
    [vendors]
  );
  const foundingSlotsRemaining = Math.max(0, 10 - foundingStallsCount);

  // Processed, Filtered & Sorted Vendors
  const processedVendors = useMemo(() => {
    const processed = vendors
      .filter((v) => {
        if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
        if (vegOnlyFilter && !v.isVeg) return false;
        if (favoritesOnlyFilter && !followedVendorIds.includes(v.id)) return false;

        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = v.name.toLowerCase().includes(q);
          const matchCat = v.category.toLowerCase().includes(q);
          const matchLandmark = v.landmark.toLowerCase().includes(q);
          const matchMenu = (v.menu || []).some((m) => m.name.toLowerCase().includes(q));
          if (!matchName && !matchCat && !matchLandmark && !matchMenu) return false;
        }
        return true;
      })
      .map((v) => {
        const distanceKm = userLocation
          ? calculateDistanceKm(userLocation.lat, userLocation.lng, v.lat, v.lng)
          : null;
        return {
          ...v,
          distanceKm,
          freshness: formatFreshness(v.lastLocationUpdatedAt, nowMs)
        };
      });

    if (sortBy === 'distance' && userLocation) {
      processed.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    } else if (sortBy === 'rating') {
      processed.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'freshness') {
      processed.sort((a, b) => (b.lastLocationUpdatedAt || 0) - (a.lastLocationUpdatedAt || 0));
    }

    return processed;
  }, [
    vendors,
    selectedCategory,
    vegOnlyFilter,
    favoritesOnlyFilter,
    followedVendorIds,
    searchQuery,
    userLocation,
    sortBy,
    nowMs
  ]);

  // All active offers
  const allOffers = useMemo(() => {
    const list = [];
    vendors.forEach((v) => {
      (v.offers || []).forEach((o) => {
        list.push({ ...o, vendor: v });
      });
    });
    return list;
  }, [vendors]);

  // Customer Login Handler
  const handleCustomerAuthSubmit = (e) => {
    e.preventDefault();
    if (!authInput.trim()) return;
    const authData = { contact: authInput.trim(), loggedInAt: Date.now() };
    setCustomerAuth(authData);
    localStorage.setItem('khaozi_customer_auth', JSON.stringify(authData));
    setShowAuthModal(false);
    setAuthInput('');
    showToast(lang === 'HI' ? 'लॉगिन सफल! अब आप लाइव GPS देख सकते हैं' : 'Logged in! GPS & Directions unlocked', 'success');

    if (pendingDirectionVendor) {
      const target = pendingDirectionVendor;
      setPendingDirectionVendor(null);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}`;
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Trigger Browser Geolocation
  const getUserLiveLocation = () => {
    if (!customerAuth) {
      setShowAuthModal(true);
      return;
    }
    if (!navigator.geolocation) {
      setUserLocation({ lat: 26.8982, lng: 75.8295 });
      showToast(lang === 'HI' ? 'मार्केट सेंटर लोकेशन सेट की गई' : 'Using bazaar center location', 'info');
      return;
    }
    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocatingUser(false);
        showToast(lang === 'HI' ? 'लाइव लोकेशन अपडेट हो गई!' : 'Live GPS location updated!', 'success');
      },
      () => {
        setUserLocation({ lat: 26.8982, lng: 75.8295 });
        setIsLocatingUser(false);
        showToast(lang === 'HI' ? 'डिफ़ॉल्ट मार्केट लोकेशन सेट की गई' : 'Using default bazaar center location', 'info');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Select Vendor & Increment Profile Views
  const handleSelectVendor = (vendor) => {
    setSelectedVendorId(vendor.id);
    updateVendorInDB(vendor.id, { profileViews: (vendor.profileViews || 0) + 1 });
  };

  // Get Directions (with Customer Auth Gate)
  const handleGetDirections = (vendor) => {
    if (!customerAuth) {
      setPendingDirectionVendor(vendor);
      setShowAuthModal(true);
      return;
    }
    updateVendorInDB(vendor.id, { directionRequests: (vendor.directionRequests || 0) + 1 });
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lng}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // Share Stall Location via WhatsApp / Web Share API
  const handleShareStall = (vendor, e) => {
    if (e) e.stopPropagation();
    const topDish = vendor.menu?.[0] ? `${vendor.menu[0].name} (₹${vendor.menu[0].price})` : vendor.category;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${vendor.lat},${vendor.lng}`;
    const shareText =
      lang === 'HI'
        ? `🔥 भाई *${vendor.name}* अभी *${vendor.landmark}* पर लगा है!\nखास: ${topDish}\nरास्ता देखें: ${mapsUrl}\n— KHAOZI Live Street Food`
        : `🔥 *${vendor.name}* is LIVE right now at *${vendor.landmark}*!\nMust try: ${topDish}\nDirections: ${mapsUrl}\n— Discovered on KHAOZI`;

    if (navigator.share) {
      navigator.share({ title: vendor.name, text: shareText }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
    showToast(lang === 'HI' ? 'WhatsApp पर शेयर करने के लिए तैयार!' : 'Opening WhatsApp share...', 'success');
  };

  // Register New Stall
  const handleRegisterStall = (e) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.ownerName.trim() || !regForm.landmark.trim()) return;

    const isFounder = foundingSlotsRemaining > 0;
    const newStall = {
      id: `v_${Date.now()}`,
      name: regForm.name.trim(),
      ownerName: regForm.ownerName.trim(),
      phone: regForm.phone.trim(),
      category: regForm.category,
      landmark: regForm.landmark.trim(),
      lat: 26.89 + (Math.random() - 0.5) * 0.03,
      lng: 75.81 + (Math.random() - 0.5) * 0.03,
      isVeg: regForm.isVeg,
      rating: 5.0,
      followersCount: 1,
      crowdStatus: 'No Wait',
      planType: isFounder ? 'FOUNDER_10' : 'REGULAR_399',
      subscriptionStatus: 'trial_active',
      lastLocationUpdatedAt: Date.now(),
      profileViews: 1,
      directionRequests: 0,
      menu: [{ name: `Special ${regForm.category}`, price: 50 }],
      offers: []
    };

    persistVendors([newStall, ...vendors]);
    setManagingVendorId(newStall.id);
    setRegForm({ name: '', ownerName: '', phone: '', category: 'Golgappe / Pani Puri', landmark: '', isVeg: true });
    setActiveTab('vendor');
    showToast(
      isFounder
        ? '🎉 Congratulations! Founding Stall Slot unlocked (3 Months FREE)!'
        : '✅ Stall Registered Live on KHAOZI!',
      'success'
    );
  };

  // Vendor "I'M HERE" GPS Broadcast
  const handleVendorImHereBroadcast = (vendor) => {
    if (!vendor) return;
    if (vendor.subscriptionStatus === 'expired') {
      showToast('Subscription expired! Renew ₹399/mo to broadcast live GPS.', 'error');
      return;
    }

    setIsBroadcastingGps(true);
    const nextLandmark = vendorLandmarkInput.trim() || vendor.landmark;

    const finishBroadcast = (lat, lng) => {
      updateVendorInDB(vendor.id, {
        lat,
        lng,
        landmark: nextLandmark,
        lastLocationUpdatedAt: Date.now()
      });
      setVendorLandmarkInput('');
      setIsBroadcastingGps(false);
      showToast(lang === 'HI' ? '📍 लाइव लोकेशन पब्लिश हो गई!' : '📍 Live GPS Location Broadcasted!', 'success');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => finishBroadcast(pos.coords.latitude, pos.coords.longitude),
        () => finishBroadcast(vendor.lat, vendor.lng),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      finishBroadcast(vendor.lat, vendor.lng);
    }
  };

  // Update Crowd / Rush Meter Status
  const handleUpdateCrowdStatus = async (statusLevel) => {
    if (!managingVendor) return;
    await updateVendorInDB(managingVendor.id, { crowdStatus: statusLevel });
    showToast(
      lang === 'HI' ? `भीड़ स्टेटस अपडेट हो गया: ${statusLevel}` : `Crowd status updated: ${statusLevel}`,
      'success'
    );
  };

  // Add Menu Item in Vendor Dashboard
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!managingVendor || !newMenuItemName.trim() || !newMenuItemPrice) return;
    const updatedMenu = [
      ...(managingVendor.menu || []),
      { name: newMenuItemName.trim(), price: Number(newMenuItemPrice) }
    ];
    await updateVendorInDB(managingVendor.id, { menu: updatedMenu });
    setNewMenuItemName('');
    setNewMenuItemPrice('');
    showToast(lang === 'HI' ? 'मेनू में नई डिश जुड़ गई!' : 'New dish added to live menu!', 'success');
  };

  // Remove Menu Item
  const handleRemoveMenuItem = async (indexToRemove) => {
    if (!managingVendor) return;
    const updatedMenu = (managingVendor.menu || []).filter((_, idx) => idx !== indexToRemove);
    await updateVendorInDB(managingVendor.id, { menu: updatedMenu });
    showToast(lang === 'HI' ? 'डिश हटा दी गई' : 'Menu item removed', 'info');
  };

  // Publish New Offer in Vendor Dashboard
  const handlePublishOffer = async (e) => {
    e.preventDefault();
    if (!managingVendor || !newOfferTitle.trim() || !newOfferDiscount.trim()) return;
    const newOfferObj = {
      id: `off_${Date.now()}`,
      title: newOfferTitle.trim(),
      discount: newOfferDiscount.trim().toUpperCase(),
      code: (newOfferCode.trim() || 'KHAOZI').toUpperCase(),
      description: newOfferDesc.trim() || 'Limited time live stall special offer!'
    };
    const updatedOffers = [newOfferObj, ...(managingVendor.offers || [])];
    await updateVendorInDB(managingVendor.id, { offers: updatedOffers });
    setNewOfferTitle('');
    setNewOfferDiscount('');
    setNewOfferCode('');
    setNewOfferDesc('');
    showToast(lang === 'HI' ? 'नया ऑफर लाइव हो गया!' : 'New offer published live!', 'success');
  };

  // Toggle Follow / Favorite Vendor
  const toggleFollowVendor = (vendorId, e) => {
    if (e) e.stopPropagation();
    const isFollowing = followedVendorIds.includes(vendorId);
    const updated = isFollowing
      ? followedVendorIds.filter((id) => id !== vendorId)
      : [...followedVendorIds, vendorId];
    setFollowedVendorIds(updated);
    localStorage.setItem('khaozi_follows', JSON.stringify(updated));

    const targetVendor = vendors.find((v) => v.id === vendorId);
    if (targetVendor) {
      const nextFollowers = Math.max(0, (targetVendor.followersCount || 0) + (isFollowing ? -1 : 1));
      updateVendorInDB(vendorId, { followersCount: nextFollowers });
    }
    showToast(
      isFollowing
        ? lang === 'HI'
          ? 'पसंदीदा से हटाया गया'
          : 'Removed from saved stalls'
        : lang === 'HI'
        ? 'पसंदीदा में सेव किया गया! लाइव अलर्ट चालू'
        : 'Saved! You will see live updates',
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 font-sans selection:bg-amber-300">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border-2 text-xs font-black flex items-center gap-2 transition-all ${
            toastMessage.type === 'error'
              ? 'bg-red-600 text-white border-red-300'
              : 'bg-[#2B1B17] text-amber-300 border-amber-400'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* VIEWPORT CONTAINER (DESKTOP OR MOBILE PHONE PREVIEW) */}
      <div
        className={
          isMobileFrame
            ? 'max-w-[420px] mx-auto my-4 border-[10px] border-slate-900 rounded-[44px] shadow-2xl overflow-hidden bg-[#FFFDF7] min-h-[820px] flex flex-col justify-between relative'
            : 'min-h-screen flex flex-col'
        }
      >
        <div>
          {/* TOP ANNOUNCEMENT BAR */}
          <div className="bg-[#F4A900] text-[#2B1B17] text-[11px] sm:text-xs font-black py-1.5 px-3 text-center border-b border-[#2B1B17]/20">
            {lang === 'HI'
              ? '🎉 पहले 10 स्टॉल्स के लिए 3 महीने बिल्कुल FREE! उसके बाद सिर्फ ₹399/महीना'
              : '🎉 Founding Offer: First 10 Stalls get 3 Months FREE! ₹399/mo thereafter'}
          </div>

          {/* MAIN HEADER */}
          <header className="sticky top-0 z-30 bg-[#FFF8EB]/95 backdrop-blur-md border-b-2 border-[#2B1B17] px-3 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('discover')}>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#D9381E] border-2 border-[#2B1B17] flex items-center justify-center text-amber-300 font-black text-lg shadow">
                  K
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#2B1B17] leading-none">
                    KHAOZI
                  </h1>
                  <p className="text-[10px] font-bold text-[#D9381E] tracking-wide">
                    {lang === 'HI' ? 'लाइव स्ट्रीट फूड' : 'LIVE STREET FOOD'}
                  </p>
                </div>
              </div>

              {/* DESKTOP TABS */}
              {!isMobileFrame && (
                <nav className="hidden md:flex items-center gap-1.5 bg-amber-100/80 p-1 rounded-2xl border border-amber-300">
                  {[
                    { id: 'discover', label: t('discover') },
                    { id: 'offers', label: t('offers') },
                    { id: 'vendor', label: t('vendorHub') },
                    { id: 'admin', label: t('admin') }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#2B1B17] text-amber-300 shadow'
                          : 'text-slate-700 hover:bg-amber-200/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              )}

              {/* RIGHT CONTROLS: LANG + REGISTER/LOGIN */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
                  className="px-2.5 py-1.5 rounded-xl border-2 border-[#2B1B17] bg-white text-[11px] font-black text-[#2B1B17] hover:bg-amber-100"
                >
                  {lang === 'EN' ? 'हिंदी' : 'EN'}
                </button>

                <button
                  onClick={() => setShowRoleModal(true)}
                  className="bg-[#D9381E] hover:bg-red-700 text-white border-2 border-[#2B1B17] px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black shadow flex items-center gap-1"
                >
                  <Store className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {customerAuth
                      ? customerAuth.contact
                      : lang === 'HI'
                      ? 'स्टॉल रजिस्टर / लॉगिन'
                      : 'Register Stall / Login'}
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT BODY */}
          <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 pb-24">
            {/* ======================================================== */}
            {/* TAB 1: DISCOVER / LIVE STREET STALLS                     */}
            {/* ======================================================== */}
            {activeTab === 'discover' && (
              <div className="space-y-4">
                {/* HERO BANNER & SEARCH */}
                <div className="bg-gradient-to-br from-[#2B1B17] via-[#4A2511] to-[#D9381E] rounded-3xl p-4 sm:p-6 text-white shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
                  <div className="relative z-10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {lang === 'HI' ? '● लाइव स्ट्रीट फूड रडार' : '● LIVE STREET FOOD RADAR'}
                      </span>
                      <button
                        onClick={getUserLiveLocation}
                        disabled={isLocatingUser}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <Crosshair className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
                        <span>
                          {userLocation ? (lang === 'HI' ? 'लोकेशन एक्टिव' : 'GPS Active') : t('useMyLocation')}
                        </span>
                      </button>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-3xl font-black tracking-tight text-amber-300">
                        {t('heroTitle')}
                      </h2>
                      <p className="text-xs sm:text-sm text-amber-100/90 mt-0.5">{t('heroSubtitle')}</p>
                    </div>

                    {/* SEARCH BAR + QUICK FILTER TOGGLES */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t('searchPlaceholder')}
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div className="flex gap-2 justify-between sm:justify-start">
                        <button
                          onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                          className={`px-3 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border transition-all ${
                            vegOnlyFilter
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>{t('pureVeg')}</span>
                        </button>

                        <button
                          onClick={() => setFavoritesOnlyFilter(!favoritesOnlyFilter)}
                          className={`px-3 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border transition-all ${
                            favoritesOnlyFilter
                              ? 'bg-red-600 text-white border-red-300 shadow-lg'
                              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${favoritesOnlyFilter ? 'fill-white' : 'text-red-300'}`} />
                          <span>
                            {lang === 'HI' ? 'पसंदीदा' : 'Saved'} ({followedVendorIds.length})
                          </span>
                        </button>

                        <div className="bg-black/30 p-1 rounded-2xl flex items-center border border-white/20">
                          <button
                            onClick={() => setViewMode('list')}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                              viewMode === 'list' ? 'bg-amber-400 text-slate-900' : 'text-white/80'
                            }`}
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewMode('map')}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                              viewMode === 'map' ? 'bg-amber-400 text-slate-900' : 'text-white/80'
                            }`}
                          >
                            <Map className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CATEGORY PILLS & SORT BAR */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                    {FOOD_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap flex items-center gap-1.5 border transition-all ${
                          selectedCategory === cat.name
                            ? 'bg-[#2B1B17] text-amber-300 border-amber-400 shadow-md'
                            : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="hidden sm:block bg-white border border-amber-200 rounded-2xl px-3 py-2 text-xs font-black text-slate-700 outline-none"
                  >
                    <option value="distance">Sort: Nearest</option>
                    <option value="freshness">Sort: Just Updated</option>
                    <option value="rating">Sort: Top Rated</option>
                  </select>
                </div>

                {/* MAP OR LIST VIEW */}
                {viewMode === 'map' ? (
                  <div className="bg-white rounded-3xl border border-amber-200 p-4 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-[#D9381E]" />
                        <span>{lang === 'HI' ? 'लाइव स्ट्रीट मैप व्यू' : 'Live Street Bazaar Radar'}</span>
                      </h3>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {processedVendors.length} Live Stalls
                      </span>
                    </div>
                    <div className="relative h-72 sm:h-96 rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-50 border-2 border-dashed border-amber-300 overflow-hidden p-4 flex flex-wrap gap-3 items-center justify-center">
                      {processedVendors.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => handleSelectVendor(v)}
                          className="bg-white hover:bg-amber-50 border-2 border-[#2B1B17] px-3 py-2 rounded-2xl shadow-md flex items-center gap-2 text-left transition-transform hover:scale-105"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <div>
                            <p className="text-xs font-black text-slate-900">{v.name}</p>
                            <p className="text-[10px] text-slate-500">{v.landmark}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      isMobileFrame
                        ? 'grid grid-cols-1 gap-4'
                        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                    }
                  >
                    {processedVendors.length === 0 ? (
                      <div className="col-span-full bg-white p-10 rounded-3xl text-center border-2 border-dashed border-slate-200">
                        <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-700">Koi stall nahi mila!</h3>
                        <p className="text-sm text-slate-500 mb-4">
                          Try clearing your search query or category filters.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                            setVegOnlyFilter(false);
                            setFavoritesOnlyFilter(false);
                          }}
                          className="bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    ) : (
                      processedVendors.map((vendor) => (
                        <div
                          key={vendor.id}
                          onClick={() => handleSelectVendor(vendor)}
                          className="bg-white rounded-3xl border border-amber-100 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden group border-b-4 border-b-amber-500 active:scale-[0.99]"
                        >
                          <div className="p-4 sm:p-5">
                            {/* TOP BADGES */}
                            <div className="flex items-center justify-between gap-1.5 mb-2.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                                    vendor.freshness.level === 'fresh'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                                  }`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  {vendor.freshness.text}
                                </span>

                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    vendor.crowdStatus === 'Full Rush'
                                      ? 'bg-red-100 text-red-700'
                                      : vendor.crowdStatus === 'Thodi Bheed'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-sky-100 text-sky-700'
                                  }`}
                                >
                                  {vendor.crowdStatus || 'No Wait'}
                                </span>
                              </div>

                              <div className="flex items-center gap-0.5 shrink-0">
                                <button
                                  onClick={(e) => handleShareStall(vendor, e)}
                                  className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full transition-colors"
                                  title="Share on WhatsApp"
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => toggleFollowVendor(vendor.id, e)}
                                  className="text-red-500 hover:scale-125 transition-transform p-1"
                                  title="Favorite Stall"
                                >
                                  <Heart
                                    className={`w-5 h-5 ${
                                      followedVendorIds.includes(vendor.id)
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>

                            {/* STALL TITLE & OWNER */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#D9381E] transition-colors">
                                  {vendor.name}
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold">
                                  {vendor.category} • {vendor.ownerName}
                                </p>
                              </div>
                              <div className="bg-amber-100 text-amber-900 px-2 py-1 rounded-xl text-xs font-black flex items-center gap-1 shrink-0">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>{vendor.rating || '4.8'}</span>
                              </div>
                            </div>

                            {/* LIVE LANDMARK */}
                            <div className="mt-3 p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <p className="font-bold text-slate-800">{vendor.landmark}</p>
                                {vendor.distanceKm !== null && (
                                  <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                                    {vendor.distanceKm < 1
                                      ? `${Math.round(vendor.distanceKm * 1000)}m away`
                                      : `${vendor.distanceKm.toFixed(1)} km away`}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* TOP MENU PREVIEW */}
                            {vendor.menu && vendor.menu.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {vendor.menu.slice(0, 3).map((item, i) => (
                                  <span
                                    key={i}
                                    className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold"
                                  >
                                    {item.name} • <span className="text-[#D9381E]">₹{item.price}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* CARD ACTION BAR */}
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-500">
                              {vendor.followersCount || 0} {lang === 'HI' ? 'फ़ॉलोअर्स' : 'Followers'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGetDirections(vendor);
                              }}
                              className="bg-[#2B1B17] hover:bg-[#D9381E] text-amber-300 hover:text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>{t('raastaDekho')}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: OFFERS & DEALS                                    */}
            {/* ======================================================== */}
            {activeTab === 'offers' && (
              <div className="space-y-4">
                <div className="bg-[#2B1B17] text-white p-5 rounded-3xl border-2 border-amber-400">
                  <h2 className="text-xl font-black text-amber-300 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    <span>{lang === 'HI' ? 'आज के धमाकेदार स्ट्रीट ऑफर्स' : 'Live Street Food Offers'}</span>
                  </h2>
                  <p className="text-xs text-amber-100/80 mt-1">
                    {lang === 'HI'
                      ? 'सीधे ठेले पर कोड दिखाएं और छूट पाएं'
                      : 'Show coupon code directly at the live stall'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allOffers.length === 0 ? (
                    <div className="col-span-full bg-white p-8 rounded-3xl text-center text-xs font-bold text-slate-500 border border-slate-200">
                      No active offers right now. Check back soon!
                    </div>
                  ) : (
                    allOffers.map((offer, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-5 rounded-3xl border-2 border-dashed border-[#D9381E] shadow-sm flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="bg-red-100 text-[#D9381E] text-xs font-black px-3 py-1 rounded-full">
                              {offer.discount}
                            </span>
                            <span className="text-xs font-mono font-black bg-amber-100 text-slate-900 px-2.5 py-1 rounded-lg border border-amber-300">
                              CODE: {offer.code}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 mt-2">{offer.title}</h3>
                          <p className="text-xs text-slate-600 mt-1">{offer.description}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">{offer.vendor.name}</span>
                          <button
                            onClick={() => handleSelectVendor(offer.vendor)}
                            className="text-xs font-black text-[#D9381E] hover:underline"
                          >
                            View Stall →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: REGISTER STALL (FOUNDING 10 + ₹399/MO)            */}
            {/* ======================================================== */}
            {activeTab === 'register' && (
              <div className="max-w-xl mx-auto bg-white p-5 sm:p-7 rounded-3xl border-2 border-[#2B1B17] shadow-xl space-y-4">
                <div className="bg-amber-100 border border-amber-400 p-3.5 rounded-2xl">
                  <p className="text-xs font-black text-[#2B1B17]">
                    {foundingSlotsRemaining > 0
                      ? `🎁 Founding Stall Offer: ${foundingSlotsRemaining} / 10 Free Slots Left (3 Months ₹0, then ₹399/mo)`
                      : '💼 Standard Vendor Plan: ₹399/month (Unlimited Live GPS Broadcasts)'}
                  </p>
                </div>

                <h2 className="text-xl font-black text-slate-900">
                  {lang === 'HI' ? 'अपना स्टॉल रजिस्टर करें' : 'Register Your Street Stall'}
                </h2>

                <form onSubmit={handleRegisterStall} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stall Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sharma Ji Special Chaat"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Owner Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={regForm.ownerName}
                        onChange={(e) => setRegForm({ ...regForm, ownerName: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Food Category</label>
                    <select
                      value={regForm.category}
                      onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-amber-500 bg-white"
                    >
                      {FOOD_CATEGORIES.filter((c) => c.name !== 'All').map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Usual Landmark / Chowk *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metro Gate No. 2, Main Market"
                      value={regForm.landmark}
                      onChange={(e) => setRegForm({ ...regForm, landmark: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="regIsVeg"
                      type="checkbox"
                      checked={regForm.isVeg}
                      onChange={(e) => setRegForm({ ...regForm, isVeg: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <label htmlFor="regIsVeg" className="font-bold text-slate-700">
                      100% Pure Vegetarian Stall
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#D9381E] hover:bg-red-700 text-white font-black py-3.5 rounded-2xl text-sm shadow-lg"
                  >
                    {lang === 'HI' ? 'स्टॉल रजिस्टर करें →' : 'Launch My Stall Live →'}
                  </button>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: VENDOR DASHBOARD ("I'M HERE" + MENU + OFFERS)     */}
            {/* ======================================================== */}
            {activeTab === 'vendor' && managingVendor && (
              <div className="space-y-5">
                {/* VENDOR SELECTOR & PLAN BADGE */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Active Stall Portal</label>
                    <select
                      value={managingVendor.id}
                      onChange={(e) => setManagingVendorId(e.target.value)}
                      className="text-base font-black text-slate-900 bg-transparent outline-none cursor-pointer"
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.landmark})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-3 py-1.5 rounded-full ${
                        managingVendor.subscriptionStatus === 'expired'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {managingVendor.planType === 'FOUNDER_10'
                        ? 'Founding Stall • 3 Mo FREE'
                        : 'Standard Plan • ₹399/mo'}
                    </span>
                  </div>
                </div>

                {/* GIANT "I'M HERE" GPS BROADCAST BUTTON */}
                <div className="bg-gradient-to-r from-[#2B1B17] to-[#4A2511] p-6 rounded-3xl text-white border-2 border-amber-400 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-amber-300">
                        {lang === 'HI' ? 'लाइव लोकेशन ब्रॉडकास्ट' : 'Live Stall GPS Broadcast'}
                      </h3>
                      <p className="text-xs text-amber-100/80">
                        Current: {managingVendor.landmark} •{' '}
                        {formatFreshness(managingVendor.lastLocationUpdatedAt, nowMs).text}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Update landmark note (e.g. Gate 3 ke paas)"
                      value={vendorLandmarkInput}
                      onChange={(e) => setVendorLandmarkInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-white text-slate-900 text-xs font-bold outline-none"
                    />
                    <button
                      onClick={() => handleVendorImHereBroadcast(managingVendor)}
                      disabled={isBroadcastingGps || managingVendor.subscriptionStatus === 'expired'}
                      className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <Radio className={`w-4 h-4 ${isBroadcastingGps ? 'animate-spin' : ''}`} />
                      <span>{lang === 'HI' ? 'मैं यहीं हूँ (I’M HERE)' : 'I’M HERE NOW (BROADCAST GPS)'}</span>
                    </button>
                  </div>
                </div>

                {/* LIVE CROWD / RUSH STATUS METER */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D9381E]" />
                      <span>{lang === 'HI' ? 'अभी स्टॉल पर भीड़ कैसी है?' : 'Live Crowd / Rush Status'}</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      Current: {managingVendor.crowdStatus || 'No Wait'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'No Wait', hi: 'खाली है' },
                      { label: 'Thodi Bheed', hi: 'थोड़ी भीड़' },
                      { label: 'Full Rush', hi: 'फुल भीड़' }
                    ].map((item) => {
                      const active = (managingVendor.crowdStatus || 'No Wait') === item.label;
                      return (
                        <button
                          key={item.label}
                          onClick={() => handleUpdateCrowdStatus(item.label)}
                          className={`py-2.5 px-2 rounded-2xl text-xs font-black border-2 transition-all ${
                            active
                              ? 'bg-[#2B1B17] text-amber-300 border-amber-400 shadow'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          {lang === 'HI' ? item.hi : item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MANAGE LIVE MENU & PUBLISH OFFERS */}
                <div className={isMobileFrame ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#D9381E]" />
                      <span>{lang === 'HI' ? 'मेनू और रेट अपडेट करें' : 'Live Menu & ₹ Pricing'}</span>
                    </h3>
                    <form onSubmit={handleAddMenuItem} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Dish name (e.g. Paneer Momos)"
                        value={newMenuItemName}
                        onChange={(e) => setNewMenuItemName(e.target.value)}
                        className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500"
                      />
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="₹ Price"
                        value={newMenuItemPrice}
                        onChange={(e) => setNewMenuItemPrice(e.target.value)}
                        className="w-24 p-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500"
                      />
                      <button type="submit" className="bg-[#2B1B17] text-amber-300 font-black px-3.5 rounded-xl text-xs">
                        + Add
                      </button>
                    </form>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {(managingVendor.menu || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-amber-50/70 px-3 py-2 rounded-xl border border-amber-100 text-xs"
                        >
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-[#D9381E]">₹{item.price}</span>
                            <button
                              onClick={() => handleRemoveMenuItem(idx)}
                              className="text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#D9381E]" />
                      <span>{lang === 'HI' ? 'नया ऑफर डालें' : 'Publish Live Stall Offer'}</span>
                    </h3>
                    <form onSubmit={handlePublishOffer} className="space-y-2.5 text-xs">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Offer Title (e.g. Evening Chai Combo)"
                          value={newOfferTitle}
                          onChange={(e) => setNewOfferTitle(e.target.value)}
                          className="flex-1 p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="20% OFF / ₹10 OFF"
                          value={newOfferDiscount}
                          onChange={(e) => setNewOfferDiscount(e.target.value)}
                          className="w-28 p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Code (e.g. CHAI20)"
                          value={newOfferCode}
                          onChange={(e) => setNewOfferCode(e.target.value)}
                          className="w-32 p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500 uppercase"
                        />
                        <input
                          type="text"
                          placeholder="Short details..."
                          value={newOfferDesc}
                          onChange={(e) => setNewOfferDesc(e.target.value)}
                          className="flex-1 p-2.5 border border-slate-300 rounded-xl outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#D9381E] hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow"
                      >
                        {lang === 'HI' ? 'ऑफर लाइव करें' : 'Publish Offer Now'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 5: ADMIN SUBSCRIPTION & GOVERNANCE PANEL             */}
            {/* ======================================================== */}
            {activeTab === 'admin' && (
              <div className="space-y-4">
                <div className="bg-[#2B1B17] text-white p-5 rounded-3xl border-2 border-amber-400 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-amber-300">Admin Governance & Subscriptions</h2>
                    <p className="text-xs text-amber-100/80">
                      Founding Stalls: {foundingStallsCount}/10 • Active Paid (₹399/mo):{' '}
                      {vendors.filter((v) => v.subscriptionStatus === 'active').length}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {vendors.map((v) => (
                      <div key={v.id} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-black text-slate-900">{v.name}</p>
                          <p className="text-slate-500">
                            {v.ownerName} • {v.planType === 'FOUNDER_10' ? 'Founder (3 Mo Free)' : '₹399/mo Plan'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={v.subscriptionStatus || 'trial_active'}
                            onChange={(e) => updateVendorInDB(v.id, { subscriptionStatus: e.target.value })}
                            className="border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold bg-slate-50"
                          >
                            <option value="trial_active">Trial Active (₹0)</option>
                            <option value="active">Paid Active (₹399/mo)</option>
                            <option value="expired">Expired (Lock GPS)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav
          className={`${
            isMobileFrame ? 'sticky bottom-0' : 'md:hidden fixed bottom-0 left-0 right-0'
          } z-30 bg-[#2B1B17] text-white border-t-2 border-amber-400 px-2 py-2 flex items-center justify-around`}
        >
          {[
            { id: 'discover', icon: Compass, label: lang === 'HI' ? 'खोजें' : 'Discover' },
            { id: 'offers', icon: Tag, label: lang === 'HI' ? 'ऑफ़र्स' : 'Offers' },
            { id: 'register', icon: Plus, label: lang === 'HI' ? 'जोड़ें' : 'Add Stall', highlight: true },
            { id: 'vendor', icon: Radio, label: lang === 'HI' ? 'ठेला' : 'Vendor' },
            { id: 'admin', icon: ShieldCheck, label: 'Admin' }
          ].map((item) => {
            const IconComp = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-black transition-all ${
                  item.highlight
                    ? 'bg-[#D9381E] text-white -mt-5 px-3.5 py-2.5 rounded-2xl border-2 border-amber-300 shadow-lg'
                    : active
                    ? 'text-amber-300'
                    : 'text-slate-300'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FLOATING DESKTOP / PHONE PREVIEW SWITCHER */}
      <button
        onClick={() => setIsMobileFrame(!isMobileFrame)}
        className="hidden md:flex fixed bottom-5 right-5 z-40 bg-[#2B1B17] hover:bg-[#D9381E] text-amber-300 hover:text-white border-2 border-amber-400 px-4 py-2.5 rounded-full text-xs font-black shadow-2xl items-center gap-2 transition-all"
      >
        {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        <span>{isMobileFrame ? 'Desktop Full View' : 'Phone App View'}</span>
      </button>

      {/* ROLE SELECTION MODAL (CUSTOMER LOGIN OR REGISTER STALL) */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl border-2 border-[#2B1B17] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {lang === 'HI' ? 'आप कौन हैं?' : 'Welcome to KHAOZI'}
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setShowAuthModal(true);
                }}
                className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-left transition-all"
              >
                <p className="font-black text-sm text-slate-900">
                  {customerAuth ? `✅ Logged in: ${customerAuth.contact}` : '🍔 Customer Login / Sign Up'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unlock live GPS distance, Google Maps directions & saved stall alerts.
                </p>
              </button>

              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setActiveTab('register');
                }}
                className="p-4 rounded-2xl border-2 border-[#D9381E] bg-red-50 hover:bg-red-100 text-left transition-all"
              >
                <p className="font-black text-sm text-[#D9381E]">🛒 Register Your Stall (Vendor)</p>
                <p className="text-xs text-slate-700 mt-0.5">
                  {foundingSlotsRemaining > 0
                    ? `First 10 stalls get 3 Months FREE (${foundingSlotsRemaining} slots left)!`
                    : 'Only ₹399/month for unlimited live location updates.'}
                </p>
              </button>

              {customerAuth && (
                <button
                  onClick={() => {
                    setCustomerAuth(null);
                    localStorage.removeItem('khaozi_customer_auth');
                    setShowRoleModal(false);
                    showToast('Logged out successfully', 'info');
                  }}
                  className="text-xs font-bold text-red-600 hover:underline text-center pt-1"
                >
                  Logout Customer Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER AUTH GATE MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl border-2 border-[#2B1B17] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {lang === 'HI' ? 'लोकेशन के लिए लॉगिन करें' : 'Quick Customer Login'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'HI'
                ? 'लाइव दूरी देखने और ठेले का रास्ता खोलने के लिए मोबाइल नंबर या ईमेल डालें।'
                : 'Enter your mobile number or email to unlock live GPS distance & Google Maps directions.'}
            </p>
            <form onSubmit={handleCustomerAuthSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Mobile Number or Email"
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full bg-[#D9381E] text-white font-black py-3 rounded-2xl text-xs shadow-lg"
              >
                {lang === 'HI' ? 'आगे बढ़ें →' : 'Continue & Unlock GPS →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REPORT STALL MODAL */}
      {reportModalVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl border-2 border-[#2B1B17] p-5 space-y-3 shadow-2xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Report: {reportModalVendor.name}</h3>
              <button onClick={() => setReportModalVendor(null)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white"
            >
              <option>Wrong / Old Location</option>
              <option>Stall Closed Today</option>
              <option>Incorrect Prices</option>
            </select>
            <textarea
              rows={2}
              placeholder="Any extra details..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
            />
            <button
              onClick={() => {
                setReportModalVendor(null);
                setReportDetails('');
                showToast('Report submitted to Admin!', 'success');
              }}
              className="w-full bg-red-600 text-white font-black py-2.5 rounded-xl"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}

      {/* STALL DETAIL MODAL */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-[#2B1B17] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-[#2B1B17] text-white p-4 sm:p-5 flex items-start justify-between gap-2 shrink-0">
              <div>
                <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                  {formatFreshness(selectedVendor.lastLocationUpdatedAt, nowMs).text}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-amber-300 mt-1.5">{selectedVendor.name}</h3>
                <p className="text-xs text-amber-100/80">{selectedVendor.landmark}</p>
              </div>
              <button
                onClick={() => setSelectedVendorId(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-black text-slate-900 mb-2">Live Menu & Prices</h4>
                <div className="space-y-1.5">
                  {(selectedVendor.menu || []).map((m, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100 font-bold"
                    >
                      <span>{m.name}</span>
                      <span className="text-[#D9381E]">₹{m.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={() => setReportModalVendor(selectedVendor)}
                className="text-xs text-red-500 hover:underline flex items-center gap-1 font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> {t('reportStall')}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleShareStall(selectedVendor, e)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => handleGetDirections(selectedVendor)}
                  className="bg-[#D9381E] hover:bg-red-700 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>{t('raastaDekho')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}