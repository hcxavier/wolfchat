import { X, Plus, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { WolfLogo } from '../atoms/WolfLogo';
import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import type { ChatSession } from '../../types/chat';
import { useUserSettings, useSettingsModal } from '../../hooks/useSettings';
import { ChatItem } from '../molecules/ChatItem';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  chatHistory: ChatSession[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chat: ChatSession) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;

}

export const Sidebar = memo(({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  chatHistory, 
  currentChatId, 
  onNewChat, 
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}: SidebarProps) => {
  const { userName } = useUserSettings();
  const { setShowSettings } = useSettingsModal();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsCollapsed(!isSidebarOpen);
    } else {
      setIsCollapsed(false);
    }
  }, [isSidebarOpen, isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartEdit = useCallback((chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
    setMenuOpenId(null);
  }, []);

  const handleDelete = useCallback((chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      onDeleteChat(chatId);
    }
    setMenuOpenId(null);
  }, [onDeleteChat]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, chatId: string) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      if (editingTitle.trim()) {
        onRenameChat(chatId, editingTitle.trim());
        setEditingChatId(null);
      }
    }
    if (e.key === 'Escape') {
      setEditingChatId(null);
    }
  }, [editingTitle, onRenameChat]);

  const toggleMenu = useCallback((chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(prev => prev === chatId ? null : chatId);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, [setShowSettings]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  }, []);

  const sidebarWidth = useMemo(() => 
    isMobile ? "280px" : (isCollapsed ? "85px" : "270px"),
    [isMobile, isCollapsed]
  );

  const mobileTransform = useMemo(() => 
    isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0",
    [isMobile, isSidebarOpen]
  );

  const headerOpacityClass = useMemo(() => 
    `flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`,
    [isCollapsed]
  );

  const toggleButtonClass = useMemo(() => 
    `hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-500 text-white transition-all absolute top-1/2 -translate-y-1/2 ${isCollapsed ? "right-1/2 translate-x-1/2" : "right-5"}`,
    [isCollapsed]
  );

  const newChatButtonClass = useMemo(() => 
    `w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all duration-300 ${isCollapsed ? "px-0" : ""}`,
    [isCollapsed]
  );

  const sidebarStyle = useMemo(() => ({ width: sidebarWidth }), [sidebarWidth]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden ${
          isMobile && isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseSidebar}
      />

      <aside
        className={`fixed inset-y-0 left-0 lg:left-auto lg:inset-y-auto lg:relative z-40 transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-surface-card lg:m-4 lg:rounded-2xl lg:shadow-2xl overflow-hidden flex flex-col lg:h-[calc(100vh-32px)] border-r border-white/5 ${mobileTransform}`}
        style={sidebarStyle}
      >
      <div className="flex items-center justify-between p-4 lg:p-5 relative min-h-[60px] lg:min-h-[80px]">
        <div className={headerOpacityClass}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30 flex-shrink-0 overflow-hidden p-1.5">
            <WolfLogo className="w-full h-full text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white leading-none">WolfChat</h1>
            <span className="text-xs font-semibold text-brand-500 tracking-wider">PRO</span>
          </div>
        </div>

        <button className={toggleButtonClass} onClick={handleToggleSidebar}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <button
          className="lg:hidden absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          onClick={handleCloseSidebar}
        >
          <X size={24} />
        </button>
      </div>

      <div className="px-4 lg:px-5 pb-4 lg:pb-6 pt-2">
        <button onClick={onNewChat} className={newChatButtonClass}>
          <Plus size={20} />
          <span className={`transition-opacity duration-300 ${isCollapsed ? "hidden" : "block"}`}>Novo Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-surface-hover scrollbar-track-transparent">
        <div className={`px-4 py-2 text-xs font-bold text-white/30 uppercase tracking-wider mb-2 ${isCollapsed ? "hidden" : ""}`}>
          Recentes
        </div>
        
        <div className="space-y-1">
          {chatHistory.length === 0 ? (
            <div className={`px-4 py-4 text-center text-xs text-white/30 italic ${isCollapsed ? "hidden" : ""}`}>
              Nenhum chat recente
            </div>
          ) : chatHistory.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={currentChatId === chat.id}
              isCollapsed={isCollapsed}
              isEditing={editingChatId === chat.id}
              editingTitle={editingTitle}
              menuOpenId={menuOpenId}
              menuRef={menuRef}
              onSelect={onSelectChat}
              onStartEdit={handleStartEdit}
              onTitleChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              onToggleMenu={toggleMenu}
              onDelete={handleDelete}
              className="text-sm leading-relaxed"
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 mt-auto">
        <div className={`flex items-center gap-3 ${isCollapsed ? "flex-col" : ""}`}>
          <div className={`flex items-center gap-3 flex-1 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0">
              <User size={18} />
            </div>
            <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${isCollapsed ? "hidden" : "block"}`}>
              <div className="text-sm font-semibold text-white">{userName}</div>
            </div>
          </div>
          <button 
            onClick={handleOpenSettings}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-brand-500 transition-all duration-300 ${isCollapsed ? "" : "shrink-0"}`}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
      </aside>
    </>
  );
});