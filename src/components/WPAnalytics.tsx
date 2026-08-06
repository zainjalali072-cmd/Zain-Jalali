import React, { useState } from "react";
import { CMSData } from "../cmsStore";
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Clock, 
  Compass, 
  Laptop, 
  Globe2, 
  Layers, 
  Settings, 
  Zap, 
  Radio, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface WPAnalyticsProps {
  cmsData: CMSData;
  onSave: (updatedData: CMSData) => void;
}

export default function WPAnalytics({ cmsData, onSave }: WPAnalyticsProps) {
  const [reportPeriod, setReportPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"traffic" | "search" | "integration">("traffic");

  // Form states for integration settings
  const [integrationForm, setIntegrationForm] = useState({
    ga4Id: cmsData.integrations?.ga4Id || "",
    gscId: cmsData.integrations?.gscId || "",
    gtmId: cmsData.integrations?.gtmId || "",
    fbPixelId: cmsData.integrations?.fbPixelId || "",
    clarityId: cmsData.integrations?.clarityId || "",
    isConnected: cmsData.integrations?.isConnected ?? true
  });

  const handleSaveIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...cmsData,
      integrations: {
        ...integrationForm,
        isConnected: true
      }
    });
    alert("Google Analytics & Search Console credentials verified & connected successfully!");
  };

  // Seeded mock historical data for reports (responsive to report period)
  const getPeriodMultiplier = () => {
    if (reportPeriod === "daily") return 0.05;
    if (reportPeriod === "weekly") return 0.25;
    if (reportPeriod === "yearly") return 12.0;
    return 1.0; // monthly standard
  };

  const mult = getPeriodMultiplier();
  const rawVisitors = cmsData.analyticsData?.totalVisitors || 12450;
  const rawViews = cmsData.analyticsData?.pageViews || 42100;
  const rawSessions = cmsData.analyticsData?.sessions || 15800;

  const stats = {
    totalVisitors: Math.round(rawVisitors * mult),
    uniqueVisitors: Math.round((cmsData.analyticsData?.uniqueVisitors || 8900) * mult),
    returningVisitors: Math.round((cmsData.analyticsData?.returningVisitors || 3550) * mult),
    pageViews: Math.round(rawViews * mult),
    sessions: Math.round(rawSessions * mult),
    avgSessionDuration: cmsData.analyticsData?.avgSessionDuration || "4m 12s",
    bounceRate: cmsData.analyticsData?.bounceRate || "38.5%",
    realTime: cmsData.analyticsData?.realTimeVisitors || 42
  };

  const searchStats = {
    clicks: Math.round((cmsData.searchPerformance?.totalClicks || 3240) * mult),
    impressions: Math.round((cmsData.searchPerformance?.totalImpressions || 48900) * mult),
    ctr: cmsData.searchPerformance?.averageCtr || "6.63%",
    position: cmsData.searchPerformance?.averagePosition || 8.4,
    indexedPages: 18,
    crawlErrors: 0
  };

  // Top Search Queries list
  const topKeywords = [
    { query: "learn tajweed online", clicks: 820, impressions: 5200, ctr: "15.7%", position: 1.2 },
    { query: "online quran class uk", clicks: 610, impressions: 4100, ctr: "14.8%", position: 2.1 },
    { query: "female tajweed tutor", clicks: 450, impressions: 3800, ctr: "11.8%", position: 1.8 },
    { query: "hifz memorization plan", clicks: 310, impressions: 2900, ctr: "10.6%", position: 3.4 },
    { query: "noorani qaida children class", clicks: 210, impressions: 1800, ctr: "11.6%", position: 2.8 }
  ];

  // Country Traffic Breakdowns
  const countries = [
    { code: "US", name: "United States", percent: 42, count: Math.round(stats.totalVisitors * 0.42) },
    { code: "GB", name: "United Kingdom", percent: 28, count: Math.round(stats.totalVisitors * 0.28) },
    { code: "CA", name: "Canada", percent: 12, count: Math.round(stats.totalVisitors * 0.12) },
    { code: "AU", name: "Australia", percent: 8, count: Math.round(stats.totalVisitors * 0.08) },
    { code: "SA", name: "Saudi Arabia", percent: 5, count: Math.round(stats.totalVisitors * 0.05) }
  ];

  // Traffic Sources
  const sources = [
    { name: "Organic Search", percent: 55, color: "#d9b45c" },
    { name: "Direct Traffic", percent: 25, color: "#8b5cf6" },
    { name: "Referrals", percent: 12, color: "#3b82f6" },
    { name: "Social Media", percent: 8, color: "#10b981" }
  ];

  // Device Breakdown
  const devices = [
    { name: "Desktop", percent: 62 },
    { name: "Mobile", percent: 34 },
    { name: "Tablet", percent: 4 }
  ];

  // Browser Breakdown
  const browsers = [
    { name: "Chrome", percent: 68 },
    { name: "Safari", percent: 22 },
    { name: "Firefox", percent: 6 },
    { name: "Edge/Others", percent: 4 }
  ];

  // Top Landing & Exit pages
  const landingPages = [
    { url: "/", title: "Truth Quran Academy Home", views: Math.round(stats.pageViews * 0.48) },
    { url: "/courses/", title: "All Courses Directory", views: Math.round(stats.pageViews * 0.24) },
    { url: "/fees/", title: "Pricing & Class Fees", views: Math.round(stats.pageViews * 0.14) },
    { url: "/blog/understanding-tajweed/", title: "Blog: Essential Tajweed Rules", views: Math.round(stats.pageViews * 0.09) }
  ];

  const exitPages = [
    { url: "/contact/", title: "Contact Form Submit Page", views: Math.round(stats.pageViews * 0.18) },
    { url: "/fees/", title: "Pricing Plans Page", views: Math.round(stats.pageViews * 0.15) },
    { url: "/", title: "Main Landing Page", views: Math.round(stats.pageViews * 0.12) }
  ];

  return (
    <div className="space-y-6 text-left" id="wp-analytics-dashboard-section">
      
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9b45c]/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c]">
            <BarChart2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-white">Console Analytics & Search Performance</h2>
            <p className="text-[11px] text-[#c9c2ab] mt-0.5">Real-time GSC crawler statistics, GA4 tracking streams, and core bounce/session performance metrics.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Period selector dropdown */}
          <div className="flex items-center bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-2.5 py-1.5 space-x-1.5 text-xs">
            <span className="text-[#c9c2ab]/50 font-sans uppercase font-bold text-[9px]">Period:</span>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as any)}
              className="bg-transparent text-white font-sans font-bold text-[11px] uppercase tracking-wider focus:outline-none"
            >
              <option value="daily" className="bg-[#07080b]">Daily Report</option>
              <option value="weekly" className="bg-[#07080b]">Weekly Report</option>
              <option value="monthly" className="bg-[#07080b]">Monthly (June-July)</option>
              <option value="yearly" className="bg-[#07080b]">Yearly (Full Year)</option>
            </select>
          </div>

          <div className="flex bg-[#12141b] p-1 border border-white/5 rounded-xl text-[10px] font-sans font-extrabold uppercase">
            <button
              onClick={() => setActiveTab("traffic")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "traffic" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-[#f3ecd8]"
              }`}
            >
              Traffic
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "search" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-[#f3ecd8]"
              }`}
            >
              GSC Performance
            </button>
            <button
              onClick={() => setActiveTab("integration")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "integration" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-[#f3ecd8]"
              }`}
            >
              API Connections
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: TRAFFIC DASHBOARD */}
      {activeTab === "traffic" && (
        <div className="space-y-6">
          
          {/* Traffic Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider block">Total Visitors</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{stats.totalVisitors.toLocaleString()}</div>
              <span className="text-[8px] text-green-400 font-bold font-mono">+12.4% vs last period</span>
              <Users size={18} className="absolute right-4 bottom-4 text-[#d9b45c]/15" />
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider block">Page Views</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{stats.pageViews.toLocaleString()}</div>
              <span className="text-[8px] text-green-400 font-bold font-mono">+18.2% page engagement</span>
              <Layers size={18} className="absolute right-4 bottom-4 text-[#d9b45c]/15" />
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider block">Sessions duration</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{stats.avgSessionDuration}</div>
              <span className="text-[8px] text-green-400 font-bold font-mono">High organic content focus</span>
              <Clock size={18} className="absolute right-4 bottom-4 text-[#d9b45c]/15" />
            </div>

            <div className="bg-[#12141b]/80 border-2 border-[#d9b45c]/30 rounded-2xl p-4 space-y-1 relative overflow-hidden bg-gradient-to-br from-[#12141b] to-[#d9b45c]/5">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] uppercase font-bold text-red-400 tracking-wider">Real-Time Visitors</span>
              </div>
              <div className="text-3xl font-serif font-bold text-white">{stats.realTime}</div>
              <span className="text-[8px] text-[#c9c2ab] block">Active student portal connections</span>
              <Radio size={18} className="absolute right-4 bottom-4 text-[#d9b45c]/20" />
            </div>
          </div>

          {/* Graphical charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Traffic over time (SVG Line chart) */}
            <div className="lg:col-span-8 bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingUp size={14} className="text-[#d9b45c]" />
                  <span>Traffic Growth Chart</span>
                </h3>
                <span className="text-[9px] font-mono text-[#c9c2ab]/40">Last 7 Days (Live Hits)</span>
              </div>

              {/* Styled SVG Line Graph */}
              <div className="w-full h-48 bg-[#07080b]/50 rounded-xl relative p-2 overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-5 pointer-events-none">
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                </div>

                {(() => {
                  const trafficOverTime = (cmsData.analyticsData as any)?.trafficOverTime || [
                    { date: "Mon", views: 120, visitors: 80 },
                    { date: "Tue", views: 150, visitors: 90 },
                    { date: "Wed", views: 110, visitors: 70 },
                    { date: "Thu", views: 180, visitors: 110 },
                    { date: "Fri", views: 220, visitors: 140 },
                    { date: "Sat", views: 190, visitors: 120 },
                    { date: "Sun", views: 250, visitors: 160 }
                  ];

                  const maxViews = Math.max(...trafficOverTime.map((d: any) => d.views), 10);
                  const coords = trafficOverTime.map((d: any, i: number) => {
                    const x = (i / (trafficOverTime.length - 1)) * 380 + 10;
                    const y = 85 - (d.views / maxViews) * 65; // Scale height within 100px box
                    return { x, y, date: d.date, views: d.views };
                  });

                  // Construct SVG line and area path
                  const linePath = coords.map((c: any, i: number) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
                  const areaPath = coords.length > 0 ? `${linePath} L ${coords[coords.length - 1].x} 100 L ${coords[0].x} 100 Z` : "";

                  return (
                    <>
                      <svg className="w-full h-36 mt-4" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d9b45c" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#d9b45c" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        
                        {areaPath && (
                          <path
                            d={areaPath}
                            fill="url(#areaGrad)"
                          />
                        )}

                        {linePath && (
                          <path
                            d={linePath}
                            fill="none"
                            stroke="#d9b45c"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        )}

                        {coords.map((c: any, i: number) => (
                          <circle
                            key={i}
                            cx={c.x}
                            cy={c.y}
                            r="3.5"
                            fill={i === coords.length - 1 ? "#d9b45c" : "#07080b"}
                            stroke="#d9b45c"
                            strokeWidth="1.5"
                            title={`${c.date}: ${c.views} views`}
                          />
                        ))}
                      </svg>

                      {/* X Axis */}
                      <div className="flex justify-between text-[9px] font-mono text-[#c9c2ab]/50 px-2 mt-1">
                        {coords.map((c: any, i: number) => (
                          <span key={i} className="text-[8px]">
                            {c.date} <span className="text-[#d9b45c]">({c.views})</span>
                          </span>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Traffic channels & Device Donut (SVG Pie chart) */}
            <div className="lg:col-span-4 bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider">
                Traffic Sources
              </h3>

              <div className="space-y-4">
                {/* Channel percentages */}
                <div className="space-y-2.5">
                  {sources.map(src => (
                    <div key={src.name} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-sans font-bold text-white">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: src.color }} />
                          <span>{src.name}</span>
                        </span>
                        <span>{src.percent}%</span>
                      </div>
                      <div className="w-full bg-[#07080b] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: src.color, width: `${src.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between text-[9px] text-[#c9c2ab]/60 font-mono">
                  <span>Desktop: {devices[0].percent}%</span>
                  <span>Mobile: {devices[1].percent}%</span>
                  <span>Tablet: {devices[2].percent}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Countries list */}
            <div className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#f3ecd8] flex items-center space-x-1.5 pb-2 border-b border-white/5">
                <Globe2 size={13} className="text-[#d9b45c]" />
                <span>Geographic Audience</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {countries.map(c => (
                  <div key={c.code} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-3 bg-[#07080b] border border-white/10 text-[8px] font-mono flex items-center justify-center rounded">
                        {c.code}
                      </span>
                      <span className="text-white font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-[#c9c2ab]">
                      <span>{c.count.toLocaleString()}</span>
                      <span className="text-[#d9b45c] font-bold">{c.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#f3ecd8] flex items-center space-x-1.5 pb-2 border-b border-white/5">
                <Laptop size={13} className="text-[#d9b45c]" />
                <span>Tech Specifications</span>
              </h4>
              <div className="space-y-2">
                {browsers.map(b => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-white">
                      <span>{b.name}</span>
                      <span>{b.percent}%</span>
                    </div>
                    <div className="w-full bg-[#07080b] h-1 rounded-full overflow-hidden">
                      <div className="bg-[#d9b45c]/60 h-full rounded-full" style={{ width: `${b.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Landing & Exit paths */}
            <div className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#f3ecd8] flex items-center space-x-1.5 pb-2 border-b border-white/5">
                <Compass size={13} className="text-[#d9b45c]" />
                <span>Popular Path Flows</span>
              </h4>
              <div className="space-y-3.5 max-h-48 overflow-y-auto">
                <div>
                  <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-green-400 block mb-1">Top Landing Pages</span>
                  {landingPages.slice(0, 2).map(lp => (
                    <div key={lp.url} className="flex justify-between items-center text-[10px] pb-1 border-b border-white/5 last:border-b-0">
                      <span className="text-[#c9c2ab] truncate max-w-[140px]" title={lp.title}>{lp.url}</span>
                      <span className="font-mono text-white">{lp.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-red-400 block mb-1">Top Exit Pages</span>
                  {exitPages.slice(0, 2).map(ep => (
                    <div key={ep.url} className="flex justify-between items-center text-[10px] pb-1 border-b border-white/5 last:border-b-0">
                      <span className="text-[#c9c2ab] truncate max-w-[140px]" title={ep.title}>{ep.url}</span>
                      <span className="font-mono text-white">{ep.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SEARCH PERFORMANCE */}
      {activeTab === "search" && (
        <div className="space-y-6">
          
          {/* Search Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Total Clicks</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{searchStats.clicks.toLocaleString()}</div>
              <span className="text-[8px] text-green-400 font-bold block">Google organic traffic</span>
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Impressions</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{searchStats.impressions.toLocaleString()}</div>
              <span className="text-[8px] text-[#c9c2ab]/50 block">Keywords visibility in SERP</span>
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Average CTR</span>
              <div className="text-2xl font-serif font-bold text-green-400">{searchStats.ctr}</div>
              <span className="text-[8px] text-green-400 font-bold block">Excellent click efficiency</span>
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Average Position</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">#{searchStats.position}</div>
              <span className="text-[8px] text-[#c9c2ab]/50 block">Rank Math ranking position</span>
            </div>
          </div>

          {/* Top rankings & query statistics table */}
          <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5">
            <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider flex items-center space-x-1.5 mb-4">
              <Search size={14} className="text-[#d9b45c]" />
              <span>Google Search Console Queries ({reportPeriod})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#d9b45c]/10 text-[#d9b45c] text-[10px] uppercase font-bold">
                    <th className="pb-3 pl-2">Top Performing Keywords</th>
                    <th className="pb-3 text-center">Clicks</th>
                    <th className="pb-3 text-center">Impressions</th>
                    <th className="pb-3 text-center">CTR</th>
                    <th className="pb-3 text-right pr-2">Avg. Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {topKeywords.map(kw => (
                    <tr key={kw.query} className="hover:bg-[#07080b]/30">
                      <td className="py-3 pl-2 font-medium text-white">{kw.query}</td>
                      <td className="py-3 text-center font-mono">{Math.round(kw.clicks * mult)}</td>
                      <td className="py-3 text-center font-mono">{Math.round(kw.impressions * mult)}</td>
                      <td className="py-3 text-center font-mono text-green-400">{kw.ctr}</td>
                      <td className="py-3 text-right pr-2 font-mono text-[#d9b45c] font-bold">#{kw.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-[#d9b45c]/10 flex flex-wrap justify-between items-center text-[10px] text-[#c9c2ab]/50 font-mono">
              <span>Indexed Pages: {searchStats.indexedPages}</span>
              <span>Crawl Diagnostics: No errors reported. Robots.txt optimal</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: INTEGRATION SETTINGS */}
      {activeTab === "integration" && (
        <div className="bg-[#12141b]/60 border border-[#d9b45c]/15 rounded-2xl p-6">
          <form onSubmit={handleSaveIntegration} className="max-w-2xl space-y-5">
            <div>
              <h3 className="text-sm font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider">
                Google & Marketing Integration Credentials
              </h3>
              <p className="text-xs text-[#c9c2ab] mt-1 leading-relaxed">
                Provide valid keys or measurement credentials. WordPress Sim connects directly to the endpoints to display reporting streams in real-time inside this admin center.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  required
                  value={integrationForm.ga4Id}
                  onChange={e => setIntegrationForm({ ...integrationForm, ga4Id: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono"
                  placeholder="e.g. G-TRUTHQURAN123"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Search Console Site URL</label>
                <input
                  type="text"
                  required
                  value={integrationForm.gscId}
                  onChange={e => setIntegrationForm({ ...integrationForm, gscId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono"
                  placeholder="e.g. sc-truthquranacademy.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={integrationForm.gtmId}
                  onChange={e => setIntegrationForm({ ...integrationForm, gtmId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono text-[11px]"
                  placeholder="e.g. GTM-P8QXTR"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={integrationForm.fbPixelId}
                  onChange={e => setIntegrationForm({ ...integrationForm, fbPixelId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono text-[11px]"
                  placeholder="e.g. 987654321"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Microsoft Clarity ID</label>
                <input
                  type="text"
                  value={integrationForm.clarityId}
                  onChange={e => setIntegrationForm({ ...integrationForm, clarityId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono text-[11px]"
                  placeholder="e.g. clrt89abc"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#d9b45c]/10 flex justify-end items-center space-x-3">
              {cmsData.integrations?.isConnected && (
                <span className="text-[10px] text-green-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 size={13} />
                  <span>Verified API Pipeline Active</span>
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 text-[10px] font-sans font-extrabold uppercase tracking-widest text-black bg-[#d9b45c] hover:bg-[#f2d98a] rounded-xl transition-all cursor-pointer"
              >
                Sync Integrations
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
