import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  FileText, 
  ListTodo, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  Settings,
  Menu,
  X,
  PlusCircle,
  Hash,
  MessageSquare,
  ShieldAlert,
  Info,
  Layers,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Issue, Audit, Severity, IssueType, IssueStatus } from './types';
import { MOCK_AUDITS, MOCK_ISSUES } from './mockData';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-white/10 text-white font-medium' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span className="text-sm">{label}</span>
  </button>
);

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const styles = {
    Critical: 'bg-red-50 text-[#EF4444] border-red-100',
    High: 'bg-orange-50 text-[#F97316] border-orange-100',
    Medium: 'bg-yellow-50 text-[#854D0E] border-yellow-100',
    Low: 'bg-blue-50 text-[#3B82F6] border-blue-100',
    Info: 'bg-gray-50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const StatusBadge = ({ status }: { status: IssueStatus }) => {
  const styles = {
    'New': 'bg-blue-50 text-blue-600',
    'In Progress': 'bg-purple-50 text-purple-600',
    'Fixed': 'bg-green-50 text-green-600',
    'Ignored': 'bg-gray-100 text-gray-500',
    'Needs Review': 'bg-amber-50 text-amber-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- Views ---

const DashboardView = ({ issues, audit }: { issues: Issue[], audit: Audit }) => {
  const stats = useMemo(() => {
    return {
      total: issues.length,
      critical: issues.filter(i => i.severity === 'Critical').length,
      high: issues.filter(i => i.severity === 'High').length,
      fixed: issues.filter(i => i.status === 'Fixed').length,
      inProgress: issues.filter(i => i.status === 'In Progress').length,
    };
  }, [issues]);

  const severityCounts = ['Critical', 'High', 'Medium', 'Low', 'Info'].map(s => ({
    label: s,
    count: issues.filter(i => i.severity === s).length,
    color: s === 'Critical' ? 'bg-[#EF4444]' : s === 'High' ? 'bg-[#F97316]' : s === 'Medium' ? 'bg-[#FACC15]' : s === 'Low' ? 'bg-[#3B82F6]' : 'bg-slate-300'
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">Executive Summary</h2>
        <p className="text-slate-500 text-sm font-medium">{audit.projectName} • <span className="text-blue-600 underline font-mono">{audit.domain}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical', value: stats.critical, icon: ShieldAlert, color: 'text-[#EF4444]' },
          { label: 'High Risk', value: stats.high, icon: AlertTriangle, color: 'text-[#F97316]' },
          { label: 'Medium', value: issues.filter(i => i.severity === 'Medium').length, icon: Layers, color: 'text-[#854D0E]' },
          { label: 'Resolved', value: stats.fixed, icon: CheckCircle2, color: 'text-[#16A34A]' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1"
          >
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value.toString().padStart(2, '0')}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <BarChart3 size={16} /> Severity Distribution
          </h3>
          <div className="space-y-4">
            {severityCounts.map((s) => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-gray-500">
                  <span>{s.label}</span>
                  <span>{s.count}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.total > 0 ? (s.count / stats.total) * 100 : 0}%` }}
                    className={`h-full ${s.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <Clock size={16} /> Recent Activity
          </h3>
          <div className="space-y-4">
            {issues.length === 0 ? <p className="text-xs text-gray-400">No activity yet.</p> : issues.slice(0, 5).map((issue, i) => (
              <div key={issue.id} className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors leading-tight">
                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                  issue.severity === 'Critical' ? 'bg-red-500' : 'bg-blue-400'
                }`} />
                <div>
                  <div className="text-sm font-medium line-clamp-1">{issue.title}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Updated on {new Date(issue.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const IssuesView = ({ issues, onAdd, onEdit, onDelete }: { 
  issues: Issue[], 
  onAdd: () => void, 
  onEdit: (issue: Issue) => void,
  onDelete: (id: string) => void
}) => {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'All'>('All');

  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      const matchSearch = String(i.title || '').toLowerCase().includes(search.toLowerCase()) || String(i.url || '').toLowerCase().includes(search.toLowerCase());
      const matchSeverity = filterSeverity === 'All' || i.severity === filterSeverity;
      return matchSearch && matchSeverity;
    });
  }, [issues, search, filterSeverity]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Issues List</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Info">Info</option>
          </select>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} /> New Issue
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-grow flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-slate-200">
                <th className="px-6 py-3 text-[12px] font-semibold text-slate-500">Severity</th>
                <th className="px-6 py-3 text-[12px] font-semibold text-slate-500">Issue Title</th>
                <th className="px-6 py-3 text-[12px] font-semibold text-slate-500">Type</th>
                <th className="px-6 py-3 text-[12px] font-semibold text-slate-500">Affected URL</th>
                <th className="px-6 py-3 text-[12px] font-semibold text-slate-500">Status</th>
                <th className="px-6 py-3 text-[12px] font-semibold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <SeverityBadge severity={issue.severity} />
                  </td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{issue.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{issue.shortDescription}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-medium text-gray-600 px-1.5 py-0.5 bg-gray-100 rounded">{issue.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <span className="max-w-[200px] truncate">{issue.url.replace('https://', '').replace('http://', '')}</span>
                      <a href={issue.url} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onEdit(issue)}
                        className="p-1.5 hover:bg-blue-100 hover:text-blue-600 rounded text-gray-400 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => onDelete(issue.id)}
                        className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded text-gray-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredIssues.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="inline-flex p-4 bg-gray-50 rounded-full text-gray-400">
              <Search size={32} />
            </div>
            <div className="text-gray-900 font-medium">No issues found</div>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ReportPreview = ({ issues, audit, onExportExcel }: { issues: Issue[], audit: Audit, onExportExcel: () => void }) => {
  const groupedBySeverity = useMemo(() => {
    return ['Critical', 'High', 'Medium', 'Low', 'Info'].map(s => ({
      severity: s as Severity,
      items: issues.filter(i => i.severity === s)
    })).filter(g => g.items.length > 0);
  }, [issues]);

  return (
    <div className="h-full flex flex-col space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">Report Preview</h2>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Standard Client View</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onExportExcel} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
            <FileDown size={14} /> Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <div id="report-content" className="flex-grow bg-[#F8FAFC] border border-slate-200 rounded-2xl shadow-sm overflow-y-auto p-4 md:p-8 space-y-8 max-w-5xl mx-auto w-full print:bg-white print:shadow-none print:border-none">
        
        {/* Executive Summary Polish */}
        <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-xl p-8 shadow-inner">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Executive Summary</div>
          <p className="text-sm leading-relaxed text-slate-600">
            Found <strong>{issues.length} issues</strong> across {audit.domain}. Primary technical risks involve <strong>SEO indexation markers</strong> and <strong>ux-blocking elements</strong> reported in this analysis.
          </p>
        </div>

        <div className="space-y-4">
           <h4 className="text-sm font-bold text-[#1E293B] tracking-tight">Priority Plan (Recommended)</h4>
           {[1, 2, 3].map(step => {
             const topIssue = issues.filter(i => i.severity === 'Critical')[step - 1] || issues[step - 1];
             if (!topIssue) return null;
             return (
               <div key={step} className="flex gap-4 items-start p-4 border-t border-slate-100">
                  <div className="w-7 h-7 bg-[#0F172A] text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{step}</div>
                  <div className="text-xs font-semibold text-[#1E293B]">
                    {topIssue.recommendation || topIssue.title}
                  </div>
               </div>
             );
           })}
        </div>

        {/* Issues by Severity */}
        {groupedBySeverity.length === 0 ? <p className="text-center text-gray-400 py-10 border-2 border-dashed rounded-xl">No issues reported for this project yet.</p> : groupedBySeverity.map((group) => (
          <section key={group.severity} className="print:break-before-page">
            <div className={`flex items-center justify-between border-b pb-3 mb-6 ${
               group.severity === 'Critical' ? 'border-red-200' : 
               group.severity === 'High' ? 'border-orange-200' : 'border-gray-200'
            }`}>
               <h3 className="text-lg font-bold flex items-center gap-2">
                 <SeverityBadge severity={group.severity} /> 
                 <span className="text-gray-900 font-extrabold italic uppercase tracking-tighter">{group.severity} Priority Issues</span>
               </h3>
               <span className="text-sm font-bold text-gray-400">{group.items.length} FOUND</span>
            </div>

            <div className="space-y-6">
              {group.items.map((issue, idx) => (
                <div key={issue.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl border border-gray-100 bg-white shadow-sm print:shadow-none print:border-gray-200">
                  <div className="lg:col-span-12 flex justify-between items-start">
                     <h4 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="text-gray-300 font-mono text-sm">{idx + 1}.</span>
                        {issue.title}
                     </h4>
                     <span className="text-[10px] font-bold py-1 px-3 bg-gray-100 text-gray-500 rounded-full uppercase">{issue.type}</span>
                  </div>
                  
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Issue Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">{issue.fullDescription || issue.shortDescription}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Recommendation</p>
                      <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-600">
                         <p className="text-sm text-blue-900 font-semibold">{issue.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location / Context</p>
                        <div className="font-mono text-[11px] bg-gray-50 p-3 rounded overflow-x-auto">
                           <p className="text-gray-500 mb-1">URL: {issue.url}</p>
                           {issue.location && <p className="text-gray-800">Context: {issue.location}</p>}
                        </div>
                     </div>
                     {issue.evidence && (
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Evidence</p>
                          <div className="italic text-xs text-gray-500 border-l-2 pl-3 py-1">"{issue.evidence}"</div>
                       </div>
                     )}
                     {issue.impact && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Business Impact</p>
                          <p className="text-xs text-gray-600 font-medium">{issue.impact}</p>
                        </div>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <footer className="text-center pt-12 border-t text-gray-400 text-xs mt-auto">
           <p>© {new Date().getFullYear()} Audit Forge • Generated for {audit.client}</p>
           <p className="mt-1">Private & Confidential</p>
        </footer>
      </div>
    </div>
  );
};

const IssueModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (data: Partial<Issue>) => void,
  initialData?: Issue 
}) => {
  const [formData, setFormData] = useState<Partial<Issue>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    url: '',
    type: 'SEO',
    severity: 'Medium',
    status: 'New',
    recommendation: '',
    location: '',
    evidence: '',
    impact: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else if (isOpen) setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      url: '',
      type: 'SEO',
      severity: 'Medium',
      status: 'New',
      recommendation: '',
      location: '',
      evidence: '',
      impact: ''
    });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">{initialData ? 'Edit Issue' : 'Add New Issue'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500">Issue Title *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Missing H1 Title"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500">Website URL *</label>
              <input
                required
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500">Location / Selector</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="CSS Selector or description"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as IssueType})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              >
                {['SEO', 'UX', 'CRO', 'Content', 'Technical', 'Frontend', 'Metadata', 'Structure', 'Images', 'Forms', 'Schema', 'Internal linking'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value as Severity})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              >
                {['Critical', 'High', 'Medium', 'Low', 'Info'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-500">Summary Recommendation *</label>
            <input
              required
              type="text"
              value={formData.recommendation}
              onChange={(e) => setFormData({...formData, recommendation: e.target.value})}
              placeholder="What should be done?"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-500">Detailed Description</label>
            <textarea
              rows={3}
              value={formData.fullDescription}
              onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
              placeholder="Provide context and explain the problem in detail..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500">Evidence (Text / Quote)</label>
              <input
                type="text"
                value={formData.evidence}
                onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                placeholder="Content fragment or quote"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-500">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as IssueStatus})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              >
                {['New', 'In Progress', 'Fixed', 'Ignored', 'Needs Review'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button 
            onClick={() => {
              if (formData.title && formData.url) onSave(formData);
            }} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            {initialData ? 'Update Issue' : 'Save Issue'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'issues' | 'report'>('dashboard');
  const [audits, setAudits] = useState<Audit[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentAuditId, setCurrentAuditId] = useState<string | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | undefined>();

  // Persistence
  useEffect(() => {
    const savedAudits = localStorage.getItem('audits');
    const savedIssues = localStorage.getItem('issues');
    
    let loadedAudits: Audit[] = [];
    let loadedIssues: Issue[] = [];

    if (savedAudits) {
      loadedAudits = JSON.parse(savedAudits);
      setAudits(loadedAudits);
    } else {
      loadedAudits = MOCK_AUDITS;
      setAudits(loadedAudits);
    }

    if (savedIssues) {
      loadedIssues = JSON.parse(savedIssues);
      setIssues(loadedIssues);
    } else {
      loadedIssues = MOCK_ISSUES;
      setIssues(loadedIssues);
    }

    if (loadedAudits.length > 0) {
      setCurrentAuditId(loadedAudits[0].id);
    }
  }, []);

  useEffect(() => {
    if (audits.length > 0) localStorage.setItem('audits', JSON.stringify(audits));
    if (issues.length > 0) localStorage.setItem('issues', JSON.stringify(issues));
  }, [audits, issues]);

  const currentAudit = audits.find(a => a.id === currentAuditId);
  const currentIssues = issues.filter(i => i.auditId === currentAuditId);

  const handleSaveIssue = (data: Partial<Issue>) => {
    if (editingIssue) {
      setIssues(issues.map(i => i.id === editingIssue.id ? { ...i, ...data, updatedAt: new Date().toISOString() } as Issue : i));
    } else {
      const newIssue: Issue = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        auditId: currentAuditId!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Issue;
      setIssues([...issues, newIssue]);
    }
    setIsIssueModalOpen(false);
    setEditingIssue(undefined);
  };

  const handleDeleteIssue = (id: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      setIssues(issues.filter(i => i.id !== id));
    }
  };

  const handleExportCSV = () => {
    if (currentIssues.length === 0) return;
    
    const headers = ['Title', 'Severity', 'Type', 'URL', 'Status', 'Recommendation', 'Created At'];
    const rows = currentIssues.map(i => [
      `"${i.title.replace(/"/g, '""')}"`,
      i.severity,
      i.type,
      i.url,
      i.status,
      `"${i.recommendation.replace(/"/g, '""')}"`,
      i.createdAt
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentAudit?.projectName || 'audit'}_issues.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProject = () => {
    const name = window.prompt('Project Name?');
    const domain = window.prompt('Domain?');
    if (!name || !domain) return;
    
    const newAudit: Audit = {
      id: Math.random().toString(36).substr(2, 9),
      projectName: name,
      domain: domain,
      auditType: 'Search & UX Audit',
      executor: 'SEO Lead',
      client: 'Direct Client',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      createdAt: new Date().toISOString(),
    };
    setAudits([...audits, newAudit]);
    setCurrentAuditId(newAudit.id);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this project and all its issues?')) {
      const newAudits = audits.filter(a => a.id !== id);
      setAudits(newAudits);
      setIssues(issues.filter(i => i.auditId !== id));
      if (currentAuditId === id) {
        setCurrentAuditId(newAudits.length > 0 ? newAudits[0].id : null);
      }
    }
  };

  if (audits.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <BarChart3 size={32} />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Audit Forge</h1>
          <p className="text-gray-500">Create your first project to start generating professional audit reports.</p>
          <button 
            onClick={handleCreateProject}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            Create First Project
          </button>
        </div>
      </div>
    );
  }

  if (!currentAudit) return <div className="p-10 text-center">Selecting project...</div>;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar - Dark theme */}
      <aside className="w-[240px] bg-[#0F172A] flex flex-col p-6 text-white shadow-2xl z-20">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-6 h-6 bg-[#2563EB] rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <CheckCircle2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Audit Studio</span>
        </div>

        <div className="flex-grow space-y-8 overflow-y-auto custom-scrollbar pr-1">
          <nav className="space-y-1">
            <SidebarItem label="Dashboard" icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem label="Projects" icon={Layers} active={activeTab === 'issues'} onClick={() => setActiveTab('issues')} />
            <SidebarItem label="Reports" icon={FileText} active={activeTab === 'report'} onClick={() => setActiveTab('report')} />
          </nav>

          <div className="pt-2">
            <div className="flex items-center justify-between px-3 mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Management</span>
            </div>
            <div className="space-y-1">
              {audits.map(audit => (
                <button
                  key={audit.id}
                  onClick={() => setCurrentAuditId(audit.id)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    currentAuditId === audit.id 
                      ? 'bg-white/10 text-white font-bold' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Hash size={12} className={currentAuditId === audit.id ? 'text-blue-400' : 'text-slate-600'} />
                  <span className="truncate">{audit.projectName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800">
           <SidebarItem label="Settings" icon={Settings} active={false} onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
             <span className="hover:text-[#2563EB] cursor-pointer font-bold text-slate-400">Projects</span>
             <ChevronRight size={14} className="text-slate-300" />
             <strong className="text-slate-900 font-bold">{currentAudit.projectName}</strong>
             <ChevronRight size={14} className="text-slate-300" />
             <span className="text-slate-400">Technical Audit</span>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setIsIssueModalOpen(true)}
                className="px-4 py-2 bg-white border border-slate-200 text-[#1E293B] rounded-lg text-[13px] font-semibold hover:bg-slate-50 transition shadow-sm"
             >
                + Add Issue
             </button>
             <button 
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/10"
             >
                Generate Report
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
          <div className="p-6 md:p-8 max-w-7xl mx-auto h-full text-[#1E293B]">
            <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto"
              >
                <DashboardView issues={currentIssues} audit={currentAudit} />
              </motion.div>
            )}
            {activeTab === 'issues' && (
              <motion.div
                key="issues"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto h-full"
              >
                <IssuesView 
                  issues={currentIssues} 
                  onAdd={() => {
                    setEditingIssue(undefined);
                    setIsIssueModalOpen(true);
                  }}
                  onEdit={(issue) => {
                    setEditingIssue(issue);
                    setIsIssueModalOpen(true);
                  }}
                  onDelete={handleDeleteIssue}
                />
              </motion.div>
            )}
            {activeTab === 'report' && (
              <motion.div
                key="report"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto h-full"
              >
                <ReportPreview issues={currentIssues} audit={currentAudit} onExportExcel={handleExportCSV} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>

      <IssueModal 
        isOpen={isIssueModalOpen} 
        onClose={() => setIsIssueModalOpen(false)} 
        onSave={handleSaveIssue}
        initialData={editingIssue}
      />
    </div>
  );
}
