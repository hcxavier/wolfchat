import { X, Trash2 } from 'lucide-react';
import { Button } from '../atoms/Buttons';
import { useSettingsModal, useApiKeys, useModelSettings, useUserSettings, useSettingsActions } from '../../hooks/useSettings';

interface SettingsModalProps {
  onClearAllChats: () => void;
}

export const SettingsModal = ({ onClearAllChats }: SettingsModalProps) => {
  const { showSettings, setShowSettings } = useSettingsModal();
  const { openRouterApiKey, setOpenRouterApiKey, groqApiKey, setGroqApiKey, geminiApiKey, setGeminiApiKey } = useApiKeys();
  const { selectedLanguage, setSelectedLanguage } = useModelSettings();
  const { userName, setUserName } = useUserSettings();
  const { saveSettings } = useSettingsActions();

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
      <div className="w-full max-w-md bg-surface-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Configurações</h2>
          <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Nome do Usuário</label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-surface-main/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-white/20"
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">OpenRouter API Key</label>
            <input 
              type="password"
              value={openRouterApiKey}
              onChange={(e) => setOpenRouterApiKey(e.target.value)}
              className="w-full bg-surface-main/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-white/20"
              placeholder="sk-or-..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Groq API Key</label>
            <input 
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              className="w-full bg-surface-main/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-500 outline-none transition-all placeholder-white/20"
              placeholder="gsk_..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Gemini API Key</label>
            <input 
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full bg-surface-main/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-500 outline-none transition-all placeholder-white/20"
              placeholder="AIza..."
            />
            <p className="text-xs text-white/40">Suas chaves são armazenadas localmente.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Idioma da Resposta</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-surface-main/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all appearance-none pr-8 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir todos os chats? Esta ação não pode ser desfeita.')) {
                  onClearAllChats();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <Trash2 size={16} />
              Excluir todos os chats
            </button>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-white/5 bg-white/5">
          <Button onClick={saveSettings} variant="solid" className="px-6 py-2 h-auto text-xs md:text-sm">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};