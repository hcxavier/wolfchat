import { useState } from 'react';
import { X, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '../atoms/Buttons';
import { useSettingsModal, useApiKeys, useModelSettings, useUserSettings, useSettingsActions } from '../../hooks/useSettings';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsModalProps {
  onClearAllChats: () => void;
}

export const SettingsModal = ({ onClearAllChats }: SettingsModalProps) => {
  const { showSettings, setShowSettings } = useSettingsModal();
  const { openRouterApiKey, setOpenRouterApiKey, groqApiKey, setGroqApiKey, geminiApiKey, setGeminiApiKey } = useApiKeys();
  const { selectedLanguage, setSelectedLanguage } = useModelSettings();
  const { userName, setUserName } = useUserSettings();
  const { saveSettings } = useSettingsActions();
  const { theme, setTheme } = useTheme();
  const [showApiKeys, setShowApiKeys] = useState(false);

  if (!showSettings) return null;

  const languages = [
    { value: 'default', label: 'Manter idioma original' },
    { value: 'Português', label: 'Português' },
    { value: 'English', label: 'English' },
    { value: 'Español', label: 'Español' },
    { value: 'Français', label: 'Français' },
    { value: 'Deutsch', label: 'Deutsch' },
    { value: 'Italiano', label: 'Italiano' },
    { value: '中文', label: '中文' },
    { value: '日本語', label: '日本語' },
    { value: '한국어', label: '한국어' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-card border border-primary/10 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 text-primary">
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/5">
          <h2 className="text-lg font-bold text-primary">Configurações</h2>
          <button onClick={() => setShowSettings(false)} className="text-primary/50 hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary/80">Tema</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === 'light' 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'bg-surface-main/50 text-primary/70 hover:bg-surface-main hover:text-primary'
                }`}
              >
                Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'bg-surface-main/50 text-primary/70 hover:bg-surface-main hover:text-primary'
                }`}
              >
                Escuro
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === 'system' 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'bg-surface-main/50 text-primary/70 hover:bg-surface-main hover:text-primary'
                }`}
              >
                Sistema
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary/80">Nome do Usuário</label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-surface-main/50 border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-primary/20"
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setShowApiKeys(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-surface-main/50 border border-primary/10 rounded-xl hover:bg-surface-main transition-all text-left group"
            >
              <span className="text-sm font-medium text-primary/80">Configurar API Keys</span>
              <span className="text-primary/50 group-hover:text-primary transition-colors">
                <ChevronRight size={16} />
              </span>
            </button>
          </div>


          {showApiKeys && (
             <div className="absolute inset-0 z-20 bg-surface-card animate-in slide-in-from-right duration-200 flex flex-col text-primary">
              <div className="flex items-center justify-between px-6 py-5 border-b border-primary/5 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowApiKeys(false)}
                    className="text-primary/50 hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-lg font-bold text-primary">API Keys</h2>
                </div>
                <button onClick={() => setShowApiKeys(false)} className="text-primary/50 hover:text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/80">OpenRouter API Key</label>
                  <input 
                    type="password"
                    value={openRouterApiKey}
                    onChange={(e) => setOpenRouterApiKey(e.target.value)}
                    className="w-full bg-surface-main/50 border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-primary/20"
                    placeholder="sk-or-..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/80">Groq API Key</label>
                  <input 
                    type="password"
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    className="w-full bg-surface-main/50 border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-primary/20"
                    placeholder="gsk_..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/80">Gemini API Key</label>
                  <input 
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full bg-surface-main/50 border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-primary/20"
                    placeholder="AIza..."
                  />
                  <p className="text-xs text-primary/40">Suas chaves são armazenadas localmente.</p>
                </div>
              </div>

               <div className="flex justify-end px-6 py-4 border-t border-primary/5 bg-primary/5 shrink-0">
                  <Button onClick={() => setShowApiKeys(false)} variant="solid" className="px-6 py-2 h-auto text-xs md:text-sm">
                    Concluído
                  </Button>
               </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary/80">Idioma da Resposta</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-surface-main/50 border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all appearance-none pr-8 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-primary/10">
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir todos os chats? Esta ação não pode ser desfeita.')) {
                  onClearAllChats();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 border border-red-500/30 hover:bg-red-500/10 hover:text-red-600 transition-all"
            >
              <Trash2 size={16} />
              Excluir todos os chats
            </button>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-primary/5 bg-primary/5">
          <Button onClick={saveSettings} variant="solid" className="px-6 py-2 h-auto text-xs md:text-sm">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};