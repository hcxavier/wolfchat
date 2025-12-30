import type { ChatSession } from '../../types/chat';
import { MessageSquare, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

interface ChatItemProps {
  chat: ChatSession;
  isActive: boolean;
  isCollapsed: boolean;
  isEditing: boolean;
  editingTitle: string;
  menuOpenId: string | null;
  menuRef: React.RefObject<HTMLDivElement>;
  onSelect: (chat: ChatSession) => void;
  onStartEdit: (chat: ChatSession, e: React.MouseEvent) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent, chatId: string) => void;
  onToggleMenu: (chatId: string, e: React.MouseEvent) => void;
  onDelete: (chatId: string, e: React.MouseEvent) => void;
  className?: string;
}

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export const ChatItem = memo(({
  chat,
  isActive,
  isCollapsed,
  isEditing,
  editingTitle,
  menuOpenId,
  menuRef,
  onSelect,
  onStartEdit,
  onTitleChange,
  onKeyDown,
  onToggleMenu,
  onDelete,
  className = ''
}: ChatItemProps) => {
  const handleSelect = useCallback(() => onSelect(chat), [onSelect, chat]);
  const handleStartEdit = useCallback((e: React.MouseEvent) => onStartEdit(chat, e), [onStartEdit, chat]);
  const handleKeyDownCallback = useCallback((e: React.KeyboardEvent) => onKeyDown(e, chat.id), [onKeyDown, chat.id]);
  const handleToggleMenu = useCallback((e: React.MouseEvent) => onToggleMenu(chat.id, e), [onToggleMenu, chat.id]);
  const handleDelete = useCallback((e: React.MouseEvent) => onDelete(chat.id, e), [onDelete, chat.id]);

  const containerClass = useMemo(() => 
    `relative group w-full flex items-center gap-3 px-4 py-3 lg:py-3 rounded-lg lg:rounded-xl transition-colors duration-200 cursor-pointer ${isActive ? "bg-primary/10 text-primary" : "text-primary/60 lg:hover:bg-primary/5 lg:hover:text-primary"} ${isCollapsed ? "justify-center px-0" : ""} ${menuOpenId === chat.id ? "z-50" : ""} ${className}`,
    [isActive, isCollapsed, menuOpenId, chat.id, className]
  );

  const menuButtonClass = useMemo(() => 
    `flex items-center gap-1 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 ml-2 ${menuOpenId === chat.id ? "opacity-100" : "opacity-100 pointer-events-auto lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto"} transition-opacity duration-150`,
    [menuOpenId, chat.id]
  );

  const menuToggleClass = useMemo(() => 
    `p-2 lg:p-1 rounded-lg transition-colors ${menuOpenId === chat.id ? "bg-primary/10 text-primary" : "lg:hover:bg-primary/10 text-primary/60 lg:hover:text-primary"}`,
    [menuOpenId, chat.id]
  );

  return (
    <div
      className={containerClass}
      onClick={handleSelect}
      title={isCollapsed ? chat.title : undefined}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-r-full" />
      )}
      <MessageSquare size={18} className={`flex-shrink-0 ${isActive ? "text-brand-500" : "text-current"}`} />
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0 flex items-center justify-between group/item relative">
          {isEditing ? (
            <div className="flex items-center gap-1 w-full" onClick={stopPropagation}>
              <input
                autoFocus
                type="text"
                value={editingTitle}
                onChange={onTitleChange}
                onKeyDown={handleKeyDownCallback}
                onClick={stopPropagation}
                className="flex-1 bg-surface-main/80 text-primary text-xs rounded px-2 py-1 outline-none border border-brand-500/50"
              />
            </div>
          ) : (
            <>
              <span className="truncate lg:pr-6 block">{chat.title}</span>
              <div className={menuButtonClass}>
                <button onClick={handleToggleMenu} className={menuToggleClass}>
                  <MoreHorizontal size={16} />
                </button>

                {menuOpenId === chat.id && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 top-full mt-1 z-[100] w-32 bg-surface-card border border-primary/20 rounded-xl shadow-2xl overflow-hidden isolate pointer-events-auto"
                    onClick={stopPropagation}
                    onMouseDown={stopPropagation}
                    onMouseUp={stopPropagation}
                  >
                    <button
                      onClick={handleStartEdit}
                      className="w-full text-left px-4 py-3 lg:py-2.5 text-sm lg:text-xs text-primary/90 hover:bg-brand-500/20 hover:text-primary flex items-center gap-2 transition-colors"
                    >
                      <Pencil size={14} className="lg:w-3 lg:h-3" /> Renomear
                    </button>
                      <button
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-3 lg:py-2.5 text-sm lg:text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 size={14} className="lg:w-3 lg:h-3" /> Excluir
                      </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});
