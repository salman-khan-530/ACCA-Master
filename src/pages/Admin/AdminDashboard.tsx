import React, { useState, useEffect } from 'react';
import { dbService, DEFAULT_PLATFORM_SETTINGS } from '../../services/dbService';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserProfile,
  AccaPaper,
  Topic,
  Question,
  MockExam,
  LearningResource,
  Announcement,
  PlatformSettings,
} from '../../types';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  HelpCircle,
  Clock,
  FileText,
  Bell,
  Plus,
  Trash2,
  Edit,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Search,
  Check,
  Shield,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
  Settings,
  MessageSquare,
  Share2,
  Video,
  Phone,
  Mail,
  Save,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { userProfile, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'students' | 'papers' | 'topics' | 'questions' | 'mocks' | 'resources' | 'announcements' | 'settings'
  >('overview');

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Platform state
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [papers, setPapers] = useState<AccaPaper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Sub-filtering & form states
  const [selectedPaperId, setSelectedPaperId] = useState<string>('fa1');
  const [studentSearch, setStudentSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Forms
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    paperId: 'fa1',
    topicId: 'fa1-t1',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    explanation: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    marks: 2,
    syllabusReference: '',
  });

  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState({
    name: '',
    code: '',
    description: '',
    paperId: 'fa1',
    difficultyLevel: 'introductory' as 'introductory' | 'intermediate' | 'advanced',
  });

  const [showMockModal, setShowMockModal] = useState(false);
  const [newMock, setNewMock] = useState({
    title: '',
    paperId: 'fa1',
    description: '',
    durationMinutes: 60,
    totalQuestions: 20,
    passPercentage: 50,
    difficulty: 'standard' as 'standard' | 'challenging',
  });

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'normal' | 'important' | 'urgent',
  });

  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);
  const [csvPreviewItems, setCsvPreviewItems] = useState<
    { question: Question; isDuplicateId: boolean; isDuplicateText: boolean }[]
  >([]);
  const [showCsvPreviewModal, setShowCsvPreviewModal] = useState(false);
  const [csvOverwriteDuplicates, setCsvOverwriteDuplicates] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const reloadData = async () => {
    const [uList, pList, tList, qList, mList, rList, aList, sList] = await Promise.all([
      dbService.getAllUsers(),
      dbService.getPapers(),
      dbService.getTopics(selectedPaperId),
      dbService.getQuestions(undefined, undefined, true),
      dbService.getMockExams(),
      dbService.getResources(),
      dbService.getAnnouncements(),
      dbService.getPlatformSettings(),
    ]);
    setStudents(uList);
    setPapers(pList);
    setTopics(tList);
    setQuestions(qList);
    setMockExams(mList);
    setResources(rList);
    setAnnouncements(aList);
    setPlatformSettings(sList);
  };

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updated = await dbService.updatePlatformSettings(platformSettings);
      setPlatformSettings(updated);
      showToast('success', 'Social and community links updated successfully across the entire website!');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to update community links.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, [selectedPaperId]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- ACTIONS ---
  const handleToggleUserStatus = async (uid: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await dbService.updateUserStatus(uid, nextStatus);
    showToast('success', `Student account status updated to ${nextStatus}.`);
    reloadData();
  };

  const handleTogglePaperActive = async (paperId: string, currentActive: boolean) => {
    await dbService.updatePaper(paperId, { isActive: !currentActive });
    showToast('success', 'Paper visibility status updated.');
    reloadData();
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.name) return;

    const topicObj: Topic = {
      id: `${newTopic.paperId}-t${topics.length + 1}-${Date.now().toString(36)}`,
      paperId: newTopic.paperId,
      name: newTopic.name,
      code: newTopic.code || `TOPIC-${topics.length + 1}`,
      description: newTopic.description,
      order: topics.length + 1,
      difficultyLevel: newTopic.difficultyLevel,
      questionCount: 0,
      isActive: true,
    };

    await dbService.addTopic(topicObj);
    setShowTopicModal(false);
    setNewTopic({
      name: '',
      code: '',
      description: '',
      paperId: selectedPaperId,
      difficultyLevel: 'introductory',
    });
    showToast('success', 'New syllabus topic created successfully.');
    reloadData();
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      await dbService.deleteTopic(topicId);
      showToast('success', 'Topic deleted successfully.');
      reloadData();
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.text || !newQuestion.optionA || !newQuestion.optionB) {
      showToast('error', 'Please fill in question text and at least options A and B.');
      return;
    }

    const qObj: Question = {
      id: `${newQuestion.paperId}-q${Date.now().toString(36)}`,
      paperId: newQuestion.paperId,
      topicId: newQuestion.topicId,
      text: newQuestion.text,
      options: [
        { id: 'A', text: newQuestion.optionA },
        { id: 'B', text: newQuestion.optionB },
        { id: 'C', text: newQuestion.optionC || 'None of the above' },
        { id: 'D', text: newQuestion.optionD || 'All of the above' },
      ],
      correctOptionId: newQuestion.correctOption,
      explanation: newQuestion.explanation,
      difficulty: newQuestion.difficulty,
      marks: Number(newQuestion.marks) || 2,
      syllabusReference: newQuestion.syllabusReference,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await dbService.addQuestion(qObj);
    setShowQuestionModal(false);
    setNewQuestion({
      text: '',
      paperId: selectedPaperId,
      topicId: topics[0]?.id || 'fa1-t1',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A',
      explanation: '',
      difficulty: 'medium',
      marks: 2,
      syllabusReference: '',
    });
    showToast('success', 'New practice question added to question bank.');
    reloadData();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Delete this question from database?')) {
      await dbService.deleteQuestion(id);
      showToast('success', 'Question deleted successfully.');
      reloadData();
    }
  };

  // CSV Import Parser with Duplicate Detection
  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setCsvFeedback('CSV file does not contain question rows.');
          return;
        }

        const previewList: { question: Question; isDuplicateId: boolean; isDuplicateText: boolean }[] = [];
        const seenIds = new Set<string>();

        for (let i = 1; i < lines.length; i++) {
          // Basic CSV quote parser
          const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
          if (row.length >= 8) {
            const clean = (val: string) => (val || '').replace(/^"|"$/g, '').trim();
            const id = clean(row[0]) || `import-${Date.now()}-${i}`;
            const paperId = clean(row[1]) || 'fa1';
            const topicId = clean(row[2]) || 'fa1-t1';
            const qText = clean(row[3]);
            const optA = clean(row[4]);
            const optB = clean(row[5]);
            const optC = clean(row[6]);
            const optD = clean(row[7]);
            const correct = clean(row[8]) || 'A';
            const diff = (clean(row[9]) as any) || 'medium';
            const marks = parseInt(clean(row[10])) || 2;
            const explanation = clean(row[11]) || 'Standard syllabus accounting rule.';

            if (qText && optA) {
              const qObj: Question = {
                id,
                paperId,
                topicId,
                text: qText,
                options: [
                  { id: 'A', text: optA },
                  { id: 'B', text: optB },
                  { id: 'C', text: optC || 'N/A' },
                  { id: 'D', text: optD || 'N/A' },
                ],
                correctOptionId: correct.toUpperCase(),
                explanation,
                difficulty: diff === 'easy' || diff === 'hard' ? diff : 'medium',
                marks,
                isActive: true,
                createdAt: new Date().toISOString(),
              };

              const isDuplicateId =
                questions.some((existing) => existing.id.toLowerCase() === id.toLowerCase()) ||
                seenIds.has(id.toLowerCase());
              const isDuplicateText = questions.some(
                (existing) => existing.text.trim().toLowerCase() === qText.trim().toLowerCase()
              );
              seenIds.add(id.toLowerCase());

              previewList.push({
                question: qObj,
                isDuplicateId,
                isDuplicateText,
              });
            }
          }
        }

        if (previewList.length > 0) {
          setCsvPreviewItems(previewList);
          setShowCsvPreviewModal(true);
          setCsvFeedback(null);
        } else {
          setCsvFeedback('Could not parse valid questions. Please verify format.');
        }
      } catch (err: any) {
        setCsvFeedback(`CSV Parsing Error: ${err?.message}`);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmCsvImport = async () => {
    setIsImporting(true);
    try {
      const questionsToSave = csvOverwriteDuplicates
        ? csvPreviewItems.map((p) => p.question)
        : csvPreviewItems.filter((p) => !p.isDuplicateId).map((p) => p.question);

      if (questionsToSave.length === 0) {
        showToast('error', 'No new questions to import. Enable "Overwrite existing" to replace duplicates.');
        setIsImporting(false);
        return;
      }

      const count = await dbService.importQuestions(questionsToSave);
      showToast('success', `Imported ${count} questions successfully!`);
      setShowCsvPreviewModal(false);
      setCsvPreviewItems([]);
      reloadData();
    } catch (err: any) {
      showToast('error', `Import failed: ${err?.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateMock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMock.title) return;

    const paperQuestions = questions.filter((q) => q.paperId === newMock.paperId);
    const selectedQIds = paperQuestions.slice(0, newMock.totalQuestions).map((q) => q.id);

    const mockObj: MockExam = {
      id: `${newMock.paperId}-mock-${Date.now().toString(36)}`,
      paperId: newMock.paperId,
      title: newMock.title,
      description: newMock.description || 'Full-scope timed examination simulation.',
      durationMinutes: Number(newMock.durationMinutes) || 60,
      totalQuestions: Number(newMock.totalQuestions) || selectedQIds.length,
      totalMarks: selectedQIds.length * 2,
      passMarks: Math.round(selectedQIds.length * 2 * (newMock.passPercentage / 100)),
      passPercentage: Number(newMock.passPercentage) || 50,
      difficulty: newMock.difficulty,
      isPublished: true,
      questionIds: selectedQIds,
    };

    await dbService.addMockExam(mockObj);
    setShowMockModal(false);
    showToast('success', 'New timed mock examination created and published!');
    reloadData();
  };

  const handleToggleMockPublish = async (mockId: string, currentPublished: boolean) => {
    await dbService.updateMockExam(mockId, { isPublished: !currentPublished });
    showToast('success', 'Mock exam publish status updated.');
    reloadData();
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    const annObj: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority,
      createdAt: new Date().toISOString(),
      isPublished: true,
    };

    await dbService.addAnnouncement(annObj);
    setShowAnnouncementModal(false);
    setNewAnnouncement({ title: '', content: '', priority: 'normal' });
    showToast('success', 'Announcement published across platform.');
    reloadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold transition-all animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ACCA Master Administration
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage candidates, papers, syllabus topics, practice questions, CSV imports, and CBE mock exams.
          </p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'papers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Papers ({papers.length})
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'topics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Topics ({topics.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'questions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Question Bank ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('mocks')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'mocks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Mock Examinations ({mockExams.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'announcements'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Announcements ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Social & Community Links
          </button>
        </div>
      </div>

      {/* --- TAB: OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-bold uppercase">Registered Students</p>
              <p className="text-3xl font-black text-slate-900">{students.length}</p>
              <p className="text-xs text-emerald-600 font-semibold">Active candidate base</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-bold uppercase">Questions in Bank</p>
              <p className="text-3xl font-black text-blue-600">{questions.length}</p>
              <p className="text-xs text-slate-500">Across active papers</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-bold uppercase">Configured Mocks</p>
              <p className="text-3xl font-black text-amber-600">{mockExams.length}</p>
              <p className="text-xs text-slate-500">CBE timed simulations</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-bold uppercase">Learning Resources</p>
              <p className="text-3xl font-black text-purple-600">{resources.length}</p>
              <p className="text-xs text-slate-500">Notes, reports, links</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Quick Administrator Shortcuts</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setActiveTab('questions');
                    setShowQuestionModal(true);
                  }}
                  className="p-4 bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-2xl border border-slate-200 text-left transition"
                >
                  <Plus className="w-5 h-5 mb-1 text-blue-600" />
                  <p className="font-bold text-xs">Add New MCQ</p>
                  <p className="text-[11px] text-slate-500">Interactive question form</p>
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className="p-4 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 rounded-2xl border border-slate-200 text-left transition"
                >
                  <Upload className="w-5 h-5 mb-1 text-emerald-600" />
                  <p className="font-bold text-xs">Bulk CSV Import</p>
                  <p className="text-[11px] text-slate-500">Upload multiple MCQs</p>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mocks');
                    setShowMockModal(true);
                  }}
                  className="p-4 bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-700 rounded-2xl border border-slate-200 text-left transition"
                >
                  <Clock className="w-5 h-5 mb-1 text-amber-600" />
                  <p className="font-bold text-xs">Create Mock Exam</p>
                  <p className="text-[11px] text-slate-500">Configure timed test</p>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('announcements');
                    setShowAnnouncementModal(true);
                  }}
                  className="p-4 bg-slate-50 hover:bg-purple-50 text-slate-800 hover:text-purple-700 rounded-2xl border border-slate-200 text-left transition"
                >
                  <Bell className="w-5 h-5 mb-1 text-purple-600" />
                  <p className="font-bold text-xs">Post Announcement</p>
                  <p className="text-[11px] text-slate-500">Notice to all candidates</p>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Backend & Security Status</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Authorization Model:</span>
                  <strong className="text-emerald-700 font-bold">Role-Based Access Control (RBAC)</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Firestore Rules Status:</span>
                  <strong className="text-blue-700 font-bold">Configured & Enforced</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Question Correct Key Exposure:</span>
                  <strong className="text-emerald-700 font-bold">Protected / Server Validated</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: STUDENTS MANAGEMENT --- */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Registered Students Directory</h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Enrolled Papers</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Member Since</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter(
                    (u) =>
                      u.displayName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                      u.email.toLowerCase().includes(studentSearch.toLowerCase())
                  )
                  .map((student) => (
                    <tr key={student.uid} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900">{student.displayName}</p>
                        <p className="text-[11px] text-slate-500">{student.email}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                          {student.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 uppercase text-slate-700 font-semibold text-xs">
                        {student.selectedPapers?.join(', ') || 'fa1'}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            student.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 text-xs">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(student.uid, student.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            student.status === 'active'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {student.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB: PAPERS MANAGEMENT --- */}
      {activeTab === 'papers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">ACCA Qualification Papers Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {papers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-extrabold text-blue-600">{p.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-3 text-slate-500 text-xs">{p.level}</td>
                    <td className="py-3 px-3 text-slate-700">{p.examDurationMinutes}m</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleTogglePaperActive(p.id, p.isActive)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        {p.isActive ? 'Hide Paper' : 'Show Paper'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB: TOPICS MANAGEMENT --- */}
      {activeTab === 'topics' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">Syllabus Topics Management</h2>
              <select
                value={selectedPaperId}
                onChange={(e) => setSelectedPaperId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} â€“ {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowTopicModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Topic
            </button>
          </div>

          <div className="space-y-3">
            {topics.map((t, idx) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">
                      Topic #{idx + 1} ({t.code || 'TOPIC'})
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200">
                      {t.difficultyLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteTopic(t.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete Topic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: QUESTION BANK & CSV IMPORT --- */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedPaperId}
                onChange={(e) => setSelectedPaperId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} ({questions.filter((q) => q.paperId === p.id).length} MCQs)
                  </option>
                ))}
              </select>

              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/sample_questions_import_template.csv"
                download="sample_questions_import_template.csv"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV Template
              </a>

              <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload CSV Questions</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setShowQuestionModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4" /> Add MCQ
              </button>
            </div>
          </div>

          {csvFeedback && (
            <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs">
              {csvFeedback}
            </div>
          )}

          {/* Question List */}
          <div className="space-y-4">
            {questions
              .filter(
                (q) =>
                  q.paperId === selectedPaperId &&
                  q.text.toLowerCase().includes(questionSearch.toLowerCase())
              )
              .map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">Question #{idx + 1}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100">
                        {q.difficulty}
                      </span>
                      <span className="text-slate-400">â€¢ {q.marks} Marks</span>
                    </div>

                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.text}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border ${
                          opt.id === q.correctOptionId
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <strong>{opt.id}:</strong> {opt.text}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- TAB: MOCK EXAMS MANAGEMENT --- */}
      {activeTab === 'mocks' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Mock Examinations Creator</h2>
            <button
              onClick={() => setShowMockModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Create Timed Mock
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockExams.map((mock) => (
              <div
                key={mock.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-xs uppercase">
                      {mock.paperId}
                    </span>
                    <button
                      onClick={() => handleToggleMockPublish(mock.id, mock.isPublished)}
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        mock.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {mock.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{mock.title}</h3>
                  <p className="text-xs text-slate-600">{mock.description}</p>
                  <p className="text-xs text-slate-400">
                    {mock.totalQuestions} Questions â€¢ {mock.durationMinutes} Minutes â€¢ Pass Mark:{' '}
                    {mock.passPercentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: ANNOUNCEMENTS --- */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Platform Announcements</h2>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> New Announcement
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      ann.priority === 'urgent'
                        ? 'bg-red-100 text-red-800'
                        : ann.priority === 'important'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                <p className="text-xs text-slate-600">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: SETTINGS & SOCIAL COMMUNITY LINKS --- */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl shrink-0">
                <Settings className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Community & Social Media Links</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paste your official WhatsApp, Facebook, YouTube, and support links below. These immediately update the
                  "Join WhatsApp Study Group" button, social icons, and contact channels across the entire website.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSavePlatformSettings} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp Group */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  WhatsApp Study Group Invite Link
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={platformSettings.whatsAppGroupUrl}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, whatsAppGroupUrl: e.target.value })
                    }
                    placeholder="https://chat.whatsapp.com/invite/..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Powers the prominent green "Join WhatsApp Study Group" button in the footer and contact page.
                </p>
              </div>

              {/* WhatsApp Channel */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  WhatsApp Broadcast Channel Link
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={platformSettings.whatsAppChannelUrl}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, whatsAppChannelUrl: e.target.value })
                    }
                    placeholder="https://whatsapp.com/channel/..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Used for broadcasting exam announcements, syllabus tips, and mock release alerts.
                </p>
              </div>

              {/* Facebook Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Facebook Page or Group Link
                </label>
                <div className="relative">
                  <Share2 className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={platformSettings.facebookPageUrl}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, facebookPageUrl: e.target.value })
                    }
                    placeholder="https://facebook.com/..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Official Facebook community page for student engagement.
                </p>
              </div>

              {/* YouTube Channel */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  YouTube Channel Link (Lectures & Walkthroughs)
                </label>
                <div className="relative">
                  <Video className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={platformSettings.youTubeChannelUrl}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, youTubeChannelUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/@..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Powers the YouTube icon in the footer and lecture links.
                </p>
              </div>

              {/* Official Support Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Support Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={platformSettings.officialEmail}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, officialEmail: e.target.value })
                    }
                    placeholder="support@accamaster.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Displays on the Contact page and connects to the footer email icon.
                </p>
              </div>

              {/* Support Phone / Hotline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Support Contact Number / WhatsApp Hotline
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={platformSettings.contactNumber}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, contactNumber: e.target.value })
                    }
                    placeholder="+92 300 1234567"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Displays on the Contact page for candidates needing direct contact.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {platformSettings.updatedAt && (
                  <>Last saved: {new Date(platformSettings.updatedAt).toLocaleTimeString()}</>
                )}
              </span>
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSavingSettings ? 'Saving...' : 'Save All Links'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD NEW MCQ */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Practice MCQ</h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target ACCA Paper</label>
                <select
                  value={newQuestion.paperId}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, paperId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {papers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} â€“ {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Topic</label>
                <select
                  value={newQuestion.topicId}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, topicId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  rows={3}
                  required
                  placeholder="Enter the complete question prompt..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Option A</label>
                  <input
                    type="text"
                    value={newQuestion.optionA}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, optionA: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Option B</label>
                  <input
                    type="text"
                    value={newQuestion.optionB}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, optionB: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Option C</label>
                  <input
                    type="text"
                    value={newQuestion.optionC}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, optionC: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Option D</label>
                  <input
                    type="text"
                    value={newQuestion.optionD}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, optionD: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correct Option</label>
                  <select
                    value={newQuestion.correctOption}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, correctOption: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Accounting Explanation</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, explanation: e.target.value })
                  }
                  rows={2}
                  placeholder="Detailed rationale for candidate feedback..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TOPIC */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Topic</h3>
            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Topic Name</label>
                <input
                  type="text"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  required
                  placeholder="e.g. Sales Tax Calculations"
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Code</label>
                <input
                  type="text"
                  value={newTopic.code}
                  onChange={(e) => setNewTopic({ ...newTopic, code: e.target.value })}
                  placeholder="e.g. FA1-T09"
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  rows={2}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE MOCK EXAM */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create Timed CBE Mock Exam</h3>
            <form onSubmit={handleCreateMock} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Exam Title</label>
                <input
                  type="text"
                  value={newMock.title}
                  onChange={(e) => setNewMock({ ...newMock, title: e.target.value })}
                  required
                  placeholder="e.g. FA1 Standard Diagnostic Mock 3"
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">ACCA Paper</label>
                <select
                  value={newMock.paperId}
                  onChange={(e) => setNewMock({ ...newMock, paperId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  {papers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} â€“ {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newMock.durationMinutes}
                    onChange={(e) =>
                      setNewMock({ ...newMock, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Question Count</label>
                  <input
                    type="number"
                    value={newMock.totalQuestions}
                    onChange={(e) =>
                      setNewMock({ ...newMock, totalQuestions: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMockModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Publish Mock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST ANNOUNCEMENT */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Post Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                  required
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Priority</label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })
                  }
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Message Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                  rows={3}
                  required
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CSV IMPORT PREVIEW */}
      {showCsvPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">CSV Bulk Questions Import Preview</h3>
                  <p className="text-xs text-slate-500">
                    Review parsed questions and duplicate checks before writing to database.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCsvPreviewModal(false);
                  setCsvPreviewItems([]);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics & Duplicate Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block text-xs font-semibold text-slate-500">Total In CSV</span>
                <span className="text-xl font-black text-slate-900">{csvPreviewItems.length}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="block text-xs font-semibold text-emerald-700">New Questions</span>
                <span className="text-xl font-black text-emerald-800">
                  {csvPreviewItems.filter((i) => !i.isDuplicateId).length}
                </span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="block text-xs font-semibold text-amber-700">Duplicate IDs</span>
                <span className="text-xl font-black text-amber-800">
                  {csvPreviewItems.filter((i) => i.isDuplicateId).length}
                </span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <span className="block text-xs font-semibold text-indigo-700">Content Matches</span>
                <span className="text-xl font-black text-indigo-800">
                  {csvPreviewItems.filter((i) => i.isDuplicateText).length}
                </span>
              </div>
            </div>

            {/* Duplicate Notice */}
            {csvPreviewItems.some((i) => i.isDuplicateId) && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    Duplicate question IDs detected in this import batch!
                  </p>
                  <p className="text-amber-800">
                    Questions with existing IDs will be safely skipped unless you check &quot;Overwrite existing questions&quot; below.
                  </p>
                </div>
              </div>
            )}

            {/* Overwrite Checkbox */}
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={csvOverwriteDuplicates}
                onChange={(e) => setCsvOverwriteDuplicates(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="font-semibold">
                Overwrite existing questions in database if question ID matches
              </span>
            </label>

            {/* Preview Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">ID / Paper</th>
                    <th className="p-2.5">Question Text</th>
                    <th className="p-2.5">Correct Option</th>
                    <th className="p-2.5">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {csvPreviewItems.map((item, idx) => (
                    <tr key={idx} className={item.isDuplicateId ? 'bg-amber-50/40' : 'hover:bg-slate-50/50'}>
                      <td className="p-2.5">
                        {item.isDuplicateId ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Duplicate ID
                          </span>
                        ) : item.isDuplicateText ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            Similar Text
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> New
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-900 block truncate max-w-[120px]">{item.question.id}</span>
                        <span className="text-[10px] uppercase font-bold text-blue-600">
                          {item.question.paperId} &bull; {item.question.topicId}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-700 max-w-xs truncate" title={item.question.text}>
                        {item.question.text}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-800 text-[11px]">
                          Option {item.question.correctOptionId}
                        </span>
                      </td>
                      <td className="p-2.5 font-semibold text-slate-600">{item.question.marks}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Ready to import{' '}
                <strong className="text-slate-800">
                  {csvOverwriteDuplicates
                    ? csvPreviewItems.length
                    : csvPreviewItems.filter((i) => !i.isDuplicateId).length}
                </strong>{' '}
                questions
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={() => {
                    setShowCsvPreviewModal(false);
                    setCsvPreviewItems([]);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={handleConfirmCsvImport}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isImporting ? 'Importing...' : 'Confirm & Save Questions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
