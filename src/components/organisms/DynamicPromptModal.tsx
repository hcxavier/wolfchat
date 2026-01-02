import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Terminal, Plus, Trash2, Save, Info } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';
import { Button } from '../atoms/Buttons';
import { AlertModal } from '../molecules/AlertModal';

interface DynamicPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicPromptModal = ({ isOpen, onClose }: DynamicPromptModalProps) => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [query, setQuery] = useState('');

  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<number | null>(null);

  const prompts = useLiveQuery(
    () => db.dynamicPrompts
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.command.toLowerCase().includes(query.toLowerCase()))
      .toArray(),
    [query]
  );

  useEffect(() => {
    if (isOpen) {
      setView('list');
      setQuery('');
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setCommand('');
    setContent('');
    setError('');
    setEditingId(null);
    setPromptToDelete(null);
  };

  const handleSave = async () => {
    if (!name.trim() || !command.trim() || !content.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const cleanCommand = command.trim().replace(/^\//, '').toLowerCase();

    const existing = await db.dynamicPrompts.where('command').equals(cleanCommand).first();
    
    if (existing) {
         
        if (!editingId || (editingId && existing.id !== editingId)) {
            setError(`O comando "${cleanCommand}" já existe.`);
            return;
        }
    }

    if (editingId) {
        await db.dynamicPrompts.update(editingId, {
            name: name.trim(),
            command: cleanCommand,
            content: content.trim()
        });
    } else {
        await db.dynamicPrompts.add({
            name: name.trim(),
            command: cleanCommand,
            content: content.trim(),
            createdAt: new Date()
        });
    }

    resetForm();
    setView('list');
  };

  const handleEdit = (prompt: any) => {
      setName(prompt.name);
      setCommand(prompt.command);
      setContent(prompt.content);
      setEditingId(prompt.id);
      setView('create');
  };

  const requestDelete = (id: number) => {
    setPromptToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (promptToDelete) {
        await db.dynamicPrompts.delete(promptToDelete);
        setShowDeleteModal(false);
        setPromptToDelete(null);
        if (view === 'create') {
            resetForm();
            setView('list');
        }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-surface-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative z-10 flex flex-col max-h-[85vh]"
            >
              { }
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500">
                        <Terminal size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-primary">
                        {view === 'create' ? (editingId ? 'Editar Prompt' : 'Criar Novo Prompt') : 'Prompts Dinâmicos'}
                    </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 text-primary/50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              { }
              <div className="flex-1 overflow-hidden flex flex-col">
                {view === 'list' ? (
                  <div className="flex flex-col h-full">
                     { }
                     <div className="p-4 bg-brand-500/5 border-b border-brand-500/10">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-primary/80 space-y-1">
                                <p>Crie atalhos para seus prompts mais usados. Digite <code className="bg-brand-500/20 px-1.5 py-0.5 rounded text-brand-500 font-mono">/nome-prompt</code> no chat para usar.</p>
                                <p className="text-xs opacity-70">Exemplo: Crie um prompt chamado "Revisar Código" com o comando "refatorar". No chat, digite <span className="font-mono text-brand-500">/refatorar</span>.</p>
                            </div>
                        </div>
                     </div>

                     { }
                     <div className="p-4 flex gap-3 border-b border-white/5 bg-white/5">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-brand-500 transition-colors" />
                            <input
                              type="text"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Buscar prompts..."
                              className="w-full pl-9 pr-4 py-2.5 bg-surface-input/50 hover:bg-surface-input border border-primary/10 rounded-xl focus:border-brand-500/50 focus:bg-surface-main focus:ring-1 focus:ring-brand-500/20 transition-all outline-none text-sm text-primary placeholder:text-primary/40 shadow-sm"
                            />
                        </div>
                        <Button 
                            onClick={() => {
                                resetForm();
                                setView('create');
                            }}
                            variant="solid" 
                            className="bg-brand-500 hover:bg-brand-600 text-white min-w-[fit-content] whitespace-nowrap px-6 py-2.5 h-auto text-sm"
                        >
                            <Plus size={16} className="mr-2" />
                            Criar Novo
                        </Button>
                     </div>

                     { }
                     <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {prompts?.length === 0 ? (
                             <div className="flex flex-col items-center justify-center h-40 text-primary/30">
                                <Terminal size={40} className="mb-3 opacity-20" />
                                <p>Nenhum prompt encontrado</p>
                             </div>
                        ) : (
                            <div className="space-y-2">
                                {prompts?.map(prompt => (
                                    <div 
                                        key={prompt.id} 
                                        onClick={() => handleEdit(prompt)}
                                        className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 transition-all flex items-center justify-between gap-4 cursor-pointer"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium text-primary truncate">{prompt.name}</h3>
                                                <span className="px-2 py-0.5 rounded text-xs font-mono bg-brand-500/20 text-brand-500">/{prompt.command}</span>
                                            </div>
                                            <p className="text-xs text-primary/50 truncate font-mono">{prompt.content}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prompt.id && requestDelete(prompt.id);
                                            }}
                                            className="p-2 rounded-lg text-primary/40 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Excluir prompt"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-200">
                    <div className="flex-1 space-y-5 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Nome do Prompt</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Ex: Revisor de Código"
                              className="w-full px-4 py-3 bg-surface-input/50 hover:bg-surface-input border border-primary/10 rounded-xl focus:border-brand-500/50 focus:bg-surface-main focus:ring-1 focus:ring-brand-500/20 transition-all outline-none text-sm text-primary placeholder:text-primary/40 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Comando de Ativação</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 dark:bg-white/10 text-primary px-2 py-0.5 rounded-md text-sm font-mono font-bold select-none z-20 flex items-center justify-center pointer-events-none border border-primary/5 shadow-sm">/</div>
                                <input
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                                placeholder="refatorar"
                                className="w-full mt-1 pl-12 pr-4 py-3 bg-surface-input/50 hover:bg-surface-input border border-primary/10 rounded-xl focus:border-brand-500/50 focus:bg-surface-main focus:ring-1 focus:ring-brand-500/20 transition-all outline-none text-sm text-primary font-mono placeholder:text-primary/40 shadow-sm"
                                />
                            </div>
                            <p className="text-xs text-primary/40">Use apenas letras, números e hífens. Sem espaços.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Conteúdo do Prompt</label>
                            <textarea
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              placeholder="Digite o prompt que será inserido quando você usar o comando..."
                              className="w-full h-40 px-4 py-3 bg-surface-input/50 hover:bg-surface-input border border-primary/10 rounded-xl focus:border-brand-500/50 focus:bg-surface-main focus:ring-1 focus:ring-brand-500/20 transition-all outline-none text-sm text-primary resize-none placeholder:text-primary/40 shadow-sm"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 shrink-0 bg-surface-card z-10 w-full">
                        <div>
                         {editingId && (
                             <Button
                                onClick={() => requestDelete(editingId)}
                                variant="ghost"
                                className="text-red-400 hover:bg-red-500/10 hover:text-red-500 px-4 py-2.5 h-auto text-sm"
                             >
                                 <Trash2 size={16} className="mr-2" />
                                 Excluir
                             </Button>
                         )}
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                onClick={() => {
                                    resetForm();
                                    setView('list');
                                }} 
                                variant="ghost"
                                className="px-6 py-2.5 h-auto text-sm"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleSave} 
                                variant="solid"
                                className="bg-brand-500 hover:bg-brand-600 whitespace-nowrap px-6 py-2.5 h-auto text-sm"
                            >
                                <Save size={16} className="mr-2" />
                                {editingId ? 'Salvar Alterações' : 'Criar Prompt'}
                            </Button>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <AlertModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            type="warning"
            title="Excluir Prompt"
            message="Tem certeza que deseja excluir este prompt? Esta ação não pode ser desfeita."
            confirmText="Excluir"
            cancelText="Cancelar"
            showCancel
          />
        </>
      )}
    </AnimatePresence>
  );
};
