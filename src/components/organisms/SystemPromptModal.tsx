import { X, ArrowLeft, Info } from 'lucide-react';
import { Button } from '../atoms/Buttons';
import { useUserSettings } from '../../hooks/useSettings';

interface SystemPromptModalProps {
    onClose: () => void;
}

export const SystemPromptModal = ({ onClose }: SystemPromptModalProps) => {
    const { systemPrompt, setSystemPrompt } = useUserSettings();

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
                  <h2 className="text-lg font-bold text-primary">Personalização</h2>
                </div>
                <button onClick={onClose} className="text-primary/50 hover:text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  
                  <div className="space-y-4">
                      <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 flex gap-3">
                          <Info className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                          <div className="text-sm text-primary/80 space-y-2">
                              <p>Personalize como a IA deve se comportar. Suas instruções serão adicionadas ao prompt principal do sistema.</p>
                              <p className="font-medium text-brand-500">Nota: Você não pode alterar as instruções base de segurança e formatação, apenas adicionar novas diretrizes.</p>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-medium text-primary/80">System Prompt Personalizado</label>
                          <textarea 
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="w-full h-64 bg-surface-main/50 border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-primary/20 resize-none leading-relaxed"
                            placeholder="Ex: Atue como um especialista em desenvolvimento web sênior. Priorize soluções performáticas e código limpo. Explique conceitos complexos com analogias simples."
                          />
                           <p className="text-xs text-primary/40 text-right">
                              {systemPrompt.length} caracteres
                           </p>
                      </div>
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
