import { useState } from 'react';
import { X, ArrowLeft, Trash2, Plus } from 'lucide-react';
import { Button } from '../atoms/Buttons';
import { useModelSettings } from '../../hooks/useSettings';

interface ModelsModalProps {
    onClose: () => void;
}

export const ModelsModal = ({ onClose }: ModelsModalProps) => {
    const { customModels, addCustomModel, removeCustomModel } = useModelSettings();
    const [provider, setProvider] = useState('groq');
    const [name, setName] = useState('');
    const [modelId, setModelId] = useState('');

    const handleAdd = () => {
        if (!name || !modelId) return;
        const fullId = `${provider}/${modelId}`;
        addCustomModel({
            id: fullId,
            name,
            provider
        });
        setName('');
        setModelId('');
    };

    const providers = [
        { id: 'groq', name: 'Groq' },
        { id: 'openrouter', name: 'OpenRouter' },
        { id: 'gemini', name: 'Gemini' }
    ];

    return (
        <div className="absolute inset-0 z-20 bg-surface-card animate-in slide-in-from-right duration-200 flex flex-col text-primary">

             <div className="flex items-center justify-between px-6 py-5 border-b border-primary/5 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={onClose}
                    className="text-primary/50 hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-lg font-bold text-primary">Gerenciar Modelos</h2>
                </div>
                <button onClick={onClose} className="text-primary/50 hover:text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">

                  <div className="space-y-4 p-4 bg-surface-main/30 rounded-xl border border-primary/5">
                      <h3 className="text-sm font-bold text-primary/80">Adicionar Modelo</h3>
                      <div className="grid grid-cols-1 gap-3">
                          <div>
                              <label className="text-xs font-medium text-primary/60 mb-1 block">Provedor</label>
                              <select 
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                className="w-full bg-surface-main/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-primary focus:border-brand-500 outline-none appearance-none cursor-pointer"
                              >
                                  {providers.map(p => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                              </select>
                          </div>
                           <div>
                              <label className="text-xs font-medium text-primary/60 mb-1 block">Nome do Modelo (Ex: Llama 3)</label>
                              <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-main/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-primary focus:border-brand-500 outline-none placeholder-primary/20"
                                placeholder="Nome amigável"
                              />
                          </div>
                           <div>
                              <label className="text-xs font-medium text-primary/60 mb-1 block">ID do Modelo</label>
                              <input 
                                value={modelId}
                                onChange={(e) => setModelId(e.target.value)}
                                className="w-full bg-surface-main/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-primary focus:border-brand-500 outline-none font-mono placeholder-primary/20"
                                placeholder="ex: llama3-70b-8192"
                              />
                          </div>
                          <Button onClick={handleAdd} disabled={!name || !modelId} className="w-full py-2 mt-2 justify-center">
                              <Plus size={16} className="mr-2" />
                              Adicionar
                          </Button>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <h3 className="text-sm font-bold text-primary/80">Meus Modelos</h3>
                      {customModels.length === 0 ? (
                          <p className="text-sm text-primary/40 italic text-center py-4">Nenhum modelo customizado adicionado.</p>
                      ) : (
                          <div className="space-y-2">
                              {customModels.map((model) => (
                                  <div key={model.id} className="flex items-center justify-between p-3 bg-surface-main/20 rounded-lg border border-primary/5 group hover:border-brand-500/30 transition-all">
                                      <div className="min-w-0 pr-3">
                                          <div className="text-sm font-medium text-primary truncate">{model.name}</div>
                                          <div className="text-[10px] text-primary/40 font-mono truncate">{model.id}</div>
                                      </div>
                                      <button 
                                        onClick={() => removeCustomModel(model.id)}
                                        className="p-2 text-primary/30 hover:text-red-500 transition-colors shrink-0"
                                        title="Remover modelo"
                                      >
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>

              </div>

               <div className="flex justify-end px-6 py-4 border-t border-primary/5 bg-primary/5 shrink-0">
                  <Button onClick={onClose} variant="solid" className="px-6 py-2 h-auto text-xs md:text-sm">
                    Concluído
                  </Button>
               </div>
        </div>
    );
};
